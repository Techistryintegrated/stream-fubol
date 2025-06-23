import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/utils/db';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, msg: 'Email, OTP, and newPassword required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetOTP !== otp ||
      !user.resetOTPExpires ||
      user.resetOTPExpires < new Date()
    ) {
      return NextResponse.json(
        { success: false, msg: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, msg: 'Password has been reset' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Password reset error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
