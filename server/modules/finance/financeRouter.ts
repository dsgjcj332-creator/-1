import { Router, Request, Response } from 'express';
import { query, queryOne, execute, transaction } from '../../db/database';
import { authenticate, requireRole } from '../../middleware/auth';

export const financeRouter = Router();

// 1. Get Chart of Accounts & Balances
financeRouter.get('/accounts', authenticate, requireRole('platform_admin', 'operations_manager'), async (req: Request, res: Response) => {
  const accounts = await query('SELECT * FROM ledger_accounts ORDER BY account_code ASC');
  res.json({ accounts });
});

// 2. Get Auditable Journal Entries
financeRouter.get('/ledger', authenticate, requireRole('platform_admin', 'operations_manager'), async (req: Request, res: Response) => {
  const { orderId } = req.query;
  let sql = `
    SELECT e.*, a.account_name, a.account_code, a.account_type
    FROM ledger_entries e
    JOIN ledger_accounts a ON e.account_id = a.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (orderId) {
    sql += ' AND e.order_id = ?';
    params.push(orderId);
  }

  sql += ' ORDER BY e.created_at DESC';

  const entries = await query(sql, params);

  const totalDebits = entries.filter((e: any) => e.entry_type === 'debit').reduce((s: number, e: any) => s + Number(e.amount_egp), 0);
  const totalCredits = entries.filter((e: any) => e.entry_type === 'credit').reduce((s: number, e: any) => s + Number(e.amount_egp), 0);

  res.json({
    entries,
    totals: {
      debitsEgp: totalDebits,
      creditsEgp: totalCredits,
      isBalanced: totalDebits === totalCredits
    }
  });
});

// 3. List Settlements
financeRouter.get('/settlements', authenticate, async (req: Request, res: Response) => {
  const { merchantId } = req.query;
  let sql = `
    SELECT s.*, m.name_ar as merchant_name, m.city, m.payout_method, m.payout_details
    FROM settlement_statements s
    JOIN merchants m ON s.merchant_id = m.id
    WHERE 1=1
  `;
  const params: any[] = [];

  // Merchant isolation
  if (req.user?.role === 'merchant_owner' || req.user?.role === 'merchant_staff') {
    sql += ' AND s.merchant_id = ?';
    params.push(req.user.merchantId);
  } else if (merchantId) {
    sql += ' AND s.merchant_id = ?';
    params.push(merchantId);
  }

  sql += ' ORDER BY s.generated_at DESC';

  const settlements = await query(sql, params);
  res.json({ settlements });
});

// 4. Generate Settlement Batch (Admin / Finance Operator)
financeRouter.post('/settlements/generate', authenticate, requireRole('platform_admin', 'operations_manager'), async (req: Request, res: Response) => {
  const { merchantId, periodStart, periodEnd } = req.body;

  if (!merchantId) {
    res.status(400).json({ error: { code: 'MISSING_MERCHANT', message: 'merchantId is required' } });
    return;
  }

  const merchant = await queryOne('SELECT * FROM merchants WHERE id = ?', [merchantId]);
  if (!merchant) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Merchant not found' } });
    return;
  }

  // Find unsettled orders for this merchant
  const unsettledOrders = await query(`
    SELECT * FROM orders
    WHERE merchant_id = ? AND is_settled = 0 AND status IN ('delivered', 'completed')
  `, [merchantId]);

  if (unsettledOrders.length === 0) {
    res.status(400).json({
      error: { code: 'NO_UNSETTLED_ORDERS', message: 'No delivered unsettled orders found for this merchant.' }
    });
    return;
  }

  const stmtId = `stmt-${Date.now()}`;
  const stmtNum = `STMT-${merchant.city.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let gross = 0;
  let comm = 0;
  let net = 0;

  unsettledOrders.forEach((o: any) => {
    const orderGross = o.laundry_subtotal + (o.adjustments_total || 0);
    const orderComm = o.commission_amount || Math.round(orderGross * (o.commission_rate || 0.08));
    gross += orderGross;
    comm += orderComm;
    net += (orderGross - orderComm);
  });

  await transaction(async () => {
    await execute(`
      INSERT INTO settlement_statements (
        id, statement_number, merchant_id, period_start, period_end,
        total_orders_count, gross_laundry_volume_egp, commission_deducted_egp,
        net_payable_egp, status, payout_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'calculated', ?)
    `, [
      stmtId, stmtNum, merchantId,
      periodStart || new Date(Date.now() - 7 * 86400000).toISOString(),
      periodEnd || new Date().toISOString(),
      unsettledOrders.length, gross, comm, net, merchant.payout_method
    ]);

    // Mark orders as settled
    for (const o of unsettledOrders) {
      await execute('UPDATE orders SET is_settled = 1, settlement_id = ? WHERE id = ?', [stmtId, o.id]);
    }
  });

  const statement = await queryOne('SELECT * FROM settlement_statements WHERE id = ?', [stmtId]);
  res.status(201).json({ success: true, statement });
});

// 5. Approve & Pay Settlement (Admin)
financeRouter.put('/settlements/:id/payout', authenticate, requireRole('platform_admin', 'operations_manager'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { payoutReference } = req.body;

  const stmt = await queryOne('SELECT * FROM settlement_statements WHERE id = ?', [id]);
  if (!stmt) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Settlement statement not found' } });
    return;
  }

  await execute(`
    UPDATE settlement_statements
    SET status = 'paid', payout_reference = ?, paid_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [payoutReference || `TX-INSTAPAY-${Date.now().toString().slice(-6)}`, id]);

  const updated = await queryOne('SELECT * FROM settlement_statements WHERE id = ?', [id]);
  res.json({ success: true, statement: updated });
});
