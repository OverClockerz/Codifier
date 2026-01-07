import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface GameOverAlertProps {
  isOpen: boolean;
  onRestart: () => void;
}

export const GameOverAlert: React.FC<GameOverAlertProps> = ({ isOpen, onRestart }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  // We use createPortal to render this element outside the root div
  // This ensures it sits on top of EVERYTHING and clicks always register
  return createPortal(
    <div 
      className="fixed inset-0 z-99999 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="relative bg-gray-900 border-2 border-red-600 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.5)] transform scale-100 pointer-events-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        {/* Header */}
        <div className="bg-red-950/50 p-6 text-center border-b border-red-900">
          <h2 className="text-3xl font-black text-red-500 tracking-[0.2em] uppercase drop-shadow-md">
            TERMINATED
          </h2>
        </div>

        {/* Body */}
        <div className="p-8 text-center space-y-4">
          <div className="text-7xl mb-6 animate-bounce">📦</div>
          <p className="text-gray-300 text-lg">
            Your professional reputation has collapsed.
          </p>
          <p className="text-red-400 font-bold text-xl uppercase">
            You have been fired!
          </p>
          <div className="bg-gray-800/50 p-3 rounded text-sm text-gray-500 italic mt-4">
            "HR would like a word with you immediately..."
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("🔴 Restart Button Clicked"); // Debug log
              onRestart();
            }}
            className="w-full cursor-pointer relative z-50 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-red-900/40 uppercase tracking-widest border border-red-500 active:scale-95"
          >
            Start New Career
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};