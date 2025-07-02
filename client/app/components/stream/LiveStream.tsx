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
  score?: string; // Optional score prop
  teamA?: string; // Optional team names for HLS streams
  teamB?: string; // Optional team names for HLS streams
}

export default function LiveStream({
  src,
  timeRange,
  score,
  teamA,
  teamB,
}: LiveStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Determine if source is an HLS manifest (.m3u8)
  const isHls = src.includes('.m3u8');

  useEffect(() => {
    if (!isHls) return; // only attach Hls.js when needed

    const video = videoRef.current!;
    video.controls = true;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else {
      // Safari native HLS
      video.src = src;
    }
  }, [src, isHls]);

  const togglePlay = () => {
    const v = videoRef.current!;
    if (isPlaying) v.pause();
    else v.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const v = videoRef.current!;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restartVideo = () => {
    const v = videoRef.current!;
    v.currentTime = 0;
    v.play();
    setIsPlaying(true);
  };

  const toggleFullScreen = () => {
    const v = videoRef.current!;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen()?.catch(console.error);
  };

  return (
    <div className="w-full max-w-full mx-auto rounded-lg overflow-hidden relative bg-black">
      {isHls ? (
        <video
          ref={videoRef}
          className="w-full h-auto"
          muted={isMuted}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <div className="relative w-full pb-[56.25%]">
          <iframe
            src={src}
            allowFullScreen
            frameBorder="0"
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      )}
      {isHls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent px-4 py-3 text-white text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="font-semibold">
              {teamA} vs {teamB}
              <span className="ml-3 text-gray-400 font-normal">
                {timeRange}
              </span>
            </div>
            <div className="flex gap-4 items-center mt-3 sm:mt-0">
              <div className="w-32 h-1 bg-white/30 rounded overflow-hidden">
                <div className="w-2/5 h-full bg-[#00F0A9]" />
              </div>
              <button onClick={togglePlay} title="Play/Pause">
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button onClick={toggleMute} title="Mute/Unmute">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button onClick={restartVideo} title="Restart">
                <RotateCcw size={18} />
              </button>
              <span className="bg-red-600 px-2 py-0.5 rounded text-xs font-bold">
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
      <div
        className=" flex-col
      w-full
      bg-green-600 text-white bg-opacity-60 backdrop-blur-sm
      rounded-t-lg
      py-2 px-4
      flex justify-center items-center gap-3 space-x-8
    "
      >
        <div className=" flex justify-center items-center space-x-8">
          <span className="text-sm font-medium text-gray-200">{teamA}</span>
          <span className="text-xl font-bold text-white">{score}</span>
          <span className="text-sm font-medium text-gray-200">{teamB}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-200">{timeRange}</p>
        </div>
      </div>{' '}
    </div>
  );
}
