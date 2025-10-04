import { useState, useEffect, useCallback } from 'react';
import { saveEmailStyle, getSavedStyles, activateStyle, getActiveStyle } from '../services/supabase';
import { generateEmailStylesFromPrompt } from '../services/llmStyleGenerator';
import DynamicEmailPreview from './DynamicEmailPreview';

// Define type for styleable email content only
interface EmailStyleJSON {
  email_body: string;
  background_color: string;
  header_section: string;
  header_title: string;
  header_subtitle: string;
  text_section: string;
  paragraph: string;
  bold_text: string;
  italic_text: string;
  links_section: string;
  link: string;
  link_button: string;
  list_section: string;
  unordered_list: string;
  ordered_list: string;
  list_item: string;
  table_section: string;
  table: string;
  table_header: string;
  table_cell: string;
  signature_section: string;
  signature_text: string;
  divider: string;
}

// Default style - what Gmail actually lets you customize
const defaultStyle: EmailStyleJSON = {
  email_body: 'font-family: Arial, sans-serif; color: #202124; font-size: 14px;',
  background_color: '#ffffff',
  header_section: 'margin-bottom: 24px;',
  header_title: 'font-size: 28px; font-weight: 600; color: #202124; margin: 0 0 8px 0;',
  header_subtitle: 'font-size: 16px; color: #5f6368; margin: 0;',
  text_section: 'margin-bottom: 24px;',
  paragraph: 'font-size: 14px; line-height: 1.6; color: #202124; margin: 12px 0;',
  bold_text: 'font-weight: 600;',
  italic_text: 'font-style: italic;',
  links_section: 'margin-bottom: 24px;',
  link: 'color: #1155cc; text-decoration: none; margin-right: 16px;',
  link_button: 'display: inline-block; padding: 10px 20px; background: #1a73e8; color: white; text-decoration: none; border-radius: 4px; margin-right: 8px;',
  list_section: 'margin-bottom: 24px;',
  unordered_list: 'margin: 12px 0; padding-left: 20px;',
  ordered_list: 'margin: 12px 0; padding-left: 20px;',
  list_item: 'margin: 6px 0; line-height: 1.5;',
  table_section: 'margin-bottom: 24px;',
  table: 'width: 100%; border-collapse: collapse;',
  table_header: 'background: #f8f9fa; padding: 12px; text-align: left; border: 1px solid #e8eaed; font-weight: 600;',
  table_cell: 'padding: 12px; border: 1px solid #e8eaed;',
  signature_section: 'margin-top: 32px;',
  signature_text: 'color: #5f6368; font-size: 13px; line-height: 1.4;',
  divider: 'border-top: 1px solid #e8eaed; margin-bottom: 16px;'
};

