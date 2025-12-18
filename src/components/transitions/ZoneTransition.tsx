import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ZoneType } from "../../types/game";
import { Briefcase, Brain, Users, Coffee } from "lucide-react";

interface ZoneTransitionProps {
  children: ReactNode;
  zone: ZoneType | null;
  onTransitionComplete?: () => void;
}

const TRANSITION_DURATION = 800;

export function ZoneTransition({
  children,
  zone,
  onTransitionComplete,
}: ZoneTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentZone, setCurrentZone] = useState<ZoneType | null>(zone);

  const transitionLock = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  // Prevent content re-animation
  const hasMountedRef = useRef(false);

  // 🔐 Track title animation per zone
  const animatedTitleZoneRef = useRef<ZoneType | null>(null);

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  useEffect(() => {
    if (!zone) return;
    if (zone === currentZone) return;
    if (transitionLock.current) return;

    transitionLock.current = true;
    setIsTransitioning(true);

    timeoutRef.current = window.setTimeout(() => {
      setCurrentZone(zone);
      setIsTransitioning(false);
      transitionLock.current = false;
      onTransitionComplete?.();
    }, TRANSITION_DURATION);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [zone, currentZone, onTransitionComplete]);

  const getZoneConfig = (zoneType: ZoneType | null) => {
    const map = {
      workspace: {
        icon: Briefcase,
        title: "The Workspace",
        gradient: "from-blue-500 via-cyan-500 to-blue-600",
        particles: "💻🔧⚙️",
      },
      "game-lounge": {
        icon: Brain,
        title: "The Game Lounge",
        gradient: "from-purple-500 via-pink-500 to-purple-600",
        particles: "🎮🧩🎯",
      },
      "meeting-room": {
        icon: Users,
        title: "The Meeting Room",
        gradient: "from-green-500 via-emerald-500 to-green-600",
        particles: "📊💼📈",
      },
      cafeteria: {
        icon: Coffee,
        title: "The Cafeteria",
        gradient: "from-yellow-500 via-orange-500 to-yellow-600",
        particles: "☕🍕🥗",
      },
    };
    return zoneType ? map[zoneType] : null;
  };

  const config = getZoneConfig(zone);
  const shouldAnimateTitle = animatedTitleZoneRef.current !== zone;

  return (
    <>
      {/* ================= OVERLAY ================= */}
      <AnimatePresence>
        {isTransitioning && config && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            {/* Background */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1.4 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-20 blur-3xl`}
            />

            {/* Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 1000,
                  y: (Math.random() - 0.5) * 1000,
                }}
                transition={{ duration: 0.8, delay: i * 0.02 }}
                className="absolute text-4xl"
                style={{ left: "50%", top: "50%" }}
              >
                {config.particles[i % config.particles.length]}
              </motion.div>
            ))}

            {/* Icon + Title */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Icon always animates */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className={`w-32 h-32 rounded-3xl bg-gradient-to-r ${config.gradient} p-1 shadow-2xl`}
              >
                <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center">
                  <config.icon className="w-16 h-16 text-white" />
                </div>
              </motion.div>

              {/* Title animates ONLY ONCE per zone */}
              {/* {shouldAnimateTitle ? (
                // <motion.h2
                //   initial={{ y: 20, opacity: 0 }}
                //   animate={{ y: 0, opacity: 1 }}
                //   transition={{ delay: 0.2 }}
                //   onAnimationComplete={() => {
                //     animatedTitleZoneRef.current = zone;
                //   }}
                //   className="text-4xl md:text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                // >
                //   {config.title}
                // </motion.h2>
              ) : (
                <h2 className="text-4xl md:text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {config.title}
                </h2>
              )} */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CONTENT ================= */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentZone ?? "dashboard"}
          initial={hasMountedRef.current ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
