import { GameConfig } from '../types/game';

export const GAME_CONFIG: GameConfig = {
  startingLevel: 1,
  startingCurrency: 100,
  startingMood: 80,
  startingStress: 10,
  startingPaidLeaves: 5,
  baseSalary: 1000,
  hoursPerDay: 8,
  daysPerMonth: 30,
  burnoutMoodThreshold: 0,
  maxStressThreshold: 100,
  experienceCurve: 1.5,
};

// Experience required for each level
export function getExperienceForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, GAME_CONFIG.experienceCurve));
}

// Salary calculation based on level
export function getSalaryForLevel(level: number): number {
  return GAME_CONFIG.baseSalary + (level - 1) * 200;
}

// Reputation score weights
export const REPUTATION_WEIGHTS = {
  taskCompletion: 0.4,
  codeQuality: 0.35,
  softSkills: 0.25,
};

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
  return Math.max(1, Math.floor(level * 0.5));
}
