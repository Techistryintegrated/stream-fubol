'use client';

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import FootballLoader from '../components/shared/Footballloader';
import { StreamContext } from './StreamContext';

export default function StreamLandingPage() {
  const { matches } = useContext(StreamContext);
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/login?redirect=/stream');
      return;
    }

    if (matches.length) {
      // Option 1: auto-redirect to first match
      router.replace(`/stream/${matches[0].gmid}`);
    }
    // Option 2: else stay and render "Select a match"
  }, [authLoading, user, matches, router]);

  if (authLoading) {
    return <FootballLoader />;
  }

  // Render fallback UI if no match list yet
  return (
    <div className="w-full flex justify-center items-center bg-black text-white py-20">
      {matches.length === 0 ? (
        <div className="text-gray-400 text-center">
          No matches available right now. Please check back later.
        </div>
      ) : (
        <div className="text-gray-400 text-center">Loading match stream...</div>
      )}
    </div>
  );
}
