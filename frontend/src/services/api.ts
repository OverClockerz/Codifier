/**
 * API SERVICE - BACKEND INTEGRATION LAYER
 * ========================================
 * This file provides a clean interface for all backend API calls.
 *
 * 🔗 HOW TO CONNECT TO YOUR BACKEND:
 * 1. Set VITE_API_URL in your .env file to your backend URL
 * 2. Implement the 4 core endpoints in your backend (see BACKEND_INTEGRATION.md)
 * 3. The frontend will automatically use these functions to fetch/save game data
 *
 * 📚 DOCUMENTATION:
 * - Complete integration guide: /BACKEND_INTEGRATION.md
 * - Database schema: /services/databaseSchema.ts
 * - Example usage: /contexts/GameContext.tsx
 *
 * 🎯 BACKEND ENDPOINTS REQUIRED:
 * - GET  /api/player/get       → Fetch player data from database
 * - POST /api/player/update    → Update player data in database
 * - GET  /api/quests/get       → Fetch available quests for player
 * - POST /api/quests/update    → Update quest status (start/complete/fail)
 * - POST /api/auth/github      → GitHub OAuth authentication
 */

import { Quest, ShopItem, PlayerState } from "../types/game";

// ============================================================
// API CONFIGURATION
// ============================================================

// Safely access environment variables with fallbacks
// This works in multiple build environments (Vite, CRA, etc.)
// const getEnvVar = (key: string, defaultValue: string = ''): string => {
//   // Check for Vite environment variables
//   if (typeof import.meta !== 'undefined' && import.meta.env) {
//     return (import.meta.env[key] as string) || defaultValue;
//   }
//   // Check for Create React App environment variables
//   if (typeof process !== 'undefined' && process.env) {
//     return process.env[key] || defaultValue;
//   }
//   // Fallback to default
//   return defaultValue;
// };

// Your backend API base URL - set this in your .env file
// Example: VITE_API_URL=http://localhost:5000
// or VITE_API_URL=https://your-backend-api.com
const API_BASE_URL = 'http://localhost:5000';

// Helper function to add auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ============================================================
// PLAYER ENDPOINTS
// ============================================================

/**
 * Fetch current player state from backend
 *
 * @param username - Player's username
 * @returns Promise<any> - Raw backend data (will be transformed in GameContext)
 *
 * BACKEND ENDPOINT: GET /api/player/get?username=Myst-Blazeio
 *
 * Expected backend response format:
 * {
 *   "_id": { "$oid": "..." },
 *   "username": "player-name",
 *   "githubinfo": { "github_id": "...", "avatar_url": "...", "github_email": "..." },
 *   "level": 1,
 *   "experience": 0,
 *   "currency": 100,
 *   "mood": 70,
 *   "stress": 20,
 *   "reputation": 0,
 *   "skills": { "python": 5, "git": 3 },
 *   "permanentItems": [],
 *   "activeQuests": [...],  // Array of Quest objects
 *   "completedQuests": [...],
 *   "inventory": [...]
 * }
 */
export const fetchPlayerData = async (username: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/player/get?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch player data: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching player data:", error);
    throw error;
  }
};

/**
 * Update player state on backend
 *
 * @param playerData - Complete or partial player state to update
 * @returns Promise<PlayerState>
 *
 * BACKEND ENDPOINT: POST /api/player/update
 */
export const updatePlayerData = async (
  playerData: Partial<PlayerState>,
): Promise<PlayerState> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/player/update`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(playerData),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update player data: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating player data:", error);
    throw error;
  }
};

// ============================================================
// QUEST ENDPOINTS
// ============================================================

/**
 * Fetch quests data from backend
 *
 * @param username - Player's username
 * @param params - Optional query parameters (zone, status, etc.)
 * @returns Promise<Quest[]>
 *
 * BACKEND ENDPOINT: GET /api/quests/get?username=Myst-Blazeio&zone=workspace
 */
export const fetchQuestsData = async (
  username: string,
  params?: {
    zone?: string;
    status?: string;
  }
): Promise<Quest[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("username", username);
    if (params?.zone) queryParams.append("zone", params.zone);
    if (params?.status) queryParams.append("status", params.status);

    const url = `${API_BASE_URL}/api/quests/get?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch quests data: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching quests data:", error);
    throw error;
  }
};

