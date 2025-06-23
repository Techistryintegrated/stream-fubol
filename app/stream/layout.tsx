'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamContext, MatchData } from './StreamContext';

export default function StreamLayout({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<MatchData[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch('/api/stream/match_list?sportId=1');
        const { matches } = await res.json();
        setMatches(matches);
      } catch {
        setMatches([]);
      }
    }
    fetchMatches();
  }, []);

  return (
    <StreamContext.Provider value={{ matches }}>
      {children}
    </StreamContext.Provider>
  );
}
