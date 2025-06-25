import { NextRequest, NextResponse } from 'next/server';
import { convertISTtoWAT } from '@/utils/timezone';

export async function GET(req: NextRequest) {
  try {
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY as string;
    const { searchParams } = new URL(req.url);
    const gmid = searchParams.get('gmid');
    const sport_id = searchParams.get('sport_id');

    if (!gmid || !sport_id) {
      return NextResponse.json(
        { success: false, msg: 'gmid and sport_id are required' },
        { status: 400 }
      );
    }

    const apiRes = await fetch(
      `https://all-sport-live-stream.p.rapidapi.com/api/d/match_details?gmid=${gmid}&sport_id=${sport_id}`,
      {
        headers: {
          'x-rapidapi-host': 'all-sport-live-stream.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    const data = await apiRes.json();

    if (data.data?.[0]?.stime) {
      data.data[0].stime = convertISTtoWAT(data.data[0].stime);
    }

    return NextResponse.json(data, { status: apiRes.status });
  } catch (err) {
    console.error('Match details fetch error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