/**
 * Update quest data on backend
 *
 * @param questData - Quest data to update (includes quest ID and updates)
 * @returns Promise<Quest>
 *
 * BACKEND ENDPOINT: POST /api/quests/update
 */
export const updateQuestData = async (questData: {
  questId: string;
  status?: string;
  performanceScore?: number;
  [key: string]: any;
}): Promise<Quest> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/quests/update`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(questData),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update quest data: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating quest data:", error);
    throw error;
  }
};

// ============================================================
// HELPER FUNCTIONS (For future use)
// ============================================================

/**
 * Start a quest (helper function using updateQuestData)
 */
export const startQuest = async (
  questId: string,
): Promise<Quest> => {
  return updateQuestData({
    questId,
    status: "active",
  });
};

/**
 * Complete a quest (helper function using updateQuestData)
 */
export const completeQuest = async (
  questId: string,
  performanceScore: number,
): Promise<Quest> => {
  return updateQuestData({
    questId,
    status: "completed",
    performanceScore,
  });
};

/**
 * Fail a quest (helper function using updateQuestData)
 */
export const failQuest = async (
  questId: string,
): Promise<Quest> => {
  return updateQuestData({
    questId,
    status: "failed",
  });
};

// ============================================================
// AUTHENTICATION (For GitHub OAuth)
// ============================================================

/**
 * Initialize GitHub OAuth flow
 *
 * @returns OAuth URL to redirect user
 */
// export const initiateGitHubAuth = (): string => {
//   const clientId = getEnvVar('VITE_GITHUB_CLIENT_ID', 'YOUR_GITHUB_CLIENT_ID');
//   const redirectUri = encodeURIComponent(
//     getEnvVar('VITE_GITHUB_REDIRECT_URI', window.location.origin + '/auth/callback')
//   );
//   return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
// };

// /**
//  * Exchange GitHub code for auth token
//  *
//  * @param code - GitHub OAuth code from callback
//  * @returns Promise<{ token: string, user: any }>
//  */
// export const exchangeGitHubCode = async (
//   code: string,
// ): Promise<{ token: string; user: any }> => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/api/auth/github`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ code }),
//       },
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Failed to exchange GitHub code: ${response.statusText}`,
//       );
//     }

//     const data = await response.json();

//     // Store token in localStorage
//     if (data.token) {
//       localStorage.setItem("auth_token", data.token);
//     }

//     return data;
//   } catch (error) {
//     console.error("Error exchanging GitHub code:", error);
//     throw error;
//   }
// };

// /**
//  * Logout user and clear auth token
//  */
// export const logout = (): void => {
//   localStorage.removeItem("auth_token");
// };

// ============================================================
// SHOP - CLIENT-SIDE ONLY
// ============================================================

/**
 * Shop items are hardcoded in /data/shopItems.ts
 * When a player purchases an item, the effect is calculated in the frontend
 * and the updated player state (with permanentItems or inventory) is sent
 * to the backend via updatePlayerData()
 *
 * NO SHOP API ENDPOINTS ARE NEEDED.
 *
 * Purchase flow:
 * 1. Player clicks "Buy" on a shop item (in Cafeteria zone)
 * 2. Frontend validates currency and applies item effects
 * 3. Frontend updates player state locally (add to inventory/permanentBuffs)
 * 4. Frontend calls updatePlayerData() to sync with backend
 */

// ============================================================
// ERROR HANDLING
// ============================================================

/**
 * Generic error handler for API calls
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    return (
      error.response.data?.message || "Server error occurred"
    );
  } else if (error.request) {
    // Request made but no response
    return "No response from server. Please check your connection.";
  } else {
    // Error in request setup
    return error.message || "An unexpected error occurred";
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("auth_token");
};

/**
 * Get auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};