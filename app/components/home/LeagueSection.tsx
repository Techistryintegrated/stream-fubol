import { LiveMatchCard } from './LiveMatchCard';
import { MatchCard } from '../shared/MatchCard';

interface MatchData {
  gmid: number;
  league: string;
  leagueLogo: string;
  time: string; // Now always string
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  stime: string;
  iplay: boolean;
  status: string;
}

interface LeagueSectionProps {
  league: string;
  matches: MatchData[];
  type: 'live' | 'upcoming';
}

export function LeagueSection({ league, matches, type }: LeagueSectionProps) {
  return (
    <div className="text-white mb-6">
      <h3 className="text-sm font-normal">{league}</h3>
      <p className="text-sm font-normal text-[#FFFFFFB2]">
        {matches.length} game
      </p>
      <div className="mt-5">
        {matches.map((m) =>
          type === 'live' ? (
            <LiveMatchCard
              key={m.gmid}
              time={m.time}
              teamA={m.teamA}
              teamB={m.teamB}
              logoA={m.logoA}
              logoB={m.logoB}
            />
          ) : (
            <MatchCard
              key={m.gmid}
              time={m.time}
              teamA={m.teamA}
              teamB={m.teamB}
              logoA={m.logoA}
              logoB={m.logoB}
            />
          )
        )}
      </div>
    </div>
  );
}
