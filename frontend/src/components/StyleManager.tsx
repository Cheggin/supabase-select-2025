import { useState, useEffect } from 'react';
import { saveEmailStyle, getSavedStyles } from '../services/supabase';
import { generateEmailStylesFromPrompt } from '../services/llmStyleGenerator';
import DynamicEmailPreview from './DynamicEmailPreview';

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

// Default style to always show in preview
const defaultStyle: EmailStyleJSON = {
  email_container: 'background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);',
  sender_section: 'display: flex; align-items: center; gap: 16px; margin-bottom: 24px;',
  sender_avatar: 'width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;',
  sender_name: 'font-size: 16px; font-weight: 600; color: #1a1a1a;',
  sender_email: 'font-size: 14px; color: #6b7280;',
  timestamp: 'font-size: 12px; color: #9ca3af;',
  subject: 'font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;',
  paragraph: 'font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px;',
  quote_block: 'border-left: 4px solid #8b5cf6; background-color: #f3f4f6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; color: #4b5563; font-style: italic;',
  table: 'width: 100%; border-collapse: collapse; margin: 16px 0;',
  table_header: 'background-color: #f9fafb; color: #111827; padding: 12px; text-align: left; border: 1px solid #e5e7eb; font-weight: 600;',
  table_cell: 'padding: 12px; border: 1px solid #e5e7eb; color: #374151;',
  list: 'margin: 16px 0; padding-left: 24px; color: #374151;',
  list_item: 'margin-bottom: 8px; line-height: 1.6;',
  button: 'display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;',
  link: 'color: #6366f1; text-decoration: underline;',
  image: 'max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;',
  footer: 'margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af;'
};

export default function StyleManager() {
  const [prompt, setPrompt] = useState('');
  // Start with default styles so preview is always visible
  const [currentStyles, setCurrentStyles] = useState<EmailStyleJSON>(defaultStyle);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedStyleId, setSavedStyleId] = useState<string | null>(null);
  const [hasGeneratedStyles, setHasGeneratedStyles] = useState(false);

  // Style history tracking
  const [styleHistory, setStyleHistory] = useState<EmailStyleJSON[]>([defaultStyle]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const handleGenerateStyles = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setSaveSuccess(false);
    setCurrentPrompt(prompt); // Store prompt for saving
    try {
      const styles = await generateEmailStylesFromPrompt(prompt);

      // Add new style to history
      const newHistory = styleHistory.slice(0, historyIndex + 1);
      newHistory.push(styles);
      setStyleHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      setCurrentStyles(styles);
      setHasGeneratedStyles(true);
      setSavedStyleId(null); // Reset saved ID when generating new styles
    } catch (error) {
      console.error('Error generating styles:', error);
      alert('Failed to generate styles. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveStyles = async () => {
    if (!currentStyles) return;

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const result = await saveEmailStyle(currentStyles, currentPrompt);

      if (result.error) {
        alert(`Failed to save styles: ${result.error}`);
      } else {
        setSavedStyleId(result.id);
        setSaveSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving styles:', error);
      alert('Failed to save styles. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigateHistory = (direction: 'back' | 'forward') => {
    const newIndex = direction === 'back' ? historyIndex - 1 : historyIndex + 1;
    if (newIndex >= 0 && newIndex < styleHistory.length) {
      setHistoryIndex(newIndex);
      setCurrentStyles(styleHistory[newIndex]);
      setSaveSuccess(false);
      setSavedStyleId(null);
      // Only show hasGeneratedStyles if not on default style
      setHasGeneratedStyles(newIndex > 0);
    }
  };

  const loadSavedStyles = async () => {
    setIsLoadingSaved(true);
    try {
      const savedStyles = await getSavedStyles();
      if (savedStyles && savedStyles.length > 0) {
        // Convert saved styles to EmailStyleJSON format, filtering out invalid ones
        const loadedStyles = savedStyles
          .map(item => {
            const style = item.styling_json as any; // Changed from style_json to styling_json
            // Check if the style has all required properties
            if (style && style.email_container) {
              // If it's missing some properties, merge with defaults
              return { ...defaultStyle, ...style } as EmailStyleJSON;
            }
            return null;
          })
          .filter(style => style !== null) as EmailStyleJSON[];

        if (loadedStyles.length === 0) {
          console.log('No valid saved styles found');
          return;
        }

        // Add loaded styles to history (keeping default as first)
        const newHistory = [defaultStyle, ...loadedStyles];
        setStyleHistory(newHistory);

        // Stay on default style initially
        console.log(`Loaded ${loadedStyles.length} saved styles`);
      }
    } catch (error) {
      console.error('Error loading saved styles:', error);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  // Load saved styles on component mount
  useEffect(() => {
    loadSavedStyles();
  }, []);

  const examplePrompts = [
    "Cyberpunk theme with neon colors and tech vibes",
    "Minimal and clean with subtle blue accents",
    "Warm and friendly with coral and cream tones",
    "Dark mode with purple gradients",
    "Professional corporate with navy and gold"
  ];

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Controls */}
      <div className="lg:w-1/2 p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Email Style Generator
          </h1>
          <p className="text-gray-600 mb-6">
            Describe your ideal email style and watch it come to life
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
              className="w-full min-h-[120px] p-4 rounded-xl border-2 border-purple-200
                       focus:border-purple-400 focus:ring-4 focus:ring-purple-100
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
                  className="px-3 py-1.5 text-xs rounded-full bg-white border border-purple-200
                           hover:border-purple-400 hover:bg-purple-50
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
              className="w-full py-3 px-6 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-purple-500 to-cyan-500
                       hover:from-purple-600 hover:to-cyan-600
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl
                       transform hover:scale-[1.02] active:scale-[0.98]
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
                '✨ Generate Styles'
              )}
            </button>
          </div>

          {/* Status Info */}
          {savedStyleId && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">
                Style saved with ID: <code className="bg-gray-100 px-2 py-1 rounded">{savedStyleId}</code>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Preview (Always visible) */}
      <div className="lg:w-1/2 bg-gray-100">
        <DynamicEmailPreview
          styles={currentStyles}
          onSave={handleSaveStyles}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          hasGeneratedStyles={hasGeneratedStyles}
          onNavigateHistory={handleNavigateHistory}
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < styleHistory.length - 1}
          historyPosition={`${historyIndex + 1} / ${styleHistory.length}`}
        />
      </div>
    </div>
  );
}