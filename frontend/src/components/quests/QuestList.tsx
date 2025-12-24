import { motion } from 'motion/react';
import { useGame } from '../../contexts/GameContext';
import { Quest, ZoneType } from '../../types/game';
import { Clock, Trophy, DollarSign, TrendingUp, Play, CheckCircle, XCircle } from 'lucide-react';
import { ZoneHeader } from '../ZoneHeader';

interface QuestListProps {
  zone: ZoneType;
  onBack: () => void;
  onStartQuest: (questId: string) => void;
}

export function QuestList({ zone, onBack, onStartQuest }: QuestListProps) {
  const { activeQuests } = useGame();
  
  const zoneQuests = activeQuests.filter((q) => q.zone === zone);
  const availableQuests = zoneQuests.filter((q) => q.status === 'available');
  const inProgressQuests = zoneQuests.filter((q) => q.status === 'in-progress');

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty === 1) return 'text-green-400 border-green-400/30 bg-green-400/10';
    if (difficulty === 2) return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    if (difficulty === 3) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    if (difficulty === 4) return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
    return 'text-red-400 border-red-400/30 bg-red-400/10';
  };

  const getDifficultyLabel = (difficulty: number): string => {
    const labels = ['', 'Easy', 'Medium', 'Hard', 'Very Hard', 'Expert'];
    return labels[difficulty] || 'Unknown';
  };

  const QuestCard = ({ quest }: { quest: Quest }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
    >
      {/* Quest Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xl">{quest.title}</h4>
          </div>
          <p className="text-gray-400 text-sm">{quest.description}</p>
        </div>
        <div className={`px-3 py-1 border rounded-lg text-xs ${getDifficultyColor(quest.difficulty)}`}>
          {getDifficultyLabel(quest.difficulty)}
        </div>
      </div>

      {/* Quest Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-xs text-gray-500">EXP</div>
            <div className="text-sm text-blue-400">+{quest.expReward}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-yellow-400" />
          <div>
            <div className="text-xs text-gray-500">Currency</div>
            <div className="text-sm text-yellow-400">+${quest.currencyReward}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-500">Deadline</div>
            <div className="text-sm text-white">{quest.deadline}h</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-purple-400" />
          <div>
            <div className="text-xs text-gray-500">Type</div>
            <div className="text-sm text-purple-400 capitalize">{quest.frequency}</div>
          </div>
        </div>
      </div>

      {/* Impact Indicators */}
      <div className="flex gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Stress:</span>
          <span className={quest.stressImpact > 0 ? 'text-red-400' : 'text-green-400'}>
            {quest.stressImpact > 0 ? '+' : ''}{quest.stressImpact}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Mood:</span>
          <span className={quest.moodImpact > 0 ? 'text-green-400' : 'text-red-400'}>
            {quest.moodImpact > 0 ? '+' : ''}{quest.moodImpact}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {quest.status === 'available' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStartQuest(quest.id)}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start Quest
        </motion.button>
      )}

      {quest.status === 'in-progress' && (
        <div className="w-full py-3 bg-green-600/20 border border-green-600/30 rounded-lg flex items-center justify-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          In Progress
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <ZoneHeader
        zone={zone}
        onBack={onBack}
        availableCount={availableQuests.length}
        inProgressCount={inProgressQuests.length}
      />

      {/* In Progress Quests */}
      {inProgressQuests.length > 0 && (
        <div>
          <h3 className="text-xl mb-4 text-green-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Active Quests
          </h3>
          <div className="grid gap-4">
            {inProgressQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      )}

      {/* Available Quests */}
      {availableQuests.length > 0 && (
        <div>
          <h3 className="text-xl mb-4 text-blue-400 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Available Quests
          </h3>
          <div className="grid gap-4">
            {availableQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      )}

      {/* No Quests */}
      {zoneQuests.length === 0 && (
        <div className="text-center py-16">
          <XCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No quests available in this zone yet</p>
          <p className="text-sm text-gray-600 mt-2">Check back later or try another zone</p>
        </div>
      )}
    </div>
  );
}