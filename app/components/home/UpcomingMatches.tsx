import { useEffect, useState } from 'react';
import MatchSearchBar from '../shared/MatchSearchBar';
import LeagueFilter from '../shared/LeagueFilter';
import DateSelector from '../shared/DateSelector';
import { LeagueSection } from './LeagueSection';
import { format } from 'date-fns';

export default function UpcomingMatches() {
  const [matchesByLeague, setMatchesByLeague] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      // Pass date as YYYY-MM-DD to the API for backend date filtering
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const res = await fetch(
        `/api/stream/match_list?sportId=1&type=upcoming&date=${dateStr}`
      );
      const { matches } = await res.json();

      // Group by league
      const grouped: Record<string, any[]> = {};
      matches.forEach((match: any) => {
        if (!grouped[match.league]) grouped[match.league] = [];
        grouped[match.league].push(match);
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
  }, [selectedDate]);

  return (
    <div className="bg-black min-h-screen px-4 pt-6 flex flex-col md:flex-row gap-6">
      {/* Left Ad */}
      <div className="hidden lg:block w-20 text-white bg-white text-center text-sm">
        AD
        <br />
        Space
      </div>
      {/* Main Content */}
      <div className="flex-1 max-w-5xl">
        <div className="border-b border-gray-700 pb-4">
          <MatchSearchBar />
          <LeagueFilter />
          <DateSelector onDateChange={setSelectedDate} />
          <div className="rounded-[10px] border-[#222] border-2 p-5">
            {loading ? (
              <div className="text-white">Loading...</div>
            ) : matchesByLeague.length === 0 ? (
              <div className="text-white">No upcoming matches</div>
            ) : (
              matchesByLeague.map((section, i) => (
                <LeagueSection
                  key={i}
                  league={section.league}
                  matches={section.matches}
                  type="upcoming"
                />
              ))
            )}
          </div>
        </div>
      </div>
      {/* Right Ad */}
      <div className="hidden lg:block w-20 text-white bg-white text-center text-sm">
        AD
        <br />
        Space
      </div>
    </div>
  );
}
