// app/dashboard/page.tsx
'use client';
import { Users, MonitorPlay, UserPlus, Clock } from 'lucide-react';
import KPIStatsCard from './KPIStatsCard';
import UserGrowthChart from './UserGrowthChart';
import MatchDistributionChart from './MatchDistributionChart';
import { useAnalytics } from '@/context/AnalyticsContext';

export default function DashboardPage() {
  const { analytics, loading, error } = useAnalytics();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mt-5 px-8 py-5 space-y-6">
        <h1 className="text-xl font-semibold">
          Welcome back! Here&apos;s what&apos;s happening with StreamFutbol
          today.
        </h1>

        {loading ? (
          <div className="py-12 text-center text-lg">Loading analytics...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">Error: {error}</div>
        ) : analytics ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPIStatsCard
                label="Total Users"
                value={analytics.totalUsers?.toLocaleString() ?? '-'}
                subtext={`+${calculateGrowth(
                  analytics.userGrowth
                )} from last month`}
                icon={<Users className="w-4 h-4 text-zinc-400" />}
              />
              <KPIStatsCard
                label="Active Streams"
                value={
                  analytics.activeStreamsGA !== null
                    ? analytics.activeStreamsGA.toLocaleString()
                    : '-'
                }
                subtext="Currently watching"
                icon={<MonitorPlay className="w-4 h-4 text-zinc-400" />}
              />
              <KPIStatsCard
                label="New Users Today"
                value={
                  analytics.newUsersToday !== null
                    ? analytics.newUsersToday.toString()
                    : '-'
                }
                subtext={
                  analytics.newUsersToday === 1 ? 'New user' : 'New users today'
                }
                icon={<UserPlus className="w-4 h-4 text-zinc-400" />}
              />
              <KPIStatsCard
                label="Avg. Watch Time"
                value={
                  analytics.avgWatchTime !== null
                    ? `${analytics.avgWatchTime}m`
                    : '-'
                }
                subtext="Avg. session (Google Analytics)"
                icon={<Clock className="w-4 h-4 text-zinc-400" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <UserGrowthChart data={analytics.userGrowth} />
              <MatchDistributionChart data={analytics.topMatches} />
            </div>
          </>
        ) : (
          <div className="py-12 text-center">No analytics data available.</div>
        )}
      </div>
    </div>
  );
}

// Simple growth calculator for subtext
function calculateGrowth(userGrowth: { month: string; users: number }[]) {
  if (!userGrowth || userGrowth.length < 2) return '';
  const lastMonth = userGrowth[userGrowth.length - 2]?.users ?? 0;
  const thisMonth = userGrowth[userGrowth.length - 1]?.users ?? 0;
  if (lastMonth === 0) return thisMonth > 0 ? 'New' : '0';
  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
  return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
}
