import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Star, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LevelUpTransitionProps {
  show: boolean;
  level: number;
  onComplete: () => void;
}

export function LevelUpTransition({ show, level, onComplete }: LevelUpTransitionProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (show) {
      setShowContent(true);
      const timer = setTimeout(() => {
        setShowContent(false);
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/90 backdrop-blur-sm pointer-events-none"
        >
          {/* Particle Burst */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: (Math.cos((i / 30) * Math.PI * 2) * 300),
                y: (Math.sin((i / 30) * Math.PI * 2) * 300),
                opacity: 0,
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.02,
                ease: 'easeOut',
              }}
              className="absolute left-1/2 top-1/2"
            >
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}

          {/* Sparkle Effects */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1,
                delay: Math.random() * 0.5,
                repeat: 2,
              }}
              className="absolute"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
              }}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
            </motion.div>
          ))}

          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Level Up Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="mb-6 inline-block"
            >
              <div className="relative">
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-2xl"
                />

                {/* Badge */}
                <div className="relative w-32 h-32 rounded-full bg-linear-to-r from-blue-600 to-purple-600 p-1">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Orbiting Stars */}
                {[0, 120, 240].map((angle, i) => (
                  <motion.div
                    key={angle}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.2,
                    }}
                    className="absolute inset-0"
                  >
                    <Star
                      className="absolute w-6 h-6 text-yellow-400 fill-yellow-400"
                      style={{
                        left: '50%',
                        top: '0%',
                        transform: `rotate(${angle}deg) translateY(-80px)`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Level Up Text */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.h2
                animate={{
                  textShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.8)',
                    '0 0 40px rgba(168, 85, 247, 0.8)',
                    '0 0 20px rgba(59, 130, 246, 0.8)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-6xl md:text-8xl mb-4 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                LEVEL UP!
              </motion.h2>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="text-5xl md:text-7xl text-white mb-6"
              >
                Level {level}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl text-gray-300"
              >
                Your skills are growing! 🎉
              </motion.p>
            </motion.div>

            {/* Bottom Shine Effect */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 h-1 w-64 mx-auto bg-linear-to-r from-transparent via-blue-500 to-transparent"
            />
          </div>

          {/* Screen Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
