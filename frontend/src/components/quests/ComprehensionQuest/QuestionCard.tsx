import React from 'react';
import { Question } from '../../../types/types';

interface QuestionCardProps {
  question: Question;
  isGenerating: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, isGenerating }) => {
  if (isGenerating) {
    return (
      <div className="bg-slate-900 rounded-lg p-5 animate-pulse border border-slate-800">
        <div className="h-3 bg-slate-700 rounded w-1/4 mb-3"></div>
        <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  // const getDifficultyColor = (diff: string) => {
  //   switch (diff) {
  //     case 'Beginner': return 'bg-green-500/20 text-green-400';
  //     case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
  //     case 'Advanced': return 'bg-red-500/20 text-red-400';
  //     default: return 'bg-slate-700 text-slate-300';
  //   }
  // };

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 p-5 relative overflow-hidden">
      {/* <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty}
        </span>
      </div> */}
      <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">{question.topic}</h2>
      <h1 className="text-lg font-bold text-slate-200 leading-relaxed">
        {question.text || (question as any).question || "Waiting for question..."}
      </h1>
    </div>
  );
};

export default QuestionCard;
