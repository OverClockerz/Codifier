import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, AlertTriangle } from 'lucide-react';

interface MoodAlertProps {
    isOpen: boolean;
    onClose: () => void;
    onGoToShop: () => void;
}

export function MoodAlert({ isOpen, onClose, onGoToShop }: MoodAlertProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* 1. Frosted Glass Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 z-0"
                    >
                        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black" />
                    </motion.div>

                    {/* 2. Main Terminal Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: 0,
                            x: [0, -5, 5, -5, 5, 0], // Shake effect
                            transition: {
                                type: "spring",
                                damping: 20,
                                stiffness: 300,
                                x: { duration: 0.4 }
                            }
                        }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative z-10 w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-hidden rounded-xl border border-pink-500/30 bg-[#050505] shadow-[0_0_50px_-10px_rgba(236,72,153,0.5)]"
                    >

                        {/* Decorative Scanline */}
                        <motion.div
                            animate={{ top: ["0%", "100%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent z-0 pointer-events-none"
                        />

                        {/* Window Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
                            <div className="flex gap-2">
                            </div>
                            <div className="text-[9px] font-mono text-pink-400 uppercase tracking-widest flex items-center gap-2">
                                <Heart className="w-3 h-3 animate-pulse" />
                                MORALE_CRITICAL
                            </div>
                            <div className="w-6" />
                        </div>

                        {/* Content Body */}
                        <div className="p-5 relative">

                            {/* Icon & Title */}
                            <div className="flex flex-col items-center text-center gap-4 mb-5">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-xl bg-pink-950 border border-pink-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                                        <AlertTriangle className="w-8 h-8 text-pink-500" />
                                    </div>
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight leading-tight">
                                        💔 MORALE DEPLETED! 💔
                                    </h3>
                                </div>
                                <div className="text-md font-bold text-white mb-2 capitalize tracking-tight leading-tight">
                                    <h5>You're too demotivated. Visit the Game Lounge for morale boosting activities or get a mood buff!</h5>
                                </div>
                            </div>

                            {/* Mood Bar Visualizer */}
                            <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-800 mb-4">
                                <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-2">
                                    <span className="flex items-center gap-1">💭 MORALE BAR</span>
                                    <span className="text-pink-500 animate-pulse font-bold">0%</span>
                                </div>
                                {/* Progress Bar Container */}
                                <div className="h-4 bg-gray-800/50 rounded overflow-hidden relative border border-gray-700/50">
                                    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)]" />
                                    <motion.div
                                        initial={{ width: "100%" }}
                                        animate={{ width: "0%" }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                    className="h-full bg-gradient-to-r from-pink-900 via-pink-600 to-pink-500 relative"
                                    >
                                        <motion.div
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                        />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Actions - ADJACENT LAYOUT */}
                            <div className="flex gap-2">
                                {/* Primary Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        onGoToShop();
                                        onClose();
                                    }}
                                    className="group relative flex-1 py-3 bg-pink-950/80 hover:bg-pink-900 border border-pink-500/50 text-white rounded-lg font-bold text-[10px] uppercase tracking-wide overflow-hidden transition-all shadow-lg shadow-pink-900/20"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                    <span className="relative flex flex-col items-center justify-center gap-1 text-pink-50 group-hover:text-white transition-colors">
                                        <Heart className="w-4 h-4 mb-0.5" />
                                        <span>Visit Cafeteria</span>
                                    </span>
                                </motion.button>

                                {/* Secondary Button */}
                                <motion.button
                                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-gray-900/30 border border-gray-800 text-gray-500 hover:text-white rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all flex flex-col items-center justify-center gap-1"
                                >
                                    <X className="w-4 h-4 mb-0.5" />
                                    <span>CLOSE</span>
                                </motion.button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
