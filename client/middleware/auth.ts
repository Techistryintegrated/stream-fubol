// File: middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

export interface AuthenticatedUser {
  userId: string;
  role?: string;
}

export async function requireAuth(req: NextRequest): Promise<{
  user: AuthenticatedUser | null;
  errorResponse: NextResponse | null;
}> {
  // 1) Extract token from Authorization header or cookie
  const authHeader = req.headers.get('authorization');
  let token: string | undefined;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    // fallback to HttpOnly cookie
    token = req.cookies.get('token')?.value;
  }

  // 2) No token → unauthorized
  if (!token) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, msg: 'Unauthorized: No token provided' },
        { status: 401 }
      ),
    };
  }

  // 3) Verify JWT
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    return { user: decoded, errorResponse: null };
  } catch (err) {
    console.error('Auth error:', (err as Error).message);
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, msg: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      ),
    };
  }
}
