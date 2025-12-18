import { useRef, useCallback } from 'react';
import gsap from 'gsap';

/**
 * Custom hook for GSAP-based page transitions
 * Matches the vanilla JavaScript implementation with reveal/hide animations
 */
export function usePageTransition() {
  const isTransitioning = useRef(false);

  /**
   * Reveal transition - animates overlays from full screen to hidden
   * Used when showing new content
   */
  const revealTransition = useCallback((overlays: NodeListOf<Element> | Element[]) => {
    return new Promise<void>((resolve) => {
      gsap.set(overlays, { scaleY: 1, transformOrigin: 'top' });
      gsap.to(overlays, {
        scaleY: 0,
        duration: 0.6,
        stagger: -0.1,
        ease: 'power2.inOut',
        onComplete: () => {
          isTransitioning.current = false;
          resolve();
        },
      });
    });
  }, []);

  /**
   * Hide transition - animates overlays from hidden to full screen
   * Used when hiding current content before navigation
   */
  const hideTransition = useCallback((overlays: NodeListOf<Element> | Element[]) => {
    return new Promise<void>((resolve) => {
      gsap.set(overlays, { scaleY: 0, transformOrigin: 'bottom' });
      gsap.to(overlays, {
        scaleY: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.inOut',
        onComplete: () => {
          resolve();
        },
      });
    });
  }, []);

  /**
   * Full page transition - hides current page, then reveals new content
   * Used for complete page changes
   */
  const animateTransition = useCallback(
    async (
      overlays: NodeListOf<Element> | Element[],
      onMidTransition?: () => void
    ) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;

      // Hide current page
      await hideTransition(overlays);

      // Execute callback in the middle of transition (e.g., update state)
      if (onMidTransition) {
        onMidTransition();
      }

      // Small delay for state to update
      await new Promise(resolve => setTimeout(resolve, 50));

      // Reveal new page
      await revealTransition(overlays);
    },
    [hideTransition, revealTransition]
  );

  return {
    revealTransition,
    hideTransition,
    animateTransition,
    isTransitioning: isTransitioning.current,
  };
}
