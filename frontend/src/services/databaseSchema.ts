// /**
//  * DATABASE SCHEMA FOR "OFFICE" GAME
//  * ==================================
//  * This file defines the complete database schema structure that should be used
//  * by the backend to store player data, quests, and game state.
//  * 
//  * This schema is the single source of truth for what data should be stored
//  * in your backend database and what format it should follow.
//  */

// /**
//  * PLAYER DATABASE SCHEMA
//  * ----------------------
//  * This represents the complete player document/record in your database.
//  * The backend should store one document per player, keyed by their GitHub ID.
//  */
// export interface PlayerDatabaseSchema {
//   // ============================================================
//   // AUTHENTICATION & USER INFO
//   // ============================================================
//   username: string; // Player's chosen username
//   githubinfo: {
//     github_id: string; // Unique GitHub user ID (use this as primary key)
//     avatar_url: string; // GitHub profile picture URL
//     github_email: string; // GitHub email address
//     github_username?: string; // GitHub username (handle) - optional
//   };

//   // ============================================================
//   // LEVEL & PROGRESSION
//   // ============================================================
//   level: number; // Current player level (starts at 1)
//   experience: number; // Current XP in this level
//   experienceToNextLevel: number; // XP required to reach next level
//   currency: number; // In-game money (Office Coins)

//   // ============================================================
//   // MOOD & STRESS SYSTEM (0-100 scale)
//   // ============================================================
//   mood: number; // Current mood level (0-100)
//   stress: number; // Current stress level (0-100)
//   isBurntOut: boolean; // True if mood drops below threshold

//   // ============================================================
//   // SALARY & EARNINGS
//   // ============================================================
//   baseSalary: number; // Base monthly salary
//   currentMonthEarnings: number; // Earnings accumulated this month
//   currentMonthTasksCompleted: number; // Number of quests completed this month
//   paidLeaves: number; // Available paid leave days

//   // ============================================================
//   // TIME & DATE TRACKING
//   // ============================================================
//   currentDay: number; // In-game day counter (increments with each play session)
//   currentMonth: number; // In-game month number
//   lastLoginDate: string; // ISO timestamp of last login (e.g., "2025-12-21T10:30:00Z")
//   createdAt: string; // ISO timestamp of account creation

//   // ============================================================
//   // CAREER HISTORY & RUNS
//   // ============================================================
//   careerHistory: Array<{
//     runNumber: number; // Which career run (1st job, 2nd job, etc.)
//     startLevel: number; // Level when this run started
//     maxLevelAchieved: number; // Highest level reached in this run
//     totalExperience: number; // Total XP earned in this run
//     monthsWorked: number; // Number of months in this job
//     reasonForEnd: 'fired' | 'quit' | 'active'; // How this run ended
//     endDate?: string; // ISO timestamp when this run ended
//   }>;

//   currentRun: {
//     runNumber: number;
//     startLevel: number;
//     maxLevelAchieved: number;
//     totalExperience: number;
//     monthsWorked: number;
//     reasonForEnd: 'active' | 'fired' | 'quit';
//   };

//   // ============================================================
//   // REPUTATION SYSTEM
//   // ============================================================
//   reputation: number; // Reputation score (-20 to +∞, fired at -20)

//   // ============================================================
//   // SKILLS SYSTEM
//   // ============================================================
//   // Key-value pairs where key is skill name, value is skill level (0-100)
//   // Example: { "python": 45, "git": 30, "communication": 50 }
//   skills: Record<string, number>;

//   // ============================================================
//   // PERMANENT BUFFS & ITEMS
//   // ============================================================
//   // Array of permanent item IDs that the player owns
//   // These items provide permanent passive bonuses
//   permanentItems: string[];

//   // ============================================================
//   // ACTIVE BUFFS (Temporary Effects)
//   // ============================================================
//   activeBuffs: Array<{
//     itemId: string; // ID of the item that created this buff
//     name: string; // Display name of the buff
//     effect: {
//       stressReduction?: number; // Percentage stress reduction
//       moodIncrease?: number; // Percentage mood increase
//       expBoost?: number; // Percentage XP boost
//       currencyBoost?: number; // Percentage currency boost
//       paidLeaves?: number; // Number of paid leaves added
//       duration?: number; // Duration in minutes (undefined = permanent)
//     };
//     appliedAt: number; // Unix timestamp when buff was applied
//     expiresAt?: number; // Unix timestamp when buff expires (undefined = permanent)
//   }>;

