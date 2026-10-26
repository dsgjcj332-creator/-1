import React from 'react';
import { Eye, Map, HeartHandshake, Award } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';

interface TrustSectionProps {
  t: LandingTranslation;
  language: Language;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ t, language }) => {
  const principles = [
    {
      title: t.trustPrinciple1Title,
      desc: t.trustPrinciple1Desc,
      icon: <Eye className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      title: t.trustPrinciple2Title,
      desc: t.trustPrinciple2Desc,
      icon: <Map className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      title: t.trustPrinciple3Title,
      desc: t.trustPrinciple3Desc,
      icon: <HeartHandshake className="w-5 h-5 text-[#08BDF4]" />
    },
    {
      title: t.trustPrinciple4Title,
      desc: t.trustPrinciple4Desc,
      icon: <Award className="w-5 h-5 text-[#08BDF4]" />
    }
  ];

  return (
    <section className="py-20 bg-[#F4FBFF]/40 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold text-[#079FD0] uppercase tracking-wider mb-2">
            {language === 'ar' ? 'الشفافية أولاً' : 'Honesty & Transparency'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#183247] tracking-tight mb-3">
            {t.trustHeading}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {t.trustSubhead}
          </p>
        </div>

        {/* 4 Trust Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
          {principles.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#EAF8FF] flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="text-base font-black text-[#183247] mb-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
