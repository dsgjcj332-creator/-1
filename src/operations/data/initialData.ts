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
    activeLaundriesCount: 2,
    activeDriversCount: 3,
    deliveryBaseFeeEgp: 25
  },
  {
    id: 'mansoura',
    nameAr: 'المنصورة',
    nameEn: 'Mansoura',
    governorateAr: 'الدقهلية',
    governorateEn: 'Dakahlia',
    isActive: true,
    activeLaundriesCount: 2,
    activeDriversCount: 2,
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

export const INITIAL_MERCHANTS: MerchantBusiness[] = [
  {
    id: 'm-zag-01',
    nameAr: 'مغسلة النور الحديثة',
    nameEn: 'Al-Noor Modern Cleaners',
    commercialRegNo: '482910-ZAG',
    taxNumber: '928-112-401',
    ownerName: 'الحاج مجدي النور',
    phone: '01012345671',
    governorate: 'الشرقية',
    city: 'الزقازيق',
    district: 'منطقة القومية - شارع السلام',
    address: 'شارع السلام المتفرع من القومية بجوار صيدلية الدكتور أحمد',
    status: 'active',
    commissionRate: 0.08,
    serviceFeePayer: 'customer',
    capacityBagsPerDay: 45,
    activeHours: '09:00 ص - 11:30 م',
    payoutMethod: 'instapay',
    payoutDetails: 'alnoor.laundry@instapay',
    rating: 4.8,
    totalOrdersFulfilled: 142
  },
  {
    id: 'm-zag-02',
    nameAr: 'مغسلة الصفوة الملكية',
    nameEn: 'El-Safwa Royal Laundry',
    commercialRegNo: '319401-ZAG',
    taxNumber: '811-923-550',
    ownerName: 'أحمد البدري',
    phone: '01123456782',
    governorate: 'الشرقية',
    city: 'الزقازيق',
    district: 'حي الجامعة وفلل الجامعة',
    address: 'أمام بوابة كلية الآداب - برج الصفوة الدور الأرضي',
    status: 'active',
    commissionRate: 0.08,
    serviceFeePayer: 'customer',
    capacityBagsPerDay: 60,
    activeHours: '10:00 ص - 12:00 ص',
    payoutMethod: 'bank_transfer',
    payoutDetails: 'بنك مصر - فرع الزقازيق - حساب رقم 4120098124',
    rating: 4.9,
    totalOrdersFulfilled: 218
  },
  {
    id: 'm-man-01',
    nameAr: 'مغسلة دراي كلين النيل',
    nameEn: 'Nile Dry Clean Mansoura',
    commercialRegNo: '519280-MAN',
    taxNumber: '702-334-119',
    ownerName: 'إبراهيم الشربيني',
    phone: '01234567893',
    governorate: 'الدقهلية',
    city: 'المنصورة',
    district: 'المشاية السفلية',
    address: 'المشاية السفلية كورنيش النيل بجوار نادي جزيرة الورد',
    status: 'active',
    commissionRate: 0.08,
    serviceFeePayer: 'customer',
    capacityBagsPerDay: 50,
    activeHours: '09:30 ص - 11:00 م',
    payoutMethod: 'instapay',
    payoutDetails: 'nilecleaners@instapay',
    rating: 4.7,
    totalOrdersFulfilled: 98
  }
];

export const INITIAL_DRIVERS: DeliveryDriver[] = [
  {
    id: 'drv-01',
    driverCode: 'DRV-ZAG-01',
    name: 'أحمد متولي',
    mobile: '01099887761',
    serviceZone: 'الزقازيق',
    vehicleType: 'motorcycle',
    plateNumber: 'ر ق ص 4921',
    status: 'active',
    activeJobsCount: 1,
    completedJobsTotal: 84,
    failedDeliveriesCount: 1,
    cashInHandEgp: 310,
    joinedAt: '2026-08-15',
    rating: 4.9
  },
  {
    id: 'drv-02',
    driverCode: 'DRV-ZAG-02',
    name: 'محمود الصاوي',
    mobile: '01188776652',
    serviceZone: 'الزقازيق',
    vehicleType: 'motorcycle',
    plateNumber: 'س ع م 3182',
    status: 'active',
    activeJobsCount: 0,
    completedJobsTotal: 62,
    failedDeliveriesCount: 0,
    cashInHandEgp: 0,
    joinedAt: '2026-09-01',
    rating: 4.8
  },
  {
    id: 'drv-03',
    driverCode: 'DRV-MAN-01',
    name: 'كريم الدسوقي',
    mobile: '01277665543',
    serviceZone: 'المنصورة',
    vehicleType: 'motorcycle',
    plateNumber: 'د ل ط 1109',
    status: 'active',
    activeJobsCount: 1,
    completedJobsTotal: 51,
    failedDeliveriesCount: 2,
    cashInHandEgp: 180,
    joinedAt: '2026-09-10',
    rating: 4.7
  }
];

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
  },
  {
    id: 'usr-merch-01',
    name: 'الحاج مجدي النور',
    email: 'magdy@alnoorclean.com',
    phone: '01012345671',
    role: 'merchant_owner',
    merchantId: 'm-zag-01'
  },
  {
    id: 'usr-merch-02',
    name: 'أحمد البدري',
    email: 'ahmed@elsafwaclean.com',
    phone: '01123456782',
    role: 'merchant_owner',
    merchantId: 'm-zag-02'
  },
  {
    id: 'usr-driver-01',
    name: 'أحمد متولي',
    email: 'ahmed.driver@alaelsaree.com',
    phone: '01099887761',
    role: 'driver',
    driverId: 'drv-01',
    assignedZone: 'الزقازيق'
  }
];

