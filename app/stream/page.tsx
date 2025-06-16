'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import FootballLoader from '../components/shared/Footballloader';
import LiveStream from '../components/stream/LiveStream';
import UpcomingMatches from '../components/home/UpcomingMatches';

// Define the match type
interface MatchData {
  gmid: number;
  league: string;
  leagueLogo: string;
  time: string; // ISO string
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  stime: string;
  iplay: boolean;
  status: string;
}

export default function StreamPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const [matches, setMatches] = useState<MatchData[]>([]);
  const [selected, setSelected] = useState<MatchData | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loadingStream, setLoadingStream] = useState(false);

  // Fetch live matches on mount
  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch('/api/stream/match_list?sportId=1');
        const { matches } = await res.json();
        setMatches(matches);
        if (matches.length > 0) {
          setSelected(matches[0]);
        }
      } catch (err) {
        console.error('Failed to load matches', err);
        setMatches([]);
      }
    }
    fetchMatches();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/stream`);
    }
  }, [authLoading, user, router]);

  // Fetch stream URL when match is selected
  useEffect(() => {
    if (!selected || !user) return;
    setLoadingStream(true);
    fetch(`/api/stream/stream_source?gmid=${selected.gmid}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(({ stream_url }) => setStreamUrl(stream_url))
      .catch(() => setStreamUrl(null))
      .finally(() => setLoadingStream(false));
  }, [selected, user]);

  if (authLoading || loadingStream) {
    return <FootballLoader />;
  }

  return (
    <div className="w-full flex lg:justify-center bg-black text-white py-10 px-2 lg:px-4 pt-[158px]">
      {/* Left Sidebar */}
      <div className="hidden lg:block lg:w-1/4 pr-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search match"
            className="w-full bg-[#121212] placeholder-gray-500 text-white px-3 py-2 rounded-lg"
            onChange={(e) => {
              const q = e.target.value.toLowerCase();
              setMatches((prev) =>
                prev.filter((m) =>
                  `${m.teamA} ${m.teamB}`.toLowerCase().includes(q)
                )
              );
            }}
          />
        </div>
        <div className="space-y-2 overflow-y-auto max-h-[70vh]">
          {matches.map((m) => (
            <div
              key={m.gmid}
              onClick={() => setSelected(m)}
              className={`cursor-pointer rounded-md p-2 ${
                selected?.gmid === m.gmid
                  ? 'bg-[#1e1e1e] border-l-4 border-green-500'
                  : 'hover:bg-[#1a1a1a]'
              }`}
            >
              <div className="text-sm text-gray-400">
                {new Date(m.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="font-medium">
                {m.teamA} vs {m.teamB}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: player + upcoming */}
      <div className="lg:w-3/4 flex flex-col gap-6">
        <div className="w-full bg-black rounded-lg overflow-hidden">
          {streamUrl ? (
            <LiveStream
              src={streamUrl}
              matchTitle={`${selected?.teamA} vs ${selected?.teamB}`}
              timeRange={selected?.time || ''}
            />
          ) : (
            <div className="text-center text-gray-400 py-20">
              No stream available
            </div>
          )}
        </div>

        <UpcomingMatches />
      </div>
    </div>
  );
}
