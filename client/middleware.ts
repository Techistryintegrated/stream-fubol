// File: middleware.ts (at the root of your Next.js project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:3001',
  'https://admin.streamfutball.com',
];

// Shared secret for both cookie-based and header-based tokens
type JwtPayload = { userId: string; role: string; exp: number };
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const config = {
  // Protect both dashboard pages and API routes except auth/stream endpoints
  matcher: ['/dashboard/:path*', '/api/:path*'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get('origin') || '';

  // Handle CORS preflight
  if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    const headers = new Headers();
    if (ALLOWED_ORIGINS.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Credentials', 'true');
      headers.set(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,DELETE,OPTIONS'
      );
      headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      );
    }
    return new Response(null, { status: 204, headers });
  }

  // Bypass auth on public endpoints
  if (
    pathname === '/api/auth/login' ||
    pathname === '/api/auth/register' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/api/stream/match_list' ||
    pathname === '/api/stream/upcoming_matches'
  ) {
    // Also inject CORS for real API calls
    const res = NextResponse.next();
    if (pathname.startsWith('/api/') && ALLOWED_ORIGINS.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin);
      res.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    return res;
  }

  // For actual API responses, inject CORS headers
  let response: NextResponse;
  if (pathname.startsWith('/api/') && ALLOWED_ORIGINS.includes(origin)) {
    response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    response = NextResponse.next();
  }

  // 1) Extract token: prefer Authorization header, fallback to HttpOnly cookie
  let token: string | undefined;
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies.get('token')?.value;
  }

  // 2) If no token, reject or redirect
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, msg: 'Unauthorized: No token' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 3) Verify JWT
  try {
    const { payload } = (await jwtVerify(token, SECRET)) as {
      payload: JwtPayload;
    };

    // 4) If landing on dashboard pages, ensure role is "admin"
    if (pathname.startsWith('/dashboard') && payload.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, msg: 'Forbidden: Admins only' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // 5) Allow the request
    return response;
  } catch {
    // expired or invalid
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, msg: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
