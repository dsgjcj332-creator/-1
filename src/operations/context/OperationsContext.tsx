import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
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
  SupportTicket,
  OrderLifecycleStatus,
  DeliveryJobStatus,
  MerchantApplicationStatus
} from '../types';
import {
  INITIAL_COMMISSION_CONFIG,
  INITIAL_SERVICE_ZONES,
  INITIAL_MERCHANTS,
  INITIAL_DRIVERS,
  INITIAL_USERS,
  INITIAL_MERCHANT_APPLICATIONS,
  INITIAL_ORDERS,
  INITIAL_DELIVERY_JOBS,
  INITIAL_SETTLEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SUPPORT_TICKETS
} from '../data/initialData';
import { api } from '../../api/client';

interface OperationsContextType {
  // Current session & active persona
  currentUser: OperationsUser;
  switchUser: (userId: string) => void;
  availableUsers: OperationsUser[];
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;

  // Domain entities
  merchants: MerchantBusiness[];
  currentMerchant: MerchantBusiness | null;
  applications: MerchantApplication[];
  orders: LaundryOrder[];
  deliveryJobs: DeliveryJob[];
  drivers: DeliveryDriver[];
  currentDriver: DeliveryDriver | null;
  settlements: SettlementStatement[];
  commissionConfig: CommissionConfig;
  serviceZones: ServiceZone[];
  auditLogs: AuditLogEntry[];
  supportTickets: SupportTicket[];

  // Role-isolated filtered views
  filteredOrders: LaundryOrder[];
  filteredDeliveryJobs: DeliveryJob[];
  filteredSettlements: SettlementStatement[];

  // Merchant Application Review actions (Admin)
  reviewApplication: (
    appId: string,
    status: MerchantApplicationStatus,
    notes?: string,
    reason?: string
  ) => void;
  advanceOnboardingStage: (
    appId: string,
    stage: 'pending_docs' | 'commercial_terms' | 'catalog_setup' | 'activated'
  ) => void;
  addLandingApplication: (appData: any) => string;

  // Order Lifecycle & Intake actions (Merchant & Admin)
  acceptOrder: (orderId: string, notes?: string) => void;
  rejectOrder: (orderId: string, reason: string) => void;
  recordIntakeInspection: (
    orderId: string,
    inspectedItems: Array<{
      itemId: string;
      receivedQty: number;
      stainsDamageNote?: string;
      unitPrice: number;
    }>,
    discrepancyReason?: string,
    extraChargeEgp?: number,
    requiresCustomerApproval?: boolean
  ) => void;
  simulateCustomerApproval: (orderId: string, approved: boolean) => void;
  startOrderProcessing: (orderId: string) => void;
  markOrderReadyForDelivery: (orderId: string) => void;
  completeOrder: (orderId: string) => void;

  // Delivery & Dispatch actions (Dispatcher & Driver)
  assignDriverToJob: (jobId: string, driverId: string) => void;
  reassignJob: (jobId: string, newDriverId: string, reason: string) => void;
  driverUpdateJobStatus: (
    jobId: string,
    status: DeliveryJobStatus,
    proofNote?: string,
    cashCollected?: boolean
  ) => void;
  driverLogFailedAttempt: (jobId: string, reason: string) => void;

  // Financial, Commission & Settlement actions (Finance & Admin)
  updateCommissionConfig: (newConfig: Partial<CommissionConfig>) => void;
  generateSettlementStatement: (merchantId: string, periodStart: string, periodEnd: string) => SettlementStatement;
  approveSettlement: (settlementId: string) => void;
  recordSettlementPayout: (settlementId: string, transferRef: string, payoutDate: string) => void;

  // Service Zones & Catalog
  toggleZoneActive: (zoneId: string) => void;
  updateMerchantDetails: (merchantId: string, updates: Partial<MerchantBusiness>) => void;
  addMerchant: (merchant: Omit<MerchantBusiness, 'id' | 'rating' | 'totalOrdersFulfilled'>) => void;
  addDriver: (driver: Omit<DeliveryDriver, 'id' | 'driverCode' | 'activeJobsCount' | 'completedJobsTotal' | 'failedDeliveriesCount' | 'cashInHandEgp' | 'rating'>) => void;

  // Support & Disputes
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  resolveSupportTicket: (ticketId: string, resolution: string, financialAdj?: number) => void;

  // Export utility
  exportToCsv: (data: any[], filename: string) => void;
}

