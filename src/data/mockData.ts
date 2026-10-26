import {
  GarmentCategory,
  GarmentItem,
  LaundryPartner,
  Coupon,
  Address,
  Order,
  AppNotification,
  StainTreatmentOption
} from '../types';

export const CITIES = [
  {
    id: 'zagazig',
    nameAr: 'الزقازيق',
    nameEn: 'Zagazig',
    governorateAr: 'الشرقية',
    governorateEn: 'Sharqia',
    neighborhoods: [
      { ar: 'حي الجامعة', en: 'University District' },
      { ar: 'منطقة القومية', en: 'Al-Qawmeya' },
      { ar: 'فلل الجامعة', en: 'University Villas' },
      { ar: 'شارع المحافظة', en: 'Governorate St.' },
      { ar: 'المحطة والشوبك', en: 'Station Area' }
    ]
  },
  {
    id: 'mansoura',
    nameAr: 'المنصورة',
    nameEn: 'Mansoura',
    governorateAr: 'الدقهلية',
    governorateEn: 'Dakahlia',
    neighborhoods: [
      { ar: 'المشاية السفلية', en: 'Lower Corniche' },
      { ar: 'حي الجامعة والجمهورية', en: 'University & Gomhouria' },
      { ar: 'حي توريل الراقي', en: 'Touril' },
      { ar: 'شارع قناة السويس', en: 'Suez Canal St.' },
      { ar: 'سندوب وحي غرب', en: 'Sandoub / West Mansoura' }
    ]
  },
  {
    id: 'ramadan10',
    nameAr: 'العاشر من رمضان',
    nameEn: '10th of Ramadan',
    governorateAr: 'الشرقية',
    governorateEn: 'Sharqia',
    neighborhoods: [
      { ar: 'المجاورة الأولى والثانية', en: '1st & 2nd Neighborhood' },
      { ar: 'منطقة الأردنية والمركز', en: 'Al-Urduniya Center' },
      { ar: 'المجاورة السابعة', en: '7th Neighborhood' },
      { ar: 'ابني بيتك والمجاورة 14', en: '14th Neighborhood' }
    ]
  },
  {
    id: 'cairo',
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    governorateAr: 'القاهرة',
    governorateEn: 'Cairo',
    neighborhoods: [
      { ar: 'المعادي ودجلة', en: 'Maadi & Degla' },
      { ar: 'التجمع الخامس والنرجس', en: 'Fifth Settlement' },
      { ar: 'مصر الجديدة والكوربة', en: 'Heliopolis & Korba' },
      { ar: 'مدينة نصر ومكرم عبيد', en: 'Nasr City' }
    ]
  }
];

export const GARMENT_CATEGORIES: GarmentCategory[] = [
  {
    id: 'top',
    nameAr: 'الجزء العلوي',
    nameEn: 'Tops & Shirts',
    iconName: 'Shirt'
  },
  {
    id: 'bottom',
    nameAr: 'الجزء السفلي',
    nameEn: 'Pants & Bottoms',
    iconName: 'Scissors'
  },
  {
    id: 'traditional',
    nameAr: 'ملابس تقليدية',
    nameEn: 'Traditional Wear',
    iconName: 'Sparkles'
  },
  {
    id: 'formal_kids',
    nameAr: 'بدل وفساتين وأطفال',
    nameEn: 'Suits & Dresses',
    iconName: 'Crown'
  },
  {
    id: 'linens',
    nameAr: 'مفروشات وبطاطين',
    nameEn: 'Bedding & Blankets',
    iconName: 'Layers'
  },
  {
    id: 'shoes_delicates',
    nameAr: 'أحذية وعناية خاصة',
    nameEn: 'Shoes & Delicates',
    iconName: 'Footprints'
  }
];

