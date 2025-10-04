export interface StyleJSON {
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

export interface EmailStyle {
  id: string;
  style_json: StyleJSON;
}

export interface EmailContent {
  sender: {
    name: string;
    email: string;
    avatar: string;
  };
  subject: string;
  timestamp: string;
  body: {
    intro: string;
    quote: string;
    content: string;
    table: {
      headers: string[];
      rows: string[][];
    };
    list: string[];
    ctaText: string;
  };
  footer: {
    unsubscribeText: string;
    companyInfo: string;
  };
}

export type DeviceView = 'desktop' | 'mobile';