export const INITIAL_MERCHANT_APPLICATIONS: MerchantApplication[] = [
  {
    id: 'app-01',
    referenceNumber: 'APP-ZAG-9421',
    applicantName: 'محمد عبد الله العوضي',
    businessName: 'مغسلة الأقصى البخارية',
    mobile: '01065432198',
    governorate: 'الشرقية',
    city: 'الزقازيق',
    address: 'شارع فاروق أمام مجمع المحاكم القديم',
    services: ['غسيل وكي بخار', 'دراي كلين', 'غسيل سجاد وبطاطين'],
    operatingStatus: 'مغسلة قائمة وتعمل منذ 4 سنوات',
    contactMethod: 'الهاتف واتساب',
    capacity: 'حوالي 50 كيس ملابس يومياً',
    notes: 'نمتلك ماكينة بخار إيطالية حديثة ونرغب في التوسع واستقبال طلبات الزقازيق أونلاين',
    privacyConsent: true,
    status: 'new',
    receivedAt: '2026-10-21T18:45:00.000Z'
  },
  {
    id: 'app-02',
    referenceNumber: 'APP-MAN-8812',
    applicantName: 'سامح فوزي الدمرداش',
    businessName: 'مغسلة رويال كلين المنصورة',
    mobile: '01198765432',
    governorate: 'الدقهلية',
    city: 'المنصورة',
    address: 'شارع قناة السويس بجوار برج الأطباء',
    services: ['غسيل وكي بخار', 'كي فقط', 'عناية خاصة بالأقمشة الحساسة'],
    operatingStatus: 'مغسلة قائمة وتعمل منذ سنتين',
    contactMethod: 'الهاتف مباشرة',
    capacity: '35 كيس يومياً',
    notes: 'نخدم منطقة توريل وقناة السويس بالمنصورة',
    privacyConsent: true,
    status: 'under_review',
    receivedAt: '2026-10-20T14:10:00.000Z',
    reviewedBy: 'عمر الفاروق',
    reviewerNotes: 'تم التواصل الأولي مع سامح فوزي، في انتظار إرسال صورة السجل التجاري والبطاقة الضريبية.'
  },
  {
    id: 'app-03',
    referenceNumber: 'APP-RAM-7014',
    applicantName: 'طارق حسنين شحاتة',
    businessName: 'مغسلة النجمة البيضاء',
    mobile: '01287654321',
    governorate: 'الشرقية',
    city: 'العاشر من رمضان',
    address: 'المجاورة السابعة بجوار سنتر الحجاز',
    services: ['غسيل وكي بخار', 'غسيل مفروشات وبطاطين'],
    operatingStatus: 'محل جديد قيد التجهيز',
    contactMethod: 'واتساب',
    capacity: '25 كيس يومياً',
    notes: 'جاهزون لبدء استقبال الطلبات فور إطلاق الخدمة بالعاشر',
    privacyConsent: true,
    status: 'info_requested',
    receivedAt: '2026-10-19T09:20:00.000Z',
    reviewedBy: 'حازم الديسطي',
    reviewerNotes: 'طلبنا تأكيد تاريخ جاهزية التشغيل وما إذا كانت المعدات قد تم تركيبها بالفعل.',
    decisionReason: 'المغسلة قيد التجهيز - مطلوب إفادة بالموعد النهائي للافتتاح الفعلي'
  }
];

