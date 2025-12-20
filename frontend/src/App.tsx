import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartCareer = () => {
    setShowAuthModal(true);
  };

  const handleAuth = (username: string) => {
    login(username);
    setShowAuthModal(false);
    setIsGameLoading(true);
    
    setTimeout(() => {
      setIsGameLoading(false);
      navigate('/game');
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
      <PageTransition transitionKey={location.pathname}>
        <Routes location={location}>
          {/* Public Landing Page */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to="/game" replace />
              ) : (
                <LandingPage onStartCareer={handleStartCareer} />
              )
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/game"
            element={
              isAuthenticated ? (
                <GameProvider>
                  <GamePage onNavigateToProfile={() => navigate('/profile')} />
                </GameProvider>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <GameProvider>
                  <ProfilePage onNavigateBack={() => navigate('/game')} />
                </GameProvider>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Catch-all: Redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
        {/* Router is removed here because it is now in main.tsx */}
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}