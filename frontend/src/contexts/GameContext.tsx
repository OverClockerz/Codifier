import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  
  const createNewPlayer = useCallback((): PlayerState => ({
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
    reputation: 0,
    skills: {},
    permanentBuffs: [],
  }), [user]);

  const [player, setPlayer] = useState<PlayerState>(createNewPlayer);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const initializeQuests = useCallback(() => {
    const dailies = getRandomQuests('daily', 6);
    const weeklies = getRandomQuests('weekly', 4);
    const monthlies = getRandomQuests('monthly', 3);
    
    setActiveQuests(prev => {
      const inProgress = prev.filter(q => q.status === 'in-progress');
      return [...inProgress, ...dailies, ...weeklies, ...monthlies];
    });
  }, []);

  const saveGame = useCallback(() => {
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
  }, [user?.id, player, activeQuests, completedQuests, inventory, activeBuffs, monthlyReports, notifications]);

  const loadGame = useCallback(() => {
    if (!user?.id) return;

    const saved = localStorage.getItem(`office_game_${user.id}`);
    if (saved) {
      try {
        const gameState = JSON.parse(saved);
        setPlayer(gameState.player || createNewPlayer());
        setActiveQuests(gameState.activeQuests || []);
        setCompletedQuests(gameState.completedQuests || []);
        setInventory(gameState.inventory || []);
        setActiveBuffs(gameState.activeBuffs || []);
        setMonthlyReports(gameState.monthlyReports || []);
        setNotifications(gameState.notifications || []);
        
        if (!gameState.activeQuests || gameState.activeQuests.length === 0) {
          initializeQuests();
        }
      } catch (error) {
        console.error('Failed to load game, starting fresh:', error);
        initializeQuests();
      }
    } else {
      initializeQuests();
    }
    setIsLoaded(true);
  }, [user?.id, createNewPlayer, initializeQuests]);

  useEffect(() => {
    if (user?.id && !isLoaded) {
      loadGame();
    }
  }, [user, isLoaded, loadGame]);

  useEffect(() => {
    if (isLoaded) {
      saveGame();
    }
  }, [isLoaded, saveGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveBuffs(prev => prev.filter(buff => !buff.expiresAt || buff.expiresAt > now));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      activeQuests.forEach(quest => {
        if (quest.deadline && quest.status === 'in-progress' && now > quest.deadline) {
          failQuest(quest.id);
          addNotification({
            type: 'alert',
            title: 'Quest Failed - Deadline Missed',
            message: `Failed: "${quest.title}". Your reputation has been affected.`,
          });
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [activeQuests]);

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

    const multiplier = performanceScore / 100;
    const expGain = Math.floor(quest.expReward * multiplier);
    const currencyGain = Math.floor(quest.currencyReward * multiplier);

    addExperience(expGain);
    addCurrency(currencyGain);
    updateMoodStress(quest.moodImpact * multiplier, quest.stressImpact * multiplier);

    setPlayer(prev => ({ ...prev, currentMonthTasksCompleted: (prev.currentMonthTasksCompleted || 0) + 1 }));

    setActiveQuests(prev => prev.filter(q => q.id !== questId));
    setCompletedQuests(prev => [
      ...prev,
      { ...quest, status: 'completed', completedAt: Date.now() },
    ]);
  };

  const failQuest = (questId: string) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest) return;

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
    setInventory(prev => {
      const existing = prev.find(i => i.item.id === itemId);
      if (existing) {
        return prev.map(i => i.item.id === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1, purchasedAt: Date.now() }];
    });

    return true;
  };

  const useItem = (itemId: string) => {
    const inventoryItem = inventory.find(i => i.item.id === itemId);
    if (!inventoryItem) return;

    const { item, quantity } = inventoryItem;
    // ... (rest of useItem logic)
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
      return {
        ...prev,
        mood: newMood,
        stress: newStress,
        isBurntOut: newMood <= GAME_CONFIG.burnoutMoodThreshold,
      };
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

      if (newLevel > prev.level) {
        setShowLevelUp(true);
      }

      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        experienceToNextLevel: expToNext,
        baseSalary: getSalaryForLevel(newLevel),
      };
    });
  };

  const addCurrency = (amount: number) => {
    setPlayer(prev => ({ ...prev, currentMonthEarnings: prev.currentMonthEarnings + amount }));
  };

  const advanceDay = () => {
    setPlayer(prev => ({ ...prev, currentDay: prev.currentDay + 1 }));
  };

  const resetCareer = () => {
    setPlayer(createNewPlayer());
    setActiveQuests([]);
    setCompletedQuests([]);
    setInventory([]);
    setActiveBuffs([]);
  };

  const dismissLevelUp = () => setShowLevelUp(false);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification = { ...notification, id: Date.now().toString(), timestamp: Date.now(), isRead: false };
    setNotifications(prev => [newNotification, ...prev]);
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
