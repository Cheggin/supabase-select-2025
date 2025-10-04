# Email Restyling Backend - Complete Flow with Style History
# pip install fastapi uvicorn supabase anthropic resend python-dotenv

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from anthropic import Anthropic
from resend import Resend

load_dotenv()

app = FastAPI()

# Configure CORS to allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    that matches the frontend's exact requirements
    """

    system_prompt = """You are an email CSS style generator for a template preview system.

Convert the user's styling preferences into a JSON configuration with complete inline CSS strings for each email element.

You MUST return a JSON object with these EXACT keys, where each value is a complete CSS string that can be applied as inline styles:

{
  "email_container": "complete CSS string for main container (background, padding, border-radius, etc)",
  "sender_section": "display: flex; align-items: center; gap: 16px; margin-bottom: 24px;",
  "sender_avatar": "width: 48px; height: 48px; border-radius: 50%; background: [color/gradient]; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;",
  "sender_name": "font-size: 16px; font-weight: 600; color: [color];",
  "sender_email": "font-size: 14px; color: [color]; opacity: 0.8;",
  "timestamp": "font-size: 12px; color: [color]; opacity: 0.6;",
  "subject": "font-size: 24px; font-weight: 700; color: [color]; margin-bottom: 16px;",
  "paragraph": "font-size: 16px; line-height: 1.6; color: [color]; margin-bottom: 16px;",
  "quote_block": "border-left: 4px solid [color]; background-color: [color]; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; font-style: italic; color: [color];",
  "table": "width: 100%; border-collapse: collapse; margin: 16px 0;",
  "table_header": "background-color: [color]; color: [color]; padding: 12px; text-align: left; border: 1px solid [color]; font-weight: 600;",
  "table_cell": "padding: 12px; border: 1px solid [color]; color: [color];",
  "list": "margin: 16px 0; padding-left: 24px; color: [color];",
  "list_item": "margin-bottom: 8px; line-height: 1.6;",
  "button": "display: inline-block; padding: 12px 32px; background: [color/gradient]; color: [color]; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;",
  "link": "color: [color]; text-decoration: underline;",
  "image": "max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;",
  "footer": "margin-top: 32px; padding-top: 16px; border-top: 1px solid [color]; text-align: center; font-size: 12px; color: [color];"
}

IMPORTANT RULES:
1. Return ONLY valid JSON, no markdown backticks, no explanations
2. Every value MUST be a complete CSS string with semicolons between properties
3. Use hex colors (e.g., #333333) or CSS gradients
4. Be creative and match the user's style request
5. For cyberpunk: use neon colors (#00ffff, #ff00ff), dark backgrounds
6. For minimal: use clean colors, lots of white space
7. For warm: use coral, peach, cream colors
8. For corporate: use navy, gold, professional colors

Return ONLY the JSON object:"""

    message = anthropic_client.messages.create(
        model="claude-3-5-haiku-20241022",  # Using latest Haiku model
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
        if event.type != "email.received":
            return {"message": "Event type not supported"}
        
        email_id = event.data.get("id")
        print(f"Received email.received event for ID: {email_id}")
        
        # Process email in background
        background_tasks.add_task(process_and_send_email, email_id)
        
        return {"message": "Email received and processing"}
        
    except Exception as e:
        print(f"Error handling webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def process_and_send_email(email_id: str):
    """
    1. Fetch full email from Resend Inbound API
    2. Get active style_config from Supabase
    3. Use LLM to apply styling to email
    4. Send styled email via Resend
    """
    try:
        # Fetch full email content from Resend Inbound API
        email_data = resend_client.inbound.get(email_id)
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
            print(f"Applying active style config...")
            
            # Use LLM to apply styling
            original_content = email_data.get("html") or email_data.get("text")
            styled_html = apply_styling_with_llm(original_content, style_config)
        
        # Send styled email via Resend
        send_result = resend_client.emails.send({
            "from": os.getenv("RESEND_FROM_EMAIL", "noreply@yourdomain.com"),
            "to": email_data.get("from"),  # Send back to original sender
            "subject": f"Re: {email_data.get('subject')}",
            "html": styled_html,
        })
        
        print(f"✅ Styled email sent successfully! ID: {send_result['id']}")
        
    except Exception as e:
        print(f"❌ Error processing email: {e}")


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

Original email HTML:
{original_html}

Return the styled HTML:"""

    message = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
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