import React from 'react';
import { Star, MapPin, ShieldCheck, Smartphone } from 'lucide-react';
import { Language } from '../data/translations';

interface TrustSectionProps {
  t: any;
  language: Language;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ language }) => {
  const isRtl = language === 'ar';

  const features = [
    {
      icon: <Star className="w-5 h-5 text-[#08BDF4]" />,
      title: isRtl ? 'تقييم حقيقي من عملاء حقيقيين' : 'Real ratings from real customers',
      desc: isRtl
        ? 'كل تقييم بيتحسب بعد كل طلب — مفيش تقييمات مزيفة ومفيش عملاء وهميين.'
        : 'Every rating is earned after each order — no fake reviews, no bots.',
      bg: 'bg-[#EAF8FF]'
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#08BDF4]" />,
      title: isRtl ? 'بس في مصر، وبنكبر بحرص' : 'Egypt-only, growing carefully',
      desc: isRtl
        ? 'بدأنا بالزقازيق والمنصورة وبنتوسع بخطوات واضحة — مش بنوعد بحاجة قبل ما نقدر نوفرها.'
        : 'Started with Zagazig and Mansoura, expanding step by step — we don\'t promise what we can\'t deliver.',
      bg: 'bg-emerald-50'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#08BDF4]" />,
      title: isRtl ? 'شراكة مش مجرد تطبيق' : 'Partnership, not just an app',
      desc: isRtl
        ? 'أي مغسلة بتنضم بتعدي معيار اختيار حقيقي — مش بنقبل أي حد بدون معاينة ومتابعة مستمرة.'
        : 'Every laundry partner goes through real vetting — no random sign-ups, we follow up continuously.',
      bg: 'bg-purple-50'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#08BDF4]" />,
      title: isRtl ? 'بتدفع بالطريقة اللي تريحك' : 'Pay however you like',
      desc: isRtl
        ? 'كاش، فودافون كاش، إنستاباي — كلهم بنفس السعر من غير رسوم إضافية أو مفاجآت.'
        : 'Cash, Vodafone Cash, Instapay — all at the same price with no hidden fees.',
      bg: 'bg-amber-50'
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Two-column: text left, features right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: heading */}
          <div>
            <div className="text-[#08BDF4] text-xs font-bold uppercase tracking-widest mb-3">
              {isRtl ? 'مختلفين عن غيرنا' : 'What sets us apart'}
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0B1F2E] leading-tight mb-5">
              {isRtl ? 'إيه اللي\nبيميزنا؟' : 'What makes\nus different?'}
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              {isRtl
                ? 'مش بس تطبيق توصيل — عالسريع منظومة كاملة بتهتم بكل تفصيلة من ملابسك من لما بتطلب لحد ما بتستلمها.'
                : 'Not just a delivery app — a complete system that cares about every detail from order to delivery.'}
            </p>

            {/* Center image decorative block */}
            <div className="relative rounded-3xl overflow-hidden bg-[#0B1F2E] h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#08BDF4]/20 to-transparent" />
              <div className="text-center z-10">
                <div className="text-5xl font-black text-[#08BDF4] leading-none">ع</div>
                <div className="text-white font-black text-xl mt-1">عالسريع</div>
                <div className="text-slate-400 text-xs mt-1">Ala El Saree</div>
              </div>
            </div>
          </div>

          {/* Right: feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:border-[#08BDF4]/30 hover:bg-[#EAF8FF]/40 transition-all group text-start"
              >
                <div className={`w-11 h-11 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-black text-[#0B1F2E] mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
