import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Code, Trophy, Zap, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Quest } from '../types/game';
import { useGame } from '../contexts/GameContext';
// import { QuestTasks } from '../components/quests/QuestTasks';
import { CodingPlatform } from '../components/quests/CodingPlatform';
import { ComprehensionQuest } from '../components/quests/ComprehensionQuest';
import MCQQuest from '../components/quests/McqQuest/MCQQuest';
import { TypingGame } from '../components/quests/TyingQuest/TypingGame';

interface QuestPageProps {
  quest: Quest;
  onClose: () => void;
}

export function QuestPage({ quest, onClose }: QuestPageProps) {
  const { completeQuest, failQuest, player } = useGame();
  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState<'success' | 'failure' | null>(null);
  const [performanceScore, setPerformanceScore] = useState(100);
  const [resultsVisible, setResultsVisible] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, []);

  const handleStartWork = () => {
    setIsWorking(true);
  };

  const handleTaskComplete = (success: boolean, score: number) => {
    setPerformanceScore(score);
    setResult(success ? 'success' : 'failure');
  };

  const handleComplete = () => {
    if (result === 'success') {
      completeQuest(quest.id, performanceScore, player);
    } else {
      failQuest(quest.id);
    }
    onClose();
  };

  const getZoneIcon = () => {
    switch (quest.zone) {
      case 'workspace':
        return <Code className="w-6 h-6 text-blue-400" />;
      case 'game-lounge':
        return <Trophy className="w-6 h-6 text-purple-400" />;
      case 'meeting-room':
        return <Zap className="w-6 h-6 text-orange-400" />;
      default:
        return <Code className="w-6 h-6 text-blue-400" />;
    }
  };

  const getZoneColor = () => {
    switch (quest.zone) {
      case 'workspace':
        return 'blue';
      case 'game-lounge':
        return 'purple';
      case 'meeting-room':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const color = getZoneColor();

  // When results are visible (either local results UI or final result state), hide header and block navigation
  useEffect(() => {
    if (!result && !resultsVisible) return;

    const prevOnBeforeUnload = window.onbeforeunload;
    // Prevent refresh/close
    window.onbeforeunload = () => 'Results have been generated. Leaving now may cause issues.';

    // Prevent back/forward by re-pushing the current state
    const onPop = () => {
      history.pushState(null, '', location.href);
    };
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', onPop);

    return () => {
      window.onbeforeunload = prevOnBeforeUnload;
      window.removeEventListener('popstate', onPop);
    };
  }, [result, resultsVisible]);

  return (
    <div className="fixed inset-0 bg-[#0a0f1e] z-50 flex flex-col">
      {/* Header: hide when results are displayed */}
      {!result && !resultsVisible && (
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`bg-${color}-500/20 p-3 rounded-xl`}>
                {getZoneIcon()}
              </div>
              <div>
                <h1 className="text-2xl text-white">{quest.title}</h1>
                <p className="text-sm text-gray-400 capitalize">{quest.zone.replace('-', ' ')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Body: either the full coding platform (fills remaining viewport) or the quest content */}
      {isWorking && !result ? (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex-1 w-full overflow-hidden"
        >
          {/* Render the appropriate interactive UI depending on quest.type */}
          {quest.type === 'Coding' && (
            <div className="h-full w-full">
              <CodingPlatform className="h-full w-full" onComplete={handleTaskComplete} initialProblem={quest} />
            </div>
          )}

          {quest.type === 'Comprehensive' && (
            <div className="h-full w-full">
              <ComprehensionQuest onComplete={handleTaskComplete} initialQuestion={quest.question_data} />
            </div>
          )}

          {quest.type === 'Typing' && (
            <div className="h-full w-full">
              <TypingGame
                question={(quest as any).question_data?.question}
                timeLimit={(quest as any).question_data?.time}
                onFinish={(stats) => {
                  // Normalize score [0,1] from WPM, accuracy and correct vs incorrect chars
                  const wpmN = Math.min(stats.wpm / 100, 1);
                  const accN = Math.min(stats.accuracy / 100, 1);
                  const charTotal = stats.correctChars + stats.incorrectChars;
                  const charN = charTotal > 0 ? stats.correctChars / charTotal : 1;
                  // weights: accuracy 0.5, wpm 0.3, char ratio 0.2
                  const scoreNorm = Math.max(0, Math.min(1, accN * 0.5 + wpmN * 0.3 + charN * 0.2));
                  const score100 = Math.round(scoreNorm * 100);
                  handleTaskComplete(scoreNorm >= 0.5, score100);
                }}
                onResultsVisible={(v) => setResultsVisible(v)}
              />
            </div>
          )}

          {quest.type === 'MCQ' && (
            <div className="h-full w-full">
              <MCQQuest quest={quest} onComplete={handleTaskComplete} />
            </div>
          )}

          {/* Fallback: generic task runner */}
          {/* {!(quest.type === 'Coding' || quest.type === 'Comprehensive' || quest.type === 'MCQ') && (
            <QuestTasks quest={quest} onComplete={handleTaskComplete} />
          )} */}
        </motion.div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {!isWorking && !result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Quest Brief */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-xl text-white mb-3">Quest Brief</h2>
                  <p className="text-gray-400 mb-6">{quest.description}</p>

                  {/* Rewards & Impact */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-400">Experience</span>
                      </div>
                      <p className="text-2xl text-white">+{quest.expReward}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-400">Currency</span>
                      </div>
                      <p className="text-2xl text-white">${quest.currencyReward}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-400">Mood</span>
                      </div>
                      <p className="text-2xl text-white">{quest.moodImpact > 0 ? '+' : ''}{quest.moodImpact}</p>
                    </div>
                    <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-400">Stress</span>
                      </div>
                      <p className="text-2xl text-white">+{quest.stressImpact}</p>
                    </div>
                  </div>
                </div>

                {/* Skills to Gain */}
                {quest.skills && quest.skills.length > 0 && (
                  <div className="bg-purple-900/20 border border-purple-800/50 rounded-2xl p-6">
                    <h2 className="text-xl text-white mb-3">Skills You'll Improve</h2>
                    <div className="flex flex-wrap gap-2">
                      {quest.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Stats */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-xl text-white mb-4">Your Current State</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Mood</span>
                        <span className="text-white">{player.mood}/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${player.mood}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Stress</span>
                        <span className="text-white">{player.stress}/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${player.stress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Your mood and stress levels affect your performance. Higher mood and lower stress lead to better results!
                  </p>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartWork}
                  className={`w-full bg-${color}-600 hover:bg-${color}-700 text-white px-8 py-4 rounded-xl text-lg transition-colors`}
                >
                  Start Working on Quest
                </button>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div
                  className={`${result === 'success'
                    ? 'bg-green-900/20 border-green-800/50'
                    : 'bg-red-900/20 border-red-800/50'
                    } border rounded-2xl p-8`}
                >
                  <div className="flex items-center justify-center gap-3 mb-6">
                    {result === 'success' ? (
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    ) : (
                      <AlertCircle className="w-16 h-16 text-red-500" />
                    )}
                    <div className="text-center">
                      <h3 className={`text-3xl ${result === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {result === 'success' ? 'Quest Completed!' : 'Quest Failed'}
                      </h3>
                      <p className="text-xl text-gray-400 mt-2">
                        Performance Score: {performanceScore}/100
                      </p>
                    </div>
                  </div>

                  {result === 'success' && (
                    <div className="space-y-3 bg-gray-900/50 rounded-xl p-6">
                      <h4 className="text-lg text-white mb-3">Rewards Earned</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between text-gray-400">
                          <span>Experience:</span>
                          <span className="text-yellow-400">
                            +{Math.floor(quest.expReward * (performanceScore / 100))} EXP
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Currency:</span>
                          <span className="text-green-400">
                            +${Math.floor(quest.currencyReward * (performanceScore / 100))}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Mood Change:</span>
                          <span className={
                            quest.zone === 'game-lounge'
                              ? 'text-green-400'
                              : quest.zone === 'meeting-room' && performanceScore >= 70
                                ? 'text-green-400'
                                : 'text-red-400'
                          }>
                            {quest.zone === 'game-lounge' || (quest.zone === 'meeting-room' && performanceScore >= 70)
                              ? '+' + Math.floor(Math.abs(quest.moodImpact) * (performanceScore / 100))
                              : quest.moodImpact > 0 ? '+' : ''}{quest.zone === 'workspace' || (quest.zone === 'meeting-room' && performanceScore < 70) ? Math.floor(quest.moodImpact * (performanceScore / 100)) : ''}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Stress Change:</span>
                          <span className={
                            quest.zone === 'game-lounge' || (quest.zone === 'meeting-room' && performanceScore >= 70)
                              ? 'text-green-400'
                              : 'text-orange-400'
                          }>
                            {quest.zone === 'game-lounge'
                              ? '-' + Math.floor(Math.abs(quest.stressImpact) * (performanceScore / 100))
                              : quest.zone === 'meeting-room' && performanceScore >= 70
                                ? '-' + Math.floor(quest.stressImpact * ((performanceScore / 100) * 0.5))
                                : '+' + Math.floor(quest.stressImpact * (performanceScore / 100))}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Reputation:</span>
                          <span className={performanceScore >= 50 ? 'text-green-400' : 'text-red-400'}>
                            {performanceScore < 50
                              ? quest.difficulty <= 2 ? '-0.5%' : quest.difficulty <= 3 ? '-1.5%' : '-3%'
                              : performanceScore < 70
                                ? '+' + (quest.difficulty <= 2 ? '0.005%' : quest.difficulty <= 3 ? '0.02%' : '0.1%')
                                : '+' + (quest.difficulty <= 2 ? '0.01%' : quest.difficulty <= 3 ? '0.05%' : '0.2%')}
                          </span>
                        </div>
                      </div>

                      {/* Performance Grade */}
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Performance Grade:</span>
                          <span className={`text-lg ${performanceScore >= 90 ? 'text-green-400' :
                            performanceScore >= 70 ? 'text-blue-400' :
                              performanceScore >= 50 ? 'text-yellow-400' :
                                'text-red-400'
                            }`}>
                            {performanceScore >= 90 ? 'A - Excellent' :
                              performanceScore >= 70 ? 'B - Good' :
                                performanceScore >= 50 ? 'C - Average' :
                                  'D - Poor'}
                          </span>
                        </div>
                      </div>

                      {quest.skills && quest.skills.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <p className="text-sm text-gray-400 mb-2">Skills Improved:</p>
                          <div className="flex flex-wrap gap-2">
                            {quest.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-sm"
                              >
                                {skill} +{Math.floor(5 * (performanceScore / 100))}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {result === 'failure' && (
                    <div className="space-y-3 bg-gray-900/50 rounded-xl p-6">
                      <p className="text-gray-400 text-center mb-4">
                        Don't worry! You can try other quests or take a break to improve your mood and reduce stress.
                      </p>
                      <div className="border-t border-gray-800 pt-4">
                        <h4 className="text-sm text-gray-400 mb-2">Penalties Applied:</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Mood:</span>
                            <span className="text-red-400">{quest.moodImpact}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Stress:</span>
                            <span className="text-orange-400">+{quest.stressImpact}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Reputation:</span>
                            <span className="text-red-400">
                              {quest.difficulty <= 2 ? '-0.5%' : quest.difficulty <= 3 ? '-1.5%' : '-3%'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleComplete}
                  className={`w-full ${result === 'success'
                    ? `bg-${color}-600 hover:bg-${color}-700`
                    : 'bg-gray-700 hover:bg-gray-600'
                    } text-white px-8 py-4 rounded-xl text-lg transition-colors`}
                >
                  {result === 'success' ? 'Claim Rewards & Continue' : 'Return to Dashboard'}
                </button>
              </motion.div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}