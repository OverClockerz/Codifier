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
    reputation: 0, // Start at +0%
    skills: {}, // Empty skills object
    permanentBuffs: [], // No permanent buffs initially
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
    // Only initialize if no quests exist and user is logged in
    if (activeQuests.length === 0 && user?.id) {
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
  }, [activeQuests.length, user?.id]);

  // Load game on mount FIRST
  useEffect(() => {
    if (user?.id) {
      loadGame();
    }
  }, [user?.id]);

  // Save game on changes
  useEffect(() => {
    if (user?.id && activeQuests.length > 0) {
      saveGame();
    }
  }, [player, activeQuests, completedQuests, inventory]);

  // Check for expired buffs
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveBuffs(prev => prev.filter(buff => !buff.expiresAt || buff.expiresAt > now));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Check for expired quest deadlines
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      activeQuests.forEach(quest => {
        if (quest.deadline && quest.status === 'in-progress' && now > quest.deadline) {
          // Auto-fail quest that missed deadline
          failQuest(quest.id);
          
          // Add notification
          addNotification({
            type: 'alert',
            title: 'Quest Failed - Deadline Missed',
            message: `Failed: "${quest.title}". Your reputation has been affected. Complete tasks on time to maintain good standing.`,
          });
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [activeQuests]);

  const initializeQuests = () => {
    // Generate a good mix of quests for all zones
    const dailies = getRandomQuests('daily', 6);  // Increased from 3 to 6
    const weeklies = getRandomQuests('weekly', 4);  // Increased from 2 to 4
    const monthlies = getRandomQuests('monthly', 3);  // Increased from 1 to 3
    
    setActiveQuests(prev => {
      // Keep existing in-progress quests
      const inProgress = prev.filter(q => q.status === 'in-progress');
      const allQuests = [...inProgress, ...dailies, ...weeklies, ...monthlies];
      return allQuests;
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

    // Apply mood/stress changes based on zone and performance
    let stressChange = 0;
    let moodChange = 0;

    if (quest.zone === 'workspace') {
      // Workspace: reduce mood, increase stress (scaled by performance)
      stressChange = Math.floor(quest.stressImpact * multiplier);
      moodChange = Math.floor(quest.moodImpact * multiplier);
    } else if (quest.zone === 'game-lounge') {
      // Game Lounge: increase mood, reduce stress (scaled by performance)
      moodChange = Math.floor(Math.abs(quest.moodImpact) * multiplier);
      stressChange = -Math.floor(Math.abs(quest.stressImpact) * multiplier);
    } else if (quest.zone === 'meeting-room') {
      // Meeting Room: varies based on performance
      // Good performance (>70): increase mood, reduce stress
      // Poor performance (<70): decrease mood, increase stress
      if (performanceScore >= 70) {
        moodChange = Math.floor(Math.abs(quest.moodImpact) * multiplier);
        stressChange = -Math.floor(quest.stressImpact * (multiplier * 0.5));
      } else {
        moodChange = Math.floor(quest.moodImpact * multiplier);
        stressChange = Math.floor(quest.stressImpact * multiplier);
      }
    }

    // Apply stress reduction buffs
    activeBuffs.forEach(buff => {
      if (buff.effect.stressReduction) {
        stressChange -= Math.floor(Math.abs(stressChange) * (buff.effect.stressReduction / 100));
      }
      if (buff.effect.moodIncrease) {
        moodChange += Math.floor(10 * (buff.effect.moodIncrease / 100));
      }
    });

    updateMoodStress(moodChange, stressChange);

    // Calculate reputation gain/loss based on difficulty and performance
    let reputationChange = 0;
    
    // Poor performance (< 50%): lose reputation
    if (performanceScore < 50) {
      if (quest.difficulty <= 2) reputationChange = -0.5; // Easy task failed
      else if (quest.difficulty <= 3) reputationChange = -1.5; // Medium task failed
      else reputationChange = -3; // Hard task failed
    }
    // Average performance (50-70%): minimal gain
    else if (performanceScore < 70) {
      if (quest.difficulty <= 2) reputationChange = 0.005 * multiplier;
      else if (quest.difficulty <= 3) reputationChange = 0.02 * multiplier;
      else reputationChange = 0.1 * multiplier;
    }
    // Good performance (70%+): normal gain
    else {
      if (quest.difficulty <= 2) reputationChange = 0.01 * multiplier; // Easy
      else if (quest.difficulty <= 3) reputationChange = 0.05 * multiplier; // Medium
      else reputationChange = 0.2 * multiplier; // Hard
    }

    // Add skills gained
    const skillsGained: Record<string, number> = {};
    if (quest.skills) {
      quest.skills.forEach(skill => {
        const skillGain = Math.floor(5 * (performanceScore / 100));
        skillsGained[skill] = skillGain;
      });
    }

    // Increment completed quests counter and update reputation/skills
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

    // Calculate reputation loss based on deadline miss and difficulty
    let reputationLoss = 0;
    if (quest.deadline && Date.now() > quest.deadline) {
      // Missed deadline - apply reputation penalty
      if (quest.difficulty <= 2) reputationLoss = -2; // Easy: -2%
      else if (quest.difficulty <= 3) reputationLoss = -1.5; // Medium: -1.5%
      else reputationLoss = -0.5; // Hard: -0.5%
    }

    setPlayer(prev => ({
      ...prev,
      reputation: prev.reputation + reputationLoss,
    }));

    // Check for firing (reputation below -20%)
    setPlayer(prev => {
      if (prev.reputation < -20) {
        // Player gets fired - trigger game over
        setTimeout(() => {
          alert('You have been fired due to poor reputation! Starting a new career...');
          resetCareer();
        }, 100);
      }
      return prev;
    });

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
    } else if (item.type === 'permanent-buff') {
      // Permanent buff - add to player's permanent buffs and active buffs
      setPlayer(prev => {
        // Don't add if already owned
        if ((prev.permanentBuffs || []).includes(itemId)) return prev;
        return {
          ...prev,
          permanentBuffs: [...(prev.permanentBuffs || []), itemId],
        };
      });

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
      
      // Remove from inventory after use
      setInventory(prev =>
        prev
          .map(i =>
            i.item.id === itemId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter(i => i.quantity > 0)
      );
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
        console.log('📥 Loading saved game:', gameState);
        setPlayer(gameState.player);
        setActiveQuests(gameState.activeQuests || []);
        setCompletedQuests(gameState.completedQuests || []);
        setInventory(gameState.inventory || []);
        setActiveBuffs(gameState.activeBuffs || []);
        setMonthlyReports(gameState.monthlyReports || []);
        setNotifications(gameState.notifications || []);
        
        // If no quests were saved, initialize them
        if (!gameState.activeQuests || gameState.activeQuests.length === 0) {
          console.log('📭 No saved quests, initializing...');
          setTimeout(() => initializeQuests(), 100); // Delay to ensure state is set
        }
      } catch (error) {
        console.error('Failed to load game:', error);
        // If load fails, initialize fresh quests
        setTimeout(() => initializeQuests(), 100);
      }
    } else {
      // No saved game, initialize fresh quests
      console.log('🆕 No saved game found, initializing quests...');
      setTimeout(() => initializeQuests(), 100);
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