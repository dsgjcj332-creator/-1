import { Router, Request, Response } from 'express';
import { query, queryOne, execute } from '../../db/database';
import { authenticate, requireRole } from '../../middleware/auth';
import { rateLimiter } from '../../middleware/rateLimiter';

export const applicationsRouter = Router();

// 1. Submit Application from Public Marketing Landing Page (Port 1000)
applicationsRouter.post(
  '/',
  rateLimiter({ windowMs: 60 * 1000, max: 10, message: 'Too many submissions. Please wait.' }),
  async (req: Request, res: Response) => {
    const {
      applicantName,
      businessName,
      mobile,
      governorate,
      city,
      address,
      services,
      operatingStatus,
      contactMethod,
      email,
      whatsapp,
      website,
      capacity,
      notes,
      privacyConsent
    } = req.body;

    if (!applicantName || !businessName || !mobile || !governorate || !city) {
      res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Required fields: applicantName, businessName, mobile, governorate, city.' }
      });
      return;
    }

    const appId = `app-${Date.now()}`;
    const refNum = `APP-${city.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const servicesJson = Array.isArray(services) ? JSON.stringify(services) : (services || '[]');

    await execute(`
      INSERT INTO merchant_applications (
        id, reference_number, applicant_name, business_name, mobile,
        governorate, city, address, services, operating_status, contact_method,
        email, whatsapp, website, capacity, notes, privacy_consent, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `, [
      appId, refNum, applicantName.trim(), businessName.trim(), mobile.trim(),
      governorate.trim(), city.trim(), address || '', servicesJson,
      operatingStatus || 'قائمة وتعمل', contactMethod || 'الهاتف مباشرة',
      email || null, whatsapp || null, website || null, capacity || null,
      notes || null, privacyConsent ? 1 : 0
    ]);

    const created = await queryOne('SELECT * FROM merchant_applications WHERE id = ?', [appId]);

    res.status(201).json({
      success: true,
      referenceNumber: refNum,
      application: created,
      message: 'تم استلام طلب الانضمام بنجاح وسيتواصل فريق العمليات معكم خلال 24 ساعة.'
    });
  }
);

// 2. List Applications (Admin Supervision on Port 3000)
applicationsRouter.get('/', authenticate, requireRole('platform_admin', 'operations_manager'), async (req: Request, res: Response) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM merchant_applications WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'all') {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY received_at DESC';

  const applications = await query(sql, params);
  res.json({ applications });
});

// 3. Review Application (Admin)
applicationsRouter.put('/:id/review', authenticate, requireRole('platform_admin', 'operations_manager'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reviewerNotes, decisionReason, onboardingStage } = req.body;

  const app = await queryOne('SELECT * FROM merchant_applications WHERE id = ?', [id]);
  if (!app) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Application not found' } });
    return;
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (status) {
    updates.push('status = ?');
    params.push(status);
  }

  if (reviewerNotes !== undefined) {
    updates.push('reviewer_notes = ?');
    params.push(reviewerNotes);
  }

  if (decisionReason !== undefined) {
    updates.push('decision_reason = ?');
    params.push(decisionReason);
  }

  if (onboardingStage !== undefined) {
    updates.push('onboarding_stage = ?');
    params.push(onboardingStage);
  }

  updates.push('reviewed_by = ?');
  params.push(req.user?.name || 'Admin');

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  await execute(`UPDATE merchant_applications SET ${updates.join(', ')} WHERE id = ?`, params);

  const updated = await queryOne('SELECT * FROM merchant_applications WHERE id = ?', [id]);
  res.json({ success: true, application: updated });
});
