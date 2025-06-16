import { useEffect, useState } from 'react';
import MatchSearchBar from '../shared/MatchSearchBar';
import LeagueFilter from '../shared/LeagueFilter';
import { LeagueSection } from './LeagueSection';

interface MatchData {
  gmid: number;
  league: string;
  leagueLogo: string;
  time: string;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  stime: string;
  iplay: boolean;
  status: string;
}

export default function LiveMatches() {
  const [matchesByLeague, setMatchesByLeague] = useState<
    { league: string; matches: MatchData[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const res = await fetch('/api/stream/match_list?sportId=1');
      const { matches } = await res.json();

      const grouped: Record<string, MatchData[]> = {};
      matches.forEach((match: MatchData) => {
        const safeMatch = {
          ...match,
          time: match.time ?? '',
        };
        if (!grouped[safeMatch.league]) grouped[safeMatch.league] = [];
        grouped[safeMatch.league].push(safeMatch);
      });

      setMatchesByLeague(
        Object.entries(grouped).map(([league, matches]) => ({
          league,
          matches,
        }))
      );
      setLoading(false);
    };
    fetchMatches();
  }, []);

  return (
    <div className="bg-black min-h-screen px-4 pt-6 flex flex-col md:flex-row gap-6">
      <div className="hidden lg:block w-20 text-white bg-white text-center text-sm">
        AD
        <br />
        Space
      </div>
      <div className="flex-1 max-w-5xl">
        <div className="border-b border-gray-700 pb-4">
          <MatchSearchBar />
          <LeagueFilter />
          <div className="rounded-[10px] border-[#222] border-2 p-5">
            {loading ? (
              <div className="text-white">Loading...</div>
            ) : matchesByLeague.length === 0 ? (
              <div className="text-white">No live streamable matches</div>
            ) : (
              matchesByLeague.map((section, i) => (
                <LeagueSection
                  key={i}
                  league={section.league}
                  matches={section.matches}
                  type="live"
                />
              ))
            )}
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-20 text-white bg-white text-center text-sm">
        AD
        <br />
        Space
      </div>
    </div>
  );
}
