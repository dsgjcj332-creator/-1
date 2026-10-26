import React, { useState } from 'react';
import {
  Store,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Check,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn,
  KeyRound,
  X,
  MapPin,
  Navigation,
  ExternalLink,
  Globe
} from 'lucide-react';
import { EGYPT_GOVERNORATES } from './data/egyptLocations';
import {
  submitMerchantApplication,
  validateEgyptianPhone,
  MerchantApplicationData
} from './services/merchantApplicationService';

interface RegisterPageProps {
  onBackToLanding: () => void;
  onLoginMerchant?: () => void;
  onLoginAdmin?: () => void;
  onOpenCustomerApp?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onBackToLanding,
  onLoginMerchant,
  onLoginAdmin
}) => {
  // authMode: 'login' (shows first) or 'register' (shows partnership application)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Secret 5-clicks tracker on Logo (COMPLETELY SILENT - No visual counter)
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  // Admin login modal state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  // Standard Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration Password State
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Map / Geolocation State
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [manualMapUrl, setManualMapUrl] = useState('');

  // Partnership Application form state
  const [formData, setFormData] = useState<MerchantApplicationData>({
    applicantName: '',
    businessName: '',
    mobile: '',
    whatsapp: '',
    governorate: '',
    city: '',
    address: '',
    services: ['wash_iron', 'wash_only'],
    operatingStatus: 'active',
    contactMethod: 'phone',
    email: '',
    website: '',
    capacity: '',
    notes: '',
    locationLink: '',
    coordinates: undefined,
    privacyConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ message: string; ref?: string } | null>(null);

  const selectedGov = EGYPT_GOVERNORATES.find(g => g.id === formData.governorate);

  // Geolocation Handler - Automatically detects current location via GPS
  const handleAutoLocate = () => {
    setGeoLoading(true);
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('المتصفح لديك لا يدعم ميزة تحديد الموقع الجغرافي.');
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const gmapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

        setFormData(prev => ({
          ...prev,
          coordinates: { lat, lng },
          locationLink: gmapsLink
        }));
        setManualMapUrl(gmapsLink);
        setGeoLoading(false);
        setGeoSuccess(true);

        // Try reverse geocoding to auto-fill address if empty
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              setFormData(prev => {
                if (!prev.address) {
                  return { ...prev, address: data.display_name };
                }
                return prev;
              });
            }
          }
        } catch {
          // optional fallback
        }
      },
      err => {
        setGeoLoading(false);
        if (err.code === 1) {
          setGeoError('تم رفض إذن الوصول للموقع. يرجى السماح بالإذن أو لصق رابط خرائط جوجل يدوياً.');
        } else {
          setGeoError('تعذر تحديد الموقع الجغرافي حالياً. يرجى لصق رابط خرائط جوجل.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Helper for manual map link pasting
  const handleMapUrlChange = (url: string) => {
    setManualMapUrl(url);
    setFormData(prev => ({ ...prev, locationLink: url }));

    // Extract lat/lng from common Google Maps link formats
    const qMatch = url.match(/[?&]q=([0-9.-]+),([0-9.-]+)/);
    const atMatch = url.match(/@([0-9.-]+),([0-9.-]+)/);
    const directMatch = url.match(/([0-9]{2}\.[0-9]+)\s*,\s*([0-9]{2}\.[0-9]+)/);

    const match = qMatch || atMatch || directMatch;
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setFormData(prev => ({
          ...prev,
          coordinates: { lat, lng }
        }));
        setGeoSuccess(true);
      }
    }
  };

  // Silent 5-clicks handler on Logo
  const handleLogoClick = () => {
    const next = logoClicks + 1;
    if (next >= 5) {
      setLogoClicks(0);
      setShowAdminModal(true);
      setAdminError(null);
    } else {
      setLogoClicks(next);
      setTimeout(() => {
        setLogoClicks(prev => (prev > 0 ? prev - 1 : 0));
      }, 3000);
    }
  };

  // Admin Modal Login verification
  const handleAdminModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (adminUsername.trim() === 'admin' && adminPassword === '1234') {
      setAdminLoading(true);
      setTimeout(() => {
        setAdminLoading(false);
        setShowAdminModal(false);
        if (onLoginAdmin) {
          onLoginAdmin();
        }
      }, 400);
    } else {
      setAdminError('بيانات الدخول غير صحيحة. اسم المستخدم: admin وكلمة المرور: 1234');
    }
  };

  // Main Form Login (REAL AUTHENTICATION with Phone + Registered Password & Data Isolation)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const identifier = loginIdentifier.trim();
    const pwd = loginPassword.trim();

    if (!identifier) {
      setLoginError('يرجى إدخال رقم الهاتف أو اسم المستخدم');
      return;
    }
    if (!pwd) {
      setLoginError('يرجى إدخال كلمة المرور');
      return;
    }

    // Direct check for Admin credentials:
    if (identifier.toLowerCase() === 'admin' && pwd === '1234') {
      setLoginLoading(true);
      setTimeout(() => {
        setLoginLoading(false);
        if (onLoginAdmin) {
          onLoginAdmin();
        }
      }, 400);
      return;
    }

    setLoginLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Read real merchants from localStorage
      const merchantsRaw = localStorage.getItem('ala_el_saree_ops_merchants');
      let merchants: any[] = [];
      try {
        merchants = merchantsRaw ? JSON.parse(merchantsRaw) : [];
      } catch {
        merchants = [];
      }

      // Read applications from localStorage
      const appsRaw = localStorage.getItem('ala_el_saree_ops_applications');
      let apps: any[] = [];
      try {
        apps = appsRaw ? JSON.parse(appsRaw) : [];
      } catch {
        apps = [];
      }

      const normalizePhone = (num: string) => {
        return (num || '').replace(/[\s\-\(\)\+]/g, '').replace(/^20/, '').replace(/^0/, '');
      };

      const cleanInput = normalizePhone(identifier);

      // 1. Look up application
      const matchedApp = apps.find((a: any) => {
        const appPhone = normalizePhone(a.mobile);
        return (
          appPhone === cleanInput ||
          (a.mobile && a.mobile.trim() === identifier) ||
          (a.referenceNumber && a.referenceNumber.toLowerCase() === identifier.toLowerCase())
        );
      });

      // 2. Look up in active merchants
      let matchedMerchant = merchants.find((m: any) => {
        const merchPhone = normalizePhone(m.phone);
        return (
          merchPhone === cleanInput ||
          (m.phone && m.phone.trim() === identifier) ||
          m.id === identifier
        );
      });

      // If application exists and has been activated/approved by Admin, make sure merchant business exists
      if (!matchedMerchant && matchedApp && (matchedApp.onboardingStage === 'activated' || matchedApp.status === 'approved')) {
        matchedMerchant = {
          id: `m-act-${matchedApp.id.slice(-4)}`,
          nameAr: matchedApp.businessName,
          nameEn: matchedApp.businessName,
          commercialRegNo: `CR-782190`,
          taxNumber: `TAX-991203`,
          ownerName: matchedApp.applicantName,
          phone: matchedApp.mobile,
          governorate: matchedApp.governorate,
          city: matchedApp.city,
          district: matchedApp.address,
          address: matchedApp.address,
          status: 'active',
          commissionRate: 0.08,
          serviceFeePayer: 'customer',
          capacityBagsPerDay: 40,
          activeHours: '09:00 ص - 11:00 م',
          payoutMethod: 'instapay',
          payoutDetails: `${matchedApp.mobile}@instapay`,
          rating: 5.0,
          totalOrdersFulfilled: 0,
          password: matchedApp.password || '',
          locationLink: matchedApp.locationLink || '',
          coordinates: matchedApp.coordinates
        };
        const updatedMerchants = [...merchants, matchedMerchant];
        localStorage.setItem('ala_el_saree_ops_merchants', JSON.stringify(updatedMerchants));
      }

      // 1. Account not found anywhere
      if (!matchedApp && !matchedMerchant) {
        setLoginLoading(false);
        setLoginError('رقم الموبايل ده مش مسجل عندنا. تقدر تقدم طلب انضمام كشريك جديد من الزرار بالأعلى.');
        return;
      }

      // 2. Application exists but not approved/activated yet
      if (matchedApp && (!matchedMerchant || matchedMerchant.status !== 'active')) {
        setLoginLoading(false);
        if (matchedApp.password && matchedApp.password !== pwd) {
          setLoginError('كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.');
          return;
        }
        setLoginError('طلب انضمامك قيد المراجعة والمطابقة من إدارة عالسريع. هيتم تفعيل الحساب رسمياً وإشعارك قريباً.');
        return;
      }

      // 3. Activated Merchant - Verify Password strictly
      if (matchedMerchant) {
        const expectedPwd = matchedMerchant.password || matchedApp?.password;
        if (expectedPwd && expectedPwd !== pwd) {
          setLoginLoading(false);
          setLoginError('كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.');
          return;
        }

        // Login Authorized! Set authoritative merchant ID
        localStorage.setItem('alasaree_active_merchant_id', matchedMerchant.id);
        localStorage.setItem('alasaree_merchant_authenticated', 'true');
        localStorage.setItem(
          'alasaree_active_persona',
          JSON.stringify({
            id: `usr-merch-${matchedMerchant.id}`,
            role: 'merchant_staff',
            merchantId: matchedMerchant.id,
            name: matchedMerchant.ownerName || matchedMerchant.nameAr
          })
        );

        setLoginLoading(false);
        if (onLoginMerchant) {
          onLoginMerchant();
        }
        return;
      }

      setLoginLoading(false);
      setLoginError('تعذر تسجيل الدخول، يرجى التواصل مع الدعم الفني');
    } catch {
      setLoginLoading(false);
      setLoginError('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقاً');
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => {
      const exists = prev.services.includes(serviceId);
      const updated = exists
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: updated };
    });
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.applicantName.trim()) {
      setErrorMessage('يرجى إدخال الاسم الكامل لمقدم الطلب');
      return;
    }
    if (!formData.businessName.trim()) {
      setErrorMessage('يرجى إدخال اسم المغسلة أو النشاط التجاري');
      return;
    }
    if (!validateEgyptianPhone(formData.mobile)) {
      setErrorMessage('يرجى إدخال رقم هاتف محمول مصري صحيح (مثال: 01012345678)');
      return;
    }
    if (!formData.governorate) {
      setErrorMessage('يرجى اختيار المحافظة');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('يرجى اختيار أو تحديد المدينة / المنطقة');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('يرجى إدخال العنوان التفصيلي للمغسلة');
      return;
    }
    // Password validation
    if (!regPassword.trim()) {
      setErrorMessage('يرجى تعيين كلمة مرور للحساب للدخول بها لاحقاً');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('كلمة المرور يجب أن تتكون من 6 خانات أو أحرف على الأقل');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين، يرجى إعادة التأكيد');
      return;
    }
    if (formData.services.length === 0) {
      setErrorMessage('يرجى اختيار خدمة واحدة على الأقل من الخدمات المتوفرة لديكم');
      return;
    }
    if (!formData.privacyConsent) {
      setErrorMessage('يرجى الموافقة على شروط التواصل واستخدام البيانات للمتابعة');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: MerchantApplicationData = {
        ...formData,
        password: regPassword.trim()
      };
      const res = await submitMerchantApplication(payload, 'ar');
      if (res.success) {
        setSuccessResult({
          message: res.message,
          ref: res.referenceId
        });
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('حدث خطأ غير متوقع أثناء إرسال البيانات. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetApplicationForm = () => {
    setSuccessResult(null);
    setErrorMessage(null);
    setRegPassword('');
    setRegConfirmPassword('');
    setGeoSuccess(false);
    setGeoError(null);
    setManualMapUrl('');
    setFormData({
      applicantName: '',
      businessName: '',
      mobile: '',
      whatsapp: '',
      governorate: '',
      city: '',
      address: '',
      services: ['wash_iron', 'wash_only'],
      operatingStatus: 'active',
      contactMethod: 'phone',
      email: '',
      website: '',
      capacity: '',
      notes: '',
      locationLink: '',
      coordinates: undefined,
      privacyConsent: false
    });
  };

  return (
    <div className="min-h-screen bg-[#F4FBFF]/70 text-[#183247] flex flex-col justify-center items-center py-10 px-4 font-sans select-none" dir="rtl">
      
      {/* Centered Brand Logo (Silent 5-Clicks for Admin Mode) */}
      <div className="flex flex-col items-center mb-6">
        <div
          onClick={handleLogoClick}
          className="cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#08BDF4] to-[#0596c7] text-white p-0.5 shadow-lg shadow-[#08BDF4]/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <span className="text-3xl font-black text-[#08BDF4]">ع</span>
            </div>
          </div>
        </div>
        <span className="font-black text-lg text-[#183247] mt-2">عالسريع</span>
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">بوابة الشركاء</span>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-white border border-[#E5EEF4] rounded-3xl shadow-sm p-6 sm:p-8">
        
        {/* Harmonious Segmented Switcher (No duplication) */}
        <div className="flex rounded-2xl bg-[#F4FBFF] p-1.5 border border-[#E5EEF4] mb-6">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'login'
                ? 'bg-white text-[#183247] shadow-xs'
                : 'text-slate-500 hover:text-[#183247]'
            }`}
          >
            <LogIn className="w-4 h-4 text-[#08BDF4]" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'register'
                ? 'bg-white text-[#183247] shadow-xs'
                : 'text-slate-500 hover:text-[#183247]'
            }`}
          >
            <Store className="w-4 h-4 text-[#08BDF4]" />
            <span>طلب شراكة جديد</span>
          </button>
        </div>

        {/* ----------------- MODE 1: LOGIN ----------------- */}
        {authMode === 'login' ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-[#183247]">مرحباً بك مجدداً</h2>
              <p className="text-xs text-slate-500 mt-1">سجل الدخول لإدارة حسابك ومتابعة الطلبات</p>
            </div>

            {loginError && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-start">
              <div>
                <label className="block text-xs font-bold text-[#183247] mb-1.5">
                  رقم الهاتف أو المعرّف
                </label>
                <div className="relative">
                  <div className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="01xxxxxxxxx أو admin"
                    className="w-full ps-10 pe-4 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/15 transition text-start"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183247] mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full ps-10 pe-10 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/15 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#08BDF4] focus:ring-[#08BDF4] cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium">تذكر بياناتي</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('لإعادة تعيين كلمة المرور، يرجى التواصل مع الدعم المركزي لعالسريع.')}
                  className="text-xs font-bold text-[#08BDF4] hover:underline cursor-pointer"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 text-white shadow-md shadow-[#08BDF4]/25 transition cursor-pointer active:scale-98 ${
                  loginLoading
                    ? 'bg-slate-400 cursor-wait'
                    : 'bg-[#08BDF4] hover:bg-[#079FD0]'
                }`}
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التحقق...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">ليس لديك حساب مغسلة بعد؟ </span>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-xs font-bold text-[#08BDF4] hover:underline cursor-pointer"
              >
                قدم طلب شراكة جديد
              </button>
            </div>
          </div>
        ) : (

          /* ----------------- MODE 2: PARTNERSHIP FORM (From picture) ----------------- */
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-[#183247] mb-2">
                خلّي مغسلتك أقرب لعملاء أكتر
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                املأ البيانات التالية، وفريق عالسريع هيراجع طلبك ويتواصل معاك لمناقشة تفاصيل التعاون.
              </p>
            </div>

            {successResult ? (
              <div className="bg-[#F4FBFF] border border-[#08BDF4]/30 rounded-2xl p-6 text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#183247] mb-2">تم استلام طلب الشراكة بنجاح!</h3>
                <p className="text-xs text-slate-600 mb-4">{successResult.message}</p>
                {successResult.ref && (
                  <div className="bg-white px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-700 mb-5 border border-slate-200">
                    رقم الإشارة: <span className="text-[#08BDF4]">{successResult.ref}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={resetApplicationForm}
                  className="px-5 py-2.5 rounded-xl bg-[#08BDF4] text-white text-xs font-bold hover:bg-[#079FD0] transition"
                >
                  تقديم طلب آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-6 text-start">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. البيانات الأساسية للمغسلة */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-md bg-[#EAF8FF] text-[#08BDF4] flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    <span className="text-xs font-black text-[#183247]">البيانات الأساسية للمغسلة</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1">
                        الاسم الكامل لمقدم الطلب <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.applicantName}
                        onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                        placeholder="مثال: أحمد محمود إبراهيم"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1">
                        اسم المغسلة أو النشاط التجاري <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="مثال: مغسلة النور الحديثة"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1">
                        رقم الهاتف المحمول <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={formData.mobile}
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="01012345678"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] text-start"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1">
                        رقم واتساب مختلف (اختياري)
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={formData.whatsapp}
                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="01xxxxxxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] text-start"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. الموقع والنطاق الجغرافي */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-md bg-[#EAF8FF] text-[#08BDF4] flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <span className="text-xs font-black text-[#183247]">الموقع وتحديد النقطة على الخريطة</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1">
                        المحافظة <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.governorate}
                        onChange={e => setFormData({ ...formData, governorate: e.target.value, city: '' })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4]"
                      >
                        <option value="">اختر المحافظة</option>
                        {EGYPT_GOVERNORATES.map(gov => (
                          <option key={gov.id} value={gov.id}>{gov.nameAr}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1">
                        المدينة / المنطقة <span className="text-rose-500">*</span>
                      </label>
                      {selectedGov && selectedGov.cities.length > 0 ? (
                        <select
                          required
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4]"
                        >
                          <option value="">اختر المدينة أو المنطقة</option>
                          {selectedGov.cities.map(c => (
                            <option key={c.id} value={c.nameAr}>{c.nameAr}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          placeholder="اختر المدينة أو المنطقة"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Smart Map Location Picker Card */}
                  <div className="p-3.5 rounded-2xl bg-[#F4FBFF] border border-[#D7EFFC] mb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#183247]">
                        <MapPin className="w-4 h-4 text-[#08BDF4]" />
                        <span>تحديد موقع المغسلة بدقة عبر الخريطة</span>
                      </div>
                      {geoSuccess && formData.coordinates && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          تم تحديد الموقع
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      بيساعد مندوبي التوصيل والعملاء للوصول للمغسلة واستلام الملابس بدقة وبدون أي تأخير.
                    </p>

                    {/* Geolocation Button */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={handleAutoLocate}
                        disabled={geoLoading}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#08BDF4]/40 hover:border-[#08BDF4] text-[#079FD0] hover:bg-[#EAF8FF] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        {geoLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#08BDF4]" />
                            <span>جاري قراءة الموقع عبر GPS...</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="w-4 h-4 text-[#08BDF4]" />
                            <span>تحديد موقعي الحالي تلقائياً (GPS)</span>
                          </>
                        )}
                      </button>

                      {formData.locationLink && (
                        <a
                          href={formData.locationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-[#183247] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          <span>فتح خرائط Google</span>
                        </a>
                      )}
                    </div>

                    {geoError && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                        <span>{geoError}</span>
                      </div>
                    )}

                    {/* Interactive Embedded OpenStreetMap Preview */}
                    {formData.coordinates && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner h-44 bg-slate-100">
                        <iframe
                          title="موقع المغسلة على الخريطة"
                          width="100%"
                          height="100%"
                          className="w-full h-full border-0"
                          loading="lazy"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${formData.coordinates.lng - 0.005}%2C${formData.coordinates.lat - 0.003}%2C${formData.coordinates.lng + 0.005}%2C${formData.coordinates.lat + 0.003}&layer=mapnik&marker=${formData.coordinates.lat}%2C${formData.coordinates.lng}`}
                        />
                        <div className="absolute top-2 end-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-xs flex items-center gap-1.5 pointer-events-none">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span>نقطة المغسلة المحددة ({formData.coordinates.lat}, {formData.coordinates.lng})</span>
                        </div>
                      </div>
                    )}

                    {/* Manual Google Maps Link input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        أو الصق رابط موقع المغسلة من خرائط Google (Maps Link):
                      </label>
                      <div className="relative">
                        <div className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="url"
                          dir="ltr"
                          value={manualMapUrl}
                          onChange={e => handleMapUrlChange(e.target.value)}
                          placeholder="https://maps.app.goo.gl/... أو https://google.com/maps?q=..."
                          className="w-full ps-9 pe-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] text-start placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#183247] mb-1">
                      العنوان التفصيلي للمغسلة <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="مثال: شارع الجلاء، بجوار مسجد النصر، عمارة 5..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4]"
                    />
                  </div>
                </div>

                {/* 3. الخدمات المتوفرة */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-md bg-[#EAF8FF] text-[#08BDF4] flex items-center justify-center text-xs font-black">
                      3
                    </span>
                    <span className="text-xs font-black text-[#183247]">الخدمات المتوفرة لديكم:</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {[
                      { id: 'wash_iron', label: 'غسيل وكي ملابس' },
                      { id: 'wash_only', label: 'غسيل فقط' },
                      { id: 'iron_only', label: 'كي بالبخار فقط' },
                      { id: 'dry_clean', label: 'تنظيف جاف' },
                      { id: 'linens', label: 'مفروشات وبطاطين' },
                      { id: 'carpets', label: 'سجاد وموكيت' }
                    ].map(s => {
                      const isChecked = formData.services.includes(s.id);
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => handleServiceToggle(s.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-start flex items-center justify-between transition cursor-pointer ${
                            isChecked
                              ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0]'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <span className="truncate">{s.label}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-[#08BDF4] border-[#08BDF4] text-white' : 'border-slate-300'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1">حالة المغسلة التشغيلية</label>
                      <select
                        value={formData.operatingStatus}
                        onChange={e => setFormData({ ...formData, operatingStatus: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4]"
                      >
                        <option value="active">المغسلة تعمل وتستقبل عملاء يومياً</option>
                        <option value="expanding">نتوسع بفروع إضافية</option>
                        <option value="new">مغسلة جديدة تحت التجهيز</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1">وسيلة التواصل المفضلة</label>
                      <select
                        value={formData.contactMethod}
                        onChange={e => setFormData({ ...formData, contactMethod: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4]"
                      >
                        <option value="phone">اتصال هاتفي</option>
                        <option value="whatsapp">رسالة عبر واتساب</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#183247] mb-1">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="أي معلومات عن الماكينات أو الطاقة الاستيعابية..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] resize-none"
                    />
                  </div>
                </div>

                {/* 4. إعداد الحساب وكلمة المرور للدخول */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-md bg-[#EAF8FF] text-[#08BDF4] flex items-center justify-center text-xs font-black">
                      4
                    </span>
                    <span className="text-xs font-black text-[#183247]">بيانات تسجيل الدخول والأمان</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-3 text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold">معلومة مهمة:</span> رقم الموبايل المسجل بالأعلى (<span className="font-mono font-bold" dir="ltr">{formData.mobile || '01xxxxxxxxx'}</span>) هيكون هو اسم المستخدم الخاص بك، وكلمة المرور اللي هتحددها هنا هي اللي هتدخل بيها على لوحة تحكم مغسلتك فور تفعيل الحساب من الإدارة.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1.5">
                        كلمة مرور الحساب <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          placeholder="6 خانات أو أحرف على الأقل"
                          className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#183247] mb-1.5">
                        تأكيد كلمة المرور <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showRegConfirmPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={e => setRegConfirmPassword(e.target.value)}
                          placeholder="أعد كتابة كلمة المرور"
                          className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password match indicator */}
                  {regConfirmPassword && (
                    <div className="mt-2 text-[11px] font-bold">
                      {regPassword === regConfirmPassword && regPassword.length >= 6 ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          كلمتا المرور متطابقتان وجاهزتان
                        </span>
                      ) : regPassword !== regConfirmPassword ? (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          كلمتا المرور غير متطابقتين
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      required
                      checked={formData.privacyConsent}
                      onChange={e => setFormData({ ...formData, privacyConsent: e.target.checked })}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#08BDF4] focus:ring-[#08BDF4] cursor-pointer"
                    />
                    <span>أوافق على قيام فريق عالسريع بالتواصل معي واستخدام البيانات للمراجعة. *</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 text-white shadow-md shadow-[#08BDF4]/25 transition cursor-pointer active:scale-98 ${
                      isSubmitting ? 'bg-slate-400' : 'bg-[#08BDF4] hover:bg-[#079FD0]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>إرسال طلب الانضمام</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">لديك حساب مسجل بالفعل؟ </span>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs font-bold text-[#08BDF4] hover:underline cursor-pointer"
              >
                تسجيل الدخول من هنا
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Back to Home Link (Clean at the bottom of the page) */}
      <div className="mt-6 text-center">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#08BDF4] transition cursor-pointer px-4 py-2 rounded-xl hover:bg-white/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للموقع الرئيسي</span>
        </button>
      </div>

      {/* ========================================================
          SECRET ADMIN LOGIN MODAL (Triggered by 5 clicks on Logo)
          Username: admin | Password: 1234
         ======================================================== */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-start space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-black text-sm">تسجيل دخول الأدمن المركزي</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {adminError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminModalSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المستخدم</label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الرقم السري</label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  {adminLoading ? 'جاري التحقق...' : 'دخول الأدمن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};