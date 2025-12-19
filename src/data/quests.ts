import { Quest, QuestChain } from '../types/game';

// Daily Quests
export const DAILY_QUESTS: Omit<Quest, 'id' | 'status' | 'startedAt' | 'completedAt'>[] = [
  {
    title: 'Code Review',
    description: 'Review the pull requests submitted by your teammates',
    zone: 'workspace',
    frequency: 'daily',
    skillCategory: 'technical',
    difficulty: 2,
    expReward: 50,
    currencyReward: 30,
    stressImpact: 15,
    moodImpact: -5,
    deadline: 4,
    assignedBy: 'manager-alex',
  },
  {
    title: 'Daily Standup',
    description: 'Participate in the daily team standup meeting',
    zone: 'meeting-room',
    frequency: 'daily',
    skillCategory: 'soft-skills',
    difficulty: 1,
    expReward: 30,
    currencyReward: 20,
    stressImpact: 5,
    moodImpact: 5,
    deadline: 2,
    timeLimit: 300,
    assignedBy: 'hr-sarah',
  },
  {
    title: 'Logic Warm-up',
    description: 'Complete 3 quick logic puzzles to start your day fresh',
    zone: 'game-lounge',
    frequency: 'daily',
    skillCategory: 'critical-thinking',
    difficulty: 1,
    expReward: 40,
    currencyReward: 15,
    stressImpact: -10,
    moodImpact: 15,
    deadline: 3,
    assignedBy: 'games-coordinator',
  },
  {
    title: 'Bug Fix',
    description: 'Identify and fix a critical bug in the production code',
    zone: 'workspace',
    frequency: 'daily',
    skillCategory: 'technical',
    difficulty: 3,
    expReward: 80,
    currencyReward: 50,
    stressImpact: 25,
    moodImpact: -10,
    deadline: 6,
    assignedBy: 'lead-marcus',
  },
  {
    title: 'Email Response',
    description: 'Respond to important emails with proper grammar and tone',
    zone: 'meeting-room',
    frequency: 'daily',
    skillCategory: 'soft-skills',
    difficulty: 2,
    expReward: 45,
    currencyReward: 25,
    stressImpact: 10,
    moodImpact: 0,
    deadline: 3,
    timeLimit: 600,
    assignedBy: 'hr-sarah',
  },
  {
    title: 'API Integration',
    description: 'Integrate a third-party API into the existing codebase',
    zone: 'workspace',
    frequency: 'daily',
    skillCategory: 'technical',
    difficulty: 3,
    expReward: 70,
    currencyReward: 45,
    stressImpact: 20,
    moodImpact: -8,
    deadline: 5,
    assignedBy: 'lead-marcus',
  },
  {
    title: 'Unit Tests',
    description: 'Write comprehensive unit tests for recent code changes',
    zone: 'workspace',
    frequency: 'daily',
    skillCategory: 'technical',
    difficulty: 2,
    expReward: 55,
    currencyReward: 35,
    stressImpact: 12,
    moodImpact: -3,
    deadline: 4,
    assignedBy: 'manager-alex',
  },
  {
    title: 'Database Query Optimization',
    description: 'Optimize slow database queries affecting performance',
    zone: 'workspace',
    frequency: 'daily',
    skillCategory: 'technical',
    difficulty: 4,
    expReward: 95,
    currencyReward: 60,
    stressImpact: 30,
    moodImpact: -12,
    deadline: 6,
    assignedBy: 'lead-marcus',
  },
];

