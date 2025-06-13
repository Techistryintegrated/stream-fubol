import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY as string;

  const apiRes = await fetch(
    'https://all-sport-live-stream.p.rapidapi.com/api/d/all_sports',
    {
      headers: {
        'x-rapidapi-host': 'all-sport-live-stream.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    }
  );
  const data = await apiRes.json();
  return res.status(apiRes.status).json(data);
}
