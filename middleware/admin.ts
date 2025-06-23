import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { User } from '@/models/User';
import { AuthenticatedUser } from './auth';

export async function requireAdmin(
  user: AuthenticatedUser
): Promise<{ errorResponse: NextResponse | null }> {
  try {
    await connectToDatabase();

    const dbUser = await User.findById(user.userId);
    if (!dbUser || dbUser.role !== 'admin') {
      return {
        errorResponse: NextResponse.json(
          { success: false, msg: 'Forbidden: Admin only' },
          { status: 403 }
        ),
      };
    }

    return { errorResponse: null };
  } catch (err) {
    console.error('Admin check error:', (err as Error).message);
    return {
      errorResponse: NextResponse.json(
        { success: false, msg: 'Server error checking admin' },
        { status: 500 }
      ),
    };
  }
}
