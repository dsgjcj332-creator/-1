import React from 'react';
import { ShoppingBag, MapPin, Sparkles, Truck } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';

interface HowItWorksSectionProps {
  t: LandingTranslation;
  language: Language;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ t, language }) => {
  const steps = [
    {
      num: '01',
      title: t.howStep1Title,
      desc: t.howStep1Desc,
      icon: <ShoppingBag className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      num: '02',
      title: t.howStep2Title,
      desc: t.howStep2Desc,
      icon: <MapPin className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      num: '03',
      title: t.howStep3Title,
      desc: t.howStep3Desc,
      icon: <Sparkles className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      num: '04',
      title: t.howStep4Title,
      desc: t.howStep4Desc,
      icon: <Truck className="w-5 h-5 text-[#08BDF4]" />
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold text-[#079FD0] uppercase tracking-wider mb-2">
            {language === 'ar' ? 'بسيطة وواضحة' : 'Seamless Process'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#183247] tracking-tight mb-4">
            {t.howHeading}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {t.howSubhead}
          </p>
        </div>

        {/* 4 Connected Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-[#F4FBFF]/40 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between text-start group hover:border-[#08BDF4]/50 transition-all hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-300 group-hover:text-[#08BDF4] transition-colors tabular-nums">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#183247] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-[#079FD0]">
                <span>{language === 'ar' ? `المرحلة ${idx + 1}` : `Phase ${idx + 1}`}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
