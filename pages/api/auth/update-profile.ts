import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../middleware/auth';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';

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
    const { name, email } = req.body;

    await connectToDatabase();

    const update: Record<string, any> = {};
    if (name) update.name = name;
    if (email) update.email = email; // Optionally: check if email is unique

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select('email name');
    if (!user)
      return res.status(404).json({ success: false, msg: 'User not found' });

    return res.status(200).json({ success: true, user });
  });
}