export default function StyleManager() {
  const [prompt, setPrompt] = useState('');
  // Start with default styles so preview is always visible
  const [currentStyles, setCurrentStyles] = useState<EmailStyleJSON>(defaultStyle);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedStyleId, setSavedStyleId] = useState<string | null>(null);
  const [hasGeneratedStyles, setHasGeneratedStyles] = useState(false);
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  // Style history tracking (with IDs)
  const [styleHistory, setStyleHistory] = useState<Array<{ style: EmailStyleJSON; id?: string }>>([{ style: defaultStyle }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [, setIsLoadingSaved] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const handleGenerateStyles = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setSaveSuccess(false);
    setCurrentPrompt(prompt); // Store prompt for saving
    try {
      const styles = await generateEmailStylesFromPrompt(prompt);

      // Automatically save to database first
      const result = await saveEmailStyle(styles, prompt);
      let styleId: string | undefined;

      if (result.error) {
        console.error('Failed to auto-save style:', result.error);
      } else if (result.id) {
        styleId = result.id;
        setSavedStyleId(result.id);
        setSaveSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      }

      // Add new style to history with its ID
      const newHistory = styleHistory.slice(0, historyIndex + 1);
      newHistory.push({ style: styles, id: styleId });
      setStyleHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      setCurrentStyles(styles);
      setHasGeneratedStyles(true);
    } catch (error) {
      console.error('Error generating styles:', error);
      alert('Failed to generate styles. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };


  const handleActivateStyle = async (styleId: string) => {
    console.log('handleActivateStyle called with styleId:', styleId);
    console.log('Current activeStyleId:', activeStyleId);

    setIsActivating(true);
    try {
      const success = await activateStyle(styleId);
      console.log('activateStyle result:', success);

      if (success) {
        setActiveStyleId(styleId);
        console.log('Style activated successfully');
      } else {
        alert('Failed to activate style. Please try again.');
      }
    } catch (error) {
      console.error('Error activating style:', error);
      alert('Failed to activate style. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleNavigateHistory = (direction: 'back' | 'forward') => {
    const newIndex = direction === 'back' ? historyIndex - 1 : historyIndex + 1;
    if (newIndex >= 0 && newIndex < styleHistory.length) {
      setHistoryIndex(newIndex);
      const historyItem = styleHistory[newIndex];
      setCurrentStyles(historyItem.style);
      setSaveSuccess(false);
      setSavedStyleId(historyItem.id || null);
      // Only show hasGeneratedStyles if not on default style
      setHasGeneratedStyles(newIndex > 0);
    }
  };

  // Migration function to convert old style format to new format
  const migrateOldStyle = (oldStyle: unknown): EmailStyleJSON => {
    const style = oldStyle as Record<string, string> | null;

    // If it already has the new format, return it merged with defaults
    if (style && 'email_body' in style) {
      return { ...defaultStyle, ...style } as EmailStyleJSON;
    }

    // Convert old format to new format
    return {
      email_body: style?.email_body || style?.email_container || defaultStyle.email_body,
      background_color: style?.background_color || defaultStyle.background_color,
      header_section: style?.header_section || defaultStyle.header_section,
      header_title: style?.header_title || style?.subject || defaultStyle.header_title,
      header_subtitle: style?.header_subtitle || defaultStyle.header_subtitle,
      text_section: style?.text_section || defaultStyle.text_section,
      paragraph: style?.paragraph || defaultStyle.paragraph,
      bold_text: style?.bold_text || defaultStyle.bold_text,
      italic_text: style?.italic_text || defaultStyle.italic_text,
      links_section: style?.links_section || defaultStyle.links_section,
      link: style?.link || defaultStyle.link,
      link_button: style?.link_button || style?.button || defaultStyle.link_button,
      list_section: style?.list_section || defaultStyle.list_section,
      unordered_list: style?.unordered_list || style?.list || defaultStyle.unordered_list,
      ordered_list: style?.ordered_list || defaultStyle.ordered_list,
      list_item: style?.list_item || defaultStyle.list_item,
      table_section: style?.table_section || defaultStyle.table_section,
      table: style?.table || defaultStyle.table,
      table_header: style?.table_header || defaultStyle.table_header,
      table_cell: style?.table_cell || defaultStyle.table_cell,
      signature_section: style?.signature_section || style?.signature_block || defaultStyle.signature_section,
      signature_text: style?.signature_text || style?.signature_name || defaultStyle.signature_text,
      divider: style?.divider || style?.footer || defaultStyle.divider
    };
  };

  const loadSavedStyles = useCallback(async () => {
    setIsLoadingSaved(true);
    try {
      const savedStyles = await getSavedStyles();
      if (savedStyles && savedStyles.length > 0) {
        // Convert saved styles using migration function and keep IDs
        const loadedStylesWithIds = savedStyles
          .map(item => {
            try {
              return {
                style: migrateOldStyle(item.styling_json),
                id: item.id
              };
            } catch (e) {
              console.error('Error migrating style:', e);
              return null;
            }
          })
          .filter(item => item !== null) as Array<{ style: EmailStyleJSON; id: string }>;

        if (loadedStylesWithIds.length === 0) {
          console.log('No valid saved styles found');
          return;
        }

        // Add loaded styles to history (keeping default as first)
        const newHistory: Array<{ style: EmailStyleJSON; id?: string }> = [
          { style: defaultStyle },
          ...loadedStylesWithIds
        ];
        setStyleHistory(newHistory);

        // Stay on default style initially
        console.log(`Loaded and migrated ${loadedStylesWithIds.length} saved styles`);
      }
    } catch (error) {
      console.error('Error loading saved styles:', error);
    } finally {
      setIsLoadingSaved(false);
    }
  }, []);

  // Load saved styles and active style on component mount
  useEffect(() => {
    loadSavedStyles();

    // Load the active style ID
    getActiveStyle().then(activeStyle => {
      if (activeStyle) {
        setActiveStyleId(activeStyle.id!);
      }
    });
  }, [loadSavedStyles]);

  const examplePrompts = [
    "Cyberpunk theme with neon colors and tech vibes",
    "Minimal and clean with subtle blue accents",
    "Warm and friendly with coral and cream tones",
    "Dark mode with purple gradients",
    "Professional corporate with navy and gold"
  ];

  return (
    <div className="h-screen flex flex-col lg:flex-row" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" }}>
      {/* Left Panel - Controls */}
      <div className="lg:w-1/2 p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BetterMail
          </h1>
          <p className="text-gray-600 mb-6">
            Describe your ideal email style and watch it come to life.
          </p>

          {/* Prompt Input */}
          <div className="mb-6">
            <label htmlFor="stylePrompt" className="block text-sm font-medium text-gray-700 mb-2">
              Style Description
            </label>
            <textarea
              id="stylePrompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the style you want..."
              className="w-full min-h-[120px] p-4 rounded-lg border-2 border-gray-300
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                       transition-all duration-200 resize-none"
              disabled={isGenerating}
            />
          </div>

          {/* Example Prompts */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(example)}
                  className="px-3 py-1.5 text-xs rounded-md bg-white border border-gray-300
                           hover:border-gray-400 hover:bg-gray-50
                           transition-all duration-200"
                  disabled={isGenerating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mb-6">
            <button
              onClick={handleGenerateStyles}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-3 px-6 rounded-lg font-medium text-white
                       bg-indigo-600 hover:bg-indigo-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-sm hover:shadow-md
                       transition-all duration-200"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  Generating...
                </span>
              ) : (
                'Generate Styles'
              )}
            </button>
          </div>

          {/* Auto-save Status */}
          {saveSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✓ Style saved to database automatically!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Preview (Always visible) */}
      <div className="lg:w-1/2 bg-gray-100">
        <DynamicEmailPreview
          styles={currentStyles}
          hasGeneratedStyles={hasGeneratedStyles}
          onNavigateHistory={handleNavigateHistory}
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < styleHistory.length - 1}
          historyPosition={`${historyIndex + 1} / ${styleHistory.length}`}
          activeStyleId={activeStyleId}
          currentStyleId={styleHistory[historyIndex]?.id || null}
          onActivateStyle={handleActivateStyle}
          isActivating={isActivating}
        />
      </div>
    </div>
  );
}