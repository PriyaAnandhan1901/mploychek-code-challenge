import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from './types';

export const JWT_SECRET = 'dev-secret-change-me';

export interface AuthRequest extends Request {
  user?: { id: number; userId: string; role: Role };
}

// Simulates a slow API: add ?delay=2000 to any request
export function delay(req: Request, _res: Response, next: NextFunction) {
  const ms = Math.min(Number(req.query.delay) || 0, 10000);
  setTimeout(next, ms);
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET) as AuthRequest['user'];
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'Admin') return res.status(403).json({ message: 'Admins only' });
  next();
}