export const GARMENTS: GarmentItem[] = [
  // Tops
  {
    id: 'g-shirt',
    categoryId: 'top',
    nameAr: 'قميص رجالي / كاجوال',
    nameEn: 'Shirt (Casual/Formal)',
    basePrices: {
      wash_iron: 35,
      wash_only: 20,
      iron_only: 20,
      dry_clean: 45
    },
    icon: '👔',
    popular: true
  },
  {
    id: 'g-tshirt',
    categoryId: 'top',
    nameAr: 'تيشيرت / بولو',
    nameEn: 'T-Shirt / Polo',
    basePrices: {
      wash_iron: 25,
      wash_only: 15,
      iron_only: 15,
      dry_clean: 35
    },
    icon: '👕',
    popular: true
  },
  {
    id: 'g-blouse',
    categoryId: 'top',
    nameAr: 'بلوزة حرير أو شيفون',
    nameEn: 'Blouse (Silk/Chiffon)',
    basePrices: {
      wash_iron: 45,
      wash_only: 25,
      iron_only: 25,
      dry_clean: 55
    },
    icon: '👚',
    popular: false
  },
  {
    id: 'g-jacket-casual',
    categoryId: 'top',
    nameAr: 'جاكيت خفيف / بامب',
    nameEn: 'Jacket (Light/Puffer)',
    basePrices: {
      wash_iron: 80,
      wash_only: 50,
      iron_only: 45,
      dry_clean: 95
    },
    icon: '🧥',
    popular: true
  },

  // Bottoms
  {
    id: 'g-pants-classic',
    categoryId: 'bottom',
    nameAr: 'بنطلون قماش كلاسيك',
    nameEn: 'Formal Trousers',
    basePrices: {
      wash_iron: 35,
      wash_only: 20,
      iron_only: 20,
      dry_clean: 45
    },
    icon: '👖',
    popular: true
  },
  {
    id: 'g-jeans',
    categoryId: 'bottom',
    nameAr: 'بنطلون جينز / جبردين',
    nameEn: 'Jeans / Chinos',
    basePrices: {
      wash_iron: 35,
      wash_only: 20,
      iron_only: 20,
      dry_clean: 45
    },
    icon: '👖',
    popular: true
  },
  {
    id: 'g-skirt',
    categoryId: 'bottom',
    nameAr: 'جيبة / تنورة بليسيه',
    nameEn: 'Skirt / Pleated Skirt',
    basePrices: {
      wash_iron: 45,
      wash_only: 25,
      iron_only: 25,
      dry_clean: 55
    },
    icon: '👗',
    popular: false
  },
  {
    id: 'g-shorts',
    categoryId: 'bottom',
    nameAr: 'شورت صيفي / رياضي',
    nameEn: 'Shorts (Sport/Casual)',
    basePrices: {
      wash_iron: 20,
      wash_only: 12,
      iron_only: 12,
      dry_clean: 30
    },
    icon: '🩳',
    popular: false
  },

  // Traditional
  {
    id: 'g-jalabiya-white',
    categoryId: 'traditional',
    nameAr: 'جلباب مصري قطن أبيض',
    nameEn: 'Egyptian Cotton Jalabiya',
    basePrices: {
      wash_iron: 45,
      wash_only: 25,
      iron_only: 25,
      dry_clean: 60
    },
    icon: '🥻',
    popular: true
  },
  {
    id: 'g-jalabiya-wool',
    categoryId: 'traditional',
    nameAr: 'جلباب صوف شتوي / فاخر',
    nameEn: 'Winter Wool Jalabiya',
    basePrices: {
      wash_iron: 75,
      wash_only: 45,
      iron_only: 40,
      dry_clean: 90
    },
    icon: '🥻',
    popular: false
  },
  {
    id: 'g-abaya',
    categoryId: 'traditional',
    nameAr: 'عباية خروج خليجي / مطرزة',
    nameEn: 'Abaya (Embroidered/Crepe)',
    basePrices: {
      wash_iron: 55,
      wash_only: 30,
      iron_only: 30,
      dry_clean: 75
    },
    icon: '👘',
    popular: true
  },
  {
    id: 'g-isdal',
    categoryId: 'traditional',
    nameAr: 'إسدال صلاة قطني',
    nameEn: 'Prayer Isdal (Cotton)',
    basePrices: {
      wash_iron: 35,
      wash_only: 20,
      iron_only: 20,
      dry_clean: 45
    },
    icon: '🧕',
    popular: false
  },

  // Formal & Kids
  {
    id: 'g-suit-2pc',
    categoryId: 'formal_kids',
    nameAr: 'بدلة رجالي كاملة (قطعتين)',
    nameEn: 'Men Suit (2 Pieces)',
    basePrices: {
      wash_iron: 130,
      wash_only: 80,
      iron_only: 65,
      dry_clean: 150
    },
    icon: '🤵',
    popular: true
  },
  {
    id: 'g-evening-dress',
    categoryId: 'formal_kids',
    nameAr: 'فستان سواريه / سهرة',
    nameEn: 'Evening Gown / Dress',
    basePrices: {
      wash_iron: 160,
      wash_only: 100,
      iron_only: 85,
      dry_clean: 190
    },
    icon: '💃',
    popular: true
  },
  {
    id: 'g-coat-overcoat',
    categoryId: 'formal_kids',
    nameAr: 'بالطو صوف طويل / معطف',
    nameEn: 'Long Wool Overcoat',
    basePrices: {
      wash_iron: 120,
      wash_only: 70,
      iron_only: 60,
      dry_clean: 140
    },
    icon: '🧥',
    popular: false
  },
  {
    id: 'g-kids-set',
    categoryId: 'formal_kids',
    nameAr: 'طقم أطفال كامل (قطعتين)',
    nameEn: 'Kids Outfit (2 Pcs)',
    basePrices: {
      wash_iron: 30,
      wash_only: 18,
      iron_only: 18,
      dry_clean: 40
    },
    icon: '🧒',
    popular: false
  },

  // Linens & Bedding
  {
    id: 'g-bedsheet-set',
    categoryId: 'linens',
    nameAr: 'طقم ملاية سرير كبير (3 قطع)',
    nameEn: 'Bedsheet Set (King/3 Pcs)',
    basePrices: {
      wash_iron: 60,
      wash_only: 40,
      iron_only: 35,
      dry_clean: 75
    },
    icon: '🛏️',
    popular: true
  },
  {
    id: 'g-blanket-single',
    categoryId: 'linens',
    nameAr: 'بطانية مفرد (طبقة واحدة)',
    nameEn: 'Single Blanket',
    basePrices: {
      wash_iron: 90,
      wash_only: 80,
      iron_only: 50,
      dry_clean: 110
    },
    icon: '🛋️',
    popular: true
  },
  {
    id: 'g-blanket-double',
    categoryId: 'linens',
    nameAr: 'بطانية مزدوجة شتوية (طبقتين)',
    nameEn: 'Double Winter Blanket (2 Ply)',
    basePrices: {
      wash_iron: 140,
      wash_only: 120,
      iron_only: 70,
      dry_clean: 160
    },
    icon: '🛋️',
    popular: true
  },
  {
    id: 'g-duvet',
    categoryId: 'linens',
    nameAr: 'لحاف فيبر كبير / أبيض',
    nameEn: 'Fiber King Duvet / Quilt',
    basePrices: {
      wash_iron: 130,
      wash_only: 110,
      iron_only: 65,
      dry_clean: 150
    },
    icon: '🛌',
    popular: false
  },

  // Shoes & Delicates
  {
    id: 'g-sneakers',
    categoryId: 'shoes_delicates',
    nameAr: 'حذاء رياضي سنيكرز (تنظيف وتطهير)',
    nameEn: 'Sneakers Deep Cleaning',
    basePrices: {
      wash_iron: 75,
      wash_only: 75,
      iron_only: 75,
      dry_clean: 90
    },
    icon: '👟',
    popular: true
  },
  {
    id: 'g-leather-shoes',
    categoryId: 'shoes_delicates',
    nameAr: 'حذاء كلاسيك جلد طبيعي (عناية وتلميع)',
    nameEn: 'Leather Shoe Care & Polish',
    basePrices: {
      wash_iron: 85,
      wash_only: 85,
      iron_only: 85,
      dry_clean: 95
    },
    icon: '👞',
    popular: false
  }
];

