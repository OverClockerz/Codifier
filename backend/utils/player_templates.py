from utils.unix_overwrite import unix_overwrite
from datetime import datetime
from utils.activequests_template import activeQuests

InitialPlayerState = {
    "username": "",
    "companyName": "OverClockers Inc.",
    "githubinfo": {
        "github_id": "",
        "avatar_url": "",
        "github_email": ""
    },

    "level": 1,
    "experience": 0,
    "experienceToNextLevel": 100,
    "currency": 500,

    "mood": 70,
    "stress": 20,
    "isBurntOut": False,

    "baseSalary": 1000,
    "currentMonthEarnings": 0,
    "currentMonthTasksCompleted": 0,
    "paidLeaves": 5,

    "gameStartDate": datetime.utcnow(),
    "currentDay": 1,
    "currentMonth": 1,
    "lastLoginDate": datetime.utcnow(),
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

    "skills": {},
    "activeBuffs": {
        "stressReduction": 0,
        "moodIncrease": 0,
        "expBoost": 0, 
        "currencyBoost": 0, 
    },
    "permanentItems": [],
    "activeQuests": unix_overwrite(activeQuests),
    "completedQuests": [],
    "inventory": []
}

MCQ_QUEST = {
      "id": "unique quest id hash",
      "title": "Put the quest title here",
      "description": "Put the quest description here",
      "zone": "has to be one of the predefined zones: workspace,meeting-room,game-lounge",
      "difficulty": "on a scale of 1-4",
      "expReward": "within 10-30 depending on the difficulty",
      "proficiency": {
        "coding_skill": "float value of 0-0.5 depending on the problem only for coding quests",
        "soft_skill": "float  value of 0-0.5 depending on the problem only for meeting room quests",
        "critical_thinking_skill": "float  value of 0-0.5 depending on the problem only for comprehensive type quests in game lounge",
        "problem_solving": "float  value of 0-0.5 depending on the problem",
        "stress_resistance": "float  value of 0-0.5 depending on the problem"
      },
      "currencyReward": "within 50-100",
      "stressImpact": "within 10 to 20 (This value is positive for workspace zone and meeting-room and negative for game-lounge zones)",
      "moodImpact": "within -5 to -10  (This value is negative for workspace zone and meeting-room and positive for game-lounge zones)",
      "deadline": "deadline in no. of days within 3-5 days, depending on the difficulty",
      "skills": ["put the skills improved by completing this quest in a list format"],
      "type": "MCQ",
      "question_data":'''list of 3 questions in this form [ {
          "question": "put the question here",
          "options": ['put the options in this list as different elements'],
          "correct option": "put the correct option here as an index of the list"
      }
      ]'''
} 

COMPREHENSIVE_QUEST = {
      "id": "unique quest id hash",
      "title": "Put the quest title here",
      "description": "Put the quest description here",
      "zone": "has to be one of the predefined zones: workspace,meeting-room,game-lounge",
      "difficulty": "on a scale of 1-4",
      "expReward": "within 50-100 depending on the difficulty",    
      "proficiency": {
            "coding_skill": "float value of 0-0.5 depending on the problem only for coding quests",
            "soft_skill": "float  value of 0-0.5 depending on the problem only for meeting room quests",
            "critical_thinking_skill": "float  value of 0-0.5 depending on the problem only for comprehensive type quests in game lounge",
            "problem_solving": "float  value of 0-0.5 depending on the problem",
            "stress_resistance": "float  value of 0-0.5 depending on the problem"
      },
      "currencyReward": "within 100-200",
      "stressImpact": "within 20 to 30 (This value is positive for workspace zone and meeting-room and negative for game-lounge zones)",
      "moodImpact": "within -10 to -20 (This value is negative for workspace zone and meeting-room and positive for game-lounge zones)",
      "deadline": "deadline in no. of days within 5-7 days, depending on the difficulty",
      "skills": ["put the skills improved by completing this quest in a list format"],
      "type": "Comprehensive",
      "question_data":{
          "question": "put the long comprehensive critical thinking question here, this should be a scenario based question requiring detailed answer, and the topinc to should be relevant to the zone",
          "topic": "put the topic of the question here, should be relevant to the zone",
      }
}

