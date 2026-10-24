import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'alaelsaree-secure-dev-jwt-secret-key-2026';

export interface AuthUserPayload {
  userId: string;
  phone: string;
  name: string;
  role: string;
  merchantId?: string;
  driverId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export function generateToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Check fallback dev header
    const devUserId = req.headers['x-user-id'] as string;
    const devRole = req.headers['x-user-role'] as string;
    const devMerchantId = req.headers['x-merchant-id'] as string;
    const devDriverId = req.headers['x-driver-id'] as string;

    if (devUserId && devRole) {
      req.user = {
        userId: devUserId,
        name: (req.headers['x-user-name'] as string) || 'User',
        phone: (req.headers['x-user-phone'] as string) || '01000000000',
        role: devRole,
        merchantId: devMerchantId,
        driverId: devDriverId
      };
      return next();
    }

    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token required (Bearer format)',
        correlationId: req.correlationId
      }
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'The supplied authentication token is invalid or has expired',
        correlationId: req.correlationId
      }
    });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          correlationId: req.correlationId
        }
      });
      return;
    }

    if (req.user.role === 'platform_admin' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: `Insufficient role permissions. Required: [${allowedRoles.join(', ')}]`,
        correlationId: req.correlationId
      }
    });
  };
}

export function requireMerchantIsolation(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Auth required' } });
    return;
  }

  if (req.user.role === 'platform_admin' || req.user.role === 'operations_manager') {
    return next(); // Admins and managers can supervise across merchants
  }

  if (req.user.role === 'merchant_owner' || req.user.role === 'merchant_staff') {
    const targetMerchantId = req.params.merchantId || req.query.merchantId || req.body.merchantId;
    if (targetMerchantId && targetMerchantId !== req.user.merchantId) {
      res.status(403).json({
        error: {
          code: 'MERCHANT_ISOLATION_VIOLATION',
          message: 'Access denied: You cannot view or modify data belonging to another merchant',
          correlationId: req.correlationId
        }
      });
      return;
    }
  }

  next();
}
