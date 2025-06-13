import { NextApiRequest, NextApiResponse } from 'next';

export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) {
  // Assumes user info already attached by requireAuth
  if ((req as any).user?.role === 'admin') {
    await next();
  } else {
    return res.status(403).json({ success: false, msg: 'Admin only' });
  }
}
