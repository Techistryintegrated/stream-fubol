import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/utils/db';
import { User } from '@/models/User';
import { sendEmail } from '@/utils/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, msg: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    const safeResponse = {
      success: true,
      msg: 'If that email exists, an OTP has been sent.',
    };

    if (!user) {
      return NextResponse.json(safeResponse);
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const html = `
      <p>Your password reset code is: <strong>${otp}</strong></p>
      <p>It expires in 15 minutes.</p>
    `;

    try {
      await sendEmail(
        user.email,
        'Your Streamfutball Password Reset Code',
        html
      );
    } catch (err) {
      console.error('Failed to send OTP email:', err);
    }

    return NextResponse.json(safeResponse);
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
