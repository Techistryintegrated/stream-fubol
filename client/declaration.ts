// client/declaration.ts
export interface MatchData {
  gmid: number | null;
  league: string;
  leagueLogo: string;
  time: string;
  stime: string;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  iplay: boolean;
  status: string;
  statusCode?: string;
  statusType?: string;
  score?: string;
  stream?: string;
}

export interface LeagueSectionProps {
  league: string;
  matches: MatchData[];
  type: 'live' | 'upcoming';
}
