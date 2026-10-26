export type Language = 'ar' | 'en';

export type ServiceType = 'wash_iron' | 'wash_only' | 'iron_only' | 'dry_clean';

export type FragranceType = 'oud' | 'lavender' | 'breeze' | 'none';

export type StarchLevel = 'none' | 'light' | 'medium' | 'high';

export type PackagingType = 'hanger' | 'folded';

export interface Address {
  id: string;
  title: string; // e.g. "المنزل", "العمل"
  city: string; // e.g. "الزقازيق", "المنصورة", "العاشر من رمضان", "القاهرة"
  neighborhood: string; // e.g. "حي الجامعة", "القومية"
  street: string;
  building: string;
  floor: string;
  apartment: string;
  landmark?: string;
  contactName: string;
  contactPhone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  pin?: string;
  preferredLanguage: Language;
  defaultAddressId?: string;
  isGuest: boolean;
}

export interface CustomerAccount {
  id: string;
  name: string;
  phone: string;
  pin: string;
  email?: string;
  preferredLanguage: Language;
  createdAt: string;
}


export interface GarmentCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  iconName: string;
}

export interface GarmentItem {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  basePrices: Record<ServiceType, number>;
  icon: string;
  popular?: boolean;
}

export interface LaundryPartner {
  id: string;
  nameAr: string;
  nameEn: string;
  city: string;
  neighborhoodAr: string;
  neighborhoodEn: string;
  rating: number;
  ratingCount: number;
  estimatedHours: number;
  minOrderAmount: number;
  deliveryFee: number;
  expressAvailable: boolean;
  expressHours: number;
  badgeAr?: string;
  badgeEn?: string;
}

export interface StainTreatmentOption {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  icon?: string;
  isAvailable?: boolean;
}

export interface OrderItemCustomization {
  serviceType: ServiceType;
  stains?: string[];
  stainCost?: number;
  fragrance?: FragranceType;
  starch?: StarchLevel;
  packaging?: PackagingType;
  notes?: string;
}

export interface OrderItem {
  garmentId: string;
  quantity: number;
  customization: OrderItemCustomization;
  unitPrice: number;
}

export type OrderStatus =
  | 'order_received'
  | 'order_confirmed'
  | 'courier_to_pickup'
  | 'clothes_collected'
  | 'at_laundry'
  | 'cleaning_in_progress'
  | 'ready_for_delivery'
  | 'courier_to_deliver'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface PickupSchedule {
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 ص - 12:00 م"
  method: 'doorstep' | 'counter';
}

export interface DeliverySchedule {
  date: string; // YYYY-MM-DD
  timeSlot: string;
  isExpress: boolean;
  instructions?: string;
}

export interface GarmentPhoto {
  id: string;
  pieceIndex: number;
  garmentId: string;
  garmentNameAr: string;
  garmentNameEn: string;
  photoUrl: string;
  tag?: string;
  notes?: string;
}

export interface Order {
  id: string;
  referenceNumber: string; // e.g. "AS-8392"
  createdAt: string;
  customerId: string;
  partnerId: string;
  items: OrderItem[];
  photos?: GarmentPhoto[];
  pickup: PickupSchedule;
  delivery: DeliverySchedule;
  address: Address;
  paymentMethod: 'cod' | 'instapay' | 'card';
  subtotal: number;
  deliveryFee: number;
  expressFee: number;
  discount: number;
  finalTotal: number;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  notes?: string;
  rating?: {
    serviceRating: number;
    pickupRating: number;
    deliveryRating: number;
    comment?: string;
    createdAt: string;
  };
  cancelReason?: string;
  cancelledAt?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  freeDelivery?: boolean;
  minOrder: number;
  descriptionAr: string;
  descriptionEn: string;
}

export interface AppNotification {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  type: 'order' | 'promo' | 'system';
}

export type ScreenType =
  | 'splash'
  | 'onboarding'
  | 'auth_welcome'
  | 'auth_phone'
  | 'auth_pin'
  | 'auth_otp'
  | 'auth_profile'
  | 'main'
  | 'garment_select'
  | 'garment_photos'
  | 'partner_select'
  | 'pickup_schedule'
  | 'delivery_schedule'
  | 'checkout'
  | 'order_confirmed'
  | 'order_tracking'
  | 'address_form'
  | 'support'
  | 'notifications'
  | 'rate_order';

export type MainTab = 'home' | 'services' | 'orders' | 'addresses' | 'account';

