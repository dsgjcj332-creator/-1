import { Language, ServiceType, OrderStatus } from '../types';

export const translations = {
  ar: {
    // Brand & Slogans
    appName: 'عالسريع',
    appEnglishName: 'Ala El Saree',
    tagline: 'غسيل ملابسك.. أسهل وأسرع',
    subTagline: 'خدمة غسيل وكي ودراي كلين احترافية حتى باب بيتك بمصر',

    // Nav Bar
    navHome: 'الرئيسية',
    navServices: 'خدماتنا',
    navOrders: 'طلباتي',
    navAddresses: 'العناوين',
    navAccount: 'حسابي',

    // Common Buttons
    next: 'التالي',
    back: 'رجوع',
    skip: 'تخطي',
    startNow: 'ابدأ الآن',
    confirm: 'تأكيد',
    save: 'حفظ',
    cancel: 'إلغاء',
    continue: 'متابعة',
    apply: 'تطبيق',
    reorder: 'اطلب نفس الطلب',
    viewDetails: 'عرض التفاصيل',
    trackOrder: 'تتبع الطلب',
    edit: 'تعديل',
    delete: 'حذف',
    callCourier: 'اتصال بالكابتن',
    whatsappSupport: 'محادثة واتساب',
    supportCenter: 'مركز المساعدة',

    // Currencies & Measurement
    currency: 'ج.م',
    itemsCount: 'قطع',
    itemSingular: 'قطعة',

    // Services
    service_wash_iron: 'غسيل وكي',
    service_wash_only: 'غسيل فقط',
    service_iron_only: 'كي بالبخار',
    service_dry_clean: 'دراي كلين',
    service_wash_iron_desc: 'غسيل عميق بأجود المنظفات مع كي بالبخار وتعطير فاخر',
    service_wash_only_desc: 'غسيل وتجفيف سريع وتعقيم دون كي',
    service_iron_only_desc: 'فرد تجاعيد الملابس بالبخار الاحترافي والتعليق على شماعة',
    service_dry_clean_desc: 'عناية فائقة للأقمشة الحساسة والبدل وفساتين السهرة',

    // Order Statuses
    status_order_received: 'تم استلام الطلب',
    status_order_confirmed: 'تم تأكيد الطلب',
    status_courier_to_pickup: 'المندوب في الطريق للاستلام',
    status_clothes_collected: 'تم استلام الملابس',
    status_at_laundry: 'الملابس لدى المغسلة',
    status_cleaning_in_progress: 'جاري تنفيذ الخدمة',
    status_ready_for_delivery: 'الملابس جاهزة ومعقمة',
    status_courier_to_deliver: 'المندوب في الطريق للتوصيل',
    status_delivered: 'تم تسليم الطلب بنجاح',
    status_cancelled: 'تم إلغاء الطلب',

    // Fragrances
    fragrance_oud: 'عود عربي فاخر',
    fragrance_lavender: 'لافندر مهدئ',
    fragrance_breeze: 'نسيم البحر المنعش',
    fragrance_none: 'بدون معطر (للبشرة الحساسة)',

    // Starch
    starch_none: 'بدون نشا',
    starch_light: 'نشا خفيف',
    starch_medium: 'نشا متوسط (للأقمشة الرسمية)',
    starch_high: 'نشا عالي (للجلابيب والياقات)',

    // Packaging
    packaging_hanger: 'على شماعة مفرودة مع غطاء واقٍ',
    packaging_folded: 'مطوية بعناية داخل شنطة عالسريع',

    // Onboarding
    onboardTitle1: 'غسيلك لحد باب البيت',
    onboardDesc1: 'مندوبنا بيجيلك في الميعاد اللي تختاره يستلم هدومك ويرجعلك إياها جاهزة ونظيفة.',
    onboardTitle2: 'اختار الخدمة اللي تناسبك',
    onboardDesc2: 'غسيل، كي بالبخار، تنظيف جاف (دراي كلين) وعناية خاصة بالمفروشات والأحذية.',
    onboardTitle3: 'تابع طلبك بكل سهولة',
    onboardDesc3: 'إشعارات لحظية خطوة بخطوة من استلام الهدوم لحد ما ترجعلك معطرة ومكوية.',

    // Auth
    authWelcomeTitle: 'أهلاً بك في عالسريع',
    authWelcomeSubtitle: 'سجل برقم موبايلك لتجربة غسيل سريعة ومريحة',
    startWithPhone: 'ابدأ برقم موبايلك',
    continueAsGuest: 'تصفح كزائر أولاً',
    enterPhoneTitle: 'أدخل رقم هاتفك المحمول',
    enterPhoneDesc: 'سنرسل لك رمز تأكيد مكون من 4 أرقام عبر رسالة SMS',
    phoneLabel: 'رقم الموبايل',
    phonePlaceholder: '01012345678',
    phoneInvalid: 'يرجى إدخال رقم موبايل مصري صحيح يبدأ بـ 010 أو 011 أو 012 أو 015',
    otpTitle: 'رمز التحقق (OTP)',
    otpSentTo: 'تم إرسال كود التأكيد إلى الرقم',
    otpEnterCode: 'أدخل الرمز المكون من 4 أرقام',
    resendOtp: 'إعادة إرسال الرمز',
    resendAfter: 'إعادة الإرسال بعد',
    devOtpHint: 'في وضع التجربة: استخدم الرمز 1234',
    profileTitle: 'بيانات حسابك الجديد',
    profileDesc: 'أدخل اسمك لنتمكن من مناداتك وتخصيص تجربتك',
    fullNameLabel: 'الاسم الكامل',
    fullNamePlaceholder: 'مثال: أحمد محمود',
    emailLabel: 'البريد الإلكتروني (اختياري)',
    emailPlaceholder: 'name@example.com',
    preferredLangLabel: 'لغة التطبيق المفضلة',

    // Home
    deliverTo: 'التوصيل إلى',
    activeOrderAlert: 'طلبك قيد التنفيذ الآن',
    startNewOrderBtn: 'ابدأ طلب جديد',
    quickServicesTitle: 'خدماتنا السريعة',
    ourPartnersTitle: 'المغاسل المعتمدة القريبة منك',
    whyUsTitle: 'ليه تختار عالسريع؟',
    feature1Title: 'استلام وتوصيل مجدول',
    feature1Desc: 'في ميعادك المناسب بالدقيقة',
    feature2Title: 'جودة فندقية مضمونة',
    feature2Desc: 'أفضل مساحيق ومكواة بخار حديثة',
    feature3Title: 'دفع سهل وآمن',
    feature3Desc: 'كاش عند الاستلام أو إنستاباي',

    // Garment Ordering
    garmentCatalogTitle: 'اختر الملابس والخدمات',
    customizeGarment: 'تخصيص العناية والكي',
    quantity: 'الكمية',
    subtotalEstimated: 'إجمالي تقديري',
    continueToSchedule: 'متابعة حجز الميعاد',
    emptyGarmentsSelected: 'يرجى اختيار قطعة واحدة على الأقل للمتابعة',

    // Scheduling
    pickupScheduleTitle: 'تحديد موعد الاستلام',
    deliveryScheduleTitle: 'تحديد موعد التوصيل',
    selectPickupDate: 'تاريخ استلام الملابس',
    selectPickupTime: 'الفترة الزمنية المفضلة',
    pickupMethod: 'طريقة الاستلام',
    doorstepPickup: 'استلام من باب المنزل / الشقة',
    selectDeliveryDate: 'تاريخ إعادة الملابس',
    selectDeliveryTime: 'فترة التوصيل',
    expressDeliveryOption: 'خدمة التوصيل السريع (خلال 6-8 ساعات)',
    expressDeliveryFeeNote: '+30 ج.م للخدمة المستعجلة',
    deliveryInstructions: 'تعليمات إضافية للمندوب (اختياري)',

    // Checkout
    checkoutTitle: 'مراجعة وتأكيد الطلب',
    orderSummary: 'ملخص الطلب',
    pickupDetails: 'تفاصيل الاستلام',
    deliveryDetails: 'تفاصيل التوصيل',
    partnerLaundry: 'المغسلة المنفذة',
    couponCode: 'كود الخصم / البروبوكود',
    enterCoupon: 'أدخل الكود (جرب SAREE20)',
    couponApplied: 'تم تطبيق الخصم بنجاح!',
    couponInvalid: 'كود الخصم غير صالح أو لا يستوفي الشروط',
    paymentMethod: 'طريقة الدفع',
    payCod: 'الدفع نقدياً (كاش) عند الاستلام',
    payInstapay: 'إنستاباي / محفظة فودافون كاش',
    payCard: 'بطاقة بنكية (فيزا / ماستركارد)',
    orderNotes: 'ملاحظات خاصة على الملابس',
    confirmOrderCTA: 'تأكيد الطلب الآن',

    // Confirmation
    orderSuccessTitle: 'تم تسجيل طلبك بنجاح!',
    orderRefLabel: 'رقم مرجع الطلب',
    orderSuccessDesc: 'سيتواصل معك مندوب عالسريع لاستلام الملابس في الموعد المحدد.',
    backToHome: 'العودة للرئيسية',

    // Order Tracking
    trackingTitle: 'تتبع الطلب',
    driverDetails: 'مندوب التوصيل',
    driverName: 'كابتن محمود الشريف',
    driverRating: '4.9 ⭐ (120 رحلة)',
    cancelOrder: 'إلغاء الطلب',
    cancelConfirmPrompt: 'هل أنت متأكد من رغبتك في إلغاء الطلب؟',
    cancelFreeNotice: 'الإلغاء مجاني طالما لم يتحرك المندوب بعد.',

    // Account & Settings
    accountTitle: 'حسابي',
    myAddresses: 'عناويني المسجلة',
    notifications: 'الإشعارات',
    language: 'اللغة / Language',
    termsAndPrivacy: 'الشروط والأحكام وسياسة الخصوصية',
    aboutApp: 'عن عالسريع',
    signOut: 'تسجيل الخروج',
    deleteAccount: 'حذف الحساب نهائياً'
  },

  en: {
    // Brand & Slogans
    appName: 'Ala El Saree',
    appEnglishName: 'Ala El Saree',
    tagline: 'Your Laundry.. Simpler & Faster',
    subTagline: 'On-demand laundry, dry cleaning & ironing delivered to your doorstep in Egypt',

    // Nav Bar
    navHome: 'Home',
    navServices: 'Services',
    navOrders: 'My Orders',
    navAddresses: 'Addresses',
    navAccount: 'Account',

    // Common Buttons
    next: 'Next',
    back: 'Back',
    skip: 'Skip',
    startNow: 'Get Started',
    confirm: 'Confirm',
    save: 'Save',
    cancel: 'Cancel',
    continue: 'Continue',
    apply: 'Apply',
    reorder: 'Reorder',
    viewDetails: 'View Details',
    trackOrder: 'Track Order',
    edit: 'Edit',
    delete: 'Delete',
    callCourier: 'Call Courier',
    whatsappSupport: 'WhatsApp Chat',
    supportCenter: 'Support Center',

    // Currencies & Measurement
    currency: 'EGP',
    itemsCount: 'items',
    itemSingular: 'item',

    // Services
    service_wash_iron: 'Wash & Iron',
    service_wash_only: 'Wash Only',
    service_iron_only: 'Steam Iron Only',
    service_dry_clean: 'Dry Clean',
    service_wash_iron_desc: 'Deep hygienic wash with steam press and premium fragrance',
    service_wash_only_desc: 'Wash, sanitize, and tumble dry without pressing',
    service_iron_only_desc: 'Professional steam press on luxury hangers',
    service_dry_clean_desc: 'Delicate fabric care for suits, gowns, and woolens',

    // Order Statuses
    status_order_received: 'Order Received',
    status_order_confirmed: 'Order Confirmed',
    status_courier_to_pickup: 'Courier on way for pickup',
    status_clothes_collected: 'Clothes Collected',
    status_at_laundry: 'At Laundry Facility',
    status_cleaning_in_progress: 'Cleaning in Progress',
    status_ready_for_delivery: 'Ready for Delivery',
    status_courier_to_deliver: 'Courier on way to deliver',
    status_delivered: 'Delivered Successfully',
    status_cancelled: 'Order Cancelled',

    // Fragrances
    fragrance_oud: 'Royal Arabic Oud',
    fragrance_lavender: 'Soothing Lavender',
    fragrance_breeze: 'Ocean Breeze',
    fragrance_none: 'Fragrance Free (Sensitive Skin)',

    // Starch
    starch_none: 'No Starch',
    starch_light: 'Light Starch',
    starch_medium: 'Medium Starch (Formal)',
    starch_high: 'High Starch (Jalabiya & Collars)',

    // Packaging
    packaging_hanger: 'On hanger with protective cover',
    packaging_folded: 'Neatly folded in Ala El Saree bag',

    // Onboarding
    onboardTitle1: 'Doorstep Pickup & Delivery',
    onboardDesc1: 'Our courier collects your garments and brings them back fresh, crisp, and neatly packed.',
    onboardTitle2: 'Choose Customized Care',
    onboardDesc2: 'Wash, steam ironing, dry cleaning, delicate fabrics, blankets, and footwear.',
    onboardTitle3: 'Real-Time Order Tracking',
    onboardDesc3: 'Live step-by-step updates from pickup to doorstep delivery.',

    // Auth
    authWelcomeTitle: 'Welcome to Ala El Saree',
    authWelcomeSubtitle: 'Fast, premium laundry care at your fingertips',
    startWithPhone: 'Start with Mobile Number',
    continueAsGuest: 'Browse as Guest',
    enterPhoneTitle: 'Enter your Mobile Number',
    enterPhoneDesc: 'We will send a 4-digit verification code via SMS',
    phoneLabel: 'Mobile Number',
    phonePlaceholder: '01012345678',
    phoneInvalid: 'Please enter a valid Egyptian mobile number (010, 011, 012, 015)',
    otpTitle: 'Verification Code (OTP)',
    otpSentTo: 'Verification code sent to',
    otpEnterCode: 'Enter the 4-digit code',
    resendOtp: 'Resend Code',
    resendAfter: 'Resend in',
    devOtpHint: 'In test mode: Enter code 1234',
    profileTitle: 'Complete Your Profile',
    profileDesc: 'Enter your name to personalize your laundry journey',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'e.g. Ahmed Mahmoud',
    emailLabel: 'Email (Optional)',
    emailPlaceholder: 'name@example.com',
    preferredLangLabel: 'Preferred Language',

    // Home
    deliverTo: 'Deliver to',
    activeOrderAlert: 'Your order is in progress',
    startNewOrderBtn: 'Start New Order',
    quickServicesTitle: 'Quick Services',
    ourPartnersTitle: 'Certified Partner Laundries',
    whyUsTitle: 'Why Ala El Saree?',
    feature1Title: 'Scheduled Pickup & Drop',
    feature1Desc: 'Accurate slots tailored to you',
    feature2Title: 'Hotel-Grade Quality',
    feature2Desc: 'Gentle detergents & steam finish',
    feature3Title: 'Easy & Safe Payment',
    feature3Desc: 'Cash on delivery or InstaPay',

    // Garment Ordering
    garmentCatalogTitle: 'Select Garments & Services',
    customizeGarment: 'Customize Laundry Care',
    quantity: 'Quantity',
    subtotalEstimated: 'Estimated Subtotal',
    continueToSchedule: 'Continue to Scheduling',
    emptyGarmentsSelected: 'Please select at least 1 item to proceed',

    // Scheduling
    pickupScheduleTitle: 'Schedule Pickup',
    deliveryScheduleTitle: 'Schedule Delivery',
    selectPickupDate: 'Pickup Date',
    selectPickupTime: 'Preferred Time Window',
    pickupMethod: 'Collection Method',
    doorstepPickup: 'Doorstep Collection',
    selectDeliveryDate: 'Delivery Date',
    selectDeliveryTime: 'Delivery Time Window',
    expressDeliveryOption: 'Express Service (Within 6-8 hours)',
    expressDeliveryFeeNote: '+30 EGP for express delivery',
    deliveryInstructions: 'Courier instructions (Optional)',

    // Checkout
    checkoutTitle: 'Review & Checkout',
    orderSummary: 'Order Summary',
    pickupDetails: 'Pickup Details',
    deliveryDetails: 'Delivery Details',
    partnerLaundry: 'Laundry Partner',
    couponCode: 'Promo Code',
    enterCoupon: 'Enter code (e.g. SAREE20)',
    couponApplied: 'Discount applied successfully!',
    couponInvalid: 'Promo code is invalid or does not meet criteria',
    paymentMethod: 'Payment Method',
    payCod: 'Cash on Delivery (COD)',
    payInstapay: 'InstaPay / Vodafone Cash',
    payCard: 'Credit / Debit Card',
    orderNotes: 'Special garment care instructions',
    confirmOrderCTA: 'Confirm Order Now',

    // Confirmation
    orderSuccessTitle: 'Order Placed Successfully!',
    orderRefLabel: 'Order Reference',
    orderSuccessDesc: 'Our courier will contact you to collect garments at the scheduled time.',
    backToHome: 'Back to Home',

    // Order Tracking
    trackingTitle: 'Live Order Tracking',
    driverDetails: 'Assigned Courier',
    driverName: 'Captain Mahmoud El-Sharif',
    driverRating: '4.9 ⭐ (120 deliveries)',
    cancelOrder: 'Cancel Order',
    cancelConfirmPrompt: 'Are you sure you want to cancel this order?',
    cancelFreeNotice: 'Free cancellation before the courier is dispatched.',

    // Account & Settings
    accountTitle: 'Account & Settings',
    myAddresses: 'Saved Addresses',
    notifications: 'Notifications',
    language: 'Language / اللغة',
    termsAndPrivacy: 'Terms of Service & Privacy',
    aboutApp: 'About Ala El Saree',
    signOut: 'Sign Out',
    deleteAccount: 'Delete Account'
  }
};

