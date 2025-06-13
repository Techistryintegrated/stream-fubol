import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../middleware/auth';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';
import bcrypt from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requireAuth(req, res, async () => {
    if (req.method !== 'POST') {
      return res
        .status(405)
        .json({ success: false, msg: 'Method not allowed' });
    }

    const userId = (req as any).user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          msg: 'Both current and new password required',
        });
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, msg: 'User not found' });

    const match = await user.comparePassword(currentPassword);
    if (!match)
      return res
        .status(401)
        .json({ success: false, msg: 'Current password incorrect' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, msg: 'Password updated' });
  });
}
