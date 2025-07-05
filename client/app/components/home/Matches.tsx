'use client';

import React, { useState, useRef, useEffect } from 'react';
import UpcomingMatches from './UpcomingMatches';
import LiveMatches from './LiveMatches';
import AdUnit from '../shared/AdUnit';

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    };

    updateHeight(); // Initial run

    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-black text-white py-10 px-2">
      <div className="max-w-[1400px] mx-auto flex flex-row items-start gap-4">
        {/* Left Ad */}
        <div
          className="hidden lg:block w-[160px] shrink-0"
          style={{ height: contentHeight }}
        >
          <div className="sticky top-10 h-full flex flex-col gap-4">
            <AdUnit />
            <AdUnit />
          </div>
        </div>

        {/* Main Content */}
        <div ref={contentRef} className="flex-1 min-w-0 max-w-full">
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

          {activeTab === 'live' && <LiveMatches />}
          {activeTab === 'upcoming' && <UpcomingMatches />}
        </div>

        {/* Right Ad */}
        <div
          className="hidden lg:block w-[160px] shrink-0"
          style={{ height: contentHeight }}
        >
          <div className="sticky top-10 h-full flex flex-col gap-4">
            <AdUnit />
            <AdUnit />
          </div>
        </div>
      </div>
    </div>
  );
}
