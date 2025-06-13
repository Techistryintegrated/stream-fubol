import { LiveMatchCard } from './LiveMatchCard';
import { MatchCard } from '../shared/MatchCard';

interface LeagueSectionProps {
  league: string;
  matches: {
    time: string;
    teamA: string;
    teamB: string;
    logoA: string;
    logoB: string;
  }[];
  type: string;
}

export function LeagueSection({ league, matches, type }: LeagueSectionProps) {
  const matchCount = matches.length;
  return (
    <div className="text-white mb-6 ">
      <h3 className="text-sm font-normal ">{league}</h3>
      <p className="text-sm font-normal text-[#FFFFFFB2]">{matchCount} game</p>
      <div className="mt-5">
        {type === 'live'
          ? matches.map((m, i) => <LiveMatchCard key={i} {...m} />)
          : matches.map((m, i) => <MatchCard key={i} {...m} />)}
      </div>
    </div>
  );
}
