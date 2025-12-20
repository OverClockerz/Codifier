import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { About } from './About';
import { Features } from './Features';
import { Gallery } from './Gallery';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { VideoBackground } from './VideoBackground';
import { smoothScrollToElement } from '../utils/smoothScroll';

interface LandingPageProps {
  onStartCareer: () => void;
}

export function LandingPage({ onStartCareer }: LandingPageProps) {
  const { hash, pathname } = useLocation();
  const isScrollingRef = useRef(false); // Prevents observer from firing during manual scroll
  const videoUrl = 'https://player.vimeo.com/progressive_redirect/playback/910123726/rendition/1080p/file.mp4?loc=external';

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 1. Handle Smooth Scrolling when Hash changes (via Nav click)
  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      
      // Mark that we are doing a manual scroll so observer ignores it
      isScrollingRef.current = true;

      const timer = setTimeout(() => {
        smoothScrollToElement(targetId);
        
        // Release the lock after the GSAP animation duration (approx 1.2s - 1.5s)
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1500);
      }, 100);

      return () => clearTimeout(timer);
    } else if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash, pathname]);

  // 2. Scroll Spy: Update URL hash as user scrolls manually
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger when section is in the middle of view
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // If we are currently in a GSAP "smoothScrollToElement" animation, 
      // do not update the URL hash via the observer.
      if (isScrollingRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          // Silent update of the URL hash without triggering the scroll useEffect
          window.history.replaceState(null, '', `/#${id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-[60] origin-left"
        style={{ scaleX }}
      />

      <VideoBackground videoSrc={videoUrl} />

      <div className="relative z-10">
        <Navigation onSignIn={onStartCareer} />

        <main>
          <section id="home" className="min-h-screen">
            <Hero onStartCareer={onStartCareer} />
          </section>

          {/* Added scroll-mt-24 to match the offsetY in your GSAP utility */}
          <section id="about" className="scroll-mt-24 py-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <About />
            </motion.div>
          </section>

          <section id="features" className="scroll-mt-24 py-20">
            <Features />
          </section>

          <section id="gallery" className="scroll-mt-24 py-20">
            <Gallery />
          </section>

          <section id="contact" className="scroll-mt-24 py-20">
            <Contact />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}