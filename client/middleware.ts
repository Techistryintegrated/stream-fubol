// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://streamfutbol.com',
  'https://admin.streamfutbol.com',
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')!;
  const { method, nextUrl } = request;
  const isApi = nextUrl.pathname.startsWith('/api');

  // 1) Always respond to OPTIONS *with* CORS headers:
  if (isApi && method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // 2) Block disallowed origins
  if (isApi && origin && !allowedOrigins.includes(origin)) {
    return new Response('CORS: Origin not allowed', { status: 403 });
  }

  // 3) For all other API requests, inject CORS headers on the **request** phase
  const res = NextResponse.next();
  if (isApi && allowedOrigins.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,DELETE,OPTIONS'
    );
    res.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return res;
}

export const config = { matcher: '/api/:path*' };
