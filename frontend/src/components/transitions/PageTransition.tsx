import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TransitionOverlays, TransitionOverlaysCustom } from './TransitionOverlays';

interface PageTransitionProps {
  children: ReactNode;
  transitionKey: string;
}

export function PageTransition({ children, transitionKey }: PageTransitionProps) {
  const overlaysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal transition on mount/change
    if (overlaysRef.current) {
      const overlays = overlaysRef.current.querySelectorAll('.transition-overlay');
      
      gsap.set(overlays, { scaleY: 1, transformOrigin: 'top' });
      gsap.to(overlays, {
        scaleY: 0,
        duration: 0.6,
        stagger: -0.1,
        ease: 'power2.inOut',
      });
    }
  }, [transitionKey]);

  return (
    <>
      {/* GSAP Transition Overlays */}
      <TransitionOverlays ref={overlaysRef} />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// GSAP-based Overlay Transition (matching your vanilla JS implementation)
export function GSAPPageTransition({ children, transitionKey }: PageTransitionProps) {
  const overlaysRef = useRef<HTMLDivElement>(null);
  const prevKeyRef = useRef(transitionKey);

  useEffect(() => {
    const overlays = overlaysRef.current?.querySelectorAll('.transition-overlay');
    
    if (!overlays || overlays.length === 0) return;

    // Initial reveal on first mount
    if (prevKeyRef.current === transitionKey) {
      gsap.set(overlays, { scaleY: 1, transformOrigin: 'top' });
      gsap.to(overlays, {
        scaleY: 0,
        duration: 0.6,
        stagger: -0.1,
        ease: 'power2.inOut',
      });
      return;
    }

    // Page transition animation
    const animateTransition = async () => {
      // Close transition (hide page)
      gsap.set(overlays, { scaleY: 0, transformOrigin: 'bottom' });
      await gsap.to(overlays, {
        scaleY: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.inOut',
      });

      // Update content
      prevKeyRef.current = transitionKey;

      // Reveal transition (show page)
      gsap.set(overlays, { scaleY: 1, transformOrigin: 'top' });
      gsap.to(overlays, {
        scaleY: 0,
        duration: 0.6,
        stagger: -0.1,
        ease: 'power2.inOut',
      });
    };

    animateTransition();
  }, [transitionKey]);

  return (
    <>
      {/* GSAP Transition Overlays */}
      <TransitionOverlays ref={overlaysRef} />

      {/* Content */}
      <div>
        {children}
      </div>
    </>
  );
}

// Zone-themed transition for game zones
export function ZonePageTransition({ 
  children, 
  transitionKey, 
  theme = 'office' 
}: PageTransitionProps & { theme?: 'office' | 'workspace' | 'lounge' | 'meeting' | 'cafeteria' }) {
  const overlaysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlaysRef.current) {
      const overlays = overlaysRef.current.querySelectorAll('.transition-overlay');
      
      gsap.set(overlays, { scaleY: 1, transformOrigin: 'top' });
      gsap.to(overlays, {
        scaleY: 0,
        duration: 0.6,
        stagger: -0.1,
        ease: 'power2.inOut',
      });
    }
  }, [transitionKey]);

  return (
    <>
      <TransitionOverlaysCustom ref={overlaysRef} theme={theme} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}