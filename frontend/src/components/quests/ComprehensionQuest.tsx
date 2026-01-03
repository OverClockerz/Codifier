import React, { useState, useEffect } from 'react';
import { Question,Status, ComprehensionEvaluationResult } from '../../types/types';
import * as GeminiService from '../../services/geminiService';
import QuestionCard from './ComprehensionQuest/QuestionCard';


interface ComprehensionQuestProps {
    onComplete?: (success: boolean, score: number) => void;
    initialQuestion?: Question | any;
}

export const ComprehensionQuest: React.FC<ComprehensionQuestProps> = ({ onComplete, initialQuestion }) => {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [currentEvaluation, setCurrentEvaluation] = useState<ComprehensionEvaluationResult | null>(null);
    const [status, setStatus] = useState<Status>(Status.IDLE);

    // UI States
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isGeneratingResults, setIsGeneratingResults] = useState(false);

    // Initialize from quest-provided question data when available
    useEffect(() => {
        if (initialQuestion) {
            // Quest schema may either be the question object, or contain `question_data` which is the object
            const q = initialQuestion.question ? initialQuestion : (initialQuestion.question_data ? initialQuestion.question_data : initialQuestion);
            setCurrentQuestion(q as Question);
            setStatus(Status.SUCCESS);
        }
    }, [initialQuestion]);

    const handlePreSubmit = () => {
        if (!currentQuestion || !userAnswer.trim()) return;
        setIsSubmitModalOpen(true);
    };

    const executeSubmit = async () => {
        setIsSubmitModalOpen(false);
        setIsGeneratingResults(true);
        setStatus(Status.LOADING);

        try {
            const attemptResult = await GeminiService.evaluateSubmission(currentQuestion!, userAnswer);
            setCurrentEvaluation(attemptResult.evaluation);
            setStatus(Status.SUCCESS);
            // notify parent of outcome after showing transitional UI briefly
            const score = attemptResult.evaluation?.score ?? 0;
            const success = score >= 60;
            await new Promise((r) => setTimeout(r, 600));
            onComplete && onComplete(success, Math.round(score));
        } catch (error) {
            console.error(error);
            setStatus(Status.ERROR);
        } finally {
            setIsGeneratingResults(false);
        }
    };


    return (
        <div className="h-full w-full bg-slate-950 flex flex-col font-sans text-slate-300 relative overflow-hidden">

            {/* --- CONFIRMATION MODAL --- */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in px-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100 animate-fade-in-up">
                        <div className="text-center mb-6">
                            <div className="bg-indigo-500/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                <i className="fas fa-paper-plane text-2xl text-indigo-400 pl-1"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Ready to Submit?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Our AI is ready to analyze your code. You won't be able to edit your answer after submitting.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsSubmitModalOpen(false)}
                                className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
                            >
                                Keep Writing
                            </button>
                            <button
                                onClick={executeSubmit}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                                disabled={isGeneratingResults}
                            >
                                <span>Yes, Submit</span>
                                <i className="fas fa-arrow-right text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isGeneratingResults && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1220]/80">
                    <div className="text-center text-slate-200">
                        <div className="mb-4 text-lg font-semibold">Generating Results…</div>
                        <div className="w-10 h-10 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                    </div>
                </div>
            )}

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-4 md:p-6 w-full overflow-y-auto flex flex-col items-center justify-start">
                <div className="w-full max-w-3xl">

                    {status === Status.ERROR && (
                        <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center justify-center">
                            <i className="fas fa-exclamation-triangle mr-3"></i>
                            <span>Connection Error: Ensure backend is active.</span>
                        </div>
                    )}

                    {!currentQuestion && status !== Status.LOADING && (
                        <div className="text-center py-24 opacity-60 animate-pulse">
                            <div className="bg-slate-900 inline-block p-4 rounded-full mb-4 border border-slate-800 shadow-xl">
                                <i className="fas fa-terminal text-3xl text-indigo-500"></i>
                            </div>
                            <h2 className="text-lg font-bold text-slate-200">Initializing Environment...</h2>
                        </div>
                    )}

                    {currentQuestion && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-lg overflow-hidden">
                                <QuestionCard
                                    question={currentQuestion}
                                    isGenerating={status === Status.LOADING && !currentQuestion.question}
                                />
                            </div>

                            <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-lg overflow-hidden flex flex-col">
                                <div className="bg-slate-900 border-b border-slate-800 p-2 px-3 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wide">
                                        <i className="fas fa-code"></i>
                                        <span>Answer</span>
                                    </div>
                                    {/* <span className="text-xs text-slate-600 font-mono">Markdown</span> */}
                                </div>

                                <textarea
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="// Write your solution here..."
                                    className="w-full h-48 p-3 bg-slate-950 text-slate-300 focus:outline-none resize-y font-mono text-sm leading-relaxed"
                                    disabled={status === Status.LOADING || !!currentEvaluation}
                                ></textarea>

                                <div className="bg-slate-900 border-t border-slate-800 p-3 flex justify-end gap-2">

                                    <button
                                        onClick={handlePreSubmit}
                                        disabled={status === Status.LOADING || !userAnswer.trim()}
                                        className={`px-5 py-2 rounded-md font-medium text-white shadow-lg transition-all flex items-center text-sm
                                        ${status === Status.LOADING || !userAnswer.trim()
                                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25'}`}
                                    >
                                        {status === Status.LOADING ? 'Compiling...' : 'Submit'}
                                    </button>
                                </div>
                            </div>

                            {/* {currentEvaluation && (
                                <div className="space-y-4 pb-6">
                                    <FeedbackDisplay evaluation={currentEvaluation} />
                                </div>
                            )} */}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};