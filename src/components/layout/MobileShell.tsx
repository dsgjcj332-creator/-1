import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  ShoppingBag,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Maximize2,
  CheckCircle2,
  Globe,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenType, MainTab } from '../../types';

interface MobileShellProps {
  children: React.ReactNode;
  onBackToLanding?: () => void;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children, onBackToLanding }) => {
  const {
    language,
    setLanguage,
    t,
    currentScreen,
    mainTab,
    setTab,
    goBack,
    totalItemsCount,
    unreadNotifsCount,
    navigateTo,
    toastMessage
  } = useApp();

  const [deviceFrame, setDeviceFrame] = useState<'iphone' | 'compact' | 'android' | 'fluid'>('iphone');

  // Check if current screen is a secondary workflow that has a back button
  const isSecondaryScreen =
    currentScreen !== 'main' &&
    currentScreen !== 'splash' &&
    currentScreen !== 'onboarding' &&
    currentScreen !== 'auth_welcome';

  const getScreenTitle = (screen: ScreenType): string => {
    switch (screen) {
      case 'garment_select':
        return language === 'ar' ? 'اختيار الملابس والخدمات' : 'Select Garments';
      case 'garment_photos':
        return language === 'ar' ? 'توثيق وتصوير القطع' : 'Garment Photo Verification';
      case 'partner_select':
        return language === 'ar' ? 'اختيار المغسلة الشريكة' : 'Select Laundry Partner';
      case 'pickup_schedule':
        return language === 'ar' ? 'تحديد موعد الاستلام' : 'Pickup Schedule';
      case 'delivery_schedule':
        return language === 'ar' ? 'تحديد موعد التوصيل' : 'Delivery Schedule';
      case 'checkout':
        return language === 'ar' ? 'مراجعة وتأكيد الطلب' : 'Checkout';
      case 'order_confirmed':
        return language === 'ar' ? 'تأكيد الطلب' : 'Order Confirmed';
      case 'order_tracking':
        return language === 'ar' ? 'متابعة وتتبع الطلب' : 'Track Order';
      case 'address_form':
        return language === 'ar' ? 'إضافة / تعديل عنوان' : 'Manage Address';
      case 'support':
        return language === 'ar' ? 'مركز المساعدة والدعم' : 'Help & Support';
      case 'notifications':
        return language === 'ar' ? 'التنبيهات والإشعارات' : 'Notifications';
      case 'rate_order':
        return language === 'ar' ? 'تقييم الخدمة' : 'Rate Order';
      case 'auth_phone':
        return language === 'ar' ? 'رقم الهاتف' : 'Phone Number';
      case 'auth_otp':
        return language === 'ar' ? 'تأكيد الرمز' : 'Verify OTP';
      case 'auth_profile':
        return language === 'ar' ? 'إعداد الحساب' : 'Setup Profile';
      default:
        return '';
    }
  };

  const navItems: { tab: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'home', label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { tab: 'services', label: t.navServices, icon: <Sparkles className="w-5 h-5" /> },
    { tab: 'orders', label: t.navOrders, icon: <ShoppingBag className="w-5 h-5" /> },
    { tab: 'addresses', label: t.navAddresses, icon: <MapPin className="w-5 h-5" /> },
    { tab: 'account', label: t.navAccount, icon: <User className="w-5 h-5" /> }
  ];

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  // Compute container width classes based on selected device preset
  const getDeviceContainerClass = () => {
    switch (deviceFrame) {
      case 'compact':
        // iPhone SE / compact (375px)
        return 'md:max-w-[375px] md:h-[812px] md:rounded-[44px] md:border-[10px] md:border-slate-800';
      case 'android':
        // Samsung Galaxy S24 / Android (390px)
        return 'md:max-w-[390px] md:h-[844px] md:rounded-[36px] md:border-[8px] md:border-slate-700';
      case 'fluid':
        // Full responsive fluid
        return 'w-full max-w-md md:h-[90vh] md:rounded-3xl md:border md:border-slate-700/50';
      case 'iphone':
      default:
        // iPhone 16 Pro (402px)
        return 'md:max-w-[402px] md:h-[874px] md:rounded-[48px] md:border-[10px] md:border-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-[#183247] flex flex-col items-center justify-start p-0 md:py-6 selection:bg-[#08BDF4]/20 antialiased">
      
      {/* Desktop Simulation Header Toolbar (Hidden on real phones) */}
      <aside aria-label="Desktop Simulation Controls" className="hidden md:flex items-center justify-between w-full max-w-3xl px-4 py-2.5 mb-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white text-xs shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold text-white tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#08BDF4] animate-pulse"></span>
            عالسريع — Ala El Saree
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/70 text-[11px]">مظهر شاشة الهاتف الحقيقية</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Return to Corporate Landing */}
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#08BDF4] hover:bg-[#079FD0] rounded-xl font-bold transition cursor-pointer text-white text-xs shadow-xs"
              title="العودة للموقع التعريفي"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الموقع التعريفي' : 'Corporate Landing'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/15 hover:bg-white/25 rounded-xl font-bold transition cursor-pointer text-white text-xs"
            title="تبديل اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#08BDF4]" />
            <span>{language === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Device Frame Selector */}
          <div className="flex items-center bg-black/50 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => setDeviceFrame('iphone')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                deviceFrame === 'iphone' ? 'bg-[#08BDF4] text-white shadow-xs' : 'text-white/60 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              iPhone 16
            </button>
            <button
              onClick={() => setDeviceFrame('android')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                deviceFrame === 'android' ? 'bg-[#08BDF4] text-white shadow-xs' : 'text-white/60 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              Android
            </button>
            <button
              onClick={() => setDeviceFrame('compact')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                deviceFrame === 'compact' ? 'bg-[#08BDF4] text-white shadow-xs' : 'text-white/60 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              Compact (375)
            </button>
            <button
              onClick={() => setDeviceFrame('fluid')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                deviceFrame === 'fluid' ? 'bg-[#08BDF4] text-white shadow-xs' : 'text-white/60 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE SHELL CONTAINER (Fills 100% on phone, Framed on desktop) */}
      {/* ============================================================== */}
      <div
        className={`w-full h-[100dvh] transition-all duration-300 relative bg-white flex flex-col overflow-hidden shadow-2xl transform-gpu [transform:translateZ(0)] isolate ${getDeviceContainerClass()}`}
      >
        {/* Status Bar (iPhone Dynamic Island / Android Camera) */}
        <div className="w-full h-11 px-5 shrink-0 flex items-center justify-between text-xs font-bold select-none bg-white z-40 border-b border-transparent">
          {/* Time */}
          <span className="font-extrabold tracking-tight text-[#183247] w-12 text-center" dir="ltr">
            {timeFormatted}
          </span>
          
          {/* Dynamic Island or Camera Cutout */}
          {deviceFrame === 'iphone' && (
            <div className="hidden md:flex w-24 h-5 bg-black rounded-full items-center justify-center -mt-1 mx-auto pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 ml-auto mr-2"></span>
            </div>
          )}

          {deviceFrame === 'compact' && (
            <div className="hidden md:flex w-16 h-3 bg-black rounded-b-md mx-auto pointer-events-none"></div>
          )}

          {deviceFrame === 'android' && (
            <div className="hidden md:flex w-3.5 h-3.5 bg-black rounded-full items-center justify-center -mt-1 mx-auto border border-slate-800 pointer-events-none"></div>
          )}

          {/* System Icons (Cell, Wifi, Battery) */}
          <div className="flex items-center gap-1.5 text-[#183247] w-12 justify-end" dir="ltr">
            {/* Cellular */}
            <div className="flex items-end gap-0.5 h-2.5">
              <span className="w-0.5 h-1 bg-[#183247] rounded-xs"></span>
              <span className="w-0.5 h-1.5 bg-[#183247] rounded-xs"></span>
              <span className="w-0.5 h-2 bg-[#183247] rounded-xs"></span>
              <span className="w-0.5 h-2.5 bg-[#183247] rounded-xs"></span>
            </div>
            {/* WiFi */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
            </svg>
            {/* Battery */}
            <div className="w-5 h-2.5 border border-[#183247] rounded-xs p-0.5 flex items-center">
              <div className="w-3.5 h-full bg-[#183247] rounded-3xs"></div>
            </div>
          </div>
        </div>

        {/* Secondary Screen Top App Bar with back navigation */}
        {isSecondaryScreen && (
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#E5EEF4] flex items-center justify-between shrink-0">
            <button
              onClick={goBack}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E5EEF4] flex items-center justify-center text-[#183247] active:scale-95 transition cursor-pointer"
              aria-label="Back"
            >
              {language === 'ar' ? (
                <ArrowRight className="w-5 h-5 text-slate-700" />
              ) : (
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              )}
            </button>

            <h1 className="text-base font-black text-[#183247] truncate max-w-[200px] text-center">
              {getScreenTitle(currentScreen)}
            </h1>

            <button
              onClick={() => navigateTo('notifications')}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E5EEF4] flex items-center justify-center text-slate-700 relative active:scale-95 transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#08BDF4]"></span>
              )}
            </button>
          </header>
        )}

        {/* Main Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F4FBFF]/40 flex flex-col no-scrollbar">
          {children}
        </main>

        {/* ============================================================== */}
        {/* ROCK-SOLID FIXED BOTTOM FOOTER / NAVIGATION TAB BAR           */}
        {/* ============================================================== */}
        {currentScreen === 'main' && (
          <nav
            aria-label="Main Navigation"
            className="shrink-0 bg-white/95 backdrop-blur-md border-t border-[#E5EEF4] px-1 py-1.5 flex items-center justify-around z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
          >
            {navItems.map(item => {
              const isActive = mainTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setTab(item.tab)}
                  className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer relative ${
                    isActive ? 'text-[#079FD0] font-black' : 'text-[#718596] hover:text-[#183247]'
                  }`}
                >
                  <div
                    className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                      isActive ? 'bg-[#EAF8FF] text-[#079FD0] shadow-2xs scale-105' : 'text-slate-500'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap font-bold">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#08BDF4] mt-0.5"></span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Global Toast Overlay */}
        {toastMessage && (
          <aside
            aria-label="Notification Toast"
            className="absolute top-14 left-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200"
          >
            <div className="bg-[#183247] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 text-[#08BDF4] shrink-0" />
              <span className="flex-1 leading-snug">{toastMessage}</span>
            </div>
          </aside>
        )}
      </div>

      {/* Real Native Footer note on desktop */}
      <footer className="hidden md:flex items-center gap-4 text-xs text-white/50 mt-4">
        <span>عالسريع © 2026 — مصمم لجميع أحجام الهواتف الذكية (Google Play & App Store)</span>
      </footer>
    </div>
  );
};
