import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  SkipForward,
  List,
  Volume1,

} from "lucide-react";

// Music track configuration
// Place your audio files in /assets/audio/ directory
// Supported formats: MP3, OGG, WAV
const MUSIC_TRACKS = [
  {
    id: 'lofi-chill',
    name: 'Lo-Fi Chill',
    url: '/music/lofi-chill.mp3',
    fallbackUrl: 'https://assets.mixkit.co/active_storage/sfx/2492/2492-preview.mp3',
    emoji: '🎧',
    description: 'Relaxed coding vibes',
  },
  {
    id: 'corporate-ambient',
    name: 'Corporate Ambient',
    url: '/music/corporate-ambient.mp3',
    fallbackUrl: 'https://assets.mixkit.co/active_storage/sfx/2495/2495-preview.mp3',
    emoji: '🏢',
    description: 'Professional atmosphere',
  },
  {
    id: 'focus-beats',
    name: 'Focus Beats',
    url: '/music/focus-beats.mp3',
    fallbackUrl: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    emoji: '⚡',
    description: 'High productivity energy',
  },
  {
    id: 'calm-office',
    name: 'Calm Office',
    url: '/music/calm-office.mp3',
    fallbackUrl: 'https://assets.mixkit.co/active_storage/sfx/2494/2494-preview.mp3',
    emoji: '☕',
    description: 'Peaceful work sounds',
  },
  {
    id: 'upbeat-workflow',
    name: 'Upbeat Workflow',
    url: '/music/upbeat-workflow.mp3',
    fallbackUrl: 'https://assets.mixkit.co/active_storage/sfx/2487/2487-preview.mp3',
    emoji: '🚀',
    description: 'Energetic motivation',
  },
];

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Get the appropriate URL (local or fallback)
  const getTrackUrl = (index: number) => {
    const track = MUSIC_TRACKS[index];
    return useFallback ? track.fallbackUrl : track.url;
  };

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedVolume = localStorage.getItem(
      "office_music_volume",
    );
    const savedMuted = localStorage.getItem(
      "office_music_muted",
    );
    const savedIsPlaying = localStorage.getItem(
      "office_music_playing",
    );
    const savedHasInteracted = localStorage.getItem(
      "office_music_interacted",
    );

    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      if (audioRef.current) {
        audioRef.current.volume = vol;
      }
    }

    if (savedMuted === "true") {
      setIsMuted(true);
    }

    if (savedHasInteracted === "true") {
      setHasInteracted(true);
    }

    if (savedIsPlaying === "true") {
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem(
        "office_music_volume",
        volume.toString(),
      );
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(
      "office_music_muted",
      isMuted.toString(),
    );
  }, [isMuted]);

  // Save playing state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "office_music_playing",
      isPlaying.toString(),
    );
  }, [isPlaying]);

  // Save interaction state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "office_music_interacted",
      hasInteracted.toString(),
    );
  }, [hasInteracted]);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    setHasInteracted(true);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
    }
  };

  // Auto-play or restore playing state
  useEffect(() => {
    const attemptAutoplay = async () => {
      if (!audioRef.current) return;

      try {
        // If we should be playing (from localStorage), try to play
        if (isPlaying || (!hasInteracted && !localStorage.getItem("office_music_interacted"))) {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasInteracted(true);
        }
      } catch (error) {
        // Autoplay blocked - user needs to interact first
        console.log(
          "Autoplay blocked - waiting for user interaction",
        );
        setIsPlaying(false);
      }
    };

    // Small delay to ensure audio element is ready
    const timer = setTimeout(attemptAutoplay, 500);
    return () => clearTimeout(timer);
  }, [hasInteracted, isPlaying]);

  const handleNextTrack = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const nextIndex =
      (currentTrackIndex + 1) % MUSIC_TRACKS.length;
    setCurrentTrackIndex(nextIndex);
    localStorage.setItem('office_music_track', nextIndex.toString());

    if (audioRef.current) {
      const wasPlaying = isPlaying;
      // Pause current playback
      audioRef.current.pause();
      setIsPlaying(false);

      // Set new source
      audioRef.current.src = getTrackUrl(nextIndex);

      // Load and play if was playing
      if (wasPlaying) {
        audioRef.current.load();
        audioRef.current.addEventListener('canplaythrough', () => {
          audioRef.current?.play()
            .then(() => {
              setIsPlaying(true);
              setIsTransitioning(false);
            })
            .catch((error) => {
              console.error('Playback failed:', error);
              setIsTransitioning(false);
            });
        }, { once: true });
      } else {
        audioRef.current.load();
        setIsTransitioning(false);
      }
    }
  };

  const selectTrack = (index: number) => {
    if (isTransitioning || index === currentTrackIndex) return;
    setIsTransitioning(true);
    setCurrentTrackIndex(index);
    localStorage.setItem('office_music_track', index.toString());

    if (audioRef.current) {
      const wasPlaying = isPlaying;
      // Pause current playback
      audioRef.current.pause();
      setIsPlaying(false);

      // Set new source
      audioRef.current.src = getTrackUrl(index);

      // Load and play if was playing
      if (wasPlaying) {
        audioRef.current.load();
        audioRef.current.addEventListener('canplaythrough', () => {
          audioRef.current?.play()
            .then(() => {
              setIsPlaying(true);
              setIsTransitioning(false);
            })
            .catch((error) => {
              console.error('Playback failed:', error);
              setIsTransitioning(false);
            });
        }, { once: true });
      } else {
        audioRef.current.load();
        setIsTransitioning(false);
      }
    }
    setShowPlaylist(false);
  };

  // Load saved track on mount
  useEffect(() => {
    const savedTrack = localStorage.getItem('office_music_track');
    if (savedTrack) {
      const trackIndex = parseInt(savedTrack);
      if (trackIndex >= 0 && trackIndex < MUSIC_TRACKS.length) {
        setCurrentTrackIndex(trackIndex);
      }
    }
  }, []);

  // Handle audio error and fallback to CDN
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => {
      if (!useFallback) {
        console.log('Local audio files not found, switching to demo music...');
        setUseFallback(true);
        // Reload with fallback URL
        audio.src = MUSIC_TRACKS[currentTrackIndex].fallbackUrl;
        audio.load();
      }
    };

    audio.addEventListener('error', handleError);
    return () => audio.removeEventListener('error', handleError);
  }, [currentTrackIndex, useFallback]);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={getTrackUrl(currentTrackIndex)}
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Music Player */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Playlist Modal */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-3 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] min-w-[280px] max-h-[400px] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-white">🎵 Playlist</h3>
                <button
                  onClick={() => setShowPlaylist(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {MUSIC_TRACKS.map((track, index) => (
                  <motion.button
                    key={track.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectTrack(index)}
                    disabled={isTransitioning}
                    className={`w-full p-3 rounded-xl text-left transition-all ${index === currentTrackIndex
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30'
                      : 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
                      } ${isTransitioning ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{track.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${index === currentTrackIndex ? 'text-blue-400' : 'text-white'}`}>
                            {track.name}
                          </span>
                          {index === currentTrackIndex && isPlaying && (
                            <motion.div
                              className="flex gap-[2px] items-end h-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-[3px] bg-blue-400 rounded-full"
                                  animate={{
                                    height: ['40%', '100%', '40%'],
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                  }}
                                />
                              ))}
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{track.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-3 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] min-w-[200px]"
            >
              {/* Volume Control */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">
                    Volume
                  </span>
                  <span className="text-xs text-blue-400">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleMute}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div
                  className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-600"}`}
                />
                {isPlaying ? "Playing" : "Paused"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <div className="flex flex-col gap-2 items-end">
          {/* Playlist Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowPlaylist(!showPlaylist);
              setShowControls(false);
            }}
            className={`w-10 h-10 backdrop-blur-xl border rounded-full flex items-center justify-center transition-all shadow-lg ${showPlaylist
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            aria-label="Show playlist"
          >
            <List className="w-4 h-4" />
          </motion.button>

          {/* Skip Track Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextTrack}
            disabled={isTransitioning}
            className={`w-10 h-10 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-all shadow-lg ${isTransitioning ? 'opacity-50 cursor-wait' : ''
              }`}
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </motion.button>

          {/* Expand/Collapse Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowControls(!showControls);
              setShowPlaylist(false);
            }}
            className="w-10 h-10 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-all shadow-lg"
            aria-label={
              showControls ? "Hide controls" : "Show controls"
            }
          >
            {showControls ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <Volume1 className="w-4 h-4" />
            )}
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlay}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isPlaying
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              : "bg-gray-900/80 backdrop-blur-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
              }`}
            aria-label={
              isPlaying ? "Pause music" : "Play music"
            }
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-white rounded-full" />
                <div className="w-1 h-4 bg-white rounded-full" />
              </div>
            ) : (
              <Music className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* First Interaction Prompt */}
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-blue-600/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
          >
            Click to play music! 🎵
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-blue-600/90" />
          </motion.div>
        )}

        {/* Now Playing Indicator */}
        {hasInteracted && showControls && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 bottom-0 bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-800 shadow-lg max-w-[200px]"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentTrack.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{currentTrack.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{currentTrack.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}