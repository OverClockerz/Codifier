import React, { useState } from 'react';
import { ComprehensionEvaluationResult } from '../../../types/types';

interface FeedbackDisplayProps {
  evaluation: ComprehensionEvaluationResult;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ evaluation }) => {
  const [copied, setCopied] = useState(false);

  // Safety checks
  const spellingErrors = evaluation.spellingErrors || [];
  const missingConcepts = evaluation.keyConceptsMissed || [];

  // Determine colors based on score
  const isPassing = evaluation.score >= 70;
  
  const scoreColor = 
    evaluation.score >= 80 ? 'text-emerald-400' : 
    evaluation.score >= 50 ? 'text-amber-400' : 'text-rose-400';
  
  const scoreBg = 
    evaluation.score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20' : 
    evaluation.score >= 50 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20';

  const badgeClass = 
    evaluation.score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
    evaluation.score >= 50 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30';

  const handleCopy = () => {
    navigator.clipboard.writeText(evaluation.improvedAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 space-y-3 animate-fade-in-up">
      
      {/* 1. Dashboard KPI Card */}
      <div className={`p-4 rounded-lg border ${scoreBg} flex items-center justify-between relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-100">Result</h3>
            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${badgeClass}`}>
                {isPassing ? 'Passing' : 'Review'}
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            {evaluation.isCorrect ? 'Well done.' : 'Review the missing concepts below.'}
          </p>
        </div>

        <div className="flex flex-col items-center relative z-10 pl-4 border-l border-slate-700/50">
          <span className={`text-4xl font-black tracking-tighter ${scoreColor}`}>{evaluation.score}</span>
          <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">Score</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 2. Grammar Panel */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 flex flex-col">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <h4 className="font-semibold text-slate-300 flex items-center text-xs">
                    <i className="fas fa-spell-check text-indigo-400 mr-2"></i> Grammar
                </h4>
                {spellingErrors.length === 0 && <i className="fas fa-check text-emerald-500 text-xs"></i>}
            </div>
            <div className="p-3 flex-1">
                {spellingErrors.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No errors detected.</p>
                ) : (
                    <ul className="list-disc list-inside text-xs text-rose-400 space-y-1">
                        {spellingErrors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

        {/* 3. Concepts Panel */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 flex flex-col">
            <div className="p-3 border-b border-slate-800">
                <h4 className="font-semibold text-slate-300 flex items-center text-xs">
                    <i className="fas fa-lightbulb text-amber-500 mr-2"></i> Key Concepts
                </h4>
            </div>
            <div className="p-3 flex-1">
                {missingConcepts.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">All covered.</p>
                ) : (
                    <ul className="space-y-1">
                        {missingConcepts.map((concept, idx) => (
                            <li key={idx} className="flex items-start text-xs text-slate-400">
                                <i className="fas fa-arrow-right text-slate-600 mt-0.5 mr-2 text-[8px]"></i>
                                {concept}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
      </div>

      {/* 4. Technical Analysis */}
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
        <h4 className="font-semibold text-slate-300 mb-2 flex items-center text-xs uppercase tracking-wide">
             <i className="fas fa-chart-bar text-indigo-400 mr-2"></i> Analysis
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap border-l-2 border-slate-700 pl-3">
          {evaluation.technicalAccuracy}
        </p>
      </div>

      {/* 5. Model Solution */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className="bg-slate-950 border-b border-slate-800 p-2 px-3 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <i className="fas fa-code-branch text-emerald-400 text-xs"></i>
                <h4 className="font-semibold text-slate-300 text-xs">Solution</h4>
             </div>
             <button 
                onClick={handleCopy}
                className="text-xs flex items-center gap-1 text-slate-500 hover:text-white transition-colors"
             >
                {copied ? (
                    <><i className="fas fa-check text-emerald-400"></i> Copied</>
                ) : (
                    <><i className="far fa-copy"></i> Copy</>
                )}
             </button>
        </div>
        <div className="p-3 bg-slate-950">
            <div className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                {evaluation.improvedAnswer}
            </div>
        </div>
      </div>

    </div>
  );
};

export default FeedbackDisplay;