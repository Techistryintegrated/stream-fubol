import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../middleware/auth';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requireAuth(req, res, async () => {
    await connectToDatabase();
    // user info from JWT is attached to req.user in our middleware
    const userId = (req as any).user.userId;
    const user = await User.findById(userId).select('email name createdAt');
    if (!user)
      return res.status(404).json({ success: false, msg: 'User not found' });

    return res.status(200).json({ success: true, user });
  });
}
