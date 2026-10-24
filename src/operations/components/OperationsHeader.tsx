import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import {
  ShieldCheck,
  Truck,
  Store,
  UserCheck,
  Globe,
  Bell,
  Clock,
  MapPin,
  ChevronDown,
  LogOut,
  Menu,
  X,
  User,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface OperationsHeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  onLogout?: () => void;
}

export const OperationsHeader: React.FC<OperationsHeaderProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen = false,
  onLogout
}) => {
  const {
    currentUser,
    switchUser,
    availableUsers,
    language,
    setLanguage,
    currentMerchant,
    currentDriver,
    applications,
    orders,
    auditLogs
  } = useOperations();

  const isRtl = language === 'ar';
  const newAppsCount = applications.filter(a => a.status === 'new').length;

  // Dropdown & Modal states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />,
          labelAr: 'إدارة المنصة المركزية',
          labelEn: 'Platform Administrator',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        };
      case 'dispatcher':
        return {
          icon: <Truck className="w-3.5 h-3.5 text-sky-400" />,
          labelAr: 'مرحّل العمليات (ديسباتشر)',
          labelEn: 'Operations Dispatcher',
          color: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
        };
      case 'merchant_owner':
      case 'merchant_staff':
        return {
          icon: <Store className="w-3.5 h-3.5 text-emerald-400" />,
          labelAr: 'صاحب / مدير المغسلة',
          labelEn: 'Laundry Merchant',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
      case 'driver':
        return {
          icon: <Truck className="w-3.5 h-3.5 text-purple-400" />,
          labelAr: 'كابتن / مندوب التوصيل',
          labelEn: 'Delivery Partner',
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        };
      default:
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-slate-400" />,
          labelAr: 'مستخدم مصرح',
          labelEn: 'Authorized User',
          color: 'bg-slate-500/10 text-slate-300 border-slate-500/20'
        };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  const handleExecuteLogout = () => {
    setShowLogoutConfirm(false);
    setIsProfileOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      // Default fallback: switch to landing page
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'landing');
      window.location.href = url.toString();
    }
  };

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-white shrink-0 sticky top-0 z-40 select-none shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={onToggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة الجانبية'}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#08BDF4]" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#08BDF4] to-cyan-700 flex items-center justify-center shadow-xs">
                <span className="font-black text-white text-base">س</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                    عالسريع
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#08BDF4]/20 text-[#08BDF4]">
                    Operations
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
                  {isRtl
                    ? 'منظومة إدارة المغاسل وعمليات التوصيل (بورت 3000)'
                    : 'Laundry Marketplace & Delivery Ops Platform (Port 3000)'}
                </p>
              </div>
            </div>

            {/* Active Context Tag (Desktop) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
              <MapPin className="w-3.5 h-3.5 text-[#08BDF4]" />
              <span className="text-slate-300">
                {currentMerchant
                  ? currentMerchant.nameAr
                  : currentDriver
                  ? `${currentDriver.name} (${currentDriver.serviceZone})`
                  : isRtl
                  ? 'مركز العمليات الموحد (الزقازيق والمنصورة)'
                  : 'Central Operations (Zagazig & Mansoura)'}
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Role Indicator (Tablet & Desktop) */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badge.color}`}
            >
              {badge.icon}
              <span className="truncate max-w-[120px] lg:max-w-none">
                {isRtl ? badge.labelAr : badge.labelEn}
              </span>
            </div>

            {/* Persona Switcher Quick Menu */}
            <div className="relative">
              <div
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl cursor-pointer transition select-none"
              >
                <div className="w-6 h-6 rounded-full bg-[#08BDF4]/20 text-[#08BDF4] flex items-center justify-center font-bold text-xs">
                  {currentUser.name.slice(0, 1)}
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span className="truncate max-w-[110px]">{currentUser.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 leading-none">
                    {currentUser.role === 'platform_admin'
                      ? isRtl ? 'مدير المنصة' : 'Admin'
                      : currentUser.role === 'dispatcher'
                      ? isRtl ? 'مرحّل المهام' : 'Dispatcher'
                      : currentUser.role === 'driver'
                      ? isRtl ? 'كابتن توصيل' : 'Driver'
                      : isRtl ? 'شريك مغسلة' : 'Merchant'}
                  </div>
                </div>
              </div>

              {/* Profile & Switcher Dropdown */}
              {isProfileOpen && (
                <div
                  className={`absolute ${
                    isRtl ? 'left-0' : 'right-0'
                  } top-full mt-2 w-72 bg-slate-850 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150`}
                >
                  {/* Current User Card */}
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700/80 mb-3 space-y-1">
                    <div className="font-extrabold text-sm text-white">{currentUser.name}</div>
                    <div className="text-xs text-[#08BDF4] font-medium">{currentUser.email}</div>
                    <div className="text-[11px] text-slate-400 font-mono dir-ltr text-right">
                      {currentUser.phone}
                    </div>
                  </div>

                  {/* Persona Switcher Options */}
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                    {isRtl ? 'تبديل الصلاحية للتجربة (RBAC)' : 'Switch Persona'}
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {availableUsers.map(user => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user.id);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full text-right px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#08BDF4] text-slate-950 font-black'
                              : 'text-slate-300 hover:bg-slate-750'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{user.name}</div>
                            <div
                              className={`text-[10px] ${
                                isSelected ? 'text-slate-900/80 font-bold' : 'text-slate-400'
                              }`}
                            >
                              {user.role === 'platform_admin'
                                ? isRtl ? 'إدارة المنصة المركزية' : 'Platform Admin'
                                : user.role === 'dispatcher'
                                ? isRtl ? 'مرحّل التوصيل' : 'Dispatcher'
                                : user.role === 'driver'
                                ? isRtl ? 'مندوب الزقازيق' : 'Driver (Zagazig)'
                                : user.merchantId === 'm-zag-01'
                                ? isRtl ? 'مغسلة النور - الزقازيق' : 'Al-Noor Laundry'
                                : isRtl ? 'مغسلة الصفوة - الزقازيق' : 'El-Safwa Laundry'}
                            </div>
                          </div>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-slate-950"></span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Distinct Logout Button */}
                  <div className="mt-3 pt-3 border-t border-slate-700/80">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full py-2 px-3 bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'تسجيل الخروج من المنظومة' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Button & Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                aria-label="الإشعارات والتنبيهات"
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 transition cursor-pointer relative"
              >
                <Bell className="w-4 h-4 text-[#08BDF4]" />
                {newAppsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5 animate-pulse"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div
                  className={`absolute ${
                    isRtl ? 'left-0' : 'right-0'
                  } top-full mt-2 w-80 bg-slate-850 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
                    <span className="font-extrabold text-xs text-white">
                      {isRtl ? 'مركز التنبيهات التشغيلية' : 'Operations Alerts'}
                    </span>
                    <span className="text-[10px] text-[#08BDF4] font-semibold">Live Feed</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {newAppsCount > 0 && (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'طلب شراكة مغسلة جديد' : 'New Laundry Application'}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {isRtl
                            ? `يوجد ${newAppsCount} طلب انضمام بانتظار مراجعة السجل التجاري`
                            : `${newAppsCount} pending merchant partnership applications`}
                        </p>
                      </div>
                    )}

                    {auditLogs.slice(0, 4).map(log => (
                      <div
                        key={log.id}
                        className="p-2 bg-slate-800/80 rounded-xl text-[11px] border border-slate-700/50 space-y-0.5"
                      >
                        <div className="font-bold text-slate-200">{log.action}</div>
                        <div className="text-slate-400 text-[10px] truncate">{log.details}</div>
                        <div className="text-[9px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('ar-EG')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition cursor-pointer"
              title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#08BDF4]" />
              <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-1">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">
                {isRtl ? 'تسجيل الخروج من المنظومة؟' : 'Sign Out of Operations?'}
              </h3>
              <p className="text-slate-500">
                {isRtl
                  ? `أنت مسجل حالياً بهوية (${currentUser.name}). سيتم إرجاعك إلى واجهة الدخول أو الموقع التعريفي.`
                  : `You are signed in as (${currentUser.name}). You will be directed to the portal entrance.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleExecuteLogout}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl cursor-pointer shadow-xs"
              >
                {isRtl ? 'تأكيد الخروج' : 'Yes, Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
