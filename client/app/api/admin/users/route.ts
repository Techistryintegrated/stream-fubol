import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { requireAuth } from '@/middleware/auth';
import { requireAdmin } from '@/middleware/admin';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    // Authenticate
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

    // Authorize admin
    const adminResult = await requireAdmin(user);
    if (adminResult.errorResponse) {
      return adminResult.errorResponse;
    }

    await connectToDatabase();

    const users = await User.find().select('email name role createdAt');

    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error('Fetch users error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
