// Define type directly
interface StyleJSON {
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

export const stylePresets: Record<string, StyleJSON> = {
  default: {
    background: '#ffffff',
    plain_text: '#333333',
    title_text: '#1a1a1a',
    button_background: '#6366f1',
    button_text: '#ffffff',
    accent_color: '#8b5cf6',
    border_color: '#e5e7eb',
    quote_background: '#f3f4f6',
    quote_text: '#4b5563',
    table_header_background: '#f9fafb',
    table_header_text: '#111827',
    table_border: '#e5e7eb',
    link_color: '#6366f1',
    font_family: 'system-ui, -apple-system, sans-serif',
  },
  cyberpunk: {
    background: '#0a0e27',
    plain_text: '#e0e7ff',
    title_text: '#00ffff',
    button_background: 'linear-gradient(135deg, #ff00ff, #00ffff)',
    button_text: '#000000',
    accent_color: '#ff00ff',
    border_color: '#00ffff',
    quote_background: '#1a1f3a',
    quote_text: '#00ffff',
    table_header_background: '#ff00ff',
    table_header_text: '#000000',
    table_border: '#00ffff',
    link_color: '#00ffff',
    font_family: 'Monaco, monospace',
  },
  minimal: {
    background: '#fafafa',
    plain_text: '#525252',
    title_text: '#171717',
    button_background: '#3b82f6',
    button_text: '#ffffff',
    accent_color: '#60a5fa',
    border_color: '#e5e5e5',
    quote_background: '#f5f5f5',
    quote_text: '#404040',
    table_header_background: '#eff6ff',
    table_header_text: '#1e3a8a',
    table_border: '#dbeafe',
    link_color: '#3b82f6',
    font_family: 'Inter, system-ui, sans-serif',
  },
  warm: {
    background: '#fffbf5',
    plain_text: '#78350f',
    title_text: '#78350f',
    button_background: 'linear-gradient(135deg, #fb923c, #f472b6)',
    button_text: '#ffffff',
    accent_color: '#fb923c',
    border_color: '#fed7aa',
    quote_background: '#ffedd5',
    quote_text: '#9a3412',
    table_header_background: '#fff7ed',
    table_header_text: '#9a3412',
    table_border: '#fed7aa',
    link_color: '#ea580c',
    font_family: 'Georgia, serif',
  },
  corporate: {
    background: '#ffffff',
    plain_text: '#1e293b',
    title_text: '#0f172a',
    button_background: 'linear-gradient(135deg, #1e3a8a, #d97706)',
    button_text: '#ffffff',
    accent_color: '#d97706',
    border_color: '#cbd5e1',
    quote_background: '#f1f5f9',
    quote_text: '#334155',
    table_header_background: '#1e3a8a',
    table_header_text: '#ffffff',
    table_border: '#cbd5e1',
    link_color: '#1e3a8a',
    font_family: 'system-ui, sans-serif',
  },
  retro: {
    background: '#fdf4ff',
    plain_text: '#701a75',
    title_text: '#581c87',
    button_background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    button_text: '#ffffff',
    accent_color: '#a855f7',
    border_color: '#e9d5ff',
    quote_background: '#fae8ff',
    quote_text: '#86198f',
    table_header_background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    table_header_text: '#ffffff',
    table_border: '#e9d5ff',
    link_color: '#a855f7',
    font_family: '"Courier New", monospace',
  },
};

export function getStyleFromPrompt(prompt: string): StyleJSON {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon')) {
    return stylePresets.cyberpunk;
  }
  if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean') || lowerPrompt.includes('simple')) {
    return stylePresets.minimal;
  }
  if (lowerPrompt.includes('warm') || lowerPrompt.includes('coral') || lowerPrompt.includes('cream')) {
    return stylePresets.warm;
  }
  if (lowerPrompt.includes('corporate') || lowerPrompt.includes('professional') || lowerPrompt.includes('business')) {
    return stylePresets.corporate;
  }
  if (lowerPrompt.includes('retro') || lowerPrompt.includes('80s') || lowerPrompt.includes('vintage')) {
    return stylePresets.retro;
  }

  return stylePresets.default;
}
