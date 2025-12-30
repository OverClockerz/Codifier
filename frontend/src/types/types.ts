export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export enum SupportedLanguage {
  Python = "python",
  Java = "java",
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  topics: string[];
  constraints: string[];
  boilerplates: Record<SupportedLanguage, string>;
  examples: {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }[];
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }[];
}

export interface EvaluationResult {
  passedAll: boolean;
  score: number;
  totalTests: number;
  feedback: string;
  runtime: string;
  memory: string;
  results: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    error?: string;
    consoleOutput?: string;
    isHidden?: boolean; // Added this field
  }[];
}


export interface Question {
  id: string;
  text: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timestamp: number;
}

export interface ComprehensionEvaluationResult {
  score: number; // 0-100
  spellingErrors: string[];
  technicalAccuracy: string;
  improvedAnswer: string;
  keyConceptsMissed: string[];
  isCorrect: boolean;
}

export interface Attempt {
  id: string;
  question: Question;
  userAnswer: string;
  evaluation: EvaluationResult;
  timestamp: number;
}

export interface UserFeedback {
  id: string;
  attemptId: string;
  rating: number; // 1-5 stars
  comment?: string;
  timestamp: number;
}

// Enum for API States
export enum Status {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// For simulation of the requested backend structure
export interface MockDatabase {
  attempts: Attempt[];
}
