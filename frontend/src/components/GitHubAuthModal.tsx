import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, X } from 'lucide-react';

interface GitHubAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (username: string) => void;
}

export function GitHubAuthModal({ isOpen, onClose, onAuth }: GitHubAuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 1. INITIATE LOGIN: Redirect to GitHub
  // GitHub will then redirect to your Flask Backend
  const handleGitHubLogin = () => {
    setIsLoading(true);
    const clientId = 'Ov23liAw4jOzycLR8qW5';
    
    // This MUST match the callback route handled by your Flask Blueprint
    const redirectUri = 'http://127.0.0.1:5000/auth/github/callback'; 
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;

    window.location.href = githubAuthUrl;
  };

  // 2. URL DETECTION: Catch the return from Flask
  // Flask redirects to: http://localhost:3000/game?username=...
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (username) {
      // Trigger the auth logic in the parent component
      onAuth(username);
      
      // Clean the URL immediately to remove the query parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Close the modal if it's still open
      onClose();
    }
  }, [onAuth, onClose]);

  return (
    <AnimatePresence>
      {/* UI remains exactly as you had it */}
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sign in with GitHub
                </h2>
                <p className="text-gray-400">
                  Authenticate to start your career and save your progress.
                </p>
              </div>
              <motion.button
                onClick={handleGitHubLogin}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white font-medium"
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
              <p className="text-xs text-gray-500 text-center mt-6">
                This will redirect you to GitHub for authentication.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}