//   // ============================================================
//   // QUEST MANAGEMENT
//   // ============================================================
//   // Active quests are quests currently available or in-progress
//   activeQuests: Array<{
//     id: string; // Unique quest ID
//     title: string;
//     description: string;
//     zone: 'workspace' | 'game-lounge' | 'meeting-room' | 'cafeteria';
//     frequency: 'daily' | 'weekly' | 'monthly';
//     difficulty: number; // 1-5 scale
//     expReward: number; // Base XP reward
//     currencyReward: number; // Base currency reward
//     moodImpact: number; // Mood change on completion
//     stressImpact: number; // Stress change on completion
//     deadline?: number; // Unix timestamp deadline (optional)
//     status: 'available' | 'in-progress' | 'completed' | 'failed';
//     startedAt?: number; // Unix timestamp when quest started
//     completedAt?: number; // Unix timestamp when quest completed/failed
//     performanceScore?: number; // Score achieved (0-100)
//     skills?: string[]; // Skills that can be gained from this quest
    
//     // Quest content (for interactive quests)
//     questions?: Array<{
//       id: string;
//       question: string;
//       options: string[];
//       correctAnswer: number; // Index of correct option
//       explanation?: string;
//       points: number;
//     }>;
//   }>;

//   // Completed quests history (for analytics and tracking)
//   completedQuests: Array<{
//     id: string;
//     title: string;
//     zone: 'workspace' | 'game-lounge' | 'meeting-room' | 'cafeteria';
//     difficulty: number;
//     status: 'completed' | 'failed';
//     completedAt: number; // Unix timestamp
//     performanceScore?: number; // Score achieved (0-100)
//     expGained: number; // Actual XP gained (after multipliers)
//     currencyGained: number; // Actual currency gained (after multipliers)
//   }>;

//   // ============================================================
//   // INVENTORY (Shop Items)
//   // ============================================================
//   // Items that player has purchased but not yet used
//   inventory: Array<{
//     itemId: string; // ID of the shop item
//     itemName: string; // Name of the item
//     itemType: 'consumable' | 'permanent-buff';
//     quantity: number; // How many of this item the player has
//     purchasedAt: number; // Unix timestamp of purchase
//   }>;

//   // ============================================================
//   // NOTIFICATIONS
//   // ============================================================
//   notifications: Array<{
//     id: string;
//     type: 'quest' | 'salary' | 'bonus' | 'buff' | 'warning' | 'achievement';
//     title: string;
//     message: string;
//     timestamp: number; // Unix timestamp
//     isRead: boolean;
//     icon?: string; // Optional emoji or icon
//   }>;

//   // ============================================================
//   // MONTHLY REPORTS (Performance History)
//   // ============================================================
//   monthlyReports: Array<{
//     month: number;
//     taskCompletionRate: number; // Percentage (0-100)
//     codeQualityScore: number; // Score (0-100)
//     softSkillScore: number; // Score (0-100)
//     reputationScore: number; // Calculated reputation score
//     salaryAdjustment: number; // Salary adjustment percentage
//     totalEarnings: number; // Total earned this month
//     warnings: string[]; // Any warnings issued
//   }>;
// }

// /**
//  * QUEST POOL SCHEMA
//  * -----------------
//  * This represents the pool of all available quests in the game.
//  * The backend should maintain a separate collection/table of quest templates
//  * that can be assigned to players.
//  */
// export interface QuestPoolSchema {
//   id: string; // Unique quest template ID
//   title: string;
//   description: string;
//   zone: 'workspace' | 'game-lounge' | 'meeting-room' | 'cafeteria';
//   frequency: 'daily' | 'weekly' | 'monthly';
//   difficulty: number; // 1-5
//   expReward: number;
//   currencyReward: number;
//   moodImpact: number;
//   stressImpact: number;
//   skills?: string[]; // Skills that can be gained
  
//   // Interactive quest content
//   questions?: Array<{
//     id: string;
//     question: string;
//     options: string[];
//     correctAnswer: number; // Index of correct option
//     explanation?: string;
//     points: number;
//   }>;
  
//   // Metadata
//   isActive: boolean; // Whether this quest is currently in the rotation
//   createdAt: string; // When this quest was added
//   updatedAt: string; // Last modification
// }

// /**
//  * EXAMPLE PLAYER DATA
//  * -------------------
//  * This is a complete example of how a player's data should look in the database.
//  * Use this as a reference when implementing your backend.
//  */
// export const EXAMPLE_PLAYER_DATA: PlayerDatabaseSchema = {
//   username: "john_dev",
//   githubInfo: {
//     github_id: "12345678",
//     avatar_url: "https://avatars.githubusercontent.com/u/12345678",
//     github_email: "john@example.com",
//     github_username: "johndev"
//   },
  
//   level: 5,
//   experience: 350,
//   experienceToNextLevel: 500,
//   currency: 2500,
  
//   mood: 70,
//   stress: 30,
//   isBurntOut: false,
  
//   baseSalary: 5000,
//   currentMonthEarnings: 1200,
//   currentMonthTasksCompleted: 8,
//   paidLeaves: 5,
  
