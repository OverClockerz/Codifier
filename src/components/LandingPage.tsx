import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { About } from './About';
import { Features } from './Features';
import { Gallery } from './Gallery';
import { CallToAction } from './CallToAction';
import { Footer } from './Footer';
import { VideoBackground } from './VideoBackground';

interface LandingPageProps {
  onStartCareer: () => void;
}

export function LandingPage({ onStartCareer }: LandingPageProps) {
  // Replace this with your actual video URL or path
  // For now using a placeholder - you'll need to add your video file
  const videoUrl = '/videos/bg.mp4'; // Update this path to your video

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
          <Gallery />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
}