'use client';

import React, { useState } from 'react';
import UpcomingMatches from './UpcomingMatches';
import LiveMatches from './LiveMatches';
import AdUnit from '../shared/AdUnit';

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');

  return (
    <div className="w-full flex justify-center bg-black text-white py-10 px-4">
      {/* Outer wrapper: full width */}
      <div className="flex w-full max-w-[1600px]">
        {/* Left Ad: fill purple area */}
        <div className="hidden lg:flex justify-center items-start w-[200px]">
          <AdUnit />
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-700 px-4 md:px-10 mb-6">
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

          {/* Match Content */}
          {activeTab === 'live' && <LiveMatches />}
          {activeTab === 'upcoming' && <UpcomingMatches />}
        </div>

        {/* Right Ad: fill purple area */}
        <div className="hidden lg:flex justify-center items-start w-[200px]">
          <AdUnit />
        </div>
      </div>
    </div>
  );
}
