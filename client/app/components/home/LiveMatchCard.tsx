import Image from 'next/image';
import Link from 'next/link';
// import soccerBall from '../../../public/soccerball.svg';

export interface MatchCardProps {
  time: string;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  gmid: number;
}

export function LiveMatchCard({
  time,
  teamA,
  teamB,
  logoA,
  logoB,
  gmid,
}: MatchCardProps) {
  return (
    <Link href={`/stream/${gmid}`}>
      <div className="bg-[#1C1C1C] rounded-lg pr-4 py-2 flex items-center gap-4 text-white mb-2">
        <span className="w-2 h-[70px] bg-[#17BC2E] rounded-r-[11px]" />
        <div className="flex items-start flex-col gap-1">
          <span className="text-xs text-[#17BC2E]">
            {new Date(time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <div className="flex flex-col gap-2">
            <span className="flex gap-4 items-center">
              <Image
                src={logoA}
                className="invert"
                alt="Team A"
                width={24}
                height={24}
              />
              <span className="text-[20px] text-[#AAAAAA] tracking-[0.5px]">
                {teamA}
              </span>
            </span>
            <span className="flex gap-4 items-center">
              <Image
                src={logoB}
                alt="Team B"
                className="invert"
                width={24}
                height={24}
              />
              <span className="text-[20px] text-[#AAAAAA] tracking-[0.5px]">
                {teamB}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
