import type { NextApiRequest, NextApiResponse } from 'next';
import { convertISTtoWAT } from '../../../utils/timezone';
import { DateTime } from 'luxon';

export interface MatchApiType {
  gmid: number;
  ename: string;
  etid: number;
  cid: number;
  cname: string;
  iplay: boolean;
  stime: string; // Original format: "6/16/2025 3:30:00 AM"
  tv: boolean;
  bm: boolean;
  f: boolean;
  f1: boolean;
  iscc: number;
  mid: number;
  mname: string;
  status: string; // e.g. "OPEN", "SUSPENDED"
  rc: number;
  gscode: number;
  m: number;
  oid: number;
  gtype: string; // e.g. "match"
}

interface MatchData {
  gmid: number;
  league: string;
  leagueLogo: string;
  time: string | null;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  stime: string | null;
  iplay: boolean;
  status: string;
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


  let cleanedMatches: MatchData[] = [];

  if (data.data?.t1) {
    cleanedMatches = data.data.t1.map((match: MatchApiType) => {
      const convertedTime = match.stime ? convertISTtoWAT(match.stime) : null;
      let [teamA, teamB] = ['', ''];
      if (match.ename) {
        [teamA, teamB] = match.ename.split(/\s[v\-]\s/) || ['', ''];
      }


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


  let filteredMatches = cleanedMatches.filter(
    (match) =>
      match.status !== 'SUSPENDED' &&
      (type === 'upcoming' ? match.iplay === false : match.iplay === true)
  );

  if (type === 'upcoming' && date) {
    filteredMatches = filteredMatches.filter(
      (match) =>
        match.stime && DateTime.fromISO(match.stime).toISODate() === date
    );
  }

  return res.status(200).json({ success: true, matches: filteredMatches });
}
