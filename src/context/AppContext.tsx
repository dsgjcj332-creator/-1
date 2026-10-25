import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  ScreenType,
  MainTab,
  User,
  Address,
  LaundryPartner,
  OrderItem,
  PickupSchedule,
  DeliverySchedule,
  Order,
  Coupon,
  AppNotification,
  ServiceType,
  OrderItemCustomization,
  OrderStatus,
  GarmentPhoto
} from '../types';
import {
  DEFAULT_ADDRESSES,
  LAUNDRY_PARTNERS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  COUPONS,
  GARMENTS,
  CITIES
} from '../data/mockData';
import { translations } from '../utils/i18n';
import { api } from '../api/client';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['ar'];
  currentScreen: ScreenType;
  mainTab: MainTab;
  navigationHistory: ScreenType[];
  navigateTo: (screen: ScreenType) => void;
  setTab: (tab: MainTab) => void;
  goBack: () => void;
  
  // Auth
  user: User | null;
  loginWithPhone: (phone: string, name?: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
  updateUserProfile: (name: string, email?: string) => void;
  
  // Cities & Partners
  selectedCity: string;
  setSelectedCity: (cityId: string) => void;
  selectedPartner: LaundryPartner;
  setSelectedPartner: (partner: LaundryPartner) => void;
  partners: LaundryPartner[];

  // Price adjustment approval
  approvePriceAdjustment: (orderId: string, approved: boolean) => Promise<boolean>;

  // Cart / Ordering Flow
  cartItems: OrderItem[];
  addItemToCart: (garmentId: string, customization: OrderItemCustomization, quantity?: number) => void;
  updateCartItemQuantity: (garmentId: string, customization: OrderItemCustomization, delta: number) => void;
  getCartItemCount: (garmentId: string) => number;
  clearCart: () => void;
  totalItemsCount: number;
  cartSubtotal: number;

  // Garment Photos
  cartPhotos: GarmentPhoto[];
  setCartPhoto: (pieceIndex: number, garmentId: string, garmentNameAr: string, garmentNameEn: string, photoUrl: string, tag?: string, notes?: string) => void;
  removeCartPhoto: (pieceIndex: number) => void;
  clearCartPhotos: () => void;

  // Scheduling
  pickupSchedule: PickupSchedule;
  setPickupSchedule: (schedule: PickupSchedule) => void;
  deliverySchedule: DeliverySchedule;
  setDeliverySchedule: (schedule: DeliverySchedule) => void;

  // Selected Address
  selectedAddress: Address;
  setSelectedAddress: (address: Address) => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Checkout & Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  paymentMethod: 'cod' | 'instapay' | 'card';
  setPaymentMethod: (pm: 'cod' | 'instapay' | 'card') => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  calculatedSummary: {
    subtotal: number;
    deliveryFee: number;
    expressFee: number;
    discount: number;
    finalTotal: number;
  };
  placeOrder: () => Order;

  // Orders
  orders: Order[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  cancelOrder: (orderId: string, reason: string) => boolean;
  rateOrder: (orderId: string, serviceRating: number, pickupRating: number, deliveryRating: number, comment?: string) => void;
  reorder: (order: Order) => void;
  fetchBackendData: () => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Global Toast / Notice
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language & RTL
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('alasaree_lang');
    return (saved as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('alasaree_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = translations[language];

  // Navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [mainTab, setMainTab] = useState<MainTab>('account');
  const [navigationHistory, setNavigationHistory] = useState<ScreenType[]>(['splash']);

  const navigateTo = (screen: ScreenType) => {
    setNavigationHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setTab = (tab: MainTab) => {
    setMainTab(tab);
    if (currentScreen !== 'main') {
      setCurrentScreen('main');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const nextHistory = [...navigationHistory];
      nextHistory.pop(); // Remove current
      const previousScreen = nextHistory[nextHistory.length - 1];
      setNavigationHistory(nextHistory);
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('main');
    }
  };

  // User State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('alasaree_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default logged in user for immediate seamless experience
    return {
      id: 'user-ahmed',
      name: 'أحمد محمود العوضي',
      phone: '+20 101 234 5678',
      email: 'ahmed.awady@example.com',
      preferredLanguage: 'ar',
      defaultAddressId: 'addr-1',
      isGuest: false
    };
  });

  const loginWithPhone = (phone: string, name?: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || (language === 'ar' ? 'عميل عالسريع' : 'Ala El Saree Customer'),
      phone,
      preferredLanguage: language,
      isGuest: false,
      defaultAddressId: 'addr-1'
    };
    setUser(newUser);
    localStorage.setItem('alasaree_user', JSON.stringify(newUser));
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: `guest-${Date.now()}`,
      name: language === 'ar' ? 'زائر' : 'Guest',
      phone: '',
      preferredLanguage: language,
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem('alasaree_user', JSON.stringify(guestUser));
    navigateTo('main');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alasaree_user');
    navigateTo('auth_welcome');
  };

  const updateUserProfile = (name: string, email?: string) => {
    if (!user) return;
    const updated = { ...user, name, email };
    setUser(updated);
    localStorage.setItem('alasaree_user', JSON.stringify(updated));
    showToast(language === 'ar' ? 'تم تحديث بياناتك بنجاح' : 'Profile updated successfully');
  };

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('alasaree_addresses');
    return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
  });

  const [selectedAddress, setSelectedAddress] = useState<Address>(
    addresses.find(a => a.isDefault) || addresses[0]
  );

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const created: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    const updated = [...addresses, created];
    if (created.isDefault) {
      updated.forEach(a => {
        if (a.id !== created.id) a.isDefault = false;
      });
      setSelectedAddress(created);
    }
    setAddresses(updated);
    localStorage.setItem('alasaree_addresses', JSON.stringify(updated));
    api.customers.addAddress(newAddr).catch(console.error);
    showToast(language === 'ar' ? 'تم حفظ العنوان الجديد' : 'New address saved');
  };

  const updateAddress = (updatedAddr: Address) => {
    const updated = addresses.map(a => (a.id === updatedAddr.id ? updatedAddr : a));
    if (updatedAddr.isDefault) {
      updated.forEach(a => {
        if (a.id !== updatedAddr.id) a.isDefault = false;
      });
      setSelectedAddress(updatedAddr);
    }
    setAddresses(updated);
    localStorage.setItem('alasaree_addresses', JSON.stringify(updated));
    showToast(language === 'ar' ? 'تم تحديث العنوان' : 'Address updated');
  };

  const deleteAddress = (id: string) => {
    const remaining = addresses.filter(a => a.id !== id);
    setAddresses(remaining);
    localStorage.setItem('alasaree_addresses', JSON.stringify(remaining));
    if (selectedAddress.id === id && remaining.length > 0) {
      setSelectedAddress(remaining[0]);
    }
    api.customers.deleteAddress(id).catch(console.error);
    showToast(language === 'ar' ? 'تم حذف العنوان' : 'Address deleted');
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updated);
    localStorage.setItem('alasaree_addresses', JSON.stringify(updated));
    const def = updated.find(a => a.id === id);
    if (def) setSelectedAddress(def);
    showToast(language === 'ar' ? 'تم تعيين العنوان كافتراضي' : 'Default address updated');
  };

  // City & Laundry Partners
  const [selectedCity, setSelectedCity] = useState<string>('zagazig');
  const [partners, setPartners] = useState<LaundryPartner[]>(LAUNDRY_PARTNERS);
  const [selectedPartner, setSelectedPartner] = useState<LaundryPartner>(LAUNDRY_PARTNERS[0]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('alasaree_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(
    orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || orders[0] || null
  );

  // Sync with authoritative backend API
  const fetchBackendData = async () => {
    try {
      const [merchantsRes, ordersRes, addressesRes] = await Promise.allSettled([
        api.merchants.list(),
        api.orders.list(),
        api.customers.getAddresses()
      ]);

      if (merchantsRes.status === 'fulfilled' && merchantsRes.value?.merchants && merchantsRes.value.merchants.length > 0) {
        const mapped: LaundryPartner[] = merchantsRes.value.merchants.map((m: any) => ({
          id: m.id,
          nameAr: m.nameAr || m.name_ar,
          nameEn: m.nameEn || m.name_en,
          city: m.city === 'الزقازيق' ? 'zagazig' : m.city === 'المنصورة' ? 'mansoura' : m.city,
          neighborhoodAr: m.district || m.address || 'وسط المدينة',
          neighborhoodEn: m.district || m.city,
          rating: Number(m.rating) || 4.8,
          ratingCount: Number(m.totalOrdersFulfilled) || 45,
          estimatedHours: 24,
          minOrderAmount: 50,
          deliveryFee: 25,
          expressAvailable: true,
          expressHours: 6,
          badgeAr: (Number(m.rating) || 0) >= 4.9 ? 'شريك بلاتيني معتمد' : 'شريك متميز',
          badgeEn: (Number(m.rating) || 0) >= 4.9 ? 'Platinum Certified' : 'Verified Partner'
        }));
        setPartners(mapped);
        setSelectedPartner(prev => mapped.find(p => p.id === prev?.id) || mapped[0]);
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.orders && ordersRes.value.orders.length > 0) {
        const backendOrders: Order[] = ordersRes.value.orders.map((ord: any) => ({
          id: ord.id,
          referenceNumber: ord.orderNumber || ord.order_number || ord.referenceNumber || ord.id,
          createdAt: ord.createdAt || ord.created_at || new Date().toISOString(),
          customerId: ord.customerId || ord.customer_id || 'cust-101',
          partnerId: ord.merchantId || ord.merchant_id || 'm-zag-01',
          items: Array.isArray(ord.items) ? ord.items.map((it: any) => ({
            garmentId: it.serviceId || it.service_id || it.id,
            quantity: it.receivedQuantity ?? it.received_quantity ?? it.quantity ?? 1,
            customization: {
              serviceType: it.serviceType || it.service_type || 'wash_iron',
              fragrance: it.fragrance || 'oud',
              starch: it.starch || 'none',
              packaging: it.packaging || 'folded',
              notes: it.customerNotes || it.customer_notes
            },
            unitPrice: Number(it.unitPrice || it.unit_price || 25)
          })) : [],
          photos: [],
          pickup: {
            date: new Date().toISOString().slice(0, 10),
            timeSlot: '09:00 ص - 12:00 م',
            method: 'doorstep'
          },
          delivery: {
            date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            timeSlot: '02:00 م - 05:00 م',
            isExpress: false
          },
          address: {
            id: 'addr-1',
            title: 'العنوان المسجل',
            city: ord.city || 'الزقازيق',
            neighborhood: ord.neighborhood || 'حي الجامعة',
            street: ord.pickupAddress || ord.pickup_address || '',
            building: '',
            floor: '',
            apartment: '',
            contactName: ord.customerName || ord.customer_name || 'العميل',
            contactPhone: ord.customerPhone || ord.customer_phone || '',
            isDefault: true
          },
          paymentMethod: ord.paymentMethod || ord.payment_method || 'cod',
          subtotal: Number(ord.laundrySubtotal || ord.laundry_subtotal || 0),
          deliveryFee: Number(ord.deliveryFeeCustomer || ord.delivery_fee_customer || 25),
          expressFee: 0,
          discount: 0,
          finalTotal: Number(ord.customerTotalPaid || ord.customer_total_paid || 0),
          status: ord.status,
          notes: ord.specialInstructions || ord.special_instructions || '',
          statusHistory: (ord.statusHistory || []).map((h: any) => ({
            status: h.toStatus || h.status,
            timestamp: h.timestamp || '',
            titleAr: h.note || 'تحديث حالة الطلب',
            titleEn: h.note || 'Status update',
            descriptionAr: h.note || '',
            descriptionEn: h.note || ''
          }))
        }));

        setOrders(backendOrders);
        setActiveTrackingOrder(prev => {
          if (prev) {
            return backendOrders.find(o => o.id === prev.id) || backendOrders[0];
          }
          return backendOrders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || backendOrders[0];
        });
      }

      if (addressesRes.status === 'fulfilled' && addressesRes.value?.addresses && addressesRes.value.addresses.length > 0) {
        setAddresses(addressesRes.value.addresses);
      }
    } catch (err) {
      console.error('[AppContext] Error fetching from backend:', err);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Cart
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  const addItemToCart = (
    garmentId: string,
    customization: OrderItemCustomization,
    quantity = 1
  ) => {
    const garment = GARMENTS.find(g => g.id === garmentId);
    if (!garment) return;

    const unitPrice = garment.basePrices[customization.serviceType] || 35;

    setCartItems(prev => {
      // Find if exact same garment + customization exists
      const existingIdx = prev.findIndex(
        item =>
          item.garmentId === garmentId &&
          item.customization.serviceType === customization.serviceType &&
          item.customization.fragrance === customization.fragrance &&
          item.customization.starch === customization.starch &&
          item.customization.packaging === customization.packaging
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [...prev, { garmentId, quantity, customization, unitPrice }];
      }
    });

    showToast(
      language === 'ar'
        ? `تم إضافة ${garment.nameAr} إلى السلة`
        : `Added ${garment.nameEn} to cart`
    );
  };

  const updateCartItemQuantity = (
    garmentId: string,
    customization: OrderItemCustomization,
    delta: number
  ) => {
    setCartItems(prev => {
      const idx = prev.findIndex(
        item =>
          item.garmentId === garmentId &&
          item.customization.serviceType === customization.serviceType
      );

      if (idx === -1) {
        if (delta > 0) {
          const garment = GARMENTS.find(g => g.id === garmentId);
          const unitPrice = garment ? garment.basePrices[customization.serviceType] || 35 : 35;
          return [...prev, { garmentId, quantity: delta, customization, unitPrice }];
        }
        return prev;
      }

      const next = [...prev];
      const newQty = next[idx].quantity + delta;
      if (newQty <= 0) {
        return next.filter((_, i) => i !== idx);
      } else {
        next[idx] = { ...next[idx], quantity: newQty };
        return next;
      }
    });
  };

  const getCartItemCount = (garmentId: string): number => {
    return cartItems
      .filter(i => i.garmentId === garmentId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const [cartPhotos, setCartPhotos] = useState<GarmentPhoto[]>([]);

  const setCartPhoto = (
    pieceIndex: number,
    garmentId: string,
    garmentNameAr: string,
    garmentNameEn: string,
    photoUrl: string,
    tag?: string,
    notes?: string
  ) => {
    setCartPhotos(prev => {
      const filtered = prev.filter(p => p.pieceIndex !== pieceIndex);
      return [
        ...filtered,
        {
          id: `photo-${pieceIndex}-${Date.now()}`,
          pieceIndex,
          garmentId,
          garmentNameAr,
          garmentNameEn,
          photoUrl,
          tag,
          notes
        }
      ];
    });
  };

  const removeCartPhoto = (pieceIndex: number) => {
    setCartPhotos(prev => prev.filter(p => p.pieceIndex !== pieceIndex));
  };

  const clearCartPhotos = () => {
    setCartPhotos([]);
  };

  const clearCart = () => {
    setCartItems([]);
    setCartPhotos([]);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  // Scheduling State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [pickupSchedule, setPickupSchedule] = useState<PickupSchedule>({
    date: todayStr,
    timeSlot: '05:00 م - 08:00 م (مسائي - المفضل)',
    method: 'doorstep'
  });

  const [deliverySchedule, setDeliverySchedule] = useState<DeliverySchedule>({
    date: tomorrowStr,
    timeSlot: '05:00 م - 08:00 م (مسائي - المفضل)',
    isExpress: false,
    instructions: ''
  });

  // Coupons & Checkout
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'instapay' | 'card'>('cod');
  const [orderNotes, setOrderNotes] = useState<string>('');

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = COUPONS.find(c => c.code === cleanCode);
    if (!coupon) {
      return {
        success: false,
        message: language === 'ar' ? 'كود الخصم غير موجود أو غير صحيح' : 'Invalid promo code'
      };
    }
    if (cartSubtotal < coupon.minOrder) {
      return {
        success: false,
        message:
          language === 'ar'
            ? `الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.minOrder} ج.م`
            : `Minimum order of ${coupon.minOrder} EGP required`
      };
    }
    setAppliedCoupon(coupon);
    return {
      success: true,
      message:
        language === 'ar'
          ? `تم تطبيق الكوبون بنجاح: ${coupon.descriptionAr}`
          : `Coupon applied: ${coupon.descriptionEn}`
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculation Summary
  const deliveryFee = appliedCoupon?.freeDelivery ? 0 : selectedPartner.deliveryFee;
  const expressFee = deliverySchedule.isExpress ? 30 : 0;
  let discount = 0;
  if (appliedCoupon?.discountPercent) {
    discount = Math.min(
      Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100),
      50 // cap
    );
  } else if (appliedCoupon?.discountAmount) {
    discount = appliedCoupon.discountAmount;
  }

  const finalTotal = Math.max(0, cartSubtotal + deliveryFee + expressFee - discount);

  const calculatedSummary = {
    subtotal: cartSubtotal,
    deliveryFee,
    expressFee,
    discount,
    finalTotal
  };

  // Place Order
  const placeOrder = (): Order => {
    const refNum = `AS-${Math.floor(1000 + Math.random() * 9000)}`;
    const pickupAddrStr = `${selectedAddress.building || ''} ${selectedAddress.street || ''}, ${selectedAddress.neighborhood || ''}, ${selectedAddress.city || ''}`.trim();

    // Call authoritative backend API to persist order
    api.orders.create({
      merchantId: selectedPartner.id,
      pickupAddress: pickupAddrStr,
      deliveryAddress: pickupAddrStr,
      city: selectedAddress.city,
      neighborhood: selectedAddress.neighborhood,
      items: cartItems.map(it => {
        const garment = GARMENTS.find(g => g.id === it.garmentId);
        return {
          serviceId: it.garmentId,
          nameAr: garment?.nameAr || 'قطعة غسيل',
          nameEn: garment?.nameEn || 'Laundry Item',
          serviceType: it.customization.serviceType,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          fragrance: it.customization.fragrance,
          starch: it.customization.starch,
          packaging: it.customization.packaging,
          customerNotes: it.customization.notes
        };
      }),
      paymentMethod,
      specialInstructions: orderNotes
    }).then(() => {
      fetchBackendData();
    }).catch(err => {
      console.error('Backend order creation error:', err);
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      referenceNumber: refNum,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      customerId: user ? user.id : 'guest',
      partnerId: selectedPartner.id,
      items: [...cartItems],
      photos: [...cartPhotos],
      pickup: { ...pickupSchedule },
      delivery: { ...deliverySchedule },
      address: { ...selectedAddress },
      paymentMethod,
      subtotal: cartSubtotal,
      deliveryFee,
      expressFee,
      discount,
      finalTotal,
      status: 'order_received',
      notes: orderNotes,
      statusHistory: [
        {
          status: 'order_received',
          timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          titleAr: 'تم استلام طلبك بنجاح',
          titleEn: 'Order Received',
          descriptionAr: `تم تسجيل طلبك رقم ${refNum} وتعيين ${selectedPartner.nameAr} كشريك معتمد.`,
          descriptionEn: `Your order #${refNum} was received and assigned to ${selectedPartner.nameEn}.`
        }
      ]
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('alasaree_orders', JSON.stringify(nextOrders));
    setActiveTrackingOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      titleAr: `تم تأكيد طلبك رقم ${refNum} 🎉`,
      titleEn: `Order #${refNum} Confirmed 🎉`,
      messageAr: `موعد الاستلام المحدد: ${pickupSchedule.date} (${pickupSchedule.timeSlot})`,
      messageEn: `Scheduled pickup: ${pickupSchedule.date} (${pickupSchedule.timeSlot})`,
      timestamp: 'الآن',
      read: false,
      orderId: newOrder.id,
      type: 'order'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newOrder;
  };

  const cancelOrder = (orderId: string, reason: string): boolean => {
    const orderIdx = orders.findIndex(o => o.id === orderId);
    if (orderIdx === -1) return false;

    const order = orders[orderIdx];
    // Can only cancel if order not already delivered or deep in cleaning
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return false;
    }

    const updatedOrder: Order = {
      ...order,
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: new Date().toISOString(),
      statusHistory: [
        ...order.statusHistory,
        {
          status: 'cancelled',
          timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          titleAr: 'تم إلغاء الطلب',
          titleEn: 'Order Cancelled',
          descriptionAr: `سبب الإلغاء: ${reason}`,
          descriptionEn: `Cancellation reason: ${reason}`
        }
      ]
    };

    const nextOrders = [...orders];
    nextOrders[orderIdx] = updatedOrder;
    setOrders(nextOrders);
    localStorage.setItem('alasaree_orders', JSON.stringify(nextOrders));
    if (activeTrackingOrder?.id === orderId) {
      setActiveTrackingOrder(updatedOrder);
    }

    api.orders.updateStatus(orderId, 'cancelled', reason).then(() => fetchBackendData()).catch(console.error);
    showToast(language === 'ar' ? 'تم إلغاء الطلب بنجاح' : 'Order cancelled successfully');
    return true;
  };

  const approvePriceAdjustment = async (orderId: string, approved: boolean): Promise<boolean> => {
    try {
      await api.inspections.approvePrice(orderId, approved);
      await fetchBackendData();
      showToast(
        approved
          ? (language === 'ar' ? 'تمت الموافقة على تعديل السعر وبدأ الغسيل' : 'Price adjustment approved')
          : (language === 'ar' ? 'تم رفض التعديل وإلغاء الطلب' : 'Adjustment rejected')
      );
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Error updating adjustment');
      return false;
    }
  };

  const rateOrder = (
    orderId: string,
    serviceRating: number,
    pickupRating: number,
    deliveryRating: number,
    comment?: string
  ) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          rating: {
            serviceRating,
            pickupRating,
            deliveryRating,
            comment,
            createdAt: new Date().toISOString()
          }
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('alasaree_orders', JSON.stringify(updated));
    showToast(
      language === 'ar'
        ? 'شكراً لتقييمك! نسعد دائماً بخدمتك'
        : 'Thank you for your review! We appreciate your feedback'
    );
  };

  const reorder = (prevOrder: Order) => {
    setCartItems([...prevOrder.items]);
    const partner = LAUNDRY_PARTNERS.find(p => p.id === prevOrder.partnerId) || LAUNDRY_PARTNERS[0];
    setSelectedPartner(partner);
    setSelectedAddress(prevOrder.address);
    navigateTo('checkout');
    showToast(
      language === 'ar'
        ? 'تم نسخ عناصر الطلب السابق إلى سلة الشراء'
        : 'Reordered items loaded into cart'
    );
  };

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('alasaree_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem('alasaree_notifications', JSON.stringify(updated));
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('alasaree_notifications', JSON.stringify(updated));
  };

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentScreen,
        mainTab,
        navigationHistory,
        navigateTo,
        setTab,
        goBack,

        user,
        loginWithPhone,
        loginAsGuest,
        logout,
        updateUserProfile,

        selectedCity,
        setSelectedCity,
        selectedPartner,
        setSelectedPartner,
        partners,
        approvePriceAdjustment,

        cartItems,
        addItemToCart,
        updateCartItemQuantity,
        getCartItemCount,
        clearCart,
        totalItemsCount,
        cartSubtotal,

        cartPhotos,
        setCartPhoto,
        removeCartPhoto,
        clearCartPhotos,

        pickupSchedule,
        setPickupSchedule,
        deliverySchedule,
        setDeliverySchedule,

        selectedAddress,
        setSelectedAddress,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,

        appliedCoupon,
        applyCoupon,
        removeCoupon,
        paymentMethod,
        setPaymentMethod,
        orderNotes,
        setOrderNotes,
        calculatedSummary,
        placeOrder,

        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        cancelOrder,
        rateOrder,
        reorder,
        fetchBackendData,

        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
