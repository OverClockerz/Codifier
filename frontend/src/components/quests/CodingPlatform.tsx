import React from 'react';
import { useCodingPlatform } from '../../hooks/useCodingPlatform';
// import { Header } from './CodingQuest/Header';
import { ConfirmationModal } from './CodingQuest/ConfirmationModal';
import { AiChatOverlay } from './CodingQuest/AiChatOverlay';
import { CodeEditor } from './CodingQuest/CodeEditor';
import { ProblemDescription } from './CodingQuest/ProblemDescription';
import { ConsolePanel } from './CodingQuest/ConsolePanel';
import { SupportedLanguage } from '../../types/types';
import { Play, Send, Zap, ChevronDown, WifiOff } from 'lucide-react';

interface CodingPlatformProps {
  className?: string;
  onComplete?: (success: boolean, score: number) => void;
}

export const CodingPlatform: React.FC<CodingPlatformProps> = ({ className = "h-screen", onComplete }) => {
  const { state, actions } = useCodingPlatform();
  const {
    problem, code, evaluation, isGenerating, isRunning, activeTab,
    showAiChat, aiMessage, backendError, customInput, customOutput,
    difficulty, language, showConfirmDialog, pendingLanguage
  } = state;

  return (
    <div className={`flex flex-col bg-[#0f172a] text-slate-200 font-sans overflow-hidden relative ${className}`}>

      {backendError && (
        <div className="bg-red-900/50 border-b border-red-500/50 px-4 py-2 text-red-200 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
          <WifiOff size={14} />
          {backendError}
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirmDialog}
        pendingLanguage={pendingLanguage}
        onCancel={() => actions.setShowConfirmDialog(false)}
        onConfirm={() => pendingLanguage && actions.executeLanguageChange(pendingLanguage)}
      />

      {/* <Header 
        difficulty={difficulty}
        setDifficulty={actions.setDifficulty}
        isGenerating={isGenerating}
        onGenerate={actions.handleGenerateProblem}
      /> */}

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 md:w-5/12 border-r border-slate-700 flex flex-col bg-[#0f172a]">
          {problem ? (
            <ProblemDescription problem={problem} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
              {isGenerating || !backendError ? (
                <>
                  <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">{backendError ? "Reconnecting..." : "Generating Challenge..."}</span>
                </>
              ) : (
                <div className="text-center p-6">
                  <WifiOff className="mx-auto mb-2 text-slate-600" size={32} />
                  <p className="text-sm text-slate-400">Please start the backend server.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/2 md:w-7/12 flex flex-col bg-editor-bg">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-[#1e293b]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-medium">Language:</span>
                <div className="relative group">
                  <select
                    className="appearance-none bg-slate-800 border border-slate-600 hover:border-slate-500 rounded px-2 pl-3 pr-7 py-1 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
                    value={language}
                    onChange={(e) => actions.initiateLanguageChange(e.target.value as SupportedLanguage)}
                  >
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1.5 text-slate-400 pointer-events-none group-hover:text-slate-300" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className={`w-2 h-2 rounded-full ${backendError ? 'bg-red-500' : 'bg-green-500'}`}></span>
              {backendError ? 'Offline' : 'Ready'}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 relative">
            <CodeEditor code={code} onChange={actions.setCode} language={language} />
            <AiChatOverlay isOpen={showAiChat} message={aiMessage} onClose={() => actions.setShowAiChat(false)} />
          </div>

          <div className="h-14 bg-[#1e293b] border-y border-slate-700 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <button onClick={actions.handleAiAssist} className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-amber-400 px-3 py-2 rounded-lg hover:bg-amber-400/10 transition-colors">
                <Zap size={14} className={aiMessage === 'Thinking...' ? 'animate-pulse' : ''} /> Get Hint
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => actions.handleRunCode(false)} disabled={isRunning || !problem || !!backendError} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold transition-all disabled:opacity-50">
                <Play size={14} fill="currentColor" /> {activeTab === 'custom' ? 'Run Custom' : 'Run Tests'}
              </button>
              <button
                onClick={async () => {
                  if (!problem) return;
                  const res: any = await actions.handleRunCode(true);
                  // derive performance score
                  let perf = 0;
                  if (res) {
                    if (typeof res.score === 'number') perf = Math.round(res.score);
                    else if (res.totalTests && res.results) {
                      const passed = res.results.filter((r: any) => r.passed).length;
                      perf = Math.round((passed / res.totalTests) * 100);
                    }
                  }
                  const success = perf >= 60;
                  onComplete && onComplete(success, perf);
                }}
                disabled={isRunning || !problem || !!backendError}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                <Send size={14} /> Submit
              </button>
            </div>
          </div>

          <div className="h-[35%] min-h-50 shrink-0">
            <ConsolePanel
              result={evaluation} isLoading={isRunning} activeTab={activeTab} setActiveTab={actions.setActiveTab}
              customInput={customInput} setCustomInput={actions.setCustomInput} customOutput={customOutput}
            />
          </div>
        </div>
      </main>
    </div>
  );
};