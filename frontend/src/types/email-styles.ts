// This structure matches what will be stored in the database
// Each value is a CSS style string that can be applied directly to HTML elements
export interface EmailStyleJSON {
  // Container styles
  email_container: string;

  // Header section
  sender_section: string;
  sender_avatar: string;
  sender_name: string;
  sender_email: string;
  timestamp: string;

  // Content styles
  subject: string;
  paragraph: string;
  quote_block: string;

  // Table styles
  table: string;
  table_header: string;
  table_cell: string;

  // List styles
  list: string;
  list_item: string;

  // Interactive elements
  button: string;
  link: string;

  // Media
  image: string;

  // Footer
  footer: string;
}

// This is what we store in the database
export interface EmailStyleRecord {
  id: string;
  style_json: EmailStyleJSON;
}

// For backward compatibility with current components
export interface SimplifiedStyleJSON {
  background: string;
  plain_text: string;
  title_text: string;
  button_background: string;
  button_text: string;
  accent_color: string;
  border_color: string;
  quote_background: string;
  quote_text: string;
  table_header_background: string;
  table_header_text: string;
  table_border: string;
  link_color: string;
  font_family: string;
}