import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, TestStats } from '../../../types/types';

import { Results } from './Results';

const DEFAULT_TIME = 60;

interface TypingGameProps {
  question?: string;
  timeLimit?: number;
  onFinish?: (stats: TestStats) => void; // parent handles result flow when provided
  onResultsVisible?: (visible: boolean) => void;
}

export const TypingGame: React.FC<TypingGameProps> = ({ question, timeLimit, onFinish, onResultsVisible }) => {
  const [text, setText] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit ?? DEFAULT_TIME);
  const initialTime = timeLimit ?? DEFAULT_TIME;

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement | null>(null);

  // Fallback generator when no backend-provided paragraph is available
  const generateTypingText = async (): Promise<string> => {
    const samples = [
      "Practice clear communication by typing thoughtful, well-structured sentences that convey meaning and intent.",
      "Effective teams communicate often and listen carefully which improves collaboration and reduces errors during projects.",
      "Focus on accuracy first then build up speed; consistent practice leads to noticeable improvements in typing fluency.",
      "The meeting room requires calm, concise messages so colleagues can quickly understand priorities and next steps."
    ];
    // ensure at least ~20 words by repeating if necessary
    let text = samples[Math.floor(Math.random() * samples.length)];
    while (text.split(' ').length < 20) text += ' ' + text;
    return text;
  };

  // Load initial text
  const loadNewTest = useCallback(async () => {
    setStatus(GameStatus.LOADING);
    // Prefer provided question (from quest), otherwise generate a local sample
    const newText = question ?? (await generateTypingText());
    setText(newText);
    setUserInput("");
    setTimeLeft(timeLimit ?? DEFAULT_TIME);
    setStatus(GameStatus.IDLE);

    // Auto focus
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [question, timeLimit]);

  // Initial load
  useEffect(() => {
    loadNewTest();
  }, [loadNewTest]);

  // Timer logic
  useEffect(() => {
    if (status === GameStatus.RUNNING) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const finishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus(GameStatus.FINISHED);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === GameStatus.FINISHED || status === GameStatus.LOADING) return;

    const value = e.target.value;

    // Start timer on first character
    if (status === GameStatus.IDLE && value.length > 0) {
      setStatus(GameStatus.RUNNING);
    }

    setUserInput(value);

    if (value.length === text.length) {
      finishTest();
    }
  };

  const calculateStats = (): TestStats => {
    let correctChars = 0;
    let incorrectChars = 0;

    const chars = userInput.split('');
    chars.forEach((char, index) => {
      if (char === text[index]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    });

    const totalChars = userInput.length;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;

    const timeElapsed = initialTime - timeLeft;
    const minutes = timeElapsed === 0 ? (initialTime / 60) : (timeElapsed / 60);
    const wpm = minutes > 0 ? (correctChars / 5) / minutes : 0;

    return {
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars
    };
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      const userChar = userInput[index];
      // Default: Inactive Slate
      let className = "text-gray-500 text-2xl md:text-3xl transition-colors duration-75";

      if (userChar !== undefined) {
        if (userChar === char) {
          className = "text-gray-100 text-2xl md:text-3xl"; // Correct: White/Bright Slate
        } else {
          className = "text-red-500 text-2xl md:text-3xl"; // Incorrect: Red
        }
      }

      const isCurrent = index === userInput.length;

      return (
        <span
          key={index}
          ref={isCurrent ? (el) => (currentCharRef.current = el) : undefined}
          className={`relative font-mono leading-relaxed ${className}`}
        >
          {isCurrent && (
            <span className="absolute -left-[2px] top-1 bottom-1 w-[2px] bg-white caret-active shadow-[0_0_8px_rgba(255,255,255,0.5)]"></span>
          )}
          {char}
        </span>
      );
    });
  };

  // Auto-scroll logic: keep the current character visible within a 3-line viewport
  useEffect(() => {
    if (!textContainerRef.current || !currentCharRef.current) return;
    const container = textContainerRef.current;
    const el = currentCharRef.current;

    // If the current char is below the visible area, scroll it into view
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;

    if (elBottom > viewBottom || elTop < viewTop) {
      // smooth scroll to bring the caret into center-ish view
      container.scrollTo({ top: elTop - container.clientHeight / 3, behavior: 'smooth' });
    }
  }, [userInput, status, text]);

  if (status === GameStatus.LOADING) {
    return (
      <div className="flex items-center justify-center h-64 w-full max-w-5xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-700 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="text-gray-400 font-mono text-sm">Generating text...</div>
        </div>
      </div>
    );
  }

  if (status === GameStatus.FINISHED) {
    const stats = calculateStats();
    onResultsVisible?.(true);
    // Show results page first, keep visible until user claims rewards
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Results stats={stats} onRestart={loadNewTest} onClaimRewards={onFinish} onShow={onResultsVisible} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4">

      {/* Typing Area Container - Centered on page */}
      <div className="w-full max-w-4xl">

        {/* Typing Area with Timer */}
        <div
          ref={wrapperRef}
          onClick={focusInput}
          className="relative w-full cursor-text outline-none p-6 rounded-xl transition-all duration-300"
        >
          {/* Timer - Top Left */}
          <div className="absolute top-6 left-6 z-10">
            <div className={`text-4xl font-mono font-bold transition-colors ${status === GameStatus.RUNNING ? 'text-primary-500' : 'text-gray-700'}`}>
              {status === GameStatus.RUNNING ? timeLeft : initialTime}
            </div>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="absolute opacity-0 w-full h-full cursor-default -z-10"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {/* Text Display - 3-line viewport, 80% width, justified alignment */}
          <div
            ref={textContainerRef}
            className="ml-24 break-words select-none pointer-events-none text-justify leading-relaxed text-lg overflow-auto max-h-[7.5rem] pr-2"
          >
            {renderText()}
            {userInput.length === text.length && (
              <span className="inline-block w-[2px] h-6 bg-white caret-active align-middle ml-1"></span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
