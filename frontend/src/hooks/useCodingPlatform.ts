import { useState, useEffect } from 'react';
import { getCurrentProblem, evaluateSolution, getAiAssistance, runCustomTestCase } from '../services/geminiService';
import { Problem, SupportedLanguage, EvaluationResult } from '../types/types';

export const useCodingPlatform = (initialProblem?: Problem) => {
  // State
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // UPDATED: Removed 'console' from the allowed tabs
  const [activeTab, setActiveTab] = useState<'test-cases' | 'custom'>('test-cases');
  
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [backendError, setBackendError] = useState<string | null>(null);
  
  // Custom Test State
  const [customInput, setCustomInput] = useState<string>('');
  const [customOutput, setCustomOutput] = useState<{ output: string; error?: string } | null>(null);

  // Settings
  // const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [language, setLanguage] = useState<SupportedLanguage>(SupportedLanguage.Python);
  const [topic, setTopic] = useState<string>('');

  // Confirmation Dialog State
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<SupportedLanguage | null>(null);
  const [ranTests, setRanTests] = useState<boolean>(false);

  // Initial Load: Check DB for existing problem
  useEffect(() => {
    if (initialProblem) {
      setProblem(initialProblem);
      setCode(initialProblem.boilerplates[language]);
      if (initialProblem.examples && initialProblem.examples.length > 0) {
        setCustomInput(initialProblem.examples[0].input);
      }
    } else {
      fetchInitialProblem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInitialProblem = async () => {
    setIsGenerating(true);
    setBackendError(null);
    try {
      const data = await getCurrentProblem();
      setProblem(data);
      setCode(data.boilerplates[language]);
      
      if (data.examples.length > 0) {
        setCustomInput(data.examples[0].input);
      }
    } catch (error: any) {
      console.error("Failed to load initial problem", error);
      setBackendError("Could not connect to backend. Ensure 'app.py' is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  // const handleGenerateProblem = async () => {
  //   setIsGenerating(true);
  //   setEvaluation(null);
  //   setAiMessage('');
  //   setCustomOutput(null);
  //   setBackendError(null);
  //   try {
  //     const newProblem = await generateProblem(difficulty, topic);
  //     setProblem(newProblem);
  //     setCode(newProblem.boilerplates[language]);
      
  //     if (newProblem.examples.length > 0) {
  //       setCustomInput(newProblem.examples[0].input);
  //     }
  //   } catch (error: any) {
  //     console.error("Failed to generate", error);
  //     setBackendError("Failed to generate new problem. Backend may be offline.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const initiateLanguageChange = (newLang: SupportedLanguage) => {
    if (newLang === language) return;
    if (problem && code.trim() !== problem.boilerplates[language].trim() && code.length > 20) {
      setPendingLanguage(newLang);
      setShowConfirmDialog(true);
    } else {
      executeLanguageChange(newLang);
    }
  };

  const executeLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    if (problem) {
      setCode(problem.boilerplates[newLang]);
      setEvaluation(null); 
    }
    setShowConfirmDialog(false);
    setPendingLanguage(null);
  };

  const handleRunCode = async (isSubmission: boolean) => {
    if (!problem) return;
    setIsRunning(true);
    setBackendError(null);
    
    try {
      if (activeTab === 'custom' && !isSubmission) {
        const result = await runCustomTestCase(problem.title, code, language, customInput);
        if (result.error && result.error.includes("Failed to connect")) {
           setBackendError("Backend disconnected. Cannot run code.");
        }
        setCustomOutput(result);
      } else {
        if (!isSubmission) setActiveTab('test-cases');
        else setActiveTab('test-cases'); 

        const result = await evaluateSolution(problem, code, language, isSubmission);
        setEvaluation(result);
        if (!isSubmission) setRanTests(true);
        // return result so callers can act on submission results
        return result;
      }
    } catch (error) {
      console.error("Evaluation failed", error);
      setBackendError("Evaluation failed. Check backend connection.");
    } finally {
      setIsRunning(false);
    }
    return null;
  };

  const handleAiAssist = async () => {
    if (!problem) return;
    setAiMessage("Thinking...");
    setShowAiChat(true);
    try {
      const hint = await getAiAssistance(problem, code, "Can you give me a hint on how to optimize or fix my logic?");
      setAiMessage(hint);
    } catch (e) {
      setAiMessage("Error connecting to AI.");
    }
  };

  return {
     state: {
       problem,
       code,
       evaluation,
       isGenerating,
       isRunning,
       activeTab,
       showAiChat,
       aiMessage,
       backendError,
       customInput,
       customOutput,
      // difficulty,
      language,
      topic,
      showConfirmDialog,
      pendingLanguage,
      ranTests
     },
     actions: {
       // setDifficulty,
       setLanguage,
       setTopic,
       setCode,
       setActiveTab,
       setCustomInput,
       setShowAiChat,
       setShowConfirmDialog,
       // handleGenerateProblem,
       handleRunCode,
       setRanTests,
       handleAiAssist,
       initiateLanguageChange,
       executeLanguageChange
     }
   };
};