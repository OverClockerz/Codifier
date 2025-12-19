import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { Code, TrendingUp, Clock, AlertCircle, Award, Info, Play } from 'lucide-react';

export function Workspace() {
  const { player, activeQuests, completeQuest } = useGame();

  // Filter quests for Workspace zone
  const workspaceQuests = activeQuests.filter(q => q.zone === 'workspace');

  return (
    <div className="space-y-6">
      {/* Zone Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border border-blue-700 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Code className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl text-white">Workspace - Technical Training</h2>
            <p className="text-sm text-blue-300">Complete coding challenges, debug issues, and improve your technical skills. Receive guided learning feedback and concept explanations.</p>
          </div>
        </div>
      </motion.div>

      {/* Quest Cards */}
      {workspaceQuests.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <Code className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No active workspace tasks</p>
          <p className="text-sm text-gray-500 mt-2">Check back later for new coding challenges!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {workspaceQuests.map((quest, index) => {
            const daysLeft = quest.deadline 
              ? Math.ceil((quest.deadline - Date.now()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[rgba(15,23,43,0.5)] border border-[#45556c] rounded-lg p-4 hover:border-blue-500 transition-all"
              >
                {/* Card Header with Title and Info Icon */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white">{quest.title}</h3>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-3">{quest.description}</p>

                {/* Rewards and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {/* EXP Badge */}
                    {quest.expReward > 0 && (
                      <span className="px-2 py-1 bg-[rgba(43,127,255,0.2)] text-[#8ec5ff] text-xs rounded">
                        +{quest.expReward} EXP
                      </span>
                    )}
                    
                    {/* Stress Badge */}
                    {quest.stressImpact > 0 && (
                      <span className="px-2 py-1 bg-[rgba(251,44,54,0.2)] text-[#ffa2a2] text-xs rounded">
                        +{quest.stressImpact} Stress
                      </span>
                    )}
                    
                    {/* Days Badge */}
                    {daysLeft !== null && (
                      <span className="px-2 py-1 bg-[rgba(240,177,0,0.2)] text-[#ffdf20] text-xs rounded">
                        {daysLeft} days
                      </span>
                    )}
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => completeQuest(quest.id, 85)}
                    className="bg-[#155dfc] hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Start
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Performance Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-900/20 border border-blue-800 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg text-white">Performance Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Complete tasks before the deadline for bonus rewards</li>
          <li>• Higher difficulty tasks give more experience and currency</li>
          <li>• Maintain good mood to improve your code quality score</li>
          <li>• Use coffee or energy drinks from the Cafeteria to boost performance</li>
        </ul>
      </motion.div>
    </div>
  );
}