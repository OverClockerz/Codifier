import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Question, Attempt, Status, ComprehensionEvaluationResult } from '../../types/types';
import * as GeminiService from '../../services/geminiService';
import QuestionCard from './ComprehensionQuest/QuestionCard';
import FeedbackDisplay from './ComprehensionQuest/FeedbackDisplay';

interface ComprehensionQuestProps {
    onComplete?: (success: boolean, score: number) => void;
    initialQuestion?: Question | any;
}

export const ComprehensionQuest: React.FC<ComprehensionQuestProps> = ({ onComplete, initialQuestion }) => {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [currentEvaluation, setCurrentEvaluation] = useState<ComprehensionEvaluationResult | null>(null);
    // const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
    // const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);
    const [status, setStatus] = useState<Status>(Status.IDLE);

    // Default topic set to React JS
    const [topic, setTopic] = useState('React JS');

    // UI States
    // const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown if clicking outside
    // useEffect(() => {
    //     function handleClickOutside(event: MouseEvent) {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //             setIsHistoryOpen(false);
    //         }
    //     }
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, []);

    // const handleGenerateQuestion = useCallback(async () => {
    //     setStatus(Status.LOADING);
    //     setCurrentEvaluation(null);
    //     // setCurrentAttemptId(null);
    //     setUserAnswer('');
    //     try {
    //         const newQuestion = await GeminiService.generateNewQuestion(topic);
    //         setCurrentQuestion(newQuestion);
    //         setStatus(Status.SUCCESS);
    //     } catch (error) {
    //         console.error(error);
    //         setStatus(Status.ERROR);
    //     }
    // }, [topic]);

    // AUTO-GENERATE ON LOAD
    // useEffect(() => {
    //     handleGenerateQuestion();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

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
        setStatus(Status.LOADING);

        try {
            const attemptResult = await GeminiService.evaluateSubmission(currentQuestion!, userAnswer);
            setCurrentEvaluation(attemptResult.evaluation);
            // setCurrentAttemptId(attemptResult.id);
            // setRefreshHistoryTrigger(prev => prev + 1);
            setStatus(Status.SUCCESS);
            // notify parent of outcome
            const score = attemptResult.evaluation?.score ?? 0;
            const success = score >= 60;
            onComplete && onComplete(success, Math.round(score));
        } catch (error) {
            console.error(error);
            setStatus(Status.ERROR);
        }
    };

    // const handleHistorySelect = (attempt: Attempt) => {
    //     setCurrentQuestion(attempt.question);
    //     setUserAnswer(attempt.userAnswer);
    //     setCurrentEvaluation(attempt.evaluation);
    //     // setCurrentAttemptId(attempt.id);
    //     setStatus(Status.SUCCESS);
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    // };

    // const handleTryAgain = () => {
    //     setCurrentEvaluation(null);
    //     // setCurrentAttemptId(null);
    //     setStatus(Status.SUCCESS);
    // };

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
                            >
                                <span>Yes, Submit</span>
                                <i className="fas fa-arrow-right text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
                <div className="flex-1 flex justify-center items-center gap-4 max-w-2xl">
                    <div className="relative w-64">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600"
                            placeholder="Topic (e.g. Python)..."
                        />
                    </div>
                    <button
                        onClick={handleGenerateQuestion}
                        disabled={status === Status.LOADING}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-1.5 px-4 rounded-md shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                    >
                        {status === Status.LOADING && !currentQuestion ? (
                            <><i className="fas fa-circle-notch fa-spin"></i> Generating...</>
                        ) : (
                            <><i className="fas fa-plus"></i> New Question</>
                        )}
                    </button>
                </div>
            </header> */}


            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-4 md:p-6 w-full overflow-y-auto flex flex-col items-center justify-start">
                <div className="w-full max-w-3xl">

                    {status === Status.ERROR && (
                        <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center justify-center">
                            <i className="fas fa-exclamation-triangle mr-3"></i>
                            <span>Connection Error: Ensure backend is active on port 5001.</span>
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
                                    <span className="text-xs text-slate-600 font-mono">Markdown</span>
                                </div>

                                <textarea
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="// Write your solution here..."
                                    className="w-full h-48 p-3 bg-slate-950 text-slate-300 focus:outline-none resize-y font-mono text-sm leading-relaxed"
                                    disabled={status === Status.LOADING || !!currentEvaluation}
                                ></textarea>

                                <div className="bg-slate-900 border-t border-slate-800 p-3 flex justify-end gap-2">
                                    {/* {!!currentEvaluation ? (
                                        <button
                                            onClick={handleTryAgain}
                                            className="px-4 py-2 rounded-md font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 text-sm"
                                        >
                                            Try Again
                                        </button>
                                    ) : (
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
                                    )} */}
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

                            {currentEvaluation && (
                                <div className="space-y-4 pb-6">
                                    <FeedbackDisplay evaluation={currentEvaluation} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};