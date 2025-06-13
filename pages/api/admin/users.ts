import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../middleware/auth';
import { requireAdmin } from '../../../middleware/admin';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requireAuth(req, res, async () => {
    await requireAdmin(req, res, async () => {
      await connectToDatabase();
      const users = await User.find().select('email name role createdAt');
      res.status(200).json({ success: true, users });
    });
  });
}
