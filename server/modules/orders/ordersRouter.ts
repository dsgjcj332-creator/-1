import { Router, Request, Response } from 'express';
import { query, queryOne, execute, transaction } from '../../db/database';
import { authenticate } from '../../middleware/auth';
import { OrderStateMachine, OrderLifecycleStatus } from '../../domain/orderStateMachine';
import { FinanceLedger } from '../../domain/financeLedger';

export const ordersRouter = Router();

// 1. List Orders with Tenant/Role Isolation
ordersRouter.get('/', authenticate, async (req: Request, res: Response) => {
  const { status, merchantId, customerId, search } = req.query;
  let sql = 'SELECT * FROM orders WHERE 1=1';
  const params: any[] = [];

  // Enforce Merchant Isolation
  if (req.user?.role === 'merchant_owner' || req.user?.role === 'merchant_staff') {
    sql += ' AND merchant_id = ?';
    params.push(req.user.merchantId);
  } else if (merchantId) {
    sql += ' AND merchant_id = ?';
    params.push(merchantId);
  }

  // Enforce Customer Isolation
  if (req.user?.role === 'customer') {
    sql += ' AND customer_id = ?';
    params.push(req.user.userId);
  } else if (customerId) {
    sql += ' AND customer_id = ?';
    params.push(customerId);
  }

  if (status && status !== 'all') {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    const q = `%${String(search).trim()}%`;
    sql += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
    params.push(q, q, q);
  }

  sql += ' ORDER BY created_at DESC';

  const orders = await query(sql, params);

  // Attach items count, preview, and photos
  for (const ord of orders) {
    const items = await query('SELECT * FROM order_items WHERE order_id = ?', [ord.id]);
    ord.items = items;
    ord.itemsCount = items.reduce((s: number, i: any) => s + (i.received_quantity ?? i.quantity), 0);

    const discrepancy = await queryOne('SELECT * FROM price_adjustments WHERE order_id = ?', [ord.id]);
    ord.discrepancy = discrepancy;

    const rawPhotos = await query('SELECT * FROM order_item_photos WHERE order_id = ? ORDER BY created_at ASC', [ord.id]);
    ord.photos = rawPhotos.map((p: any, idx: number) => ({
      pieceIndex: idx + 1,
      garmentId: p.order_item_id || undefined,
      garmentNameAr: p.notes || 'قطعة ملابس',
      garmentNameEn: 'Garment Piece',
      photoUrl: p.photo_url,
      tag: p.photo_type || 'توثيق العميل',
      notes: p.notes || undefined
    }));
  }

  res.json({ orders });
});

// 2. Get Single Order Details
ordersRouter.get('/:id', authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await queryOne('SELECT * FROM orders WHERE id = ?', [id]);

  if (!order) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
    return;
  }

  // Isolation check
  if (req.user?.role === 'merchant_owner' || req.user?.role === 'merchant_staff') {
    if (order.merchant_id !== req.user.merchantId) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied to this merchant order' } });
      return;
    }
  }

  if (req.user?.role === 'customer' && order.customer_id !== req.user.userId) {
    res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied to this order' } });
    return;
  }

  const items = await query('SELECT * FROM order_items WHERE order_id = ?', [id]);
  const rawPhotos = await query('SELECT * FROM order_item_photos WHERE order_id = ? ORDER BY created_at ASC', [id]);
  const photos = rawPhotos.map((p: any, idx: number) => ({
    pieceIndex: idx + 1,
    garmentId: p.order_item_id || undefined,
    garmentNameAr: p.notes || 'قطعة ملابس',
    garmentNameEn: 'Garment Piece',
    photoUrl: p.photo_url,
    tag: p.photo_type || 'توثيق العميل',
    notes: p.notes || undefined
  }));
  const history = await query('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY timestamp ASC', [id]);
  const discrepancy = await queryOne('SELECT * FROM price_adjustments WHERE order_id = ?', [id]);
  const deliveryTasks = await query('SELECT * FROM delivery_tasks WHERE order_id = ?', [id]);

  res.json({
    order: {
      ...order,
      items,
      photos,
      statusHistory: history,
      discrepancy,
      deliveryTasks
    }
  });
});

