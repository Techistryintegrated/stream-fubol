import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { requireAuth } from '@/middleware/auth';
import { requireAdmin } from '@/middleware/admin';
import { User } from '@/models/User';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const adminResult = await requireAdmin(authResult.user!);
    if (adminResult.errorResponse) {
      return adminResult.errorResponse;
    }

    await connectToDatabase();

    const { id } = params;
    const body = await req.json();
    const { role } = body;

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, msg: 'Invalid role' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('email name role');

    if (!user) {
      return NextResponse.json(
        { success: false, msg: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('Update role error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
