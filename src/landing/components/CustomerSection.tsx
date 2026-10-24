import React from 'react';
import { Smartphone, CheckCircle, Sliders, Calendar, PackageCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';

interface CustomerSectionProps {
  t: LandingTranslation;
  language: Language;
  onOpenCustomerApp: () => void;
}

export const CustomerSection: React.FC<CustomerSectionProps> = ({
  t,
  language,
  onOpenCustomerApp
}) => {
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const journeySteps = [
    {
      num: '01',
      title: t.customerStep1Title,
      desc: t.customerStep1Desc,
      icon: <Smartphone className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      num: '02',
      title: t.customerStep2Title,
      desc: t.customerStep2Desc,
      icon: <Sliders className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      num: '03',
      title: t.customerStep3Title,
      desc: t.customerStep3Desc,
      icon: <Calendar className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      num: '04',
      title: t.customerStep4Title,
      desc: t.customerStep4Desc,
      icon: <CheckCircle className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      num: '05',
      title: t.customerStep5Title,
      desc: t.customerStep5Desc,
      icon: <PackageCheck className="w-5 h-5 text-[#08BDF4]" />
    }
  ];

  return (
    <section id="for-customers" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold text-[#079FD0] uppercase tracking-wider mb-2">
            {language === 'ar' ? 'للعملاء والأفراد' : 'For Customers & Households'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#183247] tracking-tight mb-4">
            {t.customerHeading}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {t.customerSubhead}
          </p>
        </div>

        {/* 5-Step Customer Journey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-14">
          {journeySteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#F4FBFF]/60 hover:bg-[#F4FBFF] p-5 rounded-2xl border border-slate-200/70 hover:border-[#08BDF4]/40 transition-all flex flex-col justify-between text-start group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <span className="text-xs font-black text-slate-300 group-hover:text-[#08BDF4] transition-colors tabular-nums">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-sm font-black text-[#183247] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Customer CTA Box */}
        <div className="bg-gradient-to-r from-[#183247] to-[#1e425e] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-start">
            <h3 className="text-xl sm:text-2xl font-black mb-2">
              {language === 'ar' ? 'جاهز تريح نفسك من هم الغسيل والكي؟' : 'Ready to simplify your garment care?'}
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              {language === 'ar'
                ? 'استمتع بتجربة طلب رقمية سلسة، حدد مواعيدك بدقة، واستلم ملابسك مغلفة ومكوية بعناية فائقة.'
                : 'Experience a smooth digital ordering flow, set custom preferences, and enjoy doorstep delivery.'}
            </p>
          </div>

          <button
            onClick={onOpenCustomerApp}
            className="px-8 py-4 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-cyan-500/25 shrink-0 transition active:scale-98 cursor-pointer"
          >
            <span>{t.customerCtaButton}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
