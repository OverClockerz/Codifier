/**
 * Game Calculations Utilities
 * ============================
 * All game calculations for different aspects of the game.
 * This includes calculations for buffs/effects, salary, skills, reputation, exp, mood, stress, etc.
 */

import { PlayerState, Quest, ShopItem, Buff, ActiveBuff, ItemEffect } from '../types/game';
import { GAME_CONFIG, getExperienceForLevel, getSalaryForLevel, REPUTATION_WEIGHTS } from '../data/gameConfig';
import { useGame } from '../contexts/GameContext';

// ===========================
// EXPERIENCE & LEVELING
// ===========================

export function calculateLevelFromExp(totalExperience: number): { level: number; remainingExp: number } {
  let level = 1;
  let accumulated = 0;

  while (true) {
    const expRequired = getExperienceForLevel(level);
    if (accumulated + expRequired > totalExperience) {
      break;
    }
    accumulated += expRequired;
    level++;
  }

  return { level, remainingExp: totalExperience - accumulated };
}

export function addExperience(
  playerData: PlayerState,
  expGain: number
): { playerData: PlayerState; leveledUp: boolean } {
  let data = { ...playerData };
  data.experience += expGain;
  let leveledUp = false;

  // Check for level up
  while (data.experience >= data.experienceToNextLevel) {
    data.experience -= data.experienceToNextLevel;
    data.level += 1;
    leveledUp = true;

    // Update exp required for next level
    data.experienceToNextLevel = getExperienceForLevel(data.level);

    // Update salary
    data.baseSalary = getSalaryForLevel(data.level);

    // Track max level achieved
    if (data.level > data.currentRun.maxLevelAchieved) {
      data.currentRun.maxLevelAchieved = data.level;
    }
  }

  return { playerData: data, leveledUp };
}

// ===========================
// SALARY CALCULATIONS
// ===========================

export function calculateSalaryAdjustment(reputationScore: number): number {
  if (reputationScore >= 90) return 20; // +20%
  if (reputationScore >= 80) return 10; // +10%
  if (reputationScore >= 70) return 5; // +5%
  if (reputationScore >= 60) return 0; // No change
  if (reputationScore >= 50) return -5; // -5%
  if (reputationScore >= 40) return -10; // -10%
  return -20; // -20%
}

export function calculateFinalSalary(baseSalary: number, reputationScore: number): number {
  const adjustment = calculateSalaryAdjustment(reputationScore);
  return baseSalary + (baseSalary * adjustment) / 100;
}

// ===========================
// REPUTATION CALCULATIONS
// ===========================

export function calculateReputationScore(
  taskCompletion: number,
  codeQuality: number,
  softSkills: number
): number {
  // Normalize to center around 0
  // 60% is considered "neutral" (0 reputation)
  const neutralPoint = 60;

  const normalize = (value: number) => value - neutralPoint;

  const reputation =
    normalize(taskCompletion) * REPUTATION_WEIGHTS.taskCompletion +
    normalize(codeQuality) * REPUTATION_WEIGHTS.codeQuality +
    normalize(softSkills) * REPUTATION_WEIGHTS.softSkills;

  return Math.round(reputation * 100) / 100;
}

export function updateReputationOnQuestComplete(
  playerData: PlayerState,
  quest: Quest,
  performanceScore: number
): PlayerState {
  const data = { ...playerData };
  const skills = data.skills || {};

  // Get current metrics (default to 60 if not set)
  let taskCompletion = skills.taskCompletion || 60;
  let codeQuality = skills.codeQuality || 60;
  let softSkills = skills.softSkills || 60;

  // Update task completion (increases on completion)
  taskCompletion = Math.min(100, taskCompletion + 2);

  // Update zone-specific skills based on performance
  if (quest.zone === 'workspace') {
    // Technical tasks affect code quality
    if (performanceScore >= 90) {
      codeQuality = Math.min(100, codeQuality + 3);
    } else if (performanceScore >= 70) {
      codeQuality = Math.min(100, codeQuality + 1.5);
    } else if (performanceScore < 50) {
      codeQuality = Math.max(0, codeQuality - 2);
    }
  } else if (quest.zone === 'meeting-room') {
    // Soft skill tasks affect soft skills
    if (performanceScore >= 90) {
      softSkills = Math.min(100, softSkills + 3);
    } else if (performanceScore >= 70) {
      softSkills = Math.min(100, softSkills + 1.5);
    } else if (performanceScore < 50) {
      softSkills = Math.max(0, softSkills - 2);
    }
  } else if (quest.zone === 'game-lounge') {
    // Game lounge slightly boosts both
    if (performanceScore >= 70) {
      codeQuality = Math.min(100, codeQuality + 1);
      softSkills = Math.min(100, softSkills + 1);
    }
  }

  // Update player skills
  data.skills = {
    ...data.skills,
    taskCompletion: Math.round(taskCompletion * 100) / 100,
    codeQuality: Math.round(codeQuality * 100) / 100,
    softSkills: Math.round(softSkills * 100) / 100,
  };

  // Recalculate reputation
  data.reputation = calculateReputationScore(taskCompletion, codeQuality, softSkills);

  return data;
}

