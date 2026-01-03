import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
// REMOVED: import { useNavigate } from 'react-router-dom'; 
import { PlayerState, Quest, InventoryItem, ActiveBuff, MonthlyReport, Notification } from '../types/game';
import { getExperienceForLevel, getSalaryForLevel, GAME_CONSTANTS, getRestartLevel, getSalaryAdjustment } from '../data/gameConfig';
import { useAuth } from './AuthContext';
import { fetchPlayerData, updatePlayerData } from '../services/api';
import { shopItems } from '../data/shopItems';
import AlertComponent from '../components/extras/AlertComponent';
import { gameTimeSince } from '../utils/calculations';

/**
 * GAME CONTEXT - MAIN GAME STATE MANAGEMENT
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

  // --- Navigation State ---
  currentView: string;
  setCurrentView: (view: string) => void;

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
  const isLoadingRef = useRef(false);

  // --- View State ---
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Default Game State
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
  const [isGameOver, setIsGameOver] = useState(false);

  // Cleaned up Stress Alert State
  // We only need to know if we have ALREADY alerted for the current high stress event.
  const [hasAlertedForCurrentStress, setHasAlertedForCurrentStress] = useState(false);

  // Load game on mount
  useEffect(() => {
    if (user?.id && user?.username) {
      isLoadingRef.current = true;
      loadGame().finally(() => {
        isLoadingRef.current = false;
      });
    }
  }, [user?.id, user?.username]);

  // Safe Auto-Save
  useEffect(() => {
    if (user?.id && player.id && player.proficiency && activeQuests.length >= 0) {
      saveGame();
    }
  }, [player, activeQuests, completedQuests, inventory]);

  // Game Over Watcher
  useEffect(() => {
    if (player.reputation <= -20) {
      if (!isGameOver) {
        setIsGameOver(true);
      }
    }
  }, [player.reputation, isGameOver]);

  // ==========================================
  // STRESS RESET LOGIC (Simplified)
  // ==========================================
  // Only resets the flag when stress drops. The 'opening' logic is now in the JSX.
  useEffect(() => {
    if (player.stress < 100 && hasAlertedForCurrentStress) {
      setHasAlertedForCurrentStress(false);
    }
  }, [player.stress, hasAlertedForCurrentStress]);

  // Game loop
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(() => {
      if (!isLoadingRef.current) {
        isLoadingRef.current = true;
        loadGame().finally(() => {
          isLoadingRef.current = false;
        });
      }
    }, 5001);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Persist currency
  useEffect(() => {
    if (!user?.id) return;
    const key = `office_game_currency_${user.id}`;
    const saveCurrencyToLocal = () => {
      try {
        const val = Number(player.currency);
        if (isFinite(val)) localStorage.setItem(key, String(val));
      } catch (e) { }
    };
    window.addEventListener('beforeunload', saveCurrencyToLocal);
    return () => window.removeEventListener('beforeunload', saveCurrencyToLocal);
  }, [user?.id, player.currency]);

  // Check for expired quests / burnout
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
            title: 'Quest Failed',
            message: `Deadline Missed for "${quest.title}".`,
          });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuests]);

  // ===========================
  // GAME LOGIC FUNCTIONS
  // ===========================
  const updateMoodStress = (moodChange: number, stressChange: number) => {
    setPlayer(prev => ({
      ...prev,
      mood: Math.max(0, Math.min(100, prev.mood + moodChange)),
      stress: Math.max(0, Math.min(100, prev.stress + stressChange))
    }));
  };

  // ... [Include other functions: startQuest, completeQuest, failQuest, purchaseItem, takePaidLeave, etc.] ...

  const startQuest = (questId: string) => {
    setActiveQuests(prev =>
      prev.map(q => q.id === questId ? { ...q, status: 'in-progress', startedAt: Math.floor(Date.now() / 1000) } : q)
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

    // Reputation Logic
    let reputationChange = 0;
    if (performanceScore < 50) reputationChange = -3;
    else if (performanceScore < 70) reputationChange = 0.1 * multiplier;
    else reputationChange = 0.2 * multiplier;

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
    updateMoodStress(quest.moodImpact, quest.stressImpact);

    let reputationLoss = -0.5;
    if (quest.deadline && Date.now() > quest.deadline) reputationLoss = -2;

    setPlayer(prev => ({ ...prev, reputation: prev.reputation + reputationLoss }));

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
      return existing
        ? prev.map(i => i.item.id === itemId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { item, quantity: 1, purchasedAt: Date.now() }];
    });
    return true;
  };

  const takePaidLeave = (): boolean => {
    if (player.paidLeaves <= 0) return false;
    setPlayer(prev => ({
      ...prev,
      paidLeaves: prev.paidLeaves - 1,
      mood: Math.min(100, prev.mood + 30),
      stress: Math.max(0, prev.stress - 40)
    }));
    return true;
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
        currentRun: {
          ...prev.currentRun,
          maxLevelAchieved: Math.max(newLevel, prev.currentRun.maxLevelAchieved),
          totalExperience: prev.currentRun.totalExperience + amount
        },
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

    // Simple logic for report
    const reputationScore = taskCompletionRate * 0.4 + 75 * 0.35 + 75 * 0.25;
    const salaryAdjustment = getSalaryAdjustment(reputationScore);
    const totalEarnings = currentPlayer.currentMonthEarnings + (currentPlayer.baseSalary * (1 + salaryAdjustment / 100));

    setMonthlyReports(prev => [...prev, {
      month: currentPlayer.currentMonth,
      taskCompletionRate,
      codeQualityScore: 75,
      softSkillScore: 75,
      reputationScore,
      salaryAdjustment,
      totalEarnings,
      warnings: reputationScore < 50 ? ['Performance below expectations'] : [],
    }]);

    setPlayer(prev => ({ ...prev, currency: prev.currency + totalEarnings, currentMonthEarnings: 0 }));
  };

  const resetCareer = async () => {
    console.log("🔄 Reset Career Initiated");
    try {
      const totalExp = player.currentRun?.totalExperience || 0;
      const newStartLevel = getRestartLevel(totalExp);

      const freshPlayer: PlayerState = {
        id: player.id,
        username: player.username,
        githubinfo: player.githubinfo,
        gameStartDate: new Date().toISOString(),
        level: newStartLevel,
        experience: 0,
        experienceToNextLevel: getExperienceForLevel(newStartLevel),
        currency: player.currency,
        mood: 70,
        stress: 20,
        isBurntOut: false,
        baseSalary: getSalaryForLevel(newStartLevel),
        currentMonthEarnings: 0,
        currentMonthTasksCompleted: 0,
        paidLeaves: 0,
        currentDay: 1,
        currentMonth: 1,
        lastLoginDate: new Date(),
        proficiency: player.proficiency,
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
        skills: player.skills,
        activeBuffs: {},
        permanentBuffs: player.permanentBuffs,
        activeQuests: player.activeQuests || [],
        completedQuests: [],
        inventory: [],
      };

      setActiveQuests([]);
      setCompletedQuests([]);
      setInventory([]);
      setActiveBuffs([]);
      setNotifications([]);
      setMonthlyReports([]);
      setHasAlertedForCurrentStress(false);
      setCurrentView('dashboard');

      if (user?.id) {
        const resetPayload = {
          username: freshPlayer.username,
          level: freshPlayer.level,
          experience: 0,
          experienceToNextLevel: freshPlayer.experienceToNextLevel,
          currency: freshPlayer.currency,
          mood: freshPlayer.mood,
          stress: freshPlayer.stress,
          isBurntOut: false,
          baseSalary: freshPlayer.baseSalary,
          currentMonthEarnings: 0,
          currentMonthTasksCompleted: 0,
          paidLeaves: 0,
          currentDay: 1,
          currentMonth: 1,
          lastLoginDate: new Date(),
          proficiency: freshPlayer.proficiency,
          careerHistory: freshPlayer.careerHistory,
          currentRun: freshPlayer.currentRun,
          reputation: 0,
          skills: {},
          activeBuffs: {},
          permanentItems: [],
          activeQuests: [],
          completedQuests: [],
          inventory: [],
        };
        await updatePlayerData(resetPayload);
      }

      setPlayer(freshPlayer);
      setIsGameOver(false);
      setHasAlertedForCurrentStress(false);
      console.log("✅ Career Reset Successful");

      // 4. Then sync with backend
      if (user?.username) {
        console.log("🔄 Reloading game data from backend...");
        await loadGame();
      }
    } catch (error) {
      console.error("❌ Error resetting career:", error);
      setIsGameOver(false);
    }
  };

  const elapsed = gameTimeSince(player);

  const saveGame = async () => {
    if (!user?.id) return;
    if (!player || !player.proficiency) {
      console.warn("⚠️ Save skipped: Player proficiency data missing.");
      return;
    }
    try {
      const backendData = {
        username: player.username,
        level: player.level,
        experience: player.experience,
        experienceToNextLevel: player.experienceToNextLevel,
        currency: player.currency ?? Number(localStorage.getItem(`office_game_currency_${user.id}`)),
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
        proficiency: player.proficiency,
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

  const loadGame = async () => {
    if (!user?.id) return;
    try {
      const backendData = await fetchPlayerData(user.username);
      localStorage.setItem(`office_game_currency_${user.id}`, String(backendData.currency));
      const safeProficiency = backendData.proficiency || {
        coding_skill: 0, soft_skill: 0, critical_thinking_skill: 0, problem_solving: 0, stress_resistance: 0
      };

      const transformedPlayer: PlayerState = {
        id: backendData.githubinfo?.github_id,
        username: backendData.username,
        githubinfo: backendData.githubinfo,
        gameStartDate: backendData.gameStartDate,
        level: backendData.level,
        experience: backendData.experience,
        experienceToNextLevel: backendData.experienceToNextLevel,
        currency: backendData.currency ?? Number(localStorage.getItem(`office_game_currency_${user.id}`)),
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
        proficiency: safeProficiency,
        careerHistory: backendData.careerHistory,
        currentRun: backendData.currentRun,
        reputation: backendData.reputation,
        skills: backendData.skills,
        activeBuffs: backendData.activeBuffs,
        permanentBuffs: backendData.permanentItems,
        activeQuests: backendData.activeQuests,
        completedQuests: backendData.completedQuests,
        inventory: backendData.inventory,
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
  const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => setNotifications(prev => [...prev, { ...n, id: Date.now().toString(), timestamp: Date.now(), isRead: false }]);
  const markNotificationAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const clearAllNotifications = () => setNotifications([]);
  const getUnreadCount = () => notifications.filter(n => !n.isRead).length;

  return (
    <GameContext.Provider
      value={{
        player, activeQuests, completedQuests, inventory, activeBuffs, monthlyReports, notifications, showLevelUp,
        currentView, setCurrentView,
        setPlayer, startQuest, completeQuest, failQuest, purchaseItem, takePaidLeave, updateMoodStress, addExperience, addCurrency, advanceDay, resetCareer, saveGame, loadGame, dismissLevelUp, addNotification, markNotificationAsRead, clearAllNotifications, getUnreadCount,
      }}
    >
      {children}

      {/* 1. Game Over Alert */}
      {isGameOver && (
        <AlertComponent
          onRestart={resetCareer}
        />
      )}

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