import { motion } from 'motion/react';
import { useGame } from '../contexts/GameContext';
// import { useAuth } from '../contexts/AuthContext';
import {
  TrendingUp,
  Heart,
  Zap,
  DollarSign,
  Calendar,
  Award,
  AlertTriangle,
  Shield,
  User,
  ChevronRight,
  Code,
  Gamepad2,
  Users,
  Coffee,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { ZoneType } from '../types/game';
// import { getDifficultyLabel } from '../data/quests';
import { PlayerCard } from './player/PlayerCard';
import { Workspace } from '../zones/Workspace';
import { GameLounge } from '../zones/GameLounge';
import { MeetingRoom } from '../zones/MeetingRoom';
import { Cafeteria } from '../zones/Cafeteria';
// import { Tooltip } from './extras/Tooltip';
import { calculateDeadline } from '../utils/calculations';

const deadlineThreshold =2;

export function GameDashboard({ onProfileClick }: { onProfileClick?: () => void }) {
  const { player, activeQuests, activeBuffs } = useGame();
  // const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | ZoneType>('overview');

  // DEBUG: Log quest counts
  console.log('🎮 GameDashboard - Active Quests:', activeQuests.length);
  console.log('📍 Quest distribution:', {
    workspace: activeQuests.filter(q => q.zone === 'workspace').length,
    'game-lounge': activeQuests.filter(q => q.zone === 'game-lounge').length,
    'meeting-room': activeQuests.filter(q => q.zone === 'meeting-room').length,
    total: activeQuests.length,
  });

  // Calculate progress to next level
  const levelProgress = (player.experience / player.experienceToNextLevel) * 100;

  // Get urgent quests (less than 3 days remaining)
  const urgentQuests = activeQuests.filter(q => {
    if (!q.deadline) return false;
    const daysLeft = calculateDeadline(q.deadline);
    return daysLeft <= deadlineThreshold;
  });

  // Calculate completed quests this month
  const completedThisMonth = player.currentMonthTasksCompleted || 0;

  // Get counts for each zone
  const workspaceCount = activeQuests.filter(q => q.zone === 'workspace').length;
  const gameLoungeCount = activeQuests.filter(q => q.zone === 'game-lounge').length;
  const meetingRoomCount = activeQuests.filter(q => q.zone === 'meeting-room').length;

  // Get zone icon
  const getZoneIcon = (zone: ZoneType) => {
    switch (zone) {
      case 'workspace':
        return <Code className="w-4 h-4" />;
      case 'game-lounge':
        return <Gamepad2 className="w-4 h-4" />;
      case 'meeting-room':
        return <Users className="w-4 h-4" />;
      case 'cafeteria':
        return <Coffee className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Get zone color
  const getZoneColor = (zone: ZoneType) => {
    switch (zone) {
      case 'workspace':
        return 'bg-blue-600 text-white';
      case 'game-lounge':
        return 'bg-purple-600 text-white';
      case 'meeting-room':
        return 'bg-orange-600 text-white';
      case 'cafeteria':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-600 text-white';
    if (difficulty <= 4) return 'bg-yellow-600 text-white';
    return 'bg-red-600 text-white';
  };
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty <= 4) return 'Medium';
    return 'Hard';
  }

  return (
    <div className="space-y-6">
      {/* Player Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Player Info */}
          <PlayerCard onClick={() => onProfileClick?.()} />

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            {/* Level */}
            <div className="bg-black/30 rounded-lg px-4 py-2 min-w-[80px]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Level</p>
                  <p className="text-lg text-white">{player.level}</p>
                </div>
              </div>
            </div>

            {/* Currency */}
            <div className="bg-black/30 rounded-lg px-4 py-2 min-w-[100px]">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Currency</p>
                  <p className="text-lg text-white">${player.currency.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Day/Month */}
            <div className="bg-black/30 rounded-lg px-4 py-2 min-w-[80px]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-xs text-gray-400">Day / Month</p>
                  <p className="text-lg text-white">{player.currentDay} / {player.currentMonth}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bars Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Mood */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Mood</span>
              <span>{player.mood}/100</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${player.mood}%` }}
                className="h-full bg-green-500"
              />
            </div>
          </div>

          {/* Stress */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Stress</span>
              <span>{player.stress}/100</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${player.stress}%` }}
                className="h-full bg-red-500"
              />
            </div>
          </div>

          {/* EXP */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>EXP</span>
              <span>{player.experience}/{player.experienceToNextLevel}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">Salary</p>
            <p className="text-xl text-white">${player.baseSalary}</p>
            <p className="text-xs text-green-400">+{player.currentMonthEarnings}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Paid Leaves</p>
            <p className="text-xl text-white">{player.paidLeaves}</p>
            <p className="text-xs text-gray-500">days</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Soft Skills</p>
            <p className="text-xl text-white">75</p>
            <p className="text-xs text-gray-500">%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Reputation</p>
            <p className={`text-xl ${(player.reputation ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(player.reputation ?? 0) >= 0 ? '+' : ''}{(player.reputation ?? 0).toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500">This month</p>
          </div>
        </div>
      </motion.div>

      {/* Zone Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
            selectedTab === 'overview'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setSelectedTab('workspace')}
          className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
            selectedTab === 'workspace'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {getZoneIcon('workspace')} Workspace
        </button>
        <button
          onClick={() => setSelectedTab('game-lounge')}
          className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
            selectedTab === 'game-lounge'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {getZoneIcon('game-lounge')} Game Lounge
        </button>
        <button
          onClick={() => setSelectedTab('meeting-room')}
          className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
            selectedTab === 'meeting-room'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/50'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {getZoneIcon('meeting-room')} Meeting Room
        </button>
        <button
          onClick={() => setSelectedTab('cafeteria')}
          className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
            selectedTab === 'cafeteria'
              ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {getZoneIcon('cafeteria')} Cafeteria
        </button>
      </motion.div>

      {/* Conditional Content Based on Selected Tab */}
      {selectedTab === 'overview' ? (
        <>
          {/* Career Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl mb-4">Career Dashboard</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Active Quests */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Active Quests</p>
                <p className="text-3xl text-white">{activeQuests.length}</p>
              </div>

              {/* Completed This Month */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Completed This Month</p>
                <p className="text-3xl text-white">{completedThisMonth}</p>
              </div>

              {/* Urgent */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Urgent (≤2 days)</p>
                <p className="text-3xl text-red-400">{urgentQuests.length}</p>
              </div>
            </div>

            {/* Urgent Deadlines Section */}
            {urgentQuests.length > 0 && (
              <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-400 mb-3">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="text-lg">Urgent Deadlines</h3>
                </div>
                <div className="space-y-2">
                  {urgentQuests.map(quest => {
                    const daysLeft = quest.deadline 
                      ? calculateDeadline(quest.deadline)
                      : 0;
                    return (
                      <div key={quest.id} className="text-sm">
                        <span className="text-white">• {quest.title}</span>
                        <span className="text-red-400"> - {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* All Quests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl mb-4">All Quests</h2>
            
            <div className="space-y-3">
              {activeQuests.map((quest, index) => {
                const daysLeft = quest.deadline 
                  ? calculateDeadline(quest.deadline)
                  : null;

                return (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => setSelectedTab(quest.zone)}
                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                          <h3 className="text-lg text-white">{quest.title}</h3>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-3">{quest.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {/* Zone Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs ${getZoneColor(quest.zone)}`}>
                            {quest.zone.replace('-', ' ')}
                          </span>
                          
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
                          {quest.currencyReward > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs bg-yellow-900/50 text-yellow-400">
                              +${quest.currencyReward} Salary
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
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Active Buffs */}
          {activeBuffs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Active Buffs</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeBuffs.map((buff) => (
                  <div key={buff.itemId} className="bg-purple-900/20 border border-purple-800/50 rounded-lg p-3">
                    <div className="text-white mb-1">{buff.name}</div>
                    {buff.expiresAt && (
                      <div className="text-xs text-gray-500">
                        {Math.floor((buff.expiresAt - Date.now()) / 60000)}m remaining
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      ) : selectedTab === 'workspace' ? (
        <Workspace />
      ) : selectedTab === 'game-lounge' ? (
        <GameLounge />
      ) : selectedTab === 'meeting-room' ? (
        <MeetingRoom />
      ) : selectedTab === 'cafeteria' ? (
        <Cafeteria />
      ) : null}
    </div>
  );
}