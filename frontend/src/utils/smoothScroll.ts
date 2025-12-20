import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/**
 * Performs an immediate, high-performance smooth scroll to a specific element.
 * Optimized for speed to reduce perceived delay during routing.
 */
export const smoothScrollToElement = (elementId, duration = 0.8) => {
  const element = document.getElementById(elementId);
  
  if (element) {
    // 1. Immediately kill all active window tweens to take control
    gsap.killTweensOf(window);

    // 2. Execute scroll with faster easing and lower duration for instant feel
    gsap.to(window, {
      duration,
      scrollTo: {
        y: element,
        autoKill: false,
        offsetY: 80,
      },
      // power2.out provides a very fast start that tapers off quickly,
      // which feels more "instant" than power4's slow buildup.
      ease: "power2.out",
      overwrite: "all"
    });
  }
};

/**
 * Scrolls to a specific numeric position or target instantly.
 */
export const smoothScrollTo = (target, duration = 0.8) => {
  gsap.killTweensOf(window);
  
  gsap.to(window, {
    duration,
    scrollTo: {
      y: target,
      autoKill: true,
    },
    ease: "power2.out",
    overwrite: "all"
  });
};