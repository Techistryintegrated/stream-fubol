// 'use client';
// import { useRef, useState, useEffect } from 'react';
// import Hls from 'hls.js';
// import {
//   Volume2,
//   VolumeX,
//   RotateCcw,
//   Maximize2,
//   Settings,
//   Play,
//   Pause,
// } from 'lucide-react';

// interface LiveStreamProps {
//   src: string;
//   matchTitle: string;
//   timeRange: string;
// }

// export default function LiveStream({
//   src,
//   matchTitle,
//   timeRange,
// }: LiveStreamProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const isEmbed = src.includes('iframe');

//   useEffect(() => {
//     if (isEmbed) return;
//     const video = videoRef.current!;
//     // Always enable controls
//     video.controls = true;

//     if (Hls.isSupported() && src.endsWith('.m3u8')) {
//       const hls = new Hls();
//       hls.loadSource(src);
//       hls.attachMedia(video);
//       return () => hls.destroy();
//     } else {
//       video.src = src;
//     }
//   }, [src, isEmbed]);

//   const togglePlay = () => {
//     const v = videoRef.current!;
//     if (isPlaying) {
//       v.pause();
//     } else {
//       v.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const toggleMute = () => {
//     const v = videoRef.current!;
//     v.muted = !isMuted;
//     setIsMuted(!isMuted);
//   };

//   const restartVideo = () => {
//     const v = videoRef.current!;
//     v.currentTime = 0;
//     v.play();
//     setIsPlaying(true);
//   };

//   const toggleFullScreen = () => {
//     const v = videoRef.current!;
//     if (document.fullscreenElement) document.exitFullscreen();
//     else v.requestFullscreen().catch(console.error);
//   };

//   return (
//     <div className="w-full max-w-full mx-auto rounded-lg overflow-hidden relative bg-black">
//       {isEmbed ? (
//         <div className="relative w-full pb-[56.25%]">
//           <iframe
//             src={src}
//             allowFullScreen
//             frameBorder="0"
//             className="absolute top-0 left-0 w-full h-full"
//           />
//         </div>
//       ) : (
//         <video
//           ref={videoRef}
//           className="w-full h-auto"
//           muted={isMuted}
//           // Show native controls for HLS or MP4
//           controls
//           onPlay={() => setIsPlaying(true)}
//           onPause={() => setIsPlaying(false)}
//         />
//       )}

//       {!isEmbed && (
//         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent px-4 py-3 text-white text-sm">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <div className="font-semibold">
//               {matchTitle}
//               <span className="ml-3 text-gray-400 font-normal">
//                 {timeRange}
//               </span>
//             </div>
//             <div className="flex gap-4 items-center mt-3 sm:mt-0">
//               <div className="w-32 h-1 bg-white/30 rounded overflow-hidden">
//                 <div className="w-2/5 h-full bg-[#00F0A9]" />
//               </div>
//               <button onClick={togglePlay} title="Play/Pause">
//                 {isPlaying ? <Pause size={18} /> : <Play size={18} />}
//               </button>
//               <button onClick={toggleMute} title="Mute/Unmute">
//                 {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
//               </button>
//               <button onClick={restartVideo} title="Restart">
//                 <RotateCcw size={18} />
//               </button>
//               <span className="bg-red-600 px-2 py-0.5 rounded text-xs font-bold">
//                 LIVE
//               </span>
//               <button onClick={toggleFullScreen} title="Fullscreen">
//                 <Maximize2 size={18} />
//               </button>
//               <button
//                 onClick={() => alert('Settings not implemented')}
//                 title="Settings"
//               >
//                 <Settings size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useRef, useEffect, useState } from 'react';
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
  src: string; // either iframe URL or HLS manifest URL
  matchTitle: string;
  timeRange: string;
}

export default function LiveStream({
  src,
  matchTitle,
  timeRange,
}: LiveStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEmbed, setIsEmbed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Determine embed vs HLS
  useEffect(() => {
    setIsEmbed(src.includes('iframe'));
  }, [src]);

  // For HLS: perform DNS lookup & rewrite before playback
  useEffect(() => {
    if (isEmbed) return;

    let hls: Hls | undefined;
    let blobUrl: string | undefined;

    async function initHls() {
      try {
        const url = new URL(src);
        const host = url.host;

        // 1) DNS API
        const dnsRes = await fetch(
          `https://hcdnl-pull302-global-gslb.livehwc3.cn/v1/live/dns?dns=${host}&withdomain=1&dualstack=1`
        );
        const dn = await dnsRes.json();
        const ipEntry = dn.data[host].ips[0];
        const replacement = ipEntry.domain || ipEntry.ip;

        // 2) Fetch original manifest
        const text = await fetch(src).then((r) => r.text());

        // 3) Rewrite URLs
        const rewritten = text.replace(
          new RegExp(`https://${host}`, 'g'),
          `https://${replacement}`
        );

        // 4) Create blob URL
        const blob = new Blob([rewritten], {
          type: 'application/vnd.apple.mpegurl',
        });
        blobUrl = URL.createObjectURL(blob);

        // 5) Setup HLS.js or native
        const video = videoRef.current!;
        video.controls = true;

        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(blobUrl);
          hls.attachMedia(video);
        } else {
          video.src = blobUrl;
        }

      } catch (err) {
        console.error('HLS init error', err);
      }
    }

    initHls();

    return () => {
      hls?.destroy();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [src, isEmbed]);

  const togglePlay = () => {
    const v = videoRef.current!;
    if (isPlaying) {
      v.pause();
    } else {
      v.play();
    }
    setIsPlaying(!isPlaying);
  };
  const toggleMute = () => {
    const v = videoRef.current!;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  const restart = () => {
    const v = videoRef.current!;
    v.currentTime = 0;
    v.play();
    setIsPlaying(true);
  };
  const toggleFS = () => {
    const v = videoRef.current!;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen().catch(console.error);
  };

  return (
    <div className="w-full mx-auto rounded-lg overflow-hidden relative bg-black">
      {isEmbed ? (
        // 16:9 wrapper
        <div className="relative w-full pb-[56.25%]">
          <iframe
            src={src}
            allowFullScreen
            frameBorder="0"
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-auto"
          muted={isMuted}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Controls overlay only for video mode */}
      {!isEmbed && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent px-4 py-3 text-white text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="font-semibold">
              {matchTitle}
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
              <button onClick={restart} title="Restart">
                <RotateCcw size={18} />
              </button>
              <span className="bg-red-600 px-2 py-0.5 rounded text-xs font-bold">
                LIVE
              </span>
              <button onClick={toggleFS} title="Fullscreen">
                <Maximize2 size={18} />
              </button>
              <button onClick={() => alert('Settings')} title="Settings">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

