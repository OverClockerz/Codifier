import React, { useState, useEffect } from 'react';
import { EvaluationResult } from '../../../types/types';
import { CheckCircle2, XCircle, Terminal, Search, FlaskConical, AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react';

interface Props {
  result: EvaluationResult | null;
  isLoading: boolean;
  
  // UPDATED: Removed 'console' from type
  activeTab: 'test-cases' | 'custom';
  setActiveTab: (tab: 'test-cases' | 'custom') => void;
  
  customInput: string;
  setCustomInput: (val: string) => void;
  customOutput: { output: string; error?: string } | null;
}

export const ConsolePanel: React.FC<Props> = ({ 
  result, 
  isLoading, 
  activeTab, 
  setActiveTab,
  customInput,
  setCustomInput,
  customOutput
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [showFailedOnly, setShowFailedOnly] = useState(false);

  useEffect(() => {
    if (result && !result.passedAll && activeTab === 'test-cases') {
      setShowFailedOnly(true);
    }
  }, [result, activeTab]);

  const filteredResults = result?.results.filter(r => {
    const matchesSearch = 
      r.input.toLowerCase().includes(filterQuery.toLowerCase()) || 
      r.actualOutput.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (r.error && r.error.toLowerCase().includes(filterQuery.toLowerCase()));
    
    const matchesToggle = showFailedOnly ? !r.passed : true;
    
    return matchesSearch && matchesToggle;
  }) || [];

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-slate-700">
      {/* Tabs */}
      <div className="flex items-center border-b border-slate-700 bg-slate-900 justify-between pr-2">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('test-cases')}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'test-cases' ? 'text-white border-b-2 border-blue-500 bg-[#1e1e1e]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <CheckCircle2 size={16} /> Test Results
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'custom' ? 'text-white border-b-2 border-blue-500 bg-[#1e1e1e]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <FlaskConical size={16} /> Custom Test
          </button>
          
          {/* REMOVED CONSOLE TAB BUTTON HERE */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm relative">
        {isLoading ? (
          <div className="absolute inset-0 z-10 bg-[#1e1e1e]/80 flex flex-col items-center justify-center text-slate-400 gap-3 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Evaluating Code...</span>
          </div>
        ) : null}

        {/* CUSTOM TEST TAB */}
        {activeTab === 'custom' && (
          <div className="flex flex-col h-full gap-4">
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Your Input</label>
           <textarea
             value={customInput}
             onChange={(e) => setCustomInput(e.target.value)}
             className="flex-1 w-full bg-[#0f172a] border border-slate-700 rounded-md p-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
             placeholder="Enter your custom test input here..."
             spellCheck={false}
           />
              </div>
              <div className="flex flex-col">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Result</label>
           <div className={`flex-1 w-full rounded-md p-3 font-mono text-sm overflow-auto border ${customOutput?.error ? 'bg-red-900/10 border-red-500/30 text-red-200' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
              {customOutput ? (
                 customOutput.error ? (
             <span className="flex items-start gap-2">
               <AlertTriangle size={14} className="mt-0.5 shrink-0" />
               {customOutput.error}
             </span>
                 ) : (
             <pre className="whitespace-pre-wrap">{customOutput.output}</pre>
                 )
              ) : (
                <span className="text-slate-500 italic">Run code to see output</span>
              )}
           </div>
              </div>
            </div>
          </div>
        )}

        {/* TEST RESULTS TAB */}
        {activeTab === 'test-cases' && (
           !result ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
              <Terminal size={32} className="opacity-20" />
              <p>Run your code to see results.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 sticky top-0 bg-[#1e1e1e] z-10 py-1 pb-3 border-b border-slate-800">
                <div>
                  <h3 className={`font-bold flex items-center gap-2 ${result.passedAll ? 'text-green-400' : 'text-red-400'}`}>
                    {result.passedAll ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {result.passedAll ? 'All Tests Passed' : 'Some Tests Failed'}
                  </h3>
                  <span className="text-xs text-slate-500 ml-6">Score: {result.score}/{result.totalTests}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowFailedOnly(!showFailedOnly)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium border transition-all
                      ${showFailedOnly 
                        ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'}`}
                  >
                    {showFailedOnly ? <Eye size={12} /> : <EyeOff size={12} />}
                    {showFailedOnly ? 'Showing Failed' : 'Show All'}
                  </button>

                  <div className="relative group">
                    <Search size={14} className="absolute left-2 top-1.5 text-slate-500 group-focus-within:text-blue-400" />
                    <input 
                        type="text" 
                        placeholder="Filter..."
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-md pl-8 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 w-32 transition-all"
                    />
                  </div>
                </div>
              </div>
              
              {filteredResults.length === 0 && (
                  <div className="text-center text-slate-500 py-8 text-xs italic">
                    {showFailedOnly ? "No failed tests found!" : "No tests match your filter."}
                  </div>
              )}

              {filteredResults.map((r, i) => (
                <div key={i} className={`rounded-lg border overflow-hidden transition-all ${r.passed ? 'bg-slate-800/30 border-slate-700' : 'bg-red-900/10 border-red-500/30 shadow-sm'}`}>
                  {/* Header */}
                  <div className={`px-3 py-2 flex items-center gap-2 text-xs font-semibold border-b ${r.passed ? 'bg-slate-800/50 border-slate-700 text-green-400' : 'bg-red-900/20 border-red-500/20 text-red-400'}`}>
                      {r.passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      <span>Test Case {i + 1}</span>
                      {r.isHidden && <span className="ml-auto text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1"><Lock size={10} /> Hidden</span>}
                  </div>

                  {/* Body */}
                  <div className="p-3">
                    {r.isHidden ? (
                        <div className="flex items-center justify-center py-4 gap-2 text-slate-500 bg-slate-900/50 rounded border border-slate-800 border-dashed">
                            <Lock size={16} />
                            <span className="text-xs font-medium italic">Hidden Test Case - Details Locked</span>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3">
                                <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Input</span>
                                <div className="bg-[#0f172a] p-2 rounded border border-slate-700 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                                    {r.input}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="relative">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Expected Output</span>
                                    <div className="bg-[#0f172a] p-2 rounded border border-slate-700 text-green-400/90 font-mono text-xs overflow-x-auto whitespace-pre-wrap min-h-[36px]">
                                        {r.expectedOutput}
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Actual Output</span>
                                    <div className={`p-2 rounded border font-mono text-xs overflow-x-auto whitespace-pre-wrap min-h-[36px]
                                        ${r.passed 
                                        ? 'bg-[#0f172a] border-slate-700 text-slate-300' 
                                        : 'bg-red-950/20 border-red-500/20 text-red-300'}`}>
                                        {r.error ? (
                                        <span className="flex gap-1.5 items-start text-red-400">
                                            <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                                            {r.error}
                                        </span>
                                        ) : (
                                        r.actualOutput || <span className="text-slate-600 italic">No output</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};