import React, { useState } from 'react';
import { OperationsProvider, useOperations } from '../operations/context/OperationsContext';
import { MerchantAuthProvider, useMerchantAuth } from './context/MerchantAuthContext';
import { MerchantHeader } from './components/MerchantHeader';
import { MerchantQueueView } from './views/MerchantQueueView';
import { MerchantShiftRevenueView } from './views/MerchantShiftRevenueView';
import { MerchantStoreSettingsView } from './views/MerchantStoreSettingsView';
import { MerchantCatalogPriceView } from './views/MerchantCatalogPriceView';
import { MerchantIntakeModal } from './components/MerchantIntakeModal';
import { MerchantBagTagModal } from './components/MerchantBagTagModal';
import { MerchantLoginModal } from './components/MerchantLoginModal';
import { MerchantQuickScannerModal } from './components/MerchantQuickScannerModal';
import { LaundryOrder } from '../operations/types';

interface MerchantPortalAppProps {
  onBackToLanding?: () => void;
}

const MerchantPortalContent: React.FC<MerchantPortalAppProps> = ({ onBackToLanding }) => {
  const { language, setLanguage } = useOperations();
  const { isAuthenticated, activeMerchant } = useMerchantAuth();

  const [activeTab, setActiveTab] = useState<string>('queue');
  const [selectedOrderForIntake, setSelectedOrderForIntake] = useState<LaundryOrder | null>(null);
  const [selectedOrderForBagTag, setSelectedOrderForBagTag] = useState<LaundryOrder | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(!isAuthenticated);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState<boolean>(false);

  const isRtl = language === 'ar';

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 ${
        isRtl ? 'text-right' : 'text-left'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Merchant Header */}
      <MerchantHeader
        language={language}
        onToggleLanguage={toggleLanguage}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenScannerModal={() => setIsScannerModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onBackToLanding={onBackToLanding}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 pb-24 sm:pb-8">
        {activeTab === 'queue' && (
          <MerchantQueueView
            onOpenIntake={ord => setSelectedOrderForIntake(ord)}
            onOpenBagTag={ord => setSelectedOrderForBagTag(ord)}
          />
        )}

        {activeTab === 'intake' && (
          <MerchantQueueView
            filterStatusPreset="intake"
            onOpenIntake={ord => setSelectedOrderForIntake(ord)}
            onOpenBagTag={ord => setSelectedOrderForBagTag(ord)}
          />
        )}

        {activeTab === 'approval' && (
          <MerchantQueueView
            filterStatusPreset="approval"
            onOpenIntake={ord => setSelectedOrderForIntake(ord)}
            onOpenBagTag={ord => setSelectedOrderForBagTag(ord)}
          />
        )}

        {activeTab === 'catalog' && <MerchantCatalogPriceView />}

        {activeTab === 'revenue' && <MerchantShiftRevenueView />}

        {activeTab === 'settings' && <MerchantStoreSettingsView />}
      </main>

      {/* Intake & Garment Inspection Modal */}
      {selectedOrderForIntake && (
        <MerchantIntakeModal
          order={selectedOrderForIntake}
          isOpen={!!selectedOrderForIntake}
          onClose={() => setSelectedOrderForIntake(null)}
          onOpenBagTag={ord => {
            setSelectedOrderForIntake(null);
            setSelectedOrderForBagTag(ord);
          }}
        />
      )}

      {/* Thermal Bag Tag Modal */}
      {selectedOrderForBagTag && (
        <MerchantBagTagModal
          order={selectedOrderForBagTag}
          isOpen={!!selectedOrderForBagTag}
          onClose={() => setSelectedOrderForBagTag(null)}
          merchantName={activeMerchant?.nameAr || 'المغسلة المعتمدة'}
        />
      )}

      {/* Quick Barcode Scanner Modal */}
      <MerchantQuickScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onSelectOrder={ord => setSelectedOrderForIntake(ord)}
      />

      {/* Login / Branch Switcher Modal */}
      <MerchantLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onBackToLanding={onBackToLanding}
      />
    </div>
  );
};

export const MerchantPortalApp: React.FC<MerchantPortalAppProps> = (props) => {
  return (
    <OperationsProvider>
      <MerchantAuthProvider>
        <MerchantPortalContent {...props} />
      </MerchantAuthProvider>
    </OperationsProvider>
  );
};

export default MerchantPortalApp;