export function updateReputationOnQuestFail(playerData: PlayerState, quest: Quest): PlayerState {
  const data = { ...playerData };
  const skills = data.skills || {};

  let taskCompletion = skills.taskCompletion || 60;
  let codeQuality = skills.codeQuality || 60;
  let softSkills = skills.softSkills || 60;

  // Penalty based on quest difficulty
  const penalty = quest.difficulty * 2; // 2-10 point penalty

  // Reduce task completion significantly
  taskCompletion = Math.max(0, taskCompletion - penalty);

  // Zone-specific penalties
  if (quest.zone === 'workspace') {
    codeQuality = Math.max(0, codeQuality - penalty * 0.5);
  } else if (quest.zone === 'meeting-room') {
    softSkills = Math.max(0, softSkills - penalty * 0.5);
  }

  // Update player skills
  data.skills = {
    ...data.skills,
    taskCompletion: Math.round(taskCompletion * 100) / 100,
    codeQuality: Math.round(codeQuality * 100) / 100,
    softSkills: Math.round(softSkills * 100) / 100,
  };

  // Recalculate reputation
  data.reputation = calculateReputationScore(taskCompletion, codeQuality, softSkills);

  return data;
}

export function checkGameOver(reputationScore: number): boolean {
  return reputationScore <= -20; // Game over at -20% reputation
}

// ===========================
// MOOD & STRESS CALCULATIONS
// ===========================

export function calculateMoodStressChange(
  quest: Quest,
  performanceScore: number,
  activeBuffs: Buff[],
  permanentBuffs: Buff[]
): { moodChange: number; stressChange: number } {
  // Performance multiplier
  const multiplier = performanceScore / 100;

  let stressChange = 0;
  let moodChange = 0;

  // Zone-specific calculations
  if (quest.zone === 'workspace') {
    // Workspace: reduce mood, increase stress (scaled by performance)
    stressChange = Math.floor((quest.stressImpact || 0) * multiplier);
    moodChange = Math.floor((quest.moodImpact || 0) * multiplier);
  } else if (quest.zone === 'game-lounge') {
    // Game Lounge: increase mood, reduce stress (scaled by performance)
    moodChange = Math.floor(Math.abs(quest.moodImpact || 0) * multiplier);
    stressChange = -Math.floor(Math.abs(quest.stressImpact || 0) * multiplier);
  } else if (quest.zone === 'meeting-room') {
    // Meeting Room: varies based on performance
    if (performanceScore >= 70) {
      moodChange = Math.floor(Math.abs(quest.moodImpact || 0) * multiplier);
      stressChange = -Math.floor((quest.stressImpact || 0) * (multiplier * 0.5));
    } else {
      moodChange = Math.floor((quest.moodImpact || 0) * multiplier);
      stressChange = Math.floor((quest.stressImpact || 0) * multiplier);
    }
  }

  // Apply buff effects (both active and permanent)
  const allBuffs = [...activeBuffs, ...permanentBuffs];

  for (const buff of allBuffs) {
    const effect = buff.effect || {};

    // Stress reduction buff (reduces stress increase or increases stress reduction)
    if (effect.stressReduction) {
      const reductionPercent = effect.stressReduction;
      if (stressChange > 0) {
        // Reduce stress increase
        stressChange -= Math.floor(Math.abs(stressChange) * (reductionPercent / 100));
      } else {
        // Increase stress reduction
        stressChange -= Math.floor(10 * (reductionPercent / 100));
      }
    }

    // Mood increase buff
    if (effect.moodIncrease) {
      const increasePercent = effect.moodIncrease;
      moodChange += Math.floor(10 * (increasePercent / 100));
    }
  }

  return { moodChange, stressChange };
}

export function updateMoodStress(
  playerData: PlayerState,
  moodChange: number,
  stressChange: number
): PlayerState {
  const data = { ...playerData };

  data.mood = Math.max(0, Math.min(100, data.mood + moodChange));
  data.stress = Math.max(0, Math.min(100, data.stress + stressChange));

  // Check for burnout
  data.isBurntOut =
    data.mood <= GAME_CONFIG.burnoutMoodThreshold || data.stress >= GAME_CONFIG.maxStressThreshold;

  return data;
}

// ===========================
// QUEST REWARDS CALCULATIONS
// ===========================

