import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Problem, Difficulty } from '../../../types/types';
import { BookOpen, Tag, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  problem: Problem;
}

const DifficultyBadge = ({ level }: { level: Difficulty }) => {
  const colors = {
    [Difficulty.Easy]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    [Difficulty.Medium]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    [Difficulty.Hard]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[level]}`}>
      {level}
    </span>
  );
};

export const ProblemDescription: React.FC<Props> = ({ problem }) => {
  const [showExamples, setShowExamples] = useState(false);
  const [showConstraints, setShowConstraints] = useState(false);

  return (
    <div className="h-full overflow-y-auto p-6 text-slate-300 custom-scrollbar">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">{problem.title}</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <DifficultyBadge level={problem.difficulty} />
        {problem.topics.map(t => (
          <span key={t} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700 flex items-center gap-1">
            <Tag size={10} />
            {t}
          </span>
        ))}
      </div>

      <div className="markdown-body text-sm leading-relaxed text-slate-300 mb-8">
        <ReactMarkdown>{problem.description}</ReactMarkdown>
      </div>

      {problem.examples && problem.examples.length > 0 && (
        <div className="mb-6 border-t border-slate-800 pt-4">
           <button 
             onClick={() => setShowExamples(!showExamples)}
             className="w-full flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white uppercase tracking-wider transition-colors mb-2"
           >
            {showExamples ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <BookOpen size={16} /> Examples
          </button>
          
          {showExamples && (
            <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-slate-700 shadow-sm">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Input:</span>
                    <div className="mt-1 text-sm text-slate-200 font-mono bg-[#0f172a] p-2 rounded border border-slate-800/50 overflow-x-auto">
                      {ex.input}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Output:</span>
                    <div className="mt-1 text-sm text-slate-200 font-mono bg-[#0f172a] p-2 rounded border border-slate-800/50 overflow-x-auto">
                      {ex.expectedOutput}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {problem.constraints && problem.constraints.length > 0 && (
        <div className="mb-6 border-t border-slate-800 pt-4">
          <button 
             onClick={() => setShowConstraints(!showConstraints)}
             className="w-full flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white uppercase tracking-wider transition-colors mb-2"
           >
            {showConstraints ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <AlertTriangle size={16} /> Constraints
          </button>
          
          {showConstraints && (
            <ul className="list-disc pl-9 space-y-1 text-sm text-slate-300 font-mono mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {problem.constraints.map((constraint, i) => (
                <li key={i}>{constraint}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};