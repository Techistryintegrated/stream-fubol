// components/stream/CustomHlsPlayer.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

interface CustomHlsPlayerProps {
  manifestUrl: string;
}

export default function CustomHlsPlayer({ manifestUrl }: CustomHlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  console.log('na here e dey');

  useEffect(() => {
    let hls: Hls | undefined;
    let blobUrl: string | undefined;

    async function loadStream() {
      try {
        // 1) Extract original host
        const url = new URL(manifestUrl);
        const host = url.host;
        console.log('e don reach here');
        // 2) DNS lookup
        const dnsRes = await fetch(
          `https://hcdnl-pull302-global-gslb.livehwc3.cn/v1/live/dns?dns=${host}&withdomain=1&dualstack=1`
        );
        const dnsJson = await dnsRes.json();
        const info = dnsJson.data[host];
        const replacement = info.ips[0].domain || info.ips[0].ip;

        // 3) Fetch original manifest
        const manifestText = await fetch(manifestUrl).then((r) => r.text());

        // 4) Rewrite URLs in the manifest
        const rewritten = manifestText.replace(
          new RegExp(`https://${host}`, 'g'),
          `https://${replacement}`
        );

        // 5) Create a blob URL for the rewritten manifest
        const blob = new Blob([rewritten], {
          type: 'application/vnd.apple.mpegurl',
        });
        blobUrl = URL.createObjectURL(blob);

        // 6) Attach to video via HLS.js or native
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(blobUrl);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = blobUrl;
        }
      } catch (err) {
        console.error('Error loading HLS stream:', err);
      }
    }

    loadStream();

    return () => {
      if (hls) hls.destroy();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [manifestUrl]);

  return <video ref={videoRef} controls className="w-full h-auto bg-black" />;
}
