import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Target, Zap } from 'lucide-react';

interface QuestStartTransitionProps {
  show: boolean;
  questTitle: string;
  onComplete: () => void;
}

export function QuestStartTransition({ show, questTitle, onComplete }: QuestStartTransitionProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(onComplete, 1500);
          }}
          className="fixed inset-0 z-150 flex items-center justify-center bg-black/95"
        >
          {/* Radial Pulse */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full bg-linear-to-r from-blue-500/50 to-purple-500/50 blur-3xl"
          />

          {/* Center Content */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: 'backOut' }}
              className="relative"
            >
              {/* Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-32 h-32 -m-4"
              >
                <div className="w-full h-full rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500" />
              </motion.div>

              <div className="w-24 h-24 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 p-1">
                <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Quest Start Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-blue-400 text-lg mb-2"
              >
                QUEST STARTED
              </motion.p>
              <h2 className="text-3xl md:text-4xl text-white max-w-md px-4">
                {questTitle}
              </h2>
            </motion.div>

            {/* Floating Icons */}
            <div className="absolute inset-0 pointer-events-none">
              {[Target, Zap, Trophy].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, x: 0, opacity: 0 }}
                  animate={{
                    y: [0, -100, -200],
                    x: [0, (i - 1) * 50, (i - 1) * 100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 + i * 0.2,
                    ease: 'easeOut',
                  }}
                  className="absolute top-1/2 left-1/2"
                >
                  <Icon className="w-8 h-8 text-purple-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
