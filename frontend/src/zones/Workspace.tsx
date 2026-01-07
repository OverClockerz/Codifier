import { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Terminal, Lightbulb, TrendingUp, Zap } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { QuestCard } from '../components/quests/QuestCard';
import { QuestPage } from '../pages/QuestPage';
import { StressAlert } from '../components/extras/StressAlert';
import { ZoneType } from '../types/game'; // Ensure you have this type imported

// 1. Define Props Interface
interface WorkspaceProps {
  onNavigate: (zone: ZoneType) => void;
}

// 2. Accept the prop in the component
export function Workspace({ onNavigate }: WorkspaceProps) {
  // ============================================================
  // STATE & DATA FETCHING
  // ============================================================
  const { activeQuests, startQuest, player } = useGame();
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [showStressAlert, setShowStressAlert] = useState(false);
  
  const workspaceQuests = activeQuests.filter(q => q.zone === 'workspace');

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  const handleStartQuest = (questId: string) => {
    if (player.stress >= 100) {
      setShowStressAlert(true);
      return;
    }

    startQuest(questId);
    setSelectedQuest(questId);
  };

  const handleNavigateToShop = () => {
    // 3. Use the prop to navigate to the Cafeteria (which acts as the shop)
    onNavigate('cafeteria');
  };

  const questToShow = selectedQuest ? activeQuests.find(q => q.id === selectedQuest) : null;

  // Performance tips logic...
  const getPerformanceTips = () => {
    const tips = [];
    if (player.stress > 70) {
      tips.push({
        icon: <Zap className="w-5 h-5 text-red-400" />,
        title: "High Stress Detected",
        description: "Consider taking a break or visiting the Cafeteria to reduce stress.",
        color: "red"
      });
    }
    if (player.mood < 30) {
      tips.push({
        icon: <TrendingUp className="w-5 h-5 text-yellow-400" />,
        title: "Low Mood Alert",
        description: "Your performance may be affected. Try completing easier quests first.",
        color: "yellow"
      });
    }
    
    if (player.stress < 30 && player.mood > 70) {
      tips.push({
        icon: <Lightbulb className="w-5 h-5 text-green-400" />,
        title: "Peak Performance",
        description: "You're in great shape! This is the perfect time to tackle difficult challenges for maximum rewards.",
        color: "green"
      });
    }

    // Always show at least one tip
    if (tips.length === 0) {
      tips.push({
        icon: <Lightbulb className="w-5 h-5 text-blue-400" />,
        title: "Work Smart",
        description: "Balance your workload. Complete daily quests first.",
        color: "blue"
      });
    }
    return tips;
  };

  const performanceTips = getPerformanceTips();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-r from-blue-900/50 to-blue-800/50 border border-blue-700 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <Code className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl text-white">Workspace - Technical Training</h2>
            <p className="text-sm text-blue-300">
              Master programming, debugging, and system design.
            </p>
          </div>
        </div>
      </motion.div>

      {/* TIPS */}
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

      {/* QUESTS */}
      {workspaceQuests.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No active coding tasks</p>
          <p className="text-sm text-gray-500 mt-2">Check back later for new challenges!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {workspaceQuests.map((quest, index) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              index={index}
              theme="blue"
              onStart={handleStartQuest}
            />
          ))}
        </div>
      )}

      {/* ALERTS & MODALS */}
      <StressAlert 
        isOpen={showStressAlert} 
        onClose={() => setShowStressAlert(false)}
        onGoToShop={handleNavigateToShop}
      />

      {questToShow && (
        <QuestPage
          quest={questToShow}
          onClose={() => setSelectedQuest(null)}
        />
      )}
    </div>
  );
}
