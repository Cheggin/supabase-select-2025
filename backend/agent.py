# Email Restyling Backend - Complete Flow with Style History
# pip install fastapi uvicorn supabase anthropic resend python-dotenv

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from anthropic import Anthropic
from resend import Resend
import httpx

load_dotenv()

app = FastAPI()

# Initialize clients
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
resend_client = Resend(api_key=os.getenv("RESEND_API_KEY"))

# ==================== MODELS ====================

class CreateStyleRequest(BaseModel):
    user_prompt: str

class WebhookEvent(BaseModel):
    """Webhook event from Resend for email.received"""
    type: str
    data: dict

class InboundEmail(BaseModel):
    """Full inbound email from Resend API"""
    from_: str
    to: list[str]
    subject: Optional[str] = None
    html: Optional[str] = None
    text: Optional[str] = None
    
    class Config:
        populate_by_name = True
        fields = {'from_': {'alias': 'from'}}

# ==================== ENDPOINT 1: CREATE STYLING ====================

@app.post("/create-style")
async def create_style(request: CreateStyleRequest):
    """
    Takes user's natural language prompt and generates styling JSON config
    Stores in Supabase with history - marks new style as active
    """
    try:
        print(f"Creating style from prompt: {request.user_prompt}")
        
        # Use LLM to generate style_config from user prompt
        style_config = generate_style_config_from_prompt(request.user_prompt)
        
        # Deactivate all existing styles
        supabase.table("email_styles")\
            .update({"active": False})\
            .eq("active", True)\
            .execute()
        
        # Insert new style as active
        result = supabase.table("email_styles").insert({
            "user_prompt": request.user_prompt,
            "styling_json": style_config,
            "active": True
        }).execute()
        
        return {
            "success": True,
            "message": "Style created successfully",
            "style_id": result.data[0]["id"],
            "styling_json": style_config
        }
        
    except Exception as e:
        print(f"Error creating style: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def generate_style_config_from_prompt(user_prompt: str) -> dict:
    """
    Use Claude to convert user's natural language into structured style JSON
    """
    
    system_prompt = """You are an email styling configuration generator.

Convert the user's styling preferences into a JSON configuration for HTML emails.

The JSON should include styling for these elements (only include ones relevant to the user's request):
- container: max_width, padding, background_color, font_family
- headings: h1, h2, h3 with font_size, color, font_weight, margin
- paragraph: font_size, color, line_height, margin
- links: color, text_decoration, font_weight
- table: border, width, border_collapse
- table_header: background_color, padding, font_weight, color
- table_cell: padding, border, color
- button: background_color, color, padding, border_radius, font_size
- image: max_width, margin
- footer: font_size, color, text_align

RULES:
1. Return ONLY valid JSON, no explanations
2. Use hex colors (e.g., #333333)
3. Include units for sizes (px, %, em)
4. Only use CSS properties that work in emails
5. Be comprehensive but reasonable

Return the style configuration JSON:"""

    message = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": f"{system_prompt}\n\nUser's request: {user_prompt}"
            }
        ]
    )
    
    # Clean response
    response_text = message.content[0].text.strip()
    if response_text.startswith('```'):
        response_text = response_text.split('```')[1]
        if response_text.startswith('json'):
            response_text = response_text[4:]
        response_text = response_text.strip()
    
    return json.loads(response_text)


# ==================== ENDPOINT 2: APPLY STYLING TO EMAILS ====================

