import { Router, Request, Response } from 'express';
import { query, queryOne, execute, transaction } from '../../db/database';
import { authenticate, requireRole } from '../../middleware/auth';

export const deliveryRouter = Router();

// 1. List Delivery Tasks
deliveryRouter.get('/tasks', authenticate, async (req: Request, res: Response) => {
  const { status, driverId, zone, jobType } = req.query;
  let sql = 'SELECT * FROM delivery_tasks WHERE 1=1';
  const params: any[] = [];

  // Driver isolation: driver can only see tasks assigned to them
  if (req.user?.role === 'driver') {
    sql += ' AND assigned_driver_id = ?';
    params.push(req.user.driverId || req.user.userId);
  } else if (driverId) {
    sql += ' AND assigned_driver_id = ?';
    params.push(driverId);
  }

  if (status && status !== 'all') {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (zone) {
    sql += ' AND service_zone = ?';
    params.push(zone);
  }

  if (jobType) {
    sql += ' AND job_type = ?';
    params.push(jobType);
  }

  sql += ' ORDER BY created_at DESC';

  const tasks = await query(sql, params);
  res.json({ tasks });
});

// 2. Assign Driver to Task (Dispatcher / Admin)
deliveryRouter.post('/tasks/:id/assign', authenticate, requireRole('dispatcher', 'platform_admin', 'operations_manager'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { driverId } = req.body;

  const task = await queryOne('SELECT * FROM delivery_tasks WHERE id = ?', [id]);
  if (!task) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Delivery task not found' } });
    return;
  }

  const driver = await queryOne('SELECT * FROM drivers WHERE id = ?', [driverId]);
  if (!driver) {
    res.status(404).json({ error: { code: 'DRIVER_NOT_FOUND', message: 'Driver not found' } });
    return;
  }

  await execute(`
    UPDATE delivery_tasks
    SET assigned_driver_id = ?, status = 'assigned', assigned_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [driverId, id]);

  const updated = await queryOne('SELECT * FROM delivery_tasks WHERE id = ?', [id]);
  res.json({ success: true, task: updated, driver });
});

// 3. Driver Updates Task Status (En route, Arrived, Completed with Proof & COD)
deliveryRouter.put('/tasks/:id/status', authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, proofNote, proofPhotoUrl, cashCollected } = req.body;

  const task = await queryOne('SELECT * FROM delivery_tasks WHERE id = ?', [id]);
  if (!task) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Delivery task not found' } });
    return;
  }

  await transaction(async () => {
    const isComplete = status === 'completed';
    await execute(`
      UPDATE delivery_tasks
      SET status = ?,
          proof_note = COALESCE(?, proof_note),
          proof_photo_url = COALESCE(?, proof_photo_url),
          cash_collected = COALESCE(?, cash_collected),
          completed_at = ${isComplete ? 'CURRENT_TIMESTAMP' : 'completed_at'}
      WHERE id = ?
    `, [status, proofNote || null, proofPhotoUrl || null, cashCollected !== undefined ? (cashCollected ? 1 : 0) : null, id]);

    // If driver collected cash, increase driver's cash in hand
    if (cashCollected && task.cash_to_collect_egp > 0 && task.assigned_driver_id) {
      await execute(`
        UPDATE drivers
        SET cash_in_hand_egp = cash_in_hand_egp + ?,
            completed_jobs_count = completed_jobs_count + 1
        WHERE id = ?
      `, [task.cash_to_collect_egp, task.assigned_driver_id]);
    }

    // Sync order state machine if pickup is completed -> received_at_laundry
    if (isComplete && task.job_type === 'pickup') {
      await execute(`
        UPDATE orders
        SET status = 'inspection_required', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [task.order_id]);

      await execute(`
        INSERT INTO order_status_history (id, order_id, from_status, to_status, actor_name, actor_role, note)
        VALUES (?, ?, 'awaiting_pickup', 'inspection_required', ?, 'driver', 'تم استلام الكيس وإيداعه بمقر المغسلة')
      `, [`hist-${Date.now()}`, task.order_id, req.user?.name || 'Driver']);
    }

    // If return delivery is completed -> delivered
    if (isComplete && task.job_type === 'return_delivery') {
      await execute(`
        UPDATE orders
        SET status = 'delivered', payment_status = 'paid', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [task.order_id]);

      await execute(`
        INSERT INTO order_status_history (id, order_id, from_status, to_status, actor_name, actor_role, note)
        VALUES (?, ?, 'out_for_delivery', 'delivered', ?, 'driver', 'تم تسليم الملابس النظيفة للعميل')
      `, [`hist-${Date.now()}`, task.order_id, req.user?.name || 'Driver']);
    }
  });

  const updated = await queryOne('SELECT * FROM delivery_tasks WHERE id = ?', [id]);
  res.json({ success: true, task: updated });
});

// 4. List Drivers
deliveryRouter.get('/drivers', authenticate, async (req: Request, res: Response) => {
  const drivers = await query('SELECT * FROM drivers ORDER BY name ASC');
  res.json({ drivers });
});
