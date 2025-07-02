'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchLiveMatches } from '@/store/matchesSlice';
import Hero from './components/home/Hero';
import Matches from './components/home/Matches';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchLiveMatches());
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <Matches />
    </div>
  );
}
