import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/layout/MobileShell';
import { CorporateLandingPage } from './landing/CorporateLandingPage';

// Customer Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import {
  AuthWelcomeScreen,
  AuthPhoneScreen,
  AuthOtpScreen,
  AuthProfileScreen
} from './components/screens/AuthScreens';
import { HomeScreen } from './components/screens/HomeScreen';
import { ServicesScreen } from './components/screens/ServicesScreen';
import { OrdersScreen } from './components/screens/OrdersScreen';
import { AddressesScreen } from './components/screens/AddressesScreen';
import { AddressFormScreen } from './components/screens/AddressFormScreen';
import { AccountScreen } from './components/screens/AccountScreen';
import { GarmentSelectScreen } from './components/screens/GarmentSelectScreen';
import { GarmentPhotosScreen } from './components/screens/GarmentPhotosScreen';
import { PartnerSelectScreen } from './components/screens/PartnerSelectScreen';
import { SchedulePickupScreen } from './components/screens/SchedulePickupScreen';
import { ScheduleDeliveryScreen } from './components/screens/ScheduleDeliveryScreen';
import { CheckoutScreen } from './components/screens/CheckoutScreen';
import { OrderConfirmedScreen } from './components/screens/OrderConfirmedScreen';
import { OrderTrackingScreen } from './components/screens/OrderTrackingScreen';
import { RateOrderScreen } from './components/screens/RateOrderScreen';
import { SupportScreen } from './components/screens/SupportScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';

const MainNavigator: React.FC = () => {
  const { currentScreen, mainTab } = useApp();

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'auth_welcome':
      return <AuthWelcomeScreen />;
    case 'auth_phone':
      return <AuthPhoneScreen />;
    case 'auth_otp':
      return <AuthOtpScreen />;
    case 'auth_profile':
      return <AuthProfileScreen />;
    case 'garment_select':
      return <GarmentSelectScreen />;
    case 'garment_photos':
      return <GarmentPhotosScreen />;
    case 'partner_select':
      return <PartnerSelectScreen />;
    case 'pickup_schedule':
      return <SchedulePickupScreen />;
    case 'delivery_schedule':
      return <ScheduleDeliveryScreen />;
    case 'checkout':
      return <CheckoutScreen />;
    case 'order_confirmed':
      return <OrderConfirmedScreen />;
    case 'order_tracking':
      return <OrderTrackingScreen />;
    case 'address_form':
      return <AddressFormScreen />;
    case 'rate_order':
      return <RateOrderScreen />;
    case 'support':
      return <SupportScreen />;
    case 'notifications':
      return <NotificationsScreen />;
    case 'main':
    default:
      switch (mainTab) {
        case 'home':
          return <HomeScreen />;
        case 'services':
          return <ServicesScreen />;
        case 'orders':
          return <OrdersScreen />;
        case 'addresses':
          return <AddressesScreen />;
        case 'account':
          return <AccountScreen />;
        default:
          return <HomeScreen />;
      }
  }
};

import { OperationsApp } from './operations/OperationsApp';
import { MerchantPortalApp } from './merchant/MerchantPortalApp';

export default function App() {
  // Determine initial view: check URL query parameter ?view=... or port
  const [currentView, setCurrentView] = useState<'landing' | 'app' | 'operations' | 'merchant'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'merchant') return 'merchant';
      if (viewParam === 'operations') return 'operations';
      if (viewParam === 'app') return 'app';
      if (viewParam === 'landing') return 'landing';

      // Port-based routing
      if (window.location.port === '5000') return 'merchant';
      if (window.location.port === '5174') return 'app';
      if (window.location.port === '1000') return 'landing';
      if (window.location.port === '3000') return 'operations';

      // Default to operations platform on standard preview
      return 'merchant';
    } catch {
      return 'merchant';
    }
  });

  // Listen to popstate or url changes
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      if (view === 'merchant') setCurrentView('merchant');
      else if (view === 'operations') setCurrentView('operations');
      else if (view === 'app') setCurrentView('app');
      else if (view === 'landing') setCurrentView('landing');
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const switchToMerchant = () => {
    setCurrentView('merchant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToOperations = () => {
    setCurrentView('operations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToApp = () => {
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCustomerApp = window.location.port === '5174';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {!isCustomerApp && (
        // Discreet Architecture Mode Bar (hidden on customer app port 5174)
        <aside
          aria-label="System Architecture Navigation Bar"
          className="bg-slate-900 text-white px-3 sm:px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-slate-800 z-50 shrink-0 select-none gap-2"
        >
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#08BDF4]">عالسريع</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 hidden md:inline text-[11px]">
            منظومة خدمات الغسيل المتكاملة (Ala El Saree Unified Ecosystem)
          </span>
        </div>

        {/* View Switcher Tabs (Ports 1000, 5174, 5000, 3000) */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 overflow-x-auto scrollbar-none max-w-full">
          <button
            onClick={switchToLanding}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              currentView === 'landing'
                ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>الموقع التعريفي</span>
            <span className="text-[10px] opacity-75 font-mono">(1000)</span>
          </button>

          <button
            onClick={switchToApp}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              currentView === 'app'
                ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>تطبيق العميل</span>
            <span className="text-[10px] opacity-75 font-mono">(5174)</span>
          </button>

          <button
            onClick={switchToMerchant}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              currentView === 'merchant'
                ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>بوابة المغسلة</span>
            <span className="text-[10px] opacity-75 font-mono">(5000)</span>
          </button>

          <button
            onClick={switchToOperations}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              currentView === 'operations'
                ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>العمليات المركزية</span>
            <span className="text-[10px] opacity-75 font-mono">(3000)</span>
          </button>
        </div>
        </aside>
      )}

      {/* Main View Container */}
      <div className="flex-1 flex flex-col">
        {currentView === 'landing' ? (
          <CorporateLandingPage onOpenCustomerApp={switchToApp} />
        ) : currentView === 'app' ? (
          <AppProvider>
            <MobileShell onBackToLanding={switchToLanding}>
              <MainNavigator />
            </MobileShell>
          </AppProvider>
        ) : currentView === 'merchant' ? (
          <MerchantPortalApp onBackToLanding={switchToLanding} />
        ) : (
          <OperationsApp onBackToLanding={switchToLanding} />
        )}
      </div>
    </div>
  );
}
