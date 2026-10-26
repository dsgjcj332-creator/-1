import React, { useState, useEffect } from 'react';
import { OperationsProvider, useOperations } from './context/OperationsContext';
import { OperationsHeader } from './components/OperationsHeader';
import { Sidebar } from './components/Sidebar';

// Admin Views
import { AdminOverviewView } from './views/admin/AdminOverviewView';
import { ApplicationsReviewView } from './views/admin/ApplicationsReviewView';
import { OrdersSupervisionView } from './views/admin/OrdersSupervisionView';
import { DispatchConsoleView } from './views/admin/DispatchConsoleView';
import { CommissionSettingsView } from './views/admin/CommissionSettingsView';
import { SettlementsApprovalView } from './views/admin/SettlementsApprovalView';
import { ServiceZonesView } from './views/admin/ServiceZonesView';
import { MerchantsDirectoryView } from './views/admin/MerchantsDirectoryView';
import { DriversFleetView } from './views/admin/DriversFleetView';
import { AuditLogsView } from './views/admin/AuditLogsView';
import { DisputesView } from './views/admin/DisputesView';

// Merchant Views
import { MerchantOverviewView } from './views/merchant/MerchantOverviewView';
import { MerchantOrdersView } from './views/merchant/MerchantOrdersView';
import { MerchantCatalogView } from './views/merchant/MerchantCatalogView';
import { MerchantSettlementsView } from './views/merchant/MerchantSettlementsView';
import { MerchantSettingsView } from './views/merchant/MerchantSettingsView';

// Driver Views
import { DriverTasksView } from './views/driver/DriverTasksView';
import { DriverCashView } from './views/driver/DriverCashView';

interface OperationsAppProps {
  onBackToLanding?: () => void;
}

const OperationsContent: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const { currentUser, language } = useOperations();
  const isRtl = language === 'ar';

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (currentUser.role === 'merchant_owner' || currentUser.role === 'merchant_staff') {
      return 'merchant_overview';
    }
    if (currentUser.role === 'driver') {
      return 'driver_tasks';
    }
    return 'overview';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Switch default tab if persona switches
  useEffect(() => {
    if (currentUser.role === 'merchant_owner' || currentUser.role === 'merchant_staff') {
      if (!activeTab.startsWith('merchant_')) {
        setActiveTab('merchant_overview');
      }
    } else if (currentUser.role === 'driver') {
      if (!activeTab.startsWith('driver_')) {
        setActiveTab('driver_tasks');
      }
    } else {
      if (activeTab.startsWith('merchant_') || activeTab.startsWith('driver_')) {
        setActiveTab('overview');
      }
    }
  }, [currentUser.role]);

  // Render view
  const renderView = () => {
    switch (activeTab) {
      // Admin / Dispatcher views
      case 'overview':
        return <AdminOverviewView onNavigateTab={setActiveTab} />;
      case 'applications':
        return <ApplicationsReviewView />;
      case 'merchants':
        return <MerchantsDirectoryView />;
      case 'orders':
        return <OrdersSupervisionView />;
      case 'dispatch':
        return <DispatchConsoleView />;
      case 'drivers':
        return <DriversFleetView />;
      case 'zones':
        return <ServiceZonesView />;
      case 'commissions':
        return <CommissionSettingsView />;
      case 'settlements':
        return <SettlementsApprovalView />;
      case 'support':
        return <DisputesView />;
      case 'audit':
        return <AuditLogsView />;

      // Merchant views
      case 'merchant_overview':
        return <MerchantOverviewView onNavigateTab={setActiveTab} />;
      case 'merchant_orders':
        return <MerchantOrdersView />;
      case 'merchant_catalog':
        return <MerchantCatalogView />;
      case 'merchant_settlements':
        return <MerchantSettlementsView />;
      case 'merchant_settings':
        return <MerchantSettingsView />;

      // Driver views
      case 'driver_tasks':
        return <DriverTasksView />;
      case 'driver_cash':
        return <DriverCashView />;

      default:
        return <AdminOverviewView onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 relative"
    >
      <OperationsHeader
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onLogout={onLogout}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Persistent Sidebar */}
        <Sidebar currentTab={activeTab} onSelectTab={setActiveTab} onLogout={onLogout} />

        {/* Mobile Slide-Over Drawer Navigation */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer Surface */}
            <div
              className={`relative ${
                isRtl ? 'mr-0 ml-auto' : 'ml-0 mr-auto'
              } w-72 max-w-[85vw] bg-white h-full shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-${
                isRtl ? 'right' : 'left'
              } duration-200`}
            >
              <Sidebar
                currentTab={activeTab}
                onSelectTab={setActiveTab}
                isMobileDrawer={true}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
                onLogout={onLogout}
              />
            </div>
          </div>
        )}

        {/* Main Workspace View */}
        <main className="flex-1 p-3 sm:p-5 lg:p-7 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto">{renderView()}</div>
        </main>
      </div>
    </div>
  );
};

export const OperationsApp: React.FC<OperationsAppProps> = ({ onBackToLanding }) => {
  return (
    <OperationsProvider>
      <OperationsContent onLogout={onBackToLanding} />
    </OperationsProvider>
  );
};
