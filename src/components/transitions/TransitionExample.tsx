/**
 * TRANSITION EXAMPLES COMPONENT
 * 
 * This file demonstrates how to use GSAP page transitions throughout the Office app.
 * Copy these patterns to your own components.
 */

import { useState } from 'react';
import { PageTransition, GSAPPageTransition, ZonePageTransition } from './PageTransition';
import { TransitionLink, TransitionButton } from './TransitionLink';
import { TransitionOverlays } from './TransitionOverlays';
import { usePageTransition } from '../../hooks/usePageTransition';

// ============================================================================
// EXAMPLE 1: Simple Page Transition
// ============================================================================
export function SimplePageTransitionExample() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');

  return (
    <div>
      <nav className="flex gap-4 p-4">
        <button
          onClick={() => setCurrentPage('home')}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Home
        </button>
        <button
          onClick={() => setCurrentPage('about')}
          className="px-4 py-2 bg-purple-600 rounded"
        >
          About
        </button>
      </nav>

      {/* PageTransition automatically triggers when transitionKey changes */}
      <PageTransition transitionKey={currentPage}>
        {currentPage === 'home' ? (
          <div className="p-8">
            <h1>Home Page</h1>
            <p>Welcome to the home page!</p>
          </div>
        ) : (
          <div className="p-8">
            <h1>About Page</h1>
            <p>Learn more about us!</p>
          </div>
        )}
      </PageTransition>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Using TransitionLink Component
// ============================================================================
export function NavigationExample() {
  const [activePage, setActivePage] = useState('home');

  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-900">
        <TransitionLink
          onClick={() => setActivePage('home')}
          className="text-white hover:text-blue-400 transition-colors"
        >
          Home
        </TransitionLink>
        
        <TransitionLink
          onClick={() => setActivePage('about')}
          className="text-white hover:text-blue-400 transition-colors"
        >
          About
        </TransitionLink>
        
        <TransitionLink
          onClick={() => setActivePage('contact')}
          className="text-white hover:text-blue-400 transition-colors"
        >
          Contact
        </TransitionLink>

        {/* External links work normally (no transition) */}
        <TransitionLink
          href="https://github.com"
          className="text-white hover:text-blue-400 transition-colors"
        >
          GitHub
        </TransitionLink>
      </nav>

      <GSAPPageTransition transitionKey={activePage}>
        <div className="p-8">
          <h1 className="text-3xl mb-4">
            {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          </h1>
          <p>Content for {activePage} page</p>
        </div>
      </GSAPPageTransition>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Zone-Themed Transitions (For Game)
// ============================================================================
type ZoneType = 'workspace' | 'lounge' | 'meeting' | 'cafeteria';

export function GameZoneExample() {
  const [selectedZone, setSelectedZone] = useState<ZoneType>('workspace');

  return (
    <div>
      <div className="flex gap-2 p-4">
        <TransitionButton
          onClick={() => setSelectedZone('workspace')}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          🖥️ Workspace
        </TransitionButton>
        
        <TransitionButton
          onClick={() => setSelectedZone('lounge')}
          className="px-4 py-2 bg-purple-600 rounded"
        >
          🎮 Lounge
        </TransitionButton>
        
        <TransitionButton
          onClick={() => setSelectedZone('meeting')}
          className="px-4 py-2 bg-orange-600 rounded"
        >
          👔 Meeting
        </TransitionButton>
        
        <TransitionButton
          onClick={() => setSelectedZone('cafeteria')}
          className="px-4 py-2 bg-green-600 rounded"
        >
          ☕ Cafeteria
        </TransitionButton>
      </div>

      {/* Zone-themed transition with matching colors */}
      <ZonePageTransition transitionKey={selectedZone} theme={selectedZone}>
        <div className="p-8">
          <h1 className="text-4xl mb-4">
            {selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}
          </h1>
          <p>This zone uses a custom color theme for transitions!</p>
        </div>
      </ZonePageTransition>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Custom Hook with Manual Control
// ============================================================================
export function CustomTransitionExample() {
  const [page, setPage] = useState('page1');
  const { animateTransition } = usePageTransition();

  const handleCustomNavigation = async () => {
    const overlays = document.querySelectorAll('.transition-overlay');
    
    if (overlays.length > 0) {
      // Animate transition with callback in the middle
      await animateTransition(Array.from(overlays), () => {
        // This runs in the middle of the transition
        setPage(page === 'page1' ? 'page2' : 'page1');
      });
    } else {
      // Fallback if no overlays
      setPage(page === 'page1' ? 'page2' : 'page1');
    }
  };

  return (
    <div>
      <TransitionOverlays />
      
      <button
        onClick={handleCustomNavigation}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg m-4"
      >
        Custom Transition
      </button>

      <div className="p-8">
        <h1 className="text-3xl mb-4">{page === 'page1' ? 'Page 1' : 'Page 2'}</h1>
        <p>Using custom hook with manual control</p>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Disabling Transitions for Specific Actions
// ============================================================================
export function ConditionalTransitionExample() {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState('main');

  return (
    <div>
      <div className="flex gap-2 p-4">
        {/* No transition for quick actions */}
        <TransitionButton
          onClick={() => setCount(count + 1)}
          preventTransition={true}
          className="px-4 py-2 bg-gray-600 rounded"
        >
          Quick Count: {count}
        </TransitionButton>

        {/* With transition for page change */}
        <TransitionButton
          onClick={() => setPage(page === 'main' ? 'settings' : 'main')}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Go to {page === 'main' ? 'Settings' : 'Main'}
        </TransitionButton>
      </div>

      <PageTransition transitionKey={page}>
        <div className="p-8">
          <h1 className="text-3xl mb-4">{page}</h1>
          <p>Count: {count}</p>
        </div>
      </PageTransition>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Integration with React Router (If Used)
// ============================================================================
// Uncomment if you add React Router to the project
/*
import { useNavigate, useLocation } from 'react-router-dom';

export function RouterTransitionExample() {
  const navigate = useNavigate();
  const location = useLocation();
  const { animateTransition } = usePageTransition();

  const handleNavigation = async (path: string) => {
    const overlays = document.querySelectorAll('.transition-overlay');
    
    if (overlays.length > 0) {
      await animateTransition(Array.from(overlays), () => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      <TransitionOverlays />
      
      <nav className="flex gap-4 p-4">
        <button onClick={() => handleNavigation('/')}>Home</button>
        <button onClick={() => handleNavigation('/about')}>About</button>
        <button onClick={() => handleNavigation('/contact')}>Contact</button>
      </nav>

      <PageTransition transitionKey={location.pathname}>
        {/* Your route components *\/}
      </PageTransition>
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 7: Game Authentication Flow (Real Use Case)
// ============================================================================
export function AuthFlowExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <PageTransition transitionKey={isAuthenticated ? 'game' : 'landing'}>
      {isAuthenticated ? (
        <div className="min-h-screen p-8 bg-gray-900">
          <h1 className="text-4xl mb-4">Game Dashboard</h1>
          <p className="mb-4">Welcome to the game!</p>
          <TransitionButton
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 rounded"
          >
            Logout
          </TransitionButton>
        </div>
      ) : (
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl mb-4">Welcome to OFFICE</h1>
            <p className="text-xl mb-8 text-gray-400">
              Your gamified career simulation
            </p>
            <TransitionButton
              onClick={handleLogin}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg"
            >
              Start Career
            </TransitionButton>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
