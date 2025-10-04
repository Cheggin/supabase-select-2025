import { EmailStyleJSON } from '../types/email-styles';

// This function generates complete CSS styles for each email element based on a prompt
// In production, this would be replaced by an LLM API call
export function generateEmailStyles(prompt: string): EmailStyleJSON {
  const lowerPrompt = prompt.toLowerCase();

  // Cyberpunk theme
  if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon')) {
    return {
      email_container: 'background: linear-gradient(135deg, #0a0e27, #1a1f3a); padding: 32px; border-radius: 16px; box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);',
      sender_section: 'display: flex; align-items: center; gap: 16px; margin-bottom: 24px;',
      sender_avatar: 'width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #ff00ff, #00ffff); color: #000; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);',
      sender_name: 'font-size: 16px; font-weight: 600; color: #00ffff; text-shadow: 0 0 10px rgba(0, 255, 255, 0.5); font-family: "Monaco", monospace;',
      sender_email: 'font-size: 14px; color: #ff00ff; font-family: "Monaco", monospace;',
      timestamp: 'font-size: 12px; color: #00ffff; opacity: 0.7; font-family: "Monaco", monospace;',
      subject: 'font-size: 28px; font-weight: bold; color: #00ffff; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0, 255, 255, 0.8); font-family: "Monaco", monospace;',
      paragraph: 'font-size: 16px; line-height: 1.8; color: #e0e7ff; margin-bottom: 16px; font-family: "Monaco", monospace;',
      quote_block: 'border-left: 4px solid #ff00ff; background: rgba(255, 0, 255, 0.1); padding: 20px; margin: 20px 0; color: #00ffff; font-style: italic; box-shadow: inset 0 0 20px rgba(255, 0, 255, 0.2);',
      table: 'width: 100%; border-collapse: separate; border-spacing: 2px; margin: 20px 0; background: rgba(0, 0, 0, 0.3);',
      table_header: 'background: linear-gradient(135deg, #ff00ff, #00ffff); color: #000; padding: 14px; font-weight: 600; font-family: "Monaco", monospace;',
      table_cell: 'padding: 12px; border: 1px solid #00ffff; color: #e0e7ff; background: rgba(0, 255, 255, 0.05); font-family: "Monaco", monospace;',
      list: 'margin: 16px 0; padding-left: 24px; color: #e0e7ff; font-family: "Monaco", monospace;',
      list_item: 'margin-bottom: 12px; line-height: 1.6; position: relative;',
      button: 'display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #ff00ff, #00ffff); color: #000; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 0 30px rgba(255, 0, 255, 0.5); transition: all 0.3s; font-family: "Monaco", monospace;',
      link: 'color: #00ffff; text-decoration: none; border-bottom: 1px solid #00ffff; transition: all 0.3s;',
      image: 'max-width: 100%; height: auto; border: 2px solid #00ffff; border-radius: 8px; margin: 20px 0; box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);',
      footer: 'margin-top: 40px; padding-top: 20px; border-top: 1px solid #ff00ff; text-align: center; font-size: 12px; color: #00ffff; opacity: 0.6; font-family: "Monaco", monospace;'
    };
  }

  // Warm & Friendly theme
  if (lowerPrompt.includes('warm') || lowerPrompt.includes('coral') || lowerPrompt.includes('friendly')) {
    return {
      email_container: 'background: linear-gradient(135deg, #fffbf5, #ffedd5); padding: 28px; border-radius: 20px; box-shadow: 0 10px 30px rgba(251, 146, 60, 0.15);',
      sender_section: 'display: flex; align-items: center; gap: 16px; margin-bottom: 24px;',
      sender_avatar: 'width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #fb923c, #f472b6); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 18px;',
      sender_name: 'font-size: 17px; font-weight: 600; color: #78350f; font-family: "Georgia", serif;',
      sender_email: 'font-size: 14px; color: #9a3412; opacity: 0.8; font-family: "Georgia", serif;',
      timestamp: 'font-size: 12px; color: #9a3412; opacity: 0.6;',
      subject: 'font-size: 26px; font-weight: bold; color: #78350f; margin-bottom: 18px; font-family: "Georgia", serif;',
      paragraph: 'font-size: 16px; line-height: 1.7; color: #78350f; margin-bottom: 16px; font-family: "Georgia", serif;',
      quote_block: 'border-left: 4px solid #fb923c; background-color: #ffedd5; padding: 18px; border-radius: 0 12px 12px 0; margin: 18px 0; color: #9a3412; font-style: italic;',
      table: 'width: 100%; border-collapse: collapse; margin: 18px 0; border-radius: 12px; overflow: hidden;',
      table_header: 'background-color: #fff7ed; color: #9a3412; padding: 14px; text-align: left; font-weight: 600; font-family: "Georgia", serif;',
      table_cell: 'padding: 12px; border-bottom: 1px solid #fed7aa; color: #78350f; background: #fffbf5;',
      list: 'margin: 16px 0; padding-left: 28px; color: #78350f; font-family: "Georgia", serif;',
      list_item: 'margin-bottom: 10px; line-height: 1.6;',
      button: 'display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #fb923c, #f472b6); color: white; border-radius: 100px; text-decoration: none; font-weight: 600; margin: 18px 0; box-shadow: 0 8px 20px rgba(251, 146, 60, 0.3); transition: transform 0.2s;',
      link: 'color: #ea580c; text-decoration: underline; text-decoration-color: #fed7aa;',
      image: 'max-width: 100%; height: auto; border-radius: 16px; margin: 18px 0; box-shadow: 0 6px 20px rgba(251, 146, 60, 0.2);',
      footer: 'margin-top: 36px; padding-top: 18px; border-top: 2px solid #fed7aa; text-align: center; font-size: 12px; color: #9a3412; opacity: 0.7;'
    };
  }

  // Minimal & Clean theme
  if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean') || lowerPrompt.includes('simple')) {
    return {
      email_container: 'background-color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #e5e5e5;',
      sender_section: 'display: flex; align-items: center; gap: 12px; margin-bottom: 20px;',
      sender_avatar: 'width: 40px; height: 40px; border-radius: 50%; background-color: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 500; font-size: 14px;',
      sender_name: 'font-size: 15px; font-weight: 600; color: #171717; font-family: "Inter", system-ui, sans-serif;',
      sender_email: 'font-size: 13px; color: #525252; font-family: "Inter", system-ui, sans-serif;',
      timestamp: 'font-size: 12px; color: #a3a3a3;',
      subject: 'font-size: 20px; font-weight: 700; color: #171717; margin-bottom: 16px; font-family: "Inter", system-ui, sans-serif;',
      paragraph: 'font-size: 15px; line-height: 1.6; color: #525252; margin-bottom: 14px; font-family: "Inter", system-ui, sans-serif;',
      quote_block: 'border-left: 3px solid #60a5fa; background-color: #f5f5f5; padding: 14px; margin: 16px 0; color: #404040;',
      table: 'width: 100%; border-collapse: collapse; margin: 16px 0;',
      table_header: 'background-color: #eff6ff; color: #1e3a8a; padding: 10px; text-align: left; border: 1px solid #dbeafe; font-weight: 600; font-size: 14px;',
      table_cell: 'padding: 10px; border: 1px solid #e5e5e5; color: #525252; font-size: 14px;',
      list: 'margin: 14px 0; padding-left: 20px; color: #525252;',
      list_item: 'margin-bottom: 8px; line-height: 1.5;',
      button: 'display: inline-block; padding: 10px 24px; background-color: #3b82f6; color: white; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 16px 0; font-size: 14px;',
      link: 'color: #3b82f6; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s;',
      image: 'max-width: 100%; height: auto; border-radius: 6px; margin: 16px 0;',
      footer: 'margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 11px; color: #a3a3a3;'
    };
  }

  // Default professional theme
  return {
    email_container: 'background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);',
    sender_section: 'display: flex; align-items: center; gap: 16px; margin-bottom: 24px;',
    sender_avatar: 'width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px;',
    sender_name: 'font-size: 16px; font-weight: 600; color: #1a1a1a; font-family: system-ui, -apple-system, sans-serif;',
    sender_email: 'font-size: 14px; color: #6b7280; font-family: system-ui, -apple-system, sans-serif;',
    timestamp: 'font-size: 12px; color: #9ca3af;',
    subject: 'font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; font-family: system-ui, -apple-system, sans-serif;',
    paragraph: 'font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px; font-family: system-ui, -apple-system, sans-serif;',
    quote_block: 'border-left: 4px solid #8b5cf6; background-color: #f3f4f6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; color: #4b5563; font-style: italic;',
    table: 'width: 100%; border-collapse: collapse; margin: 16px 0;',
    table_header: 'background-color: #f9fafb; color: #111827; padding: 12px; text-align: left; border: 1px solid #e5e7eb; font-weight: 600;',
    table_cell: 'padding: 12px; border: 1px solid #e5e7eb; color: #374151;',
    list: 'margin: 16px 0; padding-left: 24px; color: #374151;',
    list_item: 'margin-bottom: 8px; line-height: 1.6;',
    button: 'display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);',
    link: 'color: #6366f1; text-decoration: underline;',
    image: 'max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;',
    footer: 'margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af;'
  };
}

