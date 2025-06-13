const leagues = [
  '/champ.png',
  '/euro.png',
  '/lal.png',
  '/serie.png',
  '/bunde.png',
  '/ligue.png',
];

export default function LeagueFilter() {
  return (
    <div className="flex  gap-3 overflow-x-auto py-2 pb-[19px]">
      {leagues.map((logo, index) => (
        <img
          key={index}
          src={logo}
          alt="League"
          className="w-16 h-16 rounded-full object-cover  border-[5px] border-[#1e1e1e]"
        />
      ))}
    </div>
  );
}
