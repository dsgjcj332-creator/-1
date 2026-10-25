import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/layout/MobileShell';


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
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AppProvider>
        <MobileShell onBackToLanding={() => {}}>
          <MainNavigator />
        </MobileShell>
      </AppProvider>
    </div>
  );
}
