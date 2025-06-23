'use client';

import { useEffect, useState, createContext, ReactNode } from 'react';

interface MatchData {
  gmid: number;
  teamA: string;
  teamB: string;
  time: string;
}

interface StreamContextType {
  matches: MatchData[];
}

export const StreamContext = createContext<StreamContextType>({
  matches: [],
});

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
