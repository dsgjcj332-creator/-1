import { execute, queryOne } from '../db/database';

export interface FinancialCalculationInput {
  laundrySubtotal: number;
  adjustmentsTotal?: number;
  commissionRate?: number; // e.g. 0.08
  platformFeeEgp?: number; // e.g. 20
  platformFeePayer?: 'customer' | 'merchant';
  deliveryFeeCustomer?: number; // e.g. 25
  driverPayoutPickup?: number;  // e.g. 20
  driverPayoutDelivery?: number; // e.g. 20
}

export interface FinancialCalculationResult {
  grossLaundryVolume: number;
  commissionAmount: number;
  platformFee: number;
  platformFeePayer: 'customer' | 'merchant';
  deliveryFeeCustomer: number;
  customerTotalPaid: number;
  merchantPayableAmount: number;
  driverTotalPayout: number;
  platformNetRevenue: number;
}

export class FinanceLedger {
  static calculateOrderFinancials(input: FinancialCalculationInput): FinancialCalculationResult {
    const grossLaundry = Math.round(Number(input.laundrySubtotal || 0) + Number(input.adjustmentsTotal || 0));
    const commRate = Number(input.commissionRate !== undefined ? input.commissionRate : 0.08);
    const commAmount = Math.round(grossLaundry * commRate);

    const platformFee = Number(input.platformFeeEgp !== undefined ? input.platformFeeEgp : 20);
    const platformFeePayer = input.platformFeePayer || 'customer';
    const deliveryFeeCustomer = Number(input.deliveryFeeCustomer !== undefined ? input.deliveryFeeCustomer : 25);
    const driverPayoutPickup = Number(input.driverPayoutPickup !== undefined ? input.driverPayoutPickup : 20);
    const driverPayoutDelivery = Number(input.driverPayoutDelivery !== undefined ? input.driverPayoutDelivery : 20);
    const driverTotalPayout = driverPayoutPickup + driverPayoutDelivery;

    // Strict non-duplication rule: Platform fee is charged to EXACTLY the agreed party
    let customerTotalPaid = grossLaundry + deliveryFeeCustomer;
    let merchantPayableAmount = grossLaundry - commAmount;

    if (platformFeePayer === 'customer') {
      customerTotalPaid += platformFee;
    } else {
      merchantPayableAmount -= platformFee;
    }

    // Platform Net = Commission + Platform Fee + (Customer Delivery Fee - Driver Payouts)
    const platformNetRevenue = commAmount + platformFee + (deliveryFeeCustomer - driverTotalPayout);

    return {
      grossLaundryVolume: grossLaundry,
      commissionAmount: commAmount,
      platformFee,
      platformFeePayer,
      deliveryFeeCustomer,
      customerTotalPaid,
      merchantPayableAmount,
      driverTotalPayout,
      platformNetRevenue
    };
  }

  static async postOrderDeliveryEntries(orderId: string, financials: FinancialCalculationResult): Promise<void> {
    const txRef = `TX-DELIV-${orderId}-${Date.now().toString().slice(-6)}`;

    // Balanced Double-Entry Postings:
    // 1. Debit Cash in transit / Accounts Receivable
    await execute(`
      INSERT INTO ledger_entries (id, transaction_ref, order_id, account_id, entry_type, amount_egp, narration)
      VALUES (?, ?, ?, 'acc-cash', 'debit', ?, 'Customer COD Collected for order')
    `, [`ent-${Date.now()}-1`, txRef, orderId, financials.customerTotalPaid]);

    // 1b. Debit Platform Delivery Subsidy Expense (if driver payout exceeds customer delivery fee)
    const deliverySubsidy = financials.driverTotalPayout - financials.deliveryFeeCustomer;
    if (deliverySubsidy > 0) {
      await execute(`
        INSERT INTO ledger_entries (id, transaction_ref, order_id, account_id, entry_type, amount_egp, narration)
        VALUES (?, ?, ?, 'acc-exp-delivery', 'debit', ?, 'Platform delivery compensation subsidy expense')
      `, [`ent-${Date.now()}-1b`, txRef, orderId, deliverySubsidy]);
    }

    // 2. Credit Merchant Payable
    await execute(`
      INSERT INTO ledger_entries (id, transaction_ref, order_id, account_id, entry_type, amount_egp, narration)
      VALUES (?, ?, ?, 'acc-ap-merchants', 'credit', ?, 'Net payable to laundry partner')
    `, [`ent-${Date.now()}-2`, txRef, orderId, financials.merchantPayableAmount]);

    // 3. Credit Driver Compensation Payable
    await execute(`
      INSERT INTO ledger_entries (id, transaction_ref, order_id, account_id, entry_type, amount_egp, narration)
      VALUES (?, ?, ?, 'acc-ap-drivers', 'credit', ?, 'Driver return leg compensation')
    `, [`ent-${Date.now()}-3`, txRef, orderId, financials.driverTotalPayout]);

    // 4. Credit Platform Marketplace Commission (8%)
    await execute(`
      INSERT INTO ledger_entries (id, transaction_ref, order_id, account_id, entry_type, amount_egp, narration)
      VALUES (?, ?, ?, 'acc-rev-comm', 'credit', ?, 'Marketplace 8% commission earned')
    `, [`ent-${Date.now()}-4`, txRef, orderId, financials.commissionAmount]);

    // 5. Credit Platform Fixed Service Fee
    if (financials.platformFee > 0) {
      await execute(`
        INSERT INTO ledger_entries (id, transaction_ref, order_id, account_id, entry_type, amount_egp, narration)
        VALUES (?, ?, ?, 'acc-rev-fees', 'credit', ?, 'Platform service fee earned')
      `, [`ent-${Date.now()}-5`, txRef, orderId, financials.platformFee]);
    }
  }
}