export const LAUNDRY_PARTNERS: LaundryPartner[] = [
  {
    id: 'partner-nile-royal',
    nameAr: 'مغسلة النيل الملكية الفندقية',
    nameEn: 'Nile Royal Hotel Cleaners',
    city: 'zagazig',
    neighborhoodAr: 'شارع الجامعة، الزقازيق',
    neighborhoodEn: 'University St, Zagazig',
    rating: 4.9,
    ratingCount: 384,
    estimatedHours: 24,
    minOrderAmount: 20,
    deliveryFee: 20,
    expressAvailable: true,
    expressHours: 6,
    badgeAr: 'الأعلى تقييماً',
    badgeEn: 'Top Rated'
  },
  {
    id: 'partner-safa',
    nameAr: 'مغسلة دار الصفا الحديثة',
    nameEn: 'Dar Al-Safa Modern Laundry',
    city: 'zagazig',
    neighborhoodAr: 'منطقة القومية، الزقازيق',
    neighborhoodEn: 'Al-Qawmeya, Zagazig',
    rating: 4.8,
    ratingCount: 245,
    estimatedHours: 24,
    minOrderAmount: 20,
    deliveryFee: 15,
    expressAvailable: true,
    expressHours: 8,
    badgeAr: 'الأسرع توصيلاً',
    badgeEn: 'Fastest Delivery'
  },
  {
    id: 'partner-mansoura-vip',
    nameAr: 'دار كلين للغسيل والكي الفاخر',
    nameEn: 'Dar Clean Luxury Laundry',
    city: 'mansoura',
    neighborhoodAr: 'المشاية السفلية، المنصورة',
    neighborhoodEn: 'Lower Corniche, Mansoura',
    rating: 4.9,
    ratingCount: 520,
    estimatedHours: 24,
    minOrderAmount: 20,
    deliveryFee: 25,
    expressAvailable: true,
    expressHours: 6,
    badgeAr: 'شريك ذهبي',
    badgeEn: 'Gold Partner'
  },
  {
    id: 'partner-ramadan-clean',
    nameAr: 'إكسبريس واش العاشر من رمضان',
    nameEn: 'Express Wash 10th of Ramadan',
    city: 'ramadan10',
    neighborhoodAr: 'منطقة الأردنية سنتر، العاشر',
    neighborhoodEn: 'Al-Urduniya Center, 10th Ramadan',
    rating: 4.7,
    ratingCount: 198,
    estimatedHours: 24,
    minOrderAmount: 60,
    deliveryFee: 15,
    expressAvailable: false,
    expressHours: 24,
    badgeAr: 'خدمة معتمدة',
    badgeEn: 'Verified Partner'
  },
  {
    id: 'partner-cairo-maadi',
    nameAr: 'مغاسل المعادي إكسبريس',
    nameEn: 'Maadi Express Cleaners',
    city: 'cairo',
    neighborhoodAr: 'شارع النصر، المعادي',
    neighborhoodEn: 'Al-Nasr St, Maadi',
    rating: 4.9,
    ratingCount: 890,
    estimatedHours: 24,
    minOrderAmount: 100,
    deliveryFee: 30,
    expressAvailable: true,
    expressHours: 5,
    badgeAr: 'فندقي ممتاز',
    badgeEn: 'Hotel Grade'
  }
];

