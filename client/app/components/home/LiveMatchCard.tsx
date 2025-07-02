// components/stream/LiveMatchCard.tsx
import { MatchData } from '@/declaration';
import Image from 'next/image';
import Link from 'next/link';



export function LiveMatchCard({
  time,
  teamA,
  teamB,
  logoA,
  logoB,
  score,
  statusCode,
  stream,
  gmid,
}: MatchData) {
  const [scoreA, scoreB] = score?.split(' - ') ?? ['-', '-'];

  const content = (
    <div className="bg-[#1C1C1C] rounded-lg pr-4 py-2 flex items-center gap-4 text-white mb-2">
      <span className="w-2 h-[70px] bg-[#17BC2E] rounded-r-[11px]" />
      <div className="flex items-start flex-col gap-1 w-full">
        <div className="flex justify-between items-center w-full text-[#AAAAAA]">
          <span className=" flex gap-2 text-xs text-[#17BC2E]">
            {new Date(time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {stream && (
              <span className="bg-red-600 text-white text-[10px] px-2 py-[1px] rounded-sm uppercase">
                WATCH
              </span>
            )}
          </span>
          <span className="font-semibold">&apos;{statusCode}</span>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span className="flex gap-4 items-center w-full">
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
            <span className="ml-auto">{scoreA}</span>
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
            <span className="ml-auto">{scoreB}</span>
          </span>
        </div>
      </div>
    </div>
  );

  return stream ? <Link href={`/stream/${gmid}`}>{content}</Link> : content;
}
