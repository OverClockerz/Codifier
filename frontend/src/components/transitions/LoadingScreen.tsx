import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  message?: string;
  tips?: string[];
}

export function LoadingScreen({ message = 'Loading...', tips }: LoadingScreenProps) {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (!tips || tips.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tips]);

  return (
    <div className="fixed inset-0 bg-black z-200 flex flex-col items-center justify-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}>
          <motion.div
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>

      {/* Logo Animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="relative mb-12"
      >
        <motion.h1
          animate={{
            textShadow: [
              '0 0 20px rgba(59, 130, 246, 0.5)',
              '0 0 40px rgba(168, 85, 247, 0.7)',
              '0 0 20px rgba(59, 130, 246, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl md:text-9xl bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          OFFICE
        </motion.h1>
      </motion.div>

      {/* Loading Spinner */}
      <div className="relative mb-8">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"
        />
        
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-b-pink-500 border-l-cyan-500"
        />

        {/* Center Dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500"
        />
      </div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-gray-300 mb-2"
      >
        {message}
      </motion.p>

      {/* Animated Dots */}
      <div className="flex gap-2 mb-12">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 rounded-full bg-blue-400"
          />
        ))}
      </div>

      {/* Tips Section */}
      {tips && tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md text-center px-6"
        >
          <p className="text-sm text-gray-500 mb-2">💡 Pro Tip:</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400 italic"
            >
              {tips[currentTip]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Progress Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"
      />
    </div>
  );
}

// Game-specific loading tips
export const GAME_TIPS = [
  'Balance work and rest to avoid burnout!',
  'Visit the Game Lounge to reduce stress and boost mood.',
  'Complete quest chains for bonus rewards.',
  'Invest in permanent buffs from the Cafeteria for long-term benefits.',
  'Higher difficulty quests give more EXP and currency.',
  'Use paid leaves strategically to recover from stress.',
  'Your salary increases with each level you gain.',
  'Interconnected quests require completion across multiple zones.',
  'Monthly reports affect your salary adjustment.',
  'Keep an eye on your deadline timers!',
  'Premium buffs stack with consumable effects.',
  'Experience is retained even if you get fired!',
];