export const TIME_SLOTS = [
  { id: 'slot-1', textAr: '09:00 ص - 12:00 م (صباحي)', textEn: '09:00 AM - 12:00 PM (Morning)', extraFee: 0 },
  { id: 'slot-2', textAr: '01:00 م - 04:00 م (بعد الظهر)', textEn: '01:00 PM - 04:00 PM (Afternoon)', extraFee: 0 },
  { id: 'slot-3', textAr: '05:00 م - 08:00 م (مسائي - المفضل)', textEn: '05:00 PM - 08:00 PM (Evening - Popular)', extraFee: 0 },
  { id: 'slot-4', textAr: '08:00 م - 11:00 م (ليلي)', textEn: '08:00 PM - 11:00 PM (Night)', extraFee: 0 }
];

export const COUPONS: Coupon[] = [
  {
    code: 'SAREE20',
    discountPercent: 20,
    minOrder: 100,
    descriptionAr: 'خصم 20% على طلبك الأول (حد أقصى 50 ج.م)',
    descriptionEn: '20% off on your first order (max 50 EGP)'
  },
  {
    code: 'FIRSTFREE',
    freeDelivery: true,
    minOrder: 80,
    descriptionAr: 'توصيل مجاني للطلب الأول حتى باب البيت',
    descriptionEn: 'Free doorstep delivery on your first order'
  },
  {
    code: 'RAMADAN25',
    discountAmount: 25,
    minOrder: 150,
    descriptionAr: 'خصم نقدي 25 ج.م عند الطلب بأكثر من 150 ج.م',
    descriptionEn: '25 EGP flat discount on orders over 150 EGP'
  }
];