export const INITIAL_ORDERS: LaundryOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-2026-0814',
    createdAt: '2026-10-22T08:15:00.000Z',
    customerId: 'cust-101',
    customerName: 'د. طارق المنشاوي',
    customerPhone: '01023456781',
    merchantId: 'm-zag-01',
    merchantName: 'مغسلة النور الحديثة',
    city: 'الزقازيق',
    neighborhood: 'حي الجامعة',
    pickupAddress: 'برج الأطباء شارع الجامعة، الدور الرابع شقة 8',
    deliveryAddress: 'برج الأطباء شارع الجامعة، الدور الرابع شقة 8',
    status: 'inspection_required', // Received at laundry, waiting intake confirmation
    paymentStatus: 'pending',
    paymentMethod: 'cash_on_delivery',
    items: [
      {
        id: 'item-101-1',
        nameAr: 'قميص رجالي',
        nameEn: 'Men Shirt',
        category: 'top',
        serviceType: 'wash_iron',
        quantity: 3,
        unitPrice: 25,
        subtotal: 75,
        fragrance: 'oud',
        starch: 'medium',
        packaging: 'hanger',
        customerNotes: 'أزرار الكم أصلية يرجى الحرص أثناء الكي',
        receivedQuantity: 3
      },
      {
        id: 'item-101-2',
        nameAr: 'بنطلون جينز / قماش',
        nameEn: 'Trousers',
        category: 'bottom',
        serviceType: 'wash_iron',
        quantity: 2,
        unitPrice: 30,
        subtotal: 60,
        fragrance: 'breeze',
        starch: 'light',
        packaging: 'folded',
        receivedQuantity: 2
      },
      {
        id: 'item-101-3',
        nameAr: 'بدلة رجالي كاملة',
        nameEn: 'Full Suit',
        category: 'formal_kids',
        serviceType: 'dry_clean',
        quantity: 1,
        unitPrice: 90,
        subtotal: 90,
        packaging: 'hanger',
        receivedQuantity: 1,
        stainDamageNotes: 'يوجد بقعة حبر صغيرة على طرف الكم الأيمن تحتاج لمعالجة مذيب مسبقاً'
      }
    ],
    laundrySubtotal: 225,
    adjustmentsTotal: 0,
    commissionRate: 0.08,
    commissionAmount: 18, // 8% of 225 = 18 EGP
    platformFee: 20,      // 20 EGP paid by customer
    platformFeePayer: 'customer',
    deliveryFeeCustomer: 25,
    driverPayoutPickup: 20,
    driverPayoutDelivery: 20,
    customerTotalPaid: 270, // 225 + 20 + 25 = 270 EGP COD
    merchantPayableAmount: 207, // 225 - 18 = 207 EGP
    isSettled: false,
    pickupJobId: 'job-pk-101',
    statusHistory: [
      {
        status: 'awaiting_laundry_confirmation',
        timestamp: '2026-10-22T08:15:00.000Z',
        actor: 'د. طارق المنشاوي (العميل)'
      },
      {
        status: 'accepted',
        timestamp: '2026-10-22T08:22:00.000Z',
        actor: 'مغسلة النور الحديثة (الحاج مجدي)'
      },
      {
        status: 'collected',
        timestamp: '2026-10-22T09:30:00.000Z',
        actor: 'أحمد متولي (مندوب الاستلام)'
      },
      {
        status: 'inspection_required',
        timestamp: '2026-10-22T09:55:00.000Z',
        actor: 'مغسلة النور الحديثة (فحص وتأكيد الاستلام)'
      }
    ],
    specialInstructions: 'أرجو عدم استخدام عطر نفاذ، استخدام عطر خفيف فقط'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-2026-0813',
    createdAt: '2026-10-22T07:30:00.000Z',
    customerId: 'cust-102',
    customerName: 'م. ياسمين حسني',
    customerPhone: '01134567892',
    merchantId: 'm-zag-01',
    merchantName: 'مغسلة النور الحديثة',
    city: 'الزقازيق',
    neighborhood: 'منطقة القومية',
    pickupAddress: 'شارع الأمن الغذائي - فيلا رقم 14',
    deliveryAddress: 'شارع الأمن الغذائي - فيلا رقم 14',
    status: 'awaiting_customer_approval', // Intake discrepancy found (extra dress detected!)
    paymentStatus: 'pending',
    paymentMethod: 'cash_on_delivery',
    items: [
      {
        id: 'item-102-1',
        nameAr: 'فستان سهرة ناعم',
        nameEn: 'Evening Dress',
        category: 'formal_kids',
        serviceType: 'dry_clean',
        quantity: 1,
        unitPrice: 120,
        subtotal: 120,
        packaging: 'hanger'
      },
      {
        id: 'item-102-2',
        nameAr: 'جاكيت شتوي / صوف',
        nameEn: 'Winter Coat',
        category: 'top',
        serviceType: 'dry_clean',
        quantity: 1,
        unitPrice: 85,
        subtotal: 85,
        packaging: 'hanger'
      }
    ],
    laundrySubtotal: 205,
    adjustmentsTotal: 65, // Discrepancy: Customer put an extra blazer in the bag
    commissionRate: 0.08,
    commissionAmount: 21.6, // 8% of 270 = 21.60
    platformFee: 20,
    platformFeePayer: 'customer',
    deliveryFeeCustomer: 25,
    driverPayoutPickup: 20,
    driverPayoutDelivery: 20,
    customerTotalPaid: 315, // 270 + 20 + 25 = 315
    merchantPayableAmount: 248.4,
    isSettled: false,
    discrepancy: {
      detectedAt: '2026-10-22T09:10:00.000Z',
      reportedBy: 'مغسلة النور الحديثة',
      originalSubtotal: 205,
      revisedSubtotal: 270,
      differenceEgp: 65,
      reason: 'وجد في الحقيبة بليزر إضافي غير مضاف في طلب العميل المبدئي (+65 ج دراي كلين)',
      customerApprovalStatus: 'pending',
      photoNotes: 'تم تصوير القطعة الإضافية وإرسال إشعار للعميل للموافقة على التعديل'
    },
    statusHistory: [
      {
        status: 'accepted',
        timestamp: '2026-10-22T07:40:00.000Z',
        actor: 'مغسلة النور الحديثة'
      },
      {
        status: 'collected',
        timestamp: '2026-10-22T08:50:00.000Z',
        actor: 'أحمد متولي'
      },
      {
        status: 'awaiting_customer_approval',
        timestamp: '2026-10-22T09:15:00.000Z',
        actor: 'مغسلة النور الحديثة',
        note: 'طلب موافقة العميل على البليزر الإضافي'
      }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-2026-0810',
    createdAt: '2026-10-21T16:00:00.000Z',
    customerId: 'cust-103',
    customerName: 'أ. هاني سليم',
    customerPhone: '01245678903',
    merchantId: 'm-zag-02',
    merchantName: 'مغسلة الصفوة الملكية',
    city: 'الزقازيق',
    neighborhood: 'شارع المحافظة',
    pickupAddress: 'عمارة المهندسين شارع المحافظة الدور 6',
    deliveryAddress: 'عمارة المهندسين شارع المحافظة الدور 6',
    status: 'ready_for_delivery', // Laundry completed washing & pressing, ready for dispatch return
    paymentStatus: 'pending',
    paymentMethod: 'cash_on_delivery',
    items: [
      {
        id: 'item-103-1',
        nameAr: 'جلابية رجالي فاخرة',
        nameEn: 'Men Jalabiya',
        category: 'traditional',
        serviceType: 'wash_iron',
        quantity: 4,
        unitPrice: 40,
        subtotal: 160,
        fragrance: 'oud',
        starch: 'medium',
        packaging: 'hanger'
      },
      {
        id: 'item-103-2',
        nameAr: 'بطانية كبيرة مزدوجة',
        nameEn: 'Double Blanket',
        category: 'linens',
        serviceType: 'wash_only',
        quantity: 1,
        unitPrice: 120,
        subtotal: 120,
        fragrance: 'lavender',
        packaging: 'folded'
      }
    ],
    laundrySubtotal: 280,
    adjustmentsTotal: 0,
    commissionRate: 0.08,
    commissionAmount: 22.4, // 8% of 280 = 22.4 EGP
    platformFee: 20,
    platformFeePayer: 'customer',
    deliveryFeeCustomer: 25,
    driverPayoutPickup: 20,
    driverPayoutDelivery: 20,
    customerTotalPaid: 325,
    merchantPayableAmount: 257.6,
    isSettled: false,
    deliveryJobId: 'job-del-103',
    statusHistory: [
      {
        status: 'accepted',
        timestamp: '2026-10-21T16:10:00.000Z',
        actor: 'مغسلة الصفوة الملكية'
      },
      {
        status: 'collected',
        timestamp: '2026-10-21T17:15:00.000Z',
        actor: 'محمود الصاوي'
      },
      {
        status: 'processing',
        timestamp: '2026-10-21T18:00:00.000Z',
        actor: 'مغسلة الصفوة الملكية'
      },
      {
        status: 'ready_for_delivery',
        timestamp: '2026-10-22T09:30:00.000Z',
        actor: 'مغسلة الصفوة الملكية',
        note: 'الملابس مفروزة ومغلفة بالنايلون ومعلقة بانتظار مندوب التوصيل'
      }
    ]
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-2026-0805',
    createdAt: '2026-10-21T10:00:00.000Z',
    customerId: 'cust-104',
    customerName: 'الأستاذة نورا السعدني',
    customerPhone: '01056789014',
    merchantId: 'm-zag-01',
    merchantName: 'مغسلة النور الحديثة',
    city: 'الزقازيق',
    neighborhood: 'حي الجامعة',
    pickupAddress: 'شارع السلام عمارة 12 الدور الثاني',
    deliveryAddress: 'شارع السلام عمارة 12 الدور الثاني',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'cash_on_delivery',
    items: [
      {
        id: 'item-104-1',
        nameAr: 'طقم ملايات وسرير',
        nameEn: 'Bed Sheets Set',
        category: 'linens',
        serviceType: 'wash_iron',
        quantity: 2,
        unitPrice: 50,
        subtotal: 100
      },
      {
        id: 'item-104-2',
        nameAr: 'تيشيرت قطن',
        nameEn: 'Cotton T-Shirt',
        category: 'top',
        serviceType: 'wash_iron',
        quantity: 4,
        unitPrice: 20,
        subtotal: 80
      }
    ],
    laundrySubtotal: 180,
    adjustmentsTotal: 0,
    commissionRate: 0.08,
    commissionAmount: 14.4,
    platformFee: 20,
    platformFeePayer: 'customer',
    deliveryFeeCustomer: 25,
    driverPayoutPickup: 20,
    driverPayoutDelivery: 20,
    customerTotalPaid: 225,
    merchantPayableAmount: 165.6,
    isSettled: false,
    statusHistory: [
      {
        status: 'delivered',
        timestamp: '2026-10-21T21:00:00.000Z',
        actor: 'أحمد متولي'
      },
      {
        status: 'completed',
        timestamp: '2026-10-21T21:05:00.000Z',
        actor: 'النظام (تأكيد التحصيل)'
      }
    ]
  }
];

