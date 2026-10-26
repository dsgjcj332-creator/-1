import React, { useState, useEffect } from 'react';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Globe,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { validateEgyptianPhone, normalizeEgyptianPhone, extractEgyptianPhoneDigits } from '../../utils/i18n';

// 1. Auth Welcome Landing
export const AuthWelcomeScreen: React.FC = () => {
  const { language, setLanguage, t, navigateTo, loginAsGuest } = useApp();
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    setLogoClickCount(next);
    if (next >= 5) {
      setIsAdminMode(true);
      navigateTo('auth_phone');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white select-none">
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#EAF8FF] rounded-full text-xs font-semibold text-[#079FD0] transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </div>

      <div className="flex flex-col items-center text-center my-auto">
        <div
          onClick={handleLogoClick}
          className="cursor-pointer transition-transform active:scale-95"
          title={isAdminMode ? 'تم تفعيل وضع الأدمن' : `نقرات على الشعار: ${logoClickCount}/5`}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#08BDF4] to-[#079FD0] p-1 shadow-lg shadow-[#08BDF4]/20 flex items-center justify-center mb-5">
            <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center">
              <span className={`text-2xl font-black text-[#08BDF4] ${isAdminMode ? 'animate-pulse' : ''}`}>
                عالسريع
              </span>
            </div>
          </div>
        </div>
        {isAdminMode && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#18A875] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              🔐 وضع الأدمن مفعل
            </span>
          </div>
        )}

        <h1 className="text-2xl font-black text-[#183247] mb-2 tracking-tight">
          {t.authWelcomeTitle}
        </h1>
        <p className="text-sm text-[#718596] leading-relaxed max-w-xs">
          {t.authWelcomeSubtitle}
        </p>

        {/* Value Highlights */}
        <div className="mt-8 w-full max-w-xs flex flex-col gap-2.5 text-xs text-[#183247]">
          <div className="flex items-center gap-3 p-3 bg-[#F4FBFF] rounded-xl border border-[#E5EEF4]">
            <CheckCircle2 className="w-4 h-4 text-[#08BDF4] shrink-0" />
            <span className="text-start">استلام وتوصيل مجدول لباب بيتك بالدقيقة</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#F4FBFF] rounded-xl border border-[#E5EEF4]">
            <CheckCircle2 className="w-4 h-4 text-[#08BDF4] shrink-0" />
            <span className="text-start">مغاسل معتمدة فندقية وعناية خاصة بالملابس</span>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3 pb-2">
        <button
          onClick={() => navigateTo('auth_phone')}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>{language === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Sign Up'}</span>
        </button>

        <button
          onClick={loginAsGuest}
          className="w-full h-12 rounded-2xl bg-[#F4FBFF] hover:bg-[#EAF8FF] active:scale-[0.98] text-[#183247] font-semibold text-sm flex items-center justify-center transition border border-[#E5EEF4] cursor-pointer"
        >
          <span>{t.continueAsGuest}</span>
        </button>

        <p className="text-[11px] text-[#718596] text-center mt-1">
          بالمتابعة فإنك توافق على الشروط والأحكام وسياسة الخصوصية
        </p>
      </div>
    </div>
  );
};

