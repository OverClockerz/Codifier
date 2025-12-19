import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VideoBackgroundProps {
  videoSrc: string;
}

export function VideoBackground({ videoSrc }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    // Mute the video
    video.muted = true;
    video.playsInline = true;
    video.loop = false;

    // Handle video load error
    const onError = () => {
      // Silently use fallback background
      setVideoError(true);
    };

    // Wait for video metadata to load
    const onLoadedMetadata = () => {
      setVideoLoaded(true);
      const videoDuration = video.duration;

      // Create ScrollTrigger animation that covers the entire page
      const scrollTrigger = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          // Sync video playback with scroll position
          const progress = self.progress;
          const targetTime = progress * videoDuration;
          
          // Update video time based on scroll
          if (Math.abs(video.currentTime - targetTime) > 0.1) {
            video.currentTime = targetTime;
          }
        },
      });

      return () => {
        scrollTrigger.kill();
      };
    };

    video.addEventListener('error', onError);

    if (video.readyState >= 1) {
      onLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('error', onError);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === document.body) {
          trigger.kill();
        }
      });
    };
  }, [videoSrc]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
      {!videoError && (
        <video
          ref={videoRef}
          src={videoSrc}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-30' : 'opacity-0'
          }`}
          preload="auto"
          muted
          playsInline
        />
      )}
      
      {/* Fallback gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-black transition-opacity duration-1000 ${
        videoError || !videoLoaded ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
    </div>
  );
}