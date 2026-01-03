import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, X, AlertCircle, ArrowLeft } from 'lucide-react';
import { GITHUB_CLIENT_ID } from '../../../config.json';

interface GitHubAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (username: string) => void;
}

/* -------------------- Loading Animation -------------------- */
const LoadingWave = () => {
  const [text, setText] = useState("Authenticating");

  useEffect(() => {
    const interval = setInterval(() => {
      setText(prev => prev === "Authenticating" ? "Please Wait" : "Authenticating");
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut"
  } as const;

  return (
    <div className="flex flex-col items-center justify-center h-40 w-full">
      <div className="relative min-w-40 text-center h-8">
        <div className="flex items-center justify-center text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {text}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-1.5 h-5 mt-6">
          {[0, 1, 2, 3, 4].map(i => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-400"
              animate={{ y: [0, -10, 0] }}
              transition={{ ...dotTransition, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-8 animate-pulse">
        Connecting to secure server...
      </p>
    </div>
  );
};

/* -------------------- Main Modal -------------------- */
export function GitHubAuthModal({ isOpen, onClose, onAuth }: GitHubAuthModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------- Start OAuth -------------------- */
  const handleGitHubLogin = () => {
    setIsRedirecting(true);
    setError(null);

    const redirectUri = 'https://codifier-xrzs.onrender.com/github/callback';
    const githubAuthUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${GITHUB_CLIENT_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=read:user`;

    window.location.href = githubAuthUrl;
  };

  /* -------------------- Handle Redirect Back -------------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");

    if (username) {
      setIsAuthenticating(true);

      // Clean URL
      window.history.replaceState({}, document.title, "/");

      // Notify parent
      onAuth(username);

      setIsAuthenticating(false);
      setIsRedirecting(false);
    }
  }, [onAuth]);

  const showModal = isOpen || isAuthenticating;

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isAuthenticating ? onClose : undefined}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)] relative min-h-80 flex flex-col justify-center">

              {!isAuthenticating && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {isAuthenticating ? (
                <LoadingWave />
              ) : error ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Authentication Failed
                  </h2>
                  <p className="text-gray-400 mb-6">{error}</p>

                  <button
                    onClick={() => setError(null)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Github className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">
                      Sign in with GitHub
                    </h2>
                    <p className="text-gray-400">
                      Authenticate to start your career and save your progress.
                    </p>
                  </div>

                  <motion.button
                    onClick={handleGitHubLogin}
                    disabled={isRedirecting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 flex items-center justify-center gap-2 text-white font-medium"
                  >
                    {isRedirecting ? "Redirecting..." : (
                      <>
                        <Github className="w-5 h-5" />
                        Continue with GitHub
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center mt-6">
                    This will redirect you to GitHub for authentication.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
