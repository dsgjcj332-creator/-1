import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('[SERVER ERROR]', {
    correlationId: req.correlationId,
    path: req.path,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = err.isPublic ? err.message : 'An unexpected server error occurred';

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: errorMessage,
      correlationId: req.correlationId,
      timestamp: new Date().toISOString()
    }
  });
}
