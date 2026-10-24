import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const correlationId = (req.headers['x-correlation-id'] as string) || `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-Id', correlationId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api/')) {
      console.log(
        JSON.stringify({
          time: new Date().toISOString(),
          correlationId,
          method: req.method,
          path: req.originalUrl,
          status: res.statusCode,
          durationMs: duration,
          ip: req.ip || req.socket.remoteAddress
        })
      );
    }
  });

  next();
}
