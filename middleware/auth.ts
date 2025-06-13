// middleware/auth.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) throw new Error('No auth cookie');
    const { token } = parse(cookieHeader);
    if (!token) throw new Error('No token cookie');

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    // attach to req for downstream handlers
    (req as any).user = { userId: payload.userId };
    await next();
  } catch {
    return res.status(401).json({ success: false, msg: 'Not authenticated' });
  }
}
