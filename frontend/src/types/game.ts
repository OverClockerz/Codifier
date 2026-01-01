// game.ts
// Core Game Types for Office - A Gamified Career Simulation

// ============================================================
// SHARED ENUMS & TYPES
// ============================================================

export type ZoneType = 'workspace' | 'game-lounge' | 'meeting-room' | 'cafeteria';
export type QuestFrequency = 'daily' | 'weekly' | 'monthly';
export type QuestStatus = 'available' | 'in-progress' | 'completed' | 'failed';
export type QuestType = 'MCQ' | 'Coding' | 'Comprehensive' | 'Typing';
export type SkillCategory = 'technical' | 'critical-thinking' | 'soft-skills';
export type NotificationType = 'quest' | 'salary' | 'bonus' | 'buff' | 'warning' | 'achievement' | 'alert';

// ============================================================
// QUEST SYSTEM
// ============================================================
// Updated to match Python Backend Dictionary Structures

export interface QuestProficiencyImpact {
  coding_skill?: number;          // 0-0.5
  soft_skill?: number;            // 0-0.5
  critical_thinking_skill?: number; // 0-0.5
  problem_solving?: number;       // 0-0.5
  stress_resistance?: number;     // 0-0.5
}

// Common properties shared by all quest types
interface BaseQuest {
  id: string;
  title: string;
  description: string;
  zone: ZoneType;
  difficulty: number; // Scale of 1-4
  
  // Rewards & Impacts
  expReward: number;
  currencyReward: number;
  stressImpact: number;
  moodImpact: number;
  
  // Stats
  proficiency: QuestProficiencyImpact;
  skills: string[]; // List of skills improved
  deadline: number; // number of days
  
  // Frontend State Tracking (Not in Python dict, but required for game logic)
  status: QuestStatus;
  startedAt?: number;
  completedAt?: number;
  performanceScore?: number; // Score achieved (0-100)
}

// 1. MCQ Quest
export interface MCQQuest extends BaseQuest {
  type: 'MCQ';
  question_data: Array<{
    question: string;
    options: string[];
    correctOption: number; // Index of the correct option
  }>;
}

// 2. Comprehensive Quest (Game Lounge / Critical Thinking)
export interface ComprehensiveQuest extends BaseQuest {
  type: 'Comprehensive';
  question_data: {
    question: string; // The scenario based question
  };
}

// 3. Coding Quest (Workspace)
export interface CodingQuest extends BaseQuest {
  type: 'Coding';
  examples: Array<{
    input: string;
    expectedOutput: string;
    isHidden: boolean; // False
  }>;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden: boolean; // True
  }>;
}

// 4. Typing Quest
export interface TypingQuest extends BaseQuest {
  type: 'Typing';
  question_data: {
    question: string; // The paragraph
    time: number;     // Time limit in seconds
  };
}

// Unified Quest Type
export type Quest = MCQQuest | ComprehensiveQuest | CodingQuest | TypingQuest;

// ============================================================
// PLAYER STATE
// ============================================================
// Note: Player data is fetched from and saved to the backend
// See /services/api.ts: fetchPlayerData(), updatePlayerData()

export interface PlayerState {
  id: string;
  username: string;
  githubinfo: GitHubInfo;
  gameStartDate: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  currency: number;
  mood: number; // 0-100
  stress: number; // 0-100
  isBurntOut: boolean;
  baseSalary: number;
  currentMonthEarnings: number;
  currentMonthTasksCompleted?: number; // Track completed quests this month
  paidLeaves: number;
  currentDay: number; // In-game day counter
  currentMonth: number;
  lastLoginDate: Date;
  proficiency: PlayerProficiency;
  careerHistory: CareerRun[];
  currentRun: CareerRun;
  reputation: number; // Reputation score (-20 to +∞, fired at -20)
  skills: Record<string, number>; // Skill name -> level (0-100)
  activeBuffs: ActiveBuff; // List of permanent buffs applied
  permanentBuffs: Buff[]; // Permanent buffs acquired
  activeQuests: Quest[]; // List of active quest objects
  completedQuests: Quest[]; // List of completed quest objects
  inventory: InventoryItem[]; // Array of inventory items
}

export interface PlayerProficiency {
  coding_skill: number;
  soft_skill: number;
  critical_thinking_skill: number; // Added to match Quest definition
  problem_solving: number; // Renamed from reliability_skill if needed, or mapped
  stress_resistance: number;

}

export interface GitHubInfo {
  github_id: string;
  avatar_url: string;
  github_email: string;
}

export interface CareerRun {
  runNumber: number;
  startLevel: number;
  maxLevelAchieved: number;
  totalExperience: number;
  monthsWorked: number;
  reasonForEnd?: 'fired' | 'quit' | 'active';
  endDate?: string;
}

// ============================================================
// SHOP ITEMS & INVENTORY
// ============================================================
// Note: Shop items are hardcoded in /data/shopItems.ts

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'consumable' | 'permanent-buff';
  effect: ItemEffect;
  price: number;
  icon: string;
}

export interface ItemEffect {
  stressReduction?: number;
  moodIncrease?: number;
  expBoost?: number; // Percentage
  currencyBoost?: number; // Percentage
  paidLeaves?: number;
  duration?: number; // Minutes for temporary buffs
}

export interface InventoryItem {
  item: ShopItem;
  quantity: number;
  purchasedAt: number;
}

// ============================================================
// BUFFS & EFFECTS
// ============================================================

export interface Buff {
  itemId: string;
  name: string;
  effect: ItemEffect;
  expiresAt?: number;
}

export interface ActiveBuff {
  stressReduction?: number;
  moodIncrease?: number;
  expBoost?: number; 
  currencyBoost?: number; 
}

// ============================================================
// MONTHLY PERFORMANCE
// ============================================================

export interface MonthlyReport {
  month: number;
  taskCompletionRate: number; // 0-100
  codeQualityScore: number; // 0-100
  softSkillScore: number; // 0-100
  reputationScore: number; // Weighted average
  salaryAdjustment: number; // Percentage
  totalEarnings: number;
  warnings: string[];
}

// ============================================================
// GAME CONFIGURATION
// ============================================================

export interface GameConfig {
  startingLevel: number;
  startingCurrency: number;
  startingMood: number;
  startingStress: number;
  startingPaidLeaves: number;
  startingReputation: number;
  baseSalary: number;
  salaryPerLevel: number;
  hoursPerDay: number;
  daysPerMonth: number;
  burnoutMoodThreshold: number;
  maxStressThreshold: number;
  experienceCurve: number; // Multiplier for level progression
  gameOverReputation: number;
  performanceThresholds: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  restartLevelPercentage: number;
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  icon?: string;
}