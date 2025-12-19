import { motion } from 'framer-motion';

import { useGame } from '../../contexts/GameContext';
import { Users, MessageSquare, Award, Star } from 'lucide-react';
import { getDifficultyLabel } from '../../data/quests';

export function MeetingRoom() {
  const { player, activeQuests, completeQuest } = useGame();

  // Filter quests for Meeting Room zone
  const meetingRoomQuests = activeQuests.filter(q => q.zone === 'meeting-room');

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-900/50 text-green-400';
    if (difficulty <= 6) return 'bg-yellow-900/50 text-yellow-400';
    return 'bg-red-900/50 text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Zone Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-900/50 to-orange-800/50 border border-orange-700 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Users className="w-8 h-8 text-orange-400" />
          <div>
            <h2 className="text-2xl text-white">Meeting Room</h2>
            <p className="text-sm text-orange-300">Soft skills and team collaboration</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">Active Meetings</p>
            <p className="text-2xl text-white">{meetingRoomQuests.length}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">Soft Skills</p>
            <p className="text-2xl text-white">75%</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">Team Rating</p>
            <p className="text-2xl text-orange-400">4.5⭐</p>
          </div>
        </div>
      </motion.div>

      {/* Zone Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-5"
      >
        <h3 className="text-lg text-white mb-2">About This Zone</h3>
        <p className="text-gray-400 text-sm">
          The Meeting Room is where you develop your soft skills and collaborate with team members. 
          Participate in meetings, presentations, and team-building activities to improve your 
          communication, leadership, and interpersonal skills. Build your reputation and advance your career!
        </p>
      </motion.div>

      {/* Meeting Room Quests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl text-white mb-4">Active Meetings & Activities</h3>
        
        {meetingRoomQuests.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No scheduled meetings</p>
            <p className="text-sm text-gray-500 mt-2">Your calendar is clear for now!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetingRoomQuests.map((quest, index) => {
              const daysLeft = quest.deadline 
                ? Math.ceil((quest.deadline - Date.now()) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-orange-600 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-orange-400" />
                        <h4 className="text-lg text-white">{quest.title}</h4>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-3">{quest.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {/* Difficulty Badge */}
                        {quest.difficulty && (
                          <span className={`px-3 py-1 rounded-full text-xs ${getDifficultyColor(quest.difficulty)}`}>
                            {getDifficultyLabel(quest.difficulty)}
                          </span>
                        )}
                        
                        {/* Rewards */}
                        {quest.expReward > 0 && (
                          <span className="px-3 py-1 rounded-full text-xs bg-cyan-900/50 text-cyan-400">
                            +{quest.expReward} EXP
                          </span>
                        )}
                        {quest.reputationBonus && (
                          <span className="px-3 py-1 rounded-full text-xs bg-green-900/50 text-green-400">
                            +{quest.reputationBonus} Reputation
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Days Remaining */}
                    {daysLeft !== null && (
                      <div className="text-right ml-4">
                        <p className={`text-2xl ${daysLeft <= 2 ? 'text-red-400' : 'text-white'}`}>
                          {daysLeft}
                        </p>
                        <p className="text-xs text-gray-500">day{daysLeft !== 1 ? 's' : ''}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => completeQuest(quest.id, 85)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Complete Meeting
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Collaboration Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-orange-900/20 border border-orange-800 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg text-white">Collaboration Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Active participation in meetings boosts your reputation</li>
          <li>• Good communication skills lead to better team performance</li>
          <li>• Leadership opportunities unlock at higher reputation levels</li>
          <li>• Soft skills are essential for career advancement</li>
        </ul>
      </motion.div>
    </div>
  );
}
