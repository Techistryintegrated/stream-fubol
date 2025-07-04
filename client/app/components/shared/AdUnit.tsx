'use client';
import { useEffect } from 'react';

export default function AdUnit() {
  useEffect(() => {
    try {
      // @ts-expect-error: adsbygoogle is not defined on the window object by TypeScript
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-4883362165426113"
      data-ad-slot="1460800568"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
