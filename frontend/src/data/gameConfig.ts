export const GAME_CONFIG = {
  startingLevel: 1,
  startingCurrency: 500,
  startingMood: 80,
  startingStress: 20,
  startingPaidLeaves: 5,
  baseSalary: 3000,
  burnoutMoodThreshold: 20,
  daysPerMonth: 30,
};

export const REPUTATION_WEIGHTS = {
  taskCompletion: 0.4,
  codeQuality: 0.3,
  softSkills: 0.3,
};

export function getExperienceForLevel(level: number): number {
  return Math.floor(1000 * Math.pow(1.2, level - 1));
}

export function getSalaryForLevel(level: number): number {
  return Math.floor(3000 * Math.pow(1.1, level - 1));
}

export function getSalaryAdjustment(reputationScore: number): number {
  if (reputationScore > 80) return 10;
  if (reputationScore > 60) return 5;
  if (reputationScore < 40) return -5;
  return 0;
}

export function getRestartLevel(totalExperience: number): number {
  // Simple logic: retain 1 level for every 5000 XP, max level 5 start
  const levels = Math.floor(totalExperience / 5000);
  return Math.min(5, Math.max(1, levels));
}