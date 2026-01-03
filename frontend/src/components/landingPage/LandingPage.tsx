import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { About } from './About';
import { Features } from './Features';
// import { Gallery } from './Gallery';
import { Credits } from './Credits'; // Added
import { Footer } from './Footer';
import { VideoBackground } from './VideoBackground';

interface LandingPageProps {
  onStartCareer: () => void;
}

export function LandingPage({ onStartCareer }: LandingPageProps) {
  // Placeholder video - ensure you have a valid .mp4 URL here
  const videoUrl = '/videos/feature-2.mp4';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Scroll-synced video background */}
      <VideoBackground videoSrc={videoUrl} />

      {/* Content */}
      <div className="relative z-10">
        <Navigation onSignIn={onStartCareer} />
        <main>
          <Hero onStartCareer={onStartCareer} />
          <About />
          <Features />
          {/* <Gallery /> */}

          {/* Replaced CallToAction with Credits */}
          <Credits />
        </main>
        <Footer />
      </div>
    </div>
  );
}