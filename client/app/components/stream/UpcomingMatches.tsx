// import DateSelector from '../shared/DateSelector';
// import LeagueFilter from '../shared/LeagueFilter';
// import { MatchCard } from '../shared/MatchCard';
// import MatchSearchBar from '../shared/MatchSearchBar';

// const dummyMatches = [
//   {
//     league: 'English Premier League',
//     matches: [
//       {
//         time: '18:05',
//         teamA: 'FC Smorgon',
//         teamB: 'Slavia Mozyr',
//         logoA: '/smorgon.png',
//         logoB: '/slavia.png',
//       },
//     ],
//   },
//   {
//     league: 'NWSL',
//     matches: [
//       {
//         time: '18:05',
//         teamA: 'FC Smorgon',
//         teamB: 'Slavia Mozyr',
//         logoA: '/smorgon.png',
//         logoB: '/slavia.png',
//       },
//       {
//         time: '18:05',
//         teamA: 'FC Smorgon',
//         teamB: 'Slavia Mozyr',
//         logoA: '/smorgon.png',
//         logoB: '/slavia.png',
//       },
//     ],
//   },
// ];

// export default function UpcomingMatches() {
//   const matchCount = dummyMatches.length;

//   return (
//     <div className="bg-black min-h-screen px-4  pt-6 flex flex-col md:flex-row gap-6">
//       {/* Main Content */}
//       <div className="flex-1 max-w-5xl">
//         <div className="border-b border-gray-700 pb-4">
//           {/* <MatchSearchBar />
//           <LeagueFilter /> */}
//           <DateSelector />
//           <div className="rounded-[10px] border-[#222] border-2 p-5">
//             {dummyMatches.map((section, i) => (
//               <div className="text-white mb-6 " key={i}>
//                 <h3 className="text-sm font-normal ">{section.league}</h3>
//                 <p className="text-sm font-normal text-[#FFFFFFB2]">
//                   {matchCount} game
//                 </p>
//                 <div className="mt-5">
//                   {section.matches.map((m, i) => (
//                     <MatchCard key={i} {...m} />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right Ad */}
//       <div className="hidden lg:block w-20 text-white bg-white text-center text-sm">
//         AD
//         <br />
//         Space
//       </div>
//     </div>
//   );
// }
