export type UserRole =
  | 'platform_admin'
  | 'operations_manager'
  | 'dispatcher'
  | 'merchant_owner'
  | 'merchant_staff'
  | 'driver'
  | 'finance_operator'
  | 'support_operator';

export interface OperationsUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  merchantId?: string; // Set when role is merchant_owner or merchant_staff
  driverId?: string;   // Set when role is driver
  avatarUrl?: string;
  assignedZone?: string;
}

export type MerchantApplicationStatus =
  | 'new'
  | 'under_review'
  | 'info_requested'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export interface MerchantApplication {
  id: string;
  referenceNumber: string;
  applicantName: string;
  businessName: string;
  mobile: string;
  governorate: string;
  city: string;
  address: string;
  services: string[];
  operatingStatus: string;
  contactMethod: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  capacity?: string;
  notes?: string;
  locationLink?: string;
  privacyConsent: boolean;
  status: MerchantApplicationStatus;
  receivedAt: string;
  reviewedBy?: string;
  reviewerNotes?: string;
  decisionReason?: string;
  onboardingStage?: 'pending_docs' | 'commercial_terms' | 'catalog_setup' | 'activated';
}

export interface MerchantBusiness {
  id: string;
  nameAr: string;
  nameEn: string;
  commercialRegNo: string;
  taxNumber: string;
  ownerName: string;
  phone: string;
  governorate: string;
  city: string;
  district: string;
  address: string;
  status: 'active' | 'onboarding' | 'suspended';
  commissionRate: number; // e.g., 0.08 for 8%
  serviceFeePayer: 'customer' | 'merchant';
  capacityBagsPerDay: number;
  activeHours: string;
  payoutMethod: 'bank_transfer' | 'instapay' | 'vodafone_cash';
  payoutDetails: string;
  rating: number;
  totalOrdersFulfilled: number;
}

export type OrderLifecycleStatus =
  | 'awaiting_laundry_confirmation'
  | 'accepted'
  | 'rejected'
  | 'awaiting_pickup'
  | 'pickup_assigned'
  | 'collected'
  | 'received_at_laundry'
  | 'inspection_required'
  | 'awaiting_customer_approval'
  | 'processing'
  | 'ready_for_delivery'
  | 'delivery_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'failed_pickup'
  | 'failed_delivery';

export type PaymentStatus =
  | 'pending'
  | 'awaiting_collection'
  | 'partially_paid'
  | 'paid'
  | 'failed'
  | 'refund_pending'
  | 'refunded';

export interface OrderGarmentItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  serviceType: 'wash_iron' | 'wash_only' | 'iron_only' | 'dry_clean';
  quantity: number;
  unitPrice: number;
  subtotal: number;
  fragrance?: string;
  starch?: string;
  packaging?: string;
  customerNotes?: string;
  receivedQuantity?: number;
  discrepancyNote?: string;
  stainDamageNotes?: string;
  photoUrl?: string;
}

export interface OrderDiscrepancy {
  detectedAt: string;
  reportedBy: string;
  originalSubtotal: number;
  revisedSubtotal: number;
  differenceEgp: number;
  reason: string;
  customerApprovalStatus: 'not_required' | 'pending' | 'approved' | 'rejected';
  customerRespondedAt?: string;
  photoNotes?: string;
}

export interface LaundryOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  merchantId: string;
  merchantName: string;
  city: string;
  neighborhood: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: OrderLifecycleStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'cash_on_delivery' | 'online_card' | 'wallet_instapay';
  items: OrderGarmentItem[];
  laundrySubtotal: number;
  adjustmentsTotal: number;
  commissionRate: number; // e.g., 0.08
  commissionAmount: number;
  platformFee: number; // e.g., 20
  platformFeePayer: 'customer' | 'merchant';
  deliveryFeeCustomer: number;
  driverPayoutPickup: number;
  driverPayoutDelivery: number;
  customerTotalPaid: number;
  merchantPayableAmount: number;
  isSettled: boolean;
  settlementId?: string;
  discrepancy?: OrderDiscrepancy;
  pickupJobId?: string;
  deliveryJobId?: string;
  statusHistory: Array<{
    status: OrderLifecycleStatus;
    timestamp: string;
    actor: string;
    note?: string;
  }>;
  specialInstructions?: string;
}

export type DeliveryLegType = 'pickup' | 'return_delivery';

export type DeliveryJobStatus =
  | 'awaiting_assignment'
  | 'assigned'
  | 'driver_accepted'
  | 'en_route_pickup'
  | 'arrived_pickup'
  | 'completed'
  | 'attempt_failed'
  | 'rescheduled'
  | 'cancelled';

export interface DeliveryJob {
  id: string;
  jobReference: string;
  orderId: string;
  orderNumber: string;
  jobType: DeliveryLegType;
  originName: string;
  originAddress: string;
  originPhone: string;
  destinationName: string;
  destinationAddress: string;
  destinationPhone: string;
  serviceZone: string;
  scheduledWindow: string;
  status: DeliveryJobStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  attemptCount: number;
  failureReason?: string;
  proofNote?: string;
  cashToCollectEgp: number;
  cashCollected: boolean;
  assignedAt?: string;
  completedAt?: string;
}

export interface DeliveryDriver {
  id: string;
  driverCode: string;
  name: string;
  mobile: string;
  serviceZone: string;
  vehicleType: 'motorcycle' | 'van' | 'car' | 'bicycle';
  plateNumber?: string;
  status: 'active' | 'busy' | 'offline' | 'suspended';
  activeJobsCount: number;
  completedJobsTotal: number;
  failedDeliveriesCount: number;
  cashInHandEgp: number;
  joinedAt: string;
  rating: number;
}

export interface SettlementStatement {
  id: string;
  statementNumber: string;
  merchantId: string;
  merchantName: string;
  periodStart: string;
  periodEnd: string;
  totalOrdersCount: number;
  grossLaundryValue: number;
  commissionDeducted: number;
  platformFeesDeducted: number;
  netPayableAmount: number;
  status: 'draft' | 'pending_review' | 'approved' | 'paid';
  generatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  bankTransferReference?: string;
  payoutDate?: string;
  orderIds: string[];
}

export interface CommissionConfig {
  commissionRatePercent: number; // e.g. 8 for 8%
  platformFeeEgp: number;        // e.g. 20 EGP
  platformFeePayer: 'customer' | 'merchant';
  defaultDeliveryFeeCustomer: number;
  driverLegCompensationEgp: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'order' | 'merchant' | 'application' | 'delivery' | 'settlement' | 'commission_rule';
  entityId: string;
  details: string;
  beforeSnapshot?: string;
  afterSnapshot?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  merchantName: string;
  category: 'stain_damage' | 'missing_item' | 'delay' | 'pricing_dispute' | 'cancellation_refund';
  description: string;
  reportedBy: 'customer' | 'merchant' | 'driver';
  status: 'open' | 'under_investigation' | 'resolved' | 'closed';
  financialAdjustmentEgp?: number;
  createdAt: string;
  resolutionNotes?: string;
}

export interface ServiceZone {
  id: string;
  nameAr: string;
  nameEn: string;
  governorateAr: string;
  governorateEn: string;
  isActive: boolean;
  activeLaundriesCount: number;
  activeDriversCount: number;
  deliveryBaseFeeEgp: number;
}
