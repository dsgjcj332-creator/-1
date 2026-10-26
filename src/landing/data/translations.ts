export type Language = 'ar' | 'en';

export interface LandingTranslation {
  // Brand
  brandName: string;
  brandSub: string;
  brandPromise: string;

  // Nav
  navHome: string;
  navServices: string;
  navHowItWorks: string;
  navForLaundries: string;
  navForDelivery: string;
  navFaq: string;
  navCustomerCta: string;
  navRegister: string;
  navJoinPartner: string;
  toggleLang: string;

  // Hero
  heroKicker: string;
  heroHeadline: string;
  heroSubhead: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroBadgeCoverage: string;
  heroBadgePartners: string;
  heroBadgeCare: string;
  heroBadgeDelivery: string;

  // Customer Section
  customerHeading: string;
  customerSubhead: string;
  customerJourneyTitle: string;
  customerStep1Title: string;
  customerStep1Desc: string;
  customerStep2Title: string;
  customerStep2Desc: string;
  customerStep3Title: string;
  customerStep3Desc: string;
  customerStep4Title: string;
  customerStep4Desc: string;
  customerStep5Title: string;
  customerStep5Desc: string;
  customerCtaButton: string;

  // Services
  servicesHeading: string;
  servicesSubhead: string;
  service1Title: string;
  service1Desc: string;
  service2Title: string;
  service2Desc: string;
  service3Title: string;
  service3Desc: string;
  service4Title: string;
  service4Desc: string;
  service5Title: string;
  service5Desc: string;
  service6Title: string;
  service6Desc: string;
  serviceAvailabilityNote: string;

  // How it works
  howHeading: string;
  howSubhead: string;
  howStep1Title: string;
  howStep1Desc: string;
  howStep2Title: string;
  howStep2Desc: string;
  howStep3Title: string;
  howStep3Desc: string;
  howStep4Title: string;
  howStep4Desc: string;

  // Laundry Partner Section
  partnerHeading: string;
  partnerSubhead: string;
  partnerBenefitsTitle: string;
  partnerBenefit1: string;
  partnerBenefit2: string;
  partnerBenefit3: string;
  partnerBenefit4: string;
  partnerBenefit5: string;
  partnerProcessTitle: string;
  partnerStep1Title: string;
  partnerStep1Desc: string;
  partnerStep2Title: string;
  partnerStep2Desc: string;
  partnerStep3Title: string;
  partnerStep3Desc: string;
  partnerStep4Title: string;
  partnerStep4Desc: string;
  partnerCta: string;

  // Merchant Application Form
  formHeading: string;
  formSubhead: string;
  formApplicantName: string;
  formApplicantNamePlaceholder: string;
  formBusinessName: string;
  formBusinessNamePlaceholder: string;
  formMobile: string;
  formMobilePlaceholder: string;
  formGovernorate: string;
  formGovernoratePlaceholder: string;
  formCity: string;
  formCityPlaceholder: string;
  formAddress: string;
  formAddressPlaceholder: string;
  formServicesLabel: string;
  formServiceWashIron: string;
  formServiceWashOnly: string;
  formServiceIronOnly: string;
  formServiceDryClean: string;
  formServiceLinens: string;
  formServiceCarpets: string;
  formOperatingStatus: string;
  formStatusActive: string;
  formStatusExpanding: string;
  formStatusNew: string;
  formContactMethod: string;
  formContactPhone: string;
  formContactWhatsApp: string;
  formContactEmail: string;
  formEmailOptional: string;
  formWhatsAppOptional: string;
  formWebsiteOptional: string;
  formCapacityOptional: string;
  formNotesOptional: string;
  formLocationLinkOptional: string;
  formPrivacyConsent: string;
  formSubmitBtn: string;
  formSubmitting: string;
  formSuccessMsg: string;
  formValidationErr: string;
  formRequiredNotice: string;

  // Delivery Partner Section
  deliveryHeading: string;
  deliverySubhead: string;
  deliveryBenefit1Title: string;
  deliveryBenefit1Desc: string;
  deliveryBenefit2Title: string;
  deliveryBenefit2Desc: string;
  deliveryBenefit3Title: string;
  deliveryBenefit3Desc: string;
  deliveryCta: string;
  deliveryNotice: string;
  deliveryModalTitle: string;
  deliveryModalDesc: string;
  deliveryModalName: string;
  deliveryModalPhone: string;
  deliveryModalCity: string;
  deliveryModalVehicle: string;
  deliveryVehicleMotorcycle: string;
  deliveryVehicleCar: string;
  deliveryVehicleBicycle: string;
  deliveryModalSubmit: string;
  deliveryModalSuccess: string;

