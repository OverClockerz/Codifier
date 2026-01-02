import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { About } from './About';
import { Features } from './Features';
// import { Gallery } from './Gallery';
// import { CallToAction } from './CallToAction'; // Removed
import { Credits } from './Credits'; // Added
import { Footer } from './Footer';
import { VideoBackground } from './VideoBackground';

interface LandingPageProps {
  onStartCareer: () => void;
}

export function LandingPage({ onStartCareer }: LandingPageProps) {
  // Placeholder video - ensure you have a valid .mp4 URL here
  const videoUrl = 'https://player.vimeo.com/progressive_redirect/playback/910123726/rendition/1080p/file.mp4?loc=external&signature=0c0fc9f89dd5f41fb0b0b34fa88de04b8c9f1732cfca8088bb88ba18f1b0c0f5';

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