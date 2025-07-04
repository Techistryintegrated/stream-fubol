'use client';
import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import UserTable from './UserTable';

export default function UserManagementPage() {

  type User = {
    _id: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: string;
  };
  

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) setUsers(data.users);
        else setError(data.msg);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Compute stats

  // You may want to also compute suspended, etc.

  // Optional: filtered users for table
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm w-full flex-1 border-none focus:outline-none text-white placeholder-zinc-500"
        />
        <button className="flex items-center gap-2 px-3 py-1 bg-zinc-800 text-sm text-white rounded-md">
          <Filter className="w-4 h-4" />
          All Status
        </button>
      </div>

      {/* Stat Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserStatsCard
          label="Total Users"
          value={total}
          description="Registered users"
          type="total"
        />
        <UserStatsCard
          label="Active Users"
          value={active}
          description="Currently active"
          type="active"
        /> */}
      {/* <UserStatsCard label="Suspended Users" value={suspended} description="Need attention" type="suspended" /> */}
      {/* </div> */}

      {/* User Table */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        error={error}
        onDelete={(id) =>
          setUsers((users) => users.filter((u) => u._id !== id))
        }
      />
    </div>
  );
}
