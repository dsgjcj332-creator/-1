import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useOperations } from '../../operations/context/OperationsContext';
import { MerchantBusiness, LaundryOrder, OrderLifecycleStatus } from '../../operations/types';
import { api } from '../../api/client';

export interface MerchantStaffMember {
  id: string;
  name: string;
  role: 'owner' | 'counter_manager' | 'laundry_technician';
  phone: string;
  avatarUrl?: string;
}

export interface LaundryServiceItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'men' | 'women' | 'bedding' | 'formal' | 'care';
  washIronPrice: number;
  dryCleanPrice?: number;
  ironOnlyPrice?: number;
  isAvailable: boolean;
  estDurationHours: number;
}

export type WashProcessStage = 'intake_sorted' | 'washing_sanitizing' | 'drying' | 'steam_ironing' | 'perfumed_packaged';

interface MerchantAuthContextType {
  // Authentication & Isolation
  isAuthenticated: boolean;
  activeMerchant: MerchantBusiness | null;
  activeStaff: MerchantStaffMember | null;
  availableMerchants: MerchantBusiness[];
  login: (merchantId: string, pinCode?: string, staffName?: string) => boolean;
  logout: () => void;

  // Store Operational State
  isStoreAcceptingOrders: boolean;
  toggleStoreAcceptingOrders: () => void;
  dailyIntakeCap: number;
  setDailyIntakeCap: (cap: number) => void;

  // Service Catalog
  servicesCatalog: LaundryServiceItem[];
  toggleServiceAvailability: (serviceId: string) => void;
  updateServicePrice: (serviceId: string, type: 'washIron' | 'dryClean' | 'ironOnly', price: number) => void;

  // Wash Stages Tracking per order
  orderWashStages: Record<string, WashProcessStage>;
  setOrderWashStage: (orderId: string, stage: WashProcessStage) => void;

  // Isolated Merchant Data
  merchantOrders: LaundryOrder[];
  orderMetrics: {
    total: number;
    newAwaitingConfirmation: number;
    inspectionRequired: number;
    awaitingCustomerApproval: number;
    processing: number;
    readyForDelivery: number;
    completed: number;
    todayGrossEgp: number;
    todayCommissionEgp: number;
    todayNetEgp: number;
    occupancyPercent: number;
    avgRating: number;
  };
}

const MerchantAuthContext = createContext<MerchantAuthContextType | undefined>(undefined);

const DEFAULT_STAFF: Record<string, MerchantStaffMember> = {
  'm-zag-01': {
    id: 'staff-zag-01',
    name: 'أحمد فتحي القصاص',
    role: 'counter_manager',
    phone: '01012345671',
  },
  'm-zag-02': {
    id: 'staff-zag-02',
    name: 'محمود عبد العزيز الشاذلي',
    role: 'owner',
    phone: '01123456782',
  },
  'm-man-01': {
    id: 'staff-man-01',
    name: 'كريم البنا',
    role: 'counter_manager',
    phone: '01234567893',
  }
};

const INITIAL_CATALOG: LaundryServiceItem[] = [
  {
    id: 'srv-1',
    nameAr: 'قميص رجالي كلاسيك / كاجوال',
    nameEn: 'Men Casual/Classic Shirt',
    category: 'men',
    washIronPrice: 25,
    ironOnlyPrice: 15,
    dryCleanPrice: 35,
    isAvailable: true,
    estDurationHours: 6
  },
  {
    id: 'srv-2',
    nameAr: 'بنطلون جينز / قماش / جبردين',
    nameEn: 'Trousers / Jeans',
    category: 'men',
    washIronPrice: 30,
    ironOnlyPrice: 15,
    dryCleanPrice: 40,
    isAvailable: true,
    estDurationHours: 6
  },
  {
    id: 'srv-3',
    nameAr: 'بدلة كاملة (جاكيت + بنطلون)',
    nameEn: 'Full 2-Piece Suit',
    category: 'formal',
    washIronPrice: 90,
    dryCleanPrice: 120,
    ironOnlyPrice: 45,
    isAvailable: true,
    estDurationHours: 12
  },
  {
    id: 'srv-4',
    nameAr: 'عباية حريمي / فستان ناعم',
    nameEn: 'Abaya / Soft Dress',
    category: 'women',
    washIronPrice: 45,
    dryCleanPrice: 65,
    ironOnlyPrice: 25,
    isAvailable: true,
    estDurationHours: 8
  },
  {
    id: 'srv-5',
    nameAr: 'فستان سواريه / خطوبة حساس',
    nameEn: 'Evening / Formal Gown',
    category: 'formal',
    washIronPrice: 130,
    dryCleanPrice: 180,
    ironOnlyPrice: 70,
    isAvailable: true,
    estDurationHours: 24
  },
  {
    id: 'srv-6',
    nameAr: 'بطانية شتوي دبل كبيرة',
    nameEn: 'Large Double Blanket',
    category: 'bedding',
    washIronPrice: 120,
    dryCleanPrice: 150,
    isAvailable: true,
    estDurationHours: 24
  },
  {
    id: 'srv-7',
    nameAr: 'لحاف فايبر / ريش نعام',
    nameEn: 'Feather/Fiber Quilt',
    category: 'bedding',
    washIronPrice: 110,
    dryCleanPrice: 140,
    isAvailable: true,
    estDurationHours: 24
  },
  {
    id: 'srv-8',
    nameAr: 'جاكيت شتوي ووتربروف / بمب',
    nameEn: 'Puffer / Winter Jacket',
    category: 'men',
    washIronPrice: 75,
    dryCleanPrice: 95,
    ironOnlyPrice: 35,
    isAvailable: true,
    estDurationHours: 12
  },
  {
    id: 'srv-9',
    nameAr: 'ملاية سرير + 2 كيس مخدة',
    nameEn: 'Bed Sheet Set',
    category: 'bedding',
    washIronPrice: 40,
    dryCleanPrice: 55,
    ironOnlyPrice: 20,
    isAvailable: true,
    estDurationHours: 6
  }
];

