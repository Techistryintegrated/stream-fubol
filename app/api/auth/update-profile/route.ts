import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { User } from '@/models/User';
import { requireAuth } from '@/middleware/auth';

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

    const { name, email } = (await req.json()) as {
      name?: string;
      email?: string;
    };

    await connectToDatabase();

    const update: Partial<{ name: string; email: string }> = {};
    if (name) update.name = name;
    if (email) update.email = email;

    const updatedUser = await User.findByIdAndUpdate(user.userId, update, {
      new: true,
    }).select('email name');

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, msg: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Error updating profile:', (err as Error).message);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
  
}