  // Trust & Transparency
  trustHeading: string;
  trustSubhead: string;
  trustPrinciple1Title: string;
  trustPrinciple1Desc: string;
  trustPrinciple2Title: string;
  trustPrinciple2Desc: string;
  trustPrinciple3Title: string;
  trustPrinciple3Desc: string;
  trustPrinciple4Title: string;
  trustPrinciple4Desc: string;

  // FAQ
  faqHeading: string;
  faqSubhead: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  faqQ4: string;
  faqA4: string;
  faqQ5: string;
  faqA5: string;
  faqQ6: string;
  faqA6: string;
  faqQ7: string;
  faqA7: string;
  faqQ8: string;
  faqA8: string;
  faqQ9: string;
  faqA9: string;

  // Footer & Legal
  footerAbout: string;
  footerQuickLinks: string;
  footerPartners: string;
  footerLegal: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCopyright: string;
  footerDevNotice: string;
  modalClose: string;
}

export const TRANSLATIONS: Record<Language, LandingTranslation> = {
  ar: {
    // Brand
    brandName: 'عالسريع',
    brandSub: 'Ala El Saree',
    brandPromise: 'غسيلك علينا… ووقتك ليك',

    // Nav
    navHome: 'الرئيسية',
    navServices: 'خدماتنا',
    navHowItWorks: 'بتطلب ازاي؟',
    navForLaundries: 'للمغاسل',
    navForDelivery: 'للمناديب',
    navFaq: 'أسئلة شايعة',
    navCustomerCta: 'اطلب دلوقتي',
    navRegister: 'دخول / تسجيل',
    navJoinPartner: 'انضم كشريك',
    toggleLang: 'English',

    // Hero
    heroKicker: 'منصة غسيل الملابس الأولى في مصر',
    heroHeadline: 'غسيلك علينا… ووقتك ليك',
    heroSubhead: 'اطلب غسيل وكي ملابسك من باب بيتك، والمندوب يجيك يأخدها ويرجعها ليك تاني يوم نظيفة ومعطرة. عندك مغسلة؟ انضم وابدأ تاخد طلبات أونلاين.',
    heroPrimaryCta: 'اطلب خدمتك دلوقتي',
    heroSecondaryCta: 'انضم كمغسلة شريكة',
    heroBadgeCoverage: 'استلام وتسليم لباب البيت',
    heroBadgePartners: 'مغاسل محلية منتخبة بعناية',
    heroBadgeCare: 'عناية دقيقة بكل قطعة',
    heroBadgeDelivery: 'مواعيد تناسب يومك',

    // Customer Section
    customerHeading: 'العناية بملابسك بقت أسهل بكتير',
    customerSubhead: 'من غير ما تتعب — اطلب واحنا بنعمل الباقي. استلام من بابك وتسليم في الموعد.',
    customerJourneyTitle: 'رحلة الطلب من أولها لآخرها',
    customerStep1Title: '1. بحث عن الخدمة',
    customerStep1Desc: 'اختار من غسيل وكي أو كي بس أو دراي كلين — حسب اللي محتاجه.',
    customerStep2Title: '2. حدد تفاصيل طلبك',
    customerStep2Desc: 'اختار الرائحة والتغليف ودرجة النشا لكل قطعة زي ما تحب.',
    customerStep3Title: '3. حدد ميعاد الاستلام',
    customerStep3Desc: 'حدد الوقت اللي يناسبك والمندوب هييجيلك يأخد الملابس من بابك.',
    customerStep4Title: '4. تابع طلبك خطوة بخطوة',
    customerStep4Desc: 'تقدر تابع حالة غسيلك وتعرف امتى هيوصلك تاني.',
    customerStep5Title: '5. استلم ملابسك جاهزة',
    customerStep5Desc: 'المندوب يوصلك الملابس نظيفة، معطرة، وجاهزة للبس في الموعد.',
    customerCtaButton: 'اطلب خدمتك دلوقتي',

    // Services
    servicesHeading: 'خدمات العناية المتكاملة بالملابس',
    servicesSubhead: 'نقدم لك باقة خدمات متنوعة تلبي احتياجاتك اليومية والمناسبات الخاصة عبر مغاسل شريكة متخصصة.',
    service1Title: 'غسيل وكي متكامل',
    service1Desc: 'غسيل عميق بمنظفات لطيفة ومعطرات فاخرة، مع كي متقن بالبخار وتغليف واقٍ.',
    service2Title: 'كي بالبخار فقط',
    service2Desc: 'فرد تجاعيد الأقمشة والبدل والقمصان بدرجات حرارة محسوبة للحفاظ على النسيج.',
    service3Title: 'غسيل فقط',
    service3Desc: 'تنظيف وتجفيف للملابس اليومية والقطنيات بأعلى معايير النظافة والانتعاش.',
    service4Title: 'تنظيف جاف (دراي كلين)',
    service4Desc: 'معالجة متخصصة للبدل الرسمية، الفساتين، والمنسوجات الحساسة التي تتطلب عناية دقيقة.',
    service5Title: 'المفروشات والبطاطين',
    service5Desc: 'تنظيف عميق للملايات، الألحفة، والبطاطين الشتوية بماكينات ذات سعة استيعابية ملائمة.',
    service6Title: 'خدمات خاصة وتخصيص دقيق',
    service6Desc: 'إمكانية إضافة ملاحظات محددة لكل قطعة ومعالجة بقع مسبقة حسب إمكانيات المغسلة الشريكة.',
    serviceAvailabilityNote: 'ملاحظة: تختلف بعض الخدمات وقوائم الأسعار التقديرية بناءً على المغسلة الشريكة المختارة ونطاق التغطية الجغرافية.',

    // How it works
    howHeading: 'بتطلب ازاي؟',
    howSubhead: 'ثلات خطوات بس وملابسك هتتعمل — من غير دوشة ومن غير تعقيد.',
    howStep1Title: 'اختار خدمتك',
    howStep1Desc: 'اختار نوع الغسيل، الكي بالبخار، أو الدراي كلين وحدد تفاصيل كل قطعة.',
    howStep2Title: 'ادفع بالطريقة اللي تريحك',
    howStep2Desc: 'كاش لحد الباب، فودافون كاش، أو إنستاباي — كلهم بنفس السعر.',
    howStep3Title: 'تابع واستلم',
    howStep3Desc: 'تابع طلبك على الخريطة وانتظر المندوب يوصل ملابسك نضيفة لبابك.',
    howStep4Title: 'توصيل لباب بيتك',
    howStep4Desc: 'ملابسك ترجعلك نظيفة، معطرة، وجاهزة للبس في الموعد المحدد.',

    // Laundry Partner Section
    partnerHeading: 'عندك مغسلة؟ خليك أقرب للعملاء',
    partnerSubhead: 'انضم لشبكة عالسريع وابدأ تاخد طلبات أونلاين من عملاء في نطاقك — من غير ما تبني تطبيق أو تصرف على تسويق.',
    partnerBenefitsTitle: 'مزايا الشراكة مع عالسريع',
    partnerBenefit1: 'وصول لعملاء جدد بيدورو على غسيل في منطقتك يومياً.',
    partnerBenefit2: 'طلبات منتظمة تزود دخلك اليومي من غير مجهود إضافي.',
    partnerBenefit3: 'واجهة رقمية لمغسلتك من غير ما تبني تطبيق أو تدفع لمبرمج.',
    partnerBenefit4: 'تنسيق واضح وتواصل منظم مع فريق عالسريع في كل خطوة.',
    partnerBenefit5: 'فريق دعم متخصص يساعدك في الشغل من أول يوم.',
    partnerProcessTitle: 'خطوات الانضمام كمغسلة شريكة',
    partnerStep1Title: '1. ابعت طلبك',
    partnerStep1Desc: 'امل الاستمارة الجوايا ببيانات مغسلتك الأساسية.',
    partnerStep2Title: '2. هنراجع بياناتك',
    partnerStep2Desc: 'فريق عالسريع هيراجع المعلومات ويتأكد إن المنطقة في نطاق خدمتنا.',
    partnerStep3Title: '3. هنتواصل معاك',
    partnerStep3Desc: 'هنتصل بيك نناقش تفاصيل التعاون والأسعار وشروط الشراكة.',
    partnerStep4Title: '4. تفعيل الشراكة',
    partnerStep4Desc: 'يتم إدراج مغسلتك على المنصة والبدء في استقبال طلبات العملاء.',
    partnerCta: 'قدّم طلب الانضمام الآن',

    // Merchant Application Form
    formHeading: 'خلّي مغسلتك أقرب لعملاء أكتر',
    formSubhead: 'املأ البيانات التالية، وفريق عالسريع هيراجع طلبك ويتواصل معاك لمناقشة تفاصيل التعاون وشروط الشراكة.',
    formApplicantName: 'الاسم الكامل لمقدم الطلب',
    formApplicantNamePlaceholder: 'مثال: أحمد محمود إبراهيم',
    formBusinessName: 'اسم المغسلة أو النشاط التجاري',
    formBusinessNamePlaceholder: 'مثال: مغسلة النور الحديثة',
    formMobile: 'رقم الهاتف المحمول',
    formMobilePlaceholder: '01012345678 أو 011 / 012 / 015',
    formGovernorate: 'المحافظة',
    formGovernoratePlaceholder: 'اختر المحافظة',
    formCity: 'المدينة / المنطقة',
    formCityPlaceholder: 'اختر المدينة أو المنطقة',
    formAddress: 'العنوان التفصيلي للمغسلة',
    formAddressPlaceholder: 'اسم الشارع، رقم العقار، علامة مميزة قريبة',
    formServicesLabel: 'الخدمات المتوفرة لديكم (يمكن اختيار أكثر من خدمة):',
    formServiceWashIron: 'غسيل وكي ملابس',
    formServiceWashOnly: 'غسيل فقط',
    formServiceIronOnly: 'كي بالبخار فقط',
    formServiceDryClean: 'تنظيف جاف (دراي كلين)',
    formServiceLinens: 'غسيل مفروشات وبطاطين',
    formServiceCarpets: 'سجاد وموكيت',
    formOperatingStatus: 'حالة النشاط التجاري حالياً:',
    formStatusActive: 'المغسلة تعمل وتستقبل عملاء يومياً',
    formStatusExpanding: 'نشاط قائم ونرغب في التوسع وزيادة الطلبات',
    formStatusNew: 'فرع جديد أو قيد التجهيز للافتتاح',
    formContactMethod: 'طريقة التواصل المفضلة:',
    formContactPhone: 'اتصال هاتفي',
    formContactWhatsApp: 'رسالة واتساب',
    formContactEmail: 'بريد إلكتروني',
    formEmailOptional: 'البريد الإلكتروني للنشاط (اختياري)',
    formWhatsAppOptional: 'رقم واتساب مختلف عن المحمول (اختياري)',
    formWebsiteOptional: 'صفحة فيسبوك أو موقع إلكتروني (اختياري)',
    formCapacityOptional: 'الطاقة الاستيعابية التقديرية يومياً بالقطع (اختياري)',
    formNotesOptional: 'ملاحظات إضافية تود مشاركتها معنا (اختياري)',
    formLocationLinkOptional: 'رابط خرائط جوجل للمغسلة (اختياري)',
    formPrivacyConsent: 'أوافق على قيام فريق عالسريع بالتواصل معي لمناقشة طلب الشراكة واستخدام البيانات للأغراض الموضحة في سياسة الخصوصية.',
    formSubmitBtn: 'إرسال طلب الانضمام',
    formSubmitting: 'جاري تسجيل الطلب...',
    formSuccessMsg: 'تم استلام طلبك بنجاح في وضع التجربة. سيتم تفعيل الإرسال الفعلي بعد ربط الموقع بخدمة استقبال الطلبات.',
    formValidationErr: 'يرجى التأكد من ملء جميع الحقول المطلوبة ومراجعة صحة رقم الهاتف والموافقة على شروط التواصل.',
    formRequiredNotice: 'الحقول التي تحمل علامة (*) إلزامية لاستكمال مراجعة الطلب.',

    // Delivery Partner Section
    deliveryHeading: 'حابب تكون جزء من رحلة عالسريع؟',
    deliverySubhead: 'نبحث دائماً عن شركاء توصيل موثوقين للانضمام لشبكة نقل الملابس بين العملاء والمغاسل الشريكة وفق نموذج عمل منظم ومناسب.',
    deliveryBenefit1Title: 'فرص عمل مرنة',
    deliveryBenefit1Desc: 'تنظيم أوقات التوصيل وساعات العمل بما يتلاءم مع مواعيدك المتاحة.',
    deliveryBenefit2Title: 'مسارات واضحة ونطاق محدد',
    deliveryBenefit2Desc: 'توصيل محلي داخل نطاق جغرافي محدد بالقرب من منطقتك السكنية.',
    deliveryBenefit3Title: 'تطبيق وإرشادات واضحة',
    deliveryBenefit3Desc: 'تعليمات دقيقة لكل طلب لاستلام وتسليم الملابس بأمان وبأعلى درجات الاحترام.',
    deliveryCta: 'اهتم بالانضمام للتوصيل',
    deliveryNotice: 'ملاحظة: برنامج شركاء التوصيل يخضع لخطة التوسع الجغرافي وحجم الطلبات المتاح في كل مدينة.',
    deliveryModalTitle: 'إبداء الاهتمام بالانضمام كشريك توصيل',
    deliveryModalDesc: 'سجل رغبتك بالانضمام، وسيقوم فريق العمل بالتواصل معك فور بدء التوظيف في منطقتك.',
    deliveryModalName: 'الاسم بالكامل',
    deliveryModalPhone: 'رقم الهاتف المحمول',
    deliveryModalCity: 'المدينة / المنطقة السكنية',
    deliveryModalVehicle: 'وسيلة التنقل المتوفرة لديك:',
    deliveryVehicleMotorcycle: 'دراجة نارية (موتوسيكل / سكوتر)',
    deliveryVehicleCar: 'سيارة صغيرة أو فان',
    deliveryVehicleBicycle: 'دراجة هوائية / بدون وسيلة',
    deliveryModalSubmit: 'تسجيل الاهتمام',
    deliveryModalSuccess: 'تم تسجيل رغبتك بنجاح في وضع التجربة. سنتواصل معك عند فتح الشواغر في نطاقك.',

    // Trust & Transparency
    trustHeading: 'مبادئ الخدمة والشفافية',
    trustSubhead: 'نبني عالسريع ليكون جسراً موثوقاً بينك وبين أفضل خدمات العناية بالملابس.',
    trustPrinciple1Title: 'وضوح تفاصيل الخدمة',
    trustPrinciple1Desc: 'نعرض تفاصيل كل خدمة ونوعها قبل إتمام الطلب، لتعرف بدقة ما ستحصل عليه.',
    trustPrinciple2Title: 'تغطية تتسع تدريجياً',
    trustPrinciple2Desc: 'نعمل حالياً في محافظات مختارة (الشرقية، الدقهلية، القاهرة، الجيزة) ونتوسع بحرص لضمان جودة الأداء.',
    trustPrinciple3Title: 'شراكات محلية حقيقية',
    trustPrinciple3Desc: 'نتعاون مع مغاسل محلية قائمة وموثوقة، وندعم أصحاب الأعمال الحرفيين في منطقتك.',
    trustPrinciple4Title: 'احترام المواعيد والملابس',
    trustPrinciple4Desc: 'نعتبر كل قطعة ملابس أمانة خاصة، ونهتم بتسليمها في أفضل صورة وأنسب وقت ممكن.',

    // FAQ
    faqHeading: 'الأسئلة الأكثر شيوعاً',
    faqSubhead: 'إجابات واضحة ومباشرة حول كيفية عمل منصة عالسريع وكيفية الاستفادة منها.',
    faqQ1: 'ما هي منصة عالسريع؟',
    faqA1: 'عالسريع هي منصة رقمية مصرية مخصصة لخدمات العناية بالملابس والغسيل، تربط العملاء الراغبين في غسيل وكي ملابسهم بأقرب وأفضل المغاسل الشريكة، مع تنظيم مواعيد استلام وتسليم مريحة من وإلى باب بيتك.',
    faqQ2: 'كيف أطلب خدمة غسيل أو كي؟',
    faqA2: 'يمكنك استخدام تطبيق عالسريع للهواتف الذكية لاختيار نوع الخدمة المطلوبة والقطع التي تريد غسيلها، وتحديد موعد ومكان الاستلام والتسليم المناسبين لك، ثم تأكيد الطلب.',
    faqQ3: 'ما هي الخدمات المتاحة حالياً؟',
    faqA3: 'تشمل الخدمات: الغسيل والكي المتكامل، الكي بالبخار فقط، الغسيل فقط، التنظيف الجاف (دراي كلين)، بالإضافة إلى خدمات المفروشات والبطاطين وفق إمكانيات كل مغسلة شريكة.',
    faqQ4: 'هل خدمة الاستلام والتوصيل متوفرة في كل المحافظات؟',
    faqA4: 'التغطية الحالية تشمل مدناً ومناطق محددة في محافظات الشرقية (مثل الزقازيق والعاشر من رمضان)، الدقهلية (المنصورة)، والقاهرة الكبرى. تتوفر الخدمة حسب نطاق تواجد المغاسل الشريكة ومندوبي التوصيل في كل حي.',
    faqQ5: 'كيف يمكن لأصحاب المغاسل الانضمام لمنصة عالسريع؟',
    faqA5: 'يمكن لصاحب أي مغسلة قائمة ملء استمارة الشراكة المتوفرة في هذه الصفحة. يقوم فريقنا بمراجعة الطلب والتواصل لمناقشة شروط التعاون وقوائم الأسعار والخدمات المؤهلة.',
    faqQ6: 'هل تقديم طلب الشراكة يعني الموافقة الفورية على الانضمام؟',
    faqA6: 'لا، تقديم الاستمارة هو خطوة أولى لمراجعة الطلب. يتم تفعيل المغسلة رسمياً بعد التواصل والتحقق من جودة وموقع المغسلة والاتفاق على الشروط التجارية.',
    faqQ7: 'كيف يتم تحديد أسعار الخدمات؟',
    faqA7: 'الأسعار محددة وواضحة لكل نوع قطعة ونوع خدمة وفق قائمة أسعار المغسلة الشريكة المختارة، وتظهر لك التكلفة التقديرية بالجنيه المصري قبل تأكيد الطلب.',
    faqQ8: 'كيف يمكنني التقديم كشريك توصيل (مندوب)؟',
    faqA8: 'يمكنك الضغط على زر "اهتم بالانضمام للتوصيل" في قسم شركاء التوصيل وإدخال بياناتك. سنقوم بالتواصل معك عندما تبدأ عمليات التوصيل في منطقتك.',
    faqQ9: 'كيف أتواصل مع فريق خدمة العملاء أو الدعم؟',
    faqA9: 'يمكنك التواصل معنا عبر قنوات الدعم والمساعدة المتاحة داخل التطبيق أو عبر نموذج الاتصال، ويسعد فريقنا بتقديم المساعدة والإجابة على أي استفسار.',

    // Footer & Legal
    footerAbout: 'عالسريع هي منصتك المحلية للعناية بالملابس والغسيل في مصر. نربطك بأفضل المغاسل ونوفر لك راحة البال والوقت.',
    footerQuickLinks: 'روابط سريعة',
    footerPartners: 'الشراكات',
    footerLegal: 'الشروط والخصوصية',
    footerPrivacy: 'سياسة الخصوصية',
    footerTerms: 'شروط الاستخدام',
    footerCopyright: 'جميع الحقوق محفوظة لمنصة عالسريع',
    footerDevNotice: 'الموقع التعريفي الرسمي — نسخة التطوير والربط المؤسسي',
    modalClose: 'إغلاق'
  },
  en: {
    // Brand
    brandName: 'Ala El Saree',
    brandSub: 'عالسريع',
    brandPromise: 'Laundry care and delivery, made easier',

    // Nav
    navHome: 'Home',
    navServices: 'Services',
    navHowItWorks: 'How It Works',
    navForLaundries: 'For Laundries',
    navForDelivery: 'Delivery Partners',
    navFaq: 'FAQ',
    navCustomerCta: 'Order Service',
    navRegister: 'Login / Create Account',
    navJoinPartner: 'Join as Partner',
    toggleLang: 'عربي',

    // Hero
    heroKicker: 'Garment Care & Laundry Marketplace in Egypt',
    heroHeadline: 'Laundry care and delivery, made easier',
    heroSubhead: 'Washing, ironing, and garment care services with straightforward pickup and delivery. If you operate a laundry shop, Ala El Saree helps you connect with more customers in your neighborhood.',
    heroPrimaryCta: 'Discover Services',
    heroSecondaryCta: 'Join as Laundry Partner',
    heroBadgeCoverage: 'Doorstep pickup subject to active coverage',
    heroBadgePartners: 'Carefully selected local partner laundries',
    heroBadgeCare: 'Attentive care for every fabric',
    heroBadgeDelivery: 'Reliable scheduling tailored to your day',

    // Customer Section
    customerHeading: 'Garment Care Made Simple',
    customerSubhead: 'A thoughtful experience designed to save your time and effort, from selecting custom service preferences to receiving fresh, neatly folded clothes.',
    customerJourneyTitle: 'A straightforward customer journey',
    customerStep1Title: '1. Discover Available Services',
    customerStep1Desc: 'Browse washing, steam ironing, and dry cleaning services available in your district.',
    customerStep2Title: '2. Specify Your Garments',
    customerStep2Desc: 'Choose your desired service per item, along with fragrance, starch preference, and packaging type.',
    customerStep3Title: '3. Schedule Pickup',
    customerStep3Desc: 'Pick a convenient time slot for garment collection from your doorstep or address.',
    customerStep4Title: '4. Follow Order Progress',
    customerStep4Desc: 'Stay updated as your clothes are washed, pressed, and carefully inspected by the laundry.',
    customerStep5Title: '5. Receive Clean Clothes',
    customerStep5Desc: 'Your freshly cleaned, sealed garments arrive back on time and ready to wear.',
    customerCtaButton: 'Try the Customer App Now',

    // Services
    servicesHeading: 'Comprehensive Garment Care Services',
    servicesSubhead: 'A broad range of professional laundry and textile care options delivered through dedicated local partners.',
    service1Title: 'Wash & Steam Iron',
    service1Desc: 'Deep, gentle washing paired with precision steam pressing and protective packaging.',
    service2Title: 'Steam Iron Only',
    service2Desc: 'Smooth out creases on shirts, suits, and delicate fabrics at calibrated temperatures.',
    service3Title: 'Wash & Dry Only',
    service3Desc: 'Fresh cleaning and drying for everyday casuals and cottons, prioritizing hygiene and freshness.',
    service4Title: 'Dry Cleaning',
    service4Desc: 'Specialized chemical care for formal suits, evening dresses, and delicate garments.',
    service5Title: 'Bedding & Linens',
    service5Desc: 'Thorough cleaning for duvets, blankets, and bedsheets using commercial high-capacity machines.',
    service6Title: 'Custom Preferences',
    service6Desc: 'Tailor your request with specific garment notes and stain care instructions per piece.',
    serviceAvailabilityNote: 'Note: Service availability and estimated prices vary depending on the selected partner laundry and local coverage area.',

    // How it works
    howHeading: 'How Ala El Saree Works',
    howSubhead: 'Four transparent steps combining modern mobile technology with skilled artisan laundry care.',
    howStep1Title: 'Select Service & Items',
    howStep1Desc: 'Pick your items, choose wash/iron options, fragrance, and packaging.',
    howStep2Title: 'Enter Pickup Details',
    howStep2Desc: 'Provide your location and select an available collection window.',
    howStep3Title: 'Careful Processing',
    howStep3Desc: 'Our courier delivers the garments to the designated certified local partner.',
    howStep4Title: 'Prompt Doorstep Return',
    howStep4Desc: 'Your fresh garments are delivered back neatly hung or folded as requested.',

    // Laundry Partner Section
    partnerHeading: 'Run a Laundry Shop? Reach More Customers',
    partnerSubhead: 'Join the Ala El Saree network and open new order opportunities from neighborhood customers within your service range, according to partnership terms and active coverage.',
    partnerBenefitsTitle: 'Why Partner with Ala El Saree?',
    partnerBenefit1: 'Greater digital visibility to local customers seeking laundry services nearby.',
    partnerBenefit2: 'Additional regular order volume that complements your walk-in customer base.',
    partnerBenefit3: 'A ready digital presence for your laundry shop without software development costs.',
    partnerBenefit4: 'Structured service requests with clear garment specifications and agreed prices.',
    partnerBenefit5: 'Dedicated partner onboarding and support throughout your operational journey.',
    partnerProcessTitle: 'Four-Step Partnership Process',
    partnerStep1Title: '1. Submit Application',
    partnerStep1Desc: 'Fill out the partnership inquiry form below with your shop details.',
    partnerStep2Title: '2. Review & Assessment',
    partnerStep2Desc: 'Our team examines your application to ensure alignment with our service zone.',
    partnerStep3Title: '3. Consultation & Agreement',
    partnerStep3Desc: 'We contact you by phone to discuss coverage areas, pricing schedules, and commercial terms.',
    partnerStep4Title: '4. Partnership Activation',
    partnerStep4Desc: 'Your shop is listed on the platform and you start receiving order requests.',
    partnerCta: 'Apply for Partnership Now',

    // Merchant Application Form
    formHeading: 'Bring Your Laundry Closer to Customers',
    formSubhead: 'Complete the form below and the Ala El Saree team will review your application and contact you to discuss partnership terms.',
    formApplicantName: 'Applicant Full Name',
    formApplicantNamePlaceholder: 'e.g. Ahmed Mahmoud Ibrahim',
    formBusinessName: 'Laundry / Business Name',
    formBusinessNamePlaceholder: 'e.g. Al Noor Modern Cleaners',
    formMobile: 'Mobile Phone Number',
    formMobilePlaceholder: 'e.g. 01012345678 or 011 / 012 / 015',
    formGovernorate: 'Governorate',
    formGovernoratePlaceholder: 'Select governorate',
    formCity: 'City / District',
    formCityPlaceholder: 'Select city or district',
    formAddress: 'Detailed Laundry Address',
    formAddressPlaceholder: 'Street name, building number, nearby landmark',
    formServicesLabel: 'Services You Provide (multiple selections allowed):',
    formServiceWashIron: 'Wash & Steam Iron',
    formServiceWashOnly: 'Wash Only',
    formServiceIronOnly: 'Steam Iron Only',
    formServiceDryClean: 'Dry Cleaning',
    formServiceLinens: 'Linens & Blankets',
    formServiceCarpets: 'Rugs & Carpets',
    formOperatingStatus: 'Current Operating Status:',
    formStatusActive: 'Operational and serving walk-in customers daily',
    formStatusExpanding: 'Established business seeking volume growth',
    formStatusNew: 'New branch or preparing for launch',
    formContactMethod: 'Preferred Contact Method:',
    formContactPhone: 'Phone Call',
    formContactWhatsApp: 'WhatsApp Message',
    formContactEmail: 'Email',
    formEmailOptional: 'Business Email (Optional)',
    formWhatsAppOptional: 'WhatsApp Number if different (Optional)',
    formWebsiteOptional: 'Facebook Page or Website (Optional)',
    formCapacityOptional: 'Estimated Daily Garment Capacity (Optional)',
    formNotesOptional: 'Additional Notes or Equipment Details (Optional)',
    formLocationLinkOptional: 'Google Maps Link for the Shop (Optional)',
    formPrivacyConsent: 'I agree to let the Ala El Saree team contact me regarding this partnership inquiry and process this information as outlined in the privacy policy.',
    formSubmitBtn: 'Submit Partnership Application',
    formSubmitting: 'Submitting application...',
    formSuccessMsg: 'Your application has been received successfully in demo mode. Live transmission will be enabled once connected to the operational receiving service.',
    formValidationErr: 'Please verify all required fields, ensure a valid Egyptian phone number, and agree to the contact consent.',
    formRequiredNotice: 'Fields marked with (*) are required for partnership evaluation.',

    // Delivery Partner Section
    deliveryHeading: 'Want to Join the Ala El Saree Journey?',
    deliverySubhead: 'We are expanding our network of reliable courier partners to connect neighborhood laundry shops with customers under a structured delivery model.',
    deliveryBenefit1Title: 'Flexible Opportunities',
    deliveryBenefit1Desc: 'Schedule delivery availability according to your preferred operating hours.',
    deliveryBenefit2Title: 'Local Service Zones',
    deliveryBenefit2Desc: 'Operate within defined neighborhoods close to your home base.',
    deliveryBenefit3Title: 'Clear Order Instructions',
    deliveryBenefit3Desc: 'Accurate pickup and delivery guidelines for safe, respectful garment handling.',
    deliveryCta: 'Express Delivery Interest',
    deliveryNotice: 'Note: Delivery partner opportunities depend on geographic rollout plans and order density per district.',
    deliveryModalTitle: 'Delivery Partner Expression of Interest',
    deliveryModalDesc: 'Register your interest and our operations team will reach out as soon as delivery slots open in your area.',
    deliveryModalName: 'Full Name',
    deliveryModalPhone: 'Mobile Phone Number',
    deliveryModalCity: 'City / Residential Area',
    deliveryModalVehicle: 'Available Vehicle:',
    deliveryVehicleMotorcycle: 'Motorcycle / Scooter',
    deliveryVehicleCar: 'Compact Car / Van',
    deliveryVehicleBicycle: 'Bicycle / On Foot',
    deliveryModalSubmit: 'Register Interest',
    deliveryModalSuccess: 'Your interest has been recorded in demo mode. We will contact you when delivery onboarding begins in your zone.',

    // Trust & Transparency
    trustHeading: 'Our Principles & Transparency',
    trustSubhead: 'Building a reliable bridge between your wardrobe and the best local garment care specialists.',
    trustPrinciple1Title: 'Transparent Service Details',
    trustPrinciple1Desc: 'Clear service breakdowns and expectations presented before order confirmation.',
    trustPrinciple2Title: 'Gradual, Measured Expansion',
    trustPrinciple2Desc: 'Currently serving selected cities across Sharqia, Dakahlia, Cairo, and Giza with careful quality oversight.',
    trustPrinciple3Title: 'Real Local Partnerships',
    trustPrinciple3Desc: 'We partner with established neighborhood businesses and support local craftspeople.',
    trustPrinciple4Title: 'Respect for Your Garments',
    trustPrinciple4Desc: 'Every piece of clothing is treated as a personal trust, returned cleanly and punctually.',

    // FAQ
    faqHeading: 'Frequently Asked Questions',
    faqSubhead: 'Honest, straightforward answers about how Ala El Saree works for customers, laundries, and couriers.',
    faqQ1: 'What is Ala El Saree?',
    faqA1: 'Ala El Saree is an Egyptian digital laundry service marketplace connecting customers with verified local partner laundries, backed by organized doorstep collection and delivery.',
    faqQ2: 'How do I request laundry service?',
    faqA2: 'You can use the Ala El Saree customer mobile application to choose your needed services, customize garments, pick a collection time slot, and confirm your order.',
    faqQ3: 'Which services are currently available?',
    faqA3: 'Services include complete wash & iron, steam pressing only, wash only, specialized dry cleaning, and bulky items like blankets and linens depending on the selected partner.',
    faqQ4: 'Is doorstep pickup available in every governorate?',
    faqA4: 'Current operations cover specific districts in Al Sharqia (such as Zagazig and 10th of Ramadan), Dakahlia (Mansoura), and Greater Cairo. Service availability depends on nearby active partners.',
    faqQ5: 'How can a laundry shop join the platform?',
    faqA5: 'Shop owners can fill out the partnership inquiry form on this page. Our team reviews the application and contacts the owner to discuss coverage, pricing, and operational terms.',
    faqQ6: 'Does submitting the form grant instant approval?',
    faqA6: 'No, form submission is an initial review step. Laundries are activated after review, verification of service quality and location, and mutual agreement on commercial terms.',
    faqQ7: 'How are service prices calculated?',
    faqA7: 'Prices are established based on the chosen partner laundry’s transparent catalog per item and service type. An estimated total in Egyptian Pounds is displayed prior to booking.',
    faqQ8: 'How can I apply to become a delivery partner?',
    faqA8: 'Click the "Express Delivery Interest" button in the delivery section to register your information. We will get in touch once courier recruitment starts in your district.',
    faqQ9: 'How do I reach customer support?',
    faqA9: 'You can reach our support team through the in-app help center or contact channels. Our team is always ready to assist with any questions or order updates.',

    // Footer & Legal
    footerAbout: 'Ala El Saree is your local marketplace for laundry and garment care in Egypt. Connecting you with skilled neighborhood cleaners for effortless everyday living.',
    footerQuickLinks: 'Quick Links',
    footerPartners: 'Partnerships',
    footerLegal: 'Legal & Privacy',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    footerCopyright: 'All rights reserved to Ala El Saree Platform',
    footerDevNotice: 'Official Corporate Website — Development & Integration Release',
    modalClose: 'Close'
  }
};
