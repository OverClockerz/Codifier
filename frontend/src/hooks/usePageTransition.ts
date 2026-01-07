import { useRef, useCallback } from 'react';
import gsap from 'gsap';
export function usePageTransition() {
  const isTransitioning = useRef(false);
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
