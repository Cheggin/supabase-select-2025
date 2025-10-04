// This structure matches what will be stored in the database
// Each value is a CSS style string that can be applied directly to HTML elements
export interface EmailStyleJSON {
  // Container and background
  email_body: string;
  background_color: string;

  // Header section
  header_section: string;
  header_title: string;
  header_subtitle: string;

  // Text section
  text_section: string;
  paragraph: string;
  bold_text: string;
  italic_text: string;

  // Links section
  links_section: string;
  link: string;
  link_button: string;

  // List section
  list_section: string;
  unordered_list: string;
  ordered_list: string;
  list_item: string;

  // Table section (for data)
  table_section: string;
  table: string;
  table_header: string;
  table_cell: string;

  // Footer/Signature
  signature_section: string;
  signature_text: string;
  divider: string;
}

// This is what we store in the database
export interface EmailStyleRecord {
  id: string;
  user_prompt: string;
  styling_json: EmailStyleJSON;
  active: boolean;
  created_at: string;
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