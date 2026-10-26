import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, MapPin, Sparkles, Clock } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';
import heroLaundryImg from '../../assets/images/hero_laundry_fresh_1792642989059.jpg';

interface HeroSectionProps {
  t: LandingTranslation;
  language: Language;
  onOpenAppDownload: () => void;
  onScrollToMerchant: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  t,
  language,
  onOpenAppDownload,
  onScrollToMerchant
}) => {
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F4FBFF]/80 via-white to-white">
      {/* Subtle brand ambient accents */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#08BDF4]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-24 w-80 h-80 bg-sky-100/50 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Narrative & Conversion */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            
            {/* Quiet Editorial Kicker (No Pill) */}
            <div className="text-xs sm:text-sm font-bold text-[#079FD0] tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#08BDF4]" />
              <span>{t.heroKicker}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#183247] tracking-tight leading-[1.15] mb-5 text-balance">
              {t.heroHeadline}
            </h1>

            {/* Subhead with natural Egyptian context */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              {t.heroSubhead}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenAppDownload}
                className="px-7 py-3.5 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#08BDF4]/20 hover:shadow-xl transition active:scale-98 cursor-pointer"
              >
                <span>{t.heroPrimaryCta}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToMerchant}
                className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#183247] font-bold text-sm border border-slate-200 hover:border-slate-300 shadow-xs transition active:scale-98 cursor-pointer text-center"
              >
                {t.heroSecondaryCta}
              </button>
            </div>

            {/* Active Coverage Towns in Egypt (Honest & Specific) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100 w-full">
              <MapPin className="w-4 h-4 text-[#08BDF4] shrink-0" />
              <span>
                {language === 'ar'
                  ? 'متاح في نطاقات محددة بالزقازيق، المنصورة، العاشر من رمضان، والقاهرة الكبرى'
                  : 'Available in active zones across Zagazig, Mansoura, 10th of Ramadan, and Greater Cairo'}
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-slate-900/10 aspect-[16/10] sm:aspect-[16/11] bg-slate-100">
              <img
                src={heroLaundryImg}
                alt="عالسريع - عناية متكاملة بالملابس والمفروشات"
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition duration-700 ease-out"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.classList.add('bg-gradient-to-tr', 'from-sky-50', 'to-cyan-100', 'flex', 'items-center', 'justify-center');
                  }
                }}
              />
              
              {/* Subtle quality tag */}
              <div className="absolute bottom-4 start-4 end-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/60 shadow-sm flex items-center justify-between text-xs">
                <span className="font-bold text-[#183247]">
                  {language === 'ar' ? 'نظافة وانتعاش مضمون' : 'Freshness & Hygiene Guaranteed'}
                </span>
                <span className="text-[#079FD0] font-black">عالسريع</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Transparent Benefit Strip Below Hero */}
        <div className="mt-14 pt-8 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#183247]">{t.heroBadgeCoverage}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {language === 'ar' ? 'استلام وتسليم لباب بيتك حسب المنطقة' : 'Doorstep service according to current zone'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#183247]">{t.heroBadgePartners}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {language === 'ar' ? 'أفضل المغاسل المعتمدة وذات الخبرة' : 'Certified experienced local cleaners'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#183247]">{t.heroBadgeCare}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {language === 'ar' ? 'تخصيص الروائح والنشا والتغليف' : 'Custom scents, starch levels & packaging'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#183247]">{t.heroBadgeDelivery}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {language === 'ar' ? 'مواعيد استلام وتسليم محددة ومؤكدة' : 'Clear scheduled slots that fit your day'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