export const INITIAL_DELIVERY_JOBS: DeliveryJob[] = [
  {
    id: 'job-pk-101',
    jobReference: 'JOB-PK-2026-0814',
    orderId: 'ord-101',
    orderNumber: 'ORD-2026-0814',
    jobType: 'pickup',
    originName: 'د. طارق المنشاوي',
    originAddress: 'برج الأطباء شارع الجامعة، الدور الرابع شقة 8',
    originPhone: '01023456781',
    destinationName: 'مغسلة النور الحديثة',
    destinationAddress: 'شارع السلام المتفرع من القومية بجوار صيدلية الدكتور أحمد',
    destinationPhone: '01012345671',
    serviceZone: 'الزقازيق',
    scheduledWindow: '09:00 ص - 10:30 ص',
    status: 'completed',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'أحمد متولي',
    assignedDriverPhone: '01099887761',
    attemptCount: 1,
    proofNote: 'تم استلام كيس ملابس محكم الإغلاق برقم الكود #0814',
    cashToCollectEgp: 0,
    cashCollected: false,
    completedAt: '2026-10-22T09:30:00.000Z'
  },
  {
    id: 'job-del-103',
    jobReference: 'JOB-RT-2026-0810',
    orderId: 'ord-103',
    orderNumber: 'ORD-2026-0810',
    jobType: 'return_delivery',
    originName: 'مغسلة الصفوة الملكية',
    originAddress: 'أمام بوابة كلية الآداب - برج الصفوة الدور الأرضي',
    originPhone: '01123456782',
    destinationName: 'أ. هاني سليم',
    destinationAddress: 'عمارة المهندسين شارع المحافظة الدور 6',
    destinationPhone: '01245678903',
    serviceZone: 'الزقازيق',
    scheduledWindow: '11:00 ص - 01:00 م',
    status: 'awaiting_assignment', // Unassigned job in dispatch console
    attemptCount: 0,
    cashToCollectEgp: 325,
    cashCollected: false
  },
  {
    id: 'job-pk-105',
    jobReference: 'JOB-PK-2026-0820',
    orderId: 'ord-105-new',
    orderNumber: 'ORD-2026-0820',
    jobType: 'pickup',
    originName: 'م. إيهاب عاطف',
    originAddress: 'فلل الجامعة بجوار مسجد الفتح',
    originPhone: '01091234567',
    destinationName: 'مغسلة النور الحديثة',
    destinationAddress: 'شارع السلام المتفرع من القومية',
    destinationPhone: '01012345671',
    serviceZone: 'الزقازيق',
    scheduledWindow: '12:00 م - 02:00 م',
    status: 'assigned',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'أحمد متولي',
    assignedDriverPhone: '01099887761',
    attemptCount: 0,
    cashToCollectEgp: 0,
    cashCollected: false
  }
];

