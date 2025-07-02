import { NextRequest, NextResponse } from 'next/server';

const RAPID_API_KEY =
  process.env.RAPIDAPI_KEY ||
  '6e32e8f998msha0375aef990b98fp1aa6f5jsn4faf8116b10b';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date =
    searchParams.get('date') || new Date().toISOString().slice(0, 10);

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

    const data = await response.json();

    // Filter and map only matches with status "NS"
    const matches = (data.response || [])
      .filter((fixture: any) => fixture.fixture.status.short === 'NS')
      .map((fixture: any) => ({
        gmid: fixture.fixture.id,
        league: fixture.league.name,
        leagueLogo: fixture.league.logo,
        time: fixture.fixture.date,
        stime: fixture.fixture.date,
        teamA: fixture.teams.home.name,
        teamB: fixture.teams.away.name,
        logoA: fixture.teams.home.logo,
        logoB: fixture.teams.away.logo,
        status: fixture.fixture.status.long,
        statusCode: fixture.fixture.status.short,
        iplay: false,
        score: ' - ', // upcoming matches won't have scores yet
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