export function calculateQuestRewards(
  quest: Quest,
  performanceScore: number,
  activeBuffs: Buff[]
): { expGain: number; currencyGain: number } {
  // Base rewards scaled by performance
  const multiplier = performanceScore / 100;
  let expGain = Math.floor(quest.expReward * multiplier);
  let currencyGain = Math.floor(quest.currencyReward * multiplier);

  // Apply buff effects
  for (const buff of activeBuffs) {
    const effect = buff.effect || {};

    // EXP boost
    if (effect.expBoost) {
      expGain += Math.floor(quest.expReward * multiplier * (effect.expBoost / 100));
    }

    // Currency boost
    if (effect.currencyBoost) {
      currencyGain += Math.floor(quest.currencyReward * multiplier * (effect.currencyBoost / 100));
    }
  }

  return { expGain, currencyGain };
}

// ===========================
// BUFF MANAGEMENT
// ===========================

export function applyConsumableItem(
  playerData: PlayerState,
  item: ShopItem
): PlayerState {
  const data = { ...playerData };
  const effect = item.effect || {};
  let activeBuff: ActiveBuff | null = null;

  // Instant effects
  if (effect.stressReduction) {
    data.stress = Math.max(0, data.stress - effect.stressReduction);
  }

  if (effect.moodIncrease) {
    data.mood = Math.min(100, data.mood + effect.moodIncrease);
  }

  if (effect.paidLeaves) {
    data.paidLeaves += effect.paidLeaves;
  }

  // Timed buff effects
  // if (effect.duration) {
  //   const appliedAt = Date.now();
  //   const expiresAt = Date.now() + effect.duration * 60 * 1000;
  //   activeBuff = {
  //     itemId: item.id,
  //     name: item.name,
  //     effect: effect,
  //     appliedAt: appliedAt,
  //     expiresAt: expiresAt,
  //   };
  // }
  // if (activeBuff) {
  //   playerData.activeBuffs.push(activeBuff);
  // } 

  return data;
}

export function applyPermanentBuff(playerData: PlayerState, item: ShopItem): PlayerState {
  const data = { ...playerData };
  const permanentBuff: Buff = {
    itemId: item.id,
    name: item.name,
    effect: item.effect || {},
  };

  if (!data.permanentBuffs) {
    data.permanentBuffs = [];
  }

  // Check if already owned before applying
  if (!data.permanentBuffs.some((buff) => buff.itemId === item.id)) {
    data.permanentBuffs.push(permanentBuff);
    Object.keys(permanentBuff.effect).forEach((key) => {
      if (key in data.activeBuffs) {
        console.log('Applying permanent buff:', key, permanentBuff.effect[key as keyof ItemEffect]);
        data.activeBuffs[key as keyof ActiveBuff]! += permanentBuff.effect[key as keyof ItemEffect] || 0;
      }
    });
    
  }

  return data;
}

export function filterExpiredBuffs(activeBuffs: Buff[]): Buff[] {
  const now = Date.now();
  return activeBuffs.filter((buff) => (buff.expiresAt || now + 1) > now);
}

// ===========================
// CURRENCY CALCULATIONS
// ===========================

export function canAffordItem(playerCurrency: number, itemPrice: number): boolean {
  return playerCurrency >= itemPrice;
}

export function purchaseItem(
  playerData: PlayerState,
  item: ShopItem
): { success: boolean; playerData: PlayerState; message: string } {
  let data = { ...playerData };

  if (!canAffordItem(data.currency, item.price)) {
    return { success: false, playerData: data, message: 'Not enough currency' };
  }

  // Deduct currency
  data.currency -= item.price;

  // Handle item type
  if (item.type === 'permanent-buff') {
    // Check if already owned
    if (data.permanentBuffs?.some((buff) => buff.itemId === item.id)) {
      // Refund
      data.currency += item.price;
      return { success: false, playerData: data, message: 'Already owned' };
    }

    data = applyPermanentBuff(data, item);
    return { success: true, playerData: data, message: 'Permanent buff acquired' };
  } else if (item.type === 'consumable') {
    // Add to inventory
    // if (!data.inventory) {
    //   data.inventory = [];
    // }

    // // Check if item already in inventory
    // const existing = data.inventory.find((inv) => inv.item.id === item.id);
    // if (existing) {
    //   existing.quantity += 1;
    // } else {
    //   data.inventory.push({
    //     item: item,
    //     quantity: 1,
    //     purchasedAt: Date.now(),
    //   });
    // }

    data = applyConsumableItem(data, item);


    return { success: true, playerData: data, message: 'Item added to inventory' };
  }

  return { success: false, playerData: data, message: 'Unknown item type' };
}

// ===========================
// DEADLINE CALCULATIONS
// ===========================

export function calculateDeadlineTimestamp(hoursFromNow: number): number {
  return Date.now() + hoursFromNow * 60 * 60 * 1000; // milliseconds
}

