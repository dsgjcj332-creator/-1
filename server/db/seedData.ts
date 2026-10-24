import { queryOne, execute, transaction } from './database';

export async function runSeeds(): Promise<void> {
  const existingRole = await queryOne('SELECT id FROM roles LIMIT 1');
  if (existingRole) {
    return; // Already seeded
  }

  console.log('[DB] Seeding authoritative initial data for Ala El Saree...');

  await transaction(async () => {
    // 1. ROLES
    const roles = [
      { id: 'platform_admin', name: 'Platform Admin', description: 'Full system administration' },
      { id: 'operations_manager', name: 'Operations Manager', description: 'Supervises orders, disputes and merchants' },
      { id: 'dispatcher', name: 'Dispatcher', description: 'Fleet delivery assignment and tracking' },
      { id: 'merchant_owner', name: 'Merchant Owner', description: 'Laundry business owner' },
      { id: 'merchant_staff', name: 'Merchant Staff', description: 'Laundry counter intake staff' },
      { id: 'driver', name: 'Driver', description: 'Delivery captain for pickup and return' },
      { id: 'customer', name: 'Customer', description: 'End user ordering laundry service' }
    ];

    for (const r of roles) {
      await execute('INSERT INTO roles (id, name, description) VALUES (?, ?, ?)', [r.id, r.name, r.description]);
    }

    // 2. MERCHANTS
    const merchants = [
      {
        id: 'm-zag-01',
        nameAr: 'مغسلة النور الحديثة',
        nameEn: 'Al-Noor Modern Cleaners',
        commercialReg: '482910-ZAG',
        taxNum: '928-112-401',
        owner: 'الحاج مجدي النور',
        phone: '01012345671',
        gov: 'الشرقية',
        city: 'الزقازيق',
        district: 'منطقة القومية - شارع السلام',
        address: 'شارع السلام المتفرع من القومية بجوار صيدلية الدكتور أحمد',
        payoutMethod: 'instapay',
        payoutDetails: 'alnoor.laundry@instapay',
        capacity: 45,
        rating: 4.8
      },
      {
        id: 'm-zag-02',
        nameAr: 'مغسلة الصفوة الملكية',
        nameEn: 'El-Safwa Royal Laundry',
        commercialReg: '319401-ZAG',
        taxNum: '811-923-550',
        owner: 'أحمد البدري',
        phone: '01123456782',
        gov: 'الشرقية',
        city: 'الزقازيق',
        district: 'حي الجامعة وفلل الجامعة',
        address: 'أمام بوابة كلية الآداب - برج الصفوة الدور الأرضي',
        payoutMethod: 'bank_transfer',
        payoutDetails: 'بنك مصر - فرع الزقازيق - حساب رقم 4120098124',
        capacity: 60,
        rating: 4.9
      },
      {
        id: 'm-man-01',
        nameAr: 'مغسلة دراي كلين النيل',
        nameEn: 'Nile Dry Clean Mansoura',
        commercialReg: '519280-MAN',
        taxNum: '702-334-119',
        owner: 'إبراهيم الشربيني',
        phone: '01234567893',
        gov: 'الدقهلية',
        city: 'المنصورة',
        district: 'المشاية السفلية',
        address: 'المشاية السفلية كورنيش النيل بجوار نادي جزيرة الورد',
        payoutMethod: 'instapay',
        payoutDetails: 'nilecleaners@instapay',
        capacity: 50,
        rating: 4.7
      }
    ];

    for (const m of merchants) {
      await execute(`
        INSERT INTO merchants (
          id, name_ar, name_en, commercial_reg_no, tax_number, owner_name, phone,
          governorate, city, district, address, payout_method, payout_details,
          capacity_bags_per_day, rating, status, commission_rate, service_fee_payer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0.08, 'customer')
      `, [
        m.id, m.nameAr, m.nameEn, m.commercialReg, m.taxNum, m.owner, m.phone,
        m.gov, m.city, m.district, m.address, m.payoutMethod, m.payoutDetails,
        m.capacity, m.rating
      ]);
    }

    // 3. USERS
    const users = [
      { id: 'usr-admin-01', phone: '01000000001', name: 'عمر الفاروق', email: 'admin@alaelsaree.com', role: 'platform_admin', merchantId: null, driverId: null },
      { id: 'usr-dispatch-01', phone: '01000000002', name: 'حازم الديسطي', email: 'dispatch@alaelsaree.com', role: 'dispatcher', merchantId: null, driverId: null },
      { id: 'usr-merch-01', phone: '01012345671', name: 'الحاج مجدي النور', email: 'magdy@alnoorclean.com', role: 'merchant_owner', merchantId: 'm-zag-01', driverId: null },
      { id: 'usr-merch-02', phone: '01123456782', name: 'أحمد البدري', email: 'ahmed@elsafwaclean.com', role: 'merchant_owner', merchantId: 'm-zag-02', driverId: null },
      { id: 'usr-driver-01', phone: '01099887761', name: 'أحمد متولي', email: 'ahmed.driver@alaelsaree.com', role: 'driver', merchantId: null, driverId: 'drv-01' },
      { id: 'usr-cust-01', phone: '01023456781', name: 'د. طارق المنشاوي', email: 'tarek@example.com', role: 'customer', merchantId: null, driverId: null }
    ];

    for (const u of users) {
      await execute(`
        INSERT INTO users (id, phone, name, email, role_id, merchant_id, driver_id, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `, [u.id, u.phone, u.name, u.email, u.role, u.merchantId, u.driverId]);
    }

    // 4. CUSTOMER PROFILES & ADDRESSES
    await execute(`
      INSERT INTO customer_profiles (id, user_id, full_name, phone)
      VALUES ('cust-101', 'usr-cust-01', 'د. طارق المنشاوي', '01023456781')
    `);

    await execute(`
      INSERT INTO addresses (
        id, customer_id, title, governorate, city, district, street, building_no, floor_no, apartment_no, is_default
      ) VALUES (
        'addr-101', 'cust-101', 'المنزل - برج الأطباء', 'الشرقية', 'الزقازيق', 'حي الجامعة', 'شارع الجامعة الرئيسي', '12', '4', '8', 1
      )
    `);

    // 5. DRIVERS
    await execute(`
      INSERT INTO drivers (
        id, driver_code, name, mobile, service_zone, vehicle_type, status, cash_in_hand_egp, max_cash_limit_egp
      ) VALUES (
        'drv-01', 'CAP-ZAG-01', 'أحمد متولي', '01099887761', 'الزقازيق', 'motorcycle', 'available', 350, 1500
      )
    `);

    // 6. SERVICE CATEGORIES & SERVICES
    const categories = [
      { id: 'cat-men', nameAr: 'ملابس رجالي', nameEn: 'Men Clothing', order: 1 },
      { id: 'cat-women', nameAr: 'ملابس حريمي', nameEn: 'Women Clothing', order: 2 },
      { id: 'cat-formal', nameAr: 'بدل وسواريه', nameEn: 'Formal & Evening', order: 3 },
      { id: 'cat-bedding', nameAr: 'مفروشات وبطاطين', nameEn: 'Bedding & Blankets', order: 4 }
    ];

    for (const c of categories) {
      await execute('INSERT INTO service_categories (id, name_ar, name_en, display_order) VALUES (?, ?, ?, ?)', [c.id, c.nameAr, c.nameEn, c.order]);
    }

    const services = [
      { id: 'srv-shirt', cat: 'cat-men', nameAr: 'قميص رجالي', nameEn: 'Men Shirt', washIron: 25, dryClean: 35, iron: 15, duration: 6 },
      { id: 'srv-trousers', cat: 'cat-men', nameAr: 'بنطلون قماش / جينز', nameEn: 'Trousers / Jeans', washIron: 30, dryClean: 40, iron: 15, duration: 6 },
      { id: 'srv-suit', cat: 'cat-formal', nameAr: 'بدلة رجالي كاملة', nameEn: 'Full 2-Piece Suit', washIron: 90, dryClean: 120, iron: 45, duration: 12 },
      { id: 'srv-dress', cat: 'cat-women', nameAr: 'فستان ناعم / عباية', nameEn: 'Dress / Abaya', washIron: 45, dryClean: 65, iron: 25, duration: 8 },
      { id: 'srv-blanket', cat: 'cat-bedding', nameAr: 'بطانية شتوي دبل', nameEn: 'Double Blanket', washIron: 120, dryClean: 150, iron: null, duration: 24 }
    ];

    for (const s of services) {
      await execute(`
        INSERT INTO services (id, category_id, name_ar, name_en, base_wash_iron_price, base_dry_clean_price, base_iron_only_price, est_duration_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [s.id, s.cat, s.nameAr, s.nameEn, s.washIron, s.dryClean, s.iron, s.duration]);
    }

    // 7. ORDERS & ORDER ITEMS
    await execute(`
      INSERT INTO orders (
        id, order_number, customer_id, customer_name, customer_phone,
        merchant_id, merchant_name, city, neighborhood,
        pickup_address, delivery_address, status, payment_status, payment_method,
        laundry_subtotal, adjustments_total, commission_rate, commission_amount,
        platform_fee, platform_fee_payer, delivery_fee_customer,
        driver_payout_pickup, driver_payout_delivery, customer_total_paid,
        merchant_payable_amount, special_instructions
      ) VALUES (
        'ord-101', 'ORD-2026-0814', 'cust-101', 'د. طارق المنشاوي', '01023456781',
        'm-zag-01', 'مغسلة النور الحديثة', 'الزقازيق', 'حي الجامعة',
        'برج الأطباء شارع الجامعة، الدور الرابع شقة 8',
        'برج الأطباء شارع الجامعة، الدور الرابع شقة 8',
        'inspection_required', 'pending', 'cash_on_delivery',
        225, 0, 0.08, 18, 20, 'customer', 25, 20, 20, 270, 207,
        'يرجى الحرص على أزرار القمصان واستخدام نشا خفيف'
      )
    `);

    await execute(`
      INSERT INTO order_items (id, order_id, service_id, name_ar, name_en, service_type, quantity, unit_price, subtotal, received_quantity)
      VALUES
        ('item-101-1', 'ord-101', 'srv-shirt', 'قميص رجالي', 'Men Shirt', 'wash_iron', 3, 25, 75, 3),
        ('item-101-2', 'ord-101', 'srv-trousers', 'بنطلون قماش / جينز', 'Trousers', 'wash_iron', 2, 30, 60, 2),
        ('item-101-3', 'ord-101', 'srv-suit', 'بدلة رجالي كاملة', 'Full Suit', 'dry_clean', 1, 90, 90, 1)
    `);

    await execute(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, actor_name, actor_role, note)
      VALUES
        ('hist-1', 'ord-101', NULL, 'awaiting_laundry_confirmation', 'د. طارق المنشاوي', 'customer', 'حجز الطلب عبر تطبيق الموبايل'),
        ('hist-2', 'ord-101', 'awaiting_laundry_confirmation', 'inspection_required', 'أحمد متولي', 'driver', 'تم استلام الكيس من العميل وإيداعه بكاونتر المغسلة')
    `);

    // 8. DELIVERY TASKS
    await execute(`
      INSERT INTO delivery_tasks (
        id, job_reference, order_id, order_number, job_type,
        origin_name, origin_address, origin_phone,
        destination_name, destination_address, destination_phone,
        service_zone, scheduled_window, status, assigned_driver_id,
        cash_to_collect_egp, cash_collected
      ) VALUES (
        'job-pk-101', 'DLV-PK-101', 'ord-101', 'ORD-2026-0814', 'pickup',
        'د. طارق المنشاوي', 'برج الأطباء شارع الجامعة شقة 8', '01023456781',
        'مغسلة النور الحديثة', 'شارع السلام بالقومية', '01012345671',
        'الزقازيق', '09:00 ص - 11:00 ص', 'completed', 'drv-01',
        0, 0
      )
    `);

    // 9. LEDGER ACCOUNTS (BALANCED ACCOUNTING)
    const accounts = [
      { id: 'acc-cash', code: '1010', name: 'Cash and In-Transit Collections', type: 'asset' },
      { id: 'acc-ap-merchants', code: '2010', name: 'Merchants Payable', type: 'liability' },
      { id: 'acc-ap-drivers', code: '2020', name: 'Driver Compensation Payable', type: 'liability' },
      { id: 'acc-rev-comm', code: '4010', name: 'Marketplace Commission Revenue (8%)', type: 'revenue' },
      { id: 'acc-rev-fees', code: '4020', name: 'Platform Service Fee Revenue (20 EGP)', type: 'revenue' },
      { id: 'acc-rev-delivery', code: '4030', name: 'Delivery Gross Fee Revenue', type: 'revenue' },
      { id: 'acc-exp-delivery', code: '5010', name: 'Platform Delivery Subsidy Expense', type: 'expense' }
    ];

    for (const a of accounts) {
      await execute('INSERT INTO ledger_accounts (id, account_code, account_name, account_type) VALUES (?, ?, ?, ?)', [a.id, a.code, a.name, a.type]);
    }

    // 10. PLATFORM SETTINGS
    const settings = [
      { key: 'COMMISSION_RATE', value: '0.08', desc: 'Default merchant laundry commission percentage (8%)' },
      { key: 'PLATFORM_FEE_EGP', value: '20', desc: 'Fixed platform service fee per invoice (20 EGP)' },
      { key: 'PLATFORM_FEE_PAYER', value: 'customer', desc: 'Entity paying platform fee (customer or merchant)' },
      { key: 'DEFAULT_DELIVERY_FEE', value: '25', desc: 'Standard customer delivery fee in active zones' },
      { key: 'DRIVER_LEG_PAYOUT', value: '20', desc: 'Driver compensation per completed pickup/return leg' }
    ];

    for (const st of settings) {
      await execute('INSERT INTO platform_settings (key, value, description) VALUES (?, ?, ?)', [st.key, st.value, st.desc]);
    }
  });

  console.log('[DB] Seeding completed successfully!');
}
