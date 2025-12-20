import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PlayerState, 
  Quest, 
  InventoryItem, 
  ActiveBuff, 
  MonthlyReport, 
  Notification, 
  ZoneType 
} from '../types/game';
import { 
  GAME_CONFIG, 
  getExperienceForLevel, 
  getSalaryForLevel,
  REPUTATION_WEIGHTS,
  getSalaryAdjustment,
  getRestartLevel
} from '../data/gameConfig';
import { useAuth } from './AuthContext';
import { 
  fetchPlayerState, 
  fetchQuestsByZone, 
  startQuestAPI, 
  completeQuestAPI, 
  purchaseItemAPI, 
  fetchShopItems 
} from '../services/api';

// Shared types/constants...
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'consumable' | 'permanent-buff';
  effect: any; // Simplified for brevity
  isPermanent: boolean;
}

interface GameContextType {
  player: PlayerState;
  activeQuests: Quest[];
  completedQuests: Quest[];
  inventory: InventoryItem[];
  activeBuffs: ActiveBuff[];
  monthlyReports: MonthlyReport[];
  notifications: Notification[];
  showLevelUp: boolean;
  isLoading: boolean;
  
  // Actions
  startQuest: (questId: string) => void;
  completeQuest: (questId: string, performanceScore: number) => void;
  failQuest: (questId: string) => void;
  purchaseItem: (itemId: string) => Promise<boolean>; // Updated to async
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
  refreshData: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const createNewPlayer = (): PlayerState => ({
    id: user?.id || '',
    username: user?.username || 'Guest',
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
    activeQuests: [],
    completedQuests: [],
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
  const [isLoading, setIsLoading] = useState(true);

  // --- DATA LOADING ---
  
  const refreshData = async () => {
    if (!user) return;
    
    try {
      // Fetch full player state from backend
      const playerData = await fetchPlayerState();
      
      setPlayer(playerData);
      
      // Update local state arrays from the player object if they exist
      if (playerData.activeQuests) setActiveQuests(playerData.activeQuests);
      if (playerData.completedQuests) setCompletedQuests(playerData.completedQuests);
      if (playerData.inventory) setInventory(playerData.inventory);
      
      // If we have no quests active, try fetching new ones from the API zones
      if (!playerData.activeQuests || playerData.activeQuests.length === 0) {
         initializeQuests();
      }

    } catch (err) {
      console.error("Failed to refresh game data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setIsLoading(false); // No user, stop loading
    }
  }, [user]);

  // --- ACTIONS ---

  const initializeQuests = async () => {
    // Fetch a mix of quests from different zones to populate the "Available Quests" list
    // In a real app, you might want to do this per-zone when the user visits
    const zones = ['workspace', 'meeting-room', 'game-lounge'];
    let allNewQuests: Quest[] = [];

    for (const zone of zones) {
        const quests = await fetchQuestsByZone(zone);
        allNewQuests = [...allNewQuests, ...quests];
    }
    
    // Only add quests that aren't already in progress or completed
    setActiveQuests(prev => {
        const currentIds = new Set(prev.map(q => q.id));
        const uniqueNew = allNewQuests.filter(q => !currentIds.has(q.id));
        return [...prev, ...uniqueNew];
    });
  };

  const startQuest = async (questId: string) => {
    try {
      // Optimistic update
      setActiveQuests(prev => prev.map(q => 
        q.id === questId ? { ...q, status: 'in-progress', startedAt: Date.now() } : q
      ));

      // Call Backend
      const updatedQuest = await startQuestAPI(questId);
      
      // Confirm update with server response
      setActiveQuests(prev => prev.map(q => 
        q.id === questId ? updatedQuest : q
      ));
      
    } catch (error) {
      console.error("Failed to start quest:", error);
      // Revert optimistic update if needed
    }
  };

  const completeQuest = async (questId: string, performanceScore: number = 100) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest) return;

    try {
        const result = await completeQuestAPI(questId, performanceScore);
        
        // Update Player Stats from Server Response
        // Note: The backend logic should handle the exact XP/Currency math.
        // We just re-fetch the player state to ensure sync.
        await refreshData(); 

        // Move quest to completed locally for immediate UI feedback (if refresh is slow)
        setActiveQuests(prev => prev.filter(q => q.id !== questId));
        setCompletedQuests(prev => [
          ...prev,
          { ...result.quest, status: 'completed', completedAt: Date.now() },
        ]);

    } catch (error) {
        console.error("Failed to complete quest:", error);
    }
  };

  const failQuest = (questId: string) => {
    // This is currently a frontend-only logic in your original code.
    // Ideally, you'd have a backend endpoint for failQuest too.
    // For now, we keep the local logic but you should eventually move this to API.
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest) return;

    updateMoodStress(-10, 15);

    setPlayer(prev => ({
      ...prev,
      reputation: prev.reputation - 2,
    }));

    setActiveQuests(prev => prev.filter(q => q.id !== questId));
    setCompletedQuests(prev => [
      ...prev,
      { ...quest, status: 'failed', completedAt: Date.now() },
    ]);
  };

  const purchaseItem = async (itemId: string): Promise<boolean> => {
    try {
        const result = await purchaseItemAPI(itemId);
        if (result.success) {
            await refreshData(); // Re-fetch inventory and balance
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed to purchase item", error);
        return false;
    }
  };

  const useItem = (itemId: string) => {
    // Similar to purchase, this logic is currently frontend heavy.
    // You should create a /api/shop/use endpoint in the backend.
    // For now, we keep the frontend logic to avoid breaking the UI.
    const inventoryItem = inventory.find(i => i.item.id === itemId);
    if (!inventoryItem) return;

    const { item } = inventoryItem;
    const { effect } = item;

    if (effect.stressReduction || effect.moodIncrease) {
      updateMoodStress(
        effect.moodIncrease || 0,
        -(effect.stressReduction || 0)
      );
    }

    // Logic to remove item locally...
    // Note: Since we are using mock backend, this local change 
    // won't persist if you refresh unless you add a backend endpoint for "consuming" items.
    setInventory(prev =>
      prev.map(i =>
          i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0)
    );
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
      return { ...prev, mood: newMood, stress: newStress, isBurntOut };
    });
  };

  const addExperience = (amount: number) => {
    // This is handled by backend on quest completion usually,
    // but kept here for frontend-only events.
    setPlayer(prev => ({ ...prev, experience: prev.experience + amount }));
  };

  const addCurrency = (amount: number) => {
     setPlayer(prev => ({ ...prev, currency: prev.currency + amount }));
  };

  const advanceDay = () => {
    setPlayer(prev => ({
        ...prev,
        currentDay: prev.currentDay + 1
    }));
  };

  const resetCareer = () => {
    // Implement backend reset endpoint if needed
    setPlayer(createNewPlayer());
    setActiveQuests([]);
    setCompletedQuests([]);
    setInventory([]);
  };

  const saveGame = () => {
    // Auto-save is handled by the backend state generally.
    // If you want manual saves, you'd POST the full state to an endpoint.
  };

  const loadGame = () => {
    refreshData();
  };

  const dismissLevelUp = () => setShowLevelUp(false);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    setNotifications(prev => [
      ...prev,
      { ...notification, id: Date.now().toString(), timestamp: Date.now(), isRead: false },
    ]);
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
        isLoading,
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
        refreshData
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