import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useState, useEffect } from 'react';
import { ZoneType } from '../../types/game';
import { Briefcase, Brain, Users, Coffee } from 'lucide-react';

interface ZoneTransitionProps {
  children: ReactNode;
  zone: ZoneType | null;
  onTransitionComplete?: () => void;
}

export function ZoneTransition({ children, zone, onTransitionComplete }: ZoneTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentZone, setCurrentZone] = useState(zone);

  useEffect(() => {
    if (zone !== currentZone) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentZone(zone);
        setIsTransitioning(false);
        onTransitionComplete?.();
      }, 800);
    }
  }, [zone, currentZone, onTransitionComplete]);

  const getZoneConfig = (zoneType: ZoneType | null) => {
    const configs = {
      workspace: {
        icon: Briefcase,
        title: 'The Workspace',
        gradient: 'from-blue-500 via-cyan-500 to-blue-600',
        particles: '💻🔧⚙️',
      },
      'game-lounge': {
        icon: Brain,
        title: 'The Game Lounge',
        gradient: 'from-purple-500 via-pink-500 to-purple-600',
        particles: '🎮🧩🎯',
      },
      'meeting-room': {
        icon: Users,
        title: 'The Meeting Room',
        gradient: 'from-green-500 via-emerald-500 to-green-600',
        particles: '📊💼📈',
      },
      cafeteria: {
        icon: Coffee,
        title: 'The Cafeteria',
        gradient: 'from-yellow-500 via-orange-500 to-yellow-600',
        particles: '☕🍕🥗',
      },
    };
    return zoneType ? configs[zoneType] : null;
  };

  const config = getZoneConfig(zone);

  return (
    <>
      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && config && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            {/* Animated Background */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1.5, rotate: 360 }}
              exit={{ scale: 0, rotate: 720 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-20 blur-3xl`}
            />

            {/* Particle Effects */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 1000,
                  y: (Math.random() - 0.5) * 1000,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.02,
                  ease: 'easeOut',
                }}
                className="absolute text-4xl"
                style={{
                  left: '50%',
                  top: '50%',
                }}
              >
                {config.particles[i % config.particles.length]}
              </motion.div>
            ))}

            {/* Zone Icon & Title */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
              className="relative z-10 flex flex-col items-center gap-6"
            >
              <div className={`w-32 h-32 rounded-3xl bg-gradient-to-r ${config.gradient} p-1 shadow-2xl`}>
                <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center">
                  <config.icon className="w-16 h-16 text-white" />
                </div>
              </div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              >
                {config.title}
              </motion.h2>

              {/* Loading Bar */}
              <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className={`h-full bg-gradient-to-r ${config.gradient}`}
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ duration: 0.8, times: [0, 0.3, 0.6, 1] }}
                className="text-gray-400 text-lg"
              >
                Entering zone...
              </motion.p>
            </motion.div>

            {/* Radial Wipe Effect */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`absolute inset-0 bg-gradient-radial ${config.gradient}`}
              style={{
                background: `radial-gradient(circle, transparent 0%, black 70%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentZone || 'dashboard'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, delay: isTransitioning ? 0.4 : 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}