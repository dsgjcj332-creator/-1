import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from './data/translations';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CustomerSection } from './components/CustomerSection';
import { ServicesSection } from './components/ServicesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { LaundryPartnerSection } from './components/LaundryPartnerSection';
import { MerchantApplicationForm } from './components/MerchantApplicationForm';
import { DeliveryPartnerSection } from './components/DeliveryPartnerSection';
import { TrustSection } from './components/TrustSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModals';

interface CorporateLandingPageProps {
  onOpenCustomerApp: () => void;
}

export const CorporateLandingPage: React.FC<CorporateLandingPageProps> = ({
  onOpenCustomerApp
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ala_el_saree_landing_lang');
      return saved === 'en' ? 'en' : 'ar';
    } catch {
      return 'ar';
    }
  });

  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Sync document direction and lang attribute whenever language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('ala_el_saree_landing_lang', language);
    } catch {
      // storage unavailable
    }
  }, [language]);

  const t = TRANSLATIONS[language];

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleScrollToMerchantForm = () => {
    const el = document.getElementById('merchant-application');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#183247] antialiased selection:bg-[#08BDF4]/20 flex flex-col font-sans">
      
      {/* 1. Header & Navigation */}
      <Header
        t={t}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenCustomerApp={onOpenCustomerApp}
      />

      {/* Main Page Landmark */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          t={t}
          language={language}
          onOpenCustomerApp={onOpenCustomerApp}
          onScrollToMerchant={handleScrollToMerchantForm}
        />

        {/* 3. Customer Benefits & Journey */}
        <CustomerSection
          t={t}
          language={language}
          onOpenCustomerApp={onOpenCustomerApp}
        />

        {/* 4. Complete Services Catalog */}
        <ServicesSection
          t={t}
          language={language}
        />

        {/* 5. How It Works */}
        <HowItWorksSection
          t={t}
          language={language}
        />

        {/* 6. Dedicated Laundry Partner Section */}
        <LaundryPartnerSection
          t={t}
          language={language}
          onScrollToForm={handleScrollToMerchantForm}
        />

        {/* 7. Merchant Partnership Application Form */}
        <MerchantApplicationForm
          t={t}
          language={language}
        />

        {/* 8. Delivery Partner Section */}
        <DeliveryPartnerSection
          t={t}
          language={language}
        />

        {/* 9. Trust & Service Principles */}
        <TrustSection
          t={t}
          language={language}
        />

        {/* 10. Frequently Asked Questions */}
        <FaqSection
          t={t}
          language={language}
        />
      </main>

      {/* 11. Footer */}
      <Footer
        t={t}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenCustomerApp={onOpenCustomerApp}
        onOpenLegal={type => setLegalModalType(type)}
      />

      {/* Accessible Legal Modals */}
      <LegalModal
        type={legalModalType}
        language={language}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};
