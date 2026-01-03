import { useState } from 'react';
import { motion } from 'framer-motion';
import { Quest } from '../../../types/game';

interface MCQQuestProps {
    quest: Quest;
    onComplete: (success: boolean, score: number) => void;
}

export function MCQQuest({ quest, onComplete }: MCQQuestProps) {
    const rawQuestions: any[] = (quest as any).question_data || [];
    const questions = Array.isArray(rawQuestions) ? rawQuestions : [];
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [isGeneratingResults, setIsGeneratingResults] = useState(false);

    const handleSelect = (qIndex: number, optionIndex: number) => {
        setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
    };

    const handleSubmit = async () => {
        setIsGeneratingResults(true);
        try {
            let correct = 0;
            questions.forEach((q, i) => {
                if (typeof q["correct option"] !== 'undefined' && answers[i] === q["correct option"]) correct++;
            });
            setCorrectCount(correct);
            setSubmitted(true);

            const pct = questions.length > 0 ? correct / questions.length : 0;
            const performanceScore = Math.round(pct * 100);
            const success = pct >= 0.6;

            // simulate backend processing and show transitional UI
            await new Promise((r) => setTimeout(r, 600));
            onComplete(success, performanceScore);
        } finally {
            setIsGeneratingResults(false);
        }
    };

    if (questions.length === 0) {
        return (
            <div className="p-6 text-center text-slate-400">No questions available for this MCQ quest.</div>
        );
    }

    return (
        <div className="w-full h-full p-6 overflow-auto">
            <div className="max-w-3xl mx-auto space-y-6">
                {questions.map((q, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <div className="text-sm text-slate-200 mb-3">{q.question || q.text || `Question ${i + 1}`}</div>
                        <div className="grid gap-2">
                            {(q.options || []).map((opt: string, oi: number) => (
                                <label key={oi} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-800 ${answers[i] === oi ? 'bg-gray-800 border border-blue-600' : ''}`}>
                                    <input type="radio" name={`q-${i}`} checked={answers[i] === oi} onChange={() => handleSelect(i, oi)} />
                                    <span className="text-sm text-slate-300">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </motion.div>
                ))}

                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-400">Answered {Object.keys(answers).length}/{questions.length}</div>
                    <div>
                        {!submitted ? (
                            <button onClick={handleSubmit} disabled={isGeneratingResults} className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg text-white">Submit</button>
                        ) : (
                            <div className="text-sm text-slate-300">You scored {correctCount}/{questions.length} correct.</div>
                        )}
                    </div>
                </div>
            </div>
            {isGeneratingResults && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071027]/80">
                    <div className="text-center text-slate-200">
                        <div className="mb-4 text-lg font-semibold">Generating Results…</div>
                        <div className="w-10 h-10 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MCQQuest;
