import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import {
  User,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Calendar,
  Bell,
  Settings,
  X,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewFullProfile?: () => void;
}

export function ProfileModal({ isOpen, onClose, onViewFullProfile }: ProfileModalProps) {
  const { user, logout } = useAuth();
  const { player } = useGame();
  const modalRef = useRef<HTMLDivElement>(null);

  // Calculate progress to next level
  const levelProgress = (player.experience / player.experienceToNextLevel) * 100;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-[70] max-h-[85vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-6">
              {/* Player Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <img
                  src={user?.avatar}
                  alt={user?.username}
                  className="w-6 h-6 rounded-full"
                />
                  </div>
                  <div>
                    <h2 className="text-lg text-white">{user?.username || 'Player'}</h2>
                    <p className="text-sm text-gray-400">#EMP-2024-{String(player.currentRun.runNumber).padStart(3, '0')}</p>
                    <p className="text-xs text-gray-500">OmniTech Solutions</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 hidden md:block" />
                </div>

                {/* Top Right Stats */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Level */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-900/30 border border-blue-800/50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Level</p>
                      <p className="text-sm text-white">{player.level}</p>
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-yellow-900/30 border border-yellow-800/50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-400">Currency</p>
                      <p className="text-sm text-white">${player.currency}</p>
                    </div>
                  </div>

                  {/* Day/Month */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-900/30 border border-purple-800/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs text-gray-400">Day / Month</p>
                      <p className="text-sm text-white">{player.currentDay} / {player.currentMonth}</p>
                    </div>
                  </div>

                  {/* Notifications */}
                  <button className="relative w-10 h-10 flex items-center justify-center bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg transition-all">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
                      1
                    </span>
                  </button>

                  {/* Settings */}
                  <button className="w-10 h-10 flex items-center justify-center bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg transition-all">
                    <Settings className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3 mb-6">
                {/* Mood */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Mood</span>
                    <span className="text-white">{player.mood}/100</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${player.mood}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full bg-green-500"
                    />
                  </div>
                </div>

                {/* Stress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Stress</span>
                    <span className="text-white">{player.stress}/100</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${player.stress}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full bg-red-500"
                    />
                  </div>
                </div>

                {/* EXP */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">EXP</span>
                    <span className="text-white">{player.experience}/{player.experienceToNextLevel}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress}%` }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {/* Salary */}
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Salary</p>
                  <p className="text-xl text-white mb-1">${player.baseSalary}</p>
                  <p className="text-xs text-green-400">+{player.currentMonthEarnings}</p>
                </div>

                {/* Code Quality */}
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Skills</p>
                  <p className="text-xl text-white mb-1">{Object.keys(player.skills ?? {}).length}</p>
                  <p className="text-xs text-gray-600">acquired</p>
                </div>

                {/* Soft Skills */}
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Tasks</p>
                  <p className="text-xl text-white mb-1">{player.currentMonthTasksCompleted || 0}</p>
                  <p className="text-xs text-gray-600">completed</p>
                </div>

                {/* Reputation */}
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Reputation</p>
                  <p
                    className={`text-xl ${
                      (player.reputation ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    } mb-1`}
                  >
                    {(player.reputation ?? 0) >= 0 ? '+' : ''}{(player.reputation ?? 0).toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-600">this month</p>
                </div>
              </div>

              {/* Reputation Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Reputation Status</span>
                  <span
                    className={`${(player.reputation ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {(player.reputation ?? 0) >= 0 ? 'Good Standing' : 'Warning'}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, Math.abs((player.reputation ?? 0) / 20) * 100)}%`,
                    }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`h-full ${
                      (player.reputation ?? 0) >= 0
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}
                  />
                </div>
                {(player.reputation ?? 0) < -10 && (
                  <p className="text-xs text-red-400 mt-1">⚠️ Reputation at risk! Complete tasks to improve.</p>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 rounded-xl p-4">
                  <h4 className="text-sm text-gray-400 mb-3">Career Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Run:</span>
                      <span className="text-white">#{player.currentRun.runNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Paid Leaves:</span>
                      <span className="text-green-400">{player.paidLeaves}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Level:</span>
                      <span className="text-purple-400">{player.currentRun.maxLevelAchieved}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <h4 className="text-sm text-gray-400 mb-3">This Month</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tasks Completed:</span>
                      <span className="text-white">{player.currentMonthTasksCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Earnings:</span>
                      <span className="text-green-400">+${player.currentMonthEarnings}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <span className="text-yellow-400">{player.currentRating}/5.0</span>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onClose();
                    if (onViewFullProfile) {
                      onViewFullProfile();
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="flex-1 px-4 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}