// 3. Create Order (Customer)
ordersRouter.post('/', authenticate, async (req: Request, res: Response) => {
  const {
    merchantId,
    pickupAddress,
    deliveryAddress,
    city,
    neighborhood,
    items,
    photos,
    paymentMethod,
    specialInstructions
  } = req.body;

  if (!merchantId || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({
      error: { code: 'INVALID_ORDER', message: 'Merchant ID and at least one laundry item are required' }
    });
    return;
  }

  const merchant = await queryOne('SELECT * FROM merchants WHERE id = ?', [merchantId]);
  if (!merchant) {
    res.status(404).json({ error: { code: 'MERCHANT_NOT_FOUND', message: 'Selected merchant not found' } });
    return;
  }

  const orderId = `ord-${Date.now()}`;
  const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let laundrySubtotal = 0;
  for (const it of items) {
    laundrySubtotal += Number(it.unitPrice || 0) * Number(it.quantity || 1);
  }

  const financials = FinanceLedger.calculateOrderFinancials({
    laundrySubtotal,
    commissionRate: merchant.commission_rate || 0.08,
    platformFeeEgp: 20,
    platformFeePayer: merchant.service_fee_payer || 'customer',
    deliveryFeeCustomer: 25,
    driverPayoutPickup: 20,
    driverPayoutDelivery: 20
  });

  await transaction(async () => {
    // Insert order
    await execute(`
      INSERT INTO orders (
        id, order_number, customer_id, customer_name, customer_phone,
        merchant_id, merchant_name, city, neighborhood,
        pickup_address, delivery_address, status, payment_status, payment_method,
        cod_amount, laundry_subtotal, adjustments_total, commission_rate, commission_amount,
        platform_fee, platform_fee_payer, delivery_fee_customer,
        driver_payout_pickup, driver_payout_delivery, customer_total_paid,
        merchant_payable_amount, special_instructions
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'awaiting_laundry_confirmation', 'cod_pending', ?,
        ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `, [
      orderId, orderNumber, req.user?.userId || 'cust-anon', req.user?.name || 'عميل عالسريع', req.user?.phone || '01000000000',
      merchant.id, merchant.name_ar, city || merchant.city, neighborhood || merchant.district,
      pickupAddress || 'عنوان العميل', deliveryAddress || pickupAddress || 'عنوان العميل', paymentMethod || 'cash_on_delivery',
      financials.customerTotalPaid, // cod_amount = total to collect on delivery
      financials.grossLaundryVolume, financials.commissionAmount ? 0.08 : 0.08, financials.commissionAmount,
      financials.platformFee, financials.platformFeePayer, financials.deliveryFeeCustomer,
      20, 20, financials.customerTotalPaid, financials.merchantPayableAmount, specialInstructions || null
    ]);

    // Insert order items
    for (const [idx, it] of items.entries()) {
      await execute(`
        INSERT INTO order_items (
          id, order_id, service_id, name_ar, name_en, service_type, quantity, unit_price, subtotal, fragrance, starch, packaging, customer_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        `item-${orderId}-${idx + 1}`, orderId, it.serviceId || null,
        it.nameAr || it.name || 'قطعة غسيل', it.nameEn || 'Laundry Item',
        it.serviceType || 'wash_iron', it.quantity || 1, it.unitPrice || 25,
        (it.unitPrice || 25) * (it.quantity || 1), it.fragrance || null,
        it.starch || null, it.packaging || null, it.customerNotes || null
      ]);
    }

    // Insert garment photos if provided
    if (photos && Array.isArray(photos)) {
      for (const [pIdx, p] of photos.entries()) {
        const photoUrl = p.photoUrl || p.photo_url;
        if (!photoUrl) continue;
        await execute(`
          INSERT INTO order_item_photos (
            id, order_id, order_item_id, uploaded_by_user_id, photo_type, storage_key, photo_url, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          `photo-${orderId}-${pIdx + 1}`,
          orderId,
          p.garmentId || null,
          req.user?.userId || 'cust-anon',
          p.tag || 'customer_reference',
          `orders/${orderId}/photo-${pIdx + 1}`,
          photoUrl,
          p.garmentNameAr || p.notes || null
        ]);
      }
    }

    // Insert history record
    await execute(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, actor_name, actor_role, note)
      VALUES (?, ?, NULL, 'awaiting_laundry_confirmation', ?, ?, 'Order submitted through application')
    `, [`hist-${Date.now()}`, orderId, req.user?.name || 'Customer', req.user?.role || 'customer']);

    // Create Pickup Delivery Task
    await execute(`
      INSERT INTO delivery_tasks (
        id, job_reference, order_id, order_number, job_type,
        origin_name, origin_address, origin_phone,
        destination_name, destination_address, destination_phone,
        service_zone, scheduled_window, status
      ) VALUES (
        ?, ?, ?, ?, 'pickup',
        ?, ?, ?,
        ?, ?, ?,
        ?, 'خلال ساعتين', 'awaiting_assignment'
      )
    `, [
      `job-pk-${Date.now()}`, `DLV-PK-${orderNumber.slice(-4)}`, orderId, orderNumber,
      req.user?.name || 'العميل', pickupAddress || 'العنوان', req.user?.phone || '01000000000',
      merchant.name_ar, merchant.address, merchant.phone,
      city || merchant.city
    ]);
  });

  const createdOrder = await queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
  const createdPhotos = await query('SELECT * FROM order_item_photos WHERE order_id = ? ORDER BY created_at ASC', [orderId]);
  res.status(201).json({
    success: true,
    order: {
      ...createdOrder,
      photos: createdPhotos.map((p: any, idx: number) => ({
        pieceIndex: idx + 1,
        garmentId: p.order_item_id || undefined,
        garmentNameAr: p.notes || 'قطعة ملابس',
        garmentNameEn: 'Garment Piece',
        photoUrl: p.photo_url,
        tag: p.photo_type || 'توثيق العميل',
        notes: p.notes || undefined
      }))
    }
  });
});

// 4. Update Order Lifecycle Status
ordersRouter.put('/:id/status', authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const order = await queryOne('SELECT * FROM orders WHERE id = ?', [id]);
  if (!order) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
    return;
  }

  const actorRole = req.user?.role || 'platform_admin';
  const validation = OrderStateMachine.canTransition(order.status as OrderLifecycleStatus, status as OrderLifecycleStatus, actorRole);

  if (!validation.allowed) {
    res.status(400).json({
      error: { code: 'INVALID_TRANSITION', message: validation.reason }
    });
    return;
  }

  await transaction(async () => {
    await execute(`
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, id]);

    await execute(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, actor_name, actor_role, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      `hist-${Date.now()}`, id, order.status, status,
      req.user?.name || 'System Operator', actorRole, note || null
    ]);

    // If order reaches delivered, post double-entry ledger entries!
    if (status === 'delivered') {
      const financials = FinanceLedger.calculateOrderFinancials({
        laundrySubtotal: order.laundry_subtotal,
        adjustmentsTotal: order.adjustments_total,
        commissionRate: order.commission_rate,
        platformFeeEgp: order.platform_fee,
        platformFeePayer: order.platform_fee_payer,
        deliveryFeeCustomer: order.delivery_fee_customer,
        driverPayoutPickup: order.driver_payout_pickup,
        driverPayoutDelivery: order.driver_payout_delivery
      });
      await FinanceLedger.postOrderDeliveryEntries(id, financials);
    }
  });

  const updatedOrder = await queryOne('SELECT * FROM orders WHERE id = ?', [id]);
  res.json({ success: true, order: updatedOrder });
});
