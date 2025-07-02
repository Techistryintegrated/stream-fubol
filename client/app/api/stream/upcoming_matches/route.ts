// app/stream/upcoming_matches.ts
import { NextRequest, NextResponse } from 'next/server';

const RAPID_API_KEY =
  process.env.RAPIDAPI_KEY as string;

// shape of each fixture as returned by the API-Football endpoint
interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
    };
  };
  league: {
    name: string;
    logo: string;
  };
  teams: {
    home: { name: string; logo: string };
    away: { name: string; logo: string };
  };
}

// top-level JSON we get back
interface ApiFootballResponse {
  response: ApiFootballFixture[];
}

// shape of the match object our frontend expects
interface UpcomingMatch {
  gmid: number;
  league: string;
  leagueLogo: string;
  time: string;
  stime: string;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  status: string;
  statusCode: string;
  iplay: boolean;
  score: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date =
    searchParams.get('date') ?? new Date().toISOString().slice(0, 10);

  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${date}&timezone=Africa/Lagos`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY,
      },
      cache: 'no-store',
    });

    // assert the JSON shape
    const data = (await response.json()) as ApiFootballResponse;

    const matches: UpcomingMatch[] = data.response
      .filter((f) => f.fixture.status.short === 'NS')
      .map((f) => ({
        gmid: f.fixture.id,
        league: f.league.name,
        leagueLogo: f.league.logo,
        time: f.fixture.date,
        stime: f.fixture.date,
        teamA: f.teams.home.name,
        teamB: f.teams.away.name,
        logoA: f.teams.home.logo,
        logoB: f.teams.away.logo,
        status: f.fixture.status.long,
        statusCode: f.fixture.status.short,
        iplay: false,
        score: ' - ',
      }));

    return NextResponse.json({ matches });
  } catch (err) {
    console.error('Failed to fetch upcoming fixtures', err);
    return NextResponse.json(
      { error: 'Failed to fetch fixtures' },
      { status: 500 }
    );
  }
}