export const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    title: 'المنزل',
    city: 'الزقازيق',
    neighborhood: 'حي الجامعة',
    street: 'شارع السلام، متفرع من شارع المحافظة',
    building: 'برج الأندلس (14)',
    floor: 'الدور 4',
    apartment: 'شقة 8',
    landmark: 'بجوار صيدلية العزبي وأمام البنك الأهلي',
    contactName: 'أحمد محمود العوضي',
    contactPhone: '+20 101 234 5678',
    isDefault: true
  },
  {
    id: 'addr-2',
    title: 'مقر العمل',
    city: 'الزقازيق',
    neighborhood: 'منطقة القومية',
    street: 'شارع طلبة عويضة',
    building: 'مبنى النور الإداري (3)',
    floor: 'الدور 2',
    apartment: 'مكتب 204',
    landmark: 'أعلى مطعم كوك دور',
    contactName: 'أحمد محمود',
    contactPhone: '+20 101 234 5678',
    isDefault: false
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    titleAr: 'المندوب في الطريق لاستلام ملابسك! 🛵',
    titleEn: 'Courier on the way for pickup! 🛵',
    messageAr: 'كابتن محمود في الطريق إليك الآن، برجاء تجهيز الملابس في الحقيبة المخصصة.',
    messageEn: 'Captain Mahmoud is heading to your address now with your laundry bag.',
    timestamp: 'منذ 15 دقيقة',
    read: false,
    orderId: 'order-active-1',
    type: 'order'
  },
  {
    id: 'notif-2',
    titleAr: 'كوبون ترحيبي جديد: SAREE20 🎉',
    titleEn: 'New Welcome Coupon: SAREE20 🎉',
    messageAr: 'استمتع بخصم 20% على طلبك القادم عند إدخال الكود SAREE20 في صفحة الدفع.',
    messageEn: 'Enjoy 20% discount on your next order using promo code SAREE20.',
    timestamp: 'أمس',
    read: true,
    type: 'promo'
  },
  {
    id: 'notif-3',
    titleAr: 'تم تفعيل التوصيل السريع في الزقازيق ⚡',
    titleEn: 'Express delivery now active in Zagazig ⚡',
    messageAr: 'يمكنك الآن طلب استلام وغسيل وكي وتسليم الملابس خلال 6 ساعات فقط.',
    messageEn: 'You can now book 6-hour express wash, iron, and delivery in Zagazig.',
    timestamp: 'منذ يومين',
    read: true,
    type: 'system'
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const DEFAULT_STAIN_OPTIONS: StainTreatmentOption[] = [
  {
    id: 'stain_oil_grease',
    nameAr: 'بقع دهون وزيوت طعام',
    nameEn: 'Oil & Grease Stains',
    price: 10,
    icon: '🛢️',
    isAvailable: true
  },
  {
    id: 'stain_ink',
    nameAr: 'بقع حبر جاف / سائل',
    nameEn: 'Ink & Pen Stains',
    price: 15,
    icon: '✒️',
    isAvailable: true
  },
  {
    id: 'stain_coffee_tea',
    nameAr: 'بقع قهوة وشاي وعصائر',
    nameEn: 'Coffee, Tea & Juice',
    price: 10,
    icon: '☕',
    isAvailable: true
  },
  {
    id: 'stain_blood_sauce',
    nameAr: 'بقع دم / صلصة وطماطم',
    nameEn: 'Blood & Tomato Sauce',
    price: 15,
    icon: '🥫',
    isAvailable: true
  },
  {
    id: 'stain_collar_cuff',
    nameAr: 'اصفرار ياقة القميص والأساور',
    nameEn: 'Collar & Cuff Yellowing',
    price: 12,
    icon: '👔',
    isAvailable: true
  },
  {
    id: 'stain_color_transfer',
    nameAr: 'بهتان واختلاط ألوان معقد',
    nameEn: 'Color Bleed & Transfer',
    price: 20,
    icon: '🎨',
    isAvailable: true
  }
];


