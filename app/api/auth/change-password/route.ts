import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/utils/db';
import { requireAuth } from '@/middleware/auth';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          msg: 'Both current and new password are required',
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const dbUser = await User.findById(user.userId);
    if (!dbUser) {
      return NextResponse.json(
        { success: false, msg: 'User not found' },
        { status: 404 }
      );
    }

    const match = await dbUser.comparePassword(currentPassword);
    if (!match) {
      return NextResponse.json(
        {
          success: false,
          msg: 'Current password is incorrect',
        },
        { status: 401 }
      );
    }

    dbUser.passwordHash = await bcrypt.hash(newPassword, 10);
    await dbUser.save();

    return NextResponse.json({
      success: true,
      msg: 'Password updated successfully',
    });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
