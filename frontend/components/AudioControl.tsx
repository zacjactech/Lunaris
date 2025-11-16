'use client';

import { useState, useRef, useEffect } from 'react';

// Soft piano melodies for emotional calmness and mindfulness
// Using royalty-free piano music from various sources
// 
// TO USE YOUR OWN MUSIC:
// 1. Download piano tracks from: Pixabay, Chosic, or YouTube Audio Library
// 2. Create folder: frontend/public/audio/
// 3. Place your .mp3 files there (e.g., midnight-keys.mp3)
// 4. Update URLs below to: '/audio/midnight-keys.mp3'
const AMBIENT_TRACKS = [
  {
    id: 'midnight-keys',
    name: 'Midnight Keys',
    url: 'https://www.bensound.com/bensound-music/bensound-pianomoment.mp3',
    icon: '🎹',
    description: 'Soft piano melody for late-night reflection'
  },
  {
    id: 'whispered-notes',
    name: 'Whispered Notes',
    url: 'https://www.bensound.com/bensound-music/bensound-memories.mp3',
    icon: '🎼',
    description: 'Gentle piano for peaceful meditation'
  },
  {
    id: 'velvet-ivory',
    name: 'Velvet Ivory',
    url: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3',
    icon: '🌙',
    description: 'Smooth piano tones for deep contemplation'
  },
  {
    id: 'silent-reverie',
    name: 'Silent Reverie',
    url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3',
    icon: '✨',
    description: 'Delicate piano for emotional processing'
  },
  {
    id: 'dawn-sonata',
    name: 'Dawn Sonata',
    url: 'https://www.bensound.com/bensound-music/bensound-clearday.mp3',
    icon: '🌅',
    description: 'Uplifting piano for morning mindfulness'
  },
  {
    id: 'twilight-serenade',
    name: 'Twilight Serenade',
    url: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3',
    icon: '🌆',
    description: 'Calming piano for evening tranquility'
  },
];

export default function AudioControl() {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Initialize state from localStorage
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('audioVolume');
    if (!savedVolume) {
      localStorage.setItem('audioVolume', '50');
      return 50;
    }
    return parseInt(savedVolume);
  });

  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('audioMuted') === 'true';
  });

  const [currentTrack, setCurrentTrack] = useState(() => {
    const savedTrack = localStorage.getItem('audioTrack');
    if (savedTrack) {
      const trackIndex = parseInt(savedTrack);
      if (trackIndex >= 0 && trackIndex < AMBIENT_TRACKS.length) {
        return trackIndex;
      }
    }
    localStorage.setItem('audioTrack', '5');
    return 5;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply volume and muted state to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Autoplay after component mounts
  useEffect(() => {
    const autoplayTimer = setTimeout(async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setError(null);
        } catch {
          // Autoplay might be blocked by browser - user will need to click play
          console.log('Autoplay prevented by browser. User interaction required.');
          setError(null); // Don't show error for autoplay prevention
        }
      }
    }, 1000);

    // Cleanup: pause audio when component unmounts
    return () => {
      clearTimeout(autoplayTimer);
    };
  }, []);

  // Handle track changes
  const changeTrack = async (index: number) => {
    const wasPlaying = isPlaying;
    
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setCurrentTrack(index);
    setError(null);
    localStorage.setItem('audioTrack', index.toString());

    // If was playing, start new track
    if (wasPlaying && audioRef.current) {
      setTimeout(async () => {
        try {
          audioRef.current?.load();
          await audioRef.current?.play();
          setIsPlaying(true);
          setError(null);
        } catch (err: unknown) {
          console.error('Audio play interrupted:', err);
          setError('Unable to play. Try another track.');
          setIsPlaying(false);
        }
      }, 200);
    }
  };

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          setError(null);
          // Reload the audio source if there was an error
          if (audioRef.current.error) {
            audioRef.current.load();
          }
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err: unknown) {
          console.error('Audio play error:', err);
          setError('Unable to play. Try another track.');
          setIsPlaying(false);
        }
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    localStorage.setItem('audioVolume', newVolume.toString());
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
    localStorage.setItem('audioMuted', newMuted.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newVolume = Math.min(100, volume + 5);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
      localStorage.setItem('audioVolume', newVolume.toString());
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newVolume = Math.max(0, volume - 5);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
      localStorage.setItem('audioVolume', newVolume.toString());
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" onKeyDown={handleKeyDown} tabIndex={0}>
      <audio 
        ref={audioRef} 
        loop 
        src={AMBIENT_TRACKS[currentTrack].url}
        preload="metadata"
        onError={(e) => {
          const target = e.target as HTMLAudioElement;
          const errorCode = target.error?.code;
          let errorMsg = 'Audio unavailable';
          
          if (errorCode === 2) {
            errorMsg = 'Network error';
          } else if (errorCode === 4) {
            errorMsg = 'Format not supported';
          }
          
          // Only log in development, don't show intrusive errors
          if (process.env.NODE_ENV === 'development') {
            console.warn('Audio loading issue:', {
              track: AMBIENT_TRACKS[currentTrack].name,
              code: errorCode,
              message: target.error?.message
            });
          }
          
          setError(errorMsg);
          setIsPlaying(false);
        }}
        onLoadedData={() => {
          setError(null);
        }}
        onCanPlay={() => {
          setError(null);
        }}
        onLoadStart={() => {
          // Clear any previous errors when starting to load
          setError(null);
        }}
      />

      {/* Collapsed State - Just Play Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          aria-label="Open audio controls"
          className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-muted text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* Expanded State - Full Controls */}
      {isExpanded && (
        <div
          className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-5 space-y-3 min-w-[300px] border border-white/50"
          onMouseLeave={() => {
            setIsExpanded(false);
            setShowTrackList(false);
          }}
        >
          {/* Current Track Display */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{AMBIENT_TRACKS[currentTrack].icon}</span>
              <span className="text-sm font-medium text-foreground">
                {AMBIENT_TRACKS[currentTrack].name}
              </span>
            </div>
            <button
              onClick={() => setShowTrackList(!showTrackList)}
              className="text-xs text-accent hover:underline font-medium"
            >
              {showTrackList ? 'Hide' : 'Change'}
            </button>
          </div>

          {/* Track List */}
          {showTrackList && (
            <div className="space-y-1 mb-3 max-h-40 overflow-y-auto">
              {AMBIENT_TRACKS.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    changeTrack(index);
                    setShowTrackList(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentTrack === index
                      ? 'bg-gradient-to-r from-accent to-indigo-500 text-white'
                      : 'hover:bg-emerald-50/50 text-foreground'
                  }`}
                >
                  <span>{track.icon}</span>
                  <span className="text-sm">{track.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-muted text-white hover:shadow-md transition-all flex-shrink-0"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="w-9 h-9 flex items-center justify-center text-foreground hover:text-accent transition-colors rounded-lg hover:bg-emerald-50/50 flex-shrink-0"
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </button>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="flex-1 h-2 bg-emerald-100/50 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <span className="text-xs text-gray-600 w-9 text-right">{volume}%</span>
            </div>
          </div>

          {error && (
            <div className="p-2 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg">
              <p className="text-xs text-red-600 text-center">
                {error}
              </p>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center pt-1">
            Space: Play/Pause • ↑↓: Volume
          </p>
        </div>
      )}
    </div>
  );
}
