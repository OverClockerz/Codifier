import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';

interface HRMailModalProps {
    isOpen: boolean;
    onClose: () => void;
    mailType: 'new-player' | 'new-day' | 'fired' | 'low-quests';
    playerName: string;
    companyName: string;
    onConfirm: () => void;
    isGenerating?: boolean;
}

export function HRMailModal({
    isOpen,
    onClose,
    mailType,
    playerName,
    companyName,
    onConfirm,
    isGenerating = false,
}: HRMailModalProps) {
    const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

    const mailContent = {
        'new-player': {
            subject: '🎉 Welcome to the Team!',
            greeting: `Hello ${playerName},`,
            body: `Welcome to ${companyName}! We're thrilled to have you join our team. As a new member, we've prepared an exciting set of tasks for you to tackle. These assignments will help you get acclimated to our work environment and showcase your skills.

Your HR team is excited to see what you can accomplish. Best of luck with your new journey!`,
            signature: 'Human Resources Department',
        },
        'new-day': {
            subject: '📋 New Tasks Available',
            greeting: `Hi ${playerName},`,
            body: `We've reviewed your recent performance and believe you're ready for more challenges. We've curated a fresh set of tasks across different departments that align with your current skill level.

Keep pushing forward, and remember that each task is an opportunity to grow!`,
            signature: 'Human Resources Department',
        },
        'fired': {
            subject: '🚀 Fresh Start at a New Company',
            greeting: `Hello ${playerName},`,
            body: `After your previous assignment, we're excited to welcome you to ${companyName}! Every professional journey has chapters, and this is the beginning of an exciting new one.

We've prepared an initial set of tasks to help you settle in and make your mark at this new organization.`,
            signature: 'Human Resources Department',
        },
        'low-quests': {
            subject: '📣 Additional Opportunities Available',
            greeting: `Hi ${playerName},`,
            body: `We've noticed you've been progressing well, and we want to keep the momentum going! We've prepared additional tasks from various departments to keep you engaged and challenged.

Take your pick and continue your impressive growth!`,
            signature: 'Human Resources Department',
        },
    };

    const loadingMessages = {
        'new-player': [
            'Setting up your workspace...',
            'Configuring game lounge access...',
            'Preparing meeting room schedules...',
            'Initializing your profile...',
        ],
        'new-day': [
            'Reviewing daily assignments...',
            'Preparing task batches...',
            'Setting up priority queue...',
            'Ready for action!',
        ],
        'fired': [
            'Processing onboarding...',
            'Configuring new workspace...',
            'Setting up team introductions...',
            'Welcome aboard!',
        ],
        'low-quests': [
            'Generating new opportunities...',
            'Matching tasks to your skills...',
            'Organizing assignments...',
            'Ready for challenges!',
        ],
    };

    const content = mailContent[mailType];
    const messages = loadingMessages[mailType];

    const handleConfirm = async () => {
        setShowLoadingOverlay(true);
        await onConfirm();
        // Keep overlay visible for a moment after generation completes
        setTimeout(() => {
            setShowLoadingOverlay(false);
            onClose();
        }, 1500);
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

                {/* Main Mail Modal */}
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
                                    <h2 className="text-xl font-bold text-white">{content.subject}</h2>
                                    <p className="text-xs text-gray-500 mt-1">From: Human Resources</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={isGenerating && (mailType === 'new-player' || mailType === 'fired')}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mail Content */}
                    <div className="px-6 py-6 space-y-4 max-h-96 overflow-y-auto">
                        <p className="text-white font-semibold">{content.greeting}</p>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{content.body}</p>
                        <div className="pt-4 border-t border-gray-700">
                            <p className="text-sm text-gray-400">{content.signature}</p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={handleConfirm}
                            disabled={isGenerating}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                        >
                            {isGenerating ? 'Generating Tasks...' : 'Accept Tasks'}
                        </Button>
                    </div>

                    {/* Loading Overlay */}
                    <AnimatePresence>
                        {showLoadingOverlay && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
                            >
                                <div className="space-y-6 text-center">
                                    <div className="inline-flex items-center justify-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full"
                                        />
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ staggerChildren: 0.5 }}
                                        className="space-y-2"
                                    >
                                        {messages.map((msg, idx) => (
                                            <motion.p
                                                key={idx}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.5 }}
                                                className="text-gray-300 text-sm"
                                            >
                                                {msg}
                                            </motion.p>
                                        ))}
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
