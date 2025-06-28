// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const isAuth = Boolean(token);
  const isLogin = request.nextUrl.pathname.startsWith('/login');

  // Redirect unauthenticated users trying to access /dashboard routes
  if (!isAuth && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from /login
  if (isAuth && isLogin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', // protect all dashboard pages
    '/login', // redirect logged-in users from login page
  ],
};

