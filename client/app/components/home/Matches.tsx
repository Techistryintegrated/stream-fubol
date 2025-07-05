'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useState as useReactState,
} from 'react';
import UpcomingMatches from './UpcomingMatches';
import LiveMatches from './LiveMatches';
import AdUnit from '../shared/AdUnit';

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useReactState(0);

  useEffect(() => {
    const currentRef = contentRef.current;
    const resizeObserver = new ResizeObserver(() => {
      if (currentRef) {
        setContentHeight(currentRef.offsetHeight);
      }
    });

    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, [setContentHeight]);

  return (
    <div className="w-full flex justify-center bg-black text-white py-10 px-2">
      <div className="flex w-full max-w-[1400px] gap-4 items-start">
        {/* Left Ad */}
        <div className="hidden lg:block" style={{ height: contentHeight }}>
          <div className="sticky top-10 h-full flex flex-col gap-4">
            <AdUnit />
            <AdUnit />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-6xl" ref={contentRef}>
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-700 px-4 mb-6">
            <button
              className={`pb-2 transition ${
                activeTab === 'live'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('live')}
            >
              Live Matches
            </button>
            <button
              className={`pb-2 transition ${
                activeTab === 'upcoming'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Matches
            </button>
          </div>

          {/* Content */}
          {activeTab === 'live' && <LiveMatches />}
          {activeTab === 'upcoming' && <UpcomingMatches />}
        </div>

        {/* Right Ad */}
        <div className="hidden lg:block" style={{ height: contentHeight }}>
          <div className="sticky top-10 h-full flex flex-col gap-4">
            <AdUnit />
            <AdUnit />
          </div>
        </div>
      </div>
    </div>
  );
}
