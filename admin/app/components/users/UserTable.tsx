// components/UserTable.tsx
import { MapPin, MoreHorizontal } from 'lucide-react';
import StatusBadge from './StatusBadge';

type UserStatus = "Active" | "Suspended" | "Inactive";

const users: { 
  name: string; 
  email: string; 
  status: UserStatus; 
  views: number; 
  lastLogin: string; 
  location: string; 
}[] = [
  {
    name: 'John Doe',
    email: 'john.doe@email.com',
    status: 'Active',
    views: 142,
    lastLogin: 'Jun 5, 2024, 02:30 PM',
    location: 'Spain',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    status: 'Active',
    views: 89,
    lastLogin: 'Jun 4, 2024, 08:15 PM',
    location: 'United Kingdom',
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    status: 'Suspended',
    views: 67,
    lastLogin: 'May 28, 2024, 04:45 PM',
    location: 'Germany',
  },
  {
    name: 'Sara Wilson',
    email: 'sara.wilson@email.com',
    status: 'Active',
    views: 234,
    lastLogin: 'Jun 5, 2024, 11:20 AM',
    location: 'France',
  },
  {
    name: 'David Brown',
    email: 'david.brown@email.com',
    status: 'Inactive',
    views: 156,
    lastLogin: 'May 15, 2024, 09:30 AM',
    location: 'Italy',
  },
];

export default function UserTable() {
  return (
    <div className="mt-6 border border-[#262626] rounded-xl p-4">
      <h2 className="text-md text-white mb-2">Users ({users.length})</h2>
      <p className="text-sm text-zinc-500 mb-4">
        Complete list of registered users with management options.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-zinc-400 font-normal">
            <tr className="border-b border-[#262626]">
              <th className="py-2">User</th>
              <th>Status</th>
              <th>Views</th>
              <th>Last Login</th>
              <th>Location</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr
                key={idx}
                className="border-b border-[#1f1f1f] hover:bg-zinc-900"
              >
                <td className="py-3">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{u.name}</span>
                    <span className="text-zinc-400 text-xs">{u.email}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={u.status} />
                </td>
                <td className="text-zinc-300">▷ {u.views}</td>
                <td className="text-zinc-300">{u.lastLogin}</td>

                <td>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3 h-3 mt-[1px]" />
                    <span className="whitespace-nowrap">{u.location}</span>
                  </div>
                </td>

                <td className="text-right pr-2 align-middle">
                  <MoreHorizontal className="w-4 h-4 text-zinc-500 cursor-pointer inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
