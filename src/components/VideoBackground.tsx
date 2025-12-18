import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
}

export function VideoBackground({ videoSrc }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const onLoaded = () => {
      setVideoLoaded(true);
      video.play().catch(() => {
        console.warn('Autoplay blocked');
      });
    };

    const onError = () => {
      console.warn('Video failed to load. Using fallback.');
      setVideoError(true);
    };

    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('error', onError);
    };
  }, [videoSrc]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {!videoError && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-30' : 'opacity-0'
          }`}
        />
      )}

      {/* Fallback gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-black transition-opacity duration-1000 ${
          videoError || !videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
    </div>
  );
}
