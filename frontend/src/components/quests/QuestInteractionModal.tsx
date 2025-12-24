import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Code, Trophy, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Quest } from '../../types/game';
import { useGame } from '../../contexts/GameContext';
import { QuestTasks } from '../QuestTasks';

interface QuestInteractionModalProps {
  quest: Quest;
  onClose: () => void;
}

export function QuestInteractionModal({ quest, onClose }: QuestInteractionModalProps) {
  const { completeQuest, failQuest, player } = useGame();
  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState<'success' | 'failure' | null>(null);
  const [performanceScore, setPerformanceScore] = useState(100);

  const handleStartWork = () => {
    setIsWorking(true);
  };

  const handleTaskComplete = (success: boolean, score: number) => {
    setPerformanceScore(score);
    setResult(success ? 'success' : 'failure');
  };

  const handleComplete = () => {
    if (result === 'success') {
      completeQuest(quest.id, performanceScore);
    } else {
      failQuest(quest.id);
    }
    onClose();
  };

  const getZoneIcon = () => {
    switch (quest.zone) {
      case 'workspace':
        return <Code className="w-6 h-6" />;
      case 'game-lounge':
        return <Trophy className="w-6 h-6" />;
      case 'meeting-room':
        return <Zap className="w-6 h-6" />;
      default:
        return <Code className="w-6 h-6" />;
    }
  };

  const getZoneColor = () => {
    switch (quest.zone) {
      case 'workspace':
        return 'blue';
      case 'game-lounge':
        return 'purple';
      case 'meeting-room':
        return 'green';
      default:
        return 'blue';
    }
  };

  const color = getZoneColor();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`bg-${color}-900/30 border-b border-${color}-800/50 p-6 flex items-start justify-between`}>
            <div className="flex items-start gap-4 flex-1">
              <div className={`bg-${color}-500/20 p-3 rounded-xl`}>
                {getZoneIcon()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl text-white mb-2">{quest.title}</h2>
                <p className="text-gray-400">{quest.description}</p>
                
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-300">{quest.expReward} EXP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-300">${quest.currencyReward}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-300 capitalize">{quest.frequency}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quest Details */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-white mb-2">Quest Objectives</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Complete the assigned task with attention to detail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Maintain code quality and follow best practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Submit before deadline for maximum rewards</span>
                  </li>
                </ul>
              </div>

              {/* Impact Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-400">Mood Impact</span>
                  </div>
                  <p className="text-2xl text-white">{quest.moodImpact > 0 ? '+' : ''}{quest.moodImpact}</p>
                </div>
                <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-400">Stress Impact</span>
                  </div>
                  <p className="text-2xl text-white">+{quest.stressImpact}</p>
                </div>
              </div>
            </div>

            {/* Task List */}
            {isWorking && (
              <QuestTasks
                quest={quest}
                onComplete={handleTaskComplete}
              />
            )}

            {/* Result Display */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  result === 'success'
                    ? 'bg-green-900/20 border-green-800/50'
                    : 'bg-red-900/20 border-red-800/50'
                } border rounded-xl p-6`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {result === 'success' ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  )}
                  <div>
                    <h3 className={`text-xl ${result === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {result === 'success' ? 'Quest Completed!' : 'Quest Failed'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Performance Score: {performanceScore}/100
                    </p>
                  </div>
                </div>
                
                {result === 'success' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Experience Earned:</span>
                      <span className="text-yellow-400">
                        +{Math.floor(quest.expReward * (performanceScore / 100))} EXP
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Currency Earned:</span>
                      <span className="text-green-400">
                        +${Math.floor(quest.currencyReward * (performanceScore / 100))}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Mood Change:</span>
                      <span className={quest.moodImpact > 0 ? 'text-green-400' : 'text-red-400'}>
                        {quest.moodImpact > 0 ? '+' : ''}{quest.moodImpact}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Stress Change:</span>
                      <span className="text-orange-400">+{quest.stressImpact}</span>
                    </div>
                  </div>
                )}
                
                {result === 'failure' && (
                  <p className="text-gray-400 text-sm">
                    Don't worry! You can try other quests or take a break to improve your mood and reduce stress.
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-800 p-6 flex gap-3">
            {!result && !isWorking && (
              <>
                <button
                  onClick={handleStartWork}
                  className={`flex-1 bg-${color}-600 hover:bg-${color}-700 text-white px-6 py-3 rounded-xl transition-colors`}
                >
                  Start Working
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            
            {isWorking && (
              <button
                disabled
                className="flex-1 bg-gray-700 text-gray-400 px-6 py-3 rounded-xl cursor-not-allowed"
              >
                Working...
              </button>
            )}
            
            {result && (
              <button
                onClick={handleComplete}
                className={`flex-1 ${
                  result === 'success'
                    ? `bg-${color}-600 hover:bg-${color}-700`
                    : 'bg-gray-700 hover:bg-gray-600'
                } text-white px-6 py-3 rounded-xl transition-colors`}
              >
                {result === 'success' ? 'Claim Rewards' : 'Close'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}