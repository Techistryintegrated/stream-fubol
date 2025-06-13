import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../middleware/auth';
import { MatchView } from '../../../models/MatchView';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requireAuth(req, res, async () => {
    // Parse GMID from query
    const { gmid } = req.query;
    if (!gmid) {
      return res.status(400).json({ success: false, msg: 'gmid is required' });
    }

    // Call RapidAPI endpoint (example, adapt as needed)
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY as string;

    const apiRes = await fetch(
      `https://all-sport-live-stream.p.rapidapi.com/api/d/stream_source?gmid=${gmid}`,
      {
        headers: {
          'x-rapidapi-host': 'all-sport-live-stream.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );
    const data = await apiRes.json();

    await MatchView.create({
      userId: (req as any).user.userId,
      gmid,
      viewedAt: new Date(),
    });

    // Forward the response
    return res.status(apiRes.status).json(data);
  });
}
