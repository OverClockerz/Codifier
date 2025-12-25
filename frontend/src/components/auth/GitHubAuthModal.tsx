import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, X, AlertCircle, ArrowLeft } from 'lucide-react'; 
import { GITHUB_CLIENT_ID } from '../../../config.json';
// import { useNavigate } from 'react-router-dom';

interface GitHubAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (username: string) => void;
}
export let LOGIN_DATE_TIME: Date;
// --- Sub-component for the Wave Animation ---
const LoadingWave = () => {
  const [text, setText] = useState("Authenticating");
  
  // Toggle text every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) => prev === "Authenticating" ? "Please Wait" : "Authenticating");
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // FIXED: Added 'as const' to resolve the TypeScript error
  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut"
  } as const;

  return (
    <div className="flex flex-col items-center justify-center h-40 w-full">
      <div className="flex items-baseline justify-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {/* The Text Label */}
        <div className="relative w-[180px] text-right mr-1 h-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-end"
                >
                    {text}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* The Jumping Dots */}
        <div className="flex gap-[3px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="inline-block text-blue-400 font-extrabold"
              animate={{ y: [0, -12, 0] }} // The Jump
              transition={{ ...dotTransition, delay: i * 0.1 }} // The Wave Stagger
            >
              .
            </motion.span>
          ))}
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-6 animate-pulse">Connecting to secure server...</p>
    </div>
  );
};

export function GitHubAuthModal({ isOpen, onClose, onAuth }: GitHubAuthModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const hasFetched = useRef(false);
  // kept in case you need to programmatically navigate later
  // const navigate = useNavigate(); 

  // 1. Handle the initial click to go to GitHub
  const handleGitHubLogin = () => {
    setIsRedirecting(true);
    setError(null);
    const redirectUri = 'http://localhost:3000/github/callback'; 
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=read:user`;
    
    window.location.href = githubAuthUrl;
  };

  // 2. Handle the Return Logic (The "Authenticating" Screen)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !hasFetched.current) {
      hasFetched.current = true;
      setIsAuthenticating(true);
      setError(null);

      fetch('http://localhost:5000/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then((res) => {
            if (!res.ok) throw new Error('Authentication failed on server');
            return res.json();
        })
        .then((data) => {
          if (data.user) {
            console.log('GitHub Login Success:', data);
            window.history.replaceState({}, document.title, "/");
            onAuth(data.user.login);
            // onClose(); // Optional: Close automatically if you prefer
           LOGIN_DATE_TIME = new Date();
           console.log('LOGIN_DATE_TIME set to:', LOGIN_DATE_TIME);
          } else {
            throw new Error('User data missing from response');
          }
        })
        .catch((err) => {
          console.error('GitHub Login Error:', err);
          setError('Failed to authenticate with GitHub. Please try again.');
          window.history.replaceState({}, document.title, "/");
        })
        .finally(() => {
          setIsAuthenticating(false);
          setIsRedirecting(false);
        });
    }
  }, [onAuth, onClose]);

  // Force modal open if URL has code
  const showModal = isOpen || window.location.search.includes('code');

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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)] relative min-h-[320px] flex flex-col justify-center">
              
              {!isAuthenticating && (
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* VIEW 1: AUTHENTICATING (CUSTOM WAVE ANIMATION) */}
              {isAuthenticating ? (
                
                <LoadingWave />

              ) : error ? (
                
               /* VIEW 2: ERROR STATE */
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
                  <p className="text-gray-400 mb-6">{error}</p>
                  
                  <button
                    onClick={() => { setError(null); }}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Try Again
                  </button>
                </div>

              ) : (

                /* VIEW 3: STANDARD LOGIN (IDLE) */
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Github className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">
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
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white font-medium"
                  >
                    {isRedirecting ? (
                        "Redirecting..."
                    ) : (
                        <>
                         <Github className="w-5 h-5" /> Continue with GitHub
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

