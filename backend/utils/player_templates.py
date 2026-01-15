from utils.unix_overwrite import unix_overwrite
from datetime import datetime

activeQuests = [
  {
    "id": "e2c3b0f5a1d74a9c8f6e5b4a3d2c1b0a",
    "title": "Python Basics: Variables & Operators",
    "description": "Test your fundamental understanding of Python variables, data types, and basic arithmetic and logical operators.",
    "zone": "workspace",
    "difficulty": "1",
    "expReward": 12,
    "proficiency": {
      "coding_skill": 0.1,
      "soft_skill": 0,
      "critical_thinking_skill": 0,
      "problem_solving": 0.1,
      "stress_resistance": 0.05
    },
    "currencyReward": 55,
    "stressImpact": 11,
    "moodImpact": -5,
    "deadline": "2",
    "skills": [
      "Python Syntax",
      "Basic Programming Concepts"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which of the following is a valid way to declare an integer variable in Python?",
        "options": [
          "int x = 10;",
          "x = 10;",
          "var x = 10;",
          "Integer x = 10;"
        ],
        "correct option": 1
      },
      {
        "question": "What is the output of `print(5 // 2)` in Python?",
        "options": [
          "2.5",
          "2",
          "3",
          "Error"
        ],
        "correct option": 1
      },
      {
        "question": "Which operator is used for exponentiation in Python?",
        "options": [
          "^",
          "**",
          "*",
          "//"
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4",
    "title": "Git Essentials: Commits & Branches",
    "description": "Assess your knowledge of basic Git commands for committing changes and managing branches.",
    "zone": "workspace",
    "difficulty": "1",
    "expReward": 14,
    "proficiency": {
      "coding_skill": 0.1,
      "soft_skill": 0,
      "critical_thinking_skill": 0,
      "problem_solving": 0.1,
      "stress_resistance": 0.05
    },
    "currencyReward": 60,
    "stressImpact": 12,
    "moodImpact": -6,
    "deadline": "2",
    "skills": [
      "Version Control",
      "Git Commands",
      "Collaboration"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which command is used to record changes to the repository?",
        "options": [
          "git add",
          "git push",
          "git commit",
          "git merge"
        ],
        "correct option": 2
      },
      {
        "question": "How do you create a new branch in Git?",
        "options": [
          "git branch -new <branch_name>",
          "git create branch <branch_name>",
          "git branch <branch_name>",
          "git new branch <branch_name>"
        ],
        "correct option": 2
      },
      {
        "question": "What does 'HEAD' typically refer to in Git?",
        "options": [
          "The remote repository",
          "The latest commit in the current branch",
          "The oldest commit in the repository",
          "A specific tag"
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6",
    "title": "Data Structures: Arrays & Lists",
    "description": "Evaluate your understanding of fundamental data structures like arrays and lists, their properties, and common operations.",
    "zone": "workspace",
    "difficulty": "2",
    "expReward": 18,
    "proficiency": {
      "coding_skill": 0.2,
      "soft_skill": 0,
      "critical_thinking_skill": 0,
      "problem_solving": 0.2,
      "stress_resistance": 0.1
    },
    "currencyReward": 75,
    "stressImpact": 15,
    "moodImpact": -7,
    "deadline": "3",
    "skills": [
      "Data Structures",
      "Algorithm Analysis"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which of the following is a characteristic of an array?",
        "options": [
          "Dynamic size by default",
          "Elements are stored contiguously in memory",
          "Allows heterogeneous data types (in most languages)",
          "Insertion and deletion are always O(1)"
        ],
        "correct option": 1
      },
      {
        "question": "What is the time complexity to access an element by index in a typical array?",
        "options": [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n^2)"
        ],
        "correct option": 0
      },
      {
        "question": "In Python, which built-in data type is most similar to a dynamic array?",
        "options": [
          "Tuple",
          "Set",
          "List",
          "Dictionary"
        ],
        "correct option": 2
      }
    ]
  },
  {
    "id": "c7b6a5d4e3f2c1b0a9d8e7f6a5b4c3d2",
    "title": "SQL Basics: SELECT & WHERE Clauses",
    "description": "Test your ability to construct basic SQL queries using SELECT and WHERE clauses to retrieve specific data from a database.",
    "zone": "workspace",
    "difficulty": "2",
    "expReward": 16,
    "proficiency": {
      "coding_skill": 0.2,
      "soft_skill": 0,
      "critical_thinking_skill": 0,
      "problem_solving": 0.2,
      "stress_resistance": 0.1
    },
    "currencyReward": 70,
    "stressImpact": 14,
    "moodImpact": -6,
    "deadline": "2",
    "skills": [
      "Database Querying",
      "SQL",
      "Data Retrieval"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which keyword is used to retrieve data from a database?",
        "options": [
          "GET",
          "EXTRACT",
          "SELECT",
          "PULL"
        ],
        "correct option": 2
      },
      {
        "question": "To filter results based on a condition, which clause would you use?",
        "options": [
          "FILTER BY",
          "HAVING",
          "GROUP BY",
          "WHERE"
        ],
        "correct option": 3
      },
      {
        "question": "What does `SELECT * FROM Employees;` do?",
        "options": [
          "Selects the first employee",
          "Selects all columns from the Employees table",
          "Selects only the primary key from Employees",
          "Deletes all data from Employees"
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    "title": "System Design: Microservices for a Chat App",
    "description": "Propose a microservice architecture for a real-time chat application, discussing component responsibilities, communication, and scalability considerations.",
    "zone": "workspace",
    "difficulty": "3",
    "expReward": 85,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.3,
      "problem_solving": 0.3,
      "stress_resistance": 0.15
    },
    "currencyReward": 165,
    "stressImpact": 27,
    "moodImpact": -16,
    "deadline": "6",
    "skills": [
      "System Design",
      "Microservices",
      "Scalability",
      "Distributed Systems"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Design a microservice-based architecture for a real-time chat application (similar to Slack or Discord). Users should be able to send direct messages, participate in channels, and see online/offline statuses. Focus on identifying the core microservices, their responsibilities, how they communicate (e.g., REST, gRPC, message queues), and key data storage considerations. Discuss how you would handle real-time communication (e.g., WebSockets), user authentication, and ensuring scalability and fault tolerance for millions of users. What are the pros and cons of this approach compared to a monolithic one for this specific application?",
      "topic": "Microservice Architecture for Real-time Applications"
    }
  },
  {
    "id": "a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0",
    "title": "Reverse a String",
    "description": "Write a function that reverses a given string. The function should take a string as input and return the reversed string.",
    "zone": "workspace",
    "difficulty": "2",
    "constraints": [
      "[The input string `s` will consist of printable ASCII characters.]",
      "[The length of `s` is between 0 and 1000.]"
    ],
    "expReward": 115,
    "topics": [
      "Strings",
      "Two Pointers",
      "Basic Algorithms"
    ],
    "boilerplates": {
      "python": "class Solution:\n    def reverseString(self, s: str) -> str:\n        pass",
      "java": "class Solution {\n    public String reverseString(String s) {\n        return \"\";\n    }\n}"
    },
    "proficiency": {
      "coding_skill": 0.2,
      "soft_skill": 0,
      "critical_thinking_skill": 0,
      "problem_solving": 0.2,
      "stress_resistance": 0.1
    },
    "currencyReward": 230,
    "stressImpact": 33,
    "moodImpact": -23,
    "deadline": "6",
    "skills": [
      "String Manipulation",
      "Algorithm Implementation",
      "Basic Data Structures"
    ],
    "type": "Coding",
    "examples": [
      {
        "input": "\"hello\"",
        "expectedOutput": "\"olleh\"",
        "isHidden": False
      },
      {
        "input": "\"Python\"",
        "expectedOutput": "\"nohtyP\"",
        "isHidden": False
      }
    ],
    "testCases": [
      {
        "input": "\"world\"",
        "expectedOutput": "\"dlrow\"",
        "isHidden": False
      },
      {
        "input": "\"a\"",
        "expectedOutput": "\"a\"",
        "isHidden": False
      },
      {
        "input": "\"racecar\"",
        "expectedOutput": "\"racecar\"",
        "isHidden": True
      },
      {
        "input": "\"madam\"",
        "expectedOutput": "\"madam\"",
        "isHidden": True
      },
      {
        "input": "\"level\"",
        "expectedOutput": "\"level\"",
        "isHidden": True
      }
    ]
  },
  {
    "id": "e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8",
    "title": "Find Maximum in Array",
    "description": "Given an array of integers, find the maximum element in the array.",
    "zone": "workspace",
    "difficulty": "2",
    "constraints": [
      "[The array `nums` will contain between 1 and 1000 integers.]",
      "[Each integer will be between -10^9 and 10^9.]"
    ],
    "expReward": 120,
    "topics": [
      "Arrays",
      "Iteration",
      "Basic Algorithms"
    ],
    "boilerplates": {
      "python": "class Solution:\n    def findMax(self, nums: list[int]) -> int:\n        pass",
      "java": "class Solution {\n    public int findMax(int[] nums) {\n        return 0;\n    }\n}"
    },
    "proficiency": {
      "coding_skill": 0.2,
      "soft_skill": 0,
      "critical_thinking_skill": 0,
      "problem_solving": 0.2,
      "stress_resistance": 0.1
    },
    "currencyReward": 240,
    "stressImpact": 34,
    "moodImpact": -24,
    "deadline": "7",
    "skills": [
      "Array Manipulation",
      "Looping",
      "Elementary Algorithms"
    ],
    "type": "Coding",
    "examples": [
      {
        "input": "[3, 1, 4, 1, 5, 9, 2, 6]",
        "expectedOutput": "9",
        "isHidden": False
      },
      {
        "input": "[-10, -5, -20, -1]",
        "expectedOutput": "-1",
        "isHidden": False
      }
    ],
    "testCases": [
      {
        "input": "[7, 2, 9, 1, 5]",
        "expectedOutput": "9",
        "isHidden": False
      },
      {
        "input": "[100]",
        "expectedOutput": "100",
        "isHidden": False
      },
      {
        "input": "[0, 0, 0, 0, 0]",
        "expectedOutput": "0",
        "isHidden": True
      },
      {
        "input": "[50, 20, 30, 80, 10]",
        "expectedOutput": "80",
        "isHidden": True
      },
      {
        "input": "[-1, -100, -5, -70]",
        "expectedOutput": "-1",
        "isHidden": True
      }
    ]
  },
  {
    "id": "f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5",
    "title": "Two Sum Problem",
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    "zone": "workspace",
    "difficulty": "3",
    "constraints": [
      "[2 <= nums.length <= 10^4]",
      "[-10^9 <= nums[i] <= 10^9]",
      "[-10^9 <= target <= 10^9]",
      "[Only one valid answer exists.]"
    ],
    "expReward": 130,
    "topics": [
      "Arrays",
      "Hash Maps",
      "Two Pointers",
      "Algorithms"
    ],
    "boilerplates": {
      "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass",
      "java": "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[2];\n    }\n}"
    },
    "proficiency": {
      "coding_skill": 0.3,
      "soft_skill": 0,
      "critical_thinking_skill": 0,
      "problem_solving": 0.3,
      "stress_resistance": 0.15
    },
    "currencyReward": 260,
    "stressImpact": 36,
    "moodImpact": -26,
    "deadline": "7",
    "skills": [
      "Hash Tables",
      "Array Traversal",
      "Problem Solving",
      "Time Complexity"
    ],
    "type": "Coding",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "expectedOutput": "[0,1]",
        "isHidden": False
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "expectedOutput": "[1,2]",
        "isHidden": False
      }
    ],
    "testCases": [
      {
        "input": "nums = [3,3], target = 6",
        "expectedOutput": "[0,1]",
        "isHidden": False
      },
      {
        "input": "nums = [1,2,3,4,5], target = 7",
        "expectedOutput": "[2,3]",
        "isHidden": False
      },
      {
        "input": "nums = [10,20,30,40,50], target = 70",
        "expectedOutput": "[2,3]",
        "isHidden": True
      },
      {
        "input": "nums = [-1,-2,-3,-4,-5], target = -8",
        "expectedOutput": "[2,4]",
        "isHidden": True
      },
      {
        "input": "nums = [0,4,3,0], target = 0",
        "expectedOutput": "[0,3]",
        "isHidden": True
      }
    ]
  },
  {
    "id": "a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5",
    "title": "Implement Bubble Sort",
    "description": "Implement the Bubble Sort algorithm to sort an array of integers in ascending order.",
    "zone": "workspace",
    "difficulty": "3",
    "constraints": [
      "[The array `arr` will contain between 0 and 5000 integers.]",
      "[Each integer will be between -10^5 and 10^5.]"
    ],
    "expReward": 135,
    "topics": [
      "Sorting",
      "Arrays",
      "Algorithm Implementation"
    ],
    "boilerplates": {
      "python": "class Solution:\n    def bubbleSort(self, arr: list[int]) -> list[int]:\n        pass",
      "java": "class Solution {\n    public int[] bubbleSort(int[] arr) {\n        return arr;\n    }\n}"
    },
    "proficiency": {
      "coding_skill": 0.3,
      "soft_skill": 0,
      "critical_thinking_skill": 0,
      "problem_solving": 0.3,
      "stress_resistance": 0.15
    },
    "currencyReward": 270,
    "stressImpact": 37,
    "moodImpact": -27,
    "deadline": "8",
    "skills": [
      "Sorting Algorithms",
      "Array Manipulation",
      "Algorithm Analysis"
    ],
    "type": "Coding",
    "examples": [
      {
        "input": "[5, 1, 4, 2, 8]",
        "expectedOutput": "[1, 2, 4, 5, 8]",
        "isHidden": False
      },
      {
        "input": "[1, 2, 3]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": False
      }
    ],
    "testCases": [
      {
        "input": "[3, 2, 1]",
        "expectedOutput": "[1, 2, 3]",
        "isHidden": False
      },
      {
        "input": "[]",
        "expectedOutput": "[]",
        "isHidden": False
      },
      {
        "input": "[64, 25, 12, 22, 11]",
        "expectedOutput": "[11, 12, 22, 25, 64]",
        "isHidden": True
      },
      {
        "input": "[9, 8, 7, 6, 5, 4, 3, 2, 1]",
        "expectedOutput": "[1, 2, 3, 4, 5, 6, 7, 8, 9]",
        "isHidden": True
      },
      {
        "input": "[0, -5, 10, -2, 7]",
        "expectedOutput": "[-5, -2, 0, 7, 10]",
        "isHidden": True
      }
    ]
  },
  {
    "id": "quest_id_2",
    "title": "Understanding Data Structures",
    "description": "Test your knowledge of fundamental data structures like arrays, linked lists, and trees.",
    "zone": "workspace",
    "difficulty": 2,
    "expReward": 20,
    "proficiency": {
      "coding_skill": 0.15,
      "soft_skill": 0,
      "critical_thinking_skill": 0.1,
      "problem_solving": 0.15,
      "stress_resistance": 0.1
    },
    "currencyReward": 85,
    "stressImpact": 15,
    "moodImpact": -8,
    "deadline": "3",
    "skills": [
      "Data Structures",
      "Algorithms",
      "Conceptual Understanding"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which data structure is best for implementing a LIFO (Last-In, First-Out) queue?",
        "options": [
          "Queue",
          "Stack",
          "Array",
          "Linked List"
        ],
        "correct option": 1
      },
      {
        "question": "What is the time complexity for accessing an element at a specific index in a Python list (dynamic array)?",
        "options": [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n^2)"
        ],
        "correct option": 0
      },
      {
        "question": "Which data structure requires contiguous memory allocation?",
        "options": [
          "Linked List",
          "Tree",
          "Hash Map",
          "Array"
        ],
        "correct option": 3
      }
    ]
  },
  {
    "id": "quest_id_4",
    "title": "Object-Oriented Programming Principles",
    "description": "Evaluate your understanding of OOP concepts like encapsulation, inheritance, and polymorphism.",
    "zone": "workspace",
    "difficulty": 3,
    "expReward": 25,
    "proficiency": {
      "coding_skill": 0.2,
      "soft_skill": 0,
      "critical_thinking_skill": 0.15,
      "problem_solving": 0.2,
      "stress_resistance": 0.15
    },
    "currencyReward": 95,
    "stressImpact": 18,
    "moodImpact": -9,
    "deadline": "4",
    "skills": [
      "OOP",
      "Design Patterns",
      "Software Architecture"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which OOP principle allows a class to have the same method name as its parent class, but with a different implementation?",
        "options": [
          "Encapsulation",
          "Inheritance",
          "Polymorphism",
          "Abstraction"
        ],
        "correct option": 2
      },
      {
        "question": "What is the primary purpose of Encapsulation?",
        "options": [
          "To hide the internal state of an object and require all interaction to be performed through an object's methods",
          "To create new classes from existing classes",
          "To allow objects of different classes to be treated as objects of a common type",
          "To define a blueprint for creating objects"
        ],
        "correct option": 0
      },
      {
        "question": "In Python, which of these is an example of multiple inheritance?",
        "options": [
          "class C(A)",
          "class C(A, B)",
          "class C(object)",
          "class C: pass"
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "quest_id_7",
    "title": "Understanding Version Control (Git)",
    "description": "Answer questions on common Git commands and version control concepts.",
    "zone": "workspace",
    "difficulty": 2,
    "expReward": 20,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.1,
      "problem_solving": 0.15,
      "stress_resistance": 0.1
    },
    "currencyReward": 85,
    "stressImpact": 14,
    "moodImpact": -7,
    "deadline": "3",
    "skills": [
      "Git",
      "Version Control",
      "Collaboration"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which Git command is used to record changes to the repository?",
        "options": [
          "git push",
          "git fetch",
          "git commit",
          "git pull"
        ],
        "correct option": 2
      },
      {
        "question": "What does 'git clone' do?",
        "options": [
          "Uploads local changes to a remote repository",
          "Downloads a remote repository to your local machine",
          "Merges branches",
          "Shows the commit history"
        ],
        "correct option": 1
      },
      {
        "question": "How do you switch between branches in Git?",
        "options": [
          "git merge <branch_name>",
          "git branch <branch_name>",
          "git checkout <branch_name>",
          "git rebase <branch_name>"
        ],
        "correct option": 2
      }
    ]
  },
  {
    "id": "quest_id_8",
    "title": "Cloud Computing Basics",
    "description": "Test your knowledge on fundamental cloud computing concepts and service models.",
    "zone": "workspace",
    "difficulty": 3,
    "expReward": 27,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.2,
      "problem_solving": 0.2,
      "stress_resistance": 0.15
    },
    "currencyReward": 92,
    "stressImpact": 17,
    "moodImpact": -9,
    "deadline": "4",
    "skills": [
      "Cloud Computing",
      "AWS",
      "Azure",
      "GCP"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which cloud service model provides virtual machines, storage, and networks, but requires the user to manage the operating system and applications?",
        "options": [
          "SaaS (Software as a Service)",
          "PaaS (Platform as a Service)",
          "IaaS (Infrastructure as a Service)",
          "FaaS (Function as a Service)"
        ],
        "correct option": 2
      },
      {
        "question": "What is the key benefit of cloud computing's 'elasticity'?",
        "options": [
          "Reduced hardware costs",
          "Ability to scale resources up or down rapidly based on demand",
          "Enhanced security features",
          "Easier data backup"
        ],
        "correct option": 1
      },
      {
        "question": "Which of these is NOT a common deployment model for cloud computing?",
        "options": [
          "Public Cloud",
          "Private Cloud",
          "Hybrid Cloud",
          "Personal Cloud"
        ],
        "correct option": 3
      }
    ]
  },
  {
    "id": "quest_id_9",
    "title": "Designing a Microservices Architecture",
    "description": "Outline a microservices architecture for a complex e-commerce platform, detailing service breakdown, communication, and data management.",
    "zone": "workspace",
    "difficulty": 4,
    "expReward": 95,
    "proficiency": {
      "coding_skill": 0.1,
      "soft_skill": 0,
      "critical_thinking_skill": 0.45,
      "problem_solving": 0.4,
      "stress_resistance": 0.35
    },
    "currencyReward": 190,
    "stressImpact": 28,
    "moodImpact": -18,
    "deadline": "6",
    "skills": [
      "System Design",
      "Microservices",
      "Architecture",
      "Scalability",
      "Distributed Systems"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "You are tasked with redesigning a monolithic e-commerce application into a microservices architecture. The platform handles user accounts, product catalogs, order processing, payment gateways, and shipping. Describe how you would break down these functionalities into independent microservices. Discuss the communication mechanisms between these services (e.g., synchronous vs. asynchronous, API Gateway). Explain your strategy for data management, considering issues like data consistency, service-specific databases, and potential data duplication. Finally, outline how you would handle fault tolerance and service discovery in this distributed environment.",
      "topic": "Microservices Architecture Design for E-commerce"
    }
  },
  {
    "id": "quest_id_11",
    "title": "Resolving a Production Bug",
    "description": "Walk through the steps to diagnose and fix a critical, intermittent bug in a production environment.",
    "zone": "workspace",
    "difficulty": 4,
    "expReward": 90,
    "proficiency": {
      "coding_skill": 0.2,
      "soft_skill": 0,
      "critical_thinking_skill": 0.4,
      "problem_solving": 0.45,
      "stress_resistance": 0.38
    },
    "currencyReward": 180,
    "stressImpact": 29,
    "moodImpact": -19,
    "deadline": "6",
    "skills": [
      "Debugging",
      "Problem Solving",
      "Incident Management",
      "Log Analysis",
      "Root Cause Analysis"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Your team receives an urgent alert: a critical user-facing feature in your production application (e.g., 'Add to Cart' functionality) is intermittently failing for a small percentage of users. There are no clear error messages in the primary application logs, and the issue seems to disappear after a few minutes, only to reappear later. Describe your systematic approach to diagnose and resolve this elusive production bug. Detail the tools and techniques you would use, from initial monitoring and log analysis to potential code inspection, environment checks, and rollback strategies. How would you ensure the fix is robust and prevent recurrence?",
      "topic": "Production Incident Management and Debugging"
    }
  },
  {
    "id": "quest_id_12",
    "title": "Choosing the Right Cloud Service",
    "description": "Evaluate and select appropriate AWS services for a specific application requirement.",
    "zone": "workspace",
    "difficulty": 3,
    "expReward": 75,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.3,
      "problem_solving": 0.35,
      "stress_resistance": 0.2
    },
    "currencyReward": 140,
    "stressImpact": 23,
    "moodImpact": -14,
    "deadline": "5",
    "skills": [
      "Cloud Architecture",
      "AWS",
      "Resource Management",
      "Cost Optimization"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Imagine you need to host a new web application on AWS that will serve dynamic content to users globally, store large amounts of user-generated data (text and images), and process asynchronous background tasks (e.g., image resizing, email notifications). Recommend a set of appropriate AWS services for each component (compute, database, storage, messaging, content delivery) and justify your choices based on factors like scalability, cost-effectiveness, performance, and ease of management. Explain how these services would integrate to form a cohesive architecture.",
      "topic": "AWS Service Selection and Architecture"
    }
  },
  {
    "id": "quest_id_14",
    "title": "Refactoring Legacy Code",
    "description": "Analyze a legacy code scenario and propose a refactoring strategy to improve maintainability and performance.",
    "zone": "workspace",
    "difficulty": 4,
    "expReward": 100,
    "proficiency": {
      "coding_skill": 0.25,
      "soft_skill": 0,
      "critical_thinking_skill": 0.4,
      "problem_solving": 0.45,
      "stress_resistance": 0.3
    },
    "currencyReward": 200,
    "stressImpact": 30,
    "moodImpact": -20,
    "deadline": "6",
    "skills": [
      "Refactoring",
      "Code Quality",
      "Software Design",
      "Maintainability",
      "Testing"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Your team has inherited a critical legacy module written in Python that is riddled with spaghetti code, deep nesting, duplicated logic, and no unit tests. It's difficult to extend or debug, leading to frequent production issues. Describe a systematic approach to refactor this module without introducing new bugs or disrupting existing functionality. Discuss initial steps like understanding the code and establishing a safety net. Outline common refactoring techniques you would apply (e.g., Extract Method, Introduce Parameter Object, Replace Conditional with Polymorphism). Emphasize how you would maintain code integrity throughout the process.",
      "topic": "Legacy Code Refactoring Strategy"
    }
  },
  {
    "id": "quest_id_15",
    "title": "Reverse a Linked List",
    "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    "zone": "workspace",
    "difficulty": 2,
    "constraints": [
      "[The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000]"
    ],
    "expReward": 110,
    "topics": [
      "Linked List",
      "Pointers",
      "Iteration"
    ],
    "boilerplates": {
      "python": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass",
      "java": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode() {}\n    ListNode(int val) { this.val = val; }\n    ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n}\n\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        return null;\n    }\n}"
    },
    "proficiency": {
      "coding_skill": 0.25,
      "soft_skill": 0,
      "critical_thinking_skill": 0.05,
      "problem_solving": 0.25,
      "stress_resistance": 0.2
    },
    "currencyReward": 220,
    "stressImpact": 33,
    "moodImpact": -22,
    "deadline": "6",
    "skills": [
      "Data Structures",
      "Algorithms",
      "Pointer Manipulation"
    ],
    "type": "Coding",
    "examples": [
      {
        "input": "head = [1,2,3,4,5]",
        "expectedOutput": "[5,4,3,2,1]",
        "isHidden": False
      },
      {
        "input": "head = [1,2]",
        "expectedOutput": "[2,1]",
        "isHidden": False
      }
    ],
    "testCases": [
      {
        "input": "head = []",
        "expectedOutput": "[]",
        "isHidden": False
      },
      {
        "input": "head = [1]",
        "expectedOutput": "[1]",
        "isHidden": False
      },
      {
        "input": "head = [1,2,3]",
        "expectedOutput": "[3,2,1]",
        "isHidden": False
      },
      {
        "input": "head = [7,6,5,4,3,2,1]",
        "expectedOutput": "[1,2,3,4,5,6,7]",
        "isHidden": False
      },
      {
        "input": "head = [100, 200, 300, 400]",
        "expectedOutput": "[400, 300, 200, 100]",
        "isHidden": False
      }
    ]
  },
  {
    "id": "quest_id_19",
    "title": "Maximum Subarray Sum",
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "zone": "workspace",
    "difficulty": 3,
    "constraints": [
      "[1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4]"
    ],
    "expReward": 125,
    "topics": [
      "Array",
      "Divide and Conquer",
      "Dynamic Programming"
    ],
    "boilerplates": {
      "python": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        pass",
      "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}"
    },
    "proficiency": {
      "coding_skill": 0.32,
      "soft_skill": 0,
      "critical_thinking_skill": 0.1,
      "problem_solving": 0.32,
      "stress_resistance": 0.25
    },
    "currencyReward": 250,
    "stressImpact": 36,
    "moodImpact": -26,
    "deadline": "7",
    "skills": [
      "Algorithms",
      "Dynamic Programming",
      "Array Manipulation"
    ],
    "type": "Coding",
    "examples": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "expectedOutput": "6",
        "isHidden": False
      },
      {
        "input": "nums = [1]",
        "expectedOutput": "1",
        "isHidden": False
      }
    ],
    "testCases": [
      {
        "input": "nums = [5,4,-1,7,8]",
        "expectedOutput": "23",
        "isHidden": False
      },
      {
        "input": "nums = [-1]",
        "expectedOutput": "-1",
        "isHidden": False
      },
      {
        "input": "nums = [-2, -1]",
        "expectedOutput": "-1",
        "isHidden": True
      },
      {
        "input": "nums = [8, -19, 5, -4, 20]",
        "expectedOutput": "21",
        "isHidden": True
      },
      {
        "input": "nums = [1, 2, 3, -2, 5]",
        "expectedOutput": "9",
        "isHidden": True
      }
    ]
  },
  {
    "id": "quest_id_20",
    "title": "Binary Tree Inorder Traversal",
    "description": "Given the `root` of a binary tree, return the inorder traversal of its nodes' values.",
    "zone": "workspace",
    "difficulty": 3,
    "constraints": [
      "[The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100]"
    ],
    "expReward": 135,
    "topics": [
      "Binary Tree",
      "Recursion",
      "Stack"
    ],
    "boilerplates": {
      "python": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def inorderTraversal(self, root: Optional[TreeNode]) -> list[int]:\n        pass",
      "java": "import java.util.ArrayList;\nimport java.util.List;\n\nclass TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode() {}\n    TreeNode(int val) { this.val = val; }\n    TreeNode(int val, TreeNode left, TreeNode right) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nclass Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        return new ArrayList<>();\n    }\n}"
    },
    "proficiency": {
      "coding_skill": 0.38,
      "soft_skill": 0,
      "critical_thinking_skill": 0.12,
      "problem_solving": 0.38,
      "stress_resistance": 0.3
    },
    "currencyReward": 270,
    "stressImpact": 38,
    "moodImpact": -28,
    "deadline": "8",
    "skills": [
      "Data Structures",
      "Tree Traversal",
      "Recursion"
    ],
    "type": "Coding",
    "examples": [
      {
        "input": "root = [1,null,2,3]",
        "expectedOutput": "[1,3,2]",
        "isHidden": False
      },
      {
        "input": "root = [1]",
        "expectedOutput": "[1]",
        "isHidden": False
      }
    ],
    "testCases": [
      {
        "input": "root = []",
        "expectedOutput": "[]",
        "isHidden": False
      },
      {
        "input": "root = [1,2]",
        "expectedOutput": "[2,1]",
        "isHidden": False
      },
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "expectedOutput": "[9,3,15,20,7]",
        "isHidden": True
      },
      {
        "input": "root = [4,2,5,1,3]",
        "expectedOutput": "[1,2,3,4,5]",
        "isHidden": True
      },
      {
        "input": "root = [1, null, 2]",
        "expectedOutput": "[1,2]",
        "isHidden": True
      }
    ]
  },
  {
    "id": "quest_1_mcq",
    "title": "Logic Grid Master",
    "description": "Solve a series of logical puzzles to prove your sharp mind.",
    "zone": "game-lounge",
    "difficulty": 2,
    "expReward": 20,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.3,
      "problem_solving": 0.3,
      "stress_resistance": 0.2
    },
    "currencyReward": 75,
    "stressImpact": -15,
    "moodImpact": 7,
    "deadline": "3",
    "skills": [
      "Logical Reasoning",
      "Problem Solving",
      "Critical Thinking"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "If all cats are mammals, and all mammals are animals, then all cats are animals. Is this statement:",
        "options": [
          "True",
          "False",
          "Cannot be determined"
        ],
        "correct option": 0
      },
      {
        "question": "Every car in the parking lot is either red or blue. There are no blue cars. Therefore, all cars in the parking lot are red. This is an example of:",
        "options": [
          "Deductive reasoning",
          "Inductive reasoning",
          "Abductive reasoning"
        ],
        "correct option": 0
      },
      {
        "question": "Which of the following does not belong: Apple, Orange, Banana, Potato?",
        "options": [
          "Apple",
          "Orange",
          "Banana",
          "Potato"
        ],
        "correct option": 3
      }
    ]
  },
  {
    "id": "quest_2_mcq",
    "title": "Numerical Nexus",
    "description": "Tackle mathematical sequence and pattern recognition challenges.",
    "zone": "game-lounge",
    "difficulty": 2,
    "expReward": 20,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.2,
      "problem_solving": 0.3,
      "stress_resistance": 0.2
    },
    "currencyReward": 70,
    "stressImpact": -14,
    "moodImpact": 6,
    "deadline": "3",
    "skills": [
      "Mathematical Aptitude",
      "Logical Reasoning",
      "Problem Solving"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "What comes next in the sequence: 2, 4, 8, 16, ___?",
        "options": [
          "24",
          "30",
          "32",
          "64"
        ],
        "correct option": 2
      },
      {
        "question": "What is the missing number: 1, 1, 2, 3, 5, 8, ___?",
        "options": [
          "11",
          "12",
          "13",
          "14"
        ],
        "correct option": 2
      },
      {
        "question": "If 5 + 3 = 28, 9 + 1 = 810, 8 + 6 = 214, then 7 + 2 = ___?",
        "options": [
          "59",
          "95",
          "14",
          "72"
        ],
        "correct option": 0
      }
    ]
  },
  {
    "id": "quest_3_mcq",
    "title": "Riddle Resolver",
    "description": "Decipher tricky riddles that test your lateral thinking.",
    "zone": "game-lounge",
    "difficulty": 1,
    "expReward": 15,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.2,
      "problem_solving": 0.2,
      "stress_resistance": 0.1
    },
    "currencyReward": 60,
    "stressImpact": -12,
    "moodImpact": 5,
    "deadline": "2",
    "skills": [
      "Critical Thinking",
      "Logical Reasoning"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "What has an eye, but cannot see?",
        "options": [
          "A needle",
          "A storm",
          "A potato",
          "A cyclops"
        ],
        "correct option": 0
      },
      {
        "question": "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        "options": [
          "A ghost",
          "An echo",
          "A secret",
          "A whisper"
        ],
        "correct option": 1
      },
      {
        "question": "What is full of holes but still holds water?",
        "options": [
          "A net",
          "A sieve",
          "A sponge",
          "A colander"
        ],
        "correct option": 2
      }
    ]
  },
  {
    "id": "quest_4_mcq",
    "title": "Pattern Prowess",
    "description": "Identify and complete complex visual and numerical patterns.",
    "zone": "game-lounge",
    "difficulty": 3,
    "expReward": 25,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.35,
      "problem_solving": 0.4,
      "stress_resistance": 0.3
    },
    "currencyReward": 85,
    "stressImpact": -18,
    "moodImpact": 9,
    "deadline": "4",
    "skills": [
      "Logical Reasoning",
      "Mathematical Aptitude",
      "Problem Solving",
      "Critical Thinking"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "What is the next letter in the series: A, C, E, G, ___?",
        "options": [
          "H",
          "I",
          "J",
          "K"
        ],
        "correct option": 1
      },
      {
        "question": "If 'square, circle, triangle, square, circle', what's next?",
        "options": [
          "Square",
          "Circle",
          "Triangle",
          "Pentagon"
        ],
        "correct option": 2
      },
      {
        "question": "Find the odd one out: 4, 9, 16, 20, 25",
        "options": [
          "4",
          "9",
          "16",
          "20"
        ],
        "correct option": 3
      }
    ]
  },
  {
    "id": "quest_5_mcq",
    "title": "Equation Explorer",
    "description": "Solve a variety of algebraic and arithmetic equations.",
    "zone": "game-lounge",
    "difficulty": 2,
    "expReward": 20,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.2,
      "problem_solving": 0.3,
      "stress_resistance": 0.2
    },
    "currencyReward": 70,
    "stressImpact": -15,
    "moodImpact": 7,
    "deadline": "3",
    "skills": [
      "Mathematical Aptitude",
      "Problem Solving"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "If 3x + 5 = 14, what is x?",
        "options": [
          "3",
          "4",
          "5",
          "6"
        ],
        "correct option": 0
      },
      {
        "question": "Solve for y: 2y - 7 = 11",
        "options": [
          "7",
          "8",
          "9",
          "10"
        ],
        "correct option": 2
      },
      {
        "question": "If a + b = 10 and a - b = 2, what is the value of 'a'?",
        "options": [
          "4",
          "5",
          "6",
          "7"
        ],
        "correct option": 2
      }
    ]
  },
  {
    "id": "quest_6_mcq",
    "title": "Deductive Detective",
    "description": "Use given clues to deduce the correct answer in logic scenarios.",
    "zone": "game-lounge",
    "difficulty": 3,
    "expReward": 25,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.4,
      "problem_solving": 0.35,
      "stress_resistance": 0.3
    },
    "currencyReward": 90,
    "stressImpact": -18,
    "moodImpact": 9,
    "deadline": "4",
    "skills": [
      "Logical Reasoning",
      "Critical Thinking",
      "Problem Solving"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "All Flarps are Zorks. All Zorks are Glims. Therefore, all Flarps are Glims. Is this conclusion valid?",
        "options": [
          "Yes",
          "No",
          "Only if Flarps exist"
        ],
        "correct option": 0
      },
      {
        "question": "If it is raining, the street is wet. The street is wet. Therefore, it is raining. This argument is an example of:",
        "options": [
          "Modus Ponens",
          "Modus Tollens",
          "Affirming the Consequent",
          "Denying the Antecedent"
        ],
        "correct option": 2
      },
      {
        "question": "Sarah is older than Tom. Tom is older than Lisa. Is Sarah older than Lisa?",
        "options": [
          "Yes",
          "No",
          "Cannot be determined"
        ],
        "correct option": 0
      }
    ]
  },
  {
    "id": "quest_7_mcq",
    "title": "Geometry Genius",
    "description": "Answer questions involving shapes, angles, and spatial reasoning.",
    "zone": "game-lounge",
    "difficulty": 2,
    "expReward": 20,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.25,
      "problem_solving": 0.3,
      "stress_resistance": 0.2
    },
    "currencyReward": 75,
    "stressImpact": -15,
    "moodImpact": 7,
    "deadline": "3",
    "skills": [
      "Mathematical Aptitude",
      "Logical Reasoning"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "A square has a perimeter of 20 units. What is the area of the square?",
        "options": [
          "16 sq units",
          "20 sq units",
          "25 sq units",
          "100 sq units"
        ],
        "correct option": 2
      },
      {
        "question": "What is the sum of angles in a triangle?",
        "options": [
          "90 degrees",
          "180 degrees",
          "270 degrees",
          "360 degrees"
        ],
        "correct option": 1
      },
      {
        "question": "If a circle has a radius of 5 cm, what is its circumference? (Use π ≈ 3.14)",
        "options": [
          "15.7 cm",
          "31.4 cm",
          "78.5 cm",
          "10 cm"
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "quest_8_mcq",
    "title": "Probability Puzzle",
    "description": "Calculate probabilities in various scenarios and make informed choices.",
    "zone": "game-lounge",
    "difficulty": 3,
    "expReward": 28,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.35,
      "problem_solving": 0.4,
      "stress_resistance": 0.3
    },
    "currencyReward": 95,
    "stressImpact": -19,
    "moodImpact": 9,
    "deadline": "4",
    "skills": [
      "Mathematical Aptitude",
      "Logical Reasoning",
      "Critical Thinking"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "What is the probability of rolling a 6 on a standard six-sided die?",
        "options": [
          "1/2",
          "1/3",
          "1/6",
          "1/12"
        ],
        "correct option": 2
      },
      {
        "question": "A bag contains 3 red balls and 7 blue balls. What is the probability of drawing a red ball?",
        "options": [
          "3/7",
          "7/10",
          "3/10",
          "1/3"
        ],
        "correct option": 2
      },
      {
        "question": "If you flip a fair coin twice, what is the probability of getting two heads?",
        "options": [
          "1/2",
          "1/3",
          "1/4",
          "1/8"
        ],
        "correct option": 2
      }
    ]
  },
  {
    "id": "quest_9_mcq",
    "title": "Critical Conundrum",
    "description": "Analyze short statements and identify logical fallacies or draw correct inferences.",
    "zone": "game-lounge",
    "difficulty": 3,
    "expReward": 28,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.45,
      "problem_solving": 0.35,
      "stress_resistance": 0.3
    },
    "currencyReward": 90,
    "stressImpact": -19,
    "moodImpact": 9,
    "deadline": "4",
    "skills": [
      "Critical Thinking",
      "Logical Reasoning"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "My uncle's dog always barks at strangers. A man just walked past my house and the dog barked. Therefore, the man must be a stranger. This reasoning is:",
        "options": [
          "Sound",
          "A hasty generalization",
          "An affirming the consequent fallacy",
          "A straw man fallacy"
        ],
        "correct option": 2
      },
      {
        "question": "Either the lights are on or the house is empty. The lights are not on. Therefore, the house is empty. This argument is:",
        "options": [
          "Valid",
          "Invalid",
          "Fallacious"
        ],
        "correct option": 0
      },
      {
        "question": "People who don't support the new city park project simply don't care about community well-being. This statement is an example of:",
        "options": [
          "Ad Hominem",
          "False Dichotomy",
          "Slippery Slope",
          "Appeal to Emotion"
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "quest_10_mcq",
    "title": "Brain Teaser Bonanza",
    "description": "A collection of diverse brain teasers to keep your mind sharp.",
    "zone": "game-lounge",
    "difficulty": 2,
    "expReward": 22,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.3,
      "problem_solving": 0.3,
      "stress_resistance": 0.25
    },
    "currencyReward": 80,
    "stressImpact": -16,
    "moodImpact": 8,
    "deadline": "3",
    "skills": [
      "Logical Reasoning",
      "Problem Solving",
      "Critical Thinking"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "What has cities, but no houses; forests, but no trees; and water, but no fish?",
        "options": [
          "A book",
          "A map",
          "A globe",
          "A desert"
        ],
        "correct option": 1
      },
      {
        "question": "I am always hungry, I must always be fed, The finger I lick will soon turn red. What am I?",
        "options": [
          "A fire",
          "A monster",
          "A vampire",
          "A shark"
        ],
        "correct option": 0
      },
      {
        "question": "You see a boat filled with people. It has not sunk, but when you look again you don’t see a single person on the boat. Why?",
        "options": [
          "They all jumped overboard",
          "The boat is empty",
          "All the people are married",
          "It's a submarine"
        ],
        "correct option": 2
      }
    ]
  },
  {
    "id": "quest_11_mcq",
    "title": "Sequence Sleuth",
    "description": "Unravel intricate numerical and alphabetical sequences.",
    "zone": "game-lounge",
    "difficulty": 3,
    "expReward": 26,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.3,
      "problem_solving": 0.4,
      "stress_resistance": 0.3
    },
    "currencyReward": 88,
    "stressImpact": -18,
    "moodImpact": 8,
    "deadline": "4",
    "skills": [
      "Mathematical Aptitude",
      "Logical Reasoning",
      "Problem Solving"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which number completes the sequence: 10, 9, 7, 4, ___?",
        "options": [
          "0",
          "1",
          "-1",
          "-2"
        ],
        "correct option": 2
      },
      {
        "question": "What is the next letter in the series: Z, Y, W, T, P, ___?",
        "options": [
          "K",
          "J",
          "I",
          "H"
        ],
        "correct option": 0
      },
      {
        "question": "What is the missing number in the sequence: 2, 6, 12, 20, 30, ___?",
        "options": [
          "40",
          "42",
          "44",
          "46"
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "quest_12_mcq",
    "title": "Inference Investigator",
    "description": "Practice drawing sound conclusions from given premises.",
    "zone": "game-lounge",
    "difficulty": 2,
    "expReward": 24,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.35,
      "problem_solving": 0.3,
      "stress_resistance": 0.25
    },
    "currencyReward": 82,
    "stressImpact": -17,
    "moodImpact": 8,
    "deadline": "3",
    "skills": [
      "Logical Reasoning",
      "Critical Thinking"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "All dogs are loyal. My pet is a dog. What can you infer?",
        "options": [
          "My pet barks",
          "My pet is loyal",
          "My pet is furry",
          "All loyal animals are dogs"
        ],
        "correct option": 1
      },
      {
        "question": "If the alarm clock rings, then I wake up. The alarm clock did not ring. What can you infer about whether I woke up?",
        "options": [
          "I woke up",
          "I did not wake up",
          "Cannot be determined",
          "I must still be sleeping"
        ],
        "correct option": 2
      },
      {
        "question": "Most people enjoy chocolate. Sarah is a person. Therefore, Sarah enjoys chocolate. This is an example of:",
        "options": [
          "Deductive reasoning",
          "Inductive reasoning",
          "Abductive reasoning",
          "Invalid deduction"
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "quest_13_comprehensive",
    "title": "The Strategic Game Board",
    "description": "Analyze a complex game scenario and devise a winning strategy.",
    "zone": "game-lounge",
    "difficulty": 3,
    "expReward": 75,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.4,
      "problem_solving": 0.4,
      "stress_resistance": 0.3
    },
    "currencyReward": 150,
    "stressImpact": -25,
    "moodImpact": 15,
    "deadline": "5",
    "skills": [
      "Critical Thinking",
      "Logical Reasoning",
      "Problem Solving",
      "Strategic Planning"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "You are playing a new board game with three opponents. The game involves collecting resources, building structures, and attacking opponents. Each turn, players roll a die, gain resources based on the roll, then choose to build or attack. Resources are scarce, and attacks can severely set back an opponent. Describe a comprehensive strategy for how you would approach this game from the start to maximize your chances of winning. Consider resource management, when to attack (and whom), when to defend, and how to adapt to opponents' strategies.",
      "topic": "Game Theory & Strategy"
    }
  },
  {
    "id": "quest_14_comprehensive",
    "title": "The Paradox Labyrinth",
    "description": "Deconstruct a philosophical or logical paradox and explain its implications.",
    "zone": "game-lounge",
    "difficulty": 4,
    "expReward": 90,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.45,
      "problem_solving": 0.4,
      "stress_resistance": 0.4
    },
    "currencyReward": 180,
    "stressImpact": -28,
    "moodImpact": 18,
    "deadline": "6",
    "skills": [
      "Critical Thinking",
      "Logical Reasoning",
      "Abstract Thinking"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Explain Russell's Paradox in set theory. Describe its original formulation and how it revealed a fundamental problem in naive set theory. Discuss the implications of this paradox for the foundations of mathematics and how mathematicians resolved it (e.g., through axiomatic set theories like ZFC).",
      "topic": "Logical Paradoxes"
    }
  },
  {
    "id": "quest_15_comprehensive",
    "title": "Escape Room Blueprint",
    "description": "You are tasked with designing a logic-based puzzle for an escape room. Detail the puzzle's mechanics and solution.",
    "zone": "game-lounge",
    "difficulty": 4,
    "expReward": 95,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.48,
      "problem_solving": 0.45,
      "stress_resistance": 0.45
    },
    "currencyReward": 190,
    "stressImpact": -29,
    "moodImpact": 19,
    "deadline": "6",
    "skills": [
      "Critical Thinking",
      "Problem Solving",
      "Creativity",
      "Logical Reasoning"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Design a multi-step logic puzzle that could be the centerpiece of an escape room. Describe the theme, the initial setup, the clues provided to the players, the steps they must take to solve it, and the final solution. Explain the critical thinking and logical leaps required from the players at each stage. Ensure the puzzle is challenging but fair, with a clear, albeit hidden, logical path.",
      "topic": "Puzzle Design & Problem Creation"
    }
  },
  {
    "id": "quest_16_comprehensive",
    "title": "Data Decryption Challenge",
    "description": "A stream of seemingly random numbers and letters needs to be decoded. Identify the pattern and explain your methodology.",
    "zone": "game-lounge",
    "difficulty": 3,
    "expReward": 80,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.38,
      "problem_solving": 0.42,
      "stress_resistance": 0.35
    },
    "currencyReward": 160,
    "stressImpact": -26,
    "moodImpact": 16,
    "deadline": "5",
    "skills": [
      "Mathematical Aptitude",
      "Logical Reasoning",
      "Problem Solving",
      "Pattern Recognition"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "You are presented with the following sequence: 'A1, C4, F9, J16, O25, ___'. First, identify the underlying mathematical and alphabetical patterns. Then, determine the next element in the sequence. Finally, thoroughly explain the step-by-step methodology you used to decrypt this pattern, detailing both the letter and number progression.",
      "topic": "Cryptography & Pattern Analysis"
    }
  },
  {
    "id": "quest_17_comprehensive",
    "title": "Moral Dilemma Simulator",
    "description": "A simulated scenario presents a complex ethical dilemma. Analyze the situation, weigh the options, and justify your chosen course of action.",
    "zone": "game-lounge",
    "difficulty": 4,
    "expReward": 85,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.45,
      "problem_solving": 0.4,
      "stress_resistance": 0.4
    },
    "currencyReward": 170,
    "stressImpact": -27,
    "moodImpact": 17,
    "deadline": "6",
    "skills": [
      "Critical Thinking",
      "Ethical Reasoning",
      "Problem Solving",
      "Decision Making"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Imagine you are the captain of a spaceship carrying vital supplies to a colony, but your ship is damaged and losing power rapidly. You have enough power to either engage the emergency warp drive to reach the colony in time, but this will destroy your highly experimental (and irreplaceable) AI navigation system; OR conserve power, which means the AI system survives, but you will arrive too late and the colony will perish. Analyze this ethical dilemma, discussing the utilitarian versus deontological perspectives. Justify your decision, explaining the reasoning and values that led you to your chosen course of action.",
      "topic": "Ethical Decision Making"
    }
  },
  {
    "id": "quest_18_comprehensive",
    "title": "Resource Allocation Puzzle",
    "description": "Given limited resources (time, budget, manpower), devise an optimal plan to achieve a set of objectives. Justify your allocations.",
    "zone": "game-lounge",
    "difficulty": 3,
    "expReward": 70,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.35,
      "problem_solving": 0.38,
      "stress_resistance": 0.3
    },
    "currencyReward": 140,
    "stressImpact": -24,
    "moodImpact": 14,
    "deadline": "5",
    "skills": [
      "Mathematical Aptitude",
      "Problem Solving",
      "Critical Thinking",
      "Optimization"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "You are managing a small game development studio with a budget of $50,000 and a team of 5 developers for a 3-month project. You need to develop a new mobile puzzle game. Key tasks include: Game Design (medium effort), UI/UX (high effort), Programming (very high effort), Art Assets (high effort), Testing (medium effort), Marketing (low effort). Each developer can contribute to multiple tasks. Propose a detailed resource allocation plan (budget, time, manpower) to complete the project efficiently and effectively within the given constraints. Justify your choices for task prioritization and resource distribution, explaining how your plan optimizes for success.",
      "topic": "Optimization & Resource Management"
    }
  },
  {
    "id": "quest_19_comprehensive",
    "title": "Narrative Coherence Test",
    "description": "You are given a series of fragmented events. Reconstruct them into a coherent and logical narrative, explaining your reasoning for the sequence.",
    "zone": "game-lounge",
    "difficulty": 3,
    "expReward": 78,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.4,
      "problem_solving": 0.35,
      "stress_resistance": 0.3
    },
    "currencyReward": 155,
    "stressImpact": -25,
    "moodImpact": 15,
    "deadline": "5",
    "skills": [
      "Logical Reasoning",
      "Critical Thinking",
      "Pattern Recognition",
      "Storytelling"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "You find the following fragmented notes: 1. 'The generator sputtered and died.' 2. 'I heard a faint, rhythmic thumping from the forest.' 3. 'The old map showed a hidden spring nearby.' 4. 'With the power out, the security system failed.' 5. 'We decided to follow the sound, hoping for help.' 6. 'A small, glowing crystal pulsed gently by the spring.' Reconstruct these events into a logical and coherent short narrative. Explain your chosen sequence of events, highlighting the causal relationships and logical flow that informed your decision.",
      "topic": "Sequence & Narrative Logic"
    }
  },
  {
    "id": "quest_20_comprehensive",
    "title": "Predicting the Unpredictable",
    "description": "Analyze a dataset of past game outcomes and player behaviors. Identify underlying trends and predict the likely outcome of a future game, explaining your statistical approach.",
    "zone": "game-lounge",
    "difficulty": 4,
    "expReward": 92,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0,
      "critical_thinking_skill": 0.45,
      "problem_solving": 0.45,
      "stress_resistance": 0.4
    },
    "currencyReward": 185,
    "stressImpact": -28,
    "moodImpact": 18,
    "deadline": "6",
    "skills": [
      "Mathematical Aptitude",
      "Critical Thinking",
      "Data Analysis",
      "Predictive Modeling"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "You are given a simplified dataset of competitive online game matches, showing: Player A's Wins (W)/Losses (L) ratio: 7/3, Average K/D: 2.5. Player B's W/L ratio: 6/4, Average K/D: 1.8. Player C's W/L ratio: 8/2, Average K/D: 3.1. Team X (A and B) played 5 matches against Team Y (C and a random player), with Team X winning 3.  Now, Team X (A and B) is scheduled to play Team Z (C and Player D, whose stats are unknown). Based on the available data, predict the likely outcome of the Team X vs. Team Z match. Explain your statistical and logical reasoning, detailing which factors you prioritized and why, and acknowledge any limitations or assumptions in your prediction due to incomplete information.",
      "topic": "Data Analysis & Prediction"
    }
  },
  {
    "id": "quest_mcq_1a01",
    "title": "Mastering Meeting Agendas",
    "description": "Test your knowledge on the critical elements and best practices for creating effective meeting agendas.",
    "zone": "meeting-room",
    "difficulty": 2,
    "expReward": 20,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.2,
      "critical_thinking_skill": 0.1,
      "problem_solving": 0.1,
      "stress_resistance": 0.05
    },
    "currencyReward": 60,
    "stressImpact": 12,
    "moodImpact": -6,
    "deadline": "2",
    "skills": [
      "Communication",
      "Meeting Management",
      "Organization"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "What is the primary benefit of distributing a meeting agenda in advance?",
        "options": [
          "It allows attendees to prepare and contribute effectively.",
          "It formalizes the meeting process.",
          "It reduces the overall meeting time by half.",
          "It ensures all decisions are made before the meeting."
        ],
        "correct option": 0
      },
      {
        "question": "An effective agenda item should ideally include:",
        "options": [
          "Only a topic title.",
          "A topic, estimated time, and desired outcome.",
          "A list of all possible discussion points.",
          "Just the name of the presenter."
        ],
        "correct option": 1
      },
      {
        "question": "Which of these is NOT a good practice for agenda creation?",
        "options": [
          "Soliciting input from key participants.",
          "Allocating equal time to every topic regardless of importance.",
          "Grouping related topics together.",
          "Assigning a lead person for each agenda item."
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "quest_comprehensive_2b02",
    "title": "Navigating Difficult Feedback",
    "description": "You need to deliver constructive criticism to a peer. Develop a strategy to approach this sensitive situation effectively.",
    "zone": "meeting-room",
    "difficulty": 3,
    "expReward": 80,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.4,
      "critical_thinking_skill": 0.3,
      "problem_solving": 0.3,
      "stress_resistance": 0.25
    },
    "currencyReward": 160,
    "stressImpact": 25,
    "moodImpact": -15,
    "deadline": "5",
    "skills": [
      "Feedback Delivery",
      "Empathy",
      "Communication",
      "Conflict Prevention"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Imagine you've noticed a team member consistently missing minor deadlines, impacting your team's overall progress. This person is generally well-liked and receptive, but you know this feedback might be sensitive. Outline a step-by-step plan for how you would approach this person to deliver constructive feedback. What specific opening statements would you use? How would you structure the conversation to ensure it's productive and not accusatory? What actions would you propose to help them improve, and how would you follow up? Consider the 'Situation-Behavior-Impact' model in your answer.",
      "topic": "Delivering Constructive Feedback"
    }
  },
  {
    "id": "quest_typing_3c03",
    "title": "Summarizing Project Updates",
    "description": "Draft a concise email summarizing the key updates from the latest project status meeting.",
    "zone": "meeting-room",
    "difficulty": 2,
    "expReward": 60,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.2,
      "critical_thinking_skill": 0,
      "problem_solving": 0.05,
      "stress_resistance": 0.1
    },
    "currencyReward": 120,
    "stressImpact": 20,
    "moodImpact": -10,
    "deadline": "4",
    "skills": [
      "Written Communication",
      "Summarization",
      "Clarity",
      "Time Management"
    ],
    "type": "Typing",
    "question_data": {
      "question": "Type the following paragraph, summarizing a project update: 'During our recent Project Phoenix status meeting, the team confirmed successful completion of Phase 1, marking a significant milestone. Key achievements include finalization of the user interface design and integration of core database functionalities. A minor delay was noted in securing third-party vendor agreements for advanced analytics, pushing back the estimated completion for that specific task by three days. John Doe is tasked with accelerating vendor negotiations, with a new target completion of next Wednesday. We remain on track for overall project delivery. Next review is scheduled for Friday.'",
      "time": 45
    }
  },
  {
    "id": "quest_mcq_4a04",
    "title": "Team Collaboration Essentials",
    "description": "Assess your understanding of fostering productive collaboration within a team.",
    "zone": "meeting-room",
    "difficulty": 2,
    "expReward": 22,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.25,
      "critical_thinking_skill": 0.1,
      "problem_solving": 0.1,
      "stress_resistance": 0.05
    },
    "currencyReward": 65,
    "stressImpact": 13,
    "moodImpact": -7,
    "deadline": "3",
    "skills": [
      "Collaboration",
      "Teamwork",
      "Active Listening"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which factor is most crucial for effective team collaboration?",
        "options": [
          "Individual productivity metrics",
          "Clear communication and shared goals",
          "Strict adherence to hierarchy",
          "Minimizing social interactions"
        ],
        "correct option": 1
      },
      {
        "question": "When a team member is struggling with a task, the best approach is to:",
        "options": [
          "Assign the task to someone else.",
          "Offer support and ask how you can help.",
          "Criticize their performance publicly.",
          "Ignore the issue and hope it resolves itself."
        ],
        "correct option": 1
      },
      {
        "question": "What is the role of active listening in team discussions?",
        "options": [
          "To prepare your own rebuttal.",
          "To demonstrate authority.",
          "To fully understand and acknowledge others' perspectives.",
          "To speed up the conversation."
        ],
        "correct option": 2
      }
    ]
  },
  {
    "id": "quest_comprehensive_5b05",
    "title": "Handling Client Expectations",
    "description": "Formulate a response plan for a situation where client expectations deviate from project scope.",
    "zone": "meeting-room",
    "difficulty": 4,
    "expReward": 95,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.45,
      "critical_thinking_skill": 0.4,
      "problem_solving": 0.4,
      "stress_resistance": 0.3
    },
    "currencyReward": 190,
    "stressImpact": 29,
    "moodImpact": -19,
    "deadline": "6",
    "skills": [
      "Negotiation",
      "Client Management",
      "Problem Solving",
      "Strategic Communication"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Your team has been working on a project with a clearly defined scope. Midway through, the client expresses a desire for significant new features that were not part of the original agreement, citing 'evolving business needs.' Implementing these changes would require substantial additional resources and extend the project timeline considerably. How would you handle this situation? Detail your approach for communicating with the client, negotiating the changes (if possible), and protecting your team's resources and existing commitments. What are the potential risks, and how would you mitigate them?",
      "topic": "Client Scope Creep Management"
    }
  },
  {
    "id": "quest_typing_6c06",
    "title": "Drafting an Apology Email",
    "description": "Compose a professional and empathetic apology email for a minor project delay.",
    "zone": "meeting-room",
    "difficulty": 3,
    "expReward": 70,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.3,
      "critical_thinking_skill": 0,
      "problem_solving": 0.1,
      "stress_resistance": 0.15
    },
    "currencyReward": 140,
    "stressImpact": 24,
    "moodImpact": -14,
    "deadline": "5",
    "skills": [
      "Written Communication",
      "Professionalism",
      "Empathy",
      "Crisis Communication"
    ],
    "type": "Typing",
    "question_data": {
      "question": "Type a professional apology email to a client for a minor delay in delivering a report. The email should acknowledge the delay, briefly explain the unforeseen technical issue (without making excuses), apologize for any inconvenience, and clearly state the new delivery time. Keep the tone professional and reassuring. Start with: 'Dear [Client Name], I am writing to sincerely apologize for the delay in sending you the quarterly performance report.'",
      "time": 60
    }
  },
  {
    "id": "quest_mcq_7a07",
    "title": "Leadership Styles",
    "description": "Identify appropriate leadership styles for different team and project scenarios.",
    "zone": "meeting-room",
    "difficulty": 3,
    "expReward": 28,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.35,
      "critical_thinking_skill": 0.2,
      "problem_solving": 0.15,
      "stress_resistance": 0.1
    },
    "currencyReward": 85,
    "stressImpact": 18,
    "moodImpact": -9,
    "deadline": "4",
    "skills": [
      "Leadership",
      "Team Management",
      "Decision Making"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "Which leadership style is best suited for a highly experienced and self-motivated team?",
        "options": [
          "Autocratic",
          "Laissez-faire",
          "Democratic",
          "Transactional"
        ],
        "correct option": 1
      },
      {
        "question": "In a crisis situation requiring immediate action, which leadership style might be most effective?",
        "options": [
          "Participative",
          "Transformational",
          "Autocratic",
          "Coaching"
        ],
        "correct option": 2
      },
      {
        "question": "A leader who focuses on employee growth and development, inspiring them to achieve their full potential, practices what type of leadership?",
        "options": [
          "Servant leadership",
          "Bureaucratic leadership",
          "Situational leadership",
          "Charismatic leadership"
        ],
        "correct option": 0
      }
    ]
  },
  {
    "id": "quest_comprehensive_8b08",
    "title": "Mediating Team Disagreement",
    "description": "Formulate a strategy to mediate a significant disagreement between two key team members.",
    "zone": "meeting-room",
    "difficulty": 4,
    "expReward": 90,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.45,
      "critical_thinking_skill": 0.4,
      "problem_solving": 0.35,
      "stress_resistance": 0.3
    },
    "currencyReward": 180,
    "stressImpact": 28,
    "moodImpact": -18,
    "deadline": "6",
    "skills": [
      "Conflict Resolution",
      "Mediation",
      "Active Listening",
      "Negotiation"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "You oversee two team leads, Sarah and David, who are clashing over resource allocation for their respective sub-projects. Both believe their project is higher priority and are unwilling to compromise, leading to project delays and a strained team atmosphere. Describe your approach to mediating this disagreement. What steps would you take before the mediation meeting? What questions would you ask during the meeting to understand each perspective and facilitate a resolution? How would you ensure a fair outcome and maintain positive working relationships afterward?",
      "topic": "Inter-Team Conflict Resolution"
    }
  },
  {
    "id": "quest_typing_9c09",
    "title": "Writing a Project Proposal Introduction",
    "description": "Draft an engaging introduction for a new project proposal, outlining its purpose and benefits.",
    "zone": "meeting-room",
    "difficulty": 3,
    "expReward": 65,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.25,
      "critical_thinking_skill": 0.1,
      "problem_solving": 0.05,
      "stress_resistance": 0.1
    },
    "currencyReward": 130,
    "stressImpact": 22,
    "moodImpact": -12,
    "deadline": "4",
    "skills": [
      "Business Writing",
      "Persuasion",
      "Clarity",
      "Conciseness"
    ],
    "type": "Typing",
    "question_data": {
      "question": "Type the introductory paragraph for a project proposal aimed at implementing a new customer feedback system. The introduction should highlight the current challenges with customer feedback, the main goal of the new system, and its anticipated benefits for the company. Start with: 'This proposal outlines the implementation of a comprehensive new Customer Feedback System aimed at revolutionizing our understanding of client needs.'",
      "time": 50
    }
  },
  {
    "id": "quest_mcq_10a10",
    "title": "Email Etiquette Basics",
    "description": "Test your knowledge of professional email writing and etiquette.",
    "zone": "meeting-room",
    "difficulty": 1,
    "expReward": 15,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.15,
      "critical_thinking_skill": 0.05,
      "problem_solving": 0.05,
      "stress_resistance": 0
    },
    "currencyReward": 50,
    "stressImpact": 10,
    "moodImpact": -5,
    "deadline": "2",
    "skills": [
      "Written Communication",
      "Professionalism",
      "Attention to Detail"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "What is the appropriate tone for most professional emails?",
        "options": [
          "Informal and conversational",
          "Strictly formal and impersonal",
          "Respectful, clear, and concise",
          "Casual with emojis"
        ],
        "correct option": 2
      },
      {
        "question": "When should you use 'Reply All'?",
        "options": [
          "Always, to keep everyone in the loop.",
          "Only when your response is relevant to everyone on the original email.",
          "Never, it's unprofessional.",
          "Only when you want to make a public statement."
        ],
        "correct option": 1
      },
      {
        "question": "What is the best practice for an email subject line?",
        "options": [
          "Leave it blank for suspense.",
          "Make it vague so recipients open the email.",
          "Be clear, concise, and indicative of content.",
          "Use all caps to grab attention."
        ],
        "correct option": 2
      }
    ]
  },
  {
    "id": "quest_comprehensive_11b11",
    "title": "Leading a Remote Team",
    "description": "Develop strategies for fostering collaboration and maintaining morale in a remote work environment.",
    "zone": "meeting-room",
    "difficulty": 3,
    "expReward": 85,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.35,
      "critical_thinking_skill": 0.3,
      "problem_solving": 0.25,
      "stress_resistance": 0.2
    },
    "currencyReward": 170,
    "stressImpact": 26,
    "moodImpact": -16,
    "deadline": "5",
    "skills": [
      "Remote Leadership",
      "Communication",
      "Team Building",
      "Digital Collaboration"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "You are tasked with leading a new project team composed entirely of remote workers spread across different time zones. What specific strategies would you implement to ensure effective communication, foster a sense of team cohesion, and manage productivity without the benefit of in-person interactions? Consider tools, meeting cadences, feedback mechanisms, and ways to address potential isolation or burnout. How would you handle potential communication gaps due to time differences?",
      "topic": "Remote Team Management"
    }
  },
  {
    "id": "quest_typing_12c12",
    "title": "Writing a Performance Review Summary",
    "description": "Type a summary section for an employee's performance review, highlighting achievements and areas for growth.",
    "zone": "meeting-room",
    "difficulty": 4,
    "expReward": 75,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.35,
      "critical_thinking_skill": 0.15,
      "problem_solving": 0.1,
      "stress_resistance": 0.2
    },
    "currencyReward": 150,
    "stressImpact": 26,
    "moodImpact": -16,
    "deadline": "6",
    "skills": [
      "Professional Writing",
      "Performance Management",
      "Objective Assessment",
      "Empathy"
    ],
    "type": "Typing",
    "question_data": {
      "question": "Type the following summary for a hypothetical performance review for an employee named 'Jane Doe'. This summary should capture her strong analytical skills and collaboration, while also noting an area for improvement in proactive communication during project challenges. 'Jane Doe consistently demonstrates exceptional analytical skills, providing valuable insights that have significantly contributed to the success of two major projects this quarter. Her collaborative approach and willingness to assist team members are highly commendable. An area for development is enhancing proactive communication when encountering unforeseen obstacles; more timely updates would allow for quicker mitigation and support. With continued focus on communication, Jane is on track for excellent growth within the company.'",
      "time": 60
    }
  },
  {
    "id": "quest_mcq_13a13",
    "title": "Running Engaging Meetings",
    "description": "Learn techniques to make meetings more interactive and productive.",
    "zone": "meeting-room",
    "difficulty": 2,
    "expReward": 25,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.25,
      "critical_thinking_skill": 0.15,
      "problem_solving": 0.1,
      "stress_resistance": 0.05
    },
    "currencyReward": 70,
    "stressImpact": 14,
    "moodImpact": -7,
    "deadline": "3",
    "skills": [
      "Facilitation",
      "Engagement",
      "Public Speaking"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "To increase participant engagement in a meeting, you should:",
        "options": [
          "Do all the talking yourself.",
          "Assign pre-work and encourage questions.",
          "Keep the meeting as short as possible, even if topics are rushed.",
          "Only involve senior management in discussions."
        ],
        "correct option": 1
      },
      {
        "question": "What is a 'parking lot' in the context of a meeting?",
        "options": [
          "A place to store cars.",
          "A tool to defer off-topic but important discussions for later.",
          "A section of the agenda for quick announcements.",
          "A game played during breaks."
        ],
        "correct option": 1
      },
      {
        "question": "How can you effectively manage dominant personalities in a meeting?",
        "options": [
          "Ignore them completely.",
          "Let them control the conversation.",
          "Politely interrupt and invite others to speak.",
          "Publicly reprimand them."
        ],
        "correct option": 2
      }
    ]
  },
  {
    "id": "quest_comprehensive_14b14",
    "title": "Crisis Communication Strategy",
    "description": "Develop a communication plan for a sudden, unexpected negative event impacting your company.",
    "zone": "meeting-room",
    "difficulty": 4,
    "expReward": 100,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.5,
      "critical_thinking_skill": 0.45,
      "problem_solving": 0.45,
      "stress_resistance": 0.4
    },
    "currencyReward": 200,
    "stressImpact": 30,
    "moodImpact": -20,
    "deadline": "6",
    "skills": [
      "Crisis Management",
      "Public Relations",
      "Strategic Communication",
      "Decision Making Under Pressure"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Your company has just experienced a data breach, potentially compromising sensitive customer information. The news is about to break to the public. As a communication leader, outline your immediate and short-term (within 48 hours) crisis communication strategy. Whom would you inform internally first, and how? What would be the key messages for employees, customers, and the public? What communication channels would you utilize? How would you prepare spokespersons, and what are the crucial dos and don'ts for public statements in such a sensitive situation?",
      "topic": "Crisis Communication Planning"
    }
  },
  {
    "id": "quest_typing_15c15",
    "title": "Drafting a Quarterly Report Excerpt",
    "description": "Type a section of a quarterly business report, focusing on market trends and their impact.",
    "zone": "meeting-room",
    "difficulty": 3,
    "expReward": 68,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.25,
      "critical_thinking_skill": 0.15,
      "problem_solving": 0.1,
      "stress_resistance": 0.15
    },
    "currencyReward": 135,
    "stressImpact": 23,
    "moodImpact": -13,
    "deadline": "5",
    "skills": [
      "Business Reporting",
      "Analytical Writing",
      "Data Interpretation",
      "Conciseness"
    ],
    "type": "Typing",
    "question_data": {
      "question": "Type the following excerpt for a quarterly business report: 'This quarter, we observed a significant acceleration in consumer preference for subscription-based services across our target demographics. This trend, fueled by increased digital adoption and a desire for flexible access, presents both an opportunity and a challenge. While our current product offerings are largely transaction-based, a pivot towards subscription models could unlock new revenue streams and enhance customer loyalty. However, it necessitates a re-evaluation of our infrastructure and a substantial marketing shift. We recommend forming a task force to explore this potential market adaptation in Q3.'",
      "time": 55
    }
  },
  {
    "id": "quest_mcq_16a16",
    "title": "Effective Presentation Skills",
    "description": "Understand the core components of delivering an impactful presentation.",
    "zone": "meeting-room",
    "difficulty": 2,
    "expReward": 25,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.3,
      "critical_thinking_skill": 0.15,
      "problem_solving": 0.1,
      "stress_resistance": 0.1
    },
    "currencyReward": 75,
    "stressImpact": 15,
    "moodImpact": -8,
    "deadline": "3",
    "skills": [
      "Presentation Skills",
      "Public Speaking",
      "Storytelling",
      "Confidence"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "What is a key element of a strong presentation opening?",
        "options": [
          "Jumping straight into detailed data.",
          "A strong hook that grabs the audience's attention.",
          "An apology for being there.",
          "Reading directly from your slides."
        ],
        "correct option": 1
      },
      {
        "question": "When delivering a presentation, effective body language includes:",
        "options": [
          "Standing rigid with arms crossed.",
          "Maintaining eye contact and using open gestures.",
          "Pacing rapidly across the stage.",
          "Looking at your notes exclusively."
        ],
        "correct option": 1
      },
      {
        "question": "Why is it important to know your audience before a presentation?",
        "options": [
          "To personalize your message and address their interests.",
          "To determine how long you can speak.",
          "To decide if you need to bring snacks.",
          "It's not important, content is king."
        ],
        "correct option": 0
      }
    ]
  },
  {
    "id": "quest_comprehensive_17b17",
    "title": "Managing Team Resistance to Change",
    "description": "Develop a strategy to introduce and implement a significant organizational change amidst team apprehension.",
    "zone": "meeting-room",
    "difficulty": 4,
    "expReward": 95,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.45,
      "critical_thinking_skill": 0.4,
      "problem_solving": 0.35,
      "stress_resistance": 0.3
    },
    "currencyReward": 190,
    "stressImpact": 29,
    "moodImpact": -19,
    "deadline": "6",
    "skills": [
      "Change Management",
      "Leadership",
      "Influence",
      "Empathy",
      "Strategic Communication"
    ],
    "type": "Comprehensive",
    "question_data": {
      "question": "Your department is implementing a new workflow system that will significantly alter how daily tasks are performed. Initial feedback from the team indicates strong resistance due to fear of the unknown, potential job role changes, and a perceived increase in workload. As the lead, how would you manage this resistance to ensure a smooth transition and successful adoption of the new system? Detail your communication plan, training strategy, and methods for addressing individual concerns. What leadership approaches would be most effective during this period of change?",
      "topic": "Change Management"
    }
  },
  {
    "id": "quest_typing_18c18",
    "title": "Writing a Professional Memo",
    "description": "Type a professional memo announcing a new company policy regarding remote work guidelines.",
    "zone": "meeting-room",
    "difficulty": 2,
    "expReward": 60,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.2,
      "critical_thinking_skill": 0.05,
      "problem_solving": 0.05,
      "stress_resistance": 0.1
    },
    "currencyReward": 120,
    "stressImpact": 21,
    "moodImpact": -11,
    "deadline": "4",
    "skills": [
      "Formal Communication",
      "Policy Articulation",
      "Clarity",
      "Conciseness"
    ],
    "type": "Typing",
    "question_data": {
      "question": "Type a formal memo to all employees announcing updated guidelines for remote work, effective next Monday. The memo should briefly explain the reasoning (e.g., to ensure fairness and productivity), mention key changes (e.g., requiring specific core hours or attendance at weekly in-office meetings), and direct employees to a more detailed document for full information. Use 'MEMORANDUM' as the heading. Start with: 'To: All Employees'",
      "time": 40
    }
  },
  {
    "id": "quest_mcq_19a19",
    "title": "Negotiation Fundamentals",
    "description": "Explore the basic principles and tactics of effective negotiation.",
    "zone": "meeting-room",
    "difficulty": 3,
    "expReward": 28,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.35,
      "critical_thinking_skill": 0.2,
      "problem_solving": 0.15,
      "stress_resistance": 0.1
    },
    "currencyReward": 80,
    "stressImpact": 16,
    "moodImpact": -8,
    "deadline": "4",
    "skills": [
      "Negotiation",
      "Persuasion",
      "Strategic Thinking"
    ],
    "type": "MCQ",
    "question_data": [
      {
        "question": "What does BATNA stand for in negotiation?",
        "options": [
          "Best Alternative to a Negotiated Agreement",
          "Basic Agreement Towards New Actions",
          "Binary Analysis of Team Needs and Assets",
          "Bold Approach to Tough Negotiations"
        ],
        "correct option": 0
      },
      {
        "question": "Which of these is a common mistake in negotiation?",
        "options": [
          "Preparing thoroughly before the negotiation.",
          "Listening actively to the other party's needs.",
          "Making the first offer without proper research.",
          "Focusing on mutual gain."
        ],
        "correct option": 2
      },
      {
        "question": "In a win-win negotiation, the goal is to:",
        "options": [
          "Ensure your side gets everything it wants.",
          "Find a solution that satisfies both parties' core interests.",
          "Compromise on all major points.",
          "Force the other party to concede."
        ],
        "correct option": 1
      }
    ]
  },
  {
    "id": "quest_typing_20c20",
    "title": "Transcribing Meeting Action Items",
    "description": "Accurately type a list of action items and their owners from a recorded discussion.",
    "zone": "meeting-room",
    "difficulty": 1,
    "expReward": 55,
    "proficiency": {
      "coding_skill": 0,
      "soft_skill": 0.15,
      "critical_thinking_skill": 0,
      "problem_solving": 0,
      "stress_resistance": 0.05
    },
    "currencyReward": 110,
    "stressImpact": 18,
    "moodImpact": -9,
    "deadline": "3",
    "skills": [
      "Note Taking",
      "Accuracy",
      "Attention to Detail",
      "Time Management"
    ],
    "type": "Typing",
    "question_data": {
      "question": "Type the following list of action items accurately: '1. Sarah: Finalize Q4 budget proposal by end of day Friday. 2. Mark: Schedule follow-up meeting with vendor 'Innovate Solutions' for next Tuesday. 3. Emily: Prepare draft presentation for board review, due Monday morning. 4. Team: Review competitor analysis report by Wednesday COB and provide feedback to John.'",
      "time": 30
    }
  }
]

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