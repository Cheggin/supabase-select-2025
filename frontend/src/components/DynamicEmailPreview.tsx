import { useState, useEffect, useRef } from 'react';

// Define type for styleable email content only (what you can actually style in Gmail)
interface EmailStyleJSON {
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

// Interface for actual email content (Gmail-realistic with sections)
interface EmailContent {
  // Gmail UI elements (not styleable)
  sender: {
    name: string;
    email: string;
    initials?: string;
  };
  recipients?: string;
  subject: string;
  timestamp: string;
  labels?: string[];

  // Email body content (styleable)
  body: {
    // Header section
    header: {
      title: string;
      subtitle?: string;
    };

    // Text section
    textContent: {
      paragraphs: string[];
      hasEmphasis?: boolean; // Will show bold/italic examples
    };

    // Links section
    links: Array<{
      text: string;
      url: string;
      isButton?: boolean;
    }>;

    // Lists section
    lists: {
      unordered?: string[];
      ordered?: string[];
    };


    // Table section
    table?: {
      headers: string[];
      rows: string[][];
    };

    // Signature
    signature: {
      name: string;
      role?: string;
      company?: string;
    };
  };
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
  activeStyleId?: string | null;
  currentStyleId?: string | null;
  onActivateStyle?: (styleId: string) => void;
  isActivating?: boolean;
}

// Default sample content for testing (comprehensive Gmail sections)
const defaultEmailContent: EmailContent = {
  sender: {
    name: 'GitHub',
    email: 'noreply@github.com',
    initials: 'GH'
  },
  recipients: 'to me',
  subject: 'Weekly Update - Project Status',
  timestamp: '10:30 AM',
  body: {
    header: {
      title: 'Project Status Update',
      subtitle: 'Week of October 4, 2024'
    },
    textContent: {
      paragraphs: [
        'This is your weekly project status update. Below you\'ll find important updates, action items, and upcoming deadlines.',
        'Please review all sections carefully and reach out if you have any questions or concerns.',
      ],
      hasEmphasis: true
    },
    links: [
      { text: 'View Dashboard', url: '#', isButton: true },
      { text: 'Download Report', url: '#', isButton: true },
      { text: 'View documentation', url: '#', isButton: false },
      { text: 'Contact support', url: '#', isButton: false }
    ],
    lists: {
      unordered: [
        'Complete code review by Friday',
        'Update documentation for new features',
        'Schedule team sync for next week'
      ],
      ordered: [
        'Deploy to staging environment',
        'Run automated tests',
        'Review test results',
        'Deploy to production'
      ]
    },
    table: {
      headers: ['Task', 'Owner', 'Status', 'Due Date'],
      rows: [
        ['API Integration', 'John D.', 'In Progress', 'Oct 15'],
        ['UI Updates', 'Sarah M.', 'Complete', 'Oct 10'],
        ['Testing', 'Mike R.', 'Pending', 'Oct 20']
      ]
    },
    signature: {
      name: 'The GitHub Team',
      role: 'Product Updates',
      company: 'GitHub, Inc.'
    }
  }
};

export default function DynamicEmailPreview({
  styles,
  emailContent = defaultEmailContent,
  rawHtml,
  onStylesApplied,
  onNavigateHistory,
  canGoBack = false,
  canGoForward = false,
  historyPosition = '',
  activeStyleId = null,
  currentStyleId = null,
  onActivateStyle,
  isActivating = false
}: DynamicEmailPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [developerMode, setDeveloperMode] = useState(false);

  // Generate initials from name if not provided
  const getInitials = (name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
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
          <div style="${styles.email_body}">
            ${rawHtml}
          </div>
        </body>
        </html>
      `;
    } else {
      // Generate HTML from structured content
      const initials = emailContent.sender.initials || getInitials(emailContent.sender.name);

      // Developer mode styles for section boundaries
      const devSectionStyle = developerMode ? `
        border: 1px dashed #9CA3AF;
        position: relative;
        padding: 8px;
        margin: 8px 0;
      ` : '';

      const devLabelStyle = developerMode ? `
        position: absolute;
        bottom: -10px;
        left: 8px;
        background: white;
        color: #4B5563;
        padding: 2px 8px;
        font-size: 11px;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
        border: 1px solid #D1D5DB;
        border-radius: 4px;
        z-index: 10;
      ` : 'display: none;';

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
            .dev-section { ${devSectionStyle} }
            .dev-label { ${devLabelStyle} }
          </style>
        </head>
        <body style="background: #f0f2f5; padding: 20px;">
          <!-- Gmail UI (NOT STYLEABLE) -->
          <div style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); max-width: 900px; margin: 0 auto;">
            <!-- Gmail Header -->
            <div style="padding: 16px; border-bottom: 1px solid #e8eaed;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: #ea4335; color: white; display: flex; align-items: center; justify-content: center; font-weight: 500;">
                  ${initials}
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 500; color: #202124;">${emailContent.sender.name}</div>
                  <div style="font-size: 12px; color: #5f6368;">
                    ${emailContent.recipients || 'to me'}
                  </div>
                </div>
                <div style="font-size: 13px; color: #5f6368;">${emailContent.timestamp}</div>
              </div>
              <h2 style="margin: 0; font-size: 20px; font-weight: 400; color: #202124;">
                ${emailContent.subject}
              </h2>
              ${emailContent.labels && emailContent.labels.length > 0 ? `
                <div style="margin-top: 8px; display: flex; gap: 6px;">
                  ${emailContent.labels.map((label: string) => `
                    <span style="display: inline-block; padding: 2px 8px; background: #f8f9fa; color: #5f6368; font-size: 11px; border-radius: 3px; border: 1px solid #dadce0;">
                      ${label}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <!-- EMAIL BODY (STYLEABLE CONTENT) -->
            <div style="padding: 20px; background-color: ${styles.background_color}; ${styles.email_body}">

              <!-- Header Section -->
              <div class="dev-section" style="${styles.header_section}">
                <span class="dev-label">header_section</span>
                <h1 style="${styles.header_title}">${emailContent.body.header.title}</h1>
                ${emailContent.body.header.subtitle ?
                  `<p style="${styles.header_subtitle}">${emailContent.body.header.subtitle}</p>` : ''}
              </div>

              <!-- Text Section -->
              <div class="dev-section" style="${styles.text_section}">
                <span class="dev-label">text_section</span>
                ${emailContent.body.textContent.paragraphs.map((p: string) =>
                  `<p style="${styles.paragraph}">${p}</p>`
                ).join('')}
                ${emailContent.body.textContent.hasEmphasis ? `
                  <p style="${styles.paragraph}">
                    This text has <span style="${styles.bold_text}">bold emphasis</span> and
                    <span style="${styles.italic_text}">italic emphasis</span> for highlighting.
                  </p>
                ` : ''}
              </div>

              <!-- Links Section (text links only) -->
              ${emailContent.body.links && emailContent.body.links.filter(l => !l.isButton).length > 0 ? `
                <div class="dev-section" style="${styles.links_section}">
                  <span class="dev-label">links_section</span>
                  <div style="margin: 16px 0;">
                    ${emailContent.body.links
                      .filter(link => !link.isButton)
                      .map((link, index) => `${index > 0 ? ' ' : ''}<a href="${link.url}" style="${styles.link}">${link.text}</a>`)
                      .join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Buttons Section (CTA buttons) -->
              ${emailContent.body.links && emailContent.body.links.filter(l => l.isButton).length > 0 ? `
                <div class="dev-section" style="${styles.links_section}">
                  <span class="dev-label">button_section</span>
                  <div style="margin: 20px 0; text-align: center;">
                    ${emailContent.body.links
                      .filter(link => link.isButton)
                      .map(link => `<a href="${link.url}" style="${styles.link_button}; margin: 0 8px;">${link.text}</a>`)
                      .join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Lists Section -->
              ${emailContent.body.lists ? `
                <div class="dev-section" style="${styles.list_section}">
                  <span class="dev-label">list_section</span>
                  ${emailContent.body.lists.unordered ? `
                    <ul style="${styles.unordered_list}">
                      ${emailContent.body.lists.unordered.map((item: string) =>
                        `<li style="${styles.list_item}">${item}</li>`
                      ).join('')}
                    </ul>
                  ` : ''}
                  ${emailContent.body.lists.ordered ? `
                    <ol style="${styles.ordered_list}">
                      ${emailContent.body.lists.ordered.map((item: string) =>
                        `<li style="${styles.list_item}">${item}</li>`
                      ).join('')}
                    </ol>
                  ` : ''}
                </div>
              ` : ''}


              <!-- Table Section -->
              ${emailContent.body.table ? `
                <div class="dev-section" style="${styles.table_section}">
                  <span class="dev-label">table_section</span>
                  <table style="${styles.table}">
                    <thead>
                      <tr>
                        ${emailContent.body.table.headers.map((header: string) =>
                          `<th style="${styles.table_header}">${header}</th>`
                        ).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      ${emailContent.body.table.rows.map((row: string[]) => `
                        <tr>
                          ${row.map((cell: string) =>
                            `<td style="${styles.table_cell}">${cell}</td>`
                          ).join('')}
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : ''}

              <!-- Signature Section -->
              <div class="dev-section" style="${styles.signature_section}">
                <span class="dev-label">signature_section</span>
                <div style="${styles.divider}"></div>
                <div style="${styles.signature_text}">
                  <div>${emailContent.body.signature.name}</div>
                  ${emailContent.body.signature.role ? `<div>${emailContent.body.signature.role}</div>` : ''}
                  ${emailContent.body.signature.company ? `<div>${emailContent.body.signature.company}</div>` : ''}
                </div>
              </div>

            </div>
          </div>
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
  }, [styles, emailContent, rawHtml, onStylesApplied, developerMode]);

  return (
    <div className="h-full flex flex-col bg-gray-100 p-6" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" }}>
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
          {/* Developer Mode Toggle Switch */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Dev Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={developerMode}
                onChange={() => setDeveloperMode(!developerMode)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Active Style Toggle Switch */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${currentStyleId ? 'text-gray-600' : 'text-gray-400'}`}>
              Active
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentStyleId ? activeStyleId === currentStyleId : false}
                onChange={() => {
                  console.log('Active toggle clicked');
                  console.log('currentStyleId:', currentStyleId);
                  console.log('onActivateStyle exists:', !!onActivateStyle);
                  if (currentStyleId && onActivateStyle) {
                    console.log('Calling onActivateStyle with:', currentStyleId);
                    onActivateStyle(currentStyleId);
                  }
                }}
                disabled={!currentStyleId || isActivating}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
            </label>
            {isActivating && (
              <svg className="animate-spin h-4 w-4 text-gray-600" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
          </div>

          {/* Device View Toggle */}
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`px-4 py-2 rounded-l-lg transition-colors ${
                deviceView === 'desktop'
                  ? 'bg-indigo-600 text-white'
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
                  ? 'bg-indigo-600 text-white'
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