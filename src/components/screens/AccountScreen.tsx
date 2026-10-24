import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  HelpCircle,
  FileText,
  Shield,
  Info,
  LogOut,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccountScreen: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    user,
    logout,
    navigateTo,
    setTab,
    showToast
  } = useApp();

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleLanguage = () => {
    const next = language === 'ar' ? 'en' : 'ar';
    setLanguage(next);
    showToast(next === 'ar' ? 'تم تحويل التطبيق للغة العربية' : 'Switched to English');
  };

  const handleDeleteAccount = () => {
    logout();
    showToast(language === 'ar' ? 'تم حذف حسابك بنجاح' : 'Account deleted successfully');
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 select-none">
      {/* 1. Profile Header Card */}
      <div className="p-4 bg-white rounded-3xl border border-[#E5EEF4] mb-4 shadow-2xs flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#08BDF4] to-[#079FD0] p-0.5 flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#08BDF4]/20">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[#079FD0]">
            {user?.name ? user.name.slice(0, 1) : 'ع'}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-[#183247]">{user?.name || 'عميل عالسريع'}</h2>
            <span className="text-[10px] font-bold text-[#18A875] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {language === 'ar' ? 'حساب موثق' : 'Verified'}
            </span>
          </div>
          <p className="text-xs text-[#718596] mt-0.5" dir="ltr">
            {user?.phone || '+20 101 234 5678'}
          </p>
          {user?.email && (
            <p className="text-[11px] text-[#718596] truncate max-w-[180px]">
              {user.email}
            </p>
          )}
        </div>
      </div>

      {/* 2. Quick Settings Section */}
      <div className="bg-white rounded-3xl border border-[#E5EEF4] mb-4 shadow-2xs overflow-hidden">
        {/* Language Switch */}
        <div
          onClick={toggleLanguage}
          className="p-3.5 flex items-center justify-between border-b border-[#E5EEF4] cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#183247]">{t.language}</h4>
              <p className="text-[10px] text-[#718596]">
                {language === 'ar' ? 'اللغة الحالية: العربية (مصر)' : 'Current: English (LTR)'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#08BDF4] bg-[#EAF8FF] px-2.5 py-1 rounded-xl">
            {language === 'ar' ? 'English' : 'عربي'}
          </span>
        </div>

        {/* Saved Addresses */}
        <div
          onClick={() => setTab('addresses')}
          className="p-3.5 flex items-center justify-between border-b border-[#E5EEF4] cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#183247]">{t.myAddresses}</h4>
              <p className="text-[10px] text-[#718596]">
                {language === 'ar' ? 'عناوين التوصيل والاستلام' : 'Delivery locations'}
              </p>
            </div>
          </div>
          {language === 'ar' ? <ChevronLeft className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>

        {/* Support & Help */}
        <div
          onClick={() => navigateTo('support')}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#18A875] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#183247]">{t.supportCenter}</h4>
              <p className="text-[10px] text-[#718596]">
                {language === 'ar' ? 'واتساب، الخط الساخن، الأسئلة الشائعة' : 'WhatsApp chat, hotline, FAQs'}
              </p>
            </div>
          </div>
          {language === 'ar' ? <ChevronLeft className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* 3. Legal & Info Section */}
      <div className="bg-white rounded-3xl border border-[#E5EEF4] mb-4 shadow-2xs overflow-hidden">
        {/* Terms & Privacy */}
        <div
          onClick={() => setShowTermsModal(true)}
          className="p-3.5 flex items-center justify-between border-b border-[#E5EEF4] cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#183247]">{t.termsAndPrivacy}</h4>
              <p className="text-[10px] text-[#718596]">
                {language === 'ar' ? 'سياسة الحفاظ على الملابس والتعويض' : 'Guarantee & terms'}
              </p>
            </div>
          </div>
          {language === 'ar' ? <ChevronLeft className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>

        {/* About Ala El Saree */}
        <div
          onClick={() => setShowAboutModal(true)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#183247]">{t.aboutApp}</h4>
              <p className="text-[10px] text-[#718596]">الإصدار 1.0.0 (Egypt Launch)</p>
            </div>
          </div>
          {language === 'ar' ? <ChevronLeft className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* 4. Destructive / Sign Out Actions */}
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={logout}
          className="w-full h-11 rounded-2xl bg-white border border-[#E5EEF4] hover:bg-slate-50 text-[#183247] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
        >
          <LogOut className="w-4 h-4 text-[#718596]" />
          <span>{t.signOut}</span>
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-xs font-bold text-[#E55353] hover:underline text-center py-2 cursor-pointer"
        >
          {t.deleteAccount}
        </button>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col max-h-[80vh] overflow-y-auto no-scrollbar">
            <h3 className="text-sm font-black text-[#183247] mb-2">{t.termsAndPrivacy}</h3>
            <div className="text-xs text-[#718596] leading-relaxed flex flex-col gap-2.5 my-3">
              <p>
                <strong>1. جودة الملابس:</strong> تلتزم عالسريع وشبكة المغاسل المعتمدة بفحص الملابس قبل بدء الغسيل وتنبيه العميل بأي تلف مسبق.
              </p>
              <p>
                <strong>2. ضمان التعويض:</strong> في حال فقدان أو تلف أي قطعة نلتزم بتعويض قيمتها العادلة بحد أقصى 10 أضعاف قيمة خدمة الغسيل المنفذة.
              </p>
              <p>
                <strong>3. الإلغاء:</strong> الإلغاء مجاني قبل تحرك المندوب لاستلام الملابس.
              </p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="mt-3 w-full h-10 bg-[#08BDF4] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center mx-auto mb-3 font-black text-xl">
              عالسريع
            </div>
            <h3 className="text-sm font-black text-[#183247]">عالسريع — Ala El Saree</h3>
            <p className="text-xs text-[#718596] mt-1 mb-4 leading-relaxed">
              منصة مصرية ذكية لربط العملاء بأفضل المغاسل الفندقية المعتمدة مع خدمة استلام وتوصيل سريعة حتى باب المنزل في الزقازيق، المنصورة، العاشر من رمضان، والقاهرة.
            </p>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full h-10 bg-[#08BDF4] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E55353] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-[#183247] mb-1">{t.deleteAccount}</h3>
            <p className="text-xs text-[#718596] mb-4 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف الحساب نهائياً؟ سيتم مسح بياناتك وعناوينك المسجلة فوراً.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-10 rounded-xl bg-slate-100 text-[#183247] font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 h-10 rounded-xl bg-[#E55353] text-white font-bold text-xs hover:bg-red-700 cursor-pointer"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
