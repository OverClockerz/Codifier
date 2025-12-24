import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, MessageSquare, Calendar, Lightbulb, Zap, TrendingUp, Star } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { QuestCard } from '../components/quests/QuestCard';
import { QuestPage } from '../pages/QuestPage';

export function MeetingRoom() {
  // ============================================================
  // STATE & DATA FETCHING
  // ============================================================
  const { activeQuests, startQuest, player } = useGame();
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  
  // Filter quests for Meeting Room zone
  const meetingRoomQuests = activeQuests.filter(q => q.zone === 'meeting-room');

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  const handleStartQuest = (questId: string) => {
    startQuest(questId);
    setSelectedQuest(questId);
  };

  // Find the selected quest
  const questToShow = selectedQuest ? activeQuests.find(q => q.id === selectedQuest) : null;

  // Performance tips based on player stats
  const getPerformanceTips = () => {
    const tips = [];
    
    if (player.mood > 70) {
      tips.push({
        icon: <MessageSquare className="w-5 h-5 text-green-400" />,
        title: "Excellent Communication State",
        description: "High mood improves your charisma and presentation skills. Great time for important meetings!",
        color: "green"
      });
    }
    
    if (player.level >= 5) {
      tips.push({
        icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
        title: "Leadership Ready",
        description: "Your experience level qualifies you for leadership roles. Look for team lead opportunities.",
        color: "blue"
      });
    }

    // Always show at least one tip
    if (tips.length === 0) {
      tips.push({
        icon: <Lightbulb className="w-5 h-5 text-orange-400" />,
        title: "Build Connections",
        description: "Soft skills complement technical abilities. Balance meetings with coding tasks for well-rounded growth.",
        color: "orange"
      });
    }

    return tips;
  };

  const performanceTips = getPerformanceTips();

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* ZONE HEADER */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-900/50 to-orange-800/50 border border-orange-700 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-orange-400" />
          <div>
            <h2 className="text-2xl text-white">Meeting Room - Soft Skills</h2>
            <p className="text-sm text-orange-300">
              Develop communication, leadership, and collaboration skills through meetings, presentations, and team activities.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* PERFORMANCE TIPS */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {performanceTips.map((tip, index) => (
          <div
            key={index}
            className={`bg-${tip.color}-900/20 border border-${tip.color}-800/50 rounded-xl p-4 flex items-start gap-3`}
          >
            {tip.icon}
            <div className="flex-1">
              <h3 className={`text-${tip.color}-400 mb-1`}>{tip.title}</h3>
              <p className="text-sm text-gray-400">{tip.description}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ============================================================ */}
      {/* QUEST CARDS GRID */}
      {/* ============================================================ */}
      {meetingRoomQuests.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No scheduled meetings</p>
          <p className="text-sm text-gray-500 mt-2">Your calendar is clear for now!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {meetingRoomQuests.map((quest, index) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              index={index}
              theme="orange"
              onStart={handleStartQuest}
            />
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* COLLABORATION TIPS */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* QUEST PAGE */}
      {/* ============================================================ */}
      {questToShow && (
        <QuestPage
          quest={questToShow}
          onClose={() => setSelectedQuest(null)}
        />
      )}
    </div>
  );
}