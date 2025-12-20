import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register the ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

export const smoothScrollTo = (target: string | number, duration: number = 1.5) => {
  gsap.to(window, {
    duration,
    scrollTo: {
      y: target,
      autoKill: true,
      offsetY: 0,
    },
    ease: 'power3.inOut',
  });
};

export const smoothScrollToElement = (elementId: string, duration: number = 1.5) => {
  const element = document.getElementById(elementId);
  
  if (element) {
    gsap.to(window, {
      duration,
      scrollTo: {
        y: element,
        autoKill: true,
        offsetY: 80, // Offset for fixed navigation
      },
      ease: 'power3.inOut',
    });
  }
};
