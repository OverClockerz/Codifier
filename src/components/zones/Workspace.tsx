import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Code, Play, CheckCircle, HelpCircle } from 'lucide-react';

export function Workspace() {
  const { activeQuests, completeQuest, player } = useGame();
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);


  // Dummy quests for demo/testing
  const dummyQuests = [
    {
      id: 'dummy-1',
      title: 'Fix the Login Bug',
      description: 'Debug and resolve the login issue affecting user authentication.',
      zone: 'workspace',
      expReward: 100,
      stressImpact: 10,
      moodImpact: 5,
      deadline: 3,
      skillCategory: 'Debugging',
      completedAt: null,
    },
    {
      id: 'dummy-2',
      title: 'Implement Dark Mode',
      description: 'Add a dark mode toggle to the application UI.',
      zone: 'workspace',
      expReward: 120,
      stressImpact: 8,
      moodImpact: 7,
      deadline: 2,
      skillCategory: 'Frontend',
      completedAt: null,
    },
    {
      id: 'dummy-3',
      title: 'Optimize Database Query',
      description: 'Improve the performance of the user data fetch query.',
      zone: 'workspace',
      expReward: 150,
      stressImpact: 12,
      moodImpact: 6,
      deadline: 4,
      skillCategory: 'Backend',
      completedAt: null,
    },
  ];

  let workspaceQuests = activeQuests.filter(q => q.zone === 'workspace' && !q.completedAt);
  if (workspaceQuests.length === 0) {
    workspaceQuests = dummyQuests;
  }

  if (player.mood <= 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl text-white">Workspace - Technical Training</h2>
        </div>
        <p className="text-slate-400 mb-6">
          Complete coding challenges, debug issues, and improve your technical skills. 
          Receive guided learning feedback and concept explanations.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {workspaceQuests.map(quest => (
            <div
              key={quest.id}
              className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 hover:border-blue-500 transition-all cursor-pointer group"
              onClick={() => setSelectedQuest(quest.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white">{quest.title}</h3>
                {quest.skillCategory && (
                  <div className="relative group/tooltip">
                    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-blue-400 transition-colors" />
                    <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10">
                      <div className="text-xs text-slate-300">
                        <div className="text-blue-400 mb-1">Skill: {quest.skillCategory}</div>
                        <div>Completing this will improve your {quest.skillCategory} mastery level.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-3">{quest.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                    +{quest.expReward} EXP
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300">
                    +{quest.stressImpact} Stress
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300">
                    {quest.deadline} days
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChallenge(quest.id);
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>

        {workspaceQuests.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>All workspace quests completed! New tasks will be assigned soon.</p>
          </div>
        )}
      </div>

      {activeChallenge && (
        <CodingChallenge
          questId={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          onComplete={(questId, performance) => {
            // Only call completeQuest for real quests
            const isDummy = dummyQuests.some(q => q.id === questId);
            if (!isDummy) {
              completeQuest(questId, performance);
            }
            setActiveChallenge(null);
          }}
        />
      )}
    </div>
  );
}

interface CodingChallengeProps {
  questId: string;
  onClose: () => void;
  onComplete: (questId: string, performance: number) => void;
}

function CodingChallenge({ questId, onClose, onComplete }: CodingChallengeProps) {
  const [code, setCode] = useState('// Write your solution here\n\n');
  const [testsPassed, setTestsPassed] = useState(0);
  const totalTests = 5;

  const runCode = () => {
    // Simulate code testing
    const passed = Math.floor(Math.random() * (totalTests + 1));
    setTestsPassed(passed);
  };

  const submitCode = () => {
    const performance = Math.min(100, (testsPassed / totalTests) * 100 + Math.random() * 20);
    onComplete(questId, Math.floor(performance));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl text-white">Coding Challenge</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-white mb-2">Task Description</h4>
            <p className="text-sm text-slate-400">
              Implement a function that solves the given problem. Your code will be tested against 
              {totalTests} test cases. Higher test pass rate results in better performance scores.
            </p>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Your Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 bg-slate-900 text-slate-100 p-4 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
              placeholder="// Write your code here..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-slate-300">
              Tests Passed: <span className={testsPassed === totalTests ? 'text-green-400' : 'text-yellow-400'}>
                {testsPassed}/{totalTests}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={runCode}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Run Tests
              </button>
              <button
                onClick={submitCode}
                disabled={testsPassed === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
              >
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}