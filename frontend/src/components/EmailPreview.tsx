// Define types directly here to avoid import issues
type DeviceView = 'desktop' | 'mobile';

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

interface EmailStyle {
  id: string;
  style_json: StyleJSON;
}

interface EmailContent {
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

interface EmailPreviewProps {
  style: EmailStyle;
  content: EmailContent;
  deviceView: DeviceView;
  onDeviceViewChange: (view: DeviceView) => void;
}

export default function EmailPreview({
  style,
  content,
  deviceView,
  onDeviceViewChange,
}: EmailPreviewProps) {
  const maxWidth = deviceView === 'desktop' ? '600px' : '375px';

  // Create CSS variables from style
  const emailStyles = {
    '--email-bg': style.style_json.background,
    '--email-text': style.style_json.plain_text,
    '--email-title': style.style_json.title_text,
    '--email-button-bg': style.style_json.button_background,
    '--email-button-text': style.style_json.button_text,
    '--email-accent': style.style_json.accent_color,
    '--email-border': style.style_json.border_color,
    '--email-quote-bg': style.style_json.quote_background,
    '--email-quote-text': style.style_json.quote_text,
    '--email-table-header-bg': style.style_json.table_header_background,
    '--email-table-header-text': style.style_json.table_header_text,
    '--email-table-border': style.style_json.table_border,
    '--email-link': style.style_json.link_color,
    '--email-font': style.style_json.font_family,
  } as React.CSSProperties;

  // Generate avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 p-8">
      {/* Device Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => onDeviceViewChange('desktop')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              deviceView === 'desktop'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => onDeviceViewChange('mobile')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              deviceView === 'mobile'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mobile
          </button>
        </div>
      </div>

      {/* Email Client Container */}
      <div className="flex-1 overflow-auto">
        <div className="flex justify-center">
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
            style={{ width: maxWidth }}
          >
            {/* Email Client Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-4 text-xs text-gray-500">Inbox</div>
              </div>
            </div>

            {/* Email Content */}
            <div className="p-6" style={emailStyles}>
              {/* Email Header */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${style.style_json.accent_color}, ${style.style_json.button_background})`,
                    }}
                  >
                    {getInitials(content.sender.name)}
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-semibold text-base"
                      style={{ color: style.style_json.title_text, fontFamily: style.style_json.font_family }}
                    >
                      {content.sender.name}
                    </div>
                    <div
                      className="text-sm opacity-70"
                      style={{ color: style.style_json.plain_text, fontFamily: style.style_json.font_family }}
                    >
                      {content.sender.email}
                    </div>
                  </div>
                  <div
                    className="text-xs opacity-60"
                    style={{ color: style.style_json.plain_text, fontFamily: style.style_json.font_family }}
                  >
                    {content.timestamp}
                  </div>
                </div>

                {/* Subject */}
                <h1
                  className="text-2xl font-bold mb-4"
                  style={{ color: style.style_json.title_text, fontFamily: style.style_json.font_family }}
                >
                  {content.subject}
                </h1>
              </div>

              {/* Email Body */}
              <div
                className="space-y-4"
                style={{
                  color: style.style_json.plain_text,
                  fontFamily: style.style_json.font_family,
                  backgroundColor: style.style_json.background,
                  padding: '24px',
                  borderRadius: '12px',
                }}
              >
                {/* Intro */}
                <p className="leading-relaxed">{content.body.intro}</p>

                {/* Quote/Callout */}
                <div
                  className="border-l-4 p-4 rounded-r-lg"
                  style={{
                    backgroundColor: style.style_json.quote_background,
                    borderColor: style.style_json.accent_color,
                    color: style.style_json.quote_text,
                  }}
                >
                  <p className="italic">{content.body.quote}</p>
                </div>

                {/* Content */}
                <p className="leading-relaxed">{content.body.content}</p>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" style={{ borderColor: style.style_json.table_border }}>
                    <thead>
                      <tr>
                        {content.body.table.headers.map((header, idx) => (
                          <th
                            key={idx}
                            className="px-4 py-3 text-left text-sm font-semibold border"
                            style={{
                              backgroundColor: style.style_json.table_header_background,
                              color: style.style_json.table_header_text,
                              borderColor: style.style_json.table_border,
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {content.body.table.rows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className="px-4 py-3 text-sm border"
                              style={{ borderColor: style.style_json.table_border, color: style.style_json.plain_text }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bullet List */}
                <ul className="space-y-2 pl-6">
                  {content.body.list.map((item, idx) => (
                    <li key={idx} className="list-disc" style={{ color: style.style_json.plain_text }}>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Image Placeholder */}
                <div
                  className="w-full h-48 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: style.style_json.border_color, opacity: 0.3 }}
                >
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: style.style_json.plain_text }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center pt-4">
                  <button
                    className="px-8 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    style={{
                      backgroundColor: style.style_json.button_background,
                      color: style.style_json.button_text,
                    }}
                  >
                    {content.body.ctaText}
                  </button>
                </div>
              </div>

              {/* Email Footer */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: style.style_json.border_color }}>
                <div className="text-center space-y-2">
                  <p className="text-xs" style={{ color: style.style_json.link_color }}>
                    <a href="#" className="hover:underline">
                      {content.footer.unsubscribeText}
                    </a>
                  </p>
                  <p
                    className="text-xs opacity-60"
                    style={{ color: style.style_json.plain_text, fontFamily: style.style_json.font_family }}
                  >
                    {content.footer.companyInfo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
