import { motion } from 'motion/react';
import { Briefcase, Brain, Users, Coffee } from 'lucide-react';
import { ZoneType } from '../types/game';
import { useGame } from '../contexts/GameContext';

interface ZoneSelectorProps {
  onSelectZone: (zone: ZoneType) => void;
}

export function ZoneSelector({ onSelectZone }: ZoneSelectorProps) {
  const { player, activeQuests } = useGame();

  const zones = [
    {
      type: 'workspace' as ZoneType,
      icon: Briefcase,
      title: 'The Workspace',
      description: 'Technical training and coding challenges',
      gradient: 'from-blue-500 to-cyan-500',
      disabled: player.isBurntOut,
      disabledReason: 'You are burnt out! Recover your mood first.',
    },
    {
      type: 'game-lounge' as ZoneType,
      icon: Brain,
      title: 'The Game Lounge',
      description: 'Critical thinking and logic puzzles',
      gradient: 'from-purple-500 to-pink-500',
      disabled: false,
    },
    {
      type: 'meeting-room' as ZoneType,
      icon: Users,
      title: 'The Meeting Room',
      description: 'Soft skills and communication tasks',
      gradient: 'from-green-500 to-emerald-500',
      disabled: false,
    },
    {
      type: 'cafeteria' as ZoneType,
      icon: Coffee,
      title: 'The Cafeteria',
      description: 'Shop for buffs and power-ups',
      gradient: 'from-yellow-500 to-orange-500',
      disabled: false,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {zones.map((zone, index) => {
        const Icon = zone.icon;
        const zoneQuests = activeQuests.filter((q) => q.zone === zone.type);
        const availableQuests = zoneQuests.filter((q) => q.status === 'available');
        const inProgressQuests = zoneQuests.filter((q) => q.status === 'in-progress');

        return (
          <motion.button
            key={zone.type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={zone.disabled ? {} : { scale: 1.02, y: -5 }}
            whileTap={zone.disabled ? {} : { scale: 0.98 }}
            onClick={() => !zone.disabled && onSelectZone(zone.type)}
            disabled={zone.disabled}
            className={`group relative p-8 bg-linear-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-3xl text-left transition-all duration-300 overflow-hidden ${
              zone.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-700 hover:shadow-2xl'
            }`}
          >
            {/* Animated Background Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 0.15, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className={`absolute inset-0 bg-linear-to-r ${zone.gradient} blur-2xl`}
            />

            {/* Shimmer Effect on Hover */}
            <motion.div
              initial={{ x: '-100%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12"
            />

            {/* Disabled Overlay */}
            {zone.disabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300"
              >
                Locked
              </motion.div>
            )}

            {/* Quest Count Badge */}
            {!zone.disabled && (availableQuests.length > 0 || inProgressQuests.length > 0) && (
              <div className="absolute top-4 right-4 flex flex-col gap-1">
                {availableQuests.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="px-3 py-1 bg-blue-500/30 border border-blue-400/50 rounded-full text-xs text-blue-300 backdrop-blur-sm"
                  >
                    {availableQuests.length} Available
                  </motion.div>
                )}
                {inProgressQuests.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="px-3 py-1 bg-green-500/30 border border-green-400/50 rounded-full text-xs text-green-300 backdrop-blur-sm"
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {inProgressQuests.length} Active
                    </motion.span>
                  </motion.div>
                )}
              </div>
            )}

            {/* Icon with Floating Animation */}
            <motion.div
              whileHover={{ y: -5, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`w-16 h-16 mb-6 rounded-2xl bg-linear-to-r ${zone.gradient} p-0.5 relative`}
            >
              <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              
              {/* Glow Effect */}
              {!zone.disabled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.6 }}
                  className={`absolute inset-0 rounded-2xl bg-linear-to-r ${zone.gradient} blur-xl -z-10`}
                />
              )}
            </motion.div>

            {/* Content */}
            <motion.h3
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-3xl mb-3"
            >
              {zone.title}
            </motion.h3>
            <p className="text-gray-400 text-lg">
              {zone.disabled && zone.disabledReason ? zone.disabledReason : zone.description}
            </p>

            {/* Hover Indicator */}
            {!zone.disabled && (
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${zone.gradient} rounded-b-3xl`}
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Particle Effect on Hover */}
            {!zone.disabled && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, x: 0 }}
                    whileHover={{
                      opacity: [0, 1, 0],
                      y: [-20, -60],
                      x: (i - 2) * 20,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                    className="absolute bottom-8 left-1/2"
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: `linear-gradient(to right, ${zone.gradient.split(' ')[1]}, ${zone.gradient.split(' ')[3]})`,
                    }}
                  />
                ))}
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}