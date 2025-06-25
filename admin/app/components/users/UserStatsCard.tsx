// components/UserStatsCard.tsx
import { AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';

const iconMap = {
  total: <RefreshCw className="w-4 h-4 text-zinc-400" />,
  active: <TrendingUp className="w-4 h-4 text-green-400" />,
  suspended: <AlertTriangle className="w-4 h-4 text-red-500" />,
};

export default function UserStatsCard({
  label,
  value,
  description,
  type = 'total',
}: {
  label: string;
  value: number;
  description: string;
  type?: 'total' | 'active' | 'suspended';
}) {
  return (
    <div className="border border-[#262626] rounded-lg p-4 bg-transparent w-full">
      <div className="flex justify-between items-center text-sm text-zinc-400 mb-2">
        <span>{label}</span>
        {iconMap[type]}
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      <p className="text-xs text-zinc-500 mt-1">{description}</p>
    </div>
  );
}
