import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';

interface FaqSectionProps {
  t: LandingTranslation;
  language: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ t, language }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
    { q: t.faqQ6, a: t.faqA6 },
    { q: t.faqQ7, a: t.faqA7 },
    { q: t.faqQ8, a: t.faqA8 },
    { q: t.faqQ9, a: t.faqA9 }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#079FD0] uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4 text-[#08BDF4]" />
            <span>{language === 'ar' ? 'إجابات واضحة' : 'Answers & Clarity'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#183247] tracking-tight mb-3">
            {t.faqHeading}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.faqSubhead}
          </p>
        </div>

        {/* Accessible Accordion List */}
        <div className="space-y-3 text-start">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden bg-[#F4FBFF]/30 transition-all hover:border-[#08BDF4]/40"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start font-bold text-xs sm:text-sm text-[#183247] hover:text-[#079FD0] transition cursor-pointer"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#EAF8FF] text-[#079FD0] border-[#08BDF4]' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/60 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