// Weekly Quests
export const WEEKLY_QUESTS: Omit<Quest, 'id' | 'status' | 'startedAt' | 'completedAt'>[] = [
  {
    title: 'Feature Implementation',
    description: 'Implement a new feature from the product backlog',
    zone: 'workspace',
    frequency: 'weekly',
    skillCategory: 'technical',
    difficulty: 4,
    expReward: 200,
    currencyReward: 150,
    stressImpact: 40,
    moodImpact: -15,
    deadline: 48,
    assignedBy: 'manager-alex',
  },
  {
    title: 'Team Presentation',
    description: 'Prepare and deliver a presentation to the team',
    zone: 'meeting-room',
    frequency: 'weekly',
    skillCategory: 'soft-skills',
    difficulty: 3,
    expReward: 150,
    currencyReward: 100,
    stressImpact: 30,
    moodImpact: 10,
    deadline: 36,
    timeLimit: 900,
    assignedBy: 'hr-sarah',
  },
  {
    title: 'Algorithm Challenge',
    description: 'Solve a complex algorithmic problem',
    zone: 'game-lounge',
    frequency: 'weekly',
    skillCategory: 'critical-thinking',
    difficulty: 4,
    expReward: 180,
    currencyReward: 80,
    stressImpact: -20,
    moodImpact: 25,
    deadline: 40,
    assignedBy: 'games-coordinator',
  },
  {
    title: 'Code Refactoring',
    description: 'Refactor legacy code to improve maintainability',
    zone: 'workspace',
    frequency: 'weekly',
    skillCategory: 'technical',
    difficulty: 3,
    expReward: 160,
    currencyReward: 120,
    stressImpact: 35,
    moodImpact: -5,
    deadline: 32,
    assignedBy: 'lead-marcus',
  },
  {
    title: 'Professional Development',
    description: 'Complete a typing speed and grammar assessment',
    zone: 'meeting-room',
    frequency: 'weekly',
    skillCategory: 'soft-skills',
    difficulty: 2,
    expReward: 120,
    currencyReward: 70,
    stressImpact: 20,
    moodImpact: 5,
    deadline: 24,
    timeLimit: 1200,
    assignedBy: 'hr-sarah',
  },
  {
    title: 'Security Audit',
    description: 'Conduct a comprehensive security audit of the application',
    zone: 'workspace',
    frequency: 'weekly',
    skillCategory: 'technical',
    difficulty: 4,
    expReward: 190,
    currencyReward: 140,
    stressImpact: 38,
    moodImpact: -12,
    deadline: 40,
    assignedBy: 'manager-alex',
  },
  {
    title: 'Architecture Design',
    description: 'Design the system architecture for an upcoming project',
    zone: 'workspace',
    frequency: 'weekly',
    skillCategory: 'technical',
    difficulty: 5,
    expReward: 220,
    currencyReward: 170,
    stressImpact: 45,
    moodImpact: -18,
    deadline: 56,
    assignedBy: 'lead-marcus',
  },
  {
    title: 'Performance Testing',
    description: 'Run performance tests and identify bottlenecks',
    zone: 'workspace',
    frequency: 'weekly',
    skillCategory: 'technical',
    difficulty: 3,
    expReward: 145,
    currencyReward: 110,
    stressImpact: 28,
    moodImpact: -8,
    deadline: 30,
    assignedBy: 'manager-alex',
  },
];

// Monthly Quests
export const MONTHLY_QUESTS: Omit<Quest, 'id' | 'status' | 'startedAt' | 'completedAt'>[] = [
  {
    title: 'Major Release',
    description: 'Complete and deploy a major feature release',
    zone: 'workspace',
    frequency: 'monthly',
    skillCategory: 'technical',
    difficulty: 5,
    expReward: 500,
    currencyReward: 400,
    stressImpact: 60,
    moodImpact: -25,
    deadline: 160,
    assignedBy: 'manager-alex',
    isInterconnected: true,
  },
  {
    title: 'Quarterly Review',
    description: 'Prepare and present your quarterly performance review',
    zone: 'meeting-room',
    frequency: 'monthly',
    skillCategory: 'soft-skills',
    difficulty: 4,
    expReward: 350,
    currencyReward: 250,
    stressImpact: 45,
    moodImpact: 15,
    deadline: 120,
    timeLimit: 1800,
    assignedBy: 'hr-sarah',
  },
  {
    title: 'Innovation Sprint',
    description: 'Participate in the monthly innovation challenge',
    zone: 'game-lounge',
    frequency: 'monthly',
    skillCategory: 'critical-thinking',
    difficulty: 5,
    expReward: 400,
    currencyReward: 200,
    stressImpact: -30,
    moodImpact: 40,
    deadline: 140,
    assignedBy: 'games-coordinator',
  },
];

