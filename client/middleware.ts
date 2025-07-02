// middleware.ts  (at the root of your Next.js project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Only run this middleware for your protected admin endpoints:
export const config = {
  matcher: '/api/admin/:path*',
};

export async function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }
    return NextResponse.next();
  } catch {
    return new NextResponse('Invalid or expired token', { status: 401 });
  }
}
