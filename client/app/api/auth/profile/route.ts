// File: app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(request: NextRequest) {
  // 1. Extract token from HttpOnly cookie
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, msg: 'Unauthorized: No token' },
      { status: 401 }
    );
  }

  // 2. Verify JWT
  try {
    const { payload } = await jwtVerify(token, SECRET);
    // 3. Return the user data you need
    const userData = {
      userId: payload.userId,
      role: payload.role,
      email: (payload).email, // if you encoded email in token
    };
    return NextResponse.json({ success: true, user: userData });
  } catch {
    return NextResponse.json(
      { success: false, msg: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }
}
