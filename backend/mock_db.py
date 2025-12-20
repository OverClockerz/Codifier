# ============================================================
# MOCK DATABASE - IN-MEMORY MONGODB SIMULATION
# ============================================================
# This simulates a MongoDB database using Python dictionaries
# Replace with actual MongoDB connection for production
# ============================================================

from datetime import datetime, timedelta
from typing import Dict, List, Any
import copy

# ============================================================
# PLAYERS DATABASE
# ============================================================
PLAYERS_DB: Dict[str, Any] = {}

# ============================================================
# GAME CONFIGURATION
# ============================================================
GAME_CONFIG = {
    "zones": {
        "workspace": {
            "id": "workspace",
            "name": "Workspace",
            "description": "Complete technical challenges and improve your programming skills",
            "color": "blue",
            "icon": "code"
        },
        "game-lounge": {
            "id": "game-lounge",
            "name": "Game Lounge",
            "description": "Solve puzzles and enhance your critical thinking abilities",
            "color": "purple",
            "icon": "brain"
        },
        "meeting-room": {
            "id": "meeting-room",
            "name": "Meeting Room",
            "description": "Develop soft skills through team interactions and presentations",
            "color": "green",
            "icon": "users"
        },
        "cafeteria": {
            "id": "cafeteria",
            "name": "Cafeteria",
            "description": "Shop for items and buffs to enhance your performance",
            "color": "yellow",
            "icon": "coffee"
        }
    },
    "levelThresholds": [
        0, 1000, 2500, 4500, 7000, 10000, 13500, 17500, 22000, 27000,
        32500, 38500, 45000, 52000, 59500, 67500, 76000, 85000, 94500, 104500
    ],
    "baseSalaryByLevel": {
        "1": 3000, "5": 5000, "10": 8000, "15": 12000, "20": 18000
    }
}

