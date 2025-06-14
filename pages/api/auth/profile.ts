import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, AuthenticatedUser } from '../../../middleware/auth';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requireAuth(req, res, async (user: AuthenticatedUser) => {
    await connectToDatabase();

    const foundUser = await User.findById(user.userId).select(
      'email name createdAt'
    );

    if (!foundUser) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    return res.status(200).json({ success: true, user: foundUser });
  });
}
