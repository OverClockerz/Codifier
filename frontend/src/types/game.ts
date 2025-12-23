// Core Game Types for Office - A Gamified Career Simulation

export type ZoneType = 'workspace' | 'game-lounge' | 'meeting-room' | 'cafeteria';
export type QuestFrequency = 'daily' | 'weekly' | 'monthly';
export type QuestStatus = 'available' | 'in-progress' | 'completed' | 'failed';
export type SkillCategory = 'technical' | 'critical-thinking' | 'soft-skills';
export type NotificationType = 'quest' | 'salary' | 'bonus' | 'buff' | 'warning' | 'achievement';

// ============================================================
// QUEST SYSTEM
// ============================================================
// Note: Quests are fetched from the backend, not hardcoded
// See /services/api.ts for quest fetching functions

export interface Quest {
  id: string;
  title: string;
  description: string;
  zone: ZoneType;
  frequency: 'daily' | 'weekly' | 'monthly';
  skillCategory: SkillCategory;
  difficulty: number; // 1-5
  expReward: number;
  currencyReward: number;
  moodImpact: number;
  stressImpact: number;
  deadline?: number;
  status: 'available' | 'in-progress' | 'completed' | 'failed';
  startedAt?: number;
  completedAt?: number;
  performanceScore?: number; 
  skills?: string[];
  questions?: QuestionData[];
}

export interface QuestionData {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string;
  points: number;
}

// ============================================================
// PLAYER STATE
// ============================================================
// Note: Player data is fetched from and saved to the backend
// See /services/api.ts: fetchPlayerData(), updatePlayerData()

export interface PlayerState {
  // id: string;
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
  lastLoginDate: string;
  careerHistory: CareerRun[];
  currentRun: CareerRun;
  reputation: number; // Reputation score (-20 to +∞, fired at -20)
  skills: Record<string, number>; // Skill name -> level (0-100)
  activeBuffs: ActiveBuff[]; // Temporary buffs applied
  permanentBuffs: Buff[]; // Permanent buffs acquired
  activeQuests: Quest[]; // IDs of active quests
  completedQuests: Quest[]; // IDs of completed quests
  inventory: InventoryItem[]; // Array of inventory items
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
// Item effects are calculated in frontend but stored in backend

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
  itemId: string;
  name: string;
  effect: ItemEffect;
  appliedAt: number;
  expiresAt?: number;
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
  // startingLevel: number;
  // startingCurrency: number;
  // startingMood: number;
  // startingStress: number;
  // startingPaidLeaves: number;
  // startingReputation: number;
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
// TASK CHALLENGE TYPES (Legacy - not currently used)
// ============================================================

export interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  prompt: string;
  starterCode?: string;
  testCases: TestCase[];
  hints?: string[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface LogicPuzzle {
  id: string;
  title: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: number;
}

export interface TypingChallenge {
  id: string;
  text: string;
  timeLimit: number; // seconds
  minWPM: number;
  minAccuracy: number;
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