CODING_QUEST= {
  "id": "unique quest id hash",
  "title": "Put the quest title here",
  "description": "Put the quest description here, this will be the detailed coding questions that is to be displayed, question only.",
  "zone": "workspace",
  "difficulty": "on a scale of 1-4",
  "constraints":"[put the constraints as string elements of this list]",
  "expReward": "within 100-150 depending on the difficulty",
  "topics" : "[list of all the topics of the problem as elements of this list]",
  "boilerplates":{
      "python": "from collections import Counter\n\nclass Solution:\n    def minOperations(self,nums: list[int]) -> int:\n        pass",
      "java": "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int minOperations(int[] nums) {\n        return 0;\n    }\n}"
    },
  "proficiency": {
    "coding_skill": "0-0.5 (only for coding quests)",
    "soft_skill": "0-0.5 (only for meeting room quests)",
    "critical_thinking_skill": "0-0.5 (only for comprehensive quests in game lounge)",
    "problem_solving": "0-0.5 depending on the problem",
    "stress_resistance": "0-0.5 depending on the problem"
  },
  "currencyReward": "within 200-300",
  "stressImpact": "within 30-40",
  "moodImpact": "witinn -20 to -30",
  "deadline": "deadline in no. of days within 7-9 days, depending on the difficulty",
  "skills": ["list of skills improved by completing this quest"],
  "type": "Coding",
  "examples":[
    {
      "input": "Put example input here",
      "expectedOutput": "Put correct expected output of the input here",
      "isHidden": False
    },
    {
      "input": "Put another example input here",
      "expectedOutput": "Put correct expected output of the input here",
      "isHidden": False
    }
  ],
  "testCases": '''two of the five test cases will be not hidden[
    {
      "input": "Put hidden test input here",
      "expectedOutput": "Put correct expected output of the input here",
      "isHidden": False
    },
    {
      "input": "Put another hidden test input here",
      "expectedOutput": "Put correct expected output of the input here",
      "isHidden": False
    },
    {
      "input": "Put hidden test input here",
      "expectedOutput": "Put correct expected output of the input here",
      "isHidden": True
    },
    {
      "input": "Put hidden test input here",
      "expectedOutput": "Put correct expected output of the input here",
      "isHidden": True
    },
    {
      "input": "Put hidden test input here",
      "expectedOutput": "Put correct expected output of the input here",
      "isHidden": True
    }
  ]'''
}

TYPING_QUEST = {
      "id": "unique quest id hash",
      "title": "Put the quest title here",
      "description": "Put the quest description here",
      "zone": "meeting-room",
      "difficulty": "on a scale of 1-4",
      "expReward": "within 50-100 depending on the difficulty",    
      "proficiency": {
            "coding_skill": "float value of 0-0.5 depending on the problem only for coding quests",
            "soft_skill": "float  value of 0-0.5 depending on the problem only for meeting room quests",
            "critical_thinking_skill": "float  value of 0-0.5 depending on the problem only for comprehensive type quests in game lounge",
            "problem_solving": "float  value of 0-0.5 depending on the problem",
            "stress_resistance": "float  value of 0-0.5 depending on the problem"
      },
      "currencyReward": "within 100-200",
      "stressImpact": "within 20 to 30",
      "moodImpact": "within -10 to -20",
      "deadline": "deadline in no. of days within 5-7 days, depending on the difficulty",
      "skills": ["put the skills improved by completing this quest in a list format"],
      "type": "Typing",
      "question_data":{
          "question": "put the long typing paragraph here, size depending on the difficulty, at least 20 words.",
          "time":"put the time limit in seconds here, depending on the difficulty 10-60 seconds"
      }
}