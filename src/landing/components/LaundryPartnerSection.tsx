import React from 'react';
import { Store, TrendingUp, Users, ShieldCheck, Headphones, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';

interface LaundryPartnerSectionProps {
  t: LandingTranslation;
  language: Language;
  onScrollToForm: () => void;
}

export const LaundryPartnerSection: React.FC<LaundryPartnerSectionProps> = ({
  t,
  language,
  onScrollToForm
}) => {
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const partnerBenefits = [
    { title: t.partnerBenefit1, icon: <Users className="w-5 h-5 text-[#08BDF4]" /> },
    { title: t.partnerBenefit2, icon: <TrendingUp className="w-5 h-5 text-[#08BDF4]" /> },
    { title: t.partnerBenefit3, icon: <Store className="w-5 h-5 text-[#08BDF4]" /> },
    { title: t.partnerBenefit4, icon: <ShieldCheck className="w-5 h-5 text-[#08BDF4]" /> },
    { title: t.partnerBenefit5, icon: <Headphones className="w-5 h-5 text-[#08BDF4]" /> }
  ];

  const processSteps = [
    { title: t.partnerStep1Title, desc: t.partnerStep1Desc },
    { title: t.partnerStep2Title, desc: t.partnerStep2Desc },
    { title: t.partnerStep3Title, desc: t.partnerStep3Desc },
    { title: t.partnerStep4Title, desc: t.partnerStep4Desc }
  ];

  return (
    <section id="for-laundries" className="py-20 bg-[#F4FBFF]/40 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Showcase: Narrative on one side, real boutique laundry photo on the other */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          <div className="lg:col-span-6 flex flex-col items-start text-start">
            <div className="text-xs font-bold text-[#079FD0] uppercase tracking-wider mb-2">
              {language === 'ar' ? 'لأصحاب المغاسل الحرفية' : 'For Professional Laundries'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#183247] tracking-tight mb-4 leading-tight">
              {t.partnerHeading}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed mb-6">
              {t.partnerSubhead}
            </p>

            {/* Partner Benefits Checklist */}
            <div className="space-y-3.5 mb-8 w-full">
              {partnerBenefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                    {b.title}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onScrollToForm}
              className="px-7 py-3.5 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-[#08BDF4]/20 transition active:scale-98 cursor-pointer"
            >
              <span>{t.partnerCta}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Right: High-Fidelity Laundry Storefront & Interior Photography */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl aspect-[4/3] bg-slate-100 group">
              <img
                src="/src/assets/images/partner_laundry_shop_1792642991140.jpg"
                alt="مغسلة شريكة معتمدة ضمن شبكة عالسريع"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-102 transition duration-700"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute bottom-4 start-4 end-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-md text-start">
                <span className="text-xs font-bold text-[#183247] block mb-0.5">
                  {language === 'ar' ? 'شريك محلي موثوق ومجهّز' : 'Certified Local Partner Facility'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === 'ar'
                    ? 'نساعدك على استقبال طلبات رقمية منظمة بدون أي رسوم اشتراك مسبقة'
                    : 'Streamlined digital order intake with dedicated partner onboarding'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Partnership Journey Cards */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs">
          <h3 className="text-xl font-black text-[#183247] text-start mb-6">
            {t.partnerProcessTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
            {processSteps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F4FBFF]/40 border border-slate-100">
                <span className="text-xs font-black text-[#079FD0] mb-1.5 block">
                  {idx + 1}.
                </span>
                <h4 className="text-sm font-bold text-[#183247] mb-1.5 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-start text-xs text-slate-500">
            {language === 'ar'
              ? 'تنبيه: تقديم الاستمارة لا يُعد قبولاً تلقائياً أو تفعيلاً فورياً للحساب؛ يتم تفعيل الشراكة بعد استكمال المراجعة والاتفاق على معايير الجودة.'
              : 'Notice: Submitting the application does not grant immediate approval. Onboarding follows evaluation and commercial agreement.'}
          </div>
        </div>

      </div>
    </section>
  );
};
