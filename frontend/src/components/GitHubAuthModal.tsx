import { AnimatePresence, motion } from 'framer-motion';

interface GitHubAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (username: string) => void; // This is not used now, but kept for consistency
}

export function GitHubAuthModal({ isOpen, onClose }: GitHubAuthModalProps) {
  const handleLogin = () => {
<<<<<<< HEAD
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID || 'Ov23liAw4jOzycLR8qW5';
    // The backend is running on port 5000 and the callback route is /github/callback
    const redirectUri = 'http://localhost:5000/github/callback';
=======
    const clientId = 'Ov23liAw4jOzycLR8qW5'; // Replace with your GitHub Client ID
    const redirectUri = 'http://localhost:5000/auth/github/callback';
>>>>>>> b6a62dc (ff)
    const scope = 'read:user';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-800 border border-purple-500 rounded-lg p-8 shadow-lg text-white max-w-md mx-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Authorize with GitHub</h2>
            <p className="mb-6 text-gray-300">To begin your career, we need to verify your identity through GitHub. This allows us to create your developer profile.</p>
            <div className="flex justify-center">
              <button 
                onClick={handleLogin}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 shadow-md"
              >
                Login with GitHub
              </button>
              <button 
                onClick={onClose}
                className="ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
