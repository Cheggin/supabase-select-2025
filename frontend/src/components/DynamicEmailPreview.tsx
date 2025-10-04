import { useState, useEffect, useRef } from 'react';

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

// Interface for actual email content
interface EmailContent {
  sender: {
    name: string;
    email: string;
    initials?: string;
  };
  subject: string;
  timestamp: string;
  body: {
    paragraphs?: string[];  // Array of paragraph text
    quote?: string;
    list?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    ctaButton?: {
      text: string;
      url: string;
    };
    images?: Array<{
      url: string;
      alt: string;
    }>;
  };
  footer?: string;
}

interface DynamicEmailPreviewProps {
  styles: EmailStyleJSON;
  emailContent?: EmailContent;
  rawHtml?: string;  // Option to pass raw HTML from actual email
  onStylesApplied?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
  hasGeneratedStyles?: boolean;
  onNavigateHistory?: (direction: 'back' | 'forward') => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  historyPosition?: string;
}

// Default sample content for testing
const defaultEmailContent: EmailContent = {
  sender: {
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    initials: 'SJ'
  },
  subject: 'Q4 Product Launch Update & Next Steps',
  timestamp: '2:30 PM',
  body: {
    paragraphs: [
      "Hi team! I wanted to share some exciting updates about our Q4 product launch.",
      "Based on our recent user testing, we've identified three key areas for improvement before launch. The feedback has been overwhelmingly positive."
    ],
    quote: "Innovation distinguishes between a leader and a follower.",
    list: [
      'Complete final round of user testing by October 18th',
      'Prepare marketing materials and launch campaign assets',
      'Schedule team training sessions for customer support'
    ],
    table: {
      headers: ['Feature', 'Status', 'Target Date'],
      rows: [
        ['User Dashboard', 'Complete', 'Oct 15'],
        ['Analytics Suite', 'In Progress', 'Oct 22'],
        ['Mobile App', 'Testing', 'Oct 29']
      ]
    },
    ctaButton: {
      text: 'View Full Roadmap',
      url: '#'
    }
  },
  footer: '© 2024 Company Inc. • Unsubscribe'
};

export default function DynamicEmailPreview({
  styles,
  emailContent = defaultEmailContent,
  rawHtml,
  onStylesApplied,
  onSave,
  isSaving = false,
  saveSuccess = false,
  hasGeneratedStyles = false,
  onNavigateHistory,
  canGoBack = false,
  canGoForward = false,
  historyPosition = ''
}: DynamicEmailPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  // Generate initials from name if not provided
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    if (!iframeRef.current) return;

    // If raw HTML is provided, apply styles to it, otherwise generate from structured content
    let htmlContent: string;

    if (rawHtml) {
      // Apply styles to raw HTML (this would need a parser in production)
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <div style="${styles.email_container}">
            ${rawHtml}
          </div>
        </body>
        </html>
      `;
    } else {
      // Generate HTML from structured content
      const initials = emailContent.sender.initials || getInitials(emailContent.sender.name);

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          <div style="${styles.email_container}">
            <!-- Email Header -->
            <div style="${styles.sender_section}">
              <div style="${styles.sender_avatar}">${initials}</div>
              <div style="flex: 1;">
                <div style="${styles.sender_name}">${emailContent.sender.name}</div>
                <div style="${styles.sender_email}">${emailContent.sender.email}</div>
              </div>
              <div style="${styles.timestamp}">${emailContent.timestamp}</div>
            </div>

            <!-- Subject -->
            <h1 style="${styles.subject}">${emailContent.subject}</h1>

            <!-- Body Content -->
            ${emailContent.body.paragraphs ? emailContent.body.paragraphs.map(p =>
              `<p style="${styles.paragraph}">${p}</p>`
            ).join('') : ''}

            ${emailContent.body.quote ?
              `<blockquote style="${styles.quote_block}">${emailContent.body.quote}</blockquote>` : ''
            }

            ${emailContent.body.table ? `
              <table style="${styles.table}">
                <thead>
                  <tr>
                    ${emailContent.body.table.headers.map(header =>
                      `<th style="${styles.table_header}">${header}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${emailContent.body.table.rows.map(row => `
                    <tr>
                      ${row.map(cell => `<td style="${styles.table_cell}">${cell}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}

            ${emailContent.body.list ? `
              <ul style="${styles.list}">
                ${emailContent.body.list.map(item =>
                  `<li style="${styles.list_item}">${item}</li>`
                ).join('')}
              </ul>
            ` : ''}

            ${emailContent.body.images ? emailContent.body.images.map(img =>
              `<img src="${img.url}" alt="${img.alt}" style="${styles.image}" />`
            ).join('') : ''}

            ${emailContent.body.ctaButton ? `
              <div style="text-align: center; margin: 24px 0;">
                <a href="${emailContent.body.ctaButton.url}" style="${styles.button}">
                  ${emailContent.body.ctaButton.text}
                </a>
              </div>
            ` : ''}

            ${emailContent.footer ?
              `<div style="${styles.footer}">${emailContent.footer}</div>` : ''
            }
          </div>
        </body>
        </html>
      `;
    }

    // Write the HTML to the iframe
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      onStylesApplied?.();
    }
  }, [styles, emailContent, rawHtml, onStylesApplied]);

  return (
    <div className="h-full flex flex-col bg-gray-100 p-6">
      {/* Header with title and device toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Live Preview</h2>

          {/* History Navigation */}
          {onNavigateHistory && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateHistory('back')}
                disabled={!canGoBack}
                className={`p-2 rounded-lg transition-colors ${
                  canGoBack
                    ? 'bg-white hover:bg-gray-100 text-gray-700 shadow-sm border border-gray-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title="Previous style"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {historyPosition && (
                <span className="text-sm text-gray-500 min-w-[60px] text-center">
                  {historyPosition}
                </span>
              )}

              <button
                onClick={() => onNavigateHistory('forward')}
                disabled={!canGoForward}
                className={`p-2 rounded-lg transition-colors ${
                  canGoForward
                    ? 'bg-white hover:bg-gray-100 text-gray-700 shadow-sm border border-gray-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title="Next style"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Device View Toggle */}
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`px-4 py-2 rounded-l-lg transition-colors ${
                deviceView === 'desktop'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Desktop view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`px-4 py-2 rounded-r-lg transition-colors ${
                deviceView === 'mobile'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Mobile view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

        </div>
      </div>


      {/* Preview Container with responsive width */}
      <div className="flex-1 flex items-center justify-center bg-gray-200 rounded-lg p-4 overflow-auto">
        <div
          className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${
            deviceView === 'mobile'
              ? 'w-full max-w-sm h-[667px]'
              : 'w-full h-full max-w-4xl'
          }`}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 rounded-lg"
            title="Email Preview"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}