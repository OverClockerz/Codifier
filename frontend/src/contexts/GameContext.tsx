import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerState, Quest, InventoryItem, ActiveBuff, MonthlyReport, Notification } from '../types/game';
import { getExperienceForLevel, getSalaryForLevel, REPUTATION_WEIGHTS, GAME_CONSTANTS } from '../data/gameConfig';
import { useAuth } from './AuthContext';
import { fetchPlayerData, updatePlayerData } from '../services/api';
import { shopItems } from '../data/shopItems';
// import { LOGIN_DATE_TIME } from '../components/auth/GitHubAuthModal';
import { GameOverAlert } from '../components/extras/GameOverAlert';
import { gameTimeSince } from '../utils/calculations';

/**
 * GAME CONTEXT - MAIN GAME STATE MANAGEMENT
 * ==========================================
 * * 🔗 BACKEND INTEGRATION - FULLY INTEGRATED
 * * This file manages all game state and fetches ALL data from the backend.
 */

interface GameContextType {
  player: PlayerState;
  activeQuests: Quest[];
  completedQuests: Quest[];
  inventory: InventoryItem[];
  activeBuffs: ActiveBuff[];
  monthlyReports: MonthlyReport[];
  notifications: Notification[];
  showLevelUp: boolean;
  // Actions
  setPlayer: (player: PlayerState) => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string, performanceScore: number, player: PlayerState) => void;
  failQuest: (questId: string) => void;
  purchaseItem: (itemId: string) => boolean;
  takePaidLeave: () => boolean;
  updateMoodStress: (moodChange: number, stressChange: number) => void;
  addExperience: (amount: number) => void;
  addCurrency: (amount: number) => void;
  advanceDay: () => void;
  resetCareer: () => void;
  saveGame: () => void;
  loadGame: () => void;
  dismissLevelUp: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  //Default Game State without Player Backend
  const [player, setPlayer] = useState<PlayerState>({
    id: '',
    username: '',
    githubinfo: {
      github_id: '',
      avatar_url: '',
      github_email: '',
    },
    gameStartDate: '',
    level: 0,
    experience: 0,
    experienceToNextLevel: 0,
    currency: 0,
    mood: 0,
    stress: 0,
    isBurntOut: false,
    baseSalary: 0,
    currentMonthEarnings: 0,
    currentMonthTasksCompleted: 0,
    paidLeaves: 0,
    currentDay: 0,
    currentMonth: 0,
    lastLoginDate: new Date(),
    proficiency: {
      coding_skill: 0,
      soft_skill: 0,
      critical_thinking_skill: 0,
      problem_solving: 0,
      stress_resistance: 0
    },
    careerHistory: [],
    currentRun: {
      runNumber: 0,
      startLevel: 0,
      maxLevelAchieved: 0,
      totalExperience: 0,
      monthsWorked: 0,
    },
    reputation: 0,
    skills: {},
    activeBuffs: {},
    permanentBuffs: [],
    activeQuests: [],
    completedQuests: [],
    inventory: [],
  });
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Game Over State
  const [isGameOver, setIsGameOver] = useState(false);

  // Load game on mount
  useEffect(() => {
    if (user?.id && user?.username) {
      loadGame();
    }
  }, [user?.id, user?.username]);

  // Save game on changes
  useEffect(() => {
    if (user?.id && player.id && activeQuests.length >= 0) {
      saveGame();
    }
  }, [player, activeQuests, completedQuests, inventory]);

  // Game loop: periodically update player details from backend
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(() => {
      loadGame();
    }, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, [user?.id]);

  // Check for expired quest deadlines and burnout status
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer(prevPlayer => {
        if (prevPlayer.isBurntOut && prevPlayer.mood > GAME_CONSTANTS.BURNOUT_MOOD_THRESHOLD) {
          return { ...prevPlayer, isBurntOut: false };
        }
        else if (!prevPlayer.isBurntOut && prevPlayer.mood <= GAME_CONSTANTS.BURNOUT_MOOD_THRESHOLD) {
          return { ...prevPlayer, isBurntOut: true };
        }
        return prevPlayer;
      });

      const now = Math.floor(Date.now() / 1000);
      activeQuests.forEach(quest => {
        if (quest.deadline && now > quest.deadline) {
          failQuest(quest.id);
          addNotification({
            type: 'alert',
            title: 'Quest Failed - Deadline Missed',
            message: `Failed: "${quest.title}". Your reputation has been affected.`,
          });
        }
      });
    }, 1000); // Changed to 1 second for better performance

    return () => clearInterval(interval);
  }, [activeQuests]);

  const startQuest = (questId: string) => {
    setActiveQuests(prev =>
      prev.map(q =>
        q.id === questId
          ? { ...q, status: 'in-progress' as const, startedAt: Math.floor(Date.now() / 1000) }
          : q
      )
    );
  };

  const completeQuest = (questId: string, performanceScore: number = 100, player: PlayerState) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest) return;

    const multiplier = performanceScore / 100;
    const expGain = Math.floor(quest.expReward * multiplier);
    const currencyGain = Math.floor(quest.currencyReward * multiplier);

    let finalExp = expGain + Math.floor(expGain * (player.activeBuffs.expBoost || 0) / 100);
    let finalCurrency = currencyGain + Math.floor(currencyGain * (player.activeBuffs.currencyBoost || 0) / 100);

    addExperience(finalExp);
    addCurrency(finalCurrency);

    let stressChange = 0;
    let moodChange = 0;

    if (quest.zone === 'workspace') {
      stressChange = Math.floor(quest.stressImpact * multiplier);
      moodChange = Math.floor(quest.moodImpact * multiplier);
    } else if (quest.zone === 'game-lounge') {
      moodChange = Math.floor(Math.abs(quest.moodImpact) * multiplier);
      stressChange = -Math.floor(Math.abs(quest.stressImpact) * multiplier);
    } else if (quest.zone === 'meeting-room') {
      if (performanceScore >= 70) {
        moodChange = Math.floor(Math.abs(quest.moodImpact) * multiplier);
        stressChange = -Math.floor(quest.stressImpact * (multiplier * 0.5));
      } else {
        moodChange = Math.floor(quest.moodImpact * multiplier);
        stressChange = Math.floor(quest.stressImpact * multiplier);
      }
    }

    stressChange += Math.floor(stressChange * (-(player.activeBuffs.stressReduction || 0) / 100));
    moodChange += Math.floor(moodChange * ((player.activeBuffs.moodIncrease || 0) / 100));

    updateMoodStress(moodChange, stressChange);

    let reputationChange = 0;
    if (performanceScore < 50) {
      if (quest.difficulty <= 2) reputationChange = -0.5;
      else if (quest.difficulty <= 3) reputationChange = -1.5;
      else reputationChange = -3;
    } else if (performanceScore < 70) {
      if (quest.difficulty <= 2) reputationChange = 0.005 * multiplier;
      else if (quest.difficulty <= 3) reputationChange = 0.02 * multiplier;
      else reputationChange = 0.1 * multiplier;
    } else {
      if (quest.difficulty <= 2) reputationChange = 0.01 * multiplier;
      else if (quest.difficulty <= 3) reputationChange = 0.05 * multiplier;
      else reputationChange = 0.2 * multiplier;
    }

    const skillsGained: Record<string, number> = {};
    if (quest.skills) {
      quest.skills.forEach(skill => {
        skillsGained[skill] = Math.floor(5 * (performanceScore / 100));
      });
    }

    setPlayer(prev => {
      const newSkills = { ...prev.skills };
      Object.entries(skillsGained).forEach(([skill, gain]) => {
        newSkills[skill] = Math.min(100, (newSkills[skill] || 0) + gain);
      });

      return {
        ...prev,
        currentMonthTasksCompleted: (prev.currentMonthTasksCompleted || 0) + 1,
        reputation: prev.reputation + reputationChange,
        skills: newSkills,
      };
    });

    setActiveQuests(prev => prev.filter(q => q.id !== questId));
    setCompletedQuests(prev => [...prev, { ...quest, status: 'completed', completedAt: Math.floor(Date.now() / 1000) }]);
  };

  const failQuest = (questId: string) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest) return;

    updateMoodStress(-10, 15);

    let reputationLoss = 0;
    if (quest.deadline && Date.now() > quest.deadline) {
      if (quest.difficulty <= 2) reputationLoss = -2;
      else if (quest.difficulty <= 3) reputationLoss = -1.5;
      else reputationLoss = -0.5;
    }

    setPlayer(prev => {
      const newRep = prev.reputation + reputationLoss;
      // Trigger Game Over if low reputation
      if (newRep < -20) {
        setIsGameOver(true);
      }
      return { ...prev, reputation: newRep };
    });

    setActiveQuests(prev => prev.filter(q => q.id !== questId));
    setCompletedQuests(prev => [...prev, { ...quest, status: 'failed', completedAt: Math.floor(Date.now() / 1000) }]);
  };

  const purchaseItem = (itemId: string): boolean => {
    const { SHOP_ITEMS } = require('../data/shopItems');
    const item = SHOP_ITEMS.find((i: any) => i.id === itemId);

    if (!item || player.currency < item.price) return false;

    setPlayer(prev => ({ ...prev, currency: prev.currency - item.price }));

    setInventory(prev => {
      const existing = prev.find(i => i.item.id === itemId);
      if (existing) {
        return prev.map(i => i.item.id === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1, purchasedAt: Date.now() }];
    });

    return true;
  };


  const takePaidLeave = (): boolean => {
    if (player.paidLeaves <= 0) return false;
    setPlayer(prev => ({ ...prev, paidLeaves: prev.paidLeaves - 1, mood: Math.min(100, prev.mood + 30), stress: Math.max(0, prev.stress - 40) }));
    return true;
  };

  const updateMoodStress = (moodChange: number, stressChange: number) => {
    setPlayer(prev => {
      const newMood = Math.max(0, Math.min(100, prev.mood + moodChange));
      const newStress = Math.max(0, Math.min(100, prev.stress + stressChange));
      return { ...prev, mood: newMood, stress: newStress};
    });
  };

  const addExperience = (amount: number) => {
    setPlayer(prev => {
      let newExp = prev.experience + amount;
      let newLevel = prev.level;
      let expToNext = prev.experienceToNextLevel;

      while (newExp >= expToNext) {
        newExp -= expToNext;
        newLevel++;
        expToNext = getExperienceForLevel(newLevel);
      }

      if (newLevel > prev.level) setShowLevelUp(true);

      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        experienceToNextLevel: expToNext,
        baseSalary: getSalaryForLevel(newLevel),
        currentRun: { ...prev.currentRun, maxLevelAchieved: Math.max(newLevel, prev.currentRun.maxLevelAchieved), totalExperience: prev.currentRun.totalExperience + amount },
      };
    });
  };

  const addCurrency = (amount: number) => {
    setPlayer(prev => ({ ...prev, currentMonthEarnings: prev.currentMonthEarnings + amount }));
  };

  const advanceDay = () => {
    setPlayer(prev => {
      const newDay = prev.currentDay + 1;
      const newMonth = Math.floor((newDay - 1) / GAME_CONSTANTS.DAYS_PER_MONTH) + 1;
      if (newDay % GAME_CONSTANTS.DAYS_PER_MONTH === 1 && newDay > 1) processMonthlyReport(prev);
      return { ...prev, currentDay: newDay, currentMonth: newMonth };
    });
  };

  const processMonthlyReport = (currentPlayer: PlayerState) => {
    const lastMonthQuests = completedQuests.filter(q => q.completedAt && q.completedAt > Date.now() - 30 * 24 * 60 * 60 * 1000);
    const completedCount = lastMonthQuests.filter(q => q.status === 'completed').length;
    const taskCompletionRate = lastMonthQuests.length > 0 ? (completedCount / lastMonthQuests.length) * 100 : 0;
    const codeQualityScore = 75 + Math.random() * 25;
    const softSkillScore = 70 + Math.random() * 30;

    const { getSalaryAdjustment } = require('../data/gameConfig');
    const reputationScore = taskCompletionRate * REPUTATION_WEIGHTS.taskCompletion + codeQualityScore * REPUTATION_WEIGHTS.codeQuality + softSkillScore * REPUTATION_WEIGHTS.softSkills;
    const salaryAdjustment = getSalaryAdjustment(reputationScore);
    const totalEarnings = currentPlayer.currentMonthEarnings + (currentPlayer.baseSalary * (1 + salaryAdjustment / 100));

    setMonthlyReports(prev => [...prev, {
      month: currentPlayer.currentMonth,
      taskCompletionRate,
      codeQualityScore,
      softSkillScore,
      reputationScore,
      salaryAdjustment,
      totalEarnings,
      warnings: reputationScore < 50 ? ['Performance below expectations'] : [],
    }]);

    setPlayer(prev => ({ ...prev, currency: prev.currency + totalEarnings, currentMonthEarnings: 0 }));
  };
  //reset player career
  const resetCareer = async () => {
    console.log("🔄 Reset Career Initiated");
    try {
      // 1. Calculate new state locally first
      const { getRestartLevel } = require('../data/gameConfig');
      const totalExp = player.currentRun?.totalExperience || 0;
      const newStartLevel = getRestartLevel(totalExp);

      const freshPlayer: PlayerState = {
        id: player.id,
        username: player.username,
        githubinfo: player.githubinfo,
        gameStartDate: player.gameStartDate,
        level: newStartLevel,
        experience: 0,
        experienceToNextLevel: getExperienceForLevel(newStartLevel),
        currency: 100,
        mood: 70,
        stress: 20,
        isBurntOut: false,
        baseSalary: getSalaryForLevel(newStartLevel),
        currentMonthEarnings: 0,
        currentMonthTasksCompleted: 0,
        paidLeaves: 0,
        currentDay: 1,
        currentMonth: 1,
        lastLoginDate: player.lastLoginDate,
        proficiency: {
          coding_skill: 0,
          soft_skill: 0,
          critical_thinking_skill: 0,
          problem_solving: 0,
          stress_resistance: 0
        },
        careerHistory: [
          ...(player.careerHistory || []),
          { ...player.currentRun, reasonForEnd: 'fired', endDate: new Date().toISOString() },
        ],
        currentRun: {
          runNumber: (player.currentRun?.runNumber || 1) + 1,
          startLevel: newStartLevel,
          maxLevelAchieved: newStartLevel,
          totalExperience: 0,
          monthsWorked: 0,
        },
        reputation: 0,
        skills: {},
        activeBuffs: {},
        permanentBuffs: [],
        activeQuests: [],
        completedQuests: [],
        inventory: [],
      };

      // 2. Clear frontend state immediately
      setPlayer(freshPlayer);
      setActiveQuests([]);
      setCompletedQuests([]);
      setInventory([]);
      setActiveBuffs([]);

      // 3. Close the modal IMMEDIATELY so the user sees something happened
      setIsGameOver(false);
      console.log("✅ Alert closed");

      // 4. Then sync with backend
      if (user?.username) {
        console.log("🔄 Reloading game data from backend...");
        await loadGame();
      }
    } catch (error) {
      console.error("❌ Error resetting career:", error);
      setIsGameOver(false); // Ensure modal closes even if error
    }
  };
  const elapsed = gameTimeSince(player);
  //save game to backend
  const saveGame = async () => {
    if (!user?.id) return;
    try {
      const backendData = {
        username: player.username,
        level: player.level,
        experience: player.experience,
        experienceToNextLevel: player.experienceToNextLevel,
        currency: player.currency || 0,
        mood: player.mood,
        stress: player.stress,
        isBurntOut: player.isBurntOut,
        baseSalary: player.baseSalary || 0,
        currentMonthEarnings: player.currentMonthEarnings || 0,
        currentMonthTasksCompleted: player.currentMonthTasksCompleted || 0,
        paidLeaves: player.paidLeaves || 0,
        currentDay: elapsed.days,
        currentMonth: elapsed.months,
        lastLoginDate: player.lastLoginDate,
        proficiency: {
          coding_skill: player.proficiency.coding_skill,
          soft_skill: player.proficiency.soft_skill,
          critical_thinking_skill: player.proficiency.critical_thinking_skill,
          problem_solving: player.proficiency.problem_solving,
          stress_resistance: player.proficiency.stress_resistance
        },
        careerHistory: player.careerHistory,
        currentRun: player.currentRun,
        reputation: player.reputation,
        skills: player.skills,
        activeBuffs: player.activeBuffs,
        permanentItems: player.permanentBuffs,
        activeQuests: activeQuests,
        completedQuests: completedQuests,
        inventory: inventory.map(item => ({
          itemId: item.item.id,
          item: item.item,
          quantity: item.quantity,
          purchasedAt: item.purchasedAt,
        })),
      };
      await updatePlayerData(backendData);
      console.log('✅ Game saved');
    } catch (error) {
      console.error('❌ Save failed:', error);
      localStorage.setItem(`office_game_${user.id}`, JSON.stringify({ player, activeQuests, completedQuests, inventory, activeBuffs, monthlyReports, notifications }));
    }
  };
  //load game from backend
  const loadGame = async () => {
    if (!user?.id) return;
    try {
      const backendData = await fetchPlayerData(user.username);
      const transformedPlayer: PlayerState = {
        id: backendData.githubinfo?.github_id,
        username: backendData.username,
        githubinfo: backendData.githubinfo,
        gameStartDate: backendData.gameStartDate,
        level: backendData.level,
        experience: backendData.experience,
        experienceToNextLevel: backendData.experienceToNextLevel,
        currency: Number(backendData.currency) || 0,
        mood: Number(backendData.mood) || 0,
        stress: Number(backendData.stress) || 0,
        isBurntOut: backendData.isBurntOut,
        baseSalary: Number(backendData.baseSalary) || 0,
        currentMonthEarnings: Number(backendData.currentMonthEarnings) || 0,
        currentMonthTasksCompleted: Number(backendData.currentMonthTasksCompleted) || 0,
        paidLeaves: Number(backendData.paidLeaves) || 0,
        currentDay: backendData.currentDay,
        currentMonth: backendData.currentMonth,
        lastLoginDate: backendData.lastLoginDate,
        proficiency: backendData.proficiency,
        careerHistory: backendData.careerHistory,
        currentRun: backendData.currentRun,
        reputation: backendData.reputation,
        skills: backendData.skills,
        activeBuffs: backendData.activeBuffs,
        permanentBuffs: backendData.permanentItems,
        activeQuests: [],
        completedQuests: [],
        inventory: [],
      };
      setPlayer(transformedPlayer);
      setActiveQuests(backendData.activeQuests);
      setCompletedQuests(backendData.completedQuests);

      const transformedInventory = backendData.inventory.map((item: any) => ({
        item: shopItems.find(si => si.id === item.itemId || si.id === item.item?.id) || item.item,
        quantity: item.quantity,
        purchasedAt: item.purchasedAt || Date.now(),
      }));
      setInventory(transformedInventory);

      const permanentBuffsList = (backendData.permanentItems || []).map((itemId: string) => {
        const shopItem = shopItems.find(si => si.id === itemId);
        return shopItem ? { itemId, name: shopItem.name, effect: shopItem.effect, appliedAt: Date.now() } : null;
      }).filter(Boolean);
      setActiveBuffs(permanentBuffsList);
    } catch (error) {
      console.error('❌ Load failed:', error);
    }
  };

  const dismissLevelUp = () => setShowLevelUp(false);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now().toString(), timestamp: Date.now(), isRead: false }]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => setNotifications([]);
  const getUnreadCount = () => notifications.filter(n => !n.isRead).length;

  return (
    <GameContext.Provider
      value={{
        player,
        activeQuests,
        completedQuests,
        inventory,
        activeBuffs,
        monthlyReports,
        notifications,
        showLevelUp,
        setPlayer,
        startQuest,
        completeQuest,
        failQuest,
        purchaseItem,
        takePaidLeave,
        updateMoodStress,
        addExperience,
        addCurrency,
        advanceDay,
        resetCareer,
        saveGame,
        loadGame,
        dismissLevelUp,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        getUnreadCount,
      }}
    >
      {children}

      {/* This is now rendered via Portal inside the component itself,
        but we pass the state from here. 
      */}
      <GameOverAlert
        isOpen={isGameOver}
        onRestart={resetCareer}
      />

    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}