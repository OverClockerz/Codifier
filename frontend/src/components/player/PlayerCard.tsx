import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { Tooltip } from '../extras/Tooltip';

interface PlayerCardProps {
  onClick: () => void;
}

export function PlayerCard({ onClick }: PlayerCardProps) {
  const { user } = useAuth();
  const { player } = useGame();
  console.log('🃏 PlayerCard rendering with player:', player.githubinfo);

  return (
    <Tooltip content="Click to view your profile">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-4 cursor-pointer group transition-all hover:bg-gray-800/30 rounded-lg p-2 -m-2"
      >
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-500 transition-all">
          <img
            src={player.githubinfo?.avatar_url || user?.avatar || ''}
            alt={player.username}
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="text-left">
          <h2 className="text-xl text-white">{player.username || 'Player'}</h2>
          {/* <p className="text-sm text-gray-400">
            #EMP-2024-{String(player.currentRun.runNumber).padStart(3, '0')}
          </p> */}
          <p className="text-sm text-gray-500">{player.companyName || 'OmniTech Solutions'}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
      </motion.button>
    </Tooltip>
  );
}