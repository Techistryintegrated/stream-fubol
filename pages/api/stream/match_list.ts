import type { NextApiRequest, NextApiResponse } from 'next';
import { convertISTtoWAT } from '../../../utils/timezone';
import { DateTime } from 'luxon';
import { getAllBadges } from '../../../utils/getTeamBadge';

export interface MatchApiType {
  gmid: number;
  ename: string;
  etid: number;
  cid: number;
  cname: string;
  iplay: boolean;
  stime: string;
  tv: boolean;
  bm: boolean;
  f: boolean;
  f1: boolean;
  iscc: number;
  mid: number;
  mname: string;
  status: string;
  rc: number;
  gscode: number;
  m: number;
  oid: number;
  gtype: string;
}

interface MatchData {
  gmid: number;
  league: string;
  leagueLogo: string;
  time: string | null;
  stime: string | null;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  iplay: boolean;
  status: string;
}

interface ApiResponseData {
  data?: {
    t1?: MatchApiType[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY as string;
  const { sportId, type, date } = req.query;

  if (!sportId) {
    return res.status(400).json({ success: false, msg: 'sportId is required' });
  }

  try {
    const apiRes = await fetch(
      `https://all-sport-live-stream.p.rapidapi.com/api/d/match_list?sportId=${sportId}`,
      {
        headers: {
          'x-rapidapi-host': 'all-sport-live-stream.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    const data: ApiResponseData = await apiRes.json();

    if (!data.data?.t1) {
      return res.status(200).json({ success: true, matches: [] });
    }

    const cleanedMatches: MatchData[] = data.data.t1.map((match) => {
      const convertedTime = match.stime ? convertISTtoWAT(match.stime) : null;
      const [teamA = '', teamB = ''] = match.ename
        ? match.ename.split(/\s[vV][sS]?\s| - /)
        : ['', ''];

      return {
        gmid: match.gmid,
        league: match.cname,
        leagueLogo: '/leagues/default.png',
        time: convertedTime,
        stime: convertedTime,
        teamA,
        teamB,
        logoA: '',
        logoB: '',
        iplay: match.iplay,
        status: match.status,
      };
    });

    let filtered = cleanedMatches.filter(
      (m) =>
        m.status !== 'SUSPENDED' &&
        (type === 'upcoming' ? m.iplay === false : m.iplay === true)
    );

    if (type === 'upcoming' && date) {
      filtered = filtered.filter(
        (m) => m.stime && DateTime.fromISO(m.stime).toISODate() === date
      );
    }

    const teamSet = new Set<string>();
    filtered.forEach((m) => {
      if (m.teamA) teamSet.add(m.teamA);
      if (m.teamB) teamSet.add(m.teamB);
    });

    const badges = await getAllBadges(Array.from(teamSet));

    const finalMatches = filtered.map((m) => ({
      ...m,
      logoA: badges[m.teamA] || '/soccerball.svg',
      logoB: badges[m.teamB] || '/soccerball.svg',
    }));

    return res.status(200).json({ success: true, matches: finalMatches });
  } catch (err: unknown) {
    console.error('Error fetching match list:', (err as Error).message);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
}