// Interconnected Quest Chains
export const QUEST_CHAINS: QuestChain[] = [
  {
    id: 'feature-deployment-chain',
    title: 'Complete Feature Deployment',
    description: 'A multi-zone quest chain simulating a real feature deployment workflow',
    totalExpReward: 800,
    totalCurrencyReward: 600,
    chainBonus: 200,
    quests: [
      {
        id: 'chain-1-code',
        title: 'Write Feature Code',
        description: 'Implement the core functionality for the new feature',
        zone: 'workspace',
        frequency: 'weekly',
        skillCategory: 'technical',
        difficulty: 4,
        expReward: 250,
        currencyReward: 200,
        stressImpact: 35,
        moodImpact: -10,
        deadline: 48,
        assignedBy: 'manager-alex',
        status: 'available',
        isInterconnected: true,
        connectedQuestIds: ['chain-1-optimize', 'chain-1-present'],
      },
      {
        id: 'chain-1-optimize',
        title: 'Optimize Performance',
        description: 'Use logical thinking to optimize the feature performance',
        zone: 'game-lounge',
        frequency: 'weekly',
        skillCategory: 'critical-thinking',
        difficulty: 3,
        expReward: 200,
        currencyReward: 150,
        stressImpact: -15,
        moodImpact: 20,
        deadline: 24,
        assignedBy: 'games-coordinator',
        status: 'available',
        isInterconnected: true,
        connectedQuestIds: ['chain-1-code', 'chain-1-present'],
        requirements: [{ type: 'quest-completion', value: 'chain-1-code' }],
      },
      {
        id: 'chain-1-present',
        title: 'Feature Presentation',
        description: 'Present the completed feature to stakeholders',
        zone: 'meeting-room',
        frequency: 'weekly',
        skillCategory: 'soft-skills',
        difficulty: 3,
        expReward: 150,
        currencyReward: 100,
        stressImpact: 25,
        moodImpact: 15,
        deadline: 12,
        timeLimit: 900,
        assignedBy: 'hr-sarah',
        status: 'available',
        isInterconnected: true,
        connectedQuestIds: ['chain-1-code', 'chain-1-optimize'],
        requirements: [
          { type: 'quest-completion', value: 'chain-1-code' },
          { type: 'quest-completion', value: 'chain-1-optimize' },
        ],
      },
    ],
  },
];

// Helper function to generate quest with unique ID
export function generateQuest(
  template: Omit<Quest, 'id' | 'status' | 'startedAt' | 'completedAt'>,
  suffix?: string
): Quest {
  // Convert deadline from hours to a future timestamp
  const deadlineTimestamp = Date.now() + (template.deadline * 60 * 60 * 1000);
  
  return {
    ...template,
    id: `${template.frequency}-${template.zone}-${Date.now()}${suffix || ''}`,
    status: 'available',
    deadline: deadlineTimestamp, // Convert to timestamp
  };
}

// Get random quests for a frequency
export function getRandomQuests(frequency: QuestFrequency, count: number): Quest[] {
  let pool: Omit<Quest, 'id' | 'status' | 'startedAt' | 'completedAt'>[] = [];
  
  switch (frequency) {
    case 'daily':
      pool = DAILY_QUESTS;
      break;
    case 'weekly':
      pool = WEEKLY_QUESTS;
      break;
    case 'monthly':
      pool = MONTHLY_QUESTS;
      break;
  }
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q, i) => generateQuest(q, `-${i}`));
}

// Helper to convert difficulty number to label
export function getDifficultyLabel(difficulty: number): string {
  if (difficulty <= 2) return 'Easy';
  if (difficulty <= 3) return 'Medium';
  return 'Hard';
}