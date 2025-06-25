'use client';

import { createContext } from 'react';

export interface MatchData {
  gmid: number;
  teamA: string;
  teamB: string;
  time: string;
}

export interface StreamContextType {
  matches: MatchData[];
}

export const StreamContext = createContext<StreamContextType>({
  matches: [],
});