// 2. Auth Phone Entry Screen
export const AuthPhoneScreen: React.FC = () => {
  const { language, t, navigateTo, checkCustomerAccount } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEgyptianPhone(phoneNumber)) {
      setError(t.phoneInvalid);
      return;
    }
    setError(null);
    localStorage.setItem('alasaree_pending_phone', phoneNumber);

    // Check if account already exists with this phone
    const check = checkCustomerAccount(phoneNumber);
    if (check.exists) {
      if (check.name) {
        localStorage.setItem('alasaree_pending_user_name', check.name);
      } else {
        localStorage.removeItem('alasaree_pending_user_name');
      }
      navigateTo('auth_pin');
    } else {
      localStorage.removeItem('alasaree_pending_user_name');
      navigateTo('auth_otp');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white select-none">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#EAF8FF] flex items-center justify-center text-[#079FD0] mb-4">
          <Phone className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-black text-[#183247] mb-2">
          {t.enterPhoneTitle}
        </h2>
        <p className="text-xs text-[#718596] leading-relaxed mb-6">
          {t.enterPhoneDesc}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1.5">
              {t.phoneLabel}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-50 border border-[#E5EEF4] rounded-xl text-xs font-bold text-[#183247] shrink-0">
                <span>🇪🇬</span>
                <span dir="ltr">+20</span>
              </div>
              <input
                type="tel"
                dir="ltr"
                value={phoneNumber}
                onChange={e => {
                  setPhoneNumber(e.target.value);
                  setError(null);
                }}
                placeholder={t.phonePlaceholder}
                className="flex-1 h-12 px-4 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 text-sm font-semibold tracking-wider bg-white"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-[11px] text-[#E55353] mt-2 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
            <p className="text-[11px] text-[#718596] mt-2">
              مثال: 01012345678 أو 01100000000 أو 01200000000 أو 01500000000
            </p>
          </div>
        </form>
      </div>

      <div className="w-full flex flex-col gap-3 pb-2">
        <button
          onClick={handleSubmit}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>{t.continue}</span>
          {language === 'ar' ? (
            <ArrowLeft className="w-5 h-5" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#718596]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#18A875]" />
          <span>بياناتك ورقم هاتفك في أمان تام ولا يتم مشاركتها</span>
        </div>
      </div>
    </div>
  );
};

// 3. Auth PIN Login Screen (For Existing Users)
export const AuthPinScreen: React.FC = () => {
  const { language, navigateTo, loginWithPin } = useApp();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phone = localStorage.getItem('alasaree_pending_phone') || '';
  const pendingName = localStorage.getItem('alasaree_pending_user_name') || '';

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال الرقم السري' : 'Please enter your PIN');
      return;
    }
    setError(null);
    const res = loginWithPin(phone, pin);
    if (!res.success) {
      setError(res.error || (language === 'ar' ? 'الرقم السري غير صحيح' : 'Incorrect PIN'));
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white select-none">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#EAF8FF] flex items-center justify-center text-[#079FD0] mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-black text-[#183247] mb-1">
          {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </h2>
        <p className="text-xs text-[#718596] leading-relaxed mb-4">
          {language === 'ar'
            ? `مرحباً بعودتك${pendingName ? ` يا ${pendingName}` : ''}! يرجى إدخال الرقم السري الخاص بحسابك.`
            : `Welcome back${pendingName ? ` ${pendingName}` : ''}! Please enter your account PIN.`}
        </p>

        {/* Phone Badge with Change Option */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-[#E5EEF4] rounded-2xl mb-6">
          <div className="flex items-center gap-2">
            <span className="text-base">📱</span>
            <span dir="ltr" className="text-xs font-bold text-[#183247]">
              {normalizeEgyptianPhone(phone)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('auth_phone')}
            className="text-[11px] font-bold text-[#08BDF4] hover:underline cursor-pointer"
          >
            {language === 'ar' ? 'تغيير الرقم' : 'Change'}
          </button>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1.5 flex items-center justify-between">
              <span>{language === 'ar' ? 'الرقم السري' : 'PIN / Password'}</span>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[11px] text-[#079FD0] flex items-center gap-1 hover:underline cursor-pointer"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPin ? (language === 'ar' ? 'إخفاء' : 'Hide') : (language === 'ar' ? 'إظهار' : 'Show')}</span>
              </button>
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setError(null);
                }}
                placeholder={language === 'ar' ? '••••' : '••••'}
                className="w-full h-13 px-4 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 text-lg font-black tracking-widest text-center bg-white text-[#183247]"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-[11px] text-[#E55353] mt-2 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* OTP Fallback */}
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => navigateTo('auth_otp')}
              className="text-xs font-bold text-[#08BDF4] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'نسيت الرقم السري؟ الدخول برمز التحقق (OTP)' : 'Forgot PIN? Sign in with OTP'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="w-full flex flex-col gap-3 pb-2">
        <button
          onClick={handleLogin}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
          <CheckCircle2 className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#718596]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#18A875]" />
          <span>حسابك محمي برقم سري مشفر لا يطلع عليه أحد</span>
        </div>
      </div>
    </div>
  );
};

// 4. Auth OTP Screen (Verification Step)
export const AuthOtpScreen: React.FC = () => {
  const { language, t, navigateTo, loginWithPhone, showToast } = useApp();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState<string | null>(null);

  const phone = localStorage.getItem('alasaree_pending_phone') || '01012345678';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    setError(null);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const code = digits.join('');
    // Development verification test code: 1234 or any 4 digit code in dev
    if (code.length === 4) {
      loginWithPhone(normalizeEgyptianPhone(phone));
      showToast(language === 'ar' ? 'تم تأكيد رقم الهاتف بنجاح!' : 'Phone verified successfully!');
      navigateTo('auth_profile');
    } else {
      setError(language === 'ar' ? 'يرجى إدخال الرمز المكون من 4 أرقام' : 'Enter the 4-digit code');
    }
  };

  const fillQuickCode = () => {
    setDigits(['1', '2', '3', '4']);
    setError(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white select-none">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#EAF8FF] flex items-center justify-center text-[#079FD0] mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-black text-[#183247] mb-2">{t.otpTitle}</h2>
        <p className="text-xs text-[#718596] leading-relaxed mb-6">
          {t.otpSentTo} <span dir="ltr" className="font-bold text-[#183247]">{normalizeEgyptianPhone(phone)}</span>
        </p>

        {/* 4 Digit Boxes */}
        <div className="flex items-center justify-center gap-3 my-6" dir="ltr">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              className="w-14 h-14 rounded-2xl border-2 border-[#E5EEF4] focus:border-[#08BDF4] focus:outline-none text-xl font-black text-center text-[#183247] bg-[#F4FBFF] transition"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-[#E55353] text-center mb-4 font-semibold">
            {error}
          </p>
        )}

        {/* Test Code Helper */}
        <div className="p-3 bg-[#EAF8FF] rounded-xl border border-[#08BDF4]/30 flex items-center justify-between text-xs">
          <span className="text-[#079FD0] font-medium">{t.devOtpHint}</span>
          <button
            onClick={fillQuickCode}
            className="px-2.5 py-1 bg-[#08BDF4] text-white rounded-lg font-bold hover:bg-[#079FD0] transition cursor-pointer"
          >
            تعبئة 1234
          </button>
        </div>

        {/* Resend Timer */}
        <div className="text-center mt-6">
          {countdown > 0 ? (
            <p className="text-xs text-[#718596]">
              {t.resendAfter} <span className="font-bold text-[#08BDF4]">{countdown}</span> ثانية
            </p>
          ) : (
            <button
              onClick={() => setCountdown(60)}
              className="text-xs font-bold text-[#08BDF4] hover:underline cursor-pointer"
            >
              {t.resendOtp}
            </button>
          )}
        </div>
      </div>

      <div className="w-full pb-2">
        <button
          onClick={handleVerify}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>{t.confirm}</span>
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// 5. Auth Profile & PIN Setup Screen (Step 3: Registration)
export const AuthProfileScreen: React.FC = () => {
  const { language, setLanguage, t, navigateTo, registerCustomer } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phone = localStorage.getItem('alasaree_pending_phone') || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError(language === 'ar' ? 'يرجى إدخال اسمك الكامل بشكل صحيح' : 'Please enter your full name');
      return;
    }

    if (!pin || pin.length < 4) {
      setError(language === 'ar' ? 'الرقم السري يجب أن يكون 4 أرقام على الأقل' : 'PIN must be at least 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError(language === 'ar' ? 'تأكيد الرقم السري غير متطابق مع الرقم السري' : 'PIN confirmation does not match');
      return;
    }

    registerCustomer(fullName.trim(), phone, pin, email.trim());
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white select-none">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#EAF8FF] flex items-center justify-center text-[#079FD0] mb-4">
          <User className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-black text-[#183247] mb-1">
          {language === 'ar' ? 'إكمال بيانات الحساب' : 'Complete Profile'}
        </h2>
        <p className="text-xs text-[#718596] leading-relaxed mb-5">
          {language === 'ar'
            ? 'خطوة أخيرة: اكتب اسمك وعيّن رقماً سرياً لتسجيل الدخول بسهولة لاحقاً'
            : 'Final step: Enter your name and set a PIN for easy sign-in later'}
        </p>

        {/* Registered phone badge */}
        <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200/70 rounded-xl mb-4 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{language === 'ar' ? 'الهاتف الموثق:' : 'Verified Phone:'}</span>
          <span dir="ltr" className="text-emerald-950 font-black">{normalizeEgyptianPhone(phone)}</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1">
              {t.fullNameLabel} <span className="text-[#E55353]">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => {
                setFullName(e.target.value);
                setError(null);
              }}
              placeholder={language === 'ar' ? 'اكتب اسمك الكامل' : 'Enter your full name'}
              className="w-full h-12 px-4 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-sm font-semibold bg-white"
              required
              autoFocus
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1 flex items-center justify-between">
              <span>{t.emailLabel}</span>
              <span className="text-[10px] text-[#718596]">{language === 'ar' ? '(اختياري)' : '(Optional)'}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={language === 'ar' ? 'لاستلام الفواتير (اختياري)' : 'For invoices (optional)'}
              className="w-full h-12 px-4 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-sm font-medium bg-white"
            />
          </div>

          {/* PIN Field */}
          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1 flex items-center justify-between">
              <span>
                {language === 'ar' ? 'الرقم السري للعميل' : 'Customer PIN'} <span className="text-[#E55353]">*</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[10px] text-[#079FD0] flex items-center gap-1 hover:underline cursor-pointer"
              >
                {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPin ? (language === 'ar' ? 'إخفاء' : 'Hide') : (language === 'ar' ? 'إظهار' : 'Show')}</span>
              </button>
            </label>
            <input
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              value={pin}
              onChange={e => {
                setPin(e.target.value);
                setError(null);
              }}
              placeholder={language === 'ar' ? 'عيّن رقماً سرياً (4 إلى 6 أرقام)' : 'Set 4-6 digit PIN'}
              className="w-full h-12 px-4 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-sm font-black tracking-wider bg-white"
              required
            />
            <p className="text-[10px] text-[#718596] mt-1">
              {language === 'ar' ? 'ستستخدم هذا الرقم للدخول إلى حسابك في كل مرة' : 'You will use this PIN to sign in every time'}
            </p>
          </div>

          {/* Confirm PIN */}
          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'تأكيد الرقم السري' : 'Confirm PIN'} <span className="text-[#E55353]">*</span>
            </label>
            <input
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              value={confirmPin}
              onChange={e => {
                setConfirmPin(e.target.value);
                setError(null);
              }}
              placeholder={language === 'ar' ? 'أعد كتابة الرقم السري للتأكيد' : 'Re-enter PIN to confirm'}
              className="w-full h-12 px-4 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-sm font-black tracking-wider bg-white"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs text-[#E55353] flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          {/* Language Selection */}
          <div className="mt-1">
            <label className="block text-xs font-bold text-[#183247] mb-1">
              {t.preferredLangLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  language === 'ar'
                    ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0]'
                    : 'border-[#E5EEF4] text-[#718596] hover:bg-slate-50'
                }`}
              >
                العربية (مصر)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  language === 'en'
                    ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0]'
                    : 'border-[#E5EEF4] text-[#718596] hover:bg-slate-50'
                }`}
              >
                English (US)
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full pb-2 pt-4">
        <button
          onClick={handleSubmit}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>{language === 'ar' ? 'حفظ والبدء الآن' : 'Save & Start Now'}</span>
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
