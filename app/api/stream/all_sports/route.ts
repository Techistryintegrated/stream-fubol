import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY as string;

    const apiRes = await fetch(
      'https://all-sport-live-stream.p.rapidapi.com/api/d/all_sports',
      {
        headers: {
          'x-rapidapi-host': 'all-sport-live-stream.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err) {
    console.error('All sports fetch error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
