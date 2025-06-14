import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedUser {
  userId: string;
}

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  next: (user: AuthenticatedUser) => Promise<void>
) {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ success: false, msg: 'No auth cookie' });
    }

    const { token } = parse(cookieHeader);
    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token cookie' });
    }

    const payload = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;

    if (!payload || !payload.userId) {
      return res.status(401).json({ success: false, msg: 'Invalid token' });
    }

    // Pass user to next
    await next(payload);
  
  }catch {
    return res.status(401).json({ success: false, msg: 'Not authenticated' });
  }
  
}
