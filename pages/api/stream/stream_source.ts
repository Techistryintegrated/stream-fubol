import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../middleware/auth';
import { MatchView } from '../../../models/MatchView';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await requireAuth(req, res, async (user) => {
    // Parse GMID from query
    const { gmid } = req.query;
    if (!gmid || Array.isArray(gmid)) {
      return res
        .status(400)
        .json({ success: false, msg: 'A valid gmid is required' });
    }

    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY as string;
    if (!RAPIDAPI_KEY) {
      return res.status(500).json({ success: false, msg: 'Missing API key' });
    }

    // Call RapidAPI stream source endpoint
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

    // Save match view
    await MatchView.create({
      userId: user.userId,
      gmid,
      viewedAt: new Date(),
    });

    // Forward API response
    return res.status(apiRes.status).json(data);
  });
}
