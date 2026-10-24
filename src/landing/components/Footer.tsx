import React from 'react';
import { Globe, Store, ShoppingBag, Truck } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';

interface FooterProps {
  t: LandingTranslation;
  language: Language;
  onToggleLanguage: () => void;
  onOpenCustomerApp: () => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  t,
  language,
  onToggleLanguage,
  onOpenCustomerApp,
  onOpenLegal
}) => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#08BDF4] to-[#0596c7] text-white flex items-center justify-center font-black text-lg shadow-sm">
                ع
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight">
                  {t.brandName}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {t.brandSub}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footerAbout}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onToggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#08BDF4]" />
                <span>{t.toggleLang}</span>
              </button>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              {t.footerQuickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('services')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t.navServices}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t.navHowItWorks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('faq')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t.navFaq}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Partnerships */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              {t.footerPartners}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => scrollTo('for-laundries')}
                  className="hover:text-white transition cursor-pointer flex items-center gap-1.5"
                >
                  <Store className="w-3 h-3 text-[#08BDF4]" />
                  <span>{t.navForLaundries}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('merchant-application')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {language === 'ar' ? 'استمارة انضمام المغاسل' : 'Merchant Application'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('delivery-partner')}
                  className="hover:text-white transition cursor-pointer flex items-center gap-1.5"
                >
                  <Truck className="w-3 h-3 text-[#08BDF4]" />
                  <span>{t.navForDelivery}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              {language === 'ar' ? 'التطبيق والخدمة' : 'Application'}
            </h4>
            <p className="text-xs text-slate-400 leading-snug">
              {language === 'ar'
                ? 'جرب واجهة تطبيق العميل المخصصة لحجز الغسيل والكي.'
                : 'Experience our customer mobile app for garment care booking.'}
            </p>
            <button
              onClick={onOpenCustomerApp}
              className="px-4 py-2.5 rounded-xl bg-[#08BDF4] hover:bg-[#079FD0] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.navCustomerCta}</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} {t.footerCopyright}.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-300 transition cursor-pointer"
            >
              {t.footerPrivacy}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-300 transition cursor-pointer"
            >
              {t.footerTerms}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
