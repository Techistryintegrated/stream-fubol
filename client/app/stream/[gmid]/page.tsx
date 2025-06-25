'use client';

import { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import FootballLoader from '../../components/shared/Footballloader';
import LiveStream from '../../components/stream/LiveStream';
import UpcomingMatches from '../../components/home/UpcomingMatches';
import { StreamContext } from '../StreamContext';

export default function StreamPage() {
  const { matches } = useContext(StreamContext);
  const params = useParams();
  const gmid = Number(params?.gmid);
  const router = useRouter();
  const { user, loading: authLoading } = useUser();

  const [selected, setSelected] = useState(
    matches.find((m) => m.gmid === gmid) || null
  );
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loadingStream, setLoadingStream] = useState(true);
  const [filteredMatches, setFilteredMatches] = useState(matches);

  useEffect(() => {
    setFilteredMatches(matches);
    const match = matches.find((m) => m.gmid === gmid);
    setSelected(match || null);
  }, [matches, gmid]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/stream/${gmid}`);
    }
  }, [authLoading, user, router, gmid]);

  useEffect(() => {
    if (!selected || !user) return;
    setLoadingStream(true);
    fetch(`/api/stream/stream_source?gmid=${selected.gmid}`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => setStreamUrl(json.stream_url))
      .catch(() => setStreamUrl(null))
      .finally(() => setLoadingStream(false));
  }, [selected, user]);

  if (authLoading) return <FootballLoader />;

  return (
    <div className="w-full flex lg:justify-center bg-black text-white py-10 px-2 lg:px-4 pt-[158px]">
      <div className="hidden lg:block lg:w-1/4 pr-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search match"
            className="w-full bg-[#121212] placeholder-gray-500 text-white px-3 py-2 rounded-lg"
            onChange={(e) => {
              const q = e.target.value.toLowerCase();
              setFilteredMatches(
                matches.filter((m) =>
                  `${m.teamA} ${m.teamB}`.toLowerCase().includes(q)
                )
              );
            }}
          />
        </div>
        <div className="space-y-2 overflow-y-auto max-h-[70vh]">
          {filteredMatches.map((m) => (
            <div
              key={m.gmid}
              onClick={() => router.push(`/stream/${m.gmid}`)}
              className={`cursor-pointer rounded-md p-2 ${
                gmid === m.gmid
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

      <div className="lg:w-3/4 flex flex-col mx-auto gap-6">
        <div className="relative w-full bg-black rounded-lg overflow-hidden min-h-64">
          {streamUrl ? (
            <LiveStream
              src={streamUrl}
              matchTitle={
                selected ? `${selected.teamA} vs ${selected.teamB}` : ''
              }
              timeRange={selected?.time || ''}
            />
          ) : (
            <div className="text-center text-gray-400 py-20">
              No stream available
            </div>
          )}

          {loadingStream && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <FootballLoader />
            </div>
          )}
        </div>

        <UpcomingMatches />
      </div>
    </div>
  );
}
