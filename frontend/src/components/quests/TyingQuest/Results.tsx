import React, { useState } from 'react';
import { TestStats } from '../../../types/types';

interface ResultsProps {
  stats: TestStats;
  onRestart?: () => void;
  onClaimRewards?: (stats: TestStats) => void;
  onShow?: (visible: boolean) => void;
}

export const Results: React.FC<ResultsProps> = ({ stats, onRestart, onClaimRewards }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  React.useEffect(() => {
    // notify parent that results are visible
    onShow?.(true);
    return () => {
      onShow?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClaim = () => {
    if (!onClaimRewards) return onRestart && onRestart();
    setIsGenerating(true);
    // show animation then call parent
    setTimeout(() => {
      setIsGenerating(false);
      onClaimRewards(stats);
    }, 1400);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 py-10">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
        {/* WPM Card */}
        <div className="flex flex-col items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
          <span className="text-sm text-gray-500 font-bold tracking-widest mb-2">WPM</span>
          <span className="text-6xl font-mono text-primary-500 font-bold">{Math.round(stats.wpm)}</span>
        </div>

        {/* Accuracy Card */}
        <div className="flex flex-col items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
          <span className="text-sm text-gray-500 font-bold tracking-widest mb-2">ACCURACY</span>
          <span className="text-6xl font-mono text-gray-100 font-bold">{Math.round(stats.accuracy)}<span className="text-3xl text-gray-500">%</span></span>
        </div>

        {/* Characters Card */}
        <div className="col-span-2 flex flex-col items-center justify-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
          <span className="text-sm text-gray-500 font-bold tracking-widest mb-2">CHARACTERS</span>
          <div className="flex items-baseline space-x-2 text-4xl font-mono">
            <span className="text-gray-100">{stats.correctChars}</span>
            <span className="text-gray-600 text-2xl">/</span>
            <span className="text-red-500">{stats.incorrectChars}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleClaim}
        className="group relative px-10 py-4 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200 font-mono font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]"
      >
        <span className="flex items-center gap-3">
          {isGenerating ? (
            <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" /><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
          ) : (
            <svg className="transition-transform group-hover:rotate-180 duration-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
          )}
          {isGenerating ? 'Generating Results' : (onClaimRewards ? 'View Rewards' : 'New Test')}
        </span>
      </button>
    </div>
  );
};
function onShow(visible: boolean) {
  console.log(`Results component is now ${visible ? 'visible' : 'hidden'}`);
}
