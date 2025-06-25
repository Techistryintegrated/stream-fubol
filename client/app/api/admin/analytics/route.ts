import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { requireAdmin } from '@/middleware/admin';
import { requireAuth } from '@/middleware/auth';
import { MatchView } from '@/models/MatchView';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const adminResult = await requireAdmin(authResult.user!);
    if (adminResult.errorResponse) {
      return adminResult.errorResponse;
    }

    await connectToDatabase();

    const userCount = await User.countDocuments();
    const totalViews = await MatchView.countDocuments();

    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeViewers = await MatchView.distinct('userId', {
      viewedAt: { $gte: fiveMinsAgo },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const topMatches = await MatchView.aggregate([
      { $match: { viewedAt: { $gte: today } } },
      { $group: { _id: '$gmid', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('email name createdAt');

    return NextResponse.json({
      success: true,
      data: {
        userCount,
        totalViews,
        activeViewerCount: activeViewers.length,
        topMatches,
        recentUsers,
      },
    });
  } catch (err) {
    console.error('Analytics API error:', err);
    return NextResponse.json(
      { success: false, msg: 'Server error' },
      { status: 500 }
    );
  }
}
