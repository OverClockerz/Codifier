// ============================================================
// QUEST CARD COMPONENT
// ============================================================
// Reusable card component for displaying quests across all zones
// Supports different themes (blue, purple, orange) for zone-specific styling
// 
// FUTURE BACKEND INTEGRATION:
// - Quest data will come from API instead of local state
// - Add loading states and error handling
// - Support real-time quest updates via websockets
// ============================================================

import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import { Quest } from '../../types/game';
import svgPaths from '../../imports/svg-qb2wx137qt';
import { Tooltip } from '../extras/Tooltip';
import { calculateDeadline } from '../../utils/calculations';

interface QuestCardProps {
  quest: Quest;
  index: number;
  theme?: 'blue' | 'purple' | 'orange' | 'green';
  onStart: (questId: string) => void;
}

export function QuestCard({ quest, index, theme = 'blue', onStart }: QuestCardProps) {
  // ============================================================
  // CALCULATE DAYS REMAINING
  // ============================================================
  const daysLeft = quest.deadline
    ? calculateDeadline(quest.deadline)
    : null;

  // ============================================================
  // THEME COLORS
  // ============================================================
  const themeColors = {
    blue: {
      button: 'bg-[#2b7fff] hover:bg-blue-700',
      hover: 'hover:border-blue-500',
    },
    purple: {
      button: 'bg-[#9333ea] hover:bg-purple-700',
      hover: 'hover:border-purple-500',
    },
    orange: {
      button: 'bg-[#ff6b35] hover:bg-orange-700',
      hover: 'hover:border-orange-500',
    },
    green: {
      button: 'bg-[#22c55e] hover:bg-green-700',
      hover: 'hover:border-green-500',
    },
  };

  const colors = themeColors[theme];

  const handleStart = () => {
    onStart(quest.id);
  };

  // Skills tooltip content
  const skillsTooltip = quest.skills && quest.skills.length > 0 ? (
    <div className="max-w-xs">
      <p className="mb-2">Skills you'll improve:</p>
      <div className="space-y-1">
        {quest.skills.map((skill, i) => (
          <div key={i} className="text-xs text-purple-300">• {skill}</div>
        ))}
      </div>
    </div>
  ) : quest.description;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-[rgba(15,23,43,0.5)] border border-[#45556c] rounded-lg p-4 ${colors.hover} transition-all flex flex-col`}
      >
        {/* ============================================================ */}
        {/* QUEST HEADER */}
        {/* ============================================================ */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white">{quest.title}</h3>
          <Tooltip content={skillsTooltip}>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* ============================================================ */}
        {/* QUEST DESCRIPTION */}
        {/* ============================================================ */}
        <p className="text-sm text-slate-400 mb-3">{quest.description.length > 200 ? quest.description.slice(0, 200) + "..." : quest.description}</p>

        {/* ============================================================ */}
        {/* REWARDS & ACTION BUTTON */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between">
          {/* Type Badges */}
          <div className="flex gap-2 flex-wrap">
            {quest.expReward > 0 && (
              <Tooltip content="Type of Active Quest">
                <span className="px-2 py-1 bg-[rgba(142,3,255,0.25)] text-[#acd7ff] text-xs rounded">
                  {quest.type}
                </span>
              </Tooltip>
            )}
            {/* EXP Badge */}
            {quest.expReward > 0 && (
              <Tooltip content="Experience Points Reward">
                <span className="px-2 py-1 bg-[rgba(43,127,255,0.2)] text-[#8ec5ff] text-xs rounded">
                  +{quest.expReward} EXP
                </span>
              </Tooltip>
            )}

            {/* Stress Badge */}
            {quest.stressImpact > 0 && (
              <Tooltip content="Stress will increase">
                <span className="px-2 py-1 bg-[rgba(251,44,54,0.2)] text-[#ffa2a2] text-xs rounded">
                  +{quest.stressImpact} Stress
                </span>
              </Tooltip>
            )}

            {/* Days Remaining Badge */}
            {daysLeft !== null && (
              <Tooltip content="Days until deadline">
                <span className="px-2 py-1 bg-[rgba(240,177,0,0.2)] text-[#ffdf20] text-xs rounded">
                  {daysLeft} days
                </span>
              </Tooltip>
            )}

            {/* Currency Badge */}
            {quest.currencyReward > 0 && (
              <Tooltip content="Currency Reward">
                <span className="px-2 py-1 bg-[rgba(34,197,94,0.2)] text-[#86efac] text-xs rounded">
                  +${quest.currencyReward}
                </span>
              </Tooltip>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className={`${colors.button} text-white px-3 py-1.5 rounded text-sm flex items-center gap-1.5 transition-colors`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
              <path d={svgPaths.p17e3da00} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {quest.status === 'in-progress' ? 'Continue' : 'Start'}
          </button>
        </div>
      </motion.div>
    </>
  );
}