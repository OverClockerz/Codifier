import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoProps {
  videoSrc: string;
  className?: string;
}

export function ScrollVideo({ videoSrc, className = '' }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    // Mute the video
    video.muted = true;
    video.playsInline = true;

    // Wait for video metadata to load
    const onLoadedMetadata = () => {
      const videoDuration = video.duration;

      // Create ScrollTrigger animation
      const scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          // Sync video playback with scroll position
          const progress = self.progress;
          const targetTime = progress * videoDuration;
          
          // Only update if the difference is significant to avoid jitter
          if (Math.abs(video.currentTime - targetTime) > 0.01) {
            video.currentTime = targetTime;
          }
        },
      });

      return () => {
        scrollTrigger.kill();
      };
    };

    if (video.readyState >= 1) {
      onLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          preload="auto"
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );
}
