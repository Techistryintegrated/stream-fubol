'use client';

import { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLiveMatches } from '@/store/matchesSlice';

export default function StreamLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  // 👇 now pointing at the “live” slice
  const alreadyLoaded = useAppSelector((s) => s.matches.liveMatches.length > 0);
  const loadingLive = useAppSelector((s) => s.matches.loadingLive);

  useEffect(() => {
    // only dispatch if we haven’t loaded yet AND there’s no in-flight request
    if (!alreadyLoaded && !loadingLive) {
      dispatch(fetchLiveMatches());
    }
  }, [dispatch, alreadyLoaded, loadingLive]);

  return <>{children}</>;
}
