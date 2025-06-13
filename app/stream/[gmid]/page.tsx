// app/stream/[gmid]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import FootballLoader from '../../components/shared/Footballloader';
import LiveStream from '../../components/stream/LiveStream';
import UpcomingMatches from '../../components/home/UpcomingMatches';

export default function StreamPage() {
  const { gmid } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [matches, setMatches] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loadingStream, setLoadingStream] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/stream/${gmid}`);
    }
  }, [authLoading, user, router, gmid]);

  useEffect(() => {
    if (!gmid || !user) return;
    setLoadingStream(true);
    fetch(`/api/stream/stream_source?gmid=${gmid}`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => setStreamUrl(json.stream_url))
      .catch(() => setStreamUrl(null))
      .finally(() => setLoadingStream(false));
  }, [gmid, user]);

  if (authLoading || loadingStream) return <FootballLoader />;

  return (
    <div className="w-full flex lg:justify-center bg-black text-white py-10 px-2 lg:px-4 pt-[158px]">
      {/* Left Sidebar (match list) */}
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
        <div className="space-y-2  overflow-y-auto">
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
                {new Date(m.time).toLocaleTimeString()}
              </div>
              <div className="font-medium">
                {m.teamA} vs {m.teamB}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane (player + upcoming) */}
      <div className="lg:w-3/4 flex flex-col gap-6">
        <div className="w-full bg-black rounded-lg overflow-hidden">
          {streamUrl ? (
            <div className="w-full aspect-video bg-black flex items-center justify-center">
              <LiveStream
                src={streamUrl}
                matchTitle={`Match ${gmid}`}
                timeRange=""
              />
            </div>
          ) : (
            <div className="w-full border aspect-video bg-black flex items-center justify-center">
              <span className="text-white text-center text-lg">
                Stream is not available
              </span>
            </div>
          )}
        </div>
        {/* Upcoming matches component */}
        <UpcomingMatches />
      </div>
    </div>
  );
}
