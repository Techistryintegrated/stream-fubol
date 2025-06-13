interface LiveMatchCardProps {
  time: string;
  teams: string;
  score: string;
  isActive?: boolean;
}

export default function LiveMatchCard({
  time,
  teams,
  score,
  isActive,
}: LiveMatchCardProps) {
  return (
    <div
      className={`bg-[#1c1c1c] text-white rounded-md px-4 py-3 mb-3 border ${
        isActive ? 'border-green-500' : 'border-transparent'
      }`}
    >
      <p className="text-xs text-gray-400 mb-1">{time}</p>
      <h3 className="font-semibold text-sm mb-1">{teams}</h3>
      <p className="text-sm">{score}</p>
    </div>
  );
}
