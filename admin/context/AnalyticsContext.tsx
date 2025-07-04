'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type AnalyticsData = {
  totalUsers: number;
  newUsersToday: number;
  userGrowth: { month: string; users: number }[];
  activeViewerCount: number;
  topMatches: { _id: string; count: number, league: string, match: string }[]; // This matches your backend's aggregation
  recentUsers: {
    _id: string;
    email: string;
    name: string;
    createdAt: string;
  }[]; // This matches your backend
  avgWatchTime: number | null;
  activeStreamsGA: number | null;
};



type AnalyticsContextType = {
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const AnalyticsContext = createContext<AnalyticsContextType>({
  analytics: null,
  loading: true,
  error: null,
  refresh: () => {},
});

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.msg || 'Failed to fetch analytics');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || 'Unknown error');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{ analytics, loading, error, refresh: fetchAnalytics }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
