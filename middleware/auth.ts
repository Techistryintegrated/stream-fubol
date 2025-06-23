import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

export interface AuthenticatedUser {
  userId: string;
}

export async function requireAuth(req: NextRequest): Promise<{
  user: AuthenticatedUser | null;
  errorResponse: NextResponse | null;
}> {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return {
        user: null,
        errorResponse: NextResponse.json(
          { success: false, msg: 'Unauthorized: No token' },
          { status: 401 }
        ),
      };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;

    return {
      user: decoded,
      errorResponse: null,
    };
  } catch (err) {
    console.error('Auth error:', (err as Error).message);
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, msg: 'Unauthorized: Invalid token' },
        { status: 401 }
      ),
    };
  }
}
