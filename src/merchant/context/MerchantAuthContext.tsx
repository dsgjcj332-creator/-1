import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useOperations } from '../../operations/context/OperationsContext';
import { MerchantBusiness, LaundryOrder, OrderLifecycleStatus } from '../../operations/types';
import { api } from '../../api/client';
import { StainTreatmentOption } from '../../types';
import { DEFAULT_STAIN_OPTIONS } from '../../data/mockData';

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
  washOnlyPrice?: number;
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

  // Store Operational & Turnaround State
  isStoreAcceptingOrders: boolean;
  toggleStoreAcceptingOrders: () => void;
  dailyIntakeCap: number;
  setDailyIntakeCap: (cap: number) => void;
  expressAvailable: boolean;
  expressHours: number;
  estimatedHours: number;
  minOrderAmount: number;
  deliveryFee: number;
  openingHours: string;
  counterPhone: string;
  driverArrivalNote: string;
  offeredServices: Record<string, boolean>;
  stainOptions: StainTreatmentOption[];
  updateStoreSettings: (settings: Partial<{
    expressAvailable: boolean;
    expressHours: number;
    estimatedHours: number;
    minOrderAmount: number;
    deliveryFee: number;
    openingHours: string;
    counterPhone: string;
    driverArrivalNote: string;
    dailyIntakeCap: number;
  }>) => void;
  updateStainOption: (stainId: string, updates: Partial<StainTreatmentOption>) => void;
  toggleOfferedService: (serviceKey: string) => void;
  saveOfferedServices: (services: Record<string, boolean>) => void;

  // Service Catalog
  servicesCatalog: LaundryServiceItem[];
  toggleServiceAvailability: (serviceId: string) => void;
  updateServicePrice: (serviceId: string, type: 'washIron' | 'dryClean' | 'ironOnly' | 'washOnly', price: number) => void;

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
    id: 'g-tshirt',
    nameAr: 'تيشيرت / بولو كاجوال',
    nameEn: 'T-Shirt / Polo',
    category: 'men',
    washIronPrice: 20,
    washOnlyPrice: 15,
    ironOnlyPrice: 12,
    dryCleanPrice: 30,
    isAvailable: true,
    estDurationHours: 6
  },
  {
    id: 'g-shirt',
    nameAr: 'قميص رجالي كلاسيك / كاجوال',
    nameEn: 'Men Casual/Classic Shirt',
    category: 'men',
    washIronPrice: 25,
    washOnlyPrice: 18,
    ironOnlyPrice: 15,
    dryCleanPrice: 35,
    isAvailable: true,
    estDurationHours: 6
  },
  {
    id: 'g-pants-classic',
    nameAr: 'بنطلون جينز / قماش / جبردين',
    nameEn: 'Trousers / Jeans',
    category: 'men',
    washIronPrice: 30,
    washOnlyPrice: 20,
    ironOnlyPrice: 15,
    dryCleanPrice: 40,
    isAvailable: true,
    estDurationHours: 6
  },
  {
    id: 'g-suit-2pc',
    nameAr: 'بدلة كاملة (جاكيت + بنطلون)',
    nameEn: 'Full 2-Piece Suit',
    category: 'formal',
    washIronPrice: 90,
    washOnlyPrice: 60,
    dryCleanPrice: 120,
    ironOnlyPrice: 45,
    isAvailable: true,
    estDurationHours: 12
  },
  {
    id: 'g-abaya',
    nameAr: 'عباية حريمي / فستان ناعم',
    nameEn: 'Abaya / Soft Dress',
    category: 'women',
    washIronPrice: 45,
    washOnlyPrice: 35,
    dryCleanPrice: 65,
    ironOnlyPrice: 25,
    isAvailable: true,
    estDurationHours: 8
  },
  {
    id: 'g-dress-formal',
    nameAr: 'فستان سواريه / خطوبة حساس',
    nameEn: 'Evening / Formal Gown',
    category: 'formal',
    washIronPrice: 130,
    washOnlyPrice: 90,
    dryCleanPrice: 180,
    ironOnlyPrice: 70,
    isAvailable: true,
    estDurationHours: 24
  },
  {
    id: 'g-blanket-double',
    nameAr: 'بطانية شتوي دبل كبيرة',
    nameEn: 'Large Double Blanket',
    category: 'bedding',
    washIronPrice: 120,
    washOnlyPrice: 90,
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
    washOnlyPrice: 85,
    dryCleanPrice: 140,
    isAvailable: true,
    estDurationHours: 24
  },
  {
    id: 'g-jacket-casual',
    nameAr: 'جاكيت شتوي ووتربروف / بمب',
    nameEn: 'Puffer / Winter Jacket',
    category: 'men',
    washIronPrice: 75,
    washOnlyPrice: 55,
    dryCleanPrice: 95,
    ironOnlyPrice: 35,
    isAvailable: true,
    estDurationHours: 12
  },
  {
    id: 'g-bedsheet-set',
    nameAr: 'ملاية سرير + 2 كيس مخدة',
    nameEn: 'Bed Sheet Set',
    category: 'bedding',
    washIronPrice: 40,
    washOnlyPrice: 30,
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
      if (saved && saved.trim()) {
        return saved.trim();
      }
      return '';
    } catch {
      return '';
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('alasaree_merchant_authenticated');
      return val === 'true';
    } catch {
      return false;
    }
  });

  const [activeStaff, setActiveStaff] = useState<MerchantStaffMember | null>(() => {
    return {
      id: 'staff-default',
      name: 'مسؤول المغسلة',
      role: 'counter_manager',
      phone: ''
    };
  });

  // Store Operational & Customization State
  const defaultStoreSettings = {
    expressAvailable: true,
    expressHours: 6,
    estimatedHours: 24,
    minOrderAmount: 20,
    deliveryFee: 25,
    openingHours: '08:00 AM - 11:00 PM',
    counterPhone: '01012345678',
    driverArrivalNote: 'يرجى من الطيار الدخول مباشرة لكاونتر الاستلام في الخلف وتسليم باركود الكيس.',
    dailyIntakeCap: 60
  };

  const getStoreSettings = (merchantId: string) => {
    if (!merchantId) return defaultStoreSettings;
    try {
      const saved = localStorage.getItem(`ala_el_saree_merchant_settings_${merchantId}`);
      if (saved) return { ...defaultStoreSettings, ...JSON.parse(saved) };
    } catch {}
    return defaultStoreSettings;
  };

  const getStainsForMerchant = (merchantId: string): StainTreatmentOption[] => {
    if (!merchantId) return DEFAULT_STAIN_OPTIONS;
    try {
      const saved = localStorage.getItem(`ala_el_saree_merchant_stains_${merchantId}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STAIN_OPTIONS;
  };

  const getOfferedServicesForMerchant = (merchantId: string): Record<string, boolean> => {
    const defaults = {
      wash_iron: true,
      wash_only: true,
      iron_only: true,
      dry_clean: true,
      bedding: true,
      shoes: true
    };
    if (!merchantId) return defaults;
    try {
      const saved = localStorage.getItem(`ala_el_saree_merchant_services_${merchantId}`);
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch {}
    return defaults;
  };

  const [storeSettings, setStoreSettings] = useState<typeof defaultStoreSettings>(() =>
    getStoreSettings(selectedMerchantId)
  );
  const [stainOptions, setStainOptions] = useState<StainTreatmentOption[]>(() =>
    getStainsForMerchant(selectedMerchantId)
  );
  const [offeredServices, setOfferedServices] = useState<Record<string, boolean>>(() =>
    getOfferedServicesForMerchant(selectedMerchantId)
  );

  const [isStoreAcceptingOrders, setIsStoreAcceptingOrders] = useState<boolean>(true);
  const [dailyIntakeCap, setDailyIntakeCapState] = useState<number>(storeSettings.dailyIntakeCap);

  // Synchronize whenever selectedMerchantId changes
  useEffect(() => {
    if (selectedMerchantId) {
      const s = getStoreSettings(selectedMerchantId);
      setStoreSettings(s);
      setDailyIntakeCapState(s.dailyIntakeCap);
      setStainOptions(getStainsForMerchant(selectedMerchantId));
      setOfferedServices(getOfferedServicesForMerchant(selectedMerchantId));
    }
  }, [selectedMerchantId]);

  const getEffectiveMerchantId = (): string => {
    return (
      selectedMerchantId ||
      activeMerchant?.id ||
      localStorage.getItem('alasaree_active_merchant_id') ||
      'm-zag-01'
    );
  };

  const updateStoreSettings = (newSettings: Partial<typeof defaultStoreSettings>) => {
    setStoreSettings((prev: typeof defaultStoreSettings) => {
      const next = { ...prev, ...newSettings };
      if (newSettings.dailyIntakeCap !== undefined) {
        setDailyIntakeCapState(newSettings.dailyIntakeCap);
      }
      const targetId = getEffectiveMerchantId();
      try {
        localStorage.setItem(`ala_el_saree_merchant_settings_${targetId}`, JSON.stringify(next));
        localStorage.setItem('ala_el_saree_merchant_settings_active', JSON.stringify(next));

        // Also update ops merchants cache so customer app reads latest settings
        const opsRaw = localStorage.getItem('ala_el_saree_ops_merchants');
        if (opsRaw) {
          const list = JSON.parse(opsRaw);
          const idx = list.findIndex((m: any) => m.id === targetId);
          if (idx >= 0) {
            list[idx] = {
              ...list[idx],
              expressAvailable: next.expressAvailable,
              expressHours: next.expressHours,
              estimatedHours: next.estimatedHours,
              deliveryFee: next.deliveryFee,
              minOrderAmount: next.minOrderAmount
            };
            localStorage.setItem('ala_el_saree_ops_merchants', JSON.stringify(list));
          }
        }
        window.dispatchEvent(new CustomEvent('ala_el_saree_merchant_settings_updated', { detail: { merchantId: targetId } }));
      } catch {}
      return next;
    });
  };

  const setDailyIntakeCap = (cap: number) => {
    setDailyIntakeCapState(cap);
    updateStoreSettings({ dailyIntakeCap: cap });
  };

  const updateStainOption = (stainId: string, updates: Partial<StainTreatmentOption>) => {
    setStainOptions(prev => {
      const next = prev.map(st => (st.id === stainId ? { ...st, ...updates } : st));
      const targetId = getEffectiveMerchantId();
      try {
        localStorage.setItem(`ala_el_saree_merchant_stains_${targetId}`, JSON.stringify(next));
        localStorage.setItem('ala_el_saree_merchant_stains_active', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('ala_el_saree_merchant_settings_updated', { detail: { merchantId: targetId } }));
      } catch {}
      return next;
    });
  };

  const saveOfferedServices = (services: Record<string, boolean>) => {
    setOfferedServices(services);
    const targetId = getEffectiveMerchantId();
    try {
      localStorage.setItem(`ala_el_saree_merchant_services_${targetId}`, JSON.stringify(services));
      localStorage.setItem('ala_el_saree_merchant_services_active', JSON.stringify(services));
      window.dispatchEvent(new CustomEvent('ala_el_saree_merchant_settings_updated', { detail: { merchantId: targetId } }));
    } catch {}
  };

  const toggleOfferedService = (serviceKey: string) => {
    setOfferedServices(prev => {
      const next = { ...prev, [serviceKey]: !prev[serviceKey] };
      const targetId = getEffectiveMerchantId();
      try {
        localStorage.setItem(`ala_el_saree_merchant_services_${targetId}`, JSON.stringify(next));
        localStorage.setItem('ala_el_saree_merchant_services_active', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('ala_el_saree_merchant_settings_updated', { detail: { merchantId: targetId } }));
      } catch {}
      return next;
    });
  };

  // Service Catalog (persisted per merchant ID)
  const getCatalogForMerchant = (merchantId: string): LaundryServiceItem[] => {
    if (!merchantId) return INITIAL_CATALOG;
    try {
      const saved = localStorage.getItem(`ala_el_saree_merchant_catalog_${merchantId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_CATALOG;
  };

  const [servicesCatalog, setServicesCatalog] = useState<LaundryServiceItem[]>(() =>
    getCatalogForMerchant(selectedMerchantId)
  );

  // Reload catalog whenever active merchant switches
  useEffect(() => {
    if (selectedMerchantId) {
      setServicesCatalog(getCatalogForMerchant(selectedMerchantId));
    }
  }, [selectedMerchantId]);

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
    setServicesCatalog(prev => {
      const next = prev.map(it => (it.id === serviceId ? { ...it, isAvailable: !it.isAvailable } : it));
      const targetId = getEffectiveMerchantId();
      try {
        localStorage.setItem(`ala_el_saree_merchant_catalog_${targetId}`, JSON.stringify(next));
        localStorage.setItem('ala_el_saree_merchant_catalog_active', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('ala_el_saree_catalog_updated', { detail: { merchantId: targetId } }));
      } catch {}
      return next;
    });
    const targetId = getEffectiveMerchantId();
    if (item && targetId) {
      api.catalog.updatePrice(targetId, {
        serviceId,
        isAvailable: !item.isAvailable
      }).catch(console.error);
    }
  };

  const updateServicePrice = (
    serviceId: string,
    type: 'washIron' | 'dryClean' | 'ironOnly' | 'washOnly',
    price: number
  ) => {
    setServicesCatalog(prev => {
      const next = prev.map(item => {
        if (item.id !== serviceId) return item;
        if (type === 'washIron') return { ...item, washIronPrice: price };
        if (type === 'dryClean') return { ...item, dryCleanPrice: price };
        if (type === 'ironOnly') return { ...item, ironOnlyPrice: price };
        if (type === 'washOnly') return { ...item, washOnlyPrice: price };
        return item;
      });
      const targetId = getEffectiveMerchantId();
      try {
        localStorage.setItem(`ala_el_saree_merchant_catalog_${targetId}`, JSON.stringify(next));
        localStorage.setItem('ala_el_saree_merchant_catalog_active', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('ala_el_saree_catalog_updated', { detail: { merchantId: targetId } }));
      } catch {}
      return next;
    });
    const targetId = getEffectiveMerchantId();
    if (targetId) {
      const payload: any = { serviceId };
      if (type === 'washIron') payload.washIronPrice = price;
      if (type === 'dryClean') payload.dryCleanPrice = price;
      if (type === 'ironOnly') payload.ironOnlyPrice = price;
      if (type === 'washOnly') payload.washOnlyPrice = price;
      api.catalog.updatePrice(targetId, payload).catch(console.error);
    }
  };

  // Sync active merchant from authoritative list
  const activeMerchant = useMemo(() => {
    if (!merchants || merchants.length === 0) return null;
    if (selectedMerchantId) {
      const match = merchants.find(m => m.id === selectedMerchantId);
      if (match) return match;
    }
    try {
      const saved = localStorage.getItem('alasaree_active_merchant_id');
      if (saved) {
        const found = merchants.find(m => m.id === saved);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return merchants[0] || null;
  }, [merchants, selectedMerchantId]);

  // Keep active staff synced with merchant's real owner
  React.useEffect(() => {
    if (activeMerchant) {
      setActiveStaff({
        id: `staff-${activeMerchant.id}`,
        name: activeMerchant.ownerName || activeMerchant.nameAr || 'مسؤول المغسلة',
        role: 'counter_manager',
        phone: activeMerchant.phone
      });
      if (selectedMerchantId !== activeMerchant.id) {
        setSelectedMerchantId(activeMerchant.id);
      }
    }
  }, [activeMerchant]);

  const login = (merchantId: string, pinCode?: string, staffName?: string): boolean => {
    const target = merchants.find(m => m.id === merchantId);
    if (!target) return false;

    // Check password if not already authenticated or if pinCode provided
    if (!isAuthenticated && target.password) {
      if (!pinCode || target.password !== pinCode.trim()) {
        return false;
      }
    } else if (target.password && pinCode && pinCode.trim() && target.password !== pinCode.trim()) {
      return false;
    }

    setSelectedMerchantId(merchantId);
    setIsAuthenticated(true);
    const chosenName = staffName || target.ownerName || target.nameAr || 'مسؤول المغسلة';
    setActiveStaff({
      id: `staff-${target.id}`,
      name: chosenName,
      role: 'counter_manager',
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
      localStorage.removeItem('alasaree_active_merchant_id');
      localStorage.removeItem('alasaree_active_persona');
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
        expressAvailable: storeSettings.expressAvailable,
        expressHours: storeSettings.expressHours,
        estimatedHours: storeSettings.estimatedHours,
        minOrderAmount: storeSettings.minOrderAmount,
        deliveryFee: storeSettings.deliveryFee,
        openingHours: storeSettings.openingHours,
        counterPhone: storeSettings.counterPhone,
        driverArrivalNote: storeSettings.driverArrivalNote,
        offeredServices,
        stainOptions,
        updateStoreSettings,
        updateStainOption,
        toggleOfferedService,
        saveOfferedServices,
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
