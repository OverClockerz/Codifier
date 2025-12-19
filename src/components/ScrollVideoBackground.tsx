import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoBackgroundProps {
  videos: string[];
  overlayOpacity?: number;
}

export function ScrollVideoBackground({ videos, overlayOpacity = 0.3 }: ScrollVideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = Array.from(containerRef.current.children) as HTMLElement[];

    sections.forEach((section, index) => {
      gsap.to(videoRefs.current[index], {
        opacity: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
          toggleActions: 'play reverse play reverse',
        },
      });

      if (index > 0) {
        gsap.to(videoRefs.current[index - 1], {
          opacity: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        });
      }
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0" ref={containerRef}>
      {videos.map((src, i) => (
        <video
          key={i}
          ref={(el) => el && (videoRefs.current[i] = el)}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover top-0 left-0 opacity-0 transition-opacity duration-500"
          style={{ opacity: i === 0 ? 1 : 0 }}
        />
      ))}
      <div
        className="absolute top-0 left-0 w-full h-full bg-black pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
