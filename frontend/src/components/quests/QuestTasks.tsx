import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, X, Code, Brain, Users, CheckCircle } from 'lucide-react';
import { Quest } from '../../types/game';

interface QuestTasksProps {
  quest: Quest;
  onComplete: (success: boolean, score: number) => void;
}

// Different task types based on zone
export function QuestTasks({ quest, onComplete }: QuestTasksProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate tasks based on zone
  const getTasks = () => {
    switch (quest.zone) {
      case 'workspace':
        return getWorkspaceTasks(quest.difficulty);
      case 'game-lounge':
        return getGameLoungeTasks(quest.difficulty);
      case 'meeting-room':
        return getMeetingRoomTasks(quest.difficulty);
      default:
        return getWorkspaceTasks(quest.difficulty);
    }
  };

  const tasks = getTasks();
  const totalTasks = tasks.length;

  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Calculate score based on correct answers
    let correctAnswers = 0;
    tasks.forEach((task, index) => {
      if (answers[index] === task.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalTasks) * 100);
    const success = score >= 60; // 60% passing grade

    setTimeout(() => {
      onComplete(success, score);
    }, 2000);
  };

  const handleNext = () => {
    if (currentTask < totalTasks - 1) {
      setCurrentTask(currentTask + 1);
    } else {
      handleSubmit();
    }
  };

  const currentTaskData = tasks[currentTask];
  const isAnswered = answers[currentTask] !== undefined;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Task {currentTask + 1} of {totalTasks}</span>
          <span className="text-white">{Math.round(((currentTask + 1) / totalTasks) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentTask + 1) / totalTasks) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {!isSubmitted ? (
        <>
          {/* Task Content */}
          <motion.div
            key={currentTask}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              {quest.zone === 'workspace' && <Code className="w-5 h-5 text-blue-400" />}
              {quest.zone === 'game-lounge' && <Brain className="w-5 h-5 text-purple-400" />}
              {quest.zone === 'meeting-room' && <Users className="w-5 h-5 text-orange-400" />}
              <h3 className="text-white">{currentTaskData.question}</h3>
            </div>

            <div className="space-y-3">
              {currentTaskData.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setAnswers({ ...answers, [currentTask]: index })}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentTask] === index
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                  }`}
                >
                  <span className="text-white">{String.fromCharCode(65 + index)}. {option}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentTask(Math.max(0, currentTask - 1))}
              disabled={currentTask === 0}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentTask === totalTasks - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 rounded-xl p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl text-white mb-2">Processing Results...</h3>
          <p className="text-gray-400">Evaluating your performance</p>
        </motion.div>
      )}
    </div>
  );
}

// Workspace coding tasks
function getWorkspaceTasks(difficulty: number) {
  const easyTasks = [
    {
      question: "What is the correct way to declare a variable in JavaScript?",
      options: [
        "variable x = 5;",
        "let x = 5;",
        "dim x = 5;",
        "int x = 5;"
      ],
      correctAnswer: 1
    },
    {
      question: "Which method is used to add an element to the end of an array?",
      options: [
        "append()",
        "add()",
        "push()",
        "insert()"
      ],
      correctAnswer: 2
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      correctAnswer: 2
    }
  ];

  const mediumTasks = [
    {
      question: "What is the time complexity of binary search?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n²)",
        "O(1)"
      ],
      correctAnswer: 1
    },
    {
      question: "Which design pattern ensures a class has only one instance?",
      options: [
        "Factory Pattern",
        "Observer Pattern",
        "Singleton Pattern",
        "Strategy Pattern"
      ],
      correctAnswer: 2
    },
    {
      question: "What is the purpose of async/await in JavaScript?",
      options: [
        "To make code run faster",
        "To handle asynchronous operations",
        "To create multiple threads",
        "To optimize memory usage"
      ],
      correctAnswer: 1
    }
  ];

  const hardTasks = [
    {
      question: "What is the main advantage of using a B-tree over a binary search tree?",
      options: [
        "Faster insertion",
        "Better for disk-based storage",
        "Uses less memory",
        "Easier to implement"
      ],
      correctAnswer: 1
    },
    {
      question: "In distributed systems, what does CAP theorem state?",
      options: [
        "You can have Consistency, Availability, and Partition tolerance",
        "You can only guarantee 2 out of 3: Consistency, Availability, Partition tolerance",
        "You must prioritize Consistency over Availability",
        "Partition tolerance is always guaranteed"
      ],
      correctAnswer: 1
    }
  ];

  if (difficulty <= 2) return easyTasks.slice(0, 3);
  if (difficulty <= 3) return mediumTasks.slice(0, 3);
  return hardTasks.concat(mediumTasks.slice(0, 1));
}

// Game Lounge logic puzzles
function getGameLoungeTasks(difficulty: number) {
  const easyTasks = [
    {
      question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies. True or False?",
      options: [
        "True",
        "False",
        "Cannot be determined",
        "Only sometimes true"
      ],
      correctAnswer: 0
    },
    {
      question: "What number comes next in the sequence: 2, 4, 8, 16, ?",
      options: [
        "24",
        "32",
        "28",
        "20"
      ],
      correctAnswer: 1
    },
    {
      question: "Which word doesn't belong: Apple, Banana, Orange, Carrot",
      options: [
        "Apple",
        "Banana",
        "Orange",
        "Carrot"
      ],
      correctAnswer: 3
    }
  ];

  const mediumTasks = [
    {
      question: "A bat and ball cost $1.10 total. The bat costs $1 more than the ball. How much does the ball cost?",
      options: [
        "$0.10",
        "$0.05",
        "$0.15",
        "$0.20"
      ],
      correctAnswer: 1
    },
    {
      question: "What comes next: J, F, M, A, M, J, J, ?",
      options: [
        "A",
        "S",
        "O",
        "D"
      ],
      correctAnswer: 0
    },
    {
      question: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
      options: [
        "100 minutes",
        "20 minutes",
        "10 minutes",
        "5 minutes"
      ],
      correctAnswer: 3
    }
  ];

  if (difficulty <= 2) return easyTasks;
  return mediumTasks;
}

// Meeting Room soft skills scenarios
function getMeetingRoomTasks(difficulty: number) {
  const tasks = [
    {
      question: "A colleague is consistently late to your meetings. What's the best approach?",
      options: [
        "Ignore it and start meetings on time anyway",
        "Publicly call them out during the next meeting",
        "Have a private conversation to understand their situation",
        "Report them to management immediately"
      ],
      correctAnswer: 2
    },
    {
      question: "During a presentation, someone asks a question you don't know the answer to. What should you do?",
      options: [
        "Make up an answer to seem knowledgeable",
        "Admit you don't know and offer to follow up",
        "Deflect the question to someone else",
        "Dismiss the question as irrelevant"
      ],
      correctAnswer: 1
    },
    {
      question: "Your team is divided on a technical decision. How do you move forward?",
      options: [
        "Make the decision yourself as the leader",
        "Go with the majority vote",
        "Facilitate a discussion to find common ground",
        "Escalate to upper management"
      ],
      correctAnswer: 2
    },
    {
      question: "A client is upset about a missed deadline. What's your first response?",
      options: [
        "Explain why it's not your fault",
        "Blame team members who were responsible",
        "Listen to their concerns and apologize",
        "Ignore the complaint and focus on fixing it"
      ],
      correctAnswer: 2
    }
  ];

  return tasks.slice(0, difficulty <= 2 ? 3 : 4);
}
