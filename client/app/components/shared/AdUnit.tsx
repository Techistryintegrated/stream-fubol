'use client';
import { useEffect } from 'react';

// Extend window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdUnit() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const ins = document.querySelector('.adsbygoogle') as HTMLElement | null;
      if (!ins) return;
      const width = ins.offsetWidth;
      // only run AdSense when there's actually space
      if (width < 160) return;

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense push error:', e);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full h-auto text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100px' }}
        data-ad-client="ca-pub-4883362165426113"
        data-ad-slot="1460800568"
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest="on"
      />
    </div>
  );
}
