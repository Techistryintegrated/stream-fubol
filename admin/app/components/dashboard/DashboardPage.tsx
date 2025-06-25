// app/dashboard/page.tsx

import { Users, MonitorPlay, UserPlus, Clock } from 'lucide-react';
import KPIStatsCard from './KPIStatsCard';
import UserGrowthChart from './UserGrowthChart';
import MatchDistributionChart from './MatchDistributionChart';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white  ">
     
      <div className="mt-5 px-8 py-5 space-y-6">
        <h1 className="text-xl   font-semibold">
          Welcome back! Here&apos;s what&apos;s happening with StreamFutbol
          today.
        </h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPIStatsCard
            label="Total Users"
            value="30,000"
            subtext="+20% from last month"
            icon={<Users className="w-4 h-4 text-zinc-400" />}
          />
          <KPIStatsCard
            label="Active Streams"
            value="8,247"
            subtext="Currently watching"
            icon={<MonitorPlay className="w-4 h-4 text-zinc-400" />}
          />
          <KPIStatsCard
            label="New Users Today"
            value="342"
            subtext="+15.3% from yesterday"
            icon={<UserPlus className="w-4 h-4 text-zinc-400" />}
          />
          <KPIStatsCard
            label="Avg. Watch Time"
            value="58m"
            subtext="+12.3% from last month"
            icon={<Clock className="w-4 h-4 text-zinc-400" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UserGrowthChart />
          <MatchDistributionChart />
        </div>
      </div>
    </div>
  );
}
