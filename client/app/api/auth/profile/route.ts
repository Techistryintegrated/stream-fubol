import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { requireAuth } from '@/middleware/auth';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const user = authResult.user;
    if (!user) {
      return NextResponse.json(
        { success: false, msg: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const foundUser = await User.findById(user.userId).select(
      'email name createdAt'
    );

    if (!foundUser) {
      return NextResponse.json(
        { success: false, msg: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: foundUser });
  } catch (err) {
    console.error('Fetch profile error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
