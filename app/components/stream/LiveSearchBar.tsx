import { Search } from 'lucide-react';

interface Props {
  onChange: (query: string) => void;
}

export default function LiveSearchBar({ onChange }: Props) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center border border-gray-600 rounded-md px-4 py-2">
        <input
          type="text"
          placeholder="Search match"
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent w-full text-white placeholder-gray-400 outline-none"
        />
        <Search className="text-white" size={18} />
      </div>
    </div>
  );
}
