import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { ZoneType, Quest, GitHubInfo } from '../types/game';
import { GameDashboard } from './GameDashboard';
import { QuestList } from './quests/QuestList';
import { SimpleQuestModal } from './quests/SimpleQuestModal';
import { ZoneTransition } from './transitions/ZoneTransition';
import { QuestStartTransition } from './transitions/QuestStartTransition';
import { LevelUpTransition } from './transitions/LevelUpTransition';
import { ScrambleTextOnHover } from './effects/ScrambleText';
import { ProfileModal } from './player/ProfileModal';
import { NotificationsModal } from './extras/NotificationsModal';
import { DigitalClock } from './extras/DigitalClock';

export function GamePage({ onNavigateToProfile }: { onNavigateToProfile: () => void }) {
  const { user, logout } = useAuth();
  const { player, startQuest, activeQuests, showLevelUp, dismissLevelUp, getUnreadCount } = useGame();
  const [selectedZone, setSelectedZone] = useState<ZoneType | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeQuestModal, setActiveQuestModal] = useState<Quest | null>(null);
  const [questStarting, setQuestStarting] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = getUnreadCount();

  const handleStartQuest = (questId: string) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (quest) {
      setQuestStarting(quest.title);
      setTimeout(() => {
        startQuest(questId);
        setQuestStarting(null);
        setActiveQuestModal(quest);
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 bg-[rgba(0,0,0,0)]">
          <div className="flex items-center justify-between">
            {/* Logo & User */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <ScrambleTextOnHover text="OFFICE" />
              </h1>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="hidden md:flex items-center gap-2 px-2 py-2 bg-gray-900/50 hover:bg-gray-800/50 rounded-full border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
              >
                <img
                  src={player.githubinfo?.avatar_url || user?.avatar || ''}
                  alt={player.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-300">{user?.username}</span>
              </button>
            </div>

            {/* Quick Stats - Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Digital Clock */}
              <DigitalClock />
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                <span className="text-xs text-gray-400">Level</span>
                <span className="text-sm text-blue-400">{player.level}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-800/30 rounded-lg">
                <span className="text-xs text-gray-400">Mood</span>
                <span className="text-sm text-green-400">{player.mood}%</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/20 border border-red-800/30 rounded-lg">
                <span className="text-xs text-gray-400">Stress</span>
                <span className="text-sm text-red-400">{player.stress}%</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                <span className="text-xs text-gray-400">$</span>
                <span className="text-sm text-yellow-400">{player.currency.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications Button */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative w-10 h-10 flex items-center justify-center bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-700 rounded-lg transition-all"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-gray-800"
            >
              {/* Profile Button - Mobile */}
              <button
                onClick={() => {
                  setShowProfileModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg border border-gray-800 mb-3 transition-all"
              >
                <img
                  src={player.githubinfo?.avatar_url || user?.avatar || ''}
                  alt={player.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 text-left">
                  <p className="text-sm text-white">{user?.username}</p>
                  {/* <p className="text-xs text-gray-400">#EMP-2024-{String(player.currentRun.runNumber).padStart(3, '0')}</p> */}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div className="px-3 py-2 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <span className="text-xs text-gray-400 block">Level</span>
                  <span className="text-lg text-blue-400">{player.level}</span>
                </div>
                <div className="px-3 py-2 bg-green-900/20 border border-green-800/30 rounded-lg">
                  <span className="text-xs text-gray-400 block">Mood</span>
                  <span className="text-lg text-green-400">{player.mood}%</span>
                </div>
                <div className="px-3 py-2 bg-red-900/20 border border-red-800/30 rounded-lg">
                  <span className="text-xs text-gray-400 block">Stress</span>
                  <span className="text-lg text-red-400">{player.stress}%</span>
                </div>
                <div className="px-3 py-2 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                  <span className="text-xs text-gray-400 block">Currency</span>
                  <span className="text-lg text-yellow-400">${player.currency}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 md:pt-24 pb-16 px-4 md:px-6 min-h-screen">
        <ZoneTransition zone={selectedZone}>
          <div className="max-w-7xl mx-auto">
            {/* Welcome Banner */}
            {!selectedZone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-6xl mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome back, {user?.username}!
                </h2>
                <p className="text-lg md:text-xl text-gray-400">
                  {player.isBurntOut 
                    ? '⚠️ You are burnt out! Visit the Game Lounge or Cafeteria to recover.'
                    : 'Ready to advance your career? Choose a zone or continue your quests.'}
                </p>
              </motion.div>
            )}

            {/* Dashboard - Show when no zone selected */}
            {!selectedZone && (
              <div className="mb-12">
                <GameDashboard onProfileClick={onNavigateToProfile} />
              </div>
            )}

            {/* Zone Selector or Quest List */}
            <div className="mt-8">
              {selectedZone ? (
                <QuestList
                  zone={selectedZone}
                  onBack={() => setSelectedZone(null)}
                  onStartQuest={handleStartQuest}
                />
              ) : null}
            </div>
          </div>
        </ZoneTransition>
      </main>

      {/* Active Quest Modal */}
      {activeQuestModal && (
        <SimpleQuestModal
          quest={activeQuestModal}
          onClose={() => setActiveQuestModal(null)}
        />
      )}

      {/* Transitions */}
      <QuestStartTransition
        show={questStarting !== null}
        questTitle={questStarting || ''}
        onComplete={() => setQuestStarting(null)}
      />
      
      <LevelUpTransition
        show={showLevelUp}
        level={player.level}
        onComplete={dismissLevelUp}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onViewFullProfile={onNavigateToProfile}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}