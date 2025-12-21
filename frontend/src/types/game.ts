// Core Game Types for Office - A Gamified Career Simulation

export type ZoneType = 'workspace' | 'game-lounge' | 'meeting-room' | 'cafeteria';
export type QuestFrequency = 'daily' | 'weekly' | 'monthly';
export type QuestStatus = 'available' | 'in-progress' | 'completed' | 'failed';
export type SkillCategory = 'technical' | 'critical-thinking' | 'soft-skills';
export type NotificationType = 'quest' | 'salary' | 'bonus' | 'buff' | 'warning' | 'achievement';

// Quest System
export interface Quest {
  id: string;
  title: string;
  description: string;
  zone: ZoneType;
  frequency: QuestFrequency;
  difficulty: number; 
  expReward: number;
  currencyReward: number;
  moodImpact: number;
  stressImpact: number;
  deadline?: number;
  status: QuestStatus;
  startedAt?: number;
  completedAt?: number;
  requirements?: QuestRequirement[];
  skills?: string[]; 
}

export interface QuestRequirement {
  type: 'skill-level' | 'quest-completion' | 'item';
  value: string | number;
}

// Interconnected Quest Chain
export interface QuestChain {
  id: string;
  title: string;
  description: string;
  quests: Quest[];
  totalExpReward: number;
  totalCurrencyReward: number;
  chainBonus: number; // Extra reward for completing all
}

// Items & Shop
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

// Player State
export interface PlayerState {
  id: string;
  username: string;
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
  reputation: number; // Reputation score
  skills: Record<string, number>; // Skill name -> level (0-100)
  permanentBuffs: string[]; // IDs of purchased permanent buffs
  
  // These fields are populated from the backend mock DB
  activeQuests?: Quest[];
  completedQuests?: Quest[];
  inventory?: InventoryItem[];
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

// NPCs
export interface NPC {
  id: string;
  name: string;
  role: string;
  avatar: string;
  zone: ZoneType;
  dialogues: Dialogue[];
}

export interface Dialogue {
  id: string;
  text: string;
  context: 'greeting' | 'quest-assign' | 'quest-complete' | 'warning' | 'fired';
}

// Monthly Performance
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

// Game Configuration
export interface GameConfig {
  startingLevel: number;
  startingCurrency: number;
  startingMood: number;
  startingStress: number;
  startingPaidLeaves: number;
  baseSalary: number;
  hoursPerDay: number;
  daysPerMonth: number;
  burnoutMoodThreshold: number;
  maxStressThreshold: number;
  experienceCurve: number; // Multiplier for level progression
}

// Task Challenge Types
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

// Active Buffs
export interface ActiveBuff {
  itemId: string;
  name: string;
  effect: ItemEffect;
  appliedAt: number;
  expiresAt?: number;
}

// Notifications
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  icon?: string;
}