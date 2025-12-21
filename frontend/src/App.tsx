<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
=======
import { useState, useEffect } from 'react';
>>>>>>> b6a62dc (ff)
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

type AppPage = 'landing' | 'game' | 'profile';

function AppContent() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');

<<<<<<< HEAD
  const handleAuth = useCallback((username: string) => {
=======
  // Update page based on auth status
  useEffect(() => {
    if (isAuthenticated && currentPage === 'landing') {
      setCurrentPage('game');
    } else if (!isAuthenticated) {
      setCurrentPage('landing');
    }
  }, [isAuthenticated]);

  const handleStartCareer = () => {
    setShowAuthModal(true);
  };

  const handleAuth = (username: string) => {
>>>>>>> b6a62dc (ff)
    login(username);
    setShowAuthModal(false);
    setIsGameLoading(true);
    
    // Simulate game initialization
    setTimeout(() => {
      setIsGameLoading(false);
      setCurrentPage('game');
    }, 2500);
  }, [login, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const username = params.get('username');
    if (username && !isAuthenticated) {
      window.history.replaceState({}, document.title, location.pathname);
      handleAuth(username);
    }
  }, [location, isAuthenticated, handleAuth]);

  const handleStartCareer = () => {
    setShowAuthModal(true);
  };

  const navigateToProfile = () => {
    setCurrentPage('profile');
  };

  const navigateToGame = () => {
    setCurrentPage('game');
  };

  if (isLoading) {
    return <LoadingScreen message="Initializing Office..." tips={GAME_TIPS.slice(0, 3)} />;
  }

  if (isGameLoading) {
    return <LoadingScreen message="Setting up your workspace..." tips={GAME_TIPS} />;
  }

  return (
    <>
      <PageTransition transitionKey={currentPage}>
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

      {/* Background Music Player */}
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