# ============================================================
# QUESTS DATABASE
# ============================================================
QUESTS_DB = [
    # WORKSPACE QUESTS - Technical Skills
    {
        "id": "quest_ws001",
        "title": "Debug the Payment Gateway",
        "description": "The payment processing system is throwing errors. Identify and fix the critical bugs affecting customer transactions.",
        "zone": "workspace",
        "frequency": "daily",
        "difficulty": 3,
        "expReward": 150,
        "currencyReward": 500,
        "moodImpact": 5,
        "stressImpact": 15,
        "deadline": 86400000,  # 24 hours in milliseconds
        "requirements": [],
        "skills": ["debugging", "problemSolving"],
        "questions": [
            {
                "id": "q1",
                "text": "What's the most common cause of null pointer exceptions?",
                "options": [
                    {"id": "a", "text": "Accessing methods on uninitialized objects"},
                    {"id": "b", "text": "Using wrong variable names"},
                    {"id": "c", "text": "Syntax errors"},
                    {"id": "d", "text": "Import issues"}
                ],
                "correctAnswer": "a",
                "explanation": "Null pointer exceptions occur when you try to access methods or properties on objects that haven't been initialized (null).",
                "skillTested": "debugging",
                "points": 10
            },
            {
                "id": "q2",
                "text": "Which tool is most effective for tracking down memory leaks?",
                "options": [
                    {"id": "a", "text": "Console logging"},
                    {"id": "b", "text": "Profiler tools"},
                    {"id": "c", "text": "Unit tests"},
                    {"id": "d", "text": "Code reviews"}
                ],
                "correctAnswer": "b",
                "explanation": "Profiler tools provide detailed memory usage analysis and can identify objects not being garbage collected.",
                "skillTested": "debugging",
                "points": 10
            },
            {
                "id": "q3",
                "text": "What should you check first when debugging API failures?",
                "options": [
                    {"id": "a", "text": "Frontend rendering code"},
                    {"id": "b", "text": "Database schema"},
                    {"id": "c", "text": "Network requests and response codes"},
                    {"id": "d", "text": "CSS styling"}
                ],
                "correctAnswer": "c",
                "explanation": "Checking network requests and HTTP response codes helps identify if the issue is with connectivity, authentication, or data format.",
                "skillTested": "debugging",
                "points": 10
            }
        ]
    },
    {
        "id": "quest_ws002",
        "title": "Implement REST API Endpoints",
        "description": "Design and implement a set of RESTful API endpoints for the new user management system.",
        "zone": "workspace",
        "frequency": "daily",
        "difficulty": 4,
        "expReward": 200,
        "currencyReward": 750,
        "moodImpact": 8,
        "stressImpact": 20,
        "deadline": 86400000,
        "requirements": [],
        "skills": ["programming", "systemDesign"],
        "questions": [
            {
                "id": "q1",
                "text": "Which HTTP method should be used to update an existing resource?",
                "options": [
                    {"id": "a", "text": "GET"},
                    {"id": "b", "text": "POST"},
                    {"id": "c", "text": "PUT or PATCH"},
                    {"id": "d", "text": "DELETE"}
                ],
                "correctAnswer": "c",
                "explanation": "PUT is used for full updates and PATCH for partial updates of existing resources.",
                "skillTested": "programming",
                "points": 10
            },
            {
                "id": "q2",
                "text": "What HTTP status code indicates successful resource creation?",
                "options": [
                    {"id": "a", "text": "200 OK"},
                    {"id": "b", "text": "201 Created"},
                    {"id": "c", "text": "204 No Content"},
                    {"id": "d", "text": "301 Moved Permanently"}
                ],
                "correctAnswer": "b",
                "explanation": "201 Created indicates that a new resource has been successfully created.",
                "skillTested": "programming",
                "points": 10
            },
            {
                "id": "q3",
                "text": "What's a key principle of RESTful API design?",
                "options": [
                    {"id": "a", "text": "Using only POST requests"},
                    {"id": "b", "text": "Stateless communication"},
                    {"id": "c", "text": "Complex nested routes"},
                    {"id": "d", "text": "Session-based authentication only"}
                ],
                "correctAnswer": "b",
                "explanation": "REST APIs should be stateless, meaning each request contains all information needed to process it.",
                "skillTested": "systemDesign",
                "points": 10
            }
        ]
    },
    {
        "id": "quest_ws003",
        "title": "Database Query Optimization",
        "description": "Optimize slow database queries that are affecting application performance.",
        "zone": "workspace",
        "frequency": "weekly",
        "difficulty": 5,
        "expReward": 300,
        "currencyReward": 1200,
        "moodImpact": 10,
        "stressImpact": 25,
        "deadline": 259200000,  # 3 days
        "requirements": [],
        "skills": ["databases", "problemSolving"],
        "questions": [
            {
                "id": "q1",
                "text": "What's the most effective way to speed up a query on a large table?",
                "options": [
                    {"id": "a", "text": "Add more RAM to the server"},
                    {"id": "b", "text": "Create appropriate indexes"},
                    {"id": "c", "text": "Use SELECT *"},
                    {"id": "d", "text": "Increase timeout duration"}
                ],
                "correctAnswer": "b",
                "explanation": "Indexes dramatically improve query performance by creating efficient lookup structures.",
                "skillTested": "databases",
                "points": 10
            },
            {
                "id": "q2",
                "text": "What does the N+1 query problem refer to?",
                "options": [
                    {"id": "a", "text": "Too many database connections"},
                    {"id": "b", "text": "Making multiple queries when one would suffice"},
                    {"id": "c", "text": "Index fragmentation"},
                    {"id": "d", "text": "Deadlock conditions"}
                ],
                "correctAnswer": "b",
                "explanation": "N+1 occurs when you make 1 query to get items, then N additional queries to get related data for each item.",
                "skillTested": "databases",
                "points": 10
            }
        ]
    },

    # GAME LOUNGE QUESTS - Critical Thinking
    {
        "id": "quest_gl001",
        "title": "Logic Puzzle Challenge",
        "description": "Solve a series of logic puzzles to enhance your analytical reasoning skills.",
        "zone": "game-lounge",
        "frequency": "daily",
        "difficulty": 2,
        "expReward": 100,
        "currencyReward": 300,
        "moodImpact": 10,
        "stressImpact": -5,
        "deadline": 86400000,
        "requirements": [],
        "skills": ["analyticalReasoning", "problemSolving"],
        "questions": [
            {
                "id": "q1",
                "text": "If all Bloops are Razzles and all Razzles are Lazzles, are all Bloops definitely Lazzles?",
                "options": [
                    {"id": "a", "text": "Yes"},
                    {"id": "b", "text": "No"},
                    {"id": "c", "text": "Only sometimes"},
                    {"id": "d", "text": "Cannot be determined"}
                ],
                "correctAnswer": "a",
                "explanation": "This is a transitive property: if A→B and B→C, then A→C. All Bloops must be Lazzles.",
                "skillTested": "analyticalReasoning",
                "points": 10
            },
            {
                "id": "q2",
                "text": "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
                "options": [
                    {"id": "a", "text": "36"},
                    {"id": "b", "text": "40"},
                    {"id": "c", "text": "42"},
                    {"id": "d", "text": "48"}
                ],
                "correctAnswer": "c",
                "explanation": "Pattern: n×(n+1) where n increases. Next is 6×7=42.",
                "skillTested": "analyticalReasoning",
                "points": 10
            },
            {
                "id": "q3",
                "text": "Three switches control three bulbs in another room. You can flip switches, then check bulbs once. How do you determine which switch controls which bulb?",
                "options": [
                    {"id": "a", "text": "Flip all switches at once"},
                    {"id": "b", "text": "Turn on switch 1, wait, turn off, turn on switch 2, check bulbs"},
                    {"id": "c", "text": "It's impossible"},
                    {"id": "d", "text": "Use trial and error"}
                ],
                "correctAnswer": "b",
                "explanation": "Hot bulb = switch 1 (was on), lit bulb = switch 2 (currently on), cold off bulb = switch 3.",
                "skillTested": "problemSolving",
                "points": 10
            }
        ]
    },
    {
        "id": "quest_gl002",
        "title": "Strategic Planning Exercise",
        "description": "Develop a strategic plan for optimizing team productivity and resource allocation.",
        "zone": "game-lounge",
        "frequency": "weekly",
        "difficulty": 4,
        "expReward": 250,
        "currencyReward": 900,
        "moodImpact": 12,
        "stressImpact": 10,
        "deadline": 259200000,
        "requirements": [],
        "skills": ["strategicPlanning", "decisionMaking"],
        "questions": [
            {
                "id": "q1",
                "text": "When prioritizing tasks, which framework is most effective?",
                "options": [
                    {"id": "a", "text": "Alphabetical order"},
                    {"id": "b", "text": "Eisenhower Matrix (Urgent/Important)"},
                    {"id": "c", "text": "Random selection"},
                    {"id": "d", "text": "Longest tasks first"}
                ],
                "correctAnswer": "b",
                "explanation": "The Eisenhower Matrix helps categorize tasks by urgency and importance for optimal prioritization.",
                "skillTested": "strategicPlanning",
                "points": 10
            },
            {
                "id": "q2",
                "text": "What's the primary goal of resource allocation in project management?",
                "options": [
                    {"id": "a", "text": "Using all available resources"},
                    {"id": "b", "text": "Maximizing efficiency and ROI"},
                    {"id": "c", "text": "Keeping everyone equally busy"},
                    {"id": "d", "text": "Minimizing meetings"}
                ],
                "correctAnswer": "b",
                "explanation": "Effective resource allocation focuses on maximizing efficiency and return on investment.",
                "skillTested": "strategicPlanning",
                "points": 10
            }
        ]
    },

    # MEETING ROOM QUESTS - Soft Skills
    {
        "id": "quest_mr001",
        "title": "Team Presentation Prep",
        "description": "Prepare and deliver a compelling presentation to stakeholders about the new project initiative.",
        "zone": "meeting-room",
        "frequency": "daily",
        "difficulty": 3,
        "expReward": 120,
        "currencyReward": 400,
        "moodImpact": 8,
        "stressImpact": 12,
        "deadline": 86400000,
        "requirements": [],
        "skills": ["communication", "leadership"],
        "questions": [
            {
                "id": "q1",
                "text": "What's the most important element of an effective presentation?",
                "options": [
                    {"id": "a", "text": "Lots of text on slides"},
                    {"id": "b", "text": "Clear structure and storytelling"},
                    {"id": "c", "text": "Complex animations"},
                    {"id": "d", "text": "Technical jargon"}
                ],
                "correctAnswer": "b",
                "explanation": "Clear structure and compelling storytelling engage audiences and make information memorable.",
                "skillTested": "communication",
                "points": 10
            },
            {
                "id": "q2",
                "text": "How should you handle difficult questions during a presentation?",
                "options": [
                    {"id": "a", "text": "Ignore them"},
                    {"id": "b", "text": "Get defensive"},
                    {"id": "c", "text": "Acknowledge, clarify, and respond thoughtfully"},
                    {"id": "d", "text": "Change the topic"}
                ],
                "correctAnswer": "c",
                "explanation": "Professional handling of questions shows confidence and builds credibility.",
                "skillTested": "communication",
                "points": 10
            },
            {
                "id": "q3",
                "text": "What's a key principle of effective team communication?",
                "options": [
                    {"id": "a", "text": "Only communicate when necessary"},
                    {"id": "b", "text": "Active listening and clear feedback"},
                    {"id": "c", "text": "Avoid disagreements"},
                    {"id": "d", "text": "Always agree with superiors"}
                ],
                "correctAnswer": "b",
                "explanation": "Active listening and clear feedback ensure mutual understanding and productive collaboration.",
                "skillTested": "communication",
                "points": 10
            }
        ]
    },
    {
        "id": "quest_mr002",
        "title": "Conflict Resolution Workshop",
        "description": "Navigate a challenging team conflict and find a solution that satisfies all parties.",
        "zone": "meeting-room",
        "frequency": "weekly",
        "difficulty": 4,
        "expReward": 220,
        "currencyReward": 800,
        "moodImpact": 15,
        "stressImpact": 18,
        "deadline": 259200000,
        "requirements": [],
        "skills": ["emotionalIntelligence", "teamwork"],
        "questions": [
            {
                "id": "q1",
                "text": "What's the first step in resolving workplace conflicts?",
                "options": [
                    {"id": "a", "text": "Take sides immediately"},
                    {"id": "b", "text": "Understand all perspectives"},
                    {"id": "c", "text": "Escalate to management"},
                    {"id": "d", "text": "Ignore it and hope it resolves"}
                ],
                "correctAnswer": "b",
                "explanation": "Understanding all perspectives is crucial before attempting resolution strategies.",
                "skillTested": "emotionalIntelligence",
                "points": 10
            },
            {
                "id": "q2",
                "text": "Which approach is most effective for team collaboration?",
                "options": [
                    {"id": "a", "text": "Competitive goal-setting"},
                    {"id": "b", "text": "Individual accountability only"},
                    {"id": "c", "text": "Shared goals and mutual support"},
                    {"id": "d", "text": "Strict hierarchy"}
                ],
                "correctAnswer": "c",
                "explanation": "Shared goals and mutual support foster collaboration and team cohesion.",
                "skillTested": "teamwork",
                "points": 10
            }
        ]
    },
    {
        "id": "quest_mr003",
        "title": "Time Management Masterclass",
        "description": "Learn and implement advanced time management techniques to boost productivity.",
        "zone": "meeting-room",
        "frequency": "daily",
        "difficulty": 2,
        "expReward": 100,
        "currencyReward": 350,
        "moodImpact": 7,
        "stressImpact": -8,
        "deadline": 86400000,
        "requirements": [],
        "skills": ["timeManagement", "decisionMaking"],
        "questions": [
            {
                "id": "q1",
                "text": "What is the Pomodoro Technique?",
                "options": [
                    {"id": "a", "text": "A cooking method"},
                    {"id": "b", "text": "25-minute focused work intervals with breaks"},
                    {"id": "c", "text": "A project management framework"},
                    {"id": "d", "text": "A meeting scheduling system"}
                ],
                "correctAnswer": "b",
                "explanation": "The Pomodoro Technique uses 25-minute focused work sessions followed by short breaks.",
                "skillTested": "timeManagement",
                "points": 10
            },
            {
                "id": "q2",
                "text": "How should you handle interruptions during deep work?",
                "options": [
                    {"id": "a", "text": "Drop everything immediately"},
                    {"id": "b", "text": "Set boundaries and schedule time for interruptions"},
                    {"id": "c", "text": "Ignore all communications"},
                    {"id": "d", "text": "Work in secret"}
                ],
                "correctAnswer": "b",
                "explanation": "Setting boundaries while remaining accessible maintains productivity and collaboration.",
                "skillTested": "timeManagement",
                "points": 10
            }
        ]
    }
]

