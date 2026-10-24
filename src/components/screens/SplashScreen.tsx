import React, { useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { language, t, navigateTo } = useApp();

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('alasaree_onboarded');
    const timer = setTimeout(() => {
      if (hasSeenOnboarding) {
        navigateTo('main');
      } else {
        navigateTo('onboarding');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#EAF8FF] via-white to-white min-h-[580px] text-center select-none relative overflow-hidden">
      {/* Background soft ambient circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#08BDF4]/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#08BDF4]/10 blur-3xl pointer-events-none"></div>

      <div className="w-full flex justify-end">
        <span className="text-[11px] font-semibold tracking-wider text-[#079FD0] bg-[#EAF8FF] px-3 py-1 rounded-full">
          مصر 🇪🇬 Egypt
        </span>
      </div>

      {/* Main Brand Presentation */}
      <div className="flex flex-col items-center my-auto">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#08BDF4] to-[#079FD0] p-1 shadow-xl shadow-[#08BDF4]/25 flex items-center justify-center mb-6 relative">
          <div className="w-full h-full bg-white rounded-[22px] flex flex-col items-center justify-center p-2">
            <span className="text-3xl font-black text-[#08BDF4] tracking-tighter">
              عالسريع
            </span>
            <span className="text-[9px] font-extrabold text-[#183247] uppercase tracking-widest -mt-1">
              Ala El Saree
            </span>
          </div>
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#08BDF4] text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        <h1 className="text-3xl font-black text-[#183247] tracking-tight mb-2">
          {language === 'ar' ? 'عالسريع' : 'Ala El Saree'}
        </h1>
        <p className="text-base font-bold text-[#079FD0] mb-3">
          {t.tagline}
        </p>
        <p className="text-xs text-[#718596] max-w-xs leading-relaxed">
          {t.subTagline}
        </p>
      </div>

      {/* Loading bar & Skip button for instant preview */}
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-36 h-1.5 bg-[#E5EEF4] rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#08BDF4] rounded-full animate-pulse"></div>
        </div>

        <button
          onClick={() => navigateTo('onboarding')}
          className="text-xs font-semibold text-[#079FD0] hover:text-[#183247] flex items-center gap-1 transition cursor-pointer"
        >
          <span>{t.startNow}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