//   currentDay: 15,
//   currentMonth: 2,
//   lastLoginDate: "2025-12-21T10:30:00Z",
//   createdAt: "2025-11-01T08:00:00Z",
  
//   careerHistory: [],
  
//   currentRun: {
//     runNumber: 1,
//     startLevel: 1,
//     maxLevelAchieved: 5,
//     totalExperience: 2100,
//     monthsWorked: 2,
//     reasonForEnd: "active"
//   },
  
//   reputation: 5.5,
  
//   skills: {
//     "python": 45,
//     "javascript": 38,
//     "git": 42,
//     "problem_solving": 50,
//     "communication": 35,
//     "teamwork": 40
//   },
  
//   permanentItems: ["meditation-app", "standing-desk"],
  
//   activeBuffs: [
//     {
//       itemId: "energy-drink",
//       name: "Energy Drink",
//       effect: {
//         expBoost: 20,
//         duration: 60
//       },
//       appliedAt: 1703160000000,
//       expiresAt: 1703163600000
//     }
//   ],
  
//   activeQuests: [
//     {
//       id: "quest-001",
//       title: "Database Optimization Task",
//       description: "Optimize the user query performance",
//       zone: "workspace",
//       frequency: "daily",
//       difficulty: 3,
//       expReward: 150,
//       currencyReward: 75,
//       moodImpact: -5,
//       stressImpact: 15,
//       status: "in-progress",
//       startedAt: 1703160000000,
//       skills: ["python", "database"],
//       questions: [
//         {
//           id: "q1",
//           question: "What is the best way to optimize a slow query?",
//           options: ["Add indexes", "Remove indexes", "Delete data", "Restart server"],
//           correctAnswer: 0,
//           explanation: "Adding proper indexes dramatically improves query performance.",
//           points: 50
//         }
//       ]
//     }
//   ],
  
//   completedQuests: [
//     {
//       id: "quest-000",
//       title: "Setup Development Environment",
//       zone: "workspace",
//       difficulty: 1,
//       status: "completed",
//       completedAt: 1703150000000,
//       performanceScore: 95,
//       expGained: 100,
//       currencyGained: 50
//     }
//   ],
  
//   inventory: [
//     {
//       itemId: "coffee",
//       itemName: "Premium Coffee",
//       itemType: "consumable",
//       quantity: 3,
//       purchasedAt: 1703160000000
//     }
//   ],
  
//   notifications: [
//     {
//       id: "notif-001",
//       type: "quest",
//       title: "New Quest Available",
//       message: "A new quest 'Bug Fix Challenge' is now available in the Workspace.",
//       timestamp: 1703160000000,
//       isRead: false,
//       icon: "📋"
//     }
//   ],
  
//   monthlyReports: [
//     {
//       month: 1,
//       taskCompletionRate: 85,
//       codeQualityScore: 78,
//       softSkillScore: 72,
//       reputationScore: 78.5,
//       salaryAdjustment: 5,
//       totalEarnings: 5250,
//       warnings: []
//     }
//   ]
// };

// /**
//  * INITIAL PLAYER DATA TEMPLATE
//  * ----------------------------
//  * Use this template when creating a new player account.
//  * This represents a brand new player with default starting values.
//  */
// export const INITIAL_PLAYER_TEMPLATE = (githubUser: {
//   id: string;
//   username: string;
//   email: string;
//   avatar_url: string;
// }): PlayerDatabaseSchema => ({
//   username: githubUser.username,
//   githubInfo: {
//     github_id: githubUser.id,
//     avatar_url: githubUser.avatar_url,
//     github_email: githubUser.email,
//     github_username: githubUser.username
//   },
  
//   level: 1,
//   experience: 0,
//   experienceToNextLevel: 100,
//   currency: 100,
  
//   mood: 70,
//   stress: 20,
//   isBurntOut: false,
  
//   baseSalary: 3000,
//   currentMonthEarnings: 0,
//   currentMonthTasksCompleted: 0,
//   paidLeaves: 3,
  
//   currentDay: 1,
//   currentMonth: 1,
//   lastLoginDate: new Date().toISOString(),
//   createdAt: new Date().toISOString(),
  
//   careerHistory: [],
  
//   currentRun: {
//     runNumber: 1,
//     startLevel: 1,
//     maxLevelAchieved: 1,
//     totalExperience: 0,
//     monthsWorked: 0,
//     reasonForEnd: "active"
//   },
  
//   reputation: 0,
  
//   skills: {},
  
//   permanentItems: [],
  
//   activeBuffs: [],
  
//   activeQuests: [],
  
//   completedQuests: [],
  
//   inventory: [],
  
//   notifications: [],
  
//   monthlyReports: []
// });
