import React from 'react';
import { ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { Language } from '../data/translations';

interface HowItWorksSectionProps {
  t: any;
  language: Language;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ language }) => {
  const isRtl = language === 'ar';

  const steps = [
    {
      num: '1',
      icon: <ShoppingBag className="w-7 h-7 text-[#08BDF4]" />,
      title: isRtl ? 'اختار خدمتك' : 'Choose Your Service',
      desc: isRtl
        ? 'اختار نوع الغسيل، الكي بالبخار، أو الدراي كلين. وحدد تفاصيل كل قطعة زي الرائحة والتغليف.'
        : 'Choose wash, steam iron, or dry-clean. Customize per garment including scent and packaging.',
    },
    {
      num: '2',
      icon: <CreditCard className="w-7 h-7 text-[#08BDF4]" />,
      title: isRtl ? 'ادفع بالطريقة اللي تريحك' : 'Pay Your Way',
      desc: isRtl
        ? 'فلوس كاش لحد الباب، فودافون كاش، أو إنستاباي — كلها بنفس السعر وبدون مفاجآت.'
        : 'Cash on delivery, Vodafone Cash, or Instapay — always the same price, no surprises.',
    },
    {
      num: '3',
      icon: <Truck className="w-7 h-7 text-[#08BDF4]" />,
      title: isRtl ? 'تابع وخد' : 'Track & Receive',
      desc: isRtl
        ? 'تابع حالة غسيلك لحظة بلحظة، وانتظر المندوب يوصل ملابسك على بابك نظيفة وجاهزة.'
        : 'Follow your order live on the map, and wait for the driver to deliver clean clothes to your door.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0B1F2E] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#08BDF4]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-[#08BDF4] text-xs font-bold uppercase tracking-widest mb-3">
            {isRtl ? 'ثلات خطوات بس' : 'Just 3 steps'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            {isRtl ? 'بتطلب ازاي؟' : 'How to Order?'}
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            {isRtl
              ? 'من غير تعقيد ومن غير دوشة — عالسريع جاهز يأخد منك الجهد ده كله.'
              : 'No hassle, no complexity — we handle everything for you.'}
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.666%+24px)] right-[calc(16.666%+24px)] h-px bg-gradient-to-r from-[#08BDF4]/40 via-[#08BDF4]/20 to-[#08BDF4]/40" />

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white/5 border border-white/10 rounded-3xl p-8 text-start hover:border-[#08BDF4]/40 hover:bg-white/8 transition-all group"
            >
              {/* Step number bubble */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#08BDF4]/15 border border-[#08BDF4]/30 flex items-center justify-center group-hover:bg-[#08BDF4]/25 transition-colors">
                  {step.icon}
                </div>
                <span className="text-5xl font-black text-white/10 group-hover:text-[#08BDF4]/20 transition-colors tabular-nums">
                  {step.num}
                </span>
              </div>

              <h3 className="text-xl font-black text-white mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.desc}
              </p>

              {idx < steps.length - 1 && (
                <div className="md:hidden mt-6 flex justify-center">
                  <div className="w-px h-6 bg-[#08BDF4]/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
