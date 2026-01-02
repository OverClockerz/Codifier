import React from 'react';
import { TypingGame } from './TyingQuest/TypingGame';

const TypingQuest: React.FC = () => {
    return (
        <div className="min-h-screen w-full bg-gray-900 text-gray-400 font-mono selection:bg-primary-500 selection:text-gray-900">
            <main className="container mx-auto px-4 py-12 flex flex-col items-center">
                {/* Header/Logo area */}
                <header className="w-full max-w-5xl flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" x2="15" y1="20" y2="20" /><line x1="12" x2="12" y1="4" y2="20" /></svg>
                        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">ZenType</h1>
                    </div>
                </header>

                {/* Game Container */}
                <TypingGame />

                {/* Footer */}
                <footer className="mt-auto py-8 text-center text-xs text-gray-500 opacity-60">
                    <p>Powered by Gemini &bull; Dark Mode</p>
                </footer>
            </main>
        </div>
    );
};

export default TypingQuest;