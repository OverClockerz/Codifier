import React from 'react';
import { Difficulty } from '../../../types/types';
import { Code2, Sparkles, RefreshCw, Settings, ChevronDown } from 'lucide-react';

interface HeaderProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  difficulty, 
  setDifficulty, 
  isGenerating, 
  onGenerate 
}) => {
  return (
    <header className="h-14 border-b border-slate-700 bg-[#1e293b] flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/20">
          <Code2 className="text-white" size={20} />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">GeminiCode</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
           <div className="relative">
              <select
                className="appearance-none bg-transparent pl-3 pr-8 py-1 text-xs font-medium text-slate-300 focus:outline-none cursor-pointer"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1.5 text-slate-500 pointer-events-none" />
           </div>
        </div>

        <button 
          onClick={onGenerate}
          disabled={isGenerating}
          className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-500/20 active:scale-95"
        >
          {isGenerating ? <RefreshCw className="animate-spin" size={14}/> : <Sparkles size={14} className="text-yellow-300 group-hover:text-yellow-200" />}
          New Problem
        </button>
      </div>

      <div className="flex items-center gap-2">
         <button className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
           <Settings size={18} />
         </button>
      </div>
    </header>
  );
};