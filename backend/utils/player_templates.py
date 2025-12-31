from datetime import datetime, timedelta, timezone

IST = timezone(timedelta(hours=5, minutes=30))

InitialPlayerState = {
    "username": "",
    "githubinfo": {
        "github_id": "",
        "avatar_url": "",
        "github_email": ""
    },

    "level": 1,
    "experience": 0,
    "experienceToNextLevel": 100,
    "currency": 100,

    "mood": 70,
    "stress": 20,
    "isBurntOut": False,

    "baseSalary": 1000,
    "currentMonthEarnings": 0,
    "currentMonthTasksCompleted": 0,
    "paidLeaves": 5,

    "gameStartDate": datetime.now(IST),
    "currentDay": 1,
    "currentMonth": 1,
    "lastLoginDate": datetime.now(IST),
    "proficiency": {
        "coding_skill": 0,
        "soft_skill": 0,
        "critical_thinking_skill": 0,
        "problem_solving": 0,
        "stress_resistance": 0,
    },
    "careerHistory": [],

    "currentRun": {
        "runNumber": 1,
        "startLevel": 1,
        "maxLevelAchieved": 1,
        "totalExperience": 0,
        "monthsWorked": 0,
        "reasonForEnd": "active"
    },

    "reputation": 0,

    "skills": {
        "python": 5,
        "git": 3,
        "problem_solving": 5,
        "communication": 4
    },
    "activeBuffs": {
        "stressReduction": 0,
        "moodIncrease": 0,
        "expBoost": 0, 
        "currencyBoost": 0, 
    },
    "permanentItems": [],
    "activeQuests": [],
    "completedQuests": [],
    "inventory": []
}

MCQ_QUEST = {
      "id": "unique-quest-id",
      "title": "Put the quest title here",
      "description": "Put the quest description here",
      "zone": "has to be one of the predefined zones: workspace,meeting-room,game-lounge",
      "frequency": "daily",
      "skillCategory": "technical",
      "difficulty": "on a scale of 1-4",
      "expReward": "within 10-100",
      "proficiency": {
        "coding_skill": "float value of 0-0.5 depending on the problem",
        "soft_skill": "float  value of 0-0.5 depending on the problem",
        "reliability_skill": "float  value of 0-0.5 depending on the problem",
        "problem_solving": "float  value of 0-0.5 depending on the problem",
        "stress_resistance": "float  value of 0-0.5 depending on the problem"
      },
      "currencyReward": "within 10-100",
      "stressImpact": "within 10 to 40",
      "moodImpact": "within -5 to -20",
      "deadline": "deadline in unix timestamp format randomly within 3-5 days from the day of assignment in 2025",
      "assignedBy": "manager-alex",
      "skills": ["put the skills improved by completing this quest in a list format"],
      "type": "MCQ",
      "question_data":'''list of 3 questions in this form [ {
          "question": "put the question here",
          "options": ['put the options in this list as different elements'],
          "correct option": "put the correct option here as an index of the list"
      }
      ]'''
} 