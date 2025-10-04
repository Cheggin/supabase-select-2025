// Define type directly to avoid import issues
interface EmailStyleJSON {
  email_container: string;
  sender_section: string;
  sender_avatar: string;
  sender_name: string;
  sender_email: string;
  timestamp: string;
  subject: string;
  paragraph: string;
  quote_block: string;
  table: string;
  table_header: string;
  table_cell: string;
  list: string;
  list_item: string;
  button: string;
  link: string;
  image: string;
  footer: string;
}

// This service handles the LLM integration for generating email styles
export class LLMStyleGenerator {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    // Use backend endpoint which handles the Claude API call
    this.apiUrl = 'http://localhost:8000/create-style';
  }

  // Generate styles using the backend /create-style endpoint
  async generateStyles(prompt: string): Promise<EmailStyleJSON> {
    console.log('Calling backend to generate styles with prompt:', prompt);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_prompt: prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Backend API request failed: ${response.statusText} - ${errorData}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      // The backend returns styling_json which should already be in our format
      // after the update to generate_style_config_from_prompt
      const styleJson = data.styling_json;

      // Validate and return
      return this.validateAndSanitizeStyles(styleJson);
    } catch (error) {
      console.error('Error calling backend:', error);

      // Check if backend is not running
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        alert('Backend is not responding. Please ensure the backend is running on port 8000.');
      } else {
        alert(`Error generating styles: ${error}`);
      }

      // Return a fallback style if API fails
      return this.getFallbackStyles();
    }
  }

  // Validate that the returned JSON has all required fields
  private validateAndSanitizeStyles(styles: any): EmailStyleJSON {
    const requiredFields: (keyof EmailStyleJSON)[] = [
      'email_container', 'sender_section', 'sender_avatar', 'sender_name',
      'sender_email', 'timestamp', 'subject', 'paragraph', 'quote_block',
      'table', 'table_header', 'table_cell', 'list', 'list_item',
      'button', 'link', 'image', 'footer'
    ];

    // Ensure all fields exist
    const validatedStyles: any = {};
    for (const field of requiredFields) {
      validatedStyles[field] = styles[field] || this.getDefaultStyleForField(field);
    }

    return validatedStyles as EmailStyleJSON;
  }

  // Get default style for a specific field
  private getDefaultStyleForField(field: keyof EmailStyleJSON): string {
    const defaults: EmailStyleJSON = this.getFallbackStyles();
    return defaults[field];
  }

  // Fallback styles if LLM fails
  private getFallbackStyles(): EmailStyleJSON {
    return {
      email_container: 'background-color: #ffffff; padding: 24px; border-radius: 12px;',
      sender_section: 'display: flex; align-items: center; gap: 16px; margin-bottom: 24px;',
      sender_avatar: 'width: 48px; height: 48px; border-radius: 50%; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;',
      sender_name: 'font-size: 16px; font-weight: 600; color: #1a1a1a;',
      sender_email: 'font-size: 14px; color: #6b7280;',
      timestamp: 'font-size: 12px; color: #9ca3af;',
      subject: 'font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;',
      paragraph: 'font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px;',
      quote_block: 'border-left: 4px solid #8b5cf6; background-color: #f3f4f6; padding: 16px; margin: 16px 0;',
      table: 'width: 100%; border-collapse: collapse; margin: 16px 0;',
      table_header: 'background-color: #f9fafb; color: #111827; padding: 12px; border: 1px solid #e5e7eb; font-weight: 600;',
      table_cell: 'padding: 12px; border: 1px solid #e5e7eb; color: #374151;',
      list: 'margin: 16px 0; padding-left: 24px; color: #374151;',
      list_item: 'margin-bottom: 8px; line-height: 1.6;',
      button: 'display: inline-block; padding: 12px 32px; background: #6366f1; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;',
      link: 'color: #6366f1; text-decoration: underline;',
      image: 'max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;',
      footer: 'margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af;'
    };
  }
}

// Example usage:
export async function generateEmailStylesFromPrompt(prompt: string): Promise<EmailStyleJSON> {
  const generator = new LLMStyleGenerator();
  return await generator.generateStyles(prompt);
}

// Save styles to Supabase
export async function saveStylesToSupabase(styles: EmailStyleJSON): Promise<string> {
  // This would connect to your Supabase instance
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/rest/v1/email_styles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    },
    body: JSON.stringify({
      style_json: styles
    })
  });

  const data = await response.json();
  return data.id;
}