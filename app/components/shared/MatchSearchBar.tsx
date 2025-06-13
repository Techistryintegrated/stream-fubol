import { Search } from 'lucide-react';

export default function MatchSearchBar() {
  return (
    <div className="w-full mt-4 mb-4">
      <div className="flex items-center bg-[#121212]  rounded-[15px] px-4 py-2">
        <input
          type="text"
          placeholder="Search Team"
          className="bg-transparent w-full text-white placeholder-gray-400 outline-none py-2"
        />
        <Search className="text-[#66BB6A]" />
      </div>
    </div>
  );
}