# ============================================================
# SHOP ITEMS DATABASE
# ============================================================
SHOP_ITEMS_DB = [
    {
        "id": "coffee",
        "name": "Premium Coffee",
        "description": "Reduces stress by 10 points and boosts focus",
        "type": "consumable",
        "price": 250,
        "icon": "coffee",
        "effect": {
            "stressReduction": 10,
            "moodIncrease": 5
        }
    },
    {
        "id": "energy_drink",
        "name": "Energy Drink",
        "description": "Instantly reduces stress by 15 points",
        "type": "consumable",
        "price": 350,
        "icon": "zap",
        "effect": {
            "stressReduction": 15,
            "moodIncrease": 3
        }
    },
    {
        "id": "meditation_app",
        "name": "Meditation App Subscription",
        "description": "Reduces stress by 20 points and increases mood by 10",
        "type": "consumable",
        "price": 500,
        "icon": "heart",
        "effect": {
            "stressReduction": 20,
            "moodIncrease": 10
        }
    },
    {
        "id": "gym_membership",
        "name": "Gym Membership",
        "description": "Major mood boost (+15) and stress relief (-15)",
        "type": "consumable",
        "price": 800,
        "icon": "dumbbell",
        "effect": {
            "stressReduction": 15,
            "moodIncrease": 15
        }
    },
    {
        "id": "paid_leave",
        "name": "Extra Paid Leave",
        "description": "Adds 1 extra paid leave day to your balance",
        "type": "consumable",
        "price": 1000,
        "icon": "calendar",
        "effect": {
            "paidLeaves": 1
        }
    },
    {
        "id": "productivity_master",
        "name": "Productivity Master",
        "description": "Permanent 10% XP boost on all completed quests",
        "type": "permanent-buff",
        "price": 5000,
        "icon": "trending-up",
        "effect": {
            "expBoost": 10
        }
    },
    {
        "id": "focus_enhancer",
        "name": "Focus Enhancer",
        "description": "Permanent 15% reduction in stress impact from quests",
        "type": "permanent-buff",
        "price": 6000,
        "icon": "target",
        "effect": {
            "stressReduction": 15
        }
    },
    {
        "id": "negotiation_expert",
        "name": "Negotiation Expert",
        "description": "Permanent 10% currency bonus on all quest rewards",
        "type": "permanent-buff",
        "price": 7500,
        "icon": "dollar-sign",
        "effect": {
            "currencyBoost": 10
        }
    }
]

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_player_by_email(email: str):
    """Get player from mock DB by email"""
    return PLAYERS_DB.get(email)

