import { Problem, SupportedLanguage, EvaluationResult,Question, Attempt, ComprehensionEvaluationResult } from "../types/types";

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetches the current problem from the DB if it exists.
 */
export const getCurrentProblem = async (): Promise<Problem> => {
  try {
    const url = `${API_BASE_URL}/problem`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server Error: ${response.status}`);
    }

    const data = await response.json();
    return { ...data };
  } catch (error) {
    console.error("Backend API Error (Get Current Problem):", error);
    throw error;
  }
};

export const runCustomTestCase = async (problemTitle: string, userCode: string, language: SupportedLanguage, customInput: string): Promise<{ output: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/run-custom`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemTitle, userCode, language, customInput })
    });
    if (!response.ok) return { output: '', error: 'Failed to connect to backend.' };
    return await response.json();
  } catch (e) {
    return { output: '', error: 'Network error executing custom test.' };
  }
};

export const evaluateSolution = async (problem: Problem, userCode: string, language: SupportedLanguage, isSubmission: boolean): Promise<EvaluationResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/evaluate`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem, userCode, language, isSubmission })
    });
    if (!response.ok) throw new Error("Evaluation request failed");
    return await response.json();
  } catch (error) {
    return {
      passedAll: false, score: 0, totalTests: 0, results: [],
      feedback: "System Error: Could not connect to the backend server.", runtime: "N/A", memory: "N/A"
    };
  }
};

export const getAiAssistance = async (problem: Problem, userCode: string, query: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hint`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem, userCode, query })
    });
    if (!response.ok) return "Backend AI service unavailable.";
    const data = await response.json();
    return data.text || "No response generated.";
  } catch (e) {
    return "Error connecting to AI backend.";
  }
};


export const evaluateSubmission = async (question: Question, answer: string): Promise<Attempt> => {
  try {
    // Step 1: Get AI Evaluation
    const evalResponse = await fetch(`${API_BASE_URL}/evaluate_comprehensive`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        question: question, 
        user_answer: answer 
      }),
    });

    if (!evalResponse.ok) {
      throw new Error(`Evaluation failed: ${evalResponse.statusText}`);
    }

    const evaluationData: ComprehensionEvaluationResult = await evalResponse.json();

    // Step 2: Construct the Full Attempt Object
    const newAttempt: Attempt = {
        id: crypto.randomUUID(),
        // FIX IS HERE: Use Date.now() to return a number, not a string/Date
        timestamp: Date.now(), 
        question: question,
        userAnswer: answer,
        evaluation: evaluationData
    };


    return newAttempt;

  } catch (error) {
    console.error("Error in evaluateSubmission:", error);
    throw error;
  }
};

export const fetchHistory = async (): Promise<Attempt[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/attempts`);
    if (!response.ok) throw new Error("Failed to fetch history");
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};