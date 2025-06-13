import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, msg: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: 'Email and password required' });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, msg: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({ email, passwordHash, name });

  return res
    .status(201)
    .json({ success: true, msg: 'Registration successful' });
}
