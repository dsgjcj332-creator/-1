import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const hits = new Map<string, RateLimitRecord>();

export function rateLimiter(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${ip}:${req.baseUrl || req.path}`;
    const now = Date.now();

    const record = hits.get(key);

    if (!record || now > record.resetTime) {
      hits.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: message || 'Too many requests, please try again later.',
          retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
          correlationId: req.correlationId
        }
      });
      return;
    }

    record.count++;
    next();
  };
}
