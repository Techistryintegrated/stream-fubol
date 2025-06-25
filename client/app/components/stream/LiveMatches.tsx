'use client';

import { useState } from 'react';
import LiveSearchBar from './LiveSearchBar';
import LiveMatchCard from './LiveMatchCard';

const mockMatches = [
  {
    time: '12:40 - 13:25',
    teams: 'Chelsea vs Manchester United',
    score: '1 - 0',
  },
  { time: '12:40 - 13:25', teams: 'Leeds vs Liverpool', score: '1 - 0' },
  { time: '12:40 - 13:25', teams: 'Leeds vs Liverpool', score: '1 - 0' },
  { time: '12:40 - 13:25', teams: 'Leeds vs Liverpool', score: '1 - 0' },
  { time: '12:40 - 13:25', teams: 'Leeds vs Liverpool', score: '1 - 0' },
];

export default function LiveMatches() {
  const [search, setSearch] = useState('');

  const filtered = mockMatches.filter((m) =>
    m.teams.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-black min-h-screen px-4 py-6 text-white w-full max-w-md mx-auto">
      <h2 className="text-base font-semibold mb-4">All Live Matches</h2>
      <LiveSearchBar onChange={setSearch} />
      <div>
        {filtered.map((match, index) => (
          <LiveMatchCard
            key={index}
            time={match.time}
            teams={match.teams}
            score={match.score}
            isActive={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
