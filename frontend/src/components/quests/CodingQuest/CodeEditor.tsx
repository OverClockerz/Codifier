import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { Settings2, RotateCcw, Type, ListOrdered, Sun, Moon } from 'lucide-react';

// Access Prism from global scope (loaded via CDN)
declare global {
  interface Window {
    Prism: any;
  }
}

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language, readOnly = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Editor Settings State
  const [fontSize, setFontSize] = useState(14);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [islightTheme, setIsLightTheme] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasSavedContent, setHasSavedContent] = useState(false);
  const prismLoadedRef = useRef(false);

  // Auto-save logic
  useEffect(() => {
    if (!code) return;
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`gemini_autosave_${language}`, code);
      setHasSavedContent(true);
    }, 2000); // Debounce save every 2s

    return () => clearTimeout(timeoutId);
  }, [code, language]);

  // Check for saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem(`gemini_autosave_${language}`);
    if (saved && saved !== code) {
      setHasSavedContent(true);
    }
  }, [language]);

  // Dynamically load Prism (CSS + languages) when component mounts or language changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.Prism) {
      prismLoadedRef.current = true;
      return;
    }

    const cssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
    if (!document.querySelector('link[data-prism]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      link.setAttribute('data-prism', '');
      document.head.appendChild(link);
    }

    const loadScript = (src: string) =>
      new Promise<void>((res, rej) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => res();
        s.onerror = () => rej();
        document.head.appendChild(s);
      });

    const base = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js'),
      loadScript(base + 'prism-clike.min.js'),
      loadScript(base + 'prism-python.min.js'),
      loadScript(base + 'prism-java.min.js')
    ])
      .then(() => {
        prismLoadedRef.current = true;
      })
      .catch(() => {
        console.warn('Prism failed to load from CDN');
      });
  }, [language]);

  const restoreCode = () => {
    const saved = localStorage.getItem(`gemini_autosave_${language}`);
    if (saved) {
      if (confirm('Restore code from last auto-save? This will overwrite current changes.')) {
        onChange(saved);
      }
    }
  };

  const highlightCode = (input: string) => {
    const escapeHtml = (str: string) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    if (typeof window !== 'undefined' && window.Prism && prismLoadedRef.current) {
      const langKey = language === 'java' ? 'java' : language === 'python' ? 'python' : language;
      const prismLang = window.Prism.languages[langKey] || window.Prism.languages.clike;
      try {
        return window.Prism.highlight(input, prismLang, langKey);
      } catch (e) {
        return escapeHtml(input);
      }
    }

    return escapeHtml(input);
  };

  // Line numbering helper
  const lineCount = code.split('\n').length;

  // Shared font styles to ensure strict alignment between gutter, editor, and cursor
  const fontStyle = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: fontSize,
    lineHeight: '24px',
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col transition-colors border-t border-slate-700
      ${islightTheme ? 'bg-slate-50' : 'bg-editor-bg'} 
      ${isFocused ? '' : ''}`}
    >
      {/* Settings Toolbar Overlay */}
      <div className="absolute top-2 right-4 z-20 flex gap-2">
        {hasSavedContent && (
          <button
            onClick={restoreCode}
            title="Restore from Auto-save"
            className="p-1.5 rounded bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        )}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded transition-colors ${showSettings ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
        >
          <Settings2 size={14} />
        </button>
      </div>

      {showSettings && (
        <div className="absolute top-10 right-4 z-30 bg-[#1e293b] border border-slate-600 p-3 rounded-lg shadow-xl w-48 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-300">
            <span className="flex items-center gap-2"><Type size={12} /> Font Size</span>
            <input
              type="range" min="10" max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-300">
            <span className="flex items-center gap-2"><ListOrdered size={12} /> Line Nums</span>
            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className={`w-8 h-4 rounded-full relative transition-colors ${showLineNumbers ? 'bg-blue-600' : 'bg-slate-600'}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${showLineNumbers ? 'left-4.5' : 'left-0.5'}`}></div>
            </button>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-300">
            <span className="flex items-center gap-2">{islightTheme ? <Moon size={12} /> : <Sun size={12} />} Theme</span>
            <button
              onClick={() => setIsLightTheme(!islightTheme)}
              className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600"
            >
              {islightTheme ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      )}

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-auto relative custom-scrollbar flex items-start">

        {/* Line Numbers Gutter */}
        {showLineNumbers && (
          <div
            className={`shrink-0 pt-4 pr-3 text-right select-none min-w-12 border-r min-h-full
             ${islightTheme ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-editor-bg text-slate-600 border-slate-800'}`}
            style={fontStyle}
          >
            {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1).map((num) => (
              <div key={num} className="px-1">{num}</div>
            ))}
          </div>
        )}

        {/* Editor Wrapper - isolates the Editor from flex issues */}
        <div className="flex-1 min-w-0 min-h-full">
          <Editor
            value={code}
            onValueChange={onChange}
            highlight={highlightCode}
            padding={16}
            disabled={readOnly}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`font-mono min-h-full ${islightTheme ? 'text-gray-800' : 'text-editor-fg'}`}
            style={{
              ...fontStyle,
              backgroundColor: 'transparent',
              minHeight: '100%',
              whiteSpace: 'pre', // Prevents wrapping to ensure 1-to-1 match with line numbers
              overflow: 'visible', // Ensures content isn't clipped
            }}
            textareaClassName="focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};