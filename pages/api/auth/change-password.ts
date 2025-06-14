import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, AuthenticatedUser } from '../../../middleware/auth';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';
import bcrypt from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requireAuth(req, res, async (user: AuthenticatedUser) => {
    if (req.method !== 'POST') {
      return res
        .status(405)
        .json({ success: false, msg: 'Method not allowed' });
    }

    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        msg: 'Both current and new password are required',
      });
    }

    await connectToDatabase();

    const dbUser = await User.findById(user.userId);
    if (!dbUser) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const match = await dbUser.comparePassword(currentPassword);
    if (!match) {
      return res.status(401).json({
        success: false,
        msg: 'Current password is incorrect',
      });
    }

    dbUser.passwordHash = await bcrypt.hash(newPassword, 10);
    await dbUser.save();

    return res.status(200).json({
      success: true,
      msg: 'Password updated successfully',
    });
  });
}
