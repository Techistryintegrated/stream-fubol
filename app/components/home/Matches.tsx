'use client';
import React, { useState } from 'react';
import UpcomingMatches from './UpcomingMatches';
import LiveMatches from './LiveMatches';
// import LiveMatches from './LiveMatches'; // Placeholder if you want to add later

const Matches = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');

  return (
    <div className="w-full flex justify-center bg-black text-white py-10 px-4">
      <div className="w-full max-w-6xl">
        {/* Tab Switcher */}
        <div className="flex gap-6 lg:text-2xl font-semibold lg:tracking-[-1.82px] leading-[61px] border-b border-gray-700 px-10 mb-6" id='live'>
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
            id='upcoming'
          >
            Upcoming Matches
          </button>
        </div>

        {/* Content Switch */}
        {activeTab === 'upcoming' && <UpcomingMatches />}
        {activeTab === 'live' && <LiveMatches />}
      </div>
    </div>
  );
};

export default Matches;
