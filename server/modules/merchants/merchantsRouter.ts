import { Router, Request, Response } from 'express';
import { query, queryOne, execute } from '../../db/database';
import { authenticate, requireRole, requireMerchantIsolation } from '../../middleware/auth';

export const merchantsRouter = Router();

// 1. List Merchants
merchantsRouter.get('/', async (req: Request, res: Response) => {
  const { city, status } = req.query;
  let sql = 'SELECT * FROM merchants WHERE 1=1';
  const params: any[] = [];

  if (city) {
    sql += ' AND city = ?';
    params.push(city);
  }

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY rating DESC';

  const merchants = await query(sql, params);
  res.json({ merchants });
});

// 2. Get Single Merchant Details
merchantsRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const merchant = await queryOne('SELECT * FROM merchants WHERE id = ?', [id]);

  if (!merchant) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Merchant not found' } });
    return;
  }

  res.json({ merchant });
});

// 3. Update Merchant Operational Status & Capacity (Protected)
merchantsRouter.put('/:id/status', authenticate, requireMerchantIsolation, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isAcceptingOrders, capacityBagsPerDay, activeHours } = req.body;

  const updates: string[] = [];
  const params: any[] = [];

  if (isAcceptingOrders !== undefined) {
    updates.push('is_accepting_orders = ?');
    params.push(isAcceptingOrders ? 1 : 0);
  }

  if (capacityBagsPerDay !== undefined) {
    updates.push('capacity_bags_per_day = ?');
    params.push(Number(capacityBagsPerDay));
  }

  if (activeHours !== undefined) {
    updates.push('active_hours = ?');
    params.push(String(activeHours));
  }

  if (updates.length === 0) {
    res.status(400).json({ error: { code: 'NO_UPDATES', message: 'No fields provided for update' } });
    return;
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  params.push(id);

  await execute(`UPDATE merchants SET ${updates.join(', ')} WHERE id = ?`, params);

  const updated = await queryOne('SELECT * FROM merchants WHERE id = ?', [id]);
  res.json({ success: true, merchant: updated });
});

// 4. Merchant Isolated Financial Summary
merchantsRouter.get('/:id/financials', authenticate, requireMerchantIsolation, async (req: Request, res: Response) => {
  const { id } = req.params;

  const orders = await query(`
    SELECT id, order_number, laundry_subtotal, adjustments_total,
           commission_rate, commission_amount, status, payment_method, is_settled
    FROM orders
    WHERE merchant_id = ?
  `, [id]);

  let totalGross = 0;
  let totalCommission = 0;
  let totalNet = 0;

  orders.forEach(o => {
    const gross = o.laundry_subtotal + (o.adjustments_total || 0);
    const comm = o.commission_amount || Math.round(gross * o.commission_rate);
    const net = gross - comm;

    totalGross += gross;
    totalCommission += comm;
    totalNet += net;
  });

  const merchant = await queryOne('SELECT * FROM merchants WHERE id = ?', [id]);

  res.json({
    merchantId: id,
    merchantName: merchant?.name_ar,
    ordersCount: orders.length,
    grossLaundryVolumeEgp: totalGross,
    commissionDeductedEgp: totalCommission,
    netPayableEgp: totalNet,
    payoutMethod: merchant?.payout_method,
    payoutDetails: merchant?.payout_details,
    orders
  });
});
