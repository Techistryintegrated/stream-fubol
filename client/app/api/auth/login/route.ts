import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/utils/db';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, msg: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Login attempt:', { email, password });

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { success: false, msg: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    const response = NextResponse.json(
      { success: true, msg: 'Logged in', token: token },
      { status: 200 }
    );


    response.cookies.set('token', token, {
      httpOnly: true, // JS in the browser can’t read it
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // or 'none' + secure for cross‐subdomain
      domain:
        process.env.NODE_ENV === 'production'
          ? '.streamfutbol.com'
          : 'localhost', // dev: localhost
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}


export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // or set specific origin
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

