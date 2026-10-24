import { Router, Request, Response } from 'express';
import { query, queryOne, execute } from '../../db/database';
import { authenticate, requireMerchantIsolation } from '../../middleware/auth';

export const catalogRouter = Router();

// 1. List Service Categories & Base Catalog
catalogRouter.get('/', async (req: Request, res: Response) => {
  const categories = await query('SELECT * FROM service_categories ORDER BY display_order ASC');
  const services = await query(`
    SELECT s.*, c.name_ar as category_name_ar, c.name_en as category_name_en
    FROM services s
    JOIN service_categories c ON s.category_id = c.id
    WHERE s.is_active = 1
  `);

  res.json({ categories, services });
});

// 2. Get Merchant Specific Catalog with Availability & Overrides
catalogRouter.get('/merchant/:merchantId', async (req: Request, res: Response) => {
  const { merchantId } = req.params;

  const services = await query(`
    SELECT s.id, s.name_ar, s.name_en, s.category_id, s.est_duration_hours,
           COALESCE(mp.wash_iron_price, s.base_wash_iron_price) as wash_iron_price,
           COALESCE(mp.dry_clean_price, s.base_dry_clean_price) as dry_clean_price,
           COALESCE(mp.iron_only_price, s.base_iron_only_price) as iron_only_price,
           COALESCE(mp.is_available, 1) as is_available
    FROM services s
    LEFT JOIN merchant_service_prices mp ON s.id = mp.service_id AND mp.merchant_id = ?
    WHERE s.is_active = 1
  `, [merchantId]);

  res.json({ merchantId, services });
});

// 3. Update Merchant Price / Availability
catalogRouter.put('/merchant/:merchantId/price', authenticate, requireMerchantIsolation, async (req: Request, res: Response) => {
  const { merchantId } = req.params;
  const { serviceId, washIronPrice, dryCleanPrice, ironOnlyPrice, isAvailable } = req.body;

  if (!serviceId) {
    res.status(400).json({ error: { code: 'MISSING_SERVICE_ID', message: 'serviceId is required' } });
    return;
  }

  const existing = await queryOne(`
    SELECT * FROM merchant_service_prices WHERE merchant_id = ? AND service_id = ?
  `, [merchantId, serviceId]);

  if (existing) {
    await execute(`
      UPDATE merchant_service_prices
      SET wash_iron_price = COALESCE(?, wash_iron_price),
          dry_clean_price = COALESCE(?, dry_clean_price),
          iron_only_price = COALESCE(?, iron_only_price),
          is_available = COALESCE(?, is_available),
          updated_at = CURRENT_TIMESTAMP
      WHERE merchant_id = ? AND service_id = ?
    `, [washIronPrice, dryCleanPrice, ironOnlyPrice, isAvailable !== undefined ? (isAvailable ? 1 : 0) : null, merchantId, serviceId]);
  } else {
    await execute(`
      INSERT INTO merchant_service_prices (
        id, merchant_id, service_id, wash_iron_price, dry_clean_price, iron_only_price, is_available
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      `msp-${Date.now()}`, merchantId, serviceId,
      washIronPrice || 25, dryCleanPrice || null, ironOnlyPrice || null,
      isAvailable !== undefined ? (isAvailable ? 1 : 0) : 1
    ]);
  }

  res.json({ success: true, message: 'Price override updated successfully' });
});
