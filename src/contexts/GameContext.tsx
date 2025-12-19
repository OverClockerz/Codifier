import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerState, Quest, InventoryItem, ActiveBuff, MonthlyReport, CareerRun, Notification } from '../types/game';
import { GAME_CONFIG, getExperienceForLevel, getSalaryForLevel } from '../data/gameConfig';
import { getRandomQuests } from '../data/quests';
import { useAuth } from './AuthContext';

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
  startQuest: (questId: string) => void;
  completeQuest: (questId: string, performanceScore: number) => void;
  failQuest: (questId: string) => void;
  purchaseItem: (itemId: string) => boolean;
  useItem: (itemId: string) => void;
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
  
  const createNewPlayer = (): PlayerState => ({
    id: user?.id || '',
    username: user?.username || '',
    level: GAME_CONFIG.startingLevel,
    experience: 0,
    experienceToNextLevel: getExperienceForLevel(1),
    currency: GAME_CONFIG.startingCurrency,
    mood: GAME_CONFIG.startingMood,
    stress: GAME_CONFIG.startingStress,
    isBurntOut: false,
    baseSalary: getSalaryForLevel(1),
    currentMonthEarnings: 0,
    paidLeaves: GAME_CONFIG.startingPaidLeaves,
    currentDay: 1,
    currentMonth: 1,
    lastLoginDate: new Date().toISOString(),
    careerHistory: [],
    currentRun: {
      runNumber: 1,
      startLevel: 1,
      maxLevelAchieved: 1,
      totalExperience: 0,
      monthsWorked: 0,
    },
  });

  const [player, setPlayer] = useState<PlayerState>(createNewPlayer);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Initialize quests on mount or day change
  useEffect(() => {
    if (activeQuests.length === 0) {
      initializeQuests();
      
      // Add welcome notifications on first load
      if (notifications.length === 0) {
        setNotifications([
          {
            id: Date.now().toString(),
            type: 'quest',
            title: 'New Quest Assigned',
            message: 'New quest from the Manager: Project Alpha database update. Check your Workspace for details.',
            timestamp: Date.now(),
            isRead: false,
          },
          {
            id: (Date.now() + 1).toString(),
            type: 'bonus',
            title: 'Performance Bonus',
            message: 'Great work! You received a 10% reputation bonus for completing tasks ahead of schedule.',
            timestamp: Date.now() + 1,
            isRead: false,
          },
          {
            id: (Date.now() + 2).toString(),
            type: 'salary',
            title: 'Monthly Salary Disbursed',
            message: 'Your salary of $8,000 has been credited to your account.',
            timestamp: Date.now() + 2,
            isRead: false,
          },
        ]);
      }
    }
  }, [player.currentDay]);

  // Save game on changes
  useEffect(() => {
    if (user?.id) {
      saveGame();
    }
  }, [player, activeQuests, completedQuests, inventory]);

  // Load game on mount
  useEffect(() => {
    if (user?.id) {
      loadGame();
    }
  }, [user?.id]);

  // Check for expired buffs
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveBuffs(prev => prev.filter(buff => !buff.expiresAt || buff.expiresAt > now));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const initializeQuests = () => {
    const dailies = getRandomQuests('daily', 3);
    const weeklies = player.currentDay % 7 === 1 ? getRandomQuests('weekly', 2) : [];
    const monthlies = player.currentDay === 1 ? getRandomQuests('monthly', 1) : [];
    
    setActiveQuests(prev => {
      // Keep existing in-progress quests
      const inProgress = prev.filter(q => q.status === 'in-progress');
      return [...inProgress, ...dailies, ...weeklies, ...monthlies];
    });
  };

  const startQuest = (questId: string) => {
    setActiveQuests(prev =>
      prev.map(q =>
        q.id === questId
          ? { ...q, status: 'in-progress' as const, startedAt: Date.now() }
          : q
      )
    );
  };

  const completeQuest = (questId: string, performanceScore: number = 100) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest) return;

    // Apply performance multiplier
    const multiplier = performanceScore / 100;
    const expGain = Math.floor(quest.expReward * multiplier);
    const currencyGain = Math.floor(quest.currencyReward * multiplier);

    // Apply buffs
    let finalExp = expGain;
    let finalCurrency = currencyGain;
    
    activeBuffs.forEach(buff => {
      if (buff.effect.expBoost) {
        finalExp += Math.floor(expGain * (buff.effect.expBoost / 100));
      }
      if (buff.effect.currencyBoost) {
        finalCurrency += Math.floor(currencyGain * (buff.effect.currencyBoost / 100));
      }
    });

    addExperience(finalExp);
    addCurrency(finalCurrency);

    // Apply mood/stress changes
    let stressChange = quest.stressImpact;
    let moodChange = quest.moodImpact;

    // Apply stress reduction buffs
    activeBuffs.forEach(buff => {
      if (buff.effect.stressReduction) {
        stressChange -= Math.floor(quest.stressImpact * (buff.effect.stressReduction / 100));
      }
      if (buff.effect.moodIncrease) {
        moodChange += Math.floor(Math.abs(quest.moodImpact) * (buff.effect.moodIncrease / 100));
      }
    });

    updateMoodStress(moodChange, stressChange);

    // Move quest to completed
    setActiveQuests(prev => prev.filter(q => q.id !== questId));
    setCompletedQuests(prev => [
      ...prev,
      { ...quest, status: 'completed', completedAt: Date.now() },
    ]);
  };

  const failQuest = (questId: string) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest) return;

    // Penalty for failing
    updateMoodStress(-10, 15);

    setActiveQuests(prev => prev.filter(q => q.id !== questId));
    setCompletedQuests(prev => [
      ...prev,
      { ...quest, status: 'failed', completedAt: Date.now() },
    ]);
  };

  const purchaseItem = (itemId: string): boolean => {
    const { SHOP_ITEMS } = require('../data/shopItems');
    const item = SHOP_ITEMS.find((i: any) => i.id === itemId);
    
    if (!item || player.currency < item.price) {
      return false;
    }

    setPlayer(prev => ({ ...prev, currency: prev.currency - item.price }));

    // Add to inventory
    setInventory(prev => {
      const existing = prev.find(i => i.item.id === itemId);
      if (existing) {
        return prev.map(i =>
          i.item.id === itemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { item, quantity: 1, purchasedAt: Date.now() }];
    });

    return true;
  };

  const useItem = (itemId: string) => {
    const inventoryItem = inventory.find(i => i.item.id === itemId);
    if (!inventoryItem) return;

    const { item } = inventoryItem;
    const { effect } = item;

    // Apply immediate effects
    if (effect.stressReduction || effect.moodIncrease) {
      updateMoodStress(
        effect.moodIncrease || 0,
        -(effect.stressReduction || 0)
      );
    }

    if (effect.paidLeaves) {
      setPlayer(prev => ({
        ...prev,
        paidLeaves: prev.paidLeaves + effect.paidLeaves!,
      }));
    }

    // Apply temporary buffs
    if (effect.expBoost || effect.currencyBoost) {
      const expiresAt = effect.duration
        ? Date.now() + effect.duration * 60 * 1000
        : undefined;
      
      setActiveBuffs(prev => [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          effect,
          appliedAt: Date.now(),
          expiresAt,
        },
      ]);
    }

    // Remove from inventory if consumable
    if (item.type === 'consumable') {
      setInventory(prev =>
        prev
          .map(i =>
            i.item.id === itemId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter(i => i.quantity > 0)
      );
    } else {
      // Permanent buff - add to activeBuffs permanently
      setActiveBuffs(prev => {
        // Don't add if already active
        if (prev.some(b => b.itemId === itemId)) return prev;
        return [
          ...prev,
          {
            itemId: item.id,
            name: item.name,
            effect,
            appliedAt: Date.now(),
          },
        ];
      });
    }
  };

  const takePaidLeave = (): boolean => {
    if (player.paidLeaves <= 0) return false;

    setPlayer(prev => ({
      ...prev,
      paidLeaves: prev.paidLeaves - 1,
      mood: Math.min(100, prev.mood + 30),
      stress: Math.max(0, prev.stress - 40),
    }));

    return true;
  };

  const updateMoodStress = (moodChange: number, stressChange: number) => {
    setPlayer(prev => {
      const newMood = Math.max(0, Math.min(100, prev.mood + moodChange));
      const newStress = Math.max(0, Math.min(100, prev.stress + stressChange));
      const isBurntOut = newMood <= GAME_CONFIG.burnoutMoodThreshold;

      return {
        ...prev,
        mood: newMood,
        stress: newStress,
        isBurntOut,
      };
    });
  };

  const addExperience = (amount: number) => {
    setPlayer(prev => {
      let newExp = prev.experience + amount;
      let newLevel = prev.level;
      let expToNext = prev.experienceToNextLevel;

      // Level up logic
      while (newExp >= expToNext) {
        newExp -= expToNext;
        newLevel++;
        expToNext = getExperienceForLevel(newLevel);
      }

      const newBaseSalary = getSalaryForLevel(newLevel);

      if (newLevel > prev.level) {
        setShowLevelUp(true);
      }

      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        experienceToNextLevel: expToNext,
        baseSalary: newBaseSalary,
        currentRun: {
          ...prev.currentRun,
          maxLevelAchieved: Math.max(newLevel, prev.currentRun.maxLevelAchieved),
          totalExperience: prev.currentRun.totalExperience + amount,
        },
      };
    });
  };

  const addCurrency = (amount: number) => {
    setPlayer(prev => ({
      ...prev,
      currentMonthEarnings: prev.currentMonthEarnings + amount,
    }));
  };

  const advanceDay = () => {
    setPlayer(prev => {
      const newDay = prev.currentDay + 1;
      const newMonth = Math.floor((newDay - 1) / GAME_CONFIG.daysPerMonth) + 1;
      
      // Month transition
      if (newDay % GAME_CONFIG.daysPerMonth === 1 && newDay > 1) {
        // Process monthly report
        processMonthlyReport(prev);
      }

      return {
        ...prev,
        currentDay: newDay,
        currentMonth: newMonth,
      };
    });
  };

  const processMonthlyReport = (currentPlayer: PlayerState) => {
    // Calculate scores based on last month's performance
    const lastMonthQuests = completedQuests.filter(
      q => q.completedAt && q.completedAt > Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    const completedCount = lastMonthQuests.filter(q => q.status === 'completed').length;
    const totalCount = lastMonthQuests.length;
    const taskCompletionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // Simplified scoring
    const codeQualityScore = 75 + Math.random() * 25;
    const softSkillScore = 70 + Math.random() * 30;

    const { REPUTATION_WEIGHTS, getSalaryAdjustment } = require('../data/gameConfig');
    const reputationScore =
      taskCompletionRate * REPUTATION_WEIGHTS.taskCompletion +
      codeQualityScore * REPUTATION_WEIGHTS.codeQuality +
      softSkillScore * REPUTATION_WEIGHTS.softSkills;

    const salaryAdjustment = getSalaryAdjustment(reputationScore);
    const adjustedSalary = currentPlayer.baseSalary * (1 + salaryAdjustment / 100);
    const totalEarnings = currentPlayer.currentMonthEarnings + adjustedSalary;

    const report: MonthlyReport = {
      month: currentPlayer.currentMonth,
      taskCompletionRate,
      codeQualityScore,
      softSkillScore,
      reputationScore,
      salaryAdjustment,
      totalEarnings,
      warnings: reputationScore < 50 ? ['Performance below expectations'] : [],
    };

    setMonthlyReports(prev => [...prev, report]);

    // Add salary to currency
    setPlayer(prev => ({
      ...prev,
      currency: prev.currency + totalEarnings,
      currentMonthEarnings: 0,
    }));
  };

  const resetCareer = () => {
    const { getRestartLevel } = require('../data/gameConfig');
    const totalExp = player.currentRun.totalExperience;
    const newStartLevel = getRestartLevel(totalExp);

    setPlayer(prev => ({
      ...createNewPlayer(),
      level: newStartLevel,
      baseSalary: getSalaryForLevel(newStartLevel),
      careerHistory: [
        ...prev.careerHistory,
        { ...prev.currentRun, reasonForEnd: 'fired', endDate: new Date().toISOString() },
      ],
      currentRun: {
        runNumber: prev.currentRun.runNumber + 1,
        startLevel: newStartLevel,
        maxLevelAchieved: newStartLevel,
        totalExperience: 0,
        monthsWorked: 0,
      },
    }));

    setActiveQuests([]);
    setCompletedQuests([]);
    setInventory([]);
    setActiveBuffs([]);
  };

  const saveGame = () => {
    if (!user?.id) return;
    
    const gameState = {
      player,
      activeQuests,
      completedQuests,
      inventory,
      activeBuffs,
      monthlyReports,
      notifications,
    };

    localStorage.setItem(`office_game_${user.id}`, JSON.stringify(gameState));
  };

  const loadGame = () => {
    if (!user?.id) return;

    const saved = localStorage.getItem(`office_game_${user.id}`);
    if (saved) {
      try {
        const gameState = JSON.parse(saved);
        setPlayer(gameState.player);
        setActiveQuests(gameState.activeQuests || []);
        setCompletedQuests(gameState.completedQuests || []);
        setInventory(gameState.inventory || []);
        setActiveBuffs(gameState.activeBuffs || []);
        setMonthlyReports(gameState.monthlyReports || []);
        setNotifications(gameState.notifications || []);
      } catch (error) {
        console.error('Failed to load game:', error);
      }
    }
  };

  const dismissLevelUp = () => {
    setShowLevelUp(false);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    setNotifications(prev => [
      ...prev,
      {
        ...notification,
        id: Date.now().toString(),
        timestamp: Date.now(),
        isRead: false,
      },
    ]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, isRead: true }
          : n
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

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
        startQuest,
        completeQuest,
        failQuest,
        purchaseItem,
        useItem,
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