export function formatPrice(amount: number, lang: Language): string {
  if (lang === 'ar') {
    return `${amount} ج.م`;
  }
  return `${amount} EGP`;
}

export function validateEgyptianPhone(phone: string): boolean {
  // Cleans spaces and dashes
  const clean = phone.replace(/[\s\-\+]/g, '');
  // Formats:
  // 010xxxxxxxx, 011xxxxxxxx, 012xxxxxxxx, 015xxxxxxxx
  // 2010xxxxxxxx, 2011xxxxxxxx, etc.
  const regex = /^(?:20|0)?(1[0125][0-9]{8})$/;
  return regex.test(clean);
}

export function normalizeEgyptianPhone(phone: string): string {
  const clean = phone.replace(/[\s\-\+]/g, '');
  const match = clean.match(/^(?:20|0)?(1[0125][0-9]{8})$/);
  if (match) {
    return `+20 ${match[1].slice(0, 3)} ${match[1].slice(3, 6)} ${match[1].slice(6)}`;
  }
  return phone;
}

export function extractEgyptianPhoneDigits(phone: string): string {
  const clean = phone.replace(/[\s\-\+]/g, '');
  const match = clean.match(/^(?:20|0)?(1[0125][0-9]{8})$/);
  if (match) {
    return '0' + match[1];
  }
  return clean;
}