def create_new_player(username: str, email: str, avatar: str, github_id: int):
    """Create a new player with default stats"""
    player_data = {
        "id": f"player_{github_id}",
        "username": username,
        "email": email,
        "avatar": avatar,
        "githubId": github_id,
        "createdAt": datetime.utcnow().isoformat(),
        "lastLoginDate": datetime.utcnow().isoformat(),
        
        # Game Stats
        "level": 1,
        "experience": 0,
        "experienceToNextLevel": 1000,
        "currency": 500,
        "mood": 80,
        "stress": 20,
        "isBurntOut": False,
        "baseSalary": 3000,
        "currentMonthEarnings": 0,
        "currentMonthTasksCompleted": 0,
        "paidLeaves": 5,
        "currentDay": 1,
        "currentMonth": 1,
        "reputation": 75,
        
        # Skills
        "skills": {
            "technical": {
                "programming": 20,
                "debugging": 15,
                "systemDesign": 10,
                "testing": 15,
                "databases": 10
            },
            "criticalThinking": {
                "problemSolving": 20,
                "analyticalReasoning": 15,
                "strategicPlanning": 10,
                "decisionMaking": 15
            },
            "softSkills": {
                "communication": 20,
                "teamwork": 20,
                "leadership": 10,
                "timeManagement": 15,
                "emotionalIntelligence": 15
            }
        },
        
        # Collections
        "permanentBuffs": [],
        "inventory": [],
        "activeQuests": [],
        "completedQuests": [],
        "notifications": [
            {
                "id": "notif_welcome",
                "type": "achievement",
                "title": "Welcome to OFFICE!",
                "message": "Your career simulation begins now. Complete quests to level up!",
                "timestamp": int(datetime.utcnow().timestamp() * 1000),
                "read": False,
                "priority": "high"
            }
        ],
        
        # Career History
        "currentRun": {
            "runNumber": 1,
            "startLevel": 1,
            "maxLevelAchieved": 1,
            "totalExperience": 0,
            "monthsWorked": 1,
            "reasonForEnd": None,
            "endDate": None
        },
        "careerHistory": []
    }
    
    PLAYERS_DB[email] = player_data
    return player_data

def update_player(email: str, updates: dict):
    """Update player data"""
    if email in PLAYERS_DB:
        PLAYERS_DB[email].update(updates)
        return PLAYERS_DB[email]
    return None

def get_all_quests():
    """Get all available quests"""
    return copy.deepcopy(QUESTS_DB)

def get_quests_by_zone(zone: str):
    """Get quests filtered by zone"""
    return [q for q in copy.deepcopy(QUESTS_DB) if q["zone"] == zone]

def get_quest_by_id(quest_id: str):
    """Get a specific quest by ID"""
    for quest in QUESTS_DB:
        if quest["id"] == quest_id:
            return copy.deepcopy(quest)
    return None

def get_all_shop_items():
    """Get all shop items"""
    return copy.deepcopy(SHOP_ITEMS_DB)

def get_shop_item_by_id(item_id: str):
    """Get a specific shop item"""
    for item in SHOP_ITEMS_DB:
        if item["id"] == item_id:
            return copy.deepcopy(item)
    return None

# ============================================================
# DATABASE RESET (for testing)
# ============================================================
def reset_database():
    """Reset the entire database"""
    global PLAYERS_DB
    PLAYERS_DB = {}
    print("🔄 Mock database reset")