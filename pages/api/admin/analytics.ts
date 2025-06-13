import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../middleware/auth';
import { requireAdmin } from '../../../middleware/admin';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../../models/User';
import { MatchView } from '../../../models/MatchView';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requireAuth(req, res, async () => {
    await requireAdmin(req, res, async () => {
      await connectToDatabase();

      // Total users
      const userCount = await User.countDocuments();

      // Total streams (match views)
      const totalViews = await MatchView.countDocuments();

      // Active viewers (last 5 mins)
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
      const activeViewers = await MatchView.distinct('userId', {
        viewedAt: { $gte: fiveMinsAgo },
      });

      // Most watched matches today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const topMatches = await MatchView.aggregate([
        { $match: { viewedAt: { $gte: today } } },
        { $group: { _id: '$gmid', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);

      // Recent signups (last 5)
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('email name createdAt');

      res.status(200).json({
        success: true,
        data: {
          userCount,
          totalViews,
          activeViewerCount: activeViewers.length,
          topMatches,
          recentUsers,
        },
      });
    });
  });
}
