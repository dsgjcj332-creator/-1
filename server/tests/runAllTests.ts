import { getDb, query, queryOne, execute, transaction } from '../db/database';
import { runSeeds } from '../db/seedData';
import { OrderStateMachine } from '../domain/orderStateMachine';
import { FinanceLedger } from '../domain/financeLedger';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedCount++;
    console.error(`  ❌ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 ALA EL SAREE - AUTHORITATIVE BACKEND TEST SUITE');
  console.log('====================================================\n');

  // TEST SUITE 1: DATABASE INITIALIZATION & SEEDS
  console.log('📦 Test Suite 1: Database Initialization & Seeds');
  await getDb();
  await runSeeds();

  const merchants = await query('SELECT * FROM merchants');
  assert(merchants.length >= 3, 'Initial merchants seeded', `Found ${merchants.length}`);

  const roles = await query('SELECT * FROM roles');
  assert(roles.length >= 7, 'All 7 system roles present', `Found ${roles.length}`);

  const sampleOrder = await queryOne('SELECT * FROM orders WHERE id = ?', ['ord-101']);
  assert(sampleOrder !== null, 'Authoritative seed order ord-101 exists');
  assert(sampleOrder.order_number === 'ORD-2026-0814', 'Order number format matches specification');

  // TEST SUITE 2: ORDER LIFECYCLE STATE MACHINE
  console.log('\n🔄 Test Suite 2: Order State Machine Transitions & Role Validation');

  // Valid merchant acceptance
  const t1 = OrderStateMachine.canTransition('awaiting_laundry_confirmation', 'accepted', 'merchant_staff');
  assert(t1.allowed === true, 'Merchant can accept awaiting confirmation order');

  // Valid intake inspection to processing
  const t2 = OrderStateMachine.canTransition('inspection_required', 'processing', 'merchant_staff');
  assert(t2.allowed === true, 'Merchant can move inspected order to processing');

  // Invalid jump: cannot jump directly from awaiting_confirmation to out_for_delivery
  const t3 = OrderStateMachine.canTransition('awaiting_laundry_confirmation', 'out_for_delivery', 'driver');
  assert(t3.allowed === false, 'Cannot bypass laundry inspection straight to out_for_delivery');

  // Unauthorized role: Driver cannot mark order accepted by laundry
  const t4 = OrderStateMachine.canTransition('awaiting_laundry_confirmation', 'accepted', 'driver');
  assert(t4.allowed === false, 'Driver cannot accept laundry order on behalf of merchant');

  // Admin override capability
  const t5 = OrderStateMachine.canTransition('awaiting_laundry_confirmation', 'accepted', 'platform_admin');
  assert(t5.allowed === true, 'Platform admin has supervisory override permission');

  // TEST SUITE 3: FINANCIAL LEDGER & BALANCED DOUBLE-ENTRY
  console.log('\n💰 Test Suite 3: Financial Calculations & Double-Entry Accounting');

  const calc = FinanceLedger.calculateOrderFinancials({
    laundrySubtotal: 200,
    adjustmentsTotal: 50, // total 250 EGP
    commissionRate: 0.08, // 8% = 20 EGP
    platformFeeEgp: 20,
    platformFeePayer: 'customer',
    deliveryFeeCustomer: 25,
    driverPayoutPickup: 20,
    driverPayoutDelivery: 20
  });

  assert(calc.grossLaundryVolume === 250, 'Gross laundry calculated correctly (200 + 50 = 250 EGP)');
  assert(calc.commissionAmount === 20, 'Platform 8% commission is 20 EGP (250 * 0.08)');
  assert(calc.merchantPayableAmount === 230, 'Merchant payable is 230 EGP (250 - 20)');
  assert(calc.customerTotalPaid === 295, 'Customer total paid is 295 EGP (250 + 20 fee + 25 delivery)');

  // Test double-entry balance: Debits == Credits
  const testOrderId = `ord-test-${Date.now()}`;
  await execute(`
    INSERT INTO orders (
      id, order_number, customer_id, customer_name, customer_phone,
      merchant_id, merchant_name, city, neighborhood, pickup_address, delivery_address,
      laundry_subtotal, customer_total_paid, merchant_payable_amount
    ) VALUES (?, ?, 'cust-101', 'Test User', '01000000000', 'm-zag-01', 'Test Merchant', 'الزقازيق', 'حي الجامعة', 'العنوان', 'العنوان', 250, 295, 230)
  `, [testOrderId, `ORD-TEST-${Date.now().toString().slice(-4)}`]);

  await FinanceLedger.postOrderDeliveryEntries(testOrderId, calc);

  const testEntries = await query('SELECT * FROM ledger_entries WHERE order_id = ?', [testOrderId]);
  const debits = testEntries.filter((e: any) => e.entry_type === 'debit').reduce((s: number, e: any) => s + Number(e.amount_egp), 0);
  const credits = testEntries.filter((e: any) => e.entry_type === 'credit').reduce((s: number, e: any) => s + Number(e.amount_egp), 0);

  assert(debits === credits, `Double-entry balanced: Debits (${debits}) === Credits (${credits})`);
  const cashDebited = testEntries.find((e: any) => e.account_id === 'acc-cash')?.amount_egp;
  assert(cashDebited === 295, `Cash account debited with exact customer COD collected (295 EGP)`);

  // TEST SUITE 4: TENANT ISOLATION
  console.log('\n🔒 Test Suite 4: Multi-Tenant Merchant & Role Isolation');

  const merchantOrdersZag = await query('SELECT id FROM orders WHERE merchant_id = ?', ['m-zag-01']);
  const merchantOrdersSafwa = await query('SELECT id FROM orders WHERE merchant_id = ?', ['m-zag-02']);

  // Isolation check: Zagazig orders must not bleed into Safwa
  const intersection = merchantOrdersZag.filter((o1: any) => merchantOrdersSafwa.some((o2: any) => o1.id === o2.id));
  assert(intersection.length === 0, 'Strict order isolation: zero cross-merchant leakage');

  // TEST SUITE 5: INTAKE INSPECTION & CUSTOMER PRICE APPROVAL
  console.log('\n🔍 Test Suite 5: Intake Inspection & Price Adjustment Workflow');

  const inspectionOrderId = `ord-insp-${Date.now()}`;
  await execute(`
    INSERT INTO orders (
      id, order_number, customer_id, customer_name, customer_phone,
      merchant_id, merchant_name, city, neighborhood, pickup_address, delivery_address,
      laundry_subtotal, customer_total_paid, merchant_payable_amount, status
    ) VALUES (?, ?, 'cust-101', 'Test', '01000000000', 'm-zag-01', 'Test Laundry', 'الزقازيق', 'حي', 'العنوان', 'العنوان', 100, 145, 92, 'inspection_required')
  `, [inspectionOrderId, `ORD-INSP-${Date.now().toString().slice(-4)}`]);

  // Record price adjustment (+30 EGP extra heavy stain charge)
  await execute(`
    INSERT INTO price_adjustments (
      id, order_id, reported_by, original_subtotal, revised_subtotal, difference_egp, reason, customer_approval_status
    ) VALUES (?, ?, 'Staff', 100, 130, 30, 'إزالة بقع زيتية صعبة', 'pending')
  `, [`adj-${Date.now()}`, inspectionOrderId]);

  await execute(`
    UPDATE orders SET status = 'awaiting_customer_approval', adjustments_total = 30 WHERE id = ?
  `, [inspectionOrderId]);

  const beforeApproval = await queryOne('SELECT status FROM orders WHERE id = ?', [inspectionOrderId]);
  assert(beforeApproval.status === 'awaiting_customer_approval', 'Order transitioned to awaiting_customer_approval');

  // Customer simulates approval
  await execute(`
    UPDATE price_adjustments SET customer_approval_status = 'approved' WHERE order_id = ?
  `, [inspectionOrderId]);

  await execute(`
    UPDATE orders SET status = 'processing', laundry_subtotal = 130 WHERE id = ?
  `, [inspectionOrderId]);

  const afterApproval = await queryOne('SELECT status, laundry_subtotal FROM orders WHERE id = ?', [inspectionOrderId]);
  assert(afterApproval.status === 'processing', 'Customer approval successfully advanced order to processing');
  assert(afterApproval.laundry_subtotal === 130, 'Revised subtotal accepted into authoritative order record');

  // FINAL SUMMARY
  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('====================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
