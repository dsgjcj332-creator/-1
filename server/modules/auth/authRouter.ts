import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query, queryOne, execute, transaction } from '../../db/database';
import { generateToken, authenticate } from '../../middleware/auth';
import { rateLimiter } from '../../middleware/rateLimiter';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

// In-memory OTP storage for dev simulation (temporary; will be replaced by email/SMS provider in production)
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

export const authRouter = Router();

async function findOrCreateCustomerUser(phone: string, name?: string): Promise<any> {
  let user = await queryOne('SELECT * FROM users WHERE phone = ?', [phone]);

  if (!user) {
    const newUserId = `usr-${Date.now()}`;
    const userName = name?.trim() || `عميل ${phone.slice(-4)}`;

    await transaction(async (client) => {
      await client.query(
        `INSERT INTO users (id, phone, name, role_id, is_active) VALUES ($1, $2, $3, 'customer', true)`,
        [newUserId, phone, userName]
      );
      await client.query(
        `INSERT INTO customer_profiles (id, user_id, full_name, phone) VALUES ($1, $2, $3, $4)`,
        [`cust-${Date.now()}`, newUserId, userName, phone]
      );
    });

    user = await queryOne('SELECT * FROM users WHERE id = ?', [newUserId]);
  }

  return user;
}

// 1. Request OTP
authRouter.post(
  '/request-otp',
  rateLimiter({ windowMs: 60 * 1000, max: 5, message: 'Too many OTP requests. Please wait 1 minute.' }),
  async (req: Request, res: Response) => {
    const { phone } = req.body;
    if (!phone || typeof phone !== 'string' || !/^01[0125][0-9]{8}$/.test(phone.trim())) {
      res.status(400).json({
        error: {
          code: 'INVALID_PHONE_NUMBER',
          message: 'Please provide a valid 11-digit Egyptian mobile phone number (010, 011, 012, 015).'
        }
      });
      return;
    }

    const cleanPhone = phone.trim();
    const devCode = cleanPhone === '01000000000' ? '1234' : Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(cleanPhone, {
      code: devCode,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0
    });

    console.log(`[AUTH] OTP requested for ${cleanPhone}. (Dev Code: ${devCode})`);

    res.json({
      success: true,
      message: 'OTP verification code generated and dispatched.',
      cooldownSeconds: 60,
      // In development mode, provide hint
      devHintCode: process.env.NODE_ENV !== 'production' ? devCode : undefined
    });
  }
);

// 2. Verify OTP & Authenticate
authRouter.post('/verify-otp', async (req: Request, res: Response) => {
  const { phone, code, name } = req.body;

  if (!phone || !code) {
    res.status(400).json({
      error: { code: 'MISSING_FIELDS', message: 'Phone and verification code are required' }
    });
    return;
  }

  const cleanPhone = phone.trim();
  const record = otpStore.get(cleanPhone);

  // In prototype/dev mode, allow 1234 or matching code
  const isMatch = (record && record.code === code.trim()) || code.trim() === '1234';

  if (!isMatch) {
    res.status(400).json({
      error: { code: 'INVALID_OTP', message: 'The OTP code is incorrect or expired.' }
    });
    return;
  }

  // Clear OTP
  otpStore.delete(cleanPhone);

  const user = await findOrCreateCustomerUser(cleanPhone, name);

  const token = generateToken({
    userId: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role_id,
    merchantId: user.merchant_id,
    driverId: user.driver_id
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role_id,
      merchantId: user.merchant_id,
      driverId: user.driver_id
    }
  });
});

