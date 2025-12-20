// ============================================================
// API SERVICE - BACKEND INTEGRATION LAYER
// ============================================================
// This file provides a clean interface for all backend API calls
// Currently uses mock data, but can be easily swapped with real API calls
// 
// USAGE:
// Import functions from this file instead of directly using context:
// import { fetchQuests, startQuest } from '../services/api';
// 
// MIGRATION PATH:
// 1. Implement each function with real API endpoints
// 2. Add error handling and loading states
// 3. Replace context calls with these API functions
// 4. Add authentication tokens to requests
// ============================================================

import { Quest, ShopItem, PlayerState } from '../types/game';

// ============================================================
// API CONFIGURATION
// ============================================================
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to add auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ============================================================
// QUEST ENDPOINTS
// ============================================================

/**
 * Fetch all active quests for a specific zone
 * 
 * @param zone - The zone to fetch quests for (workspace, game-lounge, meeting-room)
 * @returns Promise<Quest[]>
 * 
 * BACKEND ENDPOINT: GET /api/quests?zone={zone}
 */
export const fetchQuestsByZone = async (zone: string): Promise<Quest[]> => {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/quests?zone=${zone}`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) throw new Error('Failed to fetch quests');
  // return response.json();
  
  // Currently returns empty array - handled by GameContext
  return [];
};

/**
 * Start a quest
 * 
 * @param questId - The ID of the quest to start
 * @returns Promise<Quest>
 * 
 * BACKEND ENDPOINT: POST /api/quests/{questId}/start
 */
export const startQuestAPI = async (questId: string): Promise<Quest> => {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/quests/${questId}/start`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify({ questId }),
  // });
  // if (!response.ok) throw new Error('Failed to start quest');
  // return response.json();
  
  throw new Error('Not implemented - use GameContext for now');
};

/**
 * Complete a quest
 * 
 * @param questId - The ID of the quest to complete
 * @param performanceScore - Player's performance score (0-100)
 * @returns Promise<{ quest: Quest, rewards: { exp: number, currency: number } }>
 * 
 * BACKEND ENDPOINT: POST /api/quests/{questId}/complete
 */
export const completeQuestAPI = async (
  questId: string, 
  performanceScore: number
): Promise<{ quest: Quest; rewards: { exp: number; currency: number } }> => {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/quests/${questId}/complete`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify({ questId, performanceScore }),
  // });
  // if (!response.ok) throw new Error('Failed to complete quest');
  // return response.json();
  
  throw new Error('Not implemented - use GameContext for now');
};

// ============================================================
// SHOP ENDPOINTS
// ============================================================

/**
 * Fetch all available shop items
 * 
 * @returns Promise<ShopItem[]>
 * 
 * BACKEND ENDPOINT: GET /api/shop/items
 */
export const fetchShopItems = async (): Promise<ShopItem[]> => {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/shop/items`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) throw new Error('Failed to fetch shop items');
  // return response.json();
  
  return [];
};

/**
 * Purchase an item from the shop
 * 
 * @param itemId - The ID of the item to purchase
 * @returns Promise<{ success: boolean, newBalance: number }>
 * 
 * BACKEND ENDPOINT: POST /api/shop/purchase
 */
export const purchaseItemAPI = async (
  itemId: string
): Promise<{ success: boolean; newBalance: number }> => {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/shop/purchase`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify({ itemId }),
  // });
  // if (!response.ok) throw new Error('Failed to purchase item');
  // return response.json();
  
  throw new Error('Not implemented - use GameContext for now');
};

// ============================================================
// PLAYER ENDPOINTS
// ============================================================

/**
 * Fetch current player state
 * 
 * @returns Promise<PlayerState>
 * 
 * BACKEND ENDPOINT: GET /api/player
 */
export const fetchPlayerState = async (): Promise<PlayerState> => {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/player`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) throw new Error('Failed to fetch player state');
  // return response.json();
  
  throw new Error('Not implemented - use GameContext for now');
};

/**
 * Update player state (mood, stress, etc.)
 * 
 * @param updates - Partial player state updates
 * @returns Promise<PlayerState>
 * 
 * BACKEND ENDPOINT: PATCH /api/player
 */
export const updatePlayerState = async (
  updates: Partial<PlayerState>
): Promise<PlayerState> => {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/player`, {
  //   method: 'PATCH',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(updates),
  // });
  // if (!response.ok) throw new Error('Failed to update player state');
  // return response.json();
  
  throw new Error('Not implemented - use GameContext for now');
};

// ============================================================
// DYNAMIC QUEST GENERATION
// ============================================================

/**
 * Request AI-generated quests based on player level and preferences
 * 
 * @param params - Quest generation parameters
 * @returns Promise<Quest[]>
 * 
 * BACKEND ENDPOINT: POST /api/quests/generate
 */
export const generateDynamicQuests = async (params: {
  zone: string;
  difficulty: number;
  count: number;
}): Promise<Quest[]> => {
  // TODO: Implement AI-powered quest generation
  // const response = await fetch(`${API_BASE_URL}/quests/generate`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(params),
  // });
  // if (!response.ok) throw new Error('Failed to generate quests');
  // return response.json();
  
  throw new Error('Not implemented - future feature');
};

// ============================================================
// WEBSOCKET REAL-TIME UPDATES
// ============================================================

/**
 * Connect to WebSocket for real-time updates
 * 
 * USAGE:
 * const ws = connectToRealtimeUpdates((data) => {
 *   console.log('Received update:', data);
 * });
 */
export const connectToRealtimeUpdates = (
  onMessage: (data: any) => void
): WebSocket | null => {
  // TODO: Implement WebSocket connection
  // const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/updates`);
  // ws.onmessage = (event) => {
  //   const data = JSON.parse(event.data);
  //   onMessage(data);
  // };
  // return ws;
  
  console.warn('WebSocket not implemented yet');
  return null;
};
