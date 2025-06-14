import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, AuthenticatedUser } from '../../../middleware/auth';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';

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

    const { name, email } = req.body as { name?: string; email?: string };

    await connectToDatabase();

    const update: Partial<{ name: string; email: string }> = {};
    if (name) update.name = name;
    if (email) update.email = email; // You could add email uniqueness check here

    const updatedUser = await User.findByIdAndUpdate(user.userId, update, {
      new: true,
    }).select('email name');

    if (!updatedUser) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    return res.status(200).json({ success: true, user: updatedUser });
  });
}
