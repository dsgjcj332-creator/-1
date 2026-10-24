import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Sparkles, Store, ShoppingBag } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';

interface HeaderProps {
  t: LandingTranslation;
  language: Language;
  onToggleLanguage: () => void;
  onOpenCustomerApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  language,
  onToggleLanguage,
  onOpenCustomerApp
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs'
          : 'bg-white/80 backdrop-blur-xs border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (Actions) */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#hero"
            onClick={e => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="flex items-center gap-2.5 text-xl sm:text-2xl font-black text-[#183247] tracking-tight whitespace-nowrap shrink-0 group"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#08BDF4] to-[#0596c7] text-white flex items-center justify-center font-black text-lg shadow-sm">
              ع
            </span>
            <div className="flex flex-col">
              <span className="leading-none group-hover:text-[#08BDF4] transition-colors">
                {t.brandName}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {t.brandSub}
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('services')}
              className="hover:text-[#08BDF4] transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navServices}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#08BDF4] transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navHowItWorks}
            </button>
            <button
              onClick={() => scrollToSection('for-laundries')}
              className="hover:text-[#08BDF4] transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navForLaundries}
            </button>
            <button
              onClick={() => scrollToSection('delivery-partner')}
              className="hover:text-[#08BDF4] transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navForDelivery}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#08BDF4] transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navFaq}
            </button>
          </nav>

          {/* Zone 3: Actions (Language switcher, Join Partner, and Customer App CTA) */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-[#183247] hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Switch language / تغيير اللغة"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-[#08BDF4]" />
              <span>{t.toggleLang}</span>
            </button>

            {/* Secondary CTA: Laundry Partner Form */}
            <button
              onClick={() => scrollToSection('merchant-application')}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-[#08BDF4]" />
              <span>{t.navJoinPartner}</span>
            </button>

            {/* Primary Action: Customer App Experience */}
            <button
              onClick={onOpenCustomerApp}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#08BDF4] hover:bg-[#079FD0] rounded-xl transition shadow-sm hover:shadow active:scale-98 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.navCustomerCta}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="p-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg flex items-center gap-1"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#08BDF4]" />
              <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-2.5 text-sm font-semibold text-slate-700">
            <button
              onClick={() => scrollToSection('services')}
              className="py-2.5 px-3 text-start rounded-xl hover:bg-slate-50 transition"
            >
              {t.navServices}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="py-2.5 px-3 text-start rounded-xl hover:bg-slate-50 transition"
            >
              {t.navHowItWorks}
            </button>
            <button
              onClick={() => scrollToSection('for-laundries')}
              className="py-2.5 px-3 text-start rounded-xl hover:bg-slate-50 transition"
            >
              {t.navForLaundries}
            </button>
            <button
              onClick={() => scrollToSection('delivery-partner')}
              className="py-2.5 px-3 text-start rounded-xl hover:bg-slate-50 transition"
            >
              {t.navForDelivery}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="py-2.5 px-3 text-start rounded-xl hover:bg-slate-50 transition"
            >
              {t.navFaq}
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => scrollToSection('merchant-application')}
                className="w-full py-3 px-4 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl text-center flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4 text-[#08BDF4]" />
                <span>{t.navJoinPartner}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomerApp();
                }}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-[#08BDF4] rounded-xl text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.navCustomerCta}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
