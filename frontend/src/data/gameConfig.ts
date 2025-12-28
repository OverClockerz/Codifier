/**
 * Game Configuration - Calculation Functions Only
 * =================================================
 * This file contains ONLY calculation/helper functions used by the frontend.
 * All game configuration data is fetched from the backend.
 */

// ===========================
// CALCULATION FUNCTIONS
// ===========================

/**
 * Calculate experience required for a given level
 * Formula: 100 * (level ^ 1.5)
 */
export function getExperienceForLevel(level: number): number {
  const EXPERIENCE_CURVE = 1.5;
  return Math.floor(100 * Math.pow(level, EXPERIENCE_CURVE));
}

/**
 * Calculate base salary for a given level
 * Formula: 1000 + (level - 1) * 200
 */

export function getSalaryForLevel(level: number): number {
  const BASE_SALARY = 1000;
  const SALARY_PER_LEVEL = 200;
  return BASE_SALARY + (level - 1) * SALARY_PER_LEVEL;
}

/**
 * Calculate salary adjustment percentage based on reputation score
 */
export function getSalaryAdjustment(reputationScore: number): number {
  if (reputationScore >= 90) return 20; // +20%
  if (reputationScore >= 80) return 10; // +10%
  if (reputationScore >= 70) return 5; // +5%
  if (reputationScore >= 60) return 0; // No change
  if (reputationScore >= 50) return -5; // -5%
  if (reputationScore >= 40) return -10; // -10%
  return -20; // -20%
}

/**
 * Calculate new starting level after being fired
 * Uses 50% of total experience accumulated
 */
export function getRestartLevel(totalExperience: number): number {
  const RESTART_LEVEL_PERCENTAGE = 0.5;
  let level = 1;
  let expRequired = getExperienceForLevel(level);
  let accumulated = 0;

  while (accumulated + expRequired <= totalExperience) {
    accumulated += expRequired;
    level++;
    expRequired = getExperienceForLevel(level);
  }

  // Start at 50% of max achieved level (minimum 1)
  return Math.max(1, Math.floor(level * RESTART_LEVEL_PERCENTAGE));
}

/**
 * Reputation calculation weights
 * Used for monthly performance reports
 */
export const REPUTATION_WEIGHTS = {
  taskCompletion: 0.4,
  codeQuality: 0.35,
  softSkills: 0.25,
};

/**
 * Game constants used for calculations
 */
export const GAME_CONSTANTS = {
  BURNOUT_MOOD_THRESHOLD: 0,
  MAX_STRESS_THRESHOLD: 100,
  GAME_OVER_REPUTATION: -20, // Fired at -20% reputation
  DAYS_PER_MONTH: 30,
  HOURS_PER_DAY: 8,
};

import { GameConfig } from '../types/game';

// ===========================
// GAME SETTINGS
// ===========================
export const GAME_CONFIG: GameConfig = {
  startingLevel: 1,
  startingCurrency: 100,
  startingMood: 100,
  startingStress: 0,
  startingPaidLeaves: 0,
  startingReputation: 0,
  baseSalary: 1000,
  salaryPerLevel: 200,
  experienceCurve: 1.5, 
  hoursPerDay: 8,
  daysPerMonth: 30,
  burnoutMoodThreshold: 0,
  maxStressThreshold: 100,
  gameOverReputation: -20, 
  performanceThresholds: {
    excellent: 90, // >= 90%
    good: 70, // >= 70%
    average: 50, // >= 50%
    poor: 0, // < 50%
  },
  restartLevelPercentage: 0.5, // Start at 50% of max achieved level
};
// ===========================
// PROFESSIONAL ATTRIBUTES
// ===========================
/**
 * Professional attributes used across the game
 * - GameDashboard: calculates overall skill proficiency as average
 * - ProfilePage: displays detailed breakdown with radar chart
 */
export const PROFESSIONAL_ATTRIBUTES = [
  { id: 1, name: 'Coding Skill', score: 100, maxScore: 100, description: 'Workspace proficiency', angle: 270 },
  { id: 2, name: 'Soft Skills', score: 80, maxScore: 100, description: 'Meeting Room success', angle: 198 },
  { id: 3, name: 'Reliability', score: 90, maxScore: 100, description: 'Deadline consistency', angle: 342 },
  { id: 4, name: 'Problem Solving', score: 20, maxScore: 100, description: 'Game Lounge effectiveness', angle: 54 },
  { id: 5, name: 'Stress Resistance', score: 60, maxScore: 100, description: 'Performance under pressure', angle: 126 },
];

