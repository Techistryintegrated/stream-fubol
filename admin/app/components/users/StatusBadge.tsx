// components/StatusBadge.tsx
export default function StatusBadge({ status }: { status: 'Active' | 'Suspended' | 'Inactive' }) {
  const base = 'text-xs px-2 py-1 rounded-full font-medium';
  const variants = {
    Active: 'bg-green-800 text-white border border-zinc-700',
    Suspended: 'bg-red-800 text-white',
    Inactive: 'bg-zinc-700 text-zinc-300',
  };
  return <span className={`${base} ${variants[status] || ''}`}>{status}</span>;
}
