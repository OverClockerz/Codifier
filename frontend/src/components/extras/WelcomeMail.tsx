import { motion, AnimatePresence } from 'motion/react';
import { X, Briefcase } from 'lucide-react';

interface WelcomeMailProps {
    isOpen: boolean;
    onClose: () => void;
    playerName: string;
    companyName: string;
    isFirstCompany: boolean;
}

export function WelcomeMail({
    isOpen,
    onClose,
    playerName,
    companyName,
    isFirstCompany,
}: WelcomeMailProps) {
    const welcomeContent = isFirstCompany
        ? {
            subject: '🎉 Welcome to the Team!',
            greeting: `Hello ${playerName},`,
            body: `Welcome to ${companyName}! We're thrilled to have you join our team. As a new member, we've prepared an exciting set of tasks for you to tackle. These assignments will help you get acclimated to our work environment and showcase your skills.

The HR team is excited to see what you can accomplish. Best of luck with your new journey!`,
            signature: 'Human Resources Department',
        }
        : {
            subject: '🚀 Fresh Start at a New Company',
            greeting: `Hello ${playerName},`,
            body: `After your previous assignment, we're excited to welcome you to ${companyName}! Every professional journey has chapters, and this is the beginning of an exciting new one.

We've prepared an initial set of tasks to help you settle in and make your mark at this new organization. Looking forward to your contributions!`,
            signature: 'Human Resources Department',
        };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Main Welcome Mail Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-gradient-to-b from-[#1d293d] to-[#0f172a] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-blue-500/20 bg-blue-500/5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <Briefcase className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {welcomeContent.subject}
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-1">From: Human Resources</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mail Content */}
                    <div className="px-6 py-6 space-y-4 max-h-96 overflow-y-auto">
                        <p className="text-white font-semibold">{welcomeContent.greeting}</p>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {welcomeContent.body}
                        </p>
                        <div className="pt-4 border-t border-gray-700">
                            <p className="text-sm text-gray-400">{welcomeContent.signature}</p>
                        </div>
                    </div>

                    {/* Footer Actions - Only Accept Button */}
                    <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex gap-3 justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg font-semibold transition-all"
                        >
                            Accept
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