export function isDeadlinePassed(deadlineTimestamp: number): boolean {
  return Date.now() > deadlineTimestamp;
}

export function getTimeRemaining(deadlineTimestamp: number): number {
  const remainingMs = deadlineTimestamp - Date.now();
  if (remainingMs <= 0) {
    return 0;
  }
  return remainingMs / (1000 * 60 * 60); // Convert to hours
}

// ===========================
// CAREER RESET CALCULATIONS
// ===========================

export function calculateRestartLevel(totalExperience: number): number {
  const { level } = calculateLevelFromExp(totalExperience);

  // Start at 50% of max achieved level (minimum 1)
  return Math.max(1, Math.floor(level * 0.5));
}

export function resetCareer(playerData: PlayerState): PlayerState {
  const data = { ...playerData };

  // Save career history
  const careerRun = {
    runNumber: data.currentRun.runNumber,
    startLevel: data.currentRun.startLevel,
    maxLevelAchieved: data.currentRun.maxLevelAchieved,
    totalExperience: data.currentRun.totalExperience,
    monthsWorked: data.currentRun.monthsWorked,
    endDate: new Date().toISOString(),
  };

  if (!data.careerHistory) {
    data.careerHistory = [];
  }
  data.careerHistory.push(careerRun);

  // Calculate restart level
  const totalExp = data.currentRun.totalExperience;
  const restartLevel = calculateRestartLevel(totalExp);

  // Reset player state
  data.level = restartLevel;
  data.experience = 0;
  data.experienceToNextLevel = getExperienceForLevel(restartLevel);
  data.currency = GAME_CONFIG.startingCurrency;
  data.mood = GAME_CONFIG.startingMood;
  data.stress = GAME_CONFIG.startingStress;
  data.isBurntOut = false;
  data.baseSalary = getSalaryForLevel(restartLevel);
  data.currentMonthEarnings = 0;
  data.paidLeaves = GAME_CONFIG.startingPaidLeaves;
  data.currentDay = 1;
  data.currentMonth = 1;
  data.reputation = 0;
  data.skills = {};
  data.permanentBuffs = []; // Lose permanent buffs
  data.activeQuests = [];
  data.completedQuests = [];
  data.inventory = [];

  // Start new run
  data.currentRun = {
    runNumber: careerRun.runNumber + 1,
    startLevel: restartLevel,
    maxLevelAchieved: restartLevel,
    totalExperience: totalExp, // Keep accumulated experience
    monthsWorked: 0,
  };

  return data;
}

// ===========================
// SKILL PROGRESSION
// ===========================

export function updateSkillProgress(
  playerData: PlayerState,
  skillName: string,
  progressAmount: number = 1
): PlayerState {
  const data = { ...playerData };

  if (!data.skills) {
    data.skills = {};
  }

  // Initialize skill if not exists
  if (!(skillName in data.skills)) {
    data.skills[skillName] = 0;
  }

  // Add progress
  data.skills[skillName] = Math.min(100, data.skills[skillName] + progressAmount);

  return data;
}

export function updateQuestSkills(
  playerData: PlayerState,
  quest: Quest,
  performanceScore: number
): PlayerState {
  let data = { ...playerData };

  if (!quest.skills || quest.skills.length === 0) {
    return data;
  }

  // Progress amount based on performance
  const progressAmount = performanceScore >= 70 ? 1 : 0.5;

  for (const skill of quest.skills) {
    data = updateSkillProgress(data, skill, progressAmount);
  }

  return data;
}



// ===========================
//DEADLINE CALCULATIONS
//===========================

export function calculateDeadline(deadline: number): number {
  return Math.ceil((deadline - Math.floor(Date.now())/1000)/(60*60*24)) // milliseconds
}

//============================
// TIME ADVANCEMENT
//===========================

// --- New Time System Integration ---
type DateInput = string | { $date: string };

function normalizeDate(input: DateInput): string {
  return typeof input === "string" ? input : input.$date;
}
let months = 0;
export function gameTimeSince(player: PlayerState): { days: number; months: number } {
  const input = player.gameStartDate;
  const dateString = normalizeDate(input);
  const past = new Date(dateString).getTime();
  const now = Date.now();

  // Prevent negative differences
  const diffMs = Math.max(0, now - past);
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const prevMonth = months;
  months = Math.floor(totalDays / 30) + 1;
  if (prevMonth !== months) {
    salaryIncrement(player, months - prevMonth);
  }

  // Days cycle from 1–30
  const days = (totalDays % 30) + 1;

  console.log('Total days:', totalDays, 'Calculated months:', months, 'Days:', days);

  return { days, months };
}
function salaryIncrement(player: PlayerState, months: number) {
  player.currency += player.baseSalary*months + player.currentMonthEarnings;
  player.currentMonthEarnings = 0;
  return;
}

