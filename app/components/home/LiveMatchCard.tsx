interface MatchCardProps {
  time: string;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
}

export function LiveMatchCard({ teamA, teamB, logoA, logoB }: MatchCardProps) {
  return (
    <div className="bg-[#1C1C1C] rounded-lg pr-4 py-2 flex items-center gap-4 text-white mb-2">
      <span className="w-2 h-[70] bg-[#17BC2E] rounded-r-[11px]"></span>
      <div className="flex items-start flex-col gap-3">
        <span className="flex  gap-4">
          {' '}
          <img src={logoA} alt="Team A" className="w-6 h-6" />
          <span className="text-[20px] text-[#AAAAAA] tracking-[0.5px]">
            {teamA}
          </span>
        </span>

        <span className="flex gap-4">
          {' '}
          <img src={logoB} alt="Team B" className="w-6 h-6" />
          <span className="text-[20px] text-[#AAAAAA] tracking-[0.5px]">
            {teamB}
          </span>
        </span>
      </div>
    </div>
  );
}
