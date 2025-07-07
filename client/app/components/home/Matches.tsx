// Matches.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import UpcomingMatches from './UpcomingMatches';
import LiveMatches from './LiveMatches';
import AdUnit from '../shared/AdUnit';

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure main panel for sticky ads
  useEffect(() => {
    const update = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-black text-white py-10 px-2">
      <div className="flex w-full items-start gap-4">
        {/* Left ad = 20% on lg+, hidden below */}
        <div className="hidden lg:block flex-none w-[20%]">
          <div
            className="sticky top-10 flex flex-col gap-4"
            style={{ height: contentHeight }}
          >
            <AdUnit />
            <AdUnit />
          </div>
        </div>

        {/* Main = 60% on lg+, or full-width below */}
        <div ref={contentRef} className="flex-none w-full lg:w-[60%] min-w-0">
          <div className="px-2 md:px-0">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-700 px-4 mb-6">
              <button
                onClick={() => setActiveTab('live')}
                className={`pb-2 font-semibold transition ${
                  activeTab === 'live'
                    ? 'text-white border-b-2 border-green-500'
                    : 'text-gray-400'
                }`}
              >
                Live Matches
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`pb-2 font-semibold transition ${
                  activeTab === 'upcoming'
                    ? 'text-white border-b-2 border-green-500'
                    : 'text-gray-400'
                }`}
              >
                Upcoming Matches
              </button>
            </div>

            {/* Content */}
            {activeTab === 'live' ? <LiveMatches /> : <UpcomingMatches />}
          </div>
        </div>

        {/* Right ad = 20% on lg+, hidden below */}
        <div className="hidden lg:block flex-none w-[20%]">
          <div
            className="sticky top-10 flex flex-col gap-4"
            style={{ height: contentHeight }}
          >
            <AdUnit />
            <AdUnit />
          </div>
        </div>
      </div>
    </div>
  );
}
