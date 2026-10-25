import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Lock,
  User,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

type ViewMode = 'login' | 'register' | 'success';

export const RegisterPage: React.FC<{ onBackToLanding: () => void }> = ({
  onBackToLanding
}) => {
  const [view, setView] = useState<ViewMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    address: '',
    terms: false
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('تم تسجيل الدخول عبر جوجل بنجاح! جاري التوجيه...');
      setTimeout(() => {
        setIsLoading(false);
        onBackToLanding();
      }, 1000);
    } catch {
      setError('فشل تسجيل الدخول عبر جوجل، يرجى المحاولة مرة أخرى');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه إلى التطبيق...');
      setTimeout(() => {
        setIsLoading(false);
        onBackToLanding();
      }, 1000);
    } catch {
      setError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }

    if (!formData.terms) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setView('success');
      setIsLoading(false);
    } catch {
      setError('فشل إنشاء الحساب، يرجى المحاولة مرة أخرى');
      setIsLoading(false);
    }
  };

  const renderInput = (
    label: string,
    key: string,
    type: 'text' | 'email' | 'tel' | 'password' = 'text',
    placeholder?: string,
    icon?: React.ReactNode,
    showToggle?: boolean
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-[#183247] mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          type={type}
          name={key}
          value={formData[key as keyof typeof formData] || ''}
          onChange={e => handleInputChange(key, e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-sm font-medium bg-white transition-all ${
            showPassword && type === 'password' ? 'text-transparent' : ''
          }`}
          autoComplete="off"
        />
        {showToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => type === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#08BDF4]"
            aria-label="Toggle password visibility"
          >
            {type === 'password' ? showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" /> : showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4FBFF] flex flex-col">
      <div className="bg-white border-b border-[#E5EEF4] px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-[#08BDF4] font-bold text-sm hover:text-[#079FD0] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للموقع الرئيسي</span>
        </button>
        <div className="text-center flex-1">
          <span className="w-8 h-8 rounded-xl bg-[#08BDF4] text-white flex items-center justify-center font-black text-lg">
            ع
          </span>
          <span className="ml-2 font-black text-[#183247] text-lg">عالسريع</span>
        </div>
        <div className="w-16" />
      </div>

      <main className="flex-1 px-6 py-8 max-w-md mx-auto">
        {view === 'success' ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-[#183247] mb-2">تم إنشاء الحساب بنجاح!</h2>
            <p className="text-[#718596] text-sm mb-8">يمكنك الآن تسجيل الدخول والبدء في استخدام خدمات عالسريع</p>
            <button
              onClick={() => {
                setView('login');
                setSuccess(null);
              }}
              className="w-full h-12 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] text-white font-bold flex items-center justify-center gap-2 transition"
            >
              <ChevronRight className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={() => setView('login')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  view === 'login'
                    ? 'bg-[#08BDF4] text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-[#E5EEF4]'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setView('register')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  view === 'register'
                    ? 'bg-[#08BDF4] text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-[#E5EEF4]'
                }`}
              >
                إنشاء حساب جديد
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-sm text-red-700 leading-relaxed">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-emerald-700 leading-relaxed">{success}</span>
              </div>
            )}

            <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {view === 'register' && (
                <>
                  {renderInput('الاسم الكامل', 'fullName', 'text', 'أحمد محمود العوضي', <User className="w-4 h-4" />)}
                  {renderInput('البريد الإلكتروني', 'email', 'email', 'ahmed@example.com', <Mail className="w-4 h-4" />)}
                </>
              )}
              {renderInput('رقم التليفون', 'phone', 'tel', '01012345678', <Phone className="w-4 h-4" />)}
              {renderInput('كلمة المرور', 'password', 'password', '••••••••', <Lock className="w-4 h-4" />, true)}
              {view === 'register' && renderInput('تأكيد كلمة المرور', 'confirmPassword', 'password', '••••••••', <Lock className="w-4 h-4" />, true)}

              {view === 'register' && (
                <>
                  <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#183247] mb-1.5">المدينة</label>
                  <select
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    className="w-full py-3.5 rounded-2xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-sm bg-white"
                  >
                    <option value="">اختر المدينة</option>
                    <option value="zagazig">الزقازيق</option>
                    <option value="mansoura">المنصورة</option>
                    <option value="10th-of-ramadan">العاشر من رمضان</option>
                    <option value="cairo">القاهرة</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#183247] mb-1.5">العنوان (اختياري)</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => handleInputChange('address', e.target.value)}
                    placeholder="شارع، مبنى، شقة..."
                    className="w-full py-3.5 rounded-2xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-sm bg-white"
                  />
                </div>

                <div className="flex items-start gap-2 mb-6">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={e => handleInputChange('terms', e.target.checked ? 'true' : 'false')}
                    className="w-4 h-4 rounded border-[#E5EEF4] text-[#08BDF4] focus:ring-[#08BDF4] mt-0.5"
                  />
                  <label className="text-xs text-[#718596] leading-relaxed cursor-pointer">
                    أوافق على <span className="text-[#08BDF4] font-bold hover:underline">الشروط والأحكام</span> و <span className="text-[#08BDF4] font-bold hover:underline">سياسة الخصوصية</span>
                  </label>
                </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-13 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${
                  isLoading
                    ? 'bg-slate-200 text-slate-400'
                    : 'bg-[#08BDF4] text-white shadow-lg shadow-[#08BDF4]/25 hover:bg-[#079FD0]'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري المعالجة...
                  </span>
                ) : view === 'login' ? (
                  <span>تسجيل الدخول</span>
                ) : (
                  <span>إنشاء الحساب</span>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5EEF4]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#F4FBFF] px-2 text-slate-500 font-bold">أو continuar مع</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-13 rounded-2xl border border-[#E5EEF4] bg-white font-bold text-[#183247] flex items-center justify-center gap-2 transition-all hover:bg-slate-50 disabled:opacity-60"
              >
                <span>تسجيل الدخول عبر جوجل</span>
              </button>

              {view === 'login' && (
                <p className="text-center text-sm text-[#718596] mt-4">
                  ليس لديك حساب؟{' '}
                  <button
                    onClick={() => setView('register')}
                    className="text-[#08BDF4] font-bold hover:underline"
                  >
                    أنشئ حسابًا جديدًا
                  </button>
                </p>
              )}
              {view === 'register' && (
                <p className="text-center text-sm text-[#718596] mt-4">
                  لديك حساب بالفعل؟{' '}
                  <button
                    onClick={() => setView('login')}
                    className="text-[#08BDF4] font-bold hover:underline"
                  >
                    تسجيل الدخول
                  </button>
                </p>
              )}
            </form>
          </>)
          }
      </main>

      <div className="bg-white border-t border-[#E5EEF4] px-6 py-4 text-center">
        <p className="text-xs text-slate-400">
          © 2026 عالسريع - منصة الغسيل والتنظيف الجاف الأولى بمصر
        </p>
      </div>
    </div>
  );
};