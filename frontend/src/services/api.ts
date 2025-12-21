import { Quest, ShopItem, PlayerState } from '../types/game';
import axios from 'axios';

// Ensure this matches your Flask backend URL and port
const API_BASE_URL = 'http://localhost:5000/api';

// Create an axios instance that automatically handles cookies (sessions)
// This is critical for the Flask session to work with the mock DB
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// QUEST ENDPOINTS
// ============================================================

export const fetchQuestsByZone = async (username:string,zone: string): Promise<Quest[]> => {
  try {
    const response = await apiClient.get<Quest[]>(`/quests/get?username=${username}&zone=${zone}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quests:", error);
    return [];
  }
};

export const startQuestAPI = async (questId: string): Promise<Quest> => {
  try {
    const response = await apiClient.post<Quest>(`/quests/${questId}/start`);
    return response.data;
  } catch (error) {
    console.error("Error starting quest:", error);
    throw error;
  }
};

export const completeQuestAPI = async (
  questId: string, 
  performanceScore: number
): Promise<{ quest: Quest; rewards: { exp: number; currency: number } }> => {
  try {
    const response = await apiClient.post(`/quests/${questId}/complete`, {
      performanceScore
    });
    return response.data;
  } catch (error) {
    console.error("Error completing quest:", error);
    throw error;
  }
};

// ============================================================
// SHOP ENDPOINTS
// ============================================================

export const fetchShopItems = async (): Promise<ShopItem[]> => {
  try {
    const response = await apiClient.get<ShopItem[]>('/shop/items');
    return response.data;
  } catch (error) {
    console.error("Error fetching shop items:", error);
    return [];
  }
};

export const purchaseItemAPI = async (
  itemId: string
): Promise<{ success: boolean; newBalance: number }> => {
  try {
    const response = await apiClient.post('/shop/purchase', { itemId });
    return response.data;
  } catch (error) {
    console.error("Error purchasing item:", error);
    throw error;
  }
};

// ============================================================
// PLAYER ENDPOINTS
// ============================================================

export const fetchPlayerState = async (): Promise<PlayerState> => {
  try {
    const response = await apiClient.get<PlayerState>('/player');
    return response.data;
  } catch (error) {
    console.error("Error fetching player state:", error);
    throw error;
  }
};

export const updatePlayerState = async (
  updates: Partial<PlayerState>
): Promise<PlayerState> => {
  try {
    const response = await apiClient.patch<PlayerState>('/player', updates);
    return response.data;
  } catch (error) {
    console.error("Error updating player state:", error);
    throw error;
  }
};

// ============================================================
// DYNAMIC QUEST GENERATION (Mock for now)
// ============================================================

export const generateDynamicQuests = async (params: {
  zone: string;
  difficulty: number;
  count: number;
}): Promise<Quest[]> => {
  // Return empty array for now as backend AI implementation requires more setup
  console.log("Generating dynamic quests for:", params);
  return [];
};