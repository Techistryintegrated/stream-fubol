'use client';

import React, { useState } from 'react';
import UpcomingMatches from './UpcomingMatches';
import LiveMatches from './LiveMatches';

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');

  return (
    <div className="w-full flex justify-center bg-black text-white py-10 px-4">
      <div className="w-full max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-700 px-10 mb-6">
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
    </div>
  );
}
