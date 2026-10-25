import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/layout/MobileShell';
import { CorporateLandingPage } from './landing/CorporateLandingPage';
import { AppDownloadPage } from './landing/components/AppDownloadPage';
import { RegisterPage } from './landing/RegisterPage';


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
        default:
          return <AccountScreen />;
      }
  }
};



export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'app' | 'download' | 'merchant' | 'operations' | 'register'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'app') return 'app';
      if (viewParam === 'download') return 'download';
      if (viewParam === 'merchant') return 'merchant';
      if (viewParam === 'operations') return 'operations';
      if (viewParam === 'register') return 'register';
      if (viewParam === 'landing') return 'landing';
      return 'landing';
    } catch {
      return 'landing';
    }
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      if (view === 'app') setCurrentView('app');
      else if (view === 'download') setCurrentView('download');
      else if (view === 'merchant') setCurrentView('merchant');
      else if (view === 'operations') setCurrentView('operations');
      else if (view === 'register') setCurrentView('register');
      else if (view === 'landing') setCurrentView('landing');
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const switchToRegister = () => setCurrentView('register');
  const switchToDownload = () => setCurrentView('download');
  const switchToApp = () => setCurrentView('app');
  const switchToMerchant = () => setCurrentView('merchant');
  const switchToOperations = () => setCurrentView('operations');
  const switchToLanding = () => setCurrentView('landing');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="flex-1 flex flex-col">
        {currentView === 'register' ? (
          <RegisterPage onBackToLanding={switchToLanding} />
        ) : currentView === 'landing' ? (
          <CorporateLandingPage onOpenAppDownload={switchToDownload} onOpenRegister={switchToRegister} />
        ) : currentView === 'download' ? (
          <AppDownloadPage onBackToLanding={switchToLanding} />
        ) : currentView === 'app' ? (
          <AppProvider>
            <MobileShell onBackToLanding={switchToLanding}>
              <MainNavigator />
            </MobileShell>
          </AppProvider>
        ) : currentView === 'merchant' ? (
          <div className="flex-1 items-center justify-center bg-slate-100">
            <p className="text-[#183247] text-lg">بوابة المغسلة - Merchant Portal</p>
            <p className="text-xs text-[#718596] mt-2">تشغيل منفصل على المنفذ 5000</p>
          </div>
        ) : (
          <div className="flex-1 items-center justify-center bg-slate-100">
            <p className="text-[#183247] text-lg">العمليات المركزية - Operations</p>
            <p className="text-xs text-[#718596] mt-2">تشغيل منفصل على المنفذ 3000</p>
          </div>
        )}
      </div>
    </div>
  );
}
