import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ScrambleText } from './effects/ScrambleText';
import { ZoneType } from '../types/game';

interface ZoneHeaderProps {
  zone: ZoneType;
  availableCount: number;
  inProgressCount: number;
  onBack: () => void;
}

// Store which zones have been animated
const animatedZones = new Set<ZoneType>();

export function ZoneHeader({ zone, availableCount, inProgressCount, onBack }: ZoneHeaderProps) {
  const [shouldAnimate, setShouldAnimate] = useState(!animatedZones.has(zone));

  useEffect(() => {
    if (shouldAnimate) {
      // Mark this zone as animated
      animatedZones.add(zone);
      // After animation completes, update state
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 1500); // Total animation duration
      
      return () => clearTimeout(timer);
    }
  }, [zone, shouldAnimate]);

  const getZoneTitle = (zoneType: ZoneType): string => {
    const titles = {
      workspace: 'The Workspace',
      'game-lounge': 'The Game Lounge',
      'meeting-room': 'The Meeting Room',
      cafeteria: 'The Cafeteria',
    };
    return titles[zoneType];
  };

  const title = getZoneTitle(zone);

  return (
    <div className="flex items-center gap-4">
      {/* Back Button - only animates on first visit */}
      <motion.button
        initial={shouldAnimate ? { opacity: 0, x: -20 } : false}
        animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center hover:border-gray-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Zone Title - only scrambles on first visit */}
      <div>
        <h2 className="text-3xl">
          {shouldAnimate ? (
            <ScrambleText
              text={title}
              className="inline-block"
              speed={50}
              delay={300}
              as="span"
            />
          ) : (
            <span>{title}</span>
          )}
        </h2>
        
        <motion.p 
          className="text-gray-400 text-sm"
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={shouldAnimate ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {availableCount} available, {inProgressCount} in progress
        </motion.p>
      </div>
    </div>
  );
}
