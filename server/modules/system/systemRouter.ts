import { Router, Request, Response } from 'express';
import { query, queryOne, execute } from '../../db/database';
import { authenticate, requireRole } from '../../middleware/auth';

export const systemRouter = Router();

// 1. Health & Readiness Probe
systemRouter.get('/health', async (req: Request, res: Response) => {
  try {
    const dbCheck = await queryOne('SELECT 1 as is_alive');
    res.json({
      status: 'healthy',
      service: 'alaelsaree-backend',
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbCheck?.is_alive === 1 ? 'connected' : 'degraded',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message
    });
  }
});

// 2. Get Platform Settings
systemRouter.get('/settings', async (req: Request, res: Response) => {
  const rows = await query('SELECT * FROM platform_settings');
  const settings: Record<string, string> = {};
  rows.forEach((r: any) => {
    settings[r.key] = r.value;
  });
  res.json({ settings });
});

// 3. Update Platform Setting (Admin)
systemRouter.put('/settings', authenticate, requireRole('platform_admin'), async (req: Request, res: Response) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'key and value are required' } });
    return;
  }

  await execute(`
    INSERT INTO platform_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `, [key, String(value)]);

  res.json({ success: true, key, value });
});

// 4. Audit Logs
systemRouter.get('/audit-logs', authenticate, requireRole('platform_admin', 'operations_manager'), async (req: Request, res: Response) => {
  const logs = await query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
  res.json({ logs });
});

// 5. Support Tickets
systemRouter.get('/support-tickets', authenticate, requireRole('platform_admin', 'operations_manager'), async (req: Request, res: Response) => {
  const tickets = await query('SELECT * FROM support_tickets ORDER BY created_at DESC');
  res.json({ tickets });
});
