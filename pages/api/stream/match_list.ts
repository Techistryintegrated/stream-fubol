import type { NextApiRequest, NextApiResponse } from 'next';
import { convertISTtoWAT } from '../../../utils/timezone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY as string;
  const { sportId, type, date } = req.query;

  if (!sportId) {
    return res.status(400).json({ success: false, msg: 'sportId is required' });
  }

  const apiRes = await fetch(
    `https://all-sport-live-stream.p.rapidapi.com/api/d/match_list?sportId=${sportId}`,
    {
      headers: {
        'x-rapidapi-host': 'all-sport-live-stream.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    }
  );
  const data = await apiRes.json();

  // Log first 3 matches from API response
  console.log(
    'RAW API data t1:',
    JSON.stringify(data.data?.t1?.slice(0, 3), null, 2)
  );

  let cleanedMatches: any[] = [];

  if (data.data?.t1) {
    cleanedMatches = data.data.t1.map((match: any) => {
      const convertedTime = match.stime ? convertISTtoWAT(match.stime) : null;
      let [teamA, teamB] = ['', ''];
      if (match.ename) {
        [teamA, teamB] = match.ename.split(/\s[v\-]\s/) || ['', ''];
      }
      // Log details for debugging
      console.log({
        ename: match.ename,
        status: match.status,
        iplay: match.iplay,
        stime: match.stime,
        convertedTime,
      });
      return {
        gmid: match.gmid,
        league: match.cname,
        leagueLogo: '/leagues/default.png',
        time: convertedTime,
        teamA,
        teamB,
        logoA: '/teams/default.png',
        logoB: '/teams/default.png',
        stime: convertedTime,
        iplay: match.iplay,
        status: match.status,
      };
    });
  }

  // Log after mapping, before filter
  console.log(
    'Mapped Matches:',
    JSON.stringify(cleanedMatches.slice(0, 5), null, 2)
  );

  // Filter for live/upcoming
  let filteredMatches = cleanedMatches.filter(
    (match) =>
      match.status !== 'SUSPENDED' &&
      (type === 'upcoming' ? match.iplay === false : match.iplay === true)
  );

  // Log after main filter
  console.log(
    'After main filter:',
    JSON.stringify(filteredMatches.slice(0, 5), null, 2)
  );

  // Further filter by date (upcoming only)
  if (type === 'upcoming' && date) {
    filteredMatches = filteredMatches.filter(
      (match) =>
        match.stime &&
        require('luxon').DateTime.fromISO(match.stime).toISODate() === date
    );
    // Log after date filter
    console.log(
      'After date filter:',
      JSON.stringify(filteredMatches.slice(0, 5), null, 2)
    );
  }

  return res.status(200).json({ success: true, matches: filteredMatches });
}
