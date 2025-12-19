import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Gamepad2, Brain, Lightbulb, Zap, TrendingUp } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { QuestCard } from '../components/QuestCard';
import { QuestPage } from '../pages/QuestPage';

export function GameLounge() {
  // ============================================================
  // STATE & DATA FETCHING
  // ============================================================
  const { activeQuests, startQuest, player } = useGame();
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  
  // Filter quests for Game Lounge zone
  const gameLoungeQuests = activeQuests.filter(q => q.zone === 'game-lounge');

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
    
    if (player.mood > 60) {
      tips.push({
        icon: <Brain className="w-5 h-5 text-purple-400" />,
        title: "Mental Clarity",
        description: "Your good mood enhances creative problem-solving. Perfect time for complex puzzles!",
        color: "purple"
      });
    }
    
    if (player.stress < 40) {
      tips.push({
        icon: <Zap className="w-5 h-5 text-purple-400" />,
        title: "Relaxed Mind",
        description: "Low stress levels improve lateral thinking. Try the challenging logic puzzles.",
        color: "purple"
      });
    }

    // Always show at least one tip
    if (tips.length === 0) {
      tips.push({
        icon: <Lightbulb className="w-5 h-5 text-purple-400" />,
        title: "Think Creatively",
        description: "Puzzles and games help develop problem-solving skills with less stress than technical tasks.",
        color: "purple"
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
        className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 border border-purple-700 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-2xl text-white">Game Lounge - Critical Thinking</h2>
            <p className="text-sm text-purple-300">
              Sharpen your problem-solving skills with logic puzzles, strategic challenges, and creative thinking exercises.
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
      {gameLoungeQuests.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No active challenges</p>
          <p className="text-sm text-gray-500 mt-2">Check back later for new puzzles!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {gameLoungeQuests.map((quest, index) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              index={index}
              theme="purple"
              onStart={handleStartQuest}
            />
          ))}
        </div>
      )}

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