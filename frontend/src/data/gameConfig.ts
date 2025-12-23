/**
 * Game Configuration File
 * ========================
 * All variable game data that needs to be configured or modified should be here.
 * This is the single source of truth for game settings.
 */

import { GameConfig } from '../types/game';

// ===========================
// GAME SETTINGS
// ===========================

export const GAME_CONFIG: GameConfig = {
  // Starting player stats
  // startingLevel: 1,
  // startingCurrency: 1000000,
  // startingMood: 100,
  // startingStress: 0,
  // startingPaidLeaves: 5,
  // startingReputation: 0, // Start at +0%

  // Progression settings
  baseSalary: 1000,
  salaryPerLevel: 200,
  experienceCurve: 1.5, // Formula: 100 * (level ^ curve)

  // Game mechanics
  hoursPerDay: 8,
  daysPerMonth: 30,
  burnoutMoodThreshold: 0,
  maxStressThreshold: 100,
  gameOverReputation: -20, // Game over at -20% reputation

  // Performance thresholds
  performanceThresholds: {
    excellent: 90, // >= 90%
    good: 70, // >= 70%
    average: 50, // >= 50%
    poor: 0, // < 50%
  },

  // Restart settings (when fired)
  restartLevelPercentage: 0.5, // Start at 50% of max achieved level
};

// ===========================
// REPUTATION WEIGHTS
// ===========================

// Reputation weights (must sum to 1.0)
export const REPUTATION_WEIGHTS = {
  taskCompletion: 0.4,
  codeQuality: 0.35,
  softSkills: 0.25,
};

// ===========================
// HELPER FUNCTIONS
// ===========================

// Experience required for each level
export function getExperienceForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, GAME_CONFIG.experienceCurve));
}

// Salary calculation based on level
export function getSalaryForLevel(level: number): number {
  return GAME_CONFIG.baseSalary + (level - 1) * GAME_CONFIG.salaryPerLevel;
}

// Salary adjustment based on reputation
export function getSalaryAdjustment(reputationScore: number): number {
  if (reputationScore >= 90) return 20; // +20%
  if (reputationScore >= 80) return 10; // +10%
  if (reputationScore >= 70) return 5; // +5%
  if (reputationScore >= 60) return 0; // No change
  if (reputationScore >= 50) return -5; // -5%
  if (reputationScore >= 40) return -10; // -10%
  return -20; // -20%
}

// Calculate new starting level after being fired
export function getRestartLevel(totalExperience: number): number {
  let level = 1;
  let expRequired = getExperienceForLevel(level);
  let accumulated = 0;

  while (accumulated + expRequired <= totalExperience) {
    accumulated += expRequired;
    level++;
    expRequired = getExperienceForLevel(level);
  }

  // Start at 50% of max achieved level (minimum 1)
  return Math.max(1, Math.floor(level * GAME_CONFIG.restartLevelPercentage));
}

// ===========================
// INITIAL PLAYER DATA
// ===========================

export function getInitialPlayerData(userId: string, username: string) {
  return {
    id: userId,
    username: username,
    // level: GAME_CONFIG.startingLevel,
    experience: 0,
    // experienceToNextLevel: getExperienceForLevel(GAME_CONFIG.startingLevel),
    // currency: GAME_CONFIG.startingCurrency,
    // mood: GAME_CONFIG.startingMood,
    // stress: GAME_CONFIG.startingStress,
    isBurntOut: false,
    baseSalary: GAME_CONFIG.baseSalary,
    currentMonthEarnings: 0,
    // paidLeaves: GAME_CONFIG.startingPaidLeaves,
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
    // reputation: GAME_CONFIG.startingReputation,
    skills: {}, // Will be populated as player completes quests
    // permanentBuffs: [], // Will be populated when player buys permanent items
    activeQuests: [], // IDs of active quests
    completedQuests: [], // IDs of completed quests
    inventory: [], // Array of inventory items
  };
}

