import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../../middleware/auth';
import { requireAdmin } from '../../../../middleware/admin';
import { connectToDatabase } from '../../../../utils/db';
import { User } from '../../../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requireAuth(req, res, async () => {
    await requireAdmin(req, res, async () => {
      await connectToDatabase();
      const { id } = req.query;
      const user = await User.findById(id).select('email name role createdAt');
      if (!user)
        return res.status(404).json({ success: false, msg: 'User not found' });
      res.status(200).json({ success: true, user });
    });
  });
}
