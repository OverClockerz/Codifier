import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate, Outlet } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(false);

  // handleAuth logic to trigger loading and update state
  const handleAuth = useCallback(
    (username: string) => {
      login(username);
      setShowAuthModal(false);
      setIsGameLoading(true);

      // Give the loading screen time to show before switching views
      setTimeout(() => {
        setIsGameLoading(false);
        navigate('/game');
      }, 2500);
    },
    [login, navigate]
  );

  // CRITICAL: Handle the redirect from Flask (e.g., /game?username=JohnDoe)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const username = params.get('username');

    if (username && !isAuthenticated) {
      // 1. Immediately clean the URL so the username isn't visible in the bar
      window.history.replaceState({}, document.title, location.pathname);
      // 2. Trigger the login process
      handleAuth(username);
    }
  }, [location, isAuthenticated, handleAuth]);

  // Handle various loading states
  if (isLoading) {
    return <LoadingScreen message="Initializing Office..." tips={GAME_TIPS.slice(0, 3)} />;
  }

  if (isGameLoading) {
    return <LoadingScreen message="Setting up your workspace..." tips={GAME_TIPS} />;
  }

  return (
    <>
      <Routes>
        {/* LANDING PAGE: Only accessible if not authenticated */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/game" replace />
            ) : (
              <LandingPage onStartCareer={() => setShowAuthModal(true)} />
            )
          } 
        />

        {/* PROTECTED ROUTES: Only accessible if authenticated */}
        <Route 
          element={
            isAuthenticated ? (
              <GameProvider>
                <PageTransition />
                <Outlet /> {/* This renders GamePage or ProfilePage */}
              </GameProvider>
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route path="/game" element={<GamePage onNavigateToProfile={() => navigate('/profile')} />} />
          <Route path="/profile" element={<ProfilePage onNavigateBack={() => navigate('/game')} />} />
        </Route>

        {/* Fallback for unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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