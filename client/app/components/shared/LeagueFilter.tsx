'use client';
import Image from 'next/image';

export interface LeagueFilterProps {
  leagues: { league: string; logo: string }[];
  selected: string | null;
  onSelect: (val: string | null) => void;
}

export default function LeagueFilter({
  leagues,
  selected,
  onSelect,
}: LeagueFilterProps) {
  return (
    <div className="flex flex-row gap-3 overflow-x-auto py-2 pb-[19px] max-w-full custom-scrollbar whitespace-nowrap">
      <button
        onClick={() => onSelect(null)}
        className={`h-fit px-2 py-4 rounded-full border flex items-center justify-center ${
          selected === null ? 'bg-green-600 text-white' : 'border-[#1e1e1e]'
        }`}
      >
        All
      </button>
      {leagues.map(({ league, logo }) => (
        <button
          key={league}
          onClick={() => onSelect(league)}
          className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
            selected === league ? 'bg-green-600 text-white' : 'border-[#1e1e1e]'
          }`}
        >
          <Image
            src={logo}
            alt={league}
            width={24}
            height={24}
            className="shrink-0"
          />
          <span className="whitespace-nowrap">{league}</span>
        </button>
      ))}
    </div>
  );
}
