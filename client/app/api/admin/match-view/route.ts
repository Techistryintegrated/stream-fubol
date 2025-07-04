import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { MatchView } from '@/models/MatchView';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { gmid } = await req.json();
    if (!gmid) {
      return NextResponse.json(
        { success: false, msg: 'gmid required' },
        { status: 400 }
      );
    }
    await MatchView.create({
      gmid,
      viewedAt: new Date(),
      userId: null, 
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
