import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Gamepad2, Play, CheckCircle, Star } from 'lucide-react';

export function GameLounge() {
  const { activeQuests, completeQuest } = useGame();
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  const loungeQuests = activeQuests.filter(q => q.zone === 'game-lounge');

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
      />
    ));
  };

  const getPuzzleType = (title: string) => {
    if (title.includes('Logic')) return 'Spatial Reasoning';
    if (title.includes('Math')) return 'Numerical Logic';
    return 'Abstract Problem Solving';
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Gamepad2 className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl text-white">Game Lounge - Critical Thinking</h2>
        </div>
        <p className="text-slate-400 mb-6">
          Sharpen your mind with logic puzzles, mental math, and abstract challenges. 
          Each challenge is categorized and rated by difficulty. Activities reduce stress and boost your mood!
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {loungeQuests.map(quest => (
            <div
              key={quest.id}
              className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 hover:border-green-500 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white">{quest.title}</h3>
                <div className="flex gap-0.5" title={`Difficulty: ${quest.difficulty}/5`}>
                  {getDifficultyStars(quest.difficulty)}
                </div>
              </div>
              
              <div className="mb-3">
                <span className="inline-block px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded mb-2">
                  {getPuzzleType(quest.title)}
                </span>
                <p className="text-sm text-slate-400">{quest.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                    +{quest.expReward} EXP
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300">
                    +{Math.abs(quest.moodImpact)} Mood
                  </span>
                  {quest.deadline && (
                    <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300">
                      {Math.ceil((quest.deadline - Date.now()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActiveChallenge(quest.id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>

        {loungeQuests.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>All lounge quests completed! New challenges will be assigned soon.</p>
          </div>
        )}
      </div>

      {activeChallenge && (
        <MathChallenge
          questId={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          onComplete={(performance) => {
            completeQuest(activeChallenge, performance);
            setActiveChallenge(null);
          }}
        />
      )}
    </div>
  );
}

interface MathChallengeProps {
  questId: string;
  onClose: () => void;
  onComplete: (performance: number) => void;
}

function MathChallenge({ onClose, onComplete }: MathChallengeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  
  const totalQuestions = 5;
  const [question] = useState(() => {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 50) + 10;
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let correctAnswer = 0;
    
    if (op === '+') correctAnswer = a + b;
    else if (op === '-') correctAnswer = a - b;
    else correctAnswer = a * b;
    
    return { a, b, op, correctAnswer };
  });

  const handleSubmit = () => {
    const isCorrect = parseInt(answer) === question.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 >= totalQuestions) {
      const performance = (score / totalQuestions) * 100;
      onComplete(performance);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
      // Generate new question here in production
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-white">Mental Math Challenge</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="text-center space-y-6">
          <div className="text-sm text-slate-400">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>

          <div className="bg-slate-900/50 p-8 rounded-lg">
            <div className="text-4xl text-white mb-6">
              {question.a} {question.op} {question.b} = ?
            </div>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-32 px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:border-green-500 focus:outline-none text-center text-xl"
              placeholder="?"
              autoFocus
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-slate-400">
              Score: <span className="text-green-400">{score}/{currentQuestion + 1}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!answer}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
