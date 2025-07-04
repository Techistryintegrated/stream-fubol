'use client';
import { useState } from 'react';
import { Trash } from 'lucide-react';
import StatusBadge from './StatusBadge';

type User = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
};

export default function UserTable({
  users,
  loading,
  error,
  onDelete, // Optional: for parent to refresh or update user list
}: {
  users: User[];
  loading?: boolean;
  error?: string | null;
  onDelete?: (id: string) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    );
    if (!confirmed) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/user/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        if (onDelete) onDelete(id); // Parent can remove from list or refetch
      } else {
        alert(data.msg || 'Failed to delete user');
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Server error deleting user';
      alert(errorMessage);
    }
    setDeletingId(null);
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!users.length)
    return (
      <div className="text-center text-zinc-500 py-10">No users found.</div>
    );

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
              <th>Role</th>
              <th>Date Joined</th>
              <th className="text-right"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-b border-[#1f1f1f] hover:bg-zinc-900"
              >
                <td className="py-3">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{u.name}</span>
                    <span className="text-zinc-400 text-xs">{u.email}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status="Active" />
                </td>
                <td className="text-zinc-300 capitalize"> {u.role ?? '-'}</td>
                <td className="text-zinc-300">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </td>
                <td className="text-right pr-2 align-middle">
                  <button
                    disabled={deletingId === u._id}
                    onClick={() => handleDelete(u._id)}
                    className="disabled:opacity-50"
                    title="Delete user"
                  >
                    <Trash className="w-4 h-4 text-red-500 cursor-pointer inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
