import { useState } from 'react';

// Define types directly
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

interface StyleHistoryItem {
  id: string;
  prompt: string;
  style: EmailStyle;
  createdAt: string;
}

interface PromptInterfaceProps {
  onGenerateStyle: (prompt: string) => void;
  styleHistory: StyleHistoryItem[];
  onSelectStyle: (style: EmailStyle) => void;
  isGenerating: boolean;
}

const examplePrompts = [
  "Make my emails look cyberpunk with neon accents",
  "Clean and minimal design with blue gradients",
  "Warm and friendly with coral and cream tones",
  "Professional corporate style with navy and gold",
  "Retro 80s vibe with purple and pink",
];

export default function PromptInterface({
  onGenerateStyle,
  styleHistory,
  onSelectStyle,
  isGenerating,
}: PromptInterfaceProps) {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerateStyle(prompt);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-cyan-50 to-coral-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-coral-600 bg-clip-text text-transparent mb-2">
          Better Inbox
        </h1>
        <p className="text-gray-600">Describe your dream email style and watch it come to life</p>
      </div>

      {/* Prompt Input */}
      <div className="flex-1 flex flex-col mb-6">
        <label htmlFor="prompt" className="text-sm font-medium text-gray-700 mb-2">
          Describe your email style
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Try: Make my emails look cyberpunk with neon accents..."
          className="flex-1 min-h-[200px] p-4 rounded-2xl border-2 border-purple-200
                   focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                   transition-all duration-200 resize-none
                   text-gray-800 placeholder-gray-400
                   shadow-sm hover:shadow-md"
        />

        {/* Example Prompts */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1.5 text-xs rounded-full bg-white border border-purple-200
                         hover:border-purple-400 hover:bg-purple-50
                         transition-all duration-200 text-gray-700
                         shadow-sm hover:shadow"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="mt-6 w-full py-4 px-6 rounded-2xl font-semibold text-white
                   bg-gradient-to-r from-purple-500 via-cyan-500 to-coral-500
                   hover:from-purple-600 hover:via-cyan-600 hover:to-coral-600
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
            '✨ Generate Style'
          )}
        </button>
      </div>

      {/* Style History */}
      {styleHistory.length > 0 && (
        <div className="border-t-2 border-purple-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Style History</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {styleHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectStyle(item.style)}
                className="w-full text-left p-3 rounded-xl bg-white border border-gray-200
                         hover:border-purple-400 hover:shadow-md
                         transition-all duration-200 group"
              >
                <p className="text-sm text-gray-800 font-medium line-clamp-2 group-hover:text-purple-600">
                  {item.prompt}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
