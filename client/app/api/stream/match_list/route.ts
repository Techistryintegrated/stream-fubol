// components/api/stream/route.ts
import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const API_FOOTBALL_URL =
  'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&timezone=UTC';
const SCORESWIFT_URL =
  'https://all-sport-live-stream.p.rapidapi.com/api/v2/all-live-stream';

const footballHeaders = {
  'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
  'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
};
const streamHeaders = {
  'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
  'x-rapidapi-host': 'all-sport-live-stream.p.rapidapi.com',
};

interface ApiFootballFixture {
  fixture: { id: number; date: string; status: { short: string } };
  league: { name: string; logo: string };
  teams: {
    home: { name: string; logo: string };
    away: { name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}
interface ScoreSwiftItem {
  iframe_source: string;
  m3u8_source: string;
  match_id: number;
  team_one_name: string;
  team_two_name: string;
}
interface ScoreSwiftResponse {
  sport_id: number;
  data: ScoreSwiftItem[];
}
interface EnrichedMatch {
  gmid: number;
  league: string;
  leagueLogo: string;
  time: string;
  stime: string;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  score: string;
  iplay: boolean;
  status: string;
  statusCode: string;
  statusType: string;
  stream: string | null;
}

const STATUS_DICT: Record<string, { desc: string; type: string }> = {
  NS: { desc: 'Not Started', type: 'Scheduled' },
  '1H': { desc: 'First Half', type: 'In Play' },
  HT: { desc: 'Halftime', type: 'In Play' },
  '2H': { desc: 'Second Half', type: 'In Play' },
  ET: { desc: 'Extra Time', type: 'In Play' },
  BT: { desc: 'Break Time', type: 'In Play' },
  P: { desc: 'Penalty Shootout', type: 'In Play' },
  SUSP: { desc: 'Suspended', type: 'In Play' },
  INT: { desc: 'Interrupted', type: 'In Play' },
  LIVE: { desc: 'Live', type: 'In Play' },
  FT: { desc: 'Full Time', type: 'Finished' },
  AET: { desc: 'After Extra Time', type: 'Finished' },
  PEN: { desc: 'Penalty Result', type: 'Finished' },
  PST: { desc: 'Postponed', type: 'Postponed' },
  CANC: { desc: 'Cancelled', type: 'Cancelled' },
  ABD: { desc: 'Abandoned', type: 'Abandoned' },
  AWD: { desc: 'Technical Loss', type: 'Not Played' },
  WO: { desc: 'Walkover', type: 'Not Played' },
};



const teamAliases: Record<string, string> = {
  psg: 'paris saint germain',
  'paris sg': 'paris saint-germain',
  'man utd': 'manchester united',
  'man united': 'manchester united',
  bayern: 'bayern munich',
  real: 'real madrid',
  barça: 'barcelona',
  'fc barcelona': 'barcelona',
  inter: 'inter milan',
  milan: 'ac milan',
  // add more mappings here as you encounter new edge cases
};

const normalize = (input: string): string => {
  const base = input
    .normalize('NFD')
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
    .trim();

  return teamAliases[base] ?? base;
};

const isTeamMatch = (a: string, b: string): boolean => {
  const na = normalize(a);
  const nb = normalize(b);
  return na === nb || na.includes(nb) || nb.includes(na);
};

export async function GET() {
  try {
    // Fetch live fixtures and stream data
    const [fixturesRes, streamsRes] = await Promise.all([
      fetch(API_FOOTBALL_URL, { headers: footballHeaders }),
      fetch(SCORESWIFT_URL, { headers: streamHeaders }),
    ]);

    const fixturesJson = (await fixturesRes.json())
      .response as ApiFootballFixture[];
    const streamsJson = (await streamsRes.json()) as ScoreSwiftResponse[];
    const liveStreams = streamsJson.find((s) => s.sport_id === 1)?.data ?? [];

    const enriched: EnrichedMatch[] = fixturesJson.map((f) => {
      const home = f.teams.home;
      const away = f.teams.away;
      const statusShort = f.fixture.status.short;
      const { desc, type } = STATUS_DICT[statusShort] ?? {
        desc: 'Unknown',
        type: 'Unknown',
      };

      // Time conversion
      const time = dayjs
        .utc(f.fixture.date)
        .tz('Africa/Lagos')
        .format('YYYY-MM-DD HH:mm');
      const score = `${f.goals.home ?? 0} - ${f.goals.away ?? 0}`;

      // Match stream lookup
      const streamMatch = liveStreams.find(
        (s) =>
          (isTeamMatch(s.team_one_name, home.name) &&
            isTeamMatch(s.team_two_name, away.name)) ||
          (isTeamMatch(s.team_one_name, away.name) &&
            isTeamMatch(s.team_two_name, home.name))
      );

      // Use unique ID: stream match ID or fixture ID
      const gmid = streamMatch?.match_id ?? f.fixture.id;

      return {
        gmid,
        league: f.league.name,
        leagueLogo: f.league.logo,
        time,
        stime: f.fixture.date,
        teamA: home.name,
        teamB: away.name,
        logoA: home.logo,
        logoB: away.logo,
        score,
        iplay: type === 'In Play',
        status: desc,
        statusCode: statusShort,
        statusType: type,
        stream: streamMatch?.iframe_source ?? streamMatch?.m3u8_source ?? null,
      };
    });

    return NextResponse.json(enriched, { status: 200 });
  } catch (error) {
    console.error('Live match API error:', error);
    return NextResponse.json(
      { error: 'Failed to load live matches' },
      { status: 500 }
    );
  }
}
