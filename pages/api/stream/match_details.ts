import type { NextApiRequest, NextApiResponse } from 'next';
import { convertISTtoWAT } from '../../../utils/timezone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY as string;
  const { gmid, sport_id } = req.query;

  if (!gmid || !sport_id) {
    return res
      .status(400)
      .json({ success: false, msg: 'gmid and sport_id are required' });
  }

  const apiRes = await fetch(
    `https://all-sport-live-stream.p.rapidapi.com/api/d/match_details?gmid=${gmid}&sport_id=${sport_id}`,
    {
      headers: {
        'x-rapidapi-host': 'all-sport-live-stream.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    }
  );
  const data = await apiRes.json();

  if (data.data?.[0]?.stime) {
    data.data[0].stime = convertISTtoWAT(data.data[0].stime);
  }

  return res.status(apiRes.status).json(data);
}