export const INITIAL_SETTLEMENTS: SettlementStatement[] = [
  {
    id: 'stl-2026-w42-01',
    statementNumber: 'STL-ZAG-0042',
    merchantId: 'm-zag-01',
    merchantName: 'مغسلة النور الحديثة',
    periodStart: '2026-10-10',
    periodEnd: '2026-10-17',
    totalOrdersCount: 28,
    grossLaundryValue: 5640,
    commissionDeducted: 451.2, // 8%
    platformFeesDeducted: 0,    // Fees borne by customers
    netPayableAmount: 5188.8,
    status: 'paid',
    generatedAt: '2026-10-18T08:00:00.000Z',
    approvedBy: 'عمر الفاروق (مسؤول المنصة)',
    approvedAt: '2026-10-18T11:30:00.000Z',
    bankTransferReference: 'INSTA-EG-291048201',
    payoutDate: '2026-10-18',
    orderIds: ['ord-hist-01', 'ord-hist-02', 'ord-hist-03']
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-22T08:22:00.000Z',
    actorName: 'الحاج مجدي النور',
    actorRole: 'merchant_owner',
    action: 'قبول طلب جديد',
    entityType: 'order',
    entityId: 'ord-101',
    details: 'تم قبول الطلب ORD-2026-0814 وإسناد مهمة الاستلام للمندوب'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-22T09:15:00.000Z',
    actorName: 'مغسلة النور الحديثة',
    actorRole: 'merchant_owner',
    action: 'تسجيل فروقات فحص الاستلام',
    entityType: 'order',
    entityId: 'ord-102',
    details: 'إضافة قطعة بليزر بقيمة 65 ج، وإرسال طلب موافقة للعميل'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-21T18:45:00.000Z',
    actorName: 'النظام الآلي - الموقع التعريفي',
    actorRole: 'platform_admin',
    action: 'استقبال طلب انضمام شريك مغسلة',
    entityType: 'application',
    entityId: 'app-01',
    details: 'استلام طلب انضمام جديد من محمد عبد الله العوضي (مغسلة الأقصى البخارية - الزقازيق)'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-01',
    ticketNumber: 'TCK-2026-004',
    orderId: 'ord-101',
    orderNumber: 'ORD-2026-0814',
    customerName: 'د. طارق المنشاوي',
    merchantName: 'مغسلة النور الحديثة',
    category: 'stain_damage',
    description: 'استفسار عن إمكانية إزالة بقعة حبر قديمة على البدلة مع ضمان عدم بهتان القماش',
    reportedBy: 'merchant',
    status: 'under_investigation',
    createdAt: '2026-10-22T09:40:00.000Z',
    resolutionNotes: 'تم التواصل مع المغسلة لاستخدام مذيب البقع الحساسة بدون شحوم'
  }
];
