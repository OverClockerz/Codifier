import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { LandingPage } from './components/LandingPage';
import { GamePage } from './components/GamePage';
import { ProfilePage } from './components/ProfilePage';
import { GitHubAuthModal } from './components/GitHubAuthModal';
import { MusicPlayer } from './components/MusicPlayer';
import { LoadingScreen, GAME_TIPS } from './components/transitions/LoadingScreen';
import { PageTransition } from './components/transitions/PageTransition';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('game'); // 'game' or 'profile'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(false);

  // Handle GitHub OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    if (username && !isAuthenticated) {
      // Clear the username from URL for a cleaner address bar
      window.history.replaceState({}, document.title, "/");
      handleAuth(username);
    }
  }, [isAuthenticated]);

  const navigateToProfile = () => setCurrentPage('profile');
  const navigateToGame = () => setCurrentPage('game');

  const handleStartCareer = () => {
    setShowAuthModal(true);
  };

  const handleAuth = (username: string) => {
    login(username);
    setShowAuthModal(false);
    setIsGameLoading(true);
    
    setTimeout(() => {
      setIsGameLoading(false);
    }, 2500);
  };

  if (isLoading) {
    return <LoadingScreen message="Initializing Office..." tips={GAME_TIPS.slice(0, 3)} />;
  }

  if (isGameLoading) {
    return <LoadingScreen message="Setting up your workspace..." tips={GAME_TIPS} />;
  }

  return (
    <>
      <PageTransition transitionKey={isAuthenticated ? currentPage : 'landing'}>
        {isAuthenticated ? (
          <GameProvider>
            {currentPage === 'profile' ? (
              <ProfilePage onNavigateBack={navigateToGame} />
            ) : (
              <GamePage onNavigateToProfile={navigateToProfile} />
            )}
          </GameProvider>
        ) : (
          <LandingPage onStartCareer={handleStartCareer} />
        )}
      </PageTransition>
      
      <GitHubAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />

      <MusicPlayer />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}