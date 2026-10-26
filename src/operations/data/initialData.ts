import {
  OperationsUser,
  MerchantBusiness,
  MerchantApplication,
  LaundryOrder,
  DeliveryJob,
  DeliveryDriver,
  SettlementStatement,
  CommissionConfig,
  ServiceZone,
  AuditLogEntry,
  SupportTicket
} from '../types';

export const INITIAL_COMMISSION_CONFIG: CommissionConfig = {
  commissionRatePercent: 8, // 8%
  platformFeeEgp: 20,       // 20 EGP
  platformFeePayer: 'customer',
  defaultDeliveryFeeCustomer: 25,
  driverLegCompensationEgp: 20
};

export const INITIAL_SERVICE_ZONES: ServiceZone[] = [
  {
    id: 'zagazig',
    nameAr: 'الزقازيق',
    nameEn: 'Zagazig',
    governorateAr: 'الشرقية',
    governorateEn: 'Sharqia',
    isActive: true,
    activeLaundriesCount: 0,
    activeDriversCount: 0,
    deliveryBaseFeeEgp: 25
  },
  {
    id: 'mansoura',
    nameAr: 'المنصورة',
    nameEn: 'Mansoura',
    governorateAr: 'الدقهلية',
    governorateEn: 'Dakahlia',
    isActive: true,
    activeLaundriesCount: 0,
    activeDriversCount: 0,
    deliveryBaseFeeEgp: 25
  },
  {
    id: 'ramadan10',
    nameAr: 'العاشر من رمضان',
    nameEn: '10th of Ramadan',
    governorateAr: 'الشرقية',
    governorateEn: 'Sharqia',
    isActive: false, // Planned expansion zone
    activeLaundriesCount: 0,
    activeDriversCount: 0,
    deliveryBaseFeeEgp: 30
  },
  {
    id: 'cairo',
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    governorateAr: 'القاهرة',
    governorateEn: 'Cairo',
    isActive: false, // Planned expansion zone
    activeLaundriesCount: 0,
    activeDriversCount: 0,
    deliveryBaseFeeEgp: 35
  }
];

export const INITIAL_MERCHANTS: MerchantBusiness[] = [];

export const INITIAL_DRIVERS: DeliveryDriver[] = [];

export const INITIAL_USERS: OperationsUser[] = [
  {
    id: 'usr-admin-01',
    name: 'عمر الفاروق',
    email: 'admin@alaelsaree.com',
    phone: '01000000001',
    role: 'platform_admin',
    assignedZone: 'all'
  },
  {
    id: 'usr-dispatch-01',
    name: 'حازم الديسطي',
    email: 'dispatch@alaelsaree.com',
    phone: '01000000002',
    role: 'dispatcher',
    assignedZone: 'الزقازيق'
  }
];

export const INITIAL_MERCHANT_APPLICATIONS: MerchantApplication[] = [];

export const INITIAL_ORDERS: LaundryOrder[] = [];

export const INITIAL_DELIVERY_JOBS: DeliveryJob[] = [];

export const INITIAL_SETTLEMENTS: SettlementStatement[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [];
