import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  ShoppingBag,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
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

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(language === 'ar' 
        ? 'لتثبيت التطبيق على آيفون: اضغط زر المشاركة (Share) ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen)'
        : 'To install on iOS: tap the Share button and select "Add to Home Screen"');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

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
      case 'auth_pin':
        return language === 'ar' ? 'تسجيل الدخول' : 'Sign In';
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

  // Height of our fixed bottom nav (approx 60px + safe area)
  const NAV_HEIGHT = 'env(safe-area-inset-bottom, 0px)';

  return (
    <div className="min-h-screen bg-slate-100/90 text-[#183247] flex flex-col items-center justify-start p-0 md:py-6 selection:bg-[#08BDF4]/20 antialiased font-sans">
      
      {/* PWA Install Notification Banner (When installable) */}
      {showInstallBanner && (
        <aside
          aria-label="Install App"
          className="w-full max-w-md px-4 py-2.5 mb-2 bg-[#08BDF4] text-white rounded-2xl shadow-md flex items-center justify-between text-xs font-bold transition-all animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </span>
            <div>
              <div className="text-white font-extrabold">{language === 'ar' ? 'تطبيق عالسريع' : 'Ala El Saree App'}</div>
              <div className="text-white/80 text-[10px] font-normal">{language === 'ar' ? 'ثبّت التطبيق على شاشة هاتفك' : 'Install to your home screen'}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-white text-[#079FD0] rounded-xl font-black text-xs hover:bg-slate-50 transition cursor-pointer shadow-xs active:scale-95"
            >
              {language === 'ar' ? 'تثبيت الآن' : 'Install'}
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="p-1.5 text-white/70 hover:text-white rounded-lg text-xs"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      {/* Top Bar for Desktop Navigation (Clean, minimal, responsive) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-md px-4 py-2 mb-2 text-xs text-slate-500 font-semibold">
        {onBackToLanding ? (
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-slate-600 hover:text-[#08BDF4] transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#08BDF4]" />
            <span>{language === 'ar' ? 'الرئيسية والموقع التعريفي' : 'Landing Page'}</span>
          </button>
        ) : <div />}

        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition cursor-pointer px-2 py-1 rounded-lg hover:bg-white"
        >
          <Globe className="w-3.5 h-3.5 text-[#08BDF4]" />
          <span>{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* MAIN RESPONSIVE WEB APP CONTAINER                             */}
      {/* ============================================================== */}
      <div
        className="w-full max-w-md min-h-[100dvh] md:min-h-[820px] md:max-h-[92vh] transition-all duration-200 relative bg-white flex flex-col md:overflow-hidden shadow-sm md:shadow-2xl md:rounded-3xl md:border md:border-slate-200/80"
      >

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
        {/* On mobile with fixed bottom nav, add padding so content isn't hidden */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F4FBFF]/40 flex flex-col no-scrollbar"
          style={{
            paddingBottom: currentScreen === 'main' ? 'calc(64px + env(safe-area-inset-bottom, 0px))' : undefined
          }}
        >
          {children}
        </main>

        {/* ============================================================== */}
        {/* ROCK-SOLID FIXED BOTTOM FOOTER / NAVIGATION TAB BAR           */}
        {/* On MOBILE: fixed to viewport bottom (outside scroll flow)      */}
        {/* On DESKTOP (md+): stays inside the card as a normal flex item  */}
        {/* ============================================================== */}
        {currentScreen === 'main' && (
          <>
            {/* Mobile: truly fixed to bottom of the viewport */}
            <nav
              aria-label="Main Navigation"
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E5EEF4] px-1 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(8,189,244,0.10)]"
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

            {/* Desktop: inside the card as a normal bottom bar */}
            <nav
              aria-label="Main Navigation"
              className="hidden md:flex shrink-0 bg-white/95 backdrop-blur-md border-t border-[#E5EEF4] px-1 py-1.5 items-center justify-around z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
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
          </>
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

      {/* Footer note on desktop */}
      <footer className="hidden md:flex items-center gap-4 text-xs text-slate-400 mt-4">
        <span>عالسريع © 2026 — منصة العناية بالملابس والمغاسل الأولى في مصر</span>
      </footer>
    </div>
  );
};