// This function would be used by the LLM to apply styles to an actual email
export function generateStyledEmailHTML(content: any, styles: EmailStyleJSON): string {
  return `
    <div style="${styles.email_container}">
      <div style="${styles.sender_section}">
        <div style="${styles.sender_avatar}">
          ${content.sender.initials || 'U'}
        </div>
        <div>
          <div style="${styles.sender_name}">${content.sender.name}</div>
          <div style="${styles.sender_email}">${content.sender.email}</div>
        </div>
        <div style="${styles.timestamp}">${content.timestamp}</div>
      </div>

      <h1 style="${styles.subject}">${content.subject}</h1>

      <!-- Body content would be dynamically styled based on element type -->
      ${content.body.map((element: any) => {
        switch(element.type) {
          case 'paragraph':
            return `<p style="${styles.paragraph}">${element.content}</p>`;
          case 'quote':
            return `<blockquote style="${styles.quote_block}">${element.content}</blockquote>`;
          case 'list':
            return `<ul style="${styles.list}">
              ${element.items.map((item: string) => `<li style="${styles.list_item}">${item}</li>`).join('')}
            </ul>`;
          case 'button':
            return `<a href="${element.href}" style="${styles.button}">${element.text}</a>`;
          case 'table':
            return `<table style="${styles.table}">
              <thead>
                <tr>
                  ${element.headers.map((header: string) => `<th style="${styles.table_header}">${header}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${element.rows.map((row: string[]) => `
                  <tr>
                    ${row.map((cell: string) => `<td style="${styles.table_cell}">${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>`;
          default:
            return '';
        }
      }).join('')}

      <div style="${styles.footer}">
        ${content.footer}
      </div>
    </div>
  `;
}