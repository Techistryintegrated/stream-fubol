import { NextRequest, NextResponse } from 'next/server';
import { MatchView } from '@/models/MatchView';
import { requireAuth } from '@/middleware/auth';


export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    // Parse GMID
    const { searchParams } = new URL(req.url);
    const gmid = searchParams.get('gmid');

    if (!gmid) {
      return NextResponse.json(
        { success: false, msg: 'A valid gmid is required' },
        { status: 400 }
      );
    }

    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY as string;
    if (!RAPIDAPI_KEY) {
      return NextResponse.json(
        { success: false, msg: 'Missing API key' },
        { status: 500 }
      );
    }

    // Call RapidAPI
    const apiRes = await fetch(
      `https://all-sport-live-stream.p.rapidapi.com/api/d/stream_source?gmid=${gmid}`,
      {
        headers: {
          'x-rapidapi-host': 'all-sport-live-stream.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    const data = await apiRes.json();

    // Save match view
    await MatchView.create({
      userId: user?.userId,
      gmid,
      viewedAt: new Date(),
    });

    return NextResponse.json(data, { status: apiRes.status });
  } catch (err) {
    console.error('Stream source error:', (err as Error).message);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
