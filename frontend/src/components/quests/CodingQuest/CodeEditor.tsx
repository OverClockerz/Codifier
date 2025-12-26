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

  const restoreCode = () => {
    const saved = localStorage.getItem(`gemini_autosave_${language}`);
    if (saved) {
      if (confirm('Restore code from last auto-save? This will overwrite current changes.')) {
        onChange(saved);
      }
    }
  };

  const highlightCode = (input: string) => {
    if (window.Prism) {
      const prismLang = language === 'java' ? window.Prism.languages.java : window.Prism.languages.python;
      return window.Prism.highlight(
        input,
        prismLang || window.Prism.languages.clike,
        language
      );
    }
    return input;
  };

  // Line numbering helper
  const lineCount = code.split('\n').length;

  return (
    <div 
      className={`relative w-full h-full flex flex-col transition-colors border-t border-slate-700
      ${islightTheme ? 'bg-slate-50' : 'bg-[#1e1e1e]'} 
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
              <span className="flex items-center gap-2"><Type size={12}/> Font Size</span>
              <input 
                type="range" min="10" max="24" 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
           </div>
           
           <div className="flex justify-between items-center text-xs text-slate-300">
              <span className="flex items-center gap-2"><ListOrdered size={12}/> Line Nums</span>
              <button 
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={`w-8 h-4 rounded-full relative transition-colors ${showLineNumbers ? 'bg-blue-600' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${showLineNumbers ? 'left-4.5' : 'left-0.5'}`}></div>
              </button>
           </div>

           <div className="flex justify-between items-center text-xs text-slate-300">
              <span className="flex items-center gap-2">{islightTheme ? <Moon size={12}/> : <Sun size={12}/>} Theme</span>
              <button 
                onClick={() => setIsLightTheme(!islightTheme)}
                className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600"
              >
                {islightTheme ? 'Dark' : 'Light'}
              </button>
           </div>
        </div>
      )}

      <div className="flex-1 overflow-auto relative custom-scrollbar flex">
        {/* Line Numbers Gutter */}
        {showLineNumbers && (
           <div 
             className={`flex-shrink-0 pt-4 pr-3 text-right select-none min-w-[3rem] border-r
             ${islightTheme ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-[#1e1e1e] text-slate-600 border-slate-800'}`}
             style={{ 
               fontFamily: '"JetBrains Mono", monospace',
               fontSize: fontSize 
              }}
           >
             {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1).map((num) => (
               <div key={num} className="leading-6 px-1">{num}</div>
             ))}
           </div>
        )}

        <Editor
          value={code}
          onValueChange={onChange}
          highlight={highlightCode}
          padding={16}
          disabled={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`font-mono leading-6 min-h-full flex-1 ${islightTheme ? 'text-gray-800' : 'text-[#d4d4d4]'}`}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: fontSize,
            backgroundColor: 'transparent',
            minHeight: '100%',
          }}
          textareaClassName="focus:outline-none"
        />
      </div>
    </div>
  );
};