@app.post("/webhook/inbound-email")
async def handle_inbound_email(event: WebhookEvent, background_tasks: BackgroundTasks):
    """
    Receives webhook from Resend when email arrives
    Note: Webhook doesn't contain full email - we fetch it via API
    """
    try:
        print(f"DEBUG: Full webhook payload: {event.dict()}")  # Debug line
        
        if event.type != "email.received":
            return {"message": "Event type not supported"}
        
        # Try different possible structures
        email_id = event.data.get("id") or event.data.get("email_id") or event.data.get("inbound_id")
        print(f"Received email.received event for ID: {email_id}")
        
        if not email_id:
            print(f"ERROR: Could not find email ID in payload: {event.data}")
            return {"message": "No email ID found"}
        
        # Process email in background
        background_tasks.add_task(process_and_send_email, email_id)
        
        return {"message": "Email received and processing"}
        
    except Exception as e:
        print(f"Error handling webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def process_and_send_email(email_id: str):
    """
    1. Fetch full email from Resend Inbound API (using direct HTTP)
    2. Get active style_config from Supabase
    3. Use LLM to apply styling to email
    4. Send styled email via Resend
    """
    try:
        # Fetch full email content from Resend Inbound API using HTTP
        headers = {
            "Authorization": f"Bearer {os.getenv('RESEND_API_KEY')}"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.resend.com/emails/inbound/{email_id}",
                headers=headers
            )
            email_data = response.json()
        
        print(f"Fetched email from: {email_data.get('from')}")
        
        # Get the active style
        result = supabase.table("email_styles")\
            .select("styling_json")\
            .eq("active", True)\
            .single()\
            .execute()
        
        if not result.data:
            print("No active style found, sending original email")
            styled_html = email_data.get("html") or email_data.get("text")
        else:
            style_config = result.data["styling_json"]
            print(f"\n{'='*60}")
            print(f"APPLYING STYLING TO EMAIL")
            print(f"{'='*60}")
            print(f"\nStyle Config JSON:")
            print(json.dumps(style_config, indent=2))
            print(f"\n{'='*60}\n")

            # Use LLM to apply styling
            original_content = email_data.get("html") or email_data.get("text")
            print(f"Original Email Content:")
            print(f"{original_content[:500]}..." if len(original_content) > 500 else original_content)
            print(f"\n{'='*60}\n")

            styled_html = apply_styling_with_llm(original_content, style_config)

            print(f"Styled Email Output:")
            print(f"{styled_html[:500]}..." if len(styled_html) > 500 else styled_html)
            print(f"\n{'='*60}\n")
        
        # Send styled email via Resend using direct HTTP
        async with httpx.AsyncClient() as client:
            send_response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {os.getenv('RESEND_API_KEY')}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev"),
                    "to": [email_data.get("from")],
                    "subject": f"Re: {email_data.get('subject')}",
                    "html": styled_html,
                }
            )
            send_result = send_response.json()
        
        print(f"✅ Styled email sent successfully! ID: {send_result.get('id')}")
        
    except Exception as e:
        print(f"❌ Error processing email: {e}")
        import traceback
        print(traceback.format_exc())

def apply_styling_with_llm(original_html: str, style_config: dict) -> str:
    """
    Use Claude to apply the style_config to the original email HTML
    """
    
    system_prompt = f"""You are an email HTML styler.

Take the original email HTML and apply these styling rules:

{json.dumps(style_config, indent=2)}

IMPORTANT RULES:
1. Keep ALL original content intact - don't remove or change any text
2. Only modify the HTML structure and inline styles
3. Apply the styles from the config to matching elements
4. Use inline CSS only (style="...") - email clients don't support <style> tags well
5. Make sure tables, buttons, and images are email-client compatible
6. Return ONLY the styled HTML, no explanations
7. Keep the HTML valid and well-formed
8. DONT CHANGE THE STRUCTURE OF THE EMAIL. The structure being where stuff is places, how big things are, etc. Think of it as a skin. You are changing the skin of the email, not the structure. The styling rules are the skin, a suggestion of how to change the skin.
9. You will have some main tasks. You will first generate the draft email with the better html, then you will look at the html you generated to see if it looks OBJECTIVELY good; if it does, you will return it. If it doesn't, you will fix it and then return the fixed version.

Original email HTML:
{original_html}

Return the styled HTML:"""

    message = anthropic_client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=64000,
        messages=[
            {
                "role": "user",
                "content": system_prompt
            }
        ]
    )
    
    return message.content[0].text.strip()


# ==================== UTILITY ENDPOINTS ====================

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/styles/active")
async def get_active_style():
    """Get the currently active style"""
    try:
        result = supabase.table("email_styles")\
            .select("*")\
            .eq("active", True)\
            .single()\
            .execute()
        
        return result.data
        
    except Exception as e:
        return {"message": "No active style configured"}


@app.get("/styles/history")
async def get_style_history():
    """Get all styles ordered by creation date (newest first)"""
    try:
        result = supabase.table("email_styles")\
            .select("*")\
            .order("created_at", desc=True)\
            .execute()
        
        return result.data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/styles/{style_id}/activate")
async def activate_style(style_id: str):
    """Switch to a different style from history"""
    try:
        # Deactivate all styles
        supabase.table("email_styles")\
            .update({"active": False})\
            .eq("active", True)\
            .execute()
        
        # Activate the selected style
        result = supabase.table("email_styles")\
            .update({"active": True})\
            .eq("id", style_id)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Style not found")
        
        return {
            "success": True,
            "message": "Style activated successfully",
            "style": result.data[0]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/styles/{style_id}")
async def delete_style(style_id: str):
    """Delete a style from history"""
    try:
        # Check if it's the active style
        check = supabase.table("email_styles")\
            .select("active")\
            .eq("id", style_id)\
            .single()\
            .execute()
        
        if check.data and check.data.get("active"):
            raise HTTPException(status_code=400, detail="Cannot delete active style")
        
        supabase.table("email_styles").delete().eq("id", style_id).execute()
        return {"message": "Style deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))