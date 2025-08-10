// components/stream/LiveStream.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Settings,
  Play,
  Pause,
} from 'lucide-react';

interface LiveStreamProps {
  src: string;
  timeRange: string;
  score?: string;
  teamA?: string;
  teamB?: string;
}

export default function LiveStream({
  src,
  timeRange,
  score = '–',
  teamA = '',
  teamB = '',
}: LiveStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [safeIframeSrc, setSafeIframeSrc] = useState<string | null>(null);

  // Detect HLS manifest
  const isHls = /\.m3u8(\?.*)?$/i.test(src);

  // HLS.js setup
  useEffect(() => {
    if (!isHls) return;

    const video = videoRef.current;
    if (!video) return;

    video.controls = true;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      // Safari native HLS
      video.src = src;
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      if (hls) {
        hls.destroy();
        hls = null;
      }
    };
  }, [src, isHls]);

  // Sanitize iframe src for non-HLS embeds (prevent same-origin iframes)
  useEffect(() => {
    if (isHls) return;

    try {
      const url = new URL(src, window.location.origin);
      if (url.origin !== window.location.origin) {
        setSafeIframeSrc(url.toString());
      } else {
        console.warn('Blocked same-origin iframe URL:', url.toString());
        setSafeIframeSrc(null);
      }
    } catch {
      console.error('Invalid iframe URL:', src);
      setSafeIframeSrc(null);
    }
  }, [src, isHls]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying) {
      void v.pause();
    } else {
      const p = v.play();
      if (p && typeof (p as Promise<void>).catch === 'function') {
        (p as Promise<void>).catch((err) => {
          console.error('play() failed:', err);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restartVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    const p = v.play();
    if (p && typeof (p as Promise<void>).catch === 'function') {
      (p as Promise<void>).catch((err) => {
        console.error('play() after restart failed:', err);
      });
    }
    setIsPlaying(true);
  };

  const toggleFullScreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) {
      const p = document.exitFullscreen();
      if (p && typeof (p as Promise<void>).catch === 'function') {
        (p as Promise<void>).catch((err) => {
          console.error('exitFullscreen() failed:', err);
        });
      }
    } else {
      const p = v.requestFullscreen?.();
      if (p && typeof (p as Promise<void>).catch === 'function') {
        (p as Promise<void>).catch((err) => {
          console.error('requestFullscreen() failed:', err);
        });
      }
    }
  };

  return (
    <div className="w-full max-w-full mx-auto">
      {/* Player container */}
      <div className="relative w-full overflow-hidden rounded-lg bg-black">
        {isHls ? (
          <video
            ref={videoRef}
            className="w-full h-auto"
            muted={isMuted}
            controls
            style={{ border: 'none' }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : safeIframeSrc ? (
          // keep a stable aspect on all screens
          <div className="relative w-full pb-[56.25%]">
            <iframe
              src={safeIframeSrc}
              allowFullScreen
              frameBorder="0"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-gray-400">
            Stream unavailable
          </div>
        )}

        {/* Custom HLS Controls Bar (overlay stays inside player) */}
        {isHls && (
          <div className="absolute bottom-12 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent px-4 py-2 text-white text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 font-semibold">
                <span>{teamA}</span>
                <span className="text-lg">{score}</span>
                <span>{teamB}</span>
                <span className="ml-3 font-normal text-gray-300">
                  {timeRange}
                </span>
              </div>
              <div className="mt-2 flex items-center space-x-4 sm:mt-0">
                <button onClick={togglePlay} title="Play/Pause">
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button onClick={toggleMute} title="Mute/Unmute">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={restartVideo} title="Restart">
                  <RotateCcw size={18} />
                </button>
                <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold">
                  LIVE
                </span>
                <button onClick={toggleFullScreen} title="Fullscreen">
                  <Maximize2 size={18} />
                </button>
                <button
                  onClick={() => alert('Settings not implemented')}
                  title="Settings"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail bar BELOW the player (now outside, so it won't get hidden) */}
      <div className="mt-3 w-full rounded-lg border border-white/10 bg-zinc-900/60 px-4 py-3 text-white">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">{teamA}</span>
            <span className="text-base font-semibold">{score}</span>
            <span className="text-sm text-gray-300">{teamB}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span className="inline-flex items-center rounded bg-red-600/90 px-2 py-0.5 text-xs font-bold">
              LIVE
            </span>
            <span>{timeRange}</span>
          </div>
        </div>
      </div>
    </div>
  );

}
