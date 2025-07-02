'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSearchQuery, setSelectedLeague } from '@/store/matchesSlice';
import MatchSearchBar from '../shared/MatchSearchBar';
import LeagueFilter from '../shared/LeagueFilter';
import { LeagueSection } from './LeagueSection';

export default function LiveMatches() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.matches.loadingLive);
  const searchQuery = useAppSelector((state) => state.matches.searchQuery);
  const selectedLeague = useAppSelector(
    (state) => state.matches.selectedLeague
  );
  const liveMatches = useAppSelector((state) => state.matches.liveMatches);
  const filteredMatches = useAppSelector(
    (state) => state.matches.filteredLiveMatches
  );

  // derive unique leagues for filter
  const leagues = Array.from(
    new Map(liveMatches.map((m) => [m.league, m.leagueLogo]))
  ).map(([league, logo]) => ({ league, logo }));

  // group matches by league
  const grouped: Record<string, typeof filteredMatches> = {};
  filteredMatches.forEach((m) => {
    (grouped[m.league] ??= []).push(m);
  });

  const matchesByLeague = Object.entries(grouped).map(([league, matches]) => ({
    league,
    matches,
  }));

  return (
    <div className="bg-black min-h-screen pt-6 flex flex-col md:flex-row gap-6">
      <div className="hidden lg:block w-20" />
      <div className="flex-1 max-w-5xl">
        <MatchSearchBar
          value={searchQuery}
          onChange={(val: string) => dispatch(setSearchQuery(val))}
        />
        <LeagueFilter
          leagues={leagues}
          selected={selectedLeague}
          onSelect={(val: string | null) => dispatch(setSelectedLeague(val))}
        />
        <div className="rounded-[10px] border-[#222] border-2 p-5 mt-5">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : matchesByLeague.length === 0 ? (
            <div className="text-white">No live streamable matches</div>
          ) : (
            matchesByLeague.map((section) => (
              <LeagueSection
                key={section.league}
                league={section.league}
                matches={section.matches}
                type="live"
              />
            ))
          )}
        </div>
      </div>
      <div className="hidden lg:block w-20" />
    </div>
  );
}
