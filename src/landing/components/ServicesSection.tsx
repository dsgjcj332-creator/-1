import React from 'react';
import { Shirt, Sparkles, Wind, Layers, Bed, SlidersHorizontal, Info } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';

interface ServicesSectionProps {
  t: LandingTranslation;
  language: Language;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ t, language }) => {
  const services = [
    {
      id: 'wash_iron',
      title: t.service1Title,
      desc: t.service1Desc,
      icon: <Shirt className="w-5 h-5 text-[#08BDF4]" />,
      featured: false
    },
    {
      id: 'iron_only',
      title: t.service2Title,
      desc: t.service2Desc,
      icon: <Wind className="w-5 h-5 text-[#08BDF4]" />,
      featured: false
    },
    {
      id: 'wash_only',
      title: t.service3Title,
      desc: t.service3Desc,
      icon: <Layers className="w-5 h-5 text-[#08BDF4]" />,
      featured: false
    },
    {
      id: 'dry_clean',
      title: t.service4Title,
      desc: t.service4Desc,
      icon: <Sparkles className="w-5 h-5 text-[#08BDF4]" />,
      image: '/src/assets/images/service_dry_clean_1792642989493.jpg',
      featured: true
    },
    {
      id: 'linens',
      title: t.service5Title,
      desc: t.service5Desc,
      icon: <Bed className="w-5 h-5 text-[#08BDF4]" />,
      image: '/src/assets/images/service_folded_linens_1792642990805.jpg',
      featured: true
    },
    {
      id: 'custom',
      title: t.service6Title,
      desc: t.service6Desc,
      icon: <SlidersHorizontal className="w-5 h-5 text-[#08BDF4]" />,
      featured: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-[#F4FBFF]/40 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold text-[#079FD0] uppercase tracking-wider mb-2">
            {language === 'ar' ? 'باقة متكاملة' : 'Full Spectrum Care'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#183247] tracking-tight mb-4">
            {t.servicesHeading}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {t.servicesSubhead}
          </p>
        </div>

        {/* Services Grid (6 cards, with 2 featured cards with photography) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group text-start"
            >
              {/* Optional High-Fidelity Image for Dry Clean & Linens */}
              {service.image ? (
                <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 end-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#08BDF4] shadow-xs">
                    {service.icon}
                  </div>
                </div>
              ) : null}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {!service.image && (
                    <div className="w-10 h-10 rounded-2xl bg-[#F4FBFF] border border-[#E5EEF4] flex items-center justify-center mb-4 group-hover:bg-[#08BDF4] group-hover:text-white transition-colors text-[#08BDF4]">
                      {service.icon}
                    </div>
                  )}

                  <h3 className="text-base font-black text-[#183247] mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>{language === 'ar' ? 'حسب الشريك' : 'Partner specific'}</span>
                  <span className="text-[#079FD0] font-black">عالسريع</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Service Availability Notice */}
        <div className="max-w-2xl mx-auto text-center p-3 rounded-2xl bg-white border border-slate-200/70 text-xs text-slate-500 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#08BDF4] shrink-0" />
          <span>{t.serviceAvailabilityNote}</span>
        </div>

      </div>
    </section>
  );
};
