'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useUser } from '@/context/UserContext';
import LiveStream from '../components/stream/LiveStream';
import Matches from '../components/home/Matches';
import { MatchData } from '@/declaration';
import FootballLoader from '../components/shared/Footballloader';
import AdUnit from '../components/shared/AdUnit';

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
    return (
      <div className="min-w-full flex bg-black text-white py-10 px-2 lg:px-4 pt-[158px]">
        {/* Modern notice box */}
        <div className="w-full  flex flex-col justify-center items-center gap-6">
          <div className="rounded-2xl bg-gradient-to-r from-[#0f172a] to-[#1e293b] shadow-xl border border-[#222c3c] p-6 flex items-center gap-4">
            <svg
              className="w-10 h-10 text-blue-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <div>
              <h2 className="text-lg font-bold text-white mb-1">
                Pick a Live Match
              </h2>
              <p className="text-gray-400 text-sm">
                Select any live match below to start watching a high-quality
                stream in real time. Enjoy the action, no payment needed!
              </p>
            </div>
          </div>
          {/* Matches component */}
          <Matches />{' '}
        </div>
      </div>
    );
  }

  // viewer: show the player (from `selected`) + the same <Matches /> listing below
  return (
    <div className="min-w-full flex  bg-black text-white py-10 px-2 lg:px-4 pt-[158px]">
      <div className="w-full flex flex-col gap-6">
        <div className="flex max-h-[550px]">
          {' '}
          <div className="hidden lg:block flex-none w-[20%] max-h-[550px]">
            <div className="sticky top-10 h-full flex flex-col gap-4">
              <AdUnit />
            </div>
          </div>
          <div className="relative w-[60%] bg-black rounded-lg overflow-hidden ">
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
          <div className="hidden lg:block   flex-none w-[20%] max-h-[550px]">
            <div className="sticky top-10 flex h-full  flex-col gap-4">
              <AdUnit />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Matches />
        </div>
      </div>
    </div>
  );
}
