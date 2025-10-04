-- Better Inbox Email Template Designer
-- Supabase Database Schema

-- Create the email_styles table
CREATE TABLE IF NOT EXISTS email_styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  style_json JSONB NOT NULL
);

-- Add comments for documentation
COMMENT ON TABLE email_styles IS 'Stores email template styles as JSON to be processed by LLM';
COMMENT ON COLUMN email_styles.id IS 'Unique identifier for the style';
COMMENT ON COLUMN email_styles.style_json IS 'JSON object containing all style configurations (background, plain_text, title_text, button_background, button_text, accent_color, border_color, quote_background, quote_text, table_header_background, table_header_text, table_border, link_color, font_family)';

-- Example style_json structure for LLM email processing:
-- {
--   "email_container": "background-color: #ffffff; padding: 24px; border-radius: 12px;",
--   "sender_section": "display: flex; align-items: center; gap: 16px; margin-bottom: 24px;",
--   "sender_avatar": "width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;",
--   "sender_name": "font-size: 16px; font-weight: 600; color: #1a1a1a;",
--   "sender_email": "font-size: 14px; color: #6b7280;",
--   "timestamp": "font-size: 12px; color: #9ca3af;",
--   "subject": "font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 16px;",
--   "paragraph": "font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px;",
--   "quote_block": "border-left: 4px solid #8b5cf6; background-color: #f3f4f6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; font-style: italic; color: #4b5563;",
--   "table": "width: 100%; border-collapse: collapse; margin: 16px 0;",
--   "table_header": "background-color: #f9fafb; color: #111827; padding: 12px; text-align: left; border: 1px solid #e5e7eb; font-weight: 600;",
--   "table_cell": "padding: 12px; border: 1px solid #e5e7eb; color: #374151;",
--   "list": "margin: 16px 0; padding-left: 24px; color: #374151;",
--   "list_item": "margin-bottom: 8px; line-height: 1.6;",
--   "button": "display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;",
--   "link": "color: #6366f1; text-decoration: underline;",
--   "image": "max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;",
--   "footer": "margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af;"
-- }
