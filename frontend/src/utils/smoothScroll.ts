import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export const smoothScrollToElement = (elementId: string, duration: number = 1.2) => {
  const element = document.getElementById(elementId);
  
  if (element) {
    // Stop any ongoing scrolls to prevent conflicts
    gsap.killTweensOf(window); 

    gsap.to(window, {
      duration,
      scrollTo: {
        y: element,
        autoKill: false, // Set to false so user touching mouse doesn't break the initial nav jump
        offsetY: 80, 
      },
      ease: 'power4.inOut', // Power4 is slightly more dramatic/premium
    });
  }
};