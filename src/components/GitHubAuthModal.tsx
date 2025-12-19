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
  const hasFetched = useRef(false); // Prevents duplicate API calls with the same code

  // Function to initiate the GitHub OAuth flow
  const handleGitHubLogin = () => {
    setIsLoading(true);
    const clientId = 'CLIENT_ID_HERE'; // Replace with your GitHub OAuth App Client ID
    const redirectUri = 'http://localhost:3000/github/callback'; 
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user`;

    window.location.href = githubAuthUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !hasFetched.current) {
      hasFetched.current = true; // Mark as fetched immediately
      setIsLoading(true);

      fetch('http://localhost:5000/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            console.log('GitHub Login Success:', data);
            // This triggers the handleAuth logic in your App.tsx
            onAuth(data.user.login);
            
            // Clean the URL so the code doesn't stay in the address bar
            window.history.replaceState({}, document.title, "/");
          }
        })
        .catch((err) => {
          console.error('GitHub Login Error:', err);
          hasFetched.current = false; // Allow retry on error
        })
        .finally(() => setIsLoading(false));
    }
  }, [onAuth]);

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
                  Authenticate to start your career and save your progress.
                </p>
              </div>

              {/* GitHub Login Button */}
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

              {/* Note */}
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