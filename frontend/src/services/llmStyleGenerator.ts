// Define type directly to avoid import issues
interface EmailStyleJSON {
  email_body: string;
  background_color: string;
  header_section: string;
  header_title: string;
  header_subtitle: string;
  text_section: string;
  paragraph: string;
  bold_text: string;
  italic_text: string;
  links_section: string;
  link: string;
  link_button: string;
  list_section: string;
  unordered_list: string;
  ordered_list: string;
  list_item: string;
  table_section: string;
  table: string;
  table_header: string;
  table_cell: string;
  signature_section: string;
  signature_text: string;
  divider: string;
}

// This service handles the LLM integration for generating email styles
export class LLMStyleGenerator {
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
  private validateAndSanitizeStyles(styles: unknown): EmailStyleJSON {
    const requiredFields: (keyof EmailStyleJSON)[] = [
      'email_body', 'background_color', 'header_section', 'header_title',
      'header_subtitle', 'text_section', 'paragraph', 'bold_text',
      'italic_text', 'links_section', 'link', 'link_button',
      'list_section', 'unordered_list', 'ordered_list', 'list_item',
      'table_section', 'table', 'table_header', 'table_cell',
      'signature_section', 'signature_text', 'divider'
    ];

    // Ensure all fields exist
    const stylesObj = styles as Record<string, string>;
    const validatedStyles: Record<string, string> = {};
    for (const field of requiredFields) {
      validatedStyles[field] = stylesObj[field] || this.getDefaultStyleForField(field);
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
      email_body: 'max-width: 600px; margin: 0 auto; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Helvetica", "Arial", sans-serif;',
      background_color: '#f6f6f6',
      header_section: 'margin-bottom: 24px;',
      header_title: 'font-size: 24px; font-weight: bold; color: #1a1a1a; margin-bottom: 8px;',
      header_subtitle: 'font-size: 16px; color: #6b7280;',
      text_section: 'margin-bottom: 24px;',
      paragraph: 'font-size: 14px; line-height: 1.6; color: #374151; margin-bottom: 16px;',
      bold_text: 'font-weight: bold;',
      italic_text: 'font-style: italic;',
      links_section: 'margin-bottom: 24px;',
      link: 'color: #6366f1; text-decoration: underline;',
      link_button: 'display: inline-block; padding: 12px 32px; background: #6366f1; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;',
      list_section: 'margin-bottom: 24px;',
      unordered_list: 'margin: 16px 0; padding-left: 24px; color: #374151;',
      ordered_list: 'margin: 16px 0; padding-left: 24px; color: #374151;',
      list_item: 'margin-bottom: 8px; line-height: 1.6;',
      table_section: 'margin-bottom: 24px;',
      table: 'width: 100%; border-collapse: collapse; margin: 16px 0;',
      table_header: 'background-color: #f9fafb; color: #111827; padding: 12px; border: 1px solid #e5e7eb; font-weight: 600;',
      table_cell: 'padding: 12px; border: 1px solid #e5e7eb; color: #374151;',
      signature_section: 'margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;',
      signature_text: 'font-size: 14px; color: #6b7280;',
      divider: 'border-top: 1px solid #e5e7eb; margin: 16px 0;'
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
      styling_json: styles
    })
  });

  const data = await response.json();
  return data.id;
}