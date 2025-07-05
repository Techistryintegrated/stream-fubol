'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useUser } from '@/context/UserContext';
import LiveStream from '../components/stream/LiveStream';
import Matches from '../components/home/Matches';
import { MatchData } from '@/declaration';
import FootballLoader from '../components/shared/Footballloader';

export default function StreamContainer() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [selected, setSelected] = useState<MatchData | null>(null);

  const raw = params?.gmid;
  const gmid = raw ? Number(raw) : undefined;
  const isViewer = typeof gmid === 'number' && !isNaN(gmid);

  useEffect(() => {
    if (gmid && user?._id && selected) {
      fetch('/api/admin/match-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gmid,
          userId: user._id,
          league: selected.league,
          match: `${selected.teamA} vs ${selected.teamB}`,
        }),
      });
    }
  }, [gmid, user?._id, selected]);
  

  // 📌 **UNCHANGED**: get full live list for selecting the player
  const allMatches = useAppSelector((s) => s.matches.liveMatches);
  const loadingMatches = useAppSelector((s) => s.matches.loadingLive);

  // 👇 derive selected from the **unfiltered** list
  useEffect(() => {
    if (isViewer) {
      setSelected(allMatches.find((m) => m.gmid === gmid) ?? null);
    }
  }, [allMatches, gmid, isViewer]);

  // auth guard stays the same
  useEffect(() => {
    if (!authLoading && !user) {
      const target = isViewer ? `/stream/${gmid}` : '/stream';
      router.replace(`/login?redirect=${target}`);
    }
  }, [authLoading, user, router, gmid, isViewer]);

  // only show loader when we truly have no player yet or still fetching
  if (authLoading || loadingMatches || (isViewer && selected === null)) {
    return <FootballLoader />;
  }

  // non-viewer landing = full tab view
  if (!isViewer) {
    return <Matches />;
  }

  // viewer: show the player (from `selected`) + the same <Matches /> listing below
  return (
    <div className="w-full flex justify-center bg-black text-white py-10 px-2 lg:px-4 pt-[158px]">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <div className="relative w-full bg-black rounded-lg overflow-hidden min-h-64">
          {selected?.stream ? (
            <LiveStream
              src={selected.stream}
              teamA={selected.teamA}
              teamB={selected.teamB}
              timeRange={selected.time}
              score={selected.score}
            />
          ) : (
            <div className="text-center text-gray-400 py-20">
              No stream available
            </div>
          )}
        </div>
        <div className='mt-10'>
        <Matches /></div>
      </div>
    </div>
  );
}
