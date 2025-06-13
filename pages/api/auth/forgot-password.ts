import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';
import { sendEmail } from '../../../utils/email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, msg: 'Email required' });

  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(200)
      .json({
        success: true,
        msg: 'If that email exists, an OTP has been sent.',
      });

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  user.resetOTP = otp;
  user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await user.save();

  // Send email
  const html = `<p>Your password reset code is: <strong>${otp}</strong></p>
                <p>It expires in 15 minutes.</p>`;
  await sendEmail(user.email, 'Your StreamFutbol Password Reset Code', html);

  res
    .status(200)
    .json({
      success: true,
      msg: 'If that email exists, an OTP has been sent.',
    });
}
