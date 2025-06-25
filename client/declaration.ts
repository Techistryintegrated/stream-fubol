export interface Match {
  gmid: number;
  league: string;
  leagueLogo: string;
  time: string | null;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  stime: string | null;
  iplay: boolean;
  status: string;
}


export interface LeagueSectionProps {
  league: string;
  matches: Match[];
  type: 'live' | 'upcoming';
}