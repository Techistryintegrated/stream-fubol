// app/dashboard/users/page.tsx
'use client';
import { Filter } from 'lucide-react';
import UserStatsCard from './UserStatsCard';
import UserTable from './UserTable';


export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Manage platform users, monitor activity, and handle user administration.
      </p>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 border border-[#262626] p-3 rounded-lg">
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="bg-transparent text-sm w-full flex-1 border-none focus:outline-none text-white placeholder-zinc-500"
        />
        <button className="flex items-center gap-2 px-3 py-1 bg-zinc-800 text-sm text-white rounded-md">
          <Filter className="w-4 h-4" />
          All Status
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserStatsCard label="Total Users" value={5} description="Registered users" type="total" />
        <UserStatsCard label="Active Users" value={3} description="Currently active" type="active" />
        {/* <UserStatsCard label="Suspended Users" value={1} description="Need attention" type="suspended" /> */}
      </div>

      {/* User Table */}
      <UserTable />
    </div>
  );
}
