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
  // INSTRUCTIONS: Replace with your actual video file URL
  // Option 1: Use a local file - place video in /public/video/ folder
  //   const videoUrl = '/video/background.mp4';
  // 
  // Option 2: Use a direct video URL (must end in .mp4, .webm, etc.)
  //   const videoUrl = 'https://example.com/path/to/video.mp4';
  //
  // The Gemini link is NOT a video file - you need to download the video 
  // and either host it locally or upload it to a video hosting service
  
  // Temporary placeholder - using a free stock video from Pexels
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
          <Gallery />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
}