const STORAGE_KEY_PREFIX = 'ala_el_saree_ops_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export const OperationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    try {
      return (localStorage.getItem('ala_el_saree_ops_lang') as 'ar' | 'en') || 'ar';
    } catch {
      return 'ar';
    }
  });

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    try {
      localStorage.setItem('ala_el_saree_ops_lang', lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const [currentUser, setCurrentUser] = useState<OperationsUser>(() =>
    loadFromStorage('current_user', INITIAL_USERS[0])
  );

  const [merchants, setMerchants] = useState<MerchantBusiness[]>(() =>
    loadFromStorage('merchants', INITIAL_MERCHANTS)
  );

  const [applications, setApplications] = useState<MerchantApplication[]>(() =>
    loadFromStorage('applications', INITIAL_MERCHANT_APPLICATIONS)
  );

  const [orders, setOrders] = useState<LaundryOrder[]>(() =>
    loadFromStorage('orders', INITIAL_ORDERS)
  );

  const [deliveryJobs, setDeliveryJobs] = useState<DeliveryJob[]>(() =>
    loadFromStorage('delivery_jobs', INITIAL_DELIVERY_JOBS)
  );

  const [drivers, setDrivers] = useState<DeliveryDriver[]>(() =>
    loadFromStorage('drivers', INITIAL_DRIVERS)
  );

  const [settlements, setSettlements] = useState<SettlementStatement[]>(() =>
    loadFromStorage('settlements', INITIAL_SETTLEMENTS)
  );

  const [commissionConfig, setCommissionConfig] = useState<CommissionConfig>(() =>
    loadFromStorage('commission_config', INITIAL_COMMISSION_CONFIG)
  );

  const [serviceZones, setServiceZones] = useState<ServiceZone[]>(() =>
    loadFromStorage('service_zones', INITIAL_SERVICE_ZONES)
  );

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    loadFromStorage('audit_logs', INITIAL_AUDIT_LOGS)
  );

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() =>
    loadFromStorage('support_tickets', INITIAL_SUPPORT_TICKETS)
  );

  // Sync state changes to storage
  useEffect(() => saveToStorage('current_user', currentUser), [currentUser]);
  useEffect(() => saveToStorage('merchants', merchants), [merchants]);
  useEffect(() => saveToStorage('applications', applications), [applications]);
  useEffect(() => saveToStorage('orders', orders), [orders]);
  useEffect(() => saveToStorage('delivery_jobs', deliveryJobs), [deliveryJobs]);
  useEffect(() => saveToStorage('drivers', drivers), [drivers]);
  useEffect(() => saveToStorage('settlements', settlements), [settlements]);
  useEffect(() => saveToStorage('commission_config', commissionConfig), [commissionConfig]);
  useEffect(() => saveToStorage('service_zones', serviceZones), [serviceZones]);
  useEffect(() => saveToStorage('audit_logs', auditLogs), [auditLogs]);
  useEffect(() => saveToStorage('support_tickets', supportTickets), [supportTickets]);

  const syncDataFromBackend = async () => {
    try {
      const [
        merchantsRes,
        ordersRes,
        tasksRes,
        driversRes,
        appsRes,
        settlementsRes,
        logsRes,
        ticketsRes
      ] = await Promise.allSettled([
        api.merchants.list(),
        api.orders.list(),
        api.delivery.getTasks(),
        api.delivery.getDrivers(),
        api.applications.list(),
        api.finance.getSettlements(),
        api.system.getAuditLogs(),
        api.system.getSupportTickets()
      ]);

      if (merchantsRes.status === 'fulfilled' && merchantsRes.value?.merchants) {
        setMerchants(merchantsRes.value.merchants);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.orders) {
        setOrders(ordersRes.value.orders);
      }
      if (tasksRes.status === 'fulfilled' && tasksRes.value?.tasks) {
        setDeliveryJobs(tasksRes.value.tasks);
      }
      if (driversRes.status === 'fulfilled' && driversRes.value?.drivers) {
        setDrivers(driversRes.value.drivers);
      }
      if (appsRes.status === 'fulfilled' && appsRes.value?.applications) {
        setApplications(appsRes.value.applications);
      }
      if (settlementsRes.status === 'fulfilled' && settlementsRes.value?.settlements) {
        setSettlements(settlementsRes.value.settlements);
      }
      if (logsRes.status === 'fulfilled' && logsRes.value?.logs) {
        setAuditLogs(logsRes.value.logs);
      }
      if (ticketsRes.status === 'fulfilled' && ticketsRes.value?.tickets) {
        setSupportTickets(ticketsRes.value.tickets);
      }
    } catch (e) {
      console.error('[OperationsContext] Failed to sync data from backend:', e);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        'alasaree_active_persona',
        JSON.stringify({
          id: currentUser.id,
          role: currentUser.role,
          merchantId: currentUser.merchantId,
          driverId: currentUser.driverId,
          name: currentUser.name
        })
      );
    } catch {
      // Ignore
    }
    syncDataFromBackend();
  }, [currentUser.id]);

  const addAuditLog = (
    action: string,
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    details: string,
    beforeSnapshot?: string,
    afterSnapshot?: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      entityType,
      entityId,
      details,
      beforeSnapshot,
      afterSnapshot
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const switchUser = (userId: string) => {
    const user = INITIAL_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      try {
        localStorage.setItem(
          'alasaree_active_persona',
          JSON.stringify({
            id: user.id,
            role: user.role,
            merchantId: user.merchantId,
            driverId: user.driverId,
            name: user.name
          })
        );
      } catch {
        // Ignore
      }
      addAuditLog(
        `تبديل هوية المستخدم إلى ${user.name} (${user.role})`,
        'application',
        user.id,
        `تم تسجيل الدخول بصلاحية: ${user.role}`
      );
    }
  };

  // Derive current merchant and driver
  const currentMerchant = useMemo(() => {
    if (currentUser.merchantId) {
      return merchants.find(m => m.id === currentUser.merchantId) || null;
    }
    return null;
  }, [currentUser, merchants]);

  const currentDriver = useMemo(() => {
    if (currentUser.driverId) {
      return drivers.find(d => d.id === currentUser.driverId) || null;
    }
    return null;
  }, [currentUser, drivers]);

  // Role-based data isolation
  const filteredOrders = useMemo(() => {
    if (currentUser.role === 'merchant_owner' || currentUser.role === 'merchant_staff') {
      return orders.filter(o => o.merchantId === currentUser.merchantId);
    }
    if (currentUser.role === 'driver') {
      // Driver only sees orders related to their assigned pickup or return jobs
      const driverJobOrderIds = deliveryJobs
        .filter(j => j.assignedDriverId === currentUser.driverId)
        .map(j => j.orderId);
      return orders.filter(o => driverJobOrderIds.includes(o.id));
    }
    // Admin / Dispatcher sees all
    return orders;
  }, [currentUser, orders, deliveryJobs]);

  const filteredDeliveryJobs = useMemo(() => {
    if (currentUser.role === 'driver') {
      return deliveryJobs.filter(j => j.assignedDriverId === currentUser.driverId);
    }
    if (currentUser.role === 'merchant_owner' || currentUser.role === 'merchant_staff') {
      // Merchant only sees pickup jobs to their shop and return jobs from their shop
      const merchantOrderIds = orders
        .filter(o => o.merchantId === currentUser.merchantId)
        .map(o => o.id);
      return deliveryJobs.filter(j => merchantOrderIds.includes(j.orderId));
    }
    return deliveryJobs;
  }, [currentUser, deliveryJobs, orders]);

  const filteredSettlements = useMemo(() => {
    if (currentUser.role === 'merchant_owner' || currentUser.role === 'merchant_staff') {
      return settlements.filter(s => s.merchantId === currentUser.merchantId);
    }
    return settlements;
  }, [currentUser, settlements]);

  // Applications
  const reviewApplication = (
    appId: string,
    status: MerchantApplicationStatus,
    notes?: string,
    reason?: string
  ) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            status,
            reviewedBy: currentUser.name,
            reviewerNotes: notes || app.reviewerNotes,
            decisionReason: reason || app.decisionReason,
            onboardingStage: status === 'approved' ? (app.onboardingStage || 'pending_docs') : app.onboardingStage
          };
        }
        return app;
      })
    );
    addAuditLog(
      `تحديث حالة طلب انضمام المغسلة إلى (${status})`,
      'application',
      appId,
      `المراجع: ${currentUser.name} | الملاحظات: ${notes || 'لا يوجد'}`
    );
    api.applications.review(appId, {
      status,
      reviewerNotes: notes,
      decisionReason: reason
    }).then(() => syncDataFromBackend()).catch(console.error);
  };

  const advanceOnboardingStage = (
    appId: string,
    stage: 'pending_docs' | 'commercial_terms' | 'catalog_setup' | 'activated'
  ) => {
    const targetApp = applications.find(a => a.id === appId);
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, onboardingStage: stage } : app))
    );

    // If activated, provision the merchant business in the directory
    if (stage === 'activated' && targetApp) {
      const newMerchant: MerchantBusiness = {
        id: `m-act-${Date.now().toString().slice(-4)}`,
        nameAr: targetApp.businessName,
        nameEn: targetApp.businessName,
        commercialRegNo: `CR-${Math.floor(100000 + Math.random() * 900000)}`,
        taxNumber: `TAX-${Math.floor(100000 + Math.random() * 900000)}`,
        ownerName: targetApp.applicantName,
        phone: targetApp.mobile,
        governorate: targetApp.governorate,
        city: targetApp.city,
        district: targetApp.address,
        address: targetApp.address,
        status: 'active',
        commissionRate: commissionConfig.commissionRatePercent / 100,
        serviceFeePayer: commissionConfig.platformFeePayer,
        capacityBagsPerDay: 40,
        activeHours: '09:00 ص - 11:00 م',
        payoutMethod: 'instapay',
        payoutDetails: `${targetApp.mobile}@instapay`,
        rating: 5.0,
        totalOrdersFulfilled: 0
      };
      setMerchants(prev => [...prev, newMerchant]);
      addAuditLog(
        `تفعيل شريك مغسلة جديد رسمياً (${targetApp.businessName})`,
        'merchant',
        newMerchant.id,
        `تم إكمال كافة خطوات التأهيل وتفعيل الحساب بنجاح في مدينة ${targetApp.city}`
      );
    }

    api.applications.review(appId, {
      onboardingStage: stage,
      status: stage === 'activated' ? 'approved' : undefined
    }).then(() => syncDataFromBackend()).catch(console.error);
  };

  const addLandingApplication = (appData: any): string => {
    const refNum = `APP-${(appData.city || 'EG').slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: MerchantApplication = {
      id: `app-${Date.now()}`,
      referenceNumber: refNum,
      applicantName: appData.applicantName || 'مقدم طلب',
      businessName: appData.businessName || 'مغسلة جديدة',
      mobile: appData.mobile || '01000000000',
      governorate: appData.governorate || 'الشرقية',
      city: appData.city || 'الزقازيق',
      address: appData.address || '',
      services: appData.services || ['غسيل وكي بخار'],
      operatingStatus: appData.operatingStatus || 'قائمة وتعمل',
      contactMethod: appData.contactMethod || 'واتساب',
      email: appData.email,
      whatsapp: appData.whatsapp,
      website: appData.website,
      capacity: appData.capacity,
      notes: appData.notes,
      privacyConsent: true,
      status: 'new',
      receivedAt: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    addAuditLog(
      'استلام طلب انضمام شريك مغسلة من الموقع التعريفي',
      'application',
      newApp.id,
      `طلب من: ${newApp.applicantName} (${newApp.businessName}) برقم مرجعي ${refNum}`
    );

    api.applications.submit(appData).then(() => syncDataFromBackend()).catch(console.error);
    return refNum;
  };

  // Orders
  const acceptOrder = (orderId: string, notes?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const nextStatus: OrderLifecycleStatus = 'accepted';
          return {
            ...ord,
            status: nextStatus,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: nextStatus,
                timestamp: new Date().toISOString(),
                actor: currentUser.name,
                note: notes || 'تم قبول الطلب وبدء الجدولة'
              }
            ]
          };
        }
        return ord;
      })
    );
    addAuditLog('قبول طلب من المغسلة', 'order', orderId, `قام ${currentUser.name} بقبول الطلب`);
    api.orders.updateStatus(orderId, 'accepted', notes).then(() => syncDataFromBackend()).catch(console.error);
  };

  const rejectOrder = (orderId: string, reason: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const nextStatus: OrderLifecycleStatus = 'rejected';
          return {
            ...ord,
            status: nextStatus,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: nextStatus,
                timestamp: new Date().toISOString(),
                actor: currentUser.name,
                note: `تم رفض الطلب: ${reason}`
              }
            ]
          };
        }
        return ord;
      })
    );
    addAuditLog('رفض طلب من المغسلة', 'order', orderId, `السبب: ${reason}`);
    api.orders.updateStatus(orderId, 'rejected', reason).then(() => syncDataFromBackend()).catch(console.error);
  };

  const recordIntakeInspection = (
    orderId: string,
    inspectedItems: Array<{
      itemId: string;
      receivedQty: number;
      stainsDamageNote?: string;
      unitPrice: number;
    }>,
    discrepancyReason?: string,
    extraChargeEgp: number = 0,
    requiresCustomerApproval: boolean = false
  ) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedItems = ord.items.map(item => {
            const insp = inspectedItems.find(i => i.itemId === item.id);
            if (insp) {
              return {
                ...item,
                receivedQuantity: insp.receivedQty,
                stainDamageNotes: insp.stainsDamageNote
              };
            }
            return item;
          });

          const newLaundrySubtotal = ord.laundrySubtotal + extraChargeEgp;
          const commissionAmount = Math.round(newLaundrySubtotal * ord.commissionRate * 100) / 100;
          const merchantPayableAmount = Math.round((newLaundrySubtotal - commissionAmount) * 100) / 100;
          const customerTotalPaid =
            ord.platformFeePayer === 'customer'
              ? newLaundrySubtotal + ord.platformFee + ord.deliveryFeeCustomer
              : newLaundrySubtotal + ord.deliveryFeeCustomer;

          const nextStatus: OrderLifecycleStatus = requiresCustomerApproval
            ? 'awaiting_customer_approval'
            : 'processing';

          return {
            ...ord,
            items: updatedItems,
            laundrySubtotal: newLaundrySubtotal,
            adjustmentsTotal: extraChargeEgp,
            commissionAmount,
            merchantPayableAmount,
            customerTotalPaid,
            status: nextStatus,
            discrepancy:
              extraChargeEgp !== 0 || requiresCustomerApproval
                ? {
                    detectedAt: new Date().toISOString(),
                    reportedBy: currentUser.name,
                    originalSubtotal: ord.laundrySubtotal,
                    revisedSubtotal: newLaundrySubtotal,
                    differenceEgp: extraChargeEgp,
                    reason: discrepancyReason || 'فروقات قطع أو إضافات معالجة خاصة',
                    customerApprovalStatus: requiresCustomerApproval ? 'pending' : 'not_required',
                    photoNotes: 'تم توثيق حالة القطع في سجل الفحص'
                  }
                : undefined,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: nextStatus,
                timestamp: new Date().toISOString(),
                actor: currentUser.name,
                note: requiresCustomerApproval
                  ? `تم رصد فروق بقيمة ${extraChargeEgp} ج.م وبانتظار موافقة العميل`
                  : 'تم تأكيد استلام الملابس وبدء الغسيل والمعالجة'
              }
            ]
          };
        }
        return ord;
      })
    );
    addAuditLog(
      'تسجيل فحص الاستلام والفروقات',
      'order',
      orderId,
      `فروق التكلفة: ${extraChargeEgp} ج.م | يتطلب موافقة: ${requiresCustomerApproval ? 'نعم' : 'لا'}`
    );

    api.inspections.recordIntake(orderId, {
      inspectedItems,
      discrepancyReason,
      extraChargeEgp,
      requiresCustomerApproval
    }).then(() => syncDataFromBackend()).catch(console.error);
  };

  const simulateCustomerApproval = (orderId: string, approved: boolean) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId && ord.discrepancy) {
          const nextStatus: OrderLifecycleStatus = approved ? 'processing' : 'inspection_required';
          return {
            ...ord,
            status: nextStatus,
            discrepancy: {
              ...ord.discrepancy,
              customerApprovalStatus: approved ? 'approved' : 'rejected',
              customerRespondedAt: new Date().toISOString()
            },
            statusHistory: [
              ...ord.statusHistory,
              {
                status: nextStatus,
                timestamp: new Date().toISOString(),
                actor: 'العميل (عبر التطبيق)',
                note: approved
                  ? `وافق العميل على التعديل الجديد بقيمة ${ord.laundrySubtotal} ج.م`
                  : 'رفض العميل التعديل الإضافي - يرجى مراجعة تفاصيل القطعة'
              }
            ]
          };
        }
        return ord;
      })
    );
    addAuditLog(
      approved ? 'موافقة العميل على فروق التكلفة' : 'رفض العميل لفروق التكلفة',
      'order',
      orderId,
      approved ? 'العميل وافق وبدأ الغسيل الفعلي' : 'العميل رفض التعديل'
    );
    api.inspections.approvePrice(orderId, approved).then(() => syncDataFromBackend()).catch(console.error);
  };

  const startOrderProcessing = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'processing',
            statusHistory: [
              ...ord.statusHistory,
              {
                status: 'processing',
                timestamp: new Date().toISOString(),
                actor: currentUser.name,
                note: 'بدء مراحل الغسيل والكي والتعطير'
              }
            ]
          };
        }
        return ord;
      })
    );
    addAuditLog('بدء تشغيل وغسيل الطلب', 'order', orderId, 'تم التحويل إلى قيد الغسيل');
    api.orders.updateStatus(orderId, 'processing').then(() => syncDataFromBackend()).catch(console.error);
  };

  const markOrderReadyForDelivery = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    let newJobId: string | undefined;

    if (targetOrder && !targetOrder.deliveryJobId) {
      // Create return delivery leg job!
      newJobId = `job-rt-${Date.now().toString().slice(-4)}`;
      const returnJob: DeliveryJob = {
        id: newJobId,
        jobReference: `JOB-RT-${targetOrder.orderNumber.slice(-8)}`,
        orderId: targetOrder.id,
        orderNumber: targetOrder.orderNumber,
        jobType: 'return_delivery',
        originName: targetOrder.merchantName,
        originAddress: `${targetOrder.neighborhood} - مقر المغسلة`,
        originPhone: '01012345671',
        destinationName: targetOrder.customerName,
        destinationAddress: targetOrder.deliveryAddress,
        destinationPhone: targetOrder.customerPhone,
        serviceZone: targetOrder.city,
        scheduledWindow: 'خلال الساعتين القادمتين',
        status: 'awaiting_assignment',
        attemptCount: 0,
        cashToCollectEgp: targetOrder.paymentMethod === 'cash_on_delivery' ? targetOrder.customerTotalPaid : 0,
        cashCollected: false
      };
      setDeliveryJobs(prev => [returnJob, ...prev]);
    }

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'ready_for_delivery',
            deliveryJobId: newJobId || ord.deliveryJobId,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: 'ready_for_delivery',
                timestamp: new Date().toISOString(),
                actor: currentUser.name,
                note: 'اكتملت العناية بالملابس وتغليفها وجاهزة لتوصيل المندوب'
              }
            ]
          };
        }
        return ord;
      })
    );
    addAuditLog('تجهيز الطلب للتسليم', 'order', orderId, 'الملابس جاهزة للتوصيل وإنشاء مهمة التوصيل العكسي');
    api.orders.updateStatus(orderId, 'ready_for_delivery').then(() => syncDataFromBackend()).catch(console.error);
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'completed',
            paymentStatus: 'paid',
            statusHistory: [
              ...ord.statusHistory,
              {
                status: 'completed',
                timestamp: new Date().toISOString(),
                actor: currentUser.name,
                note: 'تم إغلاق الطلب بنجاح وتأكيد التسليم والمحاسبة'
              }
            ]
          };
        }
        return ord;
      })
    );
    addAuditLog('إغلاق واكتمال الطلب', 'order', orderId, 'تم إنهاء دورة حياة الطلب بالكامل');
    api.orders.updateStatus(orderId, 'completed').then(() => syncDataFromBackend()).catch(console.error);
  };

  // Dispatch & Delivery
  const assignDriverToJob = (jobId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;

    setDeliveryJobs(prev =>
      prev.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            assignedDriverId: driver.id,
            assignedDriverName: driver.name,
            assignedDriverPhone: driver.mobile,
            status: 'assigned',
            assignedAt: new Date().toISOString()
          };
        }
        return job;
      })
    );

    // Update driver active workload
    setDrivers(prev =>
      prev.map(d => (d.id === driverId ? { ...d, activeJobsCount: d.activeJobsCount + 1 } : d))
    );

    // Update associated order status
    const targetJob = deliveryJobs.find(j => j.id === jobId);
    if (targetJob) {
      const isPickup = targetJob.jobType === 'pickup';
      setOrders(prev =>
        prev.map(ord => {
          if (ord.id === targetJob.orderId) {
            const nextStatus: OrderLifecycleStatus = isPickup ? 'pickup_assigned' : 'delivery_assigned';
            return {
              ...ord,
              status: nextStatus,
              statusHistory: [
                ...ord.statusHistory,
                {
                  status: nextStatus,
                  timestamp: new Date().toISOString(),
                  actor: currentUser.name,
                  note: `إسناد مهمة ${isPickup ? 'الاستلام' : 'التوصيل'} للمندوب: ${driver.name}`
                }
              ]
            };
          }
          return ord;
        })
      );
    }

    addAuditLog('إسناد مهمة توصيل لمندوب', 'delivery', jobId, `المندوب: ${driver.name} (${driver.driverCode})`);
    api.delivery.assignTask(jobId, driverId).then(() => syncDataFromBackend()).catch(console.error);
  };

  const reassignJob = (jobId: string, newDriverId: string, reason: string) => {
    const targetJob = deliveryJobs.find(j => j.id === jobId);
    const oldDriverId = targetJob?.assignedDriverId;
    const newDriver = drivers.find(d => d.id === newDriverId);
    if (!newDriver) return;

    setDeliveryJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            assignedDriverId: newDriver.id,
            assignedDriverName: newDriver.name,
            assignedDriverPhone: newDriver.mobile,
            status: 'assigned',
            assignedAt: new Date().toISOString()
          };
        }
        return j;
      })
    );

    // Adjust workload counts
    setDrivers(prev =>
      prev.map(d => {
        if (d.id === oldDriverId && d.activeJobsCount > 0) {
          return { ...d, activeJobsCount: d.activeJobsCount - 1 };
        }
        if (d.id === newDriverId) {
          return { ...d, activeJobsCount: d.activeJobsCount + 1 };
        }
        return d;
      })
    );

    addAuditLog(
      'إعادة إسناد مهمة توصيل',
      'delivery',
      jobId,
      `تم النقل إلى: ${newDriver.name} | السبب: ${reason}`
    );
    api.delivery.assignTask(jobId, newDriverId).then(() => syncDataFromBackend()).catch(console.error);
  };

  const driverUpdateJobStatus = (
    jobId: string,
    status: DeliveryJobStatus,
    proofNote?: string,
    cashCollected?: boolean
  ) => {
    const job = deliveryJobs.find(j => j.id === jobId);
    if (!job) return;

    setDeliveryJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            status,
            proofNote: proofNote || j.proofNote,
            cashCollected: cashCollected !== undefined ? cashCollected : j.cashCollected,
            completedAt: status === 'completed' ? new Date().toISOString() : j.completedAt
          };
        }
        return j;
      })
    );

    // Update Driver stats on completion
    if (status === 'completed' && job.assignedDriverId) {
      setDrivers(prev =>
        prev.map(d => {
          if (d.id === job.assignedDriverId) {
            return {
              ...d,
              activeJobsCount: Math.max(0, d.activeJobsCount - 1),
              completedJobsTotal: d.completedJobsTotal + 1,
              cashInHandEgp: cashCollected ? d.cashInHandEgp + job.cashToCollectEgp : d.cashInHandEgp
            };
          }
          return d;
        })
      );
    }

    // Update order status corresponding to delivery leg
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === job.orderId) {
          let nextOrderStatus = ord.status;
          let note = '';

          if (job.jobType === 'pickup') {
            if (status === 'arrived_pickup') {
              note = 'وصل المندوب لموقع العميل لاستلام الملابس';
            } else if (status === 'completed') {
              nextOrderStatus = 'collected';
              note = 'تم استلام كيس الملابس من العميل بنجاح وفي طريقه للمغسلة';
            }
          } else {
            // return delivery
            if (status === 'en_route_pickup') {
              nextOrderStatus = 'out_for_delivery';
              note = 'المندوب في طريقه لتسليم الملابس للعميل';
            } else if (status === 'completed') {
              nextOrderStatus = 'delivered';
              note = `تم تسليم الملابس للعميل بنجاح${cashCollected ? ` وتحصيل ${job.cashToCollectEgp} ج.م نقداً` : ''}`;
            }
          }

          return {
            ...ord,
            status: nextOrderStatus,
            paymentStatus: cashCollected ? 'paid' : ord.paymentStatus,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: nextOrderStatus,
                timestamp: new Date().toISOString(),
                actor: currentUser.name,
                note: note || `تحديث حالة التوصيل: ${status}`
              }
            ]
          };
        }
        return ord;
      })
    );

    addAuditLog('تحديث حالة مهمة التوصيل', 'delivery', jobId, `الحالة الجديدة: ${status}`);
    api.delivery.updateTaskStatus(jobId, { status, proofNote, cashCollected }).then(() => syncDataFromBackend()).catch(console.error);
  };

  const driverLogFailedAttempt = (jobId: string, reason: string) => {
    const job = deliveryJobs.find(j => j.id === jobId);
    if (!job) return;

    setDeliveryJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'attempt_failed',
            attemptCount: j.attemptCount + 1,
            failureReason: reason
          };
        }
        return j;
      })
    );

    if (job.assignedDriverId) {
      setDrivers(prev =>
        prev.map(d =>
          d.id === job.assignedDriverId
            ? { ...d, failedDeliveriesCount: d.failedDeliveriesCount + 1 }
            : d
        )
      );
    }

    // Update order status to failed pickup or failed delivery
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === job.orderId) {
          const failStatus: OrderLifecycleStatus =
            job.jobType === 'pickup' ? 'failed_pickup' : 'failed_delivery';
          return {
            ...ord,
            status: failStatus,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: failStatus,
                timestamp: new Date().toISOString(),
                actor: currentUser.name,
                note: `تعذر إتمام المحاولة: ${reason}`
              }
            ]
          };
        }
        return ord;
      })
    );

    addAuditLog(
      'تسجيل تعذر محاولة توصيل/استلام',
      'delivery',
      jobId,
      `المندوب: ${currentUser.name} | السبب: ${reason}`
    );
    api.delivery.updateTaskStatus(jobId, { status: 'attempt_failed', proofNote: reason }).then(() => syncDataFromBackend()).catch(console.error);
  };

  // Commission & Financial
  const updateCommissionConfig = (newConfig: Partial<CommissionConfig>) => {
    const updated = { ...commissionConfig, ...newConfig };
    setCommissionConfig(updated);
    addAuditLog(
      'تحديث القواعد المالية والعمولات',
      'commission_rule',
      'global_config',
      `نسبة عمولة المغسلة: ${updated.commissionRatePercent}% | رسوم المنصة: ${updated.platformFeeEgp} ج.م (يتحملها: ${updated.platformFeePayer === 'customer' ? 'العميل' : 'المغسلة'})`
    );
  };

  const generateSettlementStatement = (
    merchantId: string,
    periodStart: string,
    periodEnd: string
  ): SettlementStatement => {
    const merchant = merchants.find(m => m.id === merchantId);
    const eligibleOrders = orders.filter(
      o =>
        o.merchantId === merchantId &&
        (o.status === 'completed' || o.status === 'delivered') &&
        !o.isSettled
    );

    const totalOrdersCount = eligibleOrders.length;
    const grossLaundryValue = eligibleOrders.reduce((sum, o) => sum + o.laundrySubtotal, 0);
    const commissionDeducted = Math.round(grossLaundryValue * (merchant?.commissionRate || 0.08) * 100) / 100;
    const platformFeesDeducted =
      merchant?.serviceFeePayer === 'merchant'
        ? eligibleOrders.reduce((sum, o) => sum + o.platformFee, 0)
        : 0;
    const netPayableAmount = grossLaundryValue - commissionDeducted - platformFeesDeducted;

    const statementNumber = `STL-${merchantId.slice(0, 5).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newStatement: SettlementStatement = {
      id: `stl-${Date.now()}`,
      statementNumber,
      merchantId,
      merchantName: merchant?.nameAr || 'المغسلة',
      periodStart,
      periodEnd,
      totalOrdersCount,
      grossLaundryValue,
      commissionDeducted,
      platformFeesDeducted,
      netPayableAmount,
      status: 'pending_review',
      generatedAt: new Date().toISOString(),
      orderIds: eligibleOrders.map(o => o.id)
    };

    setSettlements(prev => [newStatement, ...prev]);

    // Mark orders as pending settlement
    setOrders(prev =>
      prev.map(ord => {
        if (eligibleOrders.some(eo => eo.id === ord.id)) {
          return { ...ord, settlementId: newStatement.id };
        }
        return ord;
      })
    );

    addAuditLog(
      'إنشاء كشف تسوية مستحقات للمغسلة',
      'settlement',
      newStatement.id,
      `المغسلة: ${newStatement.merchantName} | الصافي المستحق: ${netPayableAmount} ج.م | عدد الطلبات: ${totalOrdersCount}`
    );

    api.finance.generateSettlement(merchantId, periodStart, periodEnd).then(() => syncDataFromBackend()).catch(console.error);
    return newStatement;
  };

  const approveSettlement = (settlementId: string) => {
    setSettlements(prev =>
      prev.map(stl => {
        if (stl.id === settlementId) {
          return {
            ...stl,
            status: 'approved',
            approvedBy: currentUser.name,
            approvedAt: new Date().toISOString()
          };
        }
        return stl;
      })
    );
    addAuditLog('اعتماد كشف تسوية مالية', 'settlement', settlementId, `المعتمد: ${currentUser.name}`);
    api.finance.payoutSettlement(settlementId).then(() => syncDataFromBackend()).catch(console.error);
  };

  const recordSettlementPayout = (
    settlementId: string,
    transferRef: string,
    payoutDate: string
  ) => {
    setSettlements(prev =>
      prev.map(stl => {
        if (stl.id === settlementId) {
          return {
            ...stl,
            status: 'paid',
            bankTransferReference: transferRef,
            payoutDate
          };
        }
        return stl;
      })
    );

    // Mark associated orders as settled
    const targetStatement = settlements.find(s => s.id === settlementId);
    if (targetStatement) {
      setOrders(prev =>
        prev.map(ord => {
          if (targetStatement.orderIds.includes(ord.id)) {
            return { ...ord, isSettled: true };
          }
          return ord;
        })
      );
    }

    addAuditLog(
      'تسجيل تحويل مستحقات المغسلة وتأكيد الصرف',
      'settlement',
      settlementId,
      `الرقم المرجعي للتحويل: ${transferRef} | تاريخ الصرف: ${payoutDate}`
    );
    api.finance.payoutSettlement(settlementId, transferRef).then(() => syncDataFromBackend()).catch(console.error);
  };

  const toggleZoneActive = (zoneId: string) => {
    setServiceZones(prev =>
      prev.map(z => (z.id === zoneId ? { ...z, isActive: !z.isActive } : z))
    );
    addAuditLog('تعديل حالة النطاق الجغرافي للخدمة', 'commission_rule', zoneId, `تم تغيير حالة التفعيل`);
  };

  const updateMerchantDetails = (merchantId: string, updates: Partial<MerchantBusiness>) => {
    setMerchants(prev =>
      prev.map(m => (m.id === merchantId ? { ...m, ...updates } : m))
    );
    addAuditLog('تحديث بيانات المغسلة', 'merchant', merchantId, 'تحديث تفاصيل الحساب التشغيلي');
  };

  const addMerchant = (data: Omit<MerchantBusiness, 'id' | 'rating' | 'totalOrdersFulfilled'>) => {
    const newMerchant: MerchantBusiness = {
      ...data,
      id: `m-dir-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      totalOrdersFulfilled: 0
    };
    setMerchants(prev => [newMerchant, ...prev]);
    addAuditLog(
      `إضافة مغسلة جديدة يدوياً (${newMerchant.nameAr})`,
      'merchant',
      newMerchant.id,
      `المدينة: ${newMerchant.city} | المالك: ${newMerchant.ownerName}`
    );
  };

  const addDriver = (data: Omit<DeliveryDriver, 'id' | 'driverCode' | 'activeJobsCount' | 'completedJobsTotal' | 'failedDeliveriesCount' | 'cashInHandEgp' | 'rating'>) => {
    const code = `DRV-${(data.serviceZone || 'ZAG').slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newDriver: DeliveryDriver = {
      ...data,
      id: `drv-${Date.now().toString().slice(-4)}`,
      driverCode: code,
      activeJobsCount: 0,
      completedJobsTotal: 0,
      failedDeliveriesCount: 0,
      cashInHandEgp: 0,
      rating: 5.0
    };
    setDrivers(prev => [newDriver, ...prev]);
    addAuditLog(
      `إضافة كابتن توصيل جديد (${newDriver.name})`,
      'delivery',
      newDriver.id,
      `الكود: ${code} | النطاق: ${newDriver.serviceZone}`
    );
  };

  const createSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TCK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString()
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    addAuditLog('فتح تذكرة بلاغ / نزاع تشغيلي', 'order', ticket.orderId, `التصنيف: ${ticket.category}`);
  };

  const resolveSupportTicket = (ticketId: string, resolution: string, financialAdj: number = 0) => {
    setSupportTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? {
              ...t,
              status: 'resolved',
              resolutionNotes: resolution,
              financialAdjustmentEgp: financialAdj
            }
          : t
      )
    );
    addAuditLog(
      'تسوية تذكرة بلاغ / شكوى',
      'order',
      ticketId,
      `الحل: ${resolution} | التسوية المالية: ${financialAdj} ج.م`
    );
  };

  const exportToCsv = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    const keys = Object.keys(data[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [
        keys.join(','),
        ...data.map(row =>
          keys
            .map(k => {
              const val = row[k];
              if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
              return val;
            })
            .join(',')
        )
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <OperationsContext.Provider
      value={{
        currentUser,
        switchUser,
        availableUsers: INITIAL_USERS,
        language,
        setLanguage,
        merchants,
        currentMerchant,
        applications,
        orders,
        deliveryJobs,
        drivers,
        currentDriver,
        settlements,
        commissionConfig,
        serviceZones,
        auditLogs,
        supportTickets,
        filteredOrders,
        filteredDeliveryJobs,
        filteredSettlements,
        reviewApplication,
        advanceOnboardingStage,
        addLandingApplication,
        acceptOrder,
        rejectOrder,
        recordIntakeInspection,
        simulateCustomerApproval,
        startOrderProcessing,
        markOrderReadyForDelivery,
        completeOrder,
        assignDriverToJob,
        reassignJob,
        driverUpdateJobStatus,
        driverLogFailedAttempt,
        updateCommissionConfig,
        generateSettlementStatement,
        approveSettlement,
        recordSettlementPayout,
        toggleZoneActive,
        updateMerchantDetails,
        addMerchant,
        addDriver,
        createSupportTicket,
        resolveSupportTicket,
        exportToCsv
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return context;
};
