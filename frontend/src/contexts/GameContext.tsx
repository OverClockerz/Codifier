import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerState, Quest, InventoryItem, ActiveBuff, MonthlyReport, Notification, ShopItem, Buff} from '../types/game';
import { GAME_CONFIG, getExperienceForLevel, getSalaryForLevel } from '../data/gameConfig';
import { getRandomQuests } from '../data/quests';
import { useAuth } from './AuthContext';
import { fetchPlayerData, updatePlayerData } from '../services/api';
import { shopItems } from '../data/shopItems';

/**
 * GAME CONTEXT - MAIN GAME STATE MANAGEMENT
 * ==========================================
 * 
 * 🔗 BACKEND INTEGRATION - FULLY INTEGRATED
 * 
 * This file manages all game state and is NOW CONNECTED to the backend.
 * 
 * HOW IT WORKS:
 * 1. On mount → fetchPlayerData() loads initial game state from backend
 * 2. On changes → updatePlayerData() syncs state to backend
 * 3. Shop purchases → calculated in frontend, sent to backend via updatePlayerData()
 * 4. Quests → fetched from backend in activeQuests/completedQuests arrays
 * 
 * 📚 RELATED FILES:
 * - /services/api.ts - API service layer
 * - /services/databaseSchema.ts - Database schema definition
 * - /BACKEND_INTEGRATION.md - Complete integration guide
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
  completeQuest: (questId: string, performanceScore: number) => void;
  failQuest: (questId: string) => void;
  purchaseItem: (item: ShopItem) => boolean;
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
    // id: user?.id || '',
    username: user?.username || '',
    githubinfo: {
      github_id: user?.id || '',
      avatar_url: user?.avatar || '',
      github_email: user?.email || '',
    },
    gameStartDate: new Date().toISOString(),
    level: 1,
    experience: 0,
    experienceToNextLevel: getExperienceForLevel(1),
    currency: 2000000,
    mood: 100,
    stress: 0,
    isBurntOut: false,
    baseSalary: getSalaryForLevel(1),
    currentMonthEarnings: 0,
    paidLeaves: 5,
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
    activeBuffs: [], // No active buffs initially
    permanentBuffs: [], // No permanent buffs initially
    activeQuests: [], // IDs of active quests
    completedQuests: [], // IDs of completed quests
    inventory: []
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
            type: 'quest',
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
    const dailies = getRandomQuests('daily', 6);  
    const weeklies = getRandomQuests('weekly', 4);  
    const monthlies = getRandomQuests('monthly', 3);  
    
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

  const purchaseItem = (item: ShopItem): boolean => {
    if (!item || player.currency < item.price) {
      return false;
    }

    setPlayer(prev => ({ ...prev, currency: prev.currency - item.price }));

    // Add to inventory
    setInventory(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.item.id === item.id
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
        if ((prev.permanentBuffs || []).some(buff => buff.itemId === itemId)) return prev;
        return {
          ...prev,
          permanentBuffs: [
            ...(prev.permanentBuffs || []),
            {
              itemId: item.id,
              name: item.name,
              effect: item.effect,
              // expiresAt: undefined // Permanent buffs may not have expiry
            }
          ],
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

  const saveGame = async () => {
    if (!user?.id) return;
    
    try {
      // Transform frontend state to backend format
      const backendData = {
        username: player.username,
        level: player.level,
        experience: player.experience,
        experienceToNextLevel: player.experienceToNextLevel,
        currency: player.currency,
        mood: player.mood,
        stress: player.stress,
        isBurntOut: player.isBurntOut,
        baseSalary: player.baseSalary,
        currentMonthEarnings: player.currentMonthEarnings,
        currentMonthTasksCompleted: player.currentMonthTasksCompleted,
        paidLeaves: player.paidLeaves,
        currentDay: player.currentDay,
        currentMonth: player.currentMonth,
        lastLoginDate: new Date().toISOString(),
        careerHistory: player.careerHistory,
        currentRun: player.currentRun,
        reputation: player.reputation,
        skills: player.skills,
        permanentItems: player.permanentBuffs, // Frontend: permanentBuffs → Backend: permanentItems
        activeQuests: activeQuests,
        completedQuests: completedQuests,
        inventory: inventory.map(item => ({
          itemId: item.item.id,
          item: item.item,
          quantity: item.quantity,
          purchasedAt: item.purchasedAt,
        })),
      };

      console.log('💾 Saving game state to backend...');
      await updatePlayerData(backendData);
      console.log('✅ Game state saved successfully');
    } catch (error) {
      console.error('❌ Failed to save game to backend:', error);
      // Fallback to localStorage to prevent data loss
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
      console.log('⚠️ Saved to localStorage as fallback');
    }
  };

  const loadGame = async () => {
    if (!user?.id) return;

    try {
      console.log('📥 Fetching player data from backend...');
      const backendData = await fetchPlayerData(user.username);
      console.log('✅ Backend data received:', backendData);

      // Transform backend data to frontend PlayerState format
      const transformedPlayer: PlayerState = {
        // id: backendData.githubinfo?.github_id || user.id,
        username: backendData.username || user.username || '',
        githubinfo: {
          github_id: backendData.githubinfo?.github_id || user.id || '',
          avatar_url: backendData.githubinfo?.avatar_url || user.avatar || '',
          github_email: backendData.githubinfo?.github_email || user.email || '',
        },
        gameStartDate: backendData.gameStartDate || new Date().toISOString(),
        level: backendData.level || 1,
        experience: backendData.experience || 0,
        experienceToNextLevel: backendData.experienceToNextLevel || getExperienceForLevel(backendData.level || 1),
        currency: backendData.currency || 100,
        mood: backendData.mood || 70,
        stress: backendData.stress || 20,
        isBurntOut: backendData.isBurntOut || false,
        baseSalary: backendData.baseSalary || 0,
        currentMonthEarnings: backendData.currentMonthEarnings || 0,
        currentMonthTasksCompleted: backendData.currentMonthTasksCompleted || 0,
        paidLeaves: backendData.paidLeaves || 0,
        currentDay: backendData.currentDay || 1,
        currentMonth: backendData.currentMonth || 1,
        lastLoginDate: backendData.lastLoginDate || new Date().toISOString(),
        careerHistory: backendData.careerHistory || [],
        currentRun: backendData.currentRun || {
          runNumber: 1,
          startLevel: 1,
          maxLevelAchieved: 1,
          totalExperience: 0,
          monthsWorked: 0,
          reasonForEnd: 'active',
        },
        reputation: backendData.reputation || 0,
        skills: backendData.skills || {},
        activeBuffs: backendData.activeBuffs || [], // Will be set separately
        permanentBuffs: backendData.permanentBuffs || [],
        activeQuests: [], // Will be set separately
        completedQuests: [], // Will be set separately
        inventory: [], // Will be set separately
      };

      setPlayer(transformedPlayer);

      // Set quests from backend
      const backendActiveQuests: Quest[] = backendData.activeQuests || [];
      const backendCompletedQuests: Quest[] = backendData.completedQuests || [];
      
      setActiveQuests(backendActiveQuests);
      setCompletedQuests(backendCompletedQuests);

      // Transform inventory from backend
      const backendInventory = backendData.inventory || [];
      const transformedInventory: InventoryItem[] = backendInventory.map((item: any) => {
        // Find the matching shop item from our hardcoded list
        const shopItem = shopItems.find(si => si.id === item.itemId || si.id === item.item?.id);
        return {
          item: shopItem || item.item,
          quantity: item.quantity || 1,
          purchasedAt: item.purchasedAt || Date.now(),
        };
      });
      setInventory(transformedInventory);

      // Rebuild active buffs from permanent items
      const permanentBuffsList: ActiveBuff[] = (backendData.permanentItems || []).map((itemId: string) => {
        const shopItem = shopItems.find(si => si.id === itemId);
        if (!shopItem) return null;
        return {
          itemId,
          name: shopItem.name,
          effect: shopItem.effect,
          appliedAt: Date.now(),
        };
      }).filter(Boolean);
      
      setActiveBuffs(permanentBuffsList);
      
      console.log('✅ Game state loaded successfully from backend');
    } catch (error) {
      console.error('❌ Failed to load game from backend:', error);
      console.log('🆕 Initializing with default data...');
      
      // Fallback: create new player and initialize quests
      setPlayer(createNewPlayer());
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
        setPlayer,
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