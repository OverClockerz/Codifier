// frontend/src/services/api.ts
import { Quest, PlayerState } from "../types/game";

const API_BASE_URL = "http://localhost:5000";

/* ============================================================
   PLAYER ENDPOINTS (JWT AUTH)
============================================================ */

export const fetchPlayerData = async (): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/player/get`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch player data`);
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update player data`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating player data:", error);
    throw error;
  }
};

/* ============================================================
   QUEST ENDPOINTS (JWT AUTH)
============================================================ */

export const fetchQuestsData = async (params?: {
  zone?: string;
  status?: string;
}
): Promise<Quest[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.zone) queryParams.append("zone", params.zone);
    if (params?.status) queryParams.append("status", params.status);

    const url = `${API_BASE_URL}/api/quests/get?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quests data`);
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update quest data`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating quest data:", error);
    throw error;
  }
};

export async function getLoggedInUser() {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: "include", // include HTTP-only cookie
  });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

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

export async function apilogout() {
  const res = await fetch("http://localhost:5000/auth/logout", {
    method: "POST",
    credentials: "include", // IMPORTANT
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}

/**
 * Generate quests from backend
 * Called on: new player, new day, or career restart
 */
export const generateQuests = async (
  zone: 'workspace' | 'game-lounge' | 'meeting-room',
  questAmount: number = 20,
): Promise<Quest[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("zone", zone);
    queryParams.append("quest_amount", questAmount.toString());

    const url = `${API_BASE_URL}/api/quests/generate?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
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