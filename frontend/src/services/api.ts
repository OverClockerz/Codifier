// frontend/src/services/api.ts
import { Quest, PlayerState } from "../types/game";
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


export const startQuest = async (
  questId: string,
): Promise<Quest> => {
  return updateQuestData({
    questId,
    status: "active",
  });
};


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

/**
 * Generate quests from backend
 * Called on: new player, new day, or career restart
 */
export const generateQuests = async (
  username: string,
  zone: 'workspace' | 'game-lounge' | 'meeting-room',
  questAmount: number = 20,
): Promise<Quest[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("username", username);
    queryParams.append("zone", zone);
    queryParams.append("quest_amount", questAmount.toString());

    const url = `${API_BASE_URL}/api/quests/generate?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to generate quests: ${response.statusText}`,
      );
    }

    const data = await response.json();
    // backend returns either an array or an object { activeQuests: [...] }
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.activeQuests)) return data.activeQuests;
    return [];
  } catch (error) {
    console.error("Error generating quests:", error);
    throw error;
  }
};

// ============================================================
// AUTHENTICATION (For GitHub OAuth)
// ============================================================

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