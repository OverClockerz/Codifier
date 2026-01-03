import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { useState } from 'react';
// import { ZoneType } from '../../types/game';
import { SimpleRadarChart } from '../charts/SimpleRadarChart';
import { ScrambleTextOnHover } from '../effects/ScrambleText';
import { getProfessionalAttributes } from '../../data/gameConfig';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Heart,
  Award,
  Menu,
  X,
  LogOut,
  ArrowLeft,
} from 'lucide-react';

export function ProfilePage({ onNavigateBack }: { onNavigateBack: () => void }) {
  const { user, logout } = useAuth();
  const { player } = useGame();
  // const [selectedTab, setSelectedTab] = useState<'overview' | ZoneType>('overview');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Calculate progress to next level
  // const levelProgress = (player.experience / player.experienceToNextLevel) * 100;

  // Fetch professional attributes from player proficiency data
  const attributesList = getProfessionalAttributes(player.proficiency);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1c]/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Logo & User */}
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <motion.button
                onClick={onNavigateBack}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-lg transition-all text-gray-400 hover:text-white"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>

              <h1 className="text-xl md:text-2xl bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <ScrambleTextOnHover text="OFFICE" />
              </h1>
              {/* <div className="hidden md:flex items-center gap-2 px-2 py-2 bg-gray-900/50 hover:bg-gray-800/50 rounded-full border border-gray-800 hover:border-gray-700 transition-all cursor-pointer">
                <img
                  src={player.githubinfo?.avatar_url || user?.avatar || ''}
                  alt={player.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-300">{user?.username}</span>
              </div> */}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 md:pt-18.75 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Player Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-2xl p-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar & Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <img
                    src={player.githubinfo?.avatar_url || user?.avatar || ''}
                    alt={player.username}
                    className="w-14 h-14 rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-xl text-white">{user?.username || 'Player'}</h2>
                  <p className="text-sm text-gray-400 mt-1">• {player.companyName || 'OmniTech Solutions'}</p>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Level */}
                <div className="text-center">
                  <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="text-2xl text-white">{player.level}</p>
                  {/* <p className="text-xs text-gray-600">{player.currentMonthTasksCompleted}</p> */}
                </div>

                {/* Salary */}
                <div className="text-center">
                  <DollarSign className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Currency</p>
                  <p className="text-2xl text-white">${player.currency}</p>
                  {/* <p className="text-xs text-green-400">+{player.currentMonthEarnings}</p> */}
                </div>

                {/* Paid Leaves */}
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Paid Leaves</p>
                  <p className="text-2xl text-white">{player.paidLeaves}</p>
                  <p className="text-xs text-gray-600">days</p>
                </div>

                {/* Mood/Stress */}
                <div className="text-center">
                  <Heart className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Mood / Stress</p>
                  <p className="text-2xl text-white">{player.mood} / {player.stress}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reputation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 ${(player.reputation ?? 0) >= 0 ? 'bg-green-400' : 'bg-red-400'} rounded-full`}></div>
                <h3 className="text-lg text-white">Reputation</h3>
              </div>
              <span className={`${(player.reputation ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'} text-xl`}>
                {(player.reputation ?? 0) >= 0 ? '+' : ''}{(player.reputation ?? 0).toFixed(2)}%
              </span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${(player.reputation ?? 0) >= 0
                  ? 'bg-linear-to-r from-green-500 to-emerald-500'
                  : 'bg-linear-to-r from-red-500 to-orange-500'
                  }`}
                style={{ width: `${Math.min(100, Math.abs((player.reputation ?? 0) / 20) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {(player.reputation ?? 0) < -20
                ? 'Critical! You will be fired!'
                : (player.reputation ?? 0) < 0
                  ? 'Warning: Improve reputation to avoid termination'
                  : 'Reputation affects monthly salary and job security'}
            </p>
          </motion.div>

          {/* Professional Attributes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-lg text-white mb-6">Professional Attributes</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Radar Chart + Legend */}
              <div className="flex flex-col items-center justify-center bg-gray-800/30 rounded-xl p-4">
                <SimpleRadarChart
                  data={attributesList.map(attr => ({ attribute: attr.name, value: attr.score, fullMark: attr.maxScore, angle: attr.angle }))}
                  width={300}
                  height={300}
                />

                <div className="mt-4 w-full flex flex-wrap gap-3 justify-center items-center">
                  {attributesList.map(attr => (
                    <div key={attr.id} className="flex items-center gap-2 bg-gray-800/20 px-3 py-1 rounded-full border border-gray-700">
                      <span className="text-xs text-gray-100 font-medium">{attr.name}</span>
                      <span className="text-xs text-gray-400">{attr.score}/{attr.maxScore}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attributes List */}
              <div className="space-y-3">
                {attributesList.map((attr) => (
                  <div key={attr.id} className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-white">{attr.id}. {attr.name}</p>
                        <p className="text-xs text-gray-500">{attr.description}</p>
                      </div>
                      <p className="text-lg text-white">{attr.score}/{attr.maxScore}</p>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(attr.score / attr.maxScore) * 100}%` }}
                        transition={{ delay: 0.3 + attr.id * 0.1 }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skill Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg text-white">Skill Breakdown</h3>
            </div>

            {Object.keys(player.skills ?? {}).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No skills acquired yet</p>
                <p className="text-sm text-gray-500 mt-2">Complete quests to gain skills!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(player.skills ?? {}).map(([skillName, level], idx) => (
                  <div key={idx} className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">{skillName}</span>
                      <span className="text-purple-400">{level}/100</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${level}%` }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="h-full bg-linear-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Career Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-lg text-white mb-4">Career Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Tasks Completed</p>
                <p className="text-3xl text-white">{player.currentMonthTasksCompleted}</p>
                {/* <p className="text-xs text-gray-600 mt-1">{player.currentMonthEarnings}</p> */}
              </div>
              <div >
                <p className="text-sm text-gray-500 mb-2">Current Salary</p>
                <div className='flex items-baseline gap-2'>
                  <p className="text-3xl text-white">${player.baseSalary}</p>
                  <p className={player.currentMonthEarnings >= 0 ? "text-xs text-green-400" : "text-xs text-red-400"}>{player.currentMonthEarnings >= 0 ? '+' : ''}{player.currentMonthEarnings}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Days Worked</p>
                <p className="text-3xl text-white">{player.currentDay}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}