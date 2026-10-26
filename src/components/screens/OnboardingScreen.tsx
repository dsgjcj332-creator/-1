import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Globe, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import imgPickupDelivery from '../../assets/images/onboarding_pickup_delivery_1792558853277.jpg';
import imgGarmentCare from '../../assets/images/onboarding_garment_care_1792558853769.jpg';
import imgTrackingOrder from '../../assets/images/onboarding_tracking_order_1792558853889.jpg';

export const OnboardingScreen: React.FC = () => {
  const { language, setLanguage, t, navigateTo } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: t.onboardTitle1,
      desc: t.onboardDesc1,
      image: imgPickupDelivery,
      badgeAr: 'استلام وتوصيل مجاني',
      badgeEn: 'Doorstep Pickup & Delivery'
    },
    {
      title: t.onboardTitle2,
      desc: t.onboardDesc2,
      image: imgGarmentCare,
      badgeAr: 'غسيل • مكواة بخار • دراي كلين',
      badgeEn: 'Wash • Steam Iron • Dry Clean'
    },
    {
      title: t.onboardTitle3,
      desc: t.onboardDesc3,
      image: imgTrackingOrder,
      badgeAr: 'تتبع خطوة بخطوة',
      badgeEn: 'Real-Time Order Tracking'
    }
  ];

  const handleFinishOnboarding = () => {
    localStorage.setItem('alasaree_onboarded', 'true');
    navigateTo('auth_welcome');
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleFinishOnboarding();
    }
  };

  const isLast = currentSlide === slides.length - 1;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white select-none">
      {/* Top Header: Language switch & Skip */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#EAF8FF] hover:bg-[#08BDF4]/20 rounded-full text-xs font-semibold text-[#079FD0] transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>

        {!isLast && (
          <button
            onClick={handleFinishOnboarding}
            className="text-xs font-semibold text-[#718596] hover:text-[#183247] transition cursor-pointer px-2 py-1"
          >
            {t.skip}
          </button>
        )}
      </div>

      {/* Main Slide Card */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        {/* Visual Slot */}
        <div className="w-full aspect-4/3 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 mb-6 relative border border-[#E5EEF4] bg-[#F4FBFF]">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#079FD0] shadow-sm">
            {language === 'ar' ? slides[currentSlide].badgeAr : slides[currentSlide].badgeEn}
          </span>
        </div>

        {/* Text Area */}
        <div className="text-center px-2">
          <h2 className="text-2xl font-black text-[#183247] mb-2 tracking-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-sm text-[#718596] leading-relaxed max-w-xs mx-auto">
            {slides[currentSlide].desc}
          </p>
        </div>
      </div>

      {/* Footer Controls: Dots and Action CTA */}
      <div className="w-full flex flex-col items-center gap-6 pb-2">
        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-[#08BDF4]' : 'w-2 bg-[#E5EEF4]'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Primary CTA button */}
        <button
          onClick={handleNext}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>{isLast ? t.startNow : t.next}</span>
          {language === 'ar' ? (
            <ArrowLeft className="w-5 h-5" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
