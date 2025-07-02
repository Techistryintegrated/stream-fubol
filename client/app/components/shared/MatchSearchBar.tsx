// components/shared/MatchSearchBar.tsx
'use client';
import { Search } from 'lucide-react';

export interface MatchSearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function MatchSearchBar({
  value,
  onChange,
}: MatchSearchBarProps) {
  return (
    <div className="w-full mt-4 mb-4">
      <div className="flex items-center bg-[#121212] rounded-[15px] px-4 py-2">
        <input
          type="text"
          placeholder="Search Team"
          className="bg-transparent w-full text-white placeholder-gray-400 outline-none py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Search className="text-[#66BB6A]" />
      </div>
    </div>
  );
}
