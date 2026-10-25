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
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { validateEgyptianPhone, normalizeEgyptianPhone } from '../../utils/i18n';

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
          <span>{t.startWithPhone}</span>
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

// 2. Auth Phone Entry
export const AuthPhoneScreen: React.FC = () => {
  const { language, t, navigateTo } = useApp();
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
    navigateTo('auth_otp');
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
              <p className="text-[11px] text-[#E55353] mt-2 flex items-center gap-1">
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

// 3. Auth OTP Screen
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
          {t.otpSentTo} <span dir="ltr" className="font-bold text-[#183247]">{phone}</span>
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

// 4. Auth Profile Setup Screen
export const AuthProfileScreen: React.FC = () => {
  const { language, setLanguage, t, navigateTo, updateUserProfile } = useApp();
  const [fullName, setFullName] = useState('أحمد محمود');
  const [email, setEmail] = useState('ahmed@example.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    updateUserProfile(fullName.trim(), email.trim());
    navigateTo('main');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white select-none">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#EAF8FF] flex items-center justify-center text-[#079FD0] mb-4">
          <User className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-black text-[#183247] mb-2">{t.profileTitle}</h2>
        <p className="text-xs text-[#718596] leading-relaxed mb-6">
          {t.profileDesc}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1.5">
              {t.fullNameLabel} <span className="text-[#E55353]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                className="w-full h-12 px-4 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-sm font-semibold bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1.5">
              {t.emailLabel}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full h-12 px-4 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1.5">
              {t.preferredLangLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
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
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
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

      <div className="w-full pb-2">
        <button
          onClick={handleSubmit}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>{t.startNow}</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