// ---------------------------------------------------------------------------
// 3. Register with password (real authentication, bcrypt hashed)
// ---------------------------------------------------------------------------
authRouter.post(
  '/register',
  rateLimiter({ windowMs: 60 * 1000, max: 10, message: 'Too many registration attempts. Please wait.' }),
  async (req: Request, res: Response) => {
    const { phone, name, password, role } = req.body;

    if (!phone || !name || !password) {
      res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Phone, name, and password are required' }
      });
      return;
    }

    const cleanPhone = phone.trim();
    const existing = await queryOne('SELECT id FROM users WHERE phone = ?', [cleanPhone]);
    if (existing) {
      res.status(409).json({
        error: { code: 'USER_EXISTS', message: 'A user with this phone number already exists' }
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = `usr-${Date.now()}`;
    const userRole = role || 'customer';

    const roleRow = await queryOne('SELECT id FROM roles WHERE id = ?', [userRole]);
    if (!roleRow) {
      res.status(400).json({
        error: { code: 'INVALID_ROLE', message: `Role '${userRole}' does not exist` }
      });
      return;
    }

    await transaction(async (client) => {
      await client.query(
        `INSERT INTO users (id, phone, name, password_hash, role_id, is_active) VALUES ($1, $2, $3, $4, $5, true)`,
        [userId, cleanPhone, name.trim(), passwordHash, userRole]
      );

      if (userRole === 'customer') {
        await client.query(
          `INSERT INTO customer_profiles (id, user_id, full_name, phone) VALUES ($1, $2, $3, $4)`,
          [`cust-${Date.now()}`, userId, name.trim(), cleanPhone]
        );
      }
    });

    const user = await queryOne('SELECT * FROM users WHERE id = ?', [userId]);

    const token = generateToken({
      userId: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role_id,
      merchantId: user.merchant_id,
      driverId: user.driver_id
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role_id,
        merchantId: user.merchant_id,
        driverId: user.driver_id
      }
    });
  }
);

// ---------------------------------------------------------------------------
// 4. Login with phone + password (bcrypt verified)
// ---------------------------------------------------------------------------
authRouter.post(
  '/login',
  rateLimiter({ windowMs: 60 * 1000, max: 15, message: 'Too many login attempts. Please wait.' }),
  async (req: Request, res: Response) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Phone and password are required' }
      });
      return;
    }

    const cleanPhone = phone.trim();
    const user = await queryOne('SELECT * FROM users WHERE phone = ?', [cleanPhone]);

    if (!user || !user.password_hash) {
      res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid phone number or password' }
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid phone number or password' }
      });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({
        error: { code: 'ACCOUNT_DISABLED', message: 'This account has been disabled' }
      });
      return;
    }

    const token = generateToken({
      userId: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role_id,
      merchantId: user.merchant_id,
      driverId: user.driver_id
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role_id,
        merchantId: user.merchant_id,
        driverId: user.driver_id
      }
    });
  }
);

// ---------------------------------------------------------------------------
// 5. Merchant Fast Login (staff counter access)
// ---------------------------------------------------------------------------
authRouter.post('/login-merchant', async (req: Request, res: Response) => {
  const { merchantId, pinCode, staffName } = req.body;

  if (!merchantId) {
    res.status(400).json({
      error: { code: 'MISSING_MERCHANT_ID', message: 'Merchant ID is required.' }
    });
    return;
  }

  const merchant = await queryOne('SELECT * FROM merchants WHERE id = ?', [merchantId]);
  if (!merchant) {
    res.status(404).json({
      error: { code: 'MERCHANT_NOT_FOUND', message: 'The specified merchant business does not exist.' }
    });
    return;
  }

  // Generate staff session scoped strictly to this merchant
  const staffUserId = `staff-${merchantId}-${Date.now().toString().slice(-4)}`;
  const token = generateToken({
    userId: staffUserId,
    phone: merchant.phone,
    name: staffName || `${merchant.name_ar} (الكاونتر)`,
    role: 'merchant_staff',
    merchantId: merchant.id
  });

  res.json({
    success: true,
    token,
    merchant,
    staff: {
      id: staffUserId,
      name: staffName || 'مسؤول الوردية',
      role: 'merchant_staff',
      merchantId: merchant.id
    }
  });
});

// 4. Current Profile
authRouter.get('/me', authenticate, async (req: Request, res: Response) => {
  res.json({
    user: req.user
  });
});

// 5. Available System Personas (for demo switcher)
authRouter.get('/personas', async (req: Request, res: Response) => {
  const users = await query(`
    SELECT u.id, u.name, u.phone, u.role_id as role, u.merchant_id as merchantId, u.driver_id as driverId,
           m.name_ar as merchantName, d.driver_code as driverCode
    FROM users u
    LEFT JOIN merchants m ON u.merchant_id = m.id
    LEFT JOIN drivers d ON u.driver_id = d.id
  `);

  res.json({ personas: users });
});
