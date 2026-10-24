import { Router, Request, Response } from 'express';
import { query, queryOne, execute } from '../../db/database';
import { authenticate } from '../../middleware/auth';

export const customersRouter = Router();

// 1. Get Customer Addresses
customersRouter.get('/addresses', authenticate, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const customer = await queryOne('SELECT id FROM customer_profiles WHERE user_id = ?', [userId]);

  if (!customer) {
    res.json({ addresses: [] });
    return;
  }

  const addresses = await query('SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC', [customer.id]);
  res.json({ addresses });
});

// 2. Add Address
customersRouter.post('/addresses', authenticate, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  let customer = await queryOne('SELECT id FROM customer_profiles WHERE user_id = ?', [userId]);

  if (!customer) {
    const custId = `cust-${Date.now()}`;
    await execute('INSERT INTO customer_profiles (id, user_id, full_name, phone) VALUES (?, ?, ?, ?)', [
      custId, userId, req.user?.name || 'Customer', req.user?.phone || '01000000000'
    ]);
    customer = { id: custId };
  }

  const { title, governorate, city, district, street, buildingNo, floorNo, apartmentNo, landmark, isDefault } = req.body;
  const addrId = `addr-${Date.now()}`;

  if (isDefault) {
    await execute('UPDATE addresses SET is_default = 0 WHERE customer_id = ?', [customer.id]);
  }

  await execute(`
    INSERT INTO addresses (
      id, customer_id, title, governorate, city, district, street,
      building_no, floor_no, apartment_no, landmark, is_default
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    addrId, customer.id, title || 'المنزل', governorate || 'الشرقية', city || 'الزقازيق',
    district || 'حي الجامعة', street || 'الشارع الرئيسي',
    buildingNo || null, floorNo || null, apartmentNo || null, landmark || null,
    isDefault ? 1 : 0
  ]);

  const created = await queryOne('SELECT * FROM addresses WHERE id = ?', [addrId]);
  res.status(201).json({ success: true, address: created });
});

// 3. Delete Address
customersRouter.delete('/addresses/:id', authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;
  await execute('DELETE FROM addresses WHERE id = ?', [id]);
  res.json({ success: true, message: 'Address removed' });
});
