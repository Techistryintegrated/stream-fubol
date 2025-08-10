import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/utils/db';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_DOMAIN =
  process.env.NODE_ENV === 'production' ? '.streamfutball.com' : 'localhost';

type JwtPayload = { userId: string; role?: string };

function pickToken(req: NextRequest, bodyToken?: string | null) {
  // Support: body token (mobile), Authorization header, and cookie (web)
  const headerAuth = req.headers.get('authorization');
  const headerToken = headerAuth?.startsWith('Bearer ')
    ? headerAuth.slice(7)
    : headerAuth || null;
  const cookieToken = req.cookies.get('token')?.value || null;

  // Prefer body (explicit), then header, then cookie.
  return bodyToken || headerToken || cookieToken || null;
}

async function resolveUserFromToken(token: string | null) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded?.userId) return null;
    await connectToDatabase();
    return await User.findById(decoded.userId);
  } catch {
    return null;
  }
}

/**
 * DELETE /api/account/delete
 * Body: { password: string, token?: string }  // token optional if cookie/header present
 */
export async function DELETE(req: NextRequest) {
  try {
    // Some clients don’t send a body with DELETE; guard for that.
    let password: string | undefined;
    let bodyToken: string | undefined;

    try {
      const body = await req.json();
      password = body?.password;
      bodyToken = body?.token;
    } catch {
      // no body provided — fine for cookie/header auth
    }

    if (!password) {
      return NextResponse.json(
        { success: false, msg: 'Password is required.' },
        { status: 400 }
      );
    }

    const token = pickToken(req, bodyToken ?? null);
    const user = await resolveUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, msg: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return NextResponse.json(
        { success: false, msg: 'Password is incorrect.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    await User.deleteOne({ _id: user._id });

    const res = NextResponse.json(
      { success: true, msg: 'Account permanently deleted.' },
      { status: 200 }
    );

    // Clear JWT cookie for web sessions
    res.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: COOKIE_DOMAIN,
      path: '/',
      maxAge: 0,
    });

    return res;
  } catch (err) {
    console.error('Delete account error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
