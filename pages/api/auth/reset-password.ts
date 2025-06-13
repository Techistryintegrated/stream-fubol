import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ success: false, msg: 'Email, OTP, and newPassword required' });
  }

  await connectToDatabase();
  const user = await User.findOne({ email });
  if (
    !user ||
    user.resetOTP !== otp ||
    !user.resetOTPExpires ||
    user.resetOTPExpires < new Date()
  ) {
    return res
      .status(400)
      .json({ success: false, msg: 'Invalid or expired OTP' });
  }

  // All good—reset password
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, msg: 'Password has been reset' });
}
