import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, X, User } from 'lucide-react';

interface GitHubAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (username: string) => void;
}

export function GitHubAuthModal({ isOpen, onClose, onAuth }: GitHubAuthModalProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      onAuth(username.trim());
      setIsLoading(false);
      setUsername('');
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sign in with GitHub
                </h2>
                <p className="text-gray-400">
                  Enter your GitHub username to start your career
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm text-gray-300 mb-2">
                    GitHub Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="your-username"
                      className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-colors"
                      required
                      autoFocus
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || !username.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Github className="w-5 h-5" />
                      Continue with GitHub
                    </>
                  )}
                </motion.button>
              </form>

              {/* Note */}
              <p className="text-xs text-gray-500 text-center mt-6">
                This is a demo authentication. In production, this would use real GitHub OAuth.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}