import Image from 'next/image';

interface MatchCardProps {
  time: string;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
}

export function MatchCard({
  time,
  teamA,
  teamB,
  logoA,
  logoB,
}: MatchCardProps) {
  return (
    <div className="bg-[#1C1C1C] rounded-lg px-4 py-2 flex gap-4 text-white mb-2">
      <span className="text-sm font-medium">
        {new Date(time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
      <div className="flex items-start flex-col gap-3">
        <span className="flex gap-4">
          {' '}
          <Image
            src={logoA}
            alt="Team A"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-[20px] text-[#AAAAAA] tracking-[0.5px]">
            {teamA}
          </span>
        </span>

        <span className="flex gap-4">
          {' '}
          <Image
            src={logoB}
            alt="Team B"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-[20px] text-[#AAAAAA] tracking-[0.5px]">
            {teamB}
          </span>
        </span>
      </div>
    </div>
  );
}
