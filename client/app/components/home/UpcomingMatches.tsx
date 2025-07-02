'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUpcomingMatches,
  setSearchQuery,
  setSelectedLeague,
} from '@/store/matchesSlice';
import MatchSearchBar from '../shared/MatchSearchBar';
import LeagueFilter from '../shared/LeagueFilter';
import DateSelector from '../shared/DateSelector';
import { format } from 'date-fns';
import { LeagueSection } from './LeagueSection';

export default function UpcomingMatches() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.matches.loadingUpcoming);
  const allMatches = useAppSelector((state) => state.matches.upcomingMatches);
  const searchQuery = useAppSelector((state) => state.matches.searchQuery);
  const selectedLeague = useAppSelector(
    (state) => state.matches.selectedLeague
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const lastFetchedDate = useRef<string | null>(null);

  // Fetch only once per date change
  useEffect(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    if (lastFetchedDate.current !== dateStr) {
      dispatch(fetchUpcomingMatches(dateStr));
      lastFetchedDate.current = dateStr;
    }
  }, [dispatch, selectedDate]);

  // derive unique leagues and logos
  const leagues = Array.from(
    new Map(allMatches.map((m) => [m.league, m.leagueLogo]))
  ).map(([league, logo]) => ({ league, logo }));

  // filter by league & search
  const filteredMatches = allMatches.filter((m) => {
    const byLeague = !selectedLeague || m.league === selectedLeague;
    const bySearch =
      m.teamA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.teamB.toLowerCase().includes(searchQuery.toLowerCase());
    return byLeague && bySearch;
  });

  // group by league
  const grouped = filteredMatches.reduce(
    (acc: Record<string, typeof filteredMatches>, match) => {
      (acc[match.league] ??= []).push(match);
      return acc;
    },
    {} as Record<string, typeof filteredMatches>
  );

  const matchesByLeague = Object.entries(grouped).map(([league, matches]) => ({
    league,
    matches,
  }));

  return (
    <div className="bg-black min-h-screen pt-6">
      <div className="max-w-5xl mx-auto">
        <MatchSearchBar
          value={searchQuery}
          onChange={(val) => dispatch(setSearchQuery(val))}
        />
        <LeagueFilter
          leagues={leagues}
          selected={selectedLeague}
          onSelect={(val) => dispatch(setSelectedLeague(val))}
        />
        <DateSelector onDateChange={setSelectedDate} />

        <div className="rounded-[10px] border-[#222] border-2 p-5">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : matchesByLeague.length === 0 ? (
            <div className="text-white">No upcoming matches</div>
          ) : (
            matchesByLeague.map((section) => (
              <LeagueSection
                key={section.league}
                league={section.league}
                matches={section.matches}
                type="upcoming"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
