import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { MatchView } from '@/models/MatchView';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { gmid, userId, league, match } = await req.json();
  
    if (!gmid || !userId) {
      return NextResponse.json(
        { success: false, msg: 'gmid and userId required' },
        { status: 400 }
      );
    }
    await MatchView.create({
      gmid,
      viewedAt: new Date(),
      userId,
      league,
      match,
    });
    return NextResponse.json({ success: true });
  } catch(err)  {
    console.error('Match view logging error:', err);

    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
