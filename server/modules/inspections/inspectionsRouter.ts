import { Router, Request, Response } from 'express';
import { query, queryOne, execute, transaction } from '../../db/database';
import { authenticate } from '../../middleware/auth';
import { FinanceLedger } from '../../domain/financeLedger';

export const inspectionsRouter = Router();

// 1. Record Intake Inspection (Merchant Counter Staff)
inspectionsRouter.post('/:orderId/intake', authenticate, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { inspectedItems, discrepancyReason, extraChargeEgp, requiresCustomerApproval } = req.body;

  const order = await queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (!order) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
    return;
  }

  // Isolation check
  if (req.user?.role === 'merchant_owner' || req.user?.role === 'merchant_staff') {
    if (order.merchant_id !== req.user.merchantId) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied: not your laundry order' } });
      return;
    }
  }

  let calculatedRevisedSubtotal = 0;

  await transaction(async () => {
    // Update inspected items
    if (Array.isArray(inspectedItems)) {
      for (const it of inspectedItems) {
        await execute(`
          UPDATE order_items
          SET received_quantity = ?,
              stain_damage_notes = ?,
              condition_status = COALESCE(?, condition_status)
          WHERE id = ? AND order_id = ?
        `, [
          it.receivedQty !== undefined ? it.receivedQty : 1,
          it.stainsDamageNote || null,
          it.conditionStatus || 'good',
          it.itemId,
          orderId
        ]);

        calculatedRevisedSubtotal += Number(it.receivedQty || 0) * Number(it.unitPrice || 0);
      }
    } else {
      calculatedRevisedSubtotal = order.laundry_subtotal;
    }

    const additionalCharge = Number(extraChargeEgp || 0);
    const finalRevisedSubtotal = calculatedRevisedSubtotal + additionalCharge;
    const diffEgp = finalRevisedSubtotal - order.laundry_subtotal;

    // Discrepancy / price adjustment handling
    if (diffEgp !== 0 || additionalCharge > 0 || requiresCustomerApproval) {
      const adjId = `adj-${Date.now()}`;
      await execute(`
        INSERT INTO price_adjustments (
          id, order_id, reported_by, original_subtotal, revised_subtotal, difference_egp, reason, customer_approval_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        adjId, orderId, req.user?.name || 'Laundry Staff', order.laundry_subtotal,
        finalRevisedSubtotal, diffEgp, discrepancyReason || 'تعديل فحص الكاونتر',
        requiresCustomerApproval || diffEgp > 0 ? 'pending' : 'not_required'
      ]);

      const nextStatus = requiresCustomerApproval || diffEgp > 0 ? 'awaiting_customer_approval' : 'processing';
      await execute(`
        UPDATE orders
        SET status = ?, adjustments_total = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [nextStatus, diffEgp > 0 ? diffEgp : 0, orderId]);

      await execute(`
        INSERT INTO order_status_history (id, order_id, from_status, to_status, actor_name, actor_role, note)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        `hist-${Date.now()}`, orderId, order.status, nextStatus,
        req.user?.name || 'Laundry Counter', req.user?.role || 'merchant_staff',
        `تم تسجيل فحص الكاونتر (فارق السعر: ${diffEgp} ج.م)`
      ]);
    } else {
      // Clean match -> start processing
      await execute(`
        UPDATE orders
        SET status = 'processing', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [orderId]);

      await execute(`
        INSERT INTO order_status_history (id, order_id, from_status, to_status, actor_name, actor_role, note)
        VALUES (?, ?, ?, 'processing', ?, ?, 'تمت مطابقة الملابس والبدء في دورة الغسيل')
      `, [
        `hist-${Date.now()}`, orderId, order.status,
        req.user?.name || 'Laundry Counter', req.user?.role || 'merchant_staff'
      ]);
    }
  });

  const updatedOrder = await queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
  res.json({ success: true, order: updatedOrder });
});

// 2. Customer Price Approval / Rejection
inspectionsRouter.post('/:orderId/approve-price', authenticate, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { approved } = req.body;

  const order = await queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (!order) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
    return;
  }

  const adj = await queryOne('SELECT * FROM price_adjustments WHERE order_id = ? ORDER BY detected_at DESC LIMIT 1', [orderId]);
  if (!adj) {
    res.status(400).json({ error: { code: 'NO_ADJUSTMENT', message: 'No price adjustment pending for this order' } });
    return;
  }

  await transaction(async () => {
    const approvalStatus = approved ? 'approved' : 'rejected';
    await execute(`
      UPDATE price_adjustments
      SET customer_approval_status = ?, customer_responded_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [approvalStatus, adj.id]);

    const nextStatus = approved ? 'processing' : 'cancelled';

    // Recalculate totals if approved
    if (approved) {
      const revisedSubtotal = adj.revised_subtotal;
      const commAmount = Math.round(revisedSubtotal * (order.commission_rate || 0.08));
      const payable = revisedSubtotal - commAmount;
      const totalPaid = revisedSubtotal + order.delivery_fee_customer + (order.platform_fee_payer === 'customer' ? order.platform_fee : 0);

      await execute(`
        UPDATE orders
        SET status = ?, laundry_subtotal = ?, commission_amount = ?,
            merchant_payable_amount = ?, customer_total_paid = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [nextStatus, revisedSubtotal, commAmount, payable, totalPaid, orderId]);
    } else {
      await execute(`
        UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `, [orderId]);
    }

    await execute(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, actor_name, actor_role, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      `hist-${Date.now()}`, orderId, order.status, nextStatus,
      req.user?.name || 'Customer', req.user?.role || 'customer',
      approved ? 'العميل وافق على فرق السعر' : 'العميل رفض فرق السعر وتم إلغاء الطلب'
    ]);
  });

  const updatedOrder = await queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
  res.json({ success: true, order: updatedOrder });
});

// 3. Record Garment Photo Metadata
inspectionsRouter.post('/:orderId/photos', authenticate, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { orderItemId, photoType, photoUrl, notes } = req.body;

  if (!photoType || !photoUrl) {
    res.status(400).json({ error: { code: 'MISSING_PHOTO_DATA', message: 'photoType and photoUrl are required' } });
    return;
  }

  const photoId = `photo-${Date.now()}`;
  const storageKey = `orders/${orderId}/${photoType}-${Date.now()}.jpg`;

  await execute(`
    INSERT INTO order_item_photos (
      id, order_id, order_item_id, uploaded_by_user_id, photo_type, storage_key, photo_url, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    photoId, orderId, orderItemId || null, req.user?.userId || 'usr-anon',
    photoType, storageKey, photoUrl, notes || null
  ]);

  const created = await queryOne('SELECT * FROM order_item_photos WHERE id = ?', [photoId]);
  res.status(201).json({ success: true, photo: created });
});