export const MerchantAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { merchants, orders } = useOperations();

  // Active Merchant ID (persisted in localStorage for staff workflow convenience)
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('alasaree_active_merchant_id');
      if (saved && (saved === 'm-zag-01' || saved === 'm-zag-02' || saved === 'm-man-01')) {
        return saved;
      }
      return 'm-zag-01';
    } catch {
      return 'm-zag-01';
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('alasaree_merchant_authenticated');
      return val !== null ? val === 'true' : true; // Default authenticated for prototype preview
    } catch {
      return true;
    }
  });

  const [activeStaff, setActiveStaff] = useState<MerchantStaffMember | null>(() => {
    return DEFAULT_STAFF[selectedMerchantId] || {
      id: 'staff-default',
      name: 'أحمد فتحي القصاص',
      role: 'counter_manager',
      phone: '01012345671'
    };
  });

  // Store intake open toggle
  const [isStoreAcceptingOrders, setIsStoreAcceptingOrders] = useState<boolean>(true);
  const [dailyIntakeCap, setDailyIntakeCap] = useState<number>(60);

  // Service Catalog
  const [servicesCatalog, setServicesCatalog] = useState<LaundryServiceItem[]>(INITIAL_CATALOG);

  // Order Wash Stages tracker
  const [orderWashStages, setOrderWashStages] = useState<Record<string, WashProcessStage>>({
    'ord-102': 'washing_sanitizing',
    'ord-103': 'drying',
    'ord-104': 'steam_ironing'
  });

  const setOrderWashStage = (orderId: string, stage: WashProcessStage) => {
    setOrderWashStages(prev => ({
      ...prev,
      [orderId]: stage
    }));
  };

  const toggleServiceAvailability = (serviceId: string) => {
    const item = servicesCatalog.find(i => i.id === serviceId);
    setServicesCatalog(prev =>
      prev.map(it => (it.id === serviceId ? { ...it, isAvailable: !it.isAvailable } : it))
    );
    if (item && selectedMerchantId) {
      api.catalog.updatePrice(selectedMerchantId, {
        serviceId,
        isAvailable: !item.isAvailable
      }).catch(console.error);
    }
  };

  const updateServicePrice = (
    serviceId: string,
    type: 'washIron' | 'dryClean' | 'ironOnly',
    price: number
  ) => {
    setServicesCatalog(prev =>
      prev.map(item => {
        if (item.id !== serviceId) return item;
        if (type === 'washIron') return { ...item, washIronPrice: price };
        if (type === 'dryClean') return { ...item, dryCleanPrice: price };
        if (type === 'ironOnly') return { ...item, ironOnlyPrice: price };
        return item;
      })
    );
    if (selectedMerchantId) {
      const payload: any = { serviceId };
      if (type === 'washIron') payload.washIronPrice = price;
      if (type === 'dryClean') payload.dryCleanPrice = price;
      if (type === 'ironOnly') payload.ironOnlyPrice = price;
      api.catalog.updatePrice(selectedMerchantId, payload).catch(console.error);
    }
  };

  // Sync active merchant from authoritative list
  const activeMerchant = useMemo(() => {
    return merchants.find(m => m.id === selectedMerchantId) || merchants[0] || null;
  }, [merchants, selectedMerchantId]);

  const login = (merchantId: string, pinCode?: string, staffName?: string): boolean => {
    const target = merchants.find(m => m.id === merchantId);
    if (!target) return false;

    setSelectedMerchantId(merchantId);
    setIsAuthenticated(true);
    const chosenName = staffName || DEFAULT_STAFF[merchantId]?.name || 'مسؤول الوردية';
    setActiveStaff({
      id: `staff-${Date.now().toString().slice(-4)}`,
      name: chosenName,
      role: DEFAULT_STAFF[merchantId]?.role || 'counter_manager',
      phone: target.phone
    });

    try {
      localStorage.setItem('alasaree_active_merchant_id', merchantId);
      localStorage.setItem('alasaree_merchant_authenticated', 'true');
      localStorage.setItem('alasaree_active_persona', JSON.stringify({
        id: `usr-merch-${merchantId}`,
        role: 'merchant_staff',
        merchantId,
        name: chosenName
      }));
    } catch {
      // Ignore
    }

    api.auth.loginMerchant(merchantId, pinCode, chosenName).then(res => {
      if (res?.token) {
        localStorage.setItem('alasaree_auth_token', res.token);
      }
    }).catch(console.error);

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('alasaree_merchant_authenticated', 'false');
    } catch {
      // Ignore
    }
  };

  const toggleStoreAcceptingOrders = () => {
    const nextVal = !isStoreAcceptingOrders;
    setIsStoreAcceptingOrders(nextVal);
    if (selectedMerchantId) {
      api.merchants.updateStatus(selectedMerchantId, { isAcceptingOrders: nextVal }).catch(console.error);
    }
  };

  // STRICT MERCHANT DATA ISOLATION:
  // Only orders matching activeMerchant.id are ever returned to this portal
  const merchantOrders = useMemo(() => {
    if (!activeMerchant) return [];
    return orders.filter(ord => ord.merchantId === activeMerchant.id);
  }, [orders, activeMerchant]);

  // Real-time metric computations
  const orderMetrics = useMemo(() => {
    let newAwaitingConfirmation = 0;
    let inspectionRequired = 0;
    let awaitingCustomerApproval = 0;
    let processing = 0;
    let readyForDelivery = 0;
    let completed = 0;
    let todayGrossEgp = 0;
    let todayCommissionEgp = 0;
    let todayNetEgp = 0;

    merchantOrders.forEach(ord => {
      switch (ord.status) {
        case 'awaiting_laundry_confirmation':
          newAwaitingConfirmation++;
          break;
        case 'inspection_required':
        case 'received_at_laundry':
          inspectionRequired++;
          break;
        case 'awaiting_customer_approval':
          awaitingCustomerApproval++;
          break;
        case 'processing':
          processing++;
          break;
        case 'ready_for_delivery':
          readyForDelivery++;
          break;
        case 'delivered':
        case 'completed':
          completed++;
          break;
      }

      // Financials for this merchant's orders
      const orderGross = ord.laundrySubtotal + (ord.adjustmentsTotal || 0);
      const commission = ord.commissionAmount || Math.round(orderGross * (ord.commissionRate || 0.08));
      const net = orderGross - commission;

      todayGrossEgp += orderGross;
      todayCommissionEgp += commission;
      todayNetEgp += net;
    });

    const activeBags = newAwaitingConfirmation + inspectionRequired + awaitingCustomerApproval + processing;
    const occupancyPercent = Math.min(100, Math.round((activeBags / Math.max(1, dailyIntakeCap)) * 100));

    return {
      total: merchantOrders.length,
      newAwaitingConfirmation,
      inspectionRequired,
      awaitingCustomerApproval,
      processing,
      readyForDelivery,
      completed,
      todayGrossEgp,
      todayCommissionEgp,
      todayNetEgp,
      occupancyPercent,
      avgRating: activeMerchant?.rating || 4.8
    };
  }, [merchantOrders, activeMerchant, dailyIntakeCap]);

  return (
    <MerchantAuthContext.Provider
      value={{
        isAuthenticated,
        activeMerchant,
        activeStaff,
        availableMerchants: merchants,
        login,
        logout,
        isStoreAcceptingOrders,
        toggleStoreAcceptingOrders,
        dailyIntakeCap,
        setDailyIntakeCap,
        servicesCatalog,
        toggleServiceAvailability,
        updateServicePrice,
        orderWashStages,
        setOrderWashStage,
        merchantOrders,
        orderMetrics
      }}
    >
      {children}
    </MerchantAuthContext.Provider>
  );
};

export const useMerchantAuth = () => {
  const context = useContext(MerchantAuthContext);
  if (!context) {
    throw new Error('useMerchantAuth must be used within a MerchantAuthProvider');
  }
  return context;
};
