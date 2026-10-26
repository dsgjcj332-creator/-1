export interface MerchantApplicationData {
  applicantName: string;
  businessName: string;
  mobile: string;
  password?: string;
  governorate: string;
  city: string;
  address: string;
  services: string[];
  operatingStatus: string;
  contactMethod: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  capacity?: string;
  notes?: string;
  locationLink?: string;
  coordinates?: { lat: number; lng: number };
  privacyConsent: boolean;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  isDemo: boolean;
  referenceId?: string;
}

/**
 * Validates Egyptian mobile phone format (010, 011, 012, 015 with 8 digits after prefix, total 11 digits,
 * or with +20 prefix)
 */
export function validateEgyptianPhone(phone: string): boolean {
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  const egRegex = /^(?:\+?20|0)?1[0125]\d{8}$/;
  return egRegex.test(clean);
}

/**
 * Submits the merchant partnership application.
 * Currently runs in compliant demo mode as specified in the project guidelines,
 * with clean structure ready to connect to a real backend endpoint without UI changes.
 */
export async function submitMerchantApplication(
  data: MerchantApplicationData,
  lang: 'ar' | 'en' = 'ar'
): Promise<SubmissionResult> {
  // 1. Client-side validation check
  if (!data.applicantName.trim()) {
    return {
      success: false,
      message: lang === 'ar' ? 'يرجى إدخال اسم مقدم الطلب' : 'Applicant name is required',
      isDemo: true
    };
  }
  if (!data.businessName.trim()) {
    return {
      success: false,
      message: lang === 'ar' ? 'يرجى إدخال اسم المغسلة أو النشاط' : 'Business name is required',
      isDemo: true
    };
  }
  if (!validateEgyptianPhone(data.mobile)) {
    return {
      success: false,
      message:
        lang === 'ar'
          ? 'يرجى إدخال رقم هاتف محمول مصري صحيح (مثال: 01012345678)'
          : 'Please enter a valid Egyptian mobile number (e.g. 01012345678)',
      isDemo: true
    };
  }
  if (!data.governorate) {
    return {
      success: false,
      message: lang === 'ar' ? 'يرجى اختيار المحافظة' : 'Governorate is required',
      isDemo: true
    };
  }
  if (!data.city) {
    return {
      success: false,
      message: lang === 'ar' ? 'يرجى تحديد المدينة أو الحي' : 'City or district is required',
      isDemo: true
    };
  }
  if (!data.address.trim()) {
    return {
      success: false,
      message: lang === 'ar' ? 'يرجى إدخال العنوان التفصيلي للمغسلة' : 'Detailed address is required',
      isDemo: true
    };
  }
  if (!data.services || data.services.length === 0) {
    return {
      success: false,
      message: lang === 'ar' ? 'يرجى اختيار خدمة واحدة على الأقل' : 'Select at least one service',
      isDemo: true
    };
  }
  if (!data.privacyConsent) {
    return {
      success: false,
      message:
        lang === 'ar'
          ? 'يرجى الموافقة على التواصل ومراجعة البيانات للمتابعة'
          : 'Please agree to contact terms to proceed',
      isDemo: false
    };
  }

  const cityPrefix = (data.city || 'ZAG').slice(0, 3).toUpperCase();
  const refNum = `APP-${cityPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newApp = {
    id: `app-${Date.now()}`,
    referenceNumber: refNum,
    applicantName: data.applicantName.trim(),
    businessName: data.businessName.trim(),
    mobile: data.mobile.trim(),
    governorate: data.governorate.trim(),
    city: data.city.trim(),
    address: data.address.trim(),
    services: data.services,
    operatingStatus: data.operatingStatus || 'قائمة وتعمل',
    contactMethod: data.contactMethod || 'واتساب',
    email: data.email || '',
    whatsapp: data.whatsapp || data.mobile,
    website: data.website || '',
    capacity: data.capacity || '',
    notes: data.notes || '',
    password: data.password || '',
    locationLink: data.locationLink || '',
    coordinates: data.coordinates || null,
    privacyConsent: true,
    status: 'new',
    receivedAt: new Date().toISOString()
  };

  try {
    const existingRaw = localStorage.getItem('ala_el_saree_ops_applications');
    let existing = existingRaw ? JSON.parse(existingRaw) : [];
    if (!Array.isArray(existing)) existing = [];
    existing = [newApp, ...existing.filter((a: any) => a.id !== newApp.id)];
    localStorage.setItem('ala_el_saree_ops_applications', JSON.stringify(existing));

    // Also add to audit logs
    const logsRaw = localStorage.getItem('ala_el_saree_ops_audit_logs');
    let logs = logsRaw ? JSON.parse(logsRaw) : [];
    if (!Array.isArray(logs)) logs = [];
    logs = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorName: data.applicantName,
        actorRole: 'customer',
        action: 'تسجيل طلب انضمام شريك مغسلة جديد',
        entityType: 'application',
        entityId: newApp.id,
        details: `استلام طلب انضمام جديد من ${data.applicantName} (${data.businessName} - ${data.city}) برقم مرجعي ${refNum}`
      },
      ...logs
    ];
    localStorage.setItem('ala_el_saree_ops_audit_logs', JSON.stringify(logs));

    // Dispatch real-time custom event so Operations app updates immediately
    window.dispatchEvent(new CustomEvent('ala_el_saree_new_application', { detail: newApp }));
  } catch (e) {
    console.warn('Storage sync warning:', e);
  }

  // Attempt backend API submission in background
  try {
    const { api } = await import('../../api/client');
    await api.applications.submit({
      applicantName: data.applicantName,
      businessName: data.businessName,
      mobile: data.mobile,
      governorate: data.governorate,
      city: data.city,
      address: data.address,
      services: data.services,
      operatingStatus: data.operatingStatus,
      contactMethod: data.contactMethod,
      email: data.email,
      whatsapp: data.whatsapp,
      website: data.website,
      capacity: data.capacity,
      notes: data.notes,
      privacyConsent: true
    });
  } catch {
    // Backend offline / development mode is fully supported via state & storage
  }

  return {
    success: true,
    message:
      lang === 'ar'
        ? `تم استلام طلبكم بنجاح برقم مرجعي (${refNum}) وتسجيله في لوحة الإدارة المركزية لمتابعة التأهيل.`
        : `Your application has been received successfully (Ref: ${refNum}) and registered in the operations console.`,
    isDemo: false,
    referenceId: refNum
  };
}

export interface DeliveryInterestData {
  fullName: string;
  mobile: string;
  city: string;
  vehicle: string;
}

export async function submitDeliveryInterest(
  data: DeliveryInterestData,
  lang: 'ar' | 'en' = 'ar'
): Promise<SubmissionResult> {
  if (!data.fullName.trim() || !validateEgyptianPhone(data.mobile) || !data.city.trim()) {
    return {
      success: false,
      message:
        lang === 'ar'
          ? 'يرجى إكمال البيانات الأساسية والتأكد من صحة رقم الهاتف'
          : 'Please complete all required fields with a valid mobile number',
      isDemo: true
    };
  }

  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    success: true,
    message:
      lang === 'ar'
        ? 'تم تسجيل رغبتك بنجاح في وضع التجربة. سنتواصل معك عند فتح الشواغر في نطاقك.'
        : 'Your interest has been recorded in demo mode. We will contact you when delivery onboarding begins in your zone.',
    isDemo: true
  };
}
