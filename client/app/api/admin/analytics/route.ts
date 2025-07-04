import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { requireAdmin } from '@/middleware/admin';
import { requireAuth } from '@/middleware/auth';
import { MatchView } from '@/models/MatchView';
import { User } from '@/models/User';
import {
  getGA4AvgWatchTime,
  getGA4ActiveStreams,
} from '@/utils/googleAnalytics'; // our GA helper

export async function GET(req: NextRequest) {
  try {
    // Auth checks
    const authResult = await requireAuth(req);
    if (authResult.errorResponse) return authResult.errorResponse;
    const adminResult = await requireAdmin(authResult.user!);
    if (adminResult.errorResponse) return adminResult.errorResponse;

    await connectToDatabase();

    // 1. User Stats
    const userCount = await User.countDocuments();

    // New users todayF
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    // User growth (last 6 months)
    const userGrowth = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await User.countDocuments({
        createdAt: { $gte: monthStart, $lt: monthEnd },
      });
      const label = monthStart.toLocaleString('default', { month: 'short' });
      userGrowth.push({ month: label, users: count });
    }

    // 2. Match Stats (example: active viewers, top matches)
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeViewers = await MatchView.distinct('userId', {
      viewedAt: { $gte: fiveMinsAgo },
    });

    today.setHours(0, 0, 0, 0);
    const topMatches = await MatchView.aggregate([
      { $match: { viewedAt: { $gte: today } } },
      {
        $group: {
          _id: '$gmid', // group by gmid
          count: { $sum: 1 },
          match: { $first: '$match' }, // get first match name
          league: { $first: '$league' }, // get first league
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    
    

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('email name createdAt');

    // 3. Google Analytics Stats
    let avgWatchTime = null;
    let activeStreamsGA = null;
    try {
      avgWatchTime = await getGA4AvgWatchTime(); // in minutes
      activeStreamsGA = await getGA4ActiveStreams();
    } catch (e) {
      console.warn('Google Analytics error:', e);
    }

    // 4. Example: You can add match distribution from your own API if needed

    // Response
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: userCount,
        newUsersToday,
        userGrowth,
        activeViewerCount: activeViewers.length,
        topMatches,
        recentUsers,
        avgWatchTime, // From Google Analytics
        activeStreamsGA, // From Google Analytics
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, msg: 'Server error', error: (err as Error)?.message },
      { status: 500 }
    );
  }
}
