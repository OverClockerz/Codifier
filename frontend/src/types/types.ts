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