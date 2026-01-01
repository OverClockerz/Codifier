import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, XCircle, Code, Brain, Users, Coffee } from 'lucide-react';
import { Quest } from '../../types/game';
import { useGame } from '../../contexts/GameContext';

interface SimpleQuestModalProps {
  quest: Quest | null;
  onClose: () => void;
}

export function SimpleQuestModal({ quest, onClose }: SimpleQuestModalProps) {
  const { completeQuest, failQuest,player, updateMoodStress } = useGame();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!quest) return null;

  const getZoneIcon = () => {
    switch (quest.zone) {
      case 'workspace':
        return Code;
      case 'game-lounge':
        return Brain;
      case 'meeting-room':
        return Users;
      case 'cafeteria':
        return Coffee;
      default:
        return CheckCircle;
    }
  };

  const Icon = getZoneIcon();

  // Simulate quest completion
  const handleComplete = async () => {
    setIsSubmitting(true);
    
    // Simulate task time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Random performance score (70-100)
    const performanceScore = 70 + Math.random() * 30;

    completeQuest(quest.id, performanceScore, player);
    setIsSubmitting(false);
    onClose();
  };

  const handleFail = () => {
    failQuest(quest.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <div>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl m-4">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Quest Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-r from-blue-500 to-purple-500 p-0.5">
                <div className="w-full h-full bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl mb-2">{quest.title}</h2>
                <p className="text-gray-400">{quest.description}</p>
              </div>
            </div>

            {/* Quest Details */}
            <div className="bg-black/50 rounded-2xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Difficulty:</span>
                  <span className="ml-2 text-white">
                    {'⭐'.repeat(quest.difficulty)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Deadline:</span>
                  <span className="ml-2 text-white">{quest.deadline} hours</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">EXP Reward:</span>
                  <span className="ml-2 text-blue-400">+{quest.expReward}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Currency:</span>
                  <span className="ml-2 text-yellow-400">+${quest.currencyReward}</span>
                </div>
              </div>
            </div>

            {/* Simulated Activity Area */}
            <div className="bg-black/30 rounded-2xl p-8 mb-6 border border-gray-800">
              <h3 className="text-xl mb-4">Quest Activity</h3>
              
              {quest.zone === 'workspace' && (
                <div>
                  <p className="text-gray-400 mb-4">
                    This is a coding challenge. In the full version, you would write code here.
                  </p>
                  <div className="bg-gray-950 p-4 rounded-lg border border-gray-700 font-mono text-sm">
                    <div className="text-green-400">// Your code here...</div>
                    <div className="text-gray-600">function solution() {'{'}</div>
                    <div className="text-gray-600 ml-4">// Implement your solution</div>
                    <div className="text-gray-600">{'}'}</div>
                  </div>
                </div>
              )}

              {quest.zone === 'game-lounge' && (
                <div>
                  <p className="text-gray-400 mb-4">
                    This is a logic puzzle. In the full version, you would solve puzzles here.
                  </p>
                  <div className="bg-linear-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-lg border border-purple-700/50">
                    <p className="text-lg mb-4">Sample Logic Puzzle:</p>
                    <p className="text-gray-300">
                      If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?
                    </p>
                    <div className="mt-4 space-y-2">
                      <label className="flex items-center gap-2 text-gray-300">
                        <input type="radio" name="answer" className="text-purple-500" />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 text-gray-300">
                        <input type="radio" name="answer" className="text-purple-500" />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {quest.zone === 'meeting-room' && (
                <div>
                  <p className="text-gray-400 mb-4">
                    This is a communication task. In the full version, you would complete typing tests and presentations here.
                  </p>
                  <textarea
                    className="w-full h-32 bg-gray-950 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-green-500"
                    placeholder="Type your response here..."
                  />
                </div>
              )}

              <p className="text-xs text-gray-600 mt-4 italic">
                * This is a simplified demo. The full game would have interactive coding editors, logic puzzles, typing tests, and more.
              </p>
            </div>

            {/* Impact Preview */}
            <div className="bg-linear-to-r from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-xl p-4 mb-6">
              <h4 className="text-sm text-gray-400 mb-3">Quest Impact:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Stress:</span>
                  <span className={quest.stressImpact > 0 ? 'text-red-400' : 'text-green-400'}>
                    {quest.stressImpact > 0 ? '+' : ''}{quest.stressImpact}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Mood:</span>
                  <span className={quest.moodImpact > 0 ? 'text-green-400' : 'text-red-400'}>
                    {quest.moodImpact > 0 ? '+' : ''}{quest.moodImpact}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Quest
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFail}
                className="px-6 py-4 bg-red-600/20 border border-red-600/30 text-red-400 rounded-xl hover:bg-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Abandon
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
