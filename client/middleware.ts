// File: middleware.ts (at the root of your Next.js project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Shared secret for both cookie-based and header-based tokens
type JwtPayload = { userId: string; role: string; exp: number };
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const config = {
  // Protect both dashboard pages and API routes except auth endpoints:
  matcher: ['/dashboard/:path*', '/api/:path*'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bypass auth on public auth endpoints:
  if (
    pathname === '/api/auth/login' ||
    pathname === '/api/auth/signup' ||
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    return NextResponse.next();
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
    return NextResponse.next();
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
