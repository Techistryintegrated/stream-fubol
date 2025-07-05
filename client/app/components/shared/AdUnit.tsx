'use client';
import { useEffect } from 'react';

// Extend the Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdUnit() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        // Optional: only push if element is in DOM
        if (window.adsbygoogle && document.querySelector('.adsbygoogle')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }, 1000); // wait until layout settles

    return () => clearTimeout(timeout);
  }, []);
  

  return (
    <div className="w-full min-w-[300px] h-auto text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100px' }}
        data-ad-client="ca-pub-4883362165426113"
        data-ad-slot="1460800568"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
