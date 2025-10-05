import type { EmailStyleJSON } from '../types/email-styles';

// This function generates complete CSS styles for each email element based on a prompt
// In production, this would be replaced by an LLM API call
export function generateEmailStyles(prompt: string): EmailStyleJSON {
  const lowerPrompt = prompt.toLowerCase();

  // Cyberpunk theme
  if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon')) {
    return {
      email_body: 'background: linear-gradient(135deg, #0a0e27, #1a1f3a); padding: 32px; border-radius: 16px; box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);',
      background_color: '#000000',
      header_section: 'margin-bottom: 24px;',
      header_title: 'font-size: 28px; font-weight: bold; color: #00ffff; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0, 255, 255, 0.8); font-family: "Monaco", monospace;',
      header_subtitle: 'font-size: 16px; color: #ff00ff; font-family: "Monaco", monospace;',
      text_section: 'margin-bottom: 24px;',
      paragraph: 'font-size: 16px; line-height: 1.8; color: #e0e7ff; margin-bottom: 16px; font-family: "Monaco", monospace;',
      bold_text: 'font-weight: bold; color: #00ffff;',
      italic_text: 'font-style: italic; color: #ff00ff;',
      links_section: 'margin-bottom: 24px;',
      link: 'color: #00ffff; text-decoration: none; border-bottom: 1px solid #00ffff; transition: all 0.3s;',
      link_button: 'display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #ff00ff, #00ffff); color: #000; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 0 30px rgba(255, 0, 255, 0.5); transition: all 0.3s; font-family: "Monaco", monospace;',
      list_section: 'margin-bottom: 24px;',
      unordered_list: 'margin: 16px 0; padding-left: 24px; color: #e0e7ff; font-family: "Monaco", monospace;',
      ordered_list: 'margin: 16px 0; padding-left: 24px; color: #e0e7ff; font-family: "Monaco", monospace;',
      list_item: 'margin-bottom: 12px; line-height: 1.6; position: relative;',
      table_section: 'margin-bottom: 24px;',
      table: 'width: 100%; border-collapse: separate; border-spacing: 2px; margin: 20px 0; background: rgba(0, 0, 0, 0.3);',
      table_header: 'background: linear-gradient(135deg, #ff00ff, #00ffff); color: #000; padding: 14px; font-weight: 600; font-family: "Monaco", monospace;',
      table_cell: 'padding: 12px; border: 1px solid #00ffff; color: #e0e7ff; background: rgba(0, 255, 255, 0.05); font-family: "Monaco", monospace;',
      signature_section: 'margin-top: 40px; padding-top: 20px; border-top: 1px solid #ff00ff;',
      signature_text: 'font-size: 12px; color: #00ffff; opacity: 0.6; font-family: "Monaco", monospace;',
      divider: 'border-top: 1px solid #ff00ff; margin: 20px 0;'
    };
  }

  // Warm & Friendly theme
  if (lowerPrompt.includes('warm') || lowerPrompt.includes('coral') || lowerPrompt.includes('friendly')) {
    return {
      email_body: 'background: linear-gradient(135deg, #fffbf5, #ffedd5); padding: 28px; border-radius: 20px; box-shadow: 0 10px 30px rgba(251, 146, 60, 0.15);',
      background_color: '#fef3c7',
      header_section: 'margin-bottom: 24px;',
      header_title: 'font-size: 26px; font-weight: bold; color: #78350f; margin-bottom: 18px; font-family: "Georgia", serif;',
      header_subtitle: 'font-size: 16px; color: #9a3412; font-family: "Georgia", serif;',
      text_section: 'margin-bottom: 24px;',
      paragraph: 'font-size: 16px; line-height: 1.7; color: #78350f; margin-bottom: 16px; font-family: "Georgia", serif;',
      bold_text: 'font-weight: bold; color: #78350f;',
      italic_text: 'font-style: italic; color: #9a3412;',
      links_section: 'margin-bottom: 24px;',
      link: 'color: #ea580c; text-decoration: underline; text-decoration-color: #fed7aa;',
      link_button: 'display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #fb923c, #f472b6); color: white; border-radius: 100px; text-decoration: none; font-weight: 600; margin: 18px 0; box-shadow: 0 8px 20px rgba(251, 146, 60, 0.3); transition: transform 0.2s;',
      list_section: 'margin-bottom: 24px;',
      unordered_list: 'margin: 16px 0; padding-left: 28px; color: #78350f; font-family: "Georgia", serif;',
      ordered_list: 'margin: 16px 0; padding-left: 28px; color: #78350f; font-family: "Georgia", serif;',
      list_item: 'margin-bottom: 10px; line-height: 1.6;',
      table_section: 'margin-bottom: 24px;',
      table: 'width: 100%; border-collapse: collapse; margin: 18px 0; border-radius: 12px; overflow: hidden;',
      table_header: 'background-color: #fff7ed; color: #9a3412; padding: 14px; text-align: left; font-weight: 600; font-family: "Georgia", serif;',
      table_cell: 'padding: 12px; border-bottom: 1px solid #fed7aa; color: #78350f; background: #fffbf5;',
      signature_section: 'margin-top: 36px; padding-top: 18px; border-top: 2px solid #fed7aa;',
      signature_text: 'font-size: 14px; color: #9a3412; opacity: 0.7;',
      divider: 'border-top: 2px solid #fed7aa; margin: 18px 0;'
    };
  }

  // Minimal & Clean theme
  if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean') || lowerPrompt.includes('simple')) {
    return {
      email_body: 'background-color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #e5e5e5;',
      background_color: '#fafafa',
      header_section: 'margin-bottom: 20px;',
      header_title: 'font-size: 20px; font-weight: 700; color: #171717; margin-bottom: 16px; font-family: "Inter", system-ui, sans-serif;',
      header_subtitle: 'font-size: 15px; color: #525252; font-family: "Inter", system-ui, sans-serif;',
      text_section: 'margin-bottom: 20px;',
      paragraph: 'font-size: 15px; line-height: 1.6; color: #525252; margin-bottom: 14px; font-family: "Inter", system-ui, sans-serif;',
      bold_text: 'font-weight: 600; color: #171717;',
      italic_text: 'font-style: italic; color: #525252;',
      links_section: 'margin-bottom: 20px;',
      link: 'color: #3b82f6; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s;',
      link_button: 'display: inline-block; padding: 10px 24px; background-color: #3b82f6; color: white; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 16px 0; font-size: 14px;',
      list_section: 'margin-bottom: 20px;',
      unordered_list: 'margin: 14px 0; padding-left: 20px; color: #525252;',
      ordered_list: 'margin: 14px 0; padding-left: 20px; color: #525252;',
      list_item: 'margin-bottom: 8px; line-height: 1.5;',
      table_section: 'margin-bottom: 20px;',
      table: 'width: 100%; border-collapse: collapse; margin: 16px 0;',
      table_header: 'background-color: #eff6ff; color: #1e3a8a; padding: 10px; text-align: left; border: 1px solid #dbeafe; font-weight: 600; font-size: 14px;',
      table_cell: 'padding: 10px; border: 1px solid #e5e5e5; color: #525252; font-size: 14px;',
      signature_section: 'margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5;',
      signature_text: 'font-size: 13px; color: #a3a3a3;',
      divider: 'border-top: 1px solid #e5e5e5; margin: 16px 0;'
    };
  }

  // Default professional theme
  return {
    email_body: 'background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);',
    background_color: '#f9fafb',
    header_section: 'margin-bottom: 24px;',
    header_title: 'font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; font-family: system-ui, -apple-system, sans-serif;',
    header_subtitle: 'font-size: 16px; color: #6b7280; font-family: system-ui, -apple-system, sans-serif;',
    text_section: 'margin-bottom: 24px;',
    paragraph: 'font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px; font-family: system-ui, -apple-system, sans-serif;',
    bold_text: 'font-weight: 600; color: #111827;',
    italic_text: 'font-style: italic; color: #6b7280;',
    links_section: 'margin-bottom: 24px;',
    link: 'color: #6366f1; text-decoration: underline;',
    link_button: 'display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);',
    list_section: 'margin-bottom: 24px;',
    unordered_list: 'margin: 16px 0; padding-left: 24px; color: #374151;',
    ordered_list: 'margin: 16px 0; padding-left: 24px; color: #374151;',
    list_item: 'margin-bottom: 8px; line-height: 1.6;',
    table_section: 'margin-bottom: 24px;',
    table: 'width: 100%; border-collapse: collapse; margin: 16px 0;',
    table_header: 'background-color: #f9fafb; color: #111827; padding: 12px; text-align: left; border: 1px solid #e5e7eb; font-weight: 600;',
    table_cell: 'padding: 12px; border: 1px solid #e5e7eb; color: #374151;',
    signature_section: 'margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;',
    signature_text: 'font-size: 14px; color: #6b7280;',
    divider: 'border-top: 1px solid #e5e7eb; margin: 16px 0;'
  };
}