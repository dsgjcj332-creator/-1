import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ChevronDown,
  RotateCcw,
  Bike,
  X,
  Check,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../data/mockData';
import { ServiceType } from '../../types';
import heroBannerImg from '../../assets/images/ala_elsaree_hero_banner_1792558853330.jpg';
import imgGarmentCare from '../../assets/images/onboarding_garment_care_1792558853769.jpg';
import imgTrackingOrder from '../../assets/images/onboarding_tracking_order_1792558853889.jpg';

export const HomeScreen: React.FC = () => {
  const {
    language,
    t,
    user,
    selectedCity,
    setSelectedCity,
    navigateTo,
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    reorder,
    unreadNotifsCount,
    setTab
  } = useApp();

  const [showCitySheet, setShowCitySheet] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const currentCityObj = CITIES.find(c => c.id === selectedCity) || CITIES[0];
  const firstName = user?.name && user.name !== 'زائر'
    ? user.name.split(' ')[0]
    : (language === 'ar' ? 'يا بطل' : 'Friend');

  // Most recent completed order for 1-tap reorder
  const recentCompletedOrder = orders.find(o => o.status === 'delivered');

  // Multi-slide promotional banners
  const banners = [
    {
      id: 1,
      image: heroBannerImg,
      tagAr: 'عرض خاص للأسبوع الأول',
      tagEn: 'Weekly Special Offer',
      titleAr: 'غسيلك جاهز.. من غير ما تتحرك',
      titleEn: 'Crisp Laundry at Your Doorstep',
      descAr: 'احجز استلام ملابسك وخلي الباقي علينا',
      descEn: 'Book pickup & leave the rest to us',
      ctaAr: 'اطلب غسيلك',
      ctaEn: 'Order Now'
    },
    {
      id: 2,
      image: imgGarmentCare,
      tagAr: 'كوبون ترحيبي جديد',
      tagEn: 'Welcome Promo Code',
      titleAr: 'خصم 20% بكود SAREE20',
      titleEn: '20% Off With Code SAREE20',
      descAr: 'على غسيل وكي ملابسك مع أرقى عطور العود',
      descEn: 'On wash, iron & dry clean with royal fragrances',
      ctaAr: 'استخدم الكود',
      ctaEn: 'Apply Code'
    },
    {
      id: 3,
      image: imgTrackingOrder,
      tagAr: 'الخدمة الفورية',
      tagEn: 'Express Laundry',
      titleAr: 'خدمة سريعة خلال 6 ساعات',
      titleEn: '6-Hour Express Delivery',
      descAr: 'استلام وكي فوري وتسليم لباب بيتك',
      descEn: 'Express pickup, press, and doorstep delivery',
      ctaAr: 'طلب مستعجل',
      ctaEn: 'Express Wash'
    }
  ];

  // Auto-switch carousel banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const quickServices: {
    type: ServiceType;
    titleAr: string;
    titleEn: string;
    icon: string;
    color: string;
    bg: string;
  }[] = [
    {
      type: 'wash_iron',
      titleAr: 'غسيل وكي',
      titleEn: 'Wash & Iron',
      icon: '✨',
      color: 'text-[#079FD0]',
      bg: 'bg-[#EAF8FF]'
    },
    {
      type: 'wash_only',
      titleAr: 'غسيل فقط',
      titleEn: 'Wash Only',
      icon: '🫧',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      type: 'iron_only',
      titleAr: 'كي بالبخار',
      titleEn: 'Steam Iron',
      icon: '👔',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      type: 'dry_clean',
      titleAr: 'دراي كلين',
      titleEn: 'Dry Clean',
      icon: '🧥',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  const handleQuickServiceClick = (_type: ServiceType) => {
    navigateTo('partner_select');
  };

  return (
    <div className="flex-1 flex flex-col pb-12 select-none">
      {/* ============================================================== */}
      {/* 1. MINIMALIST CLEAN HEADER (عالسريع + مكان الطلب فقط)          */}
      {/* ============================================================== */}
      <header className="bg-white border-b border-[#E5EEF4] px-4 py-3 sticky top-0 z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
        {/* Brand Name: عالسريع */}
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-black text-[#08BDF4] tracking-tight">
            عالسريع
          </span>
          <span className="w-2 h-2 rounded-full bg-[#08BDF4]"></span>
        </div>

        {/* Location Selector (المكان اللي هيطلب منو) + Notifications Bell */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCitySheet(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4FBFF] hover:bg-[#EAF8FF] border border-[#E5EEF4] hover:border-[#08BDF4] rounded-xl text-xs font-bold text-[#079FD0] transition cursor-pointer active:scale-95 shadow-2xs"
            title="تغيير المكان / Select Location"
          >
            <MapPin className="w-3.5 h-3.5 text-[#08BDF4]" />
            <span className="max-w-[120px] truncate">
              {language === 'ar' ? currentCityObj.nameAr : currentCityObj.nameEn}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#718596]" />
          </button>

          <button
            onClick={() => navigateTo('notifications')}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-[#E5EEF4] flex items-center justify-center text-[#183247] relative active:scale-95 transition cursor-pointer shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#183247]" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#08BDF4] ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. GREETING (أهلاً بك) UNDER THE HEADER                        */}
      {/* ============================================================== */}
      <div className="px-4 pt-4 pb-1">
        <h1 className="text-xl font-black text-[#183247] tracking-tight">
          {language === 'ar' ? `أهلاً بك، ${firstName} 👋` : `Hello, ${firstName} 👋`}
        </h1>
        <p className="text-xs text-[#718596] mt-0.5">
          {language === 'ar' ? 'جاهز لغسيل ملابسك وعنايتها اليوم؟' : 'Ready to freshen your garments today?'}
        </p>
      </div>

      {/* ============================================================== */}
      {/* 3. SWIPEABLE BANNER CAROUSEL (شاشة بتتنقل)                     */}
      {/* ============================================================== */}
      <div className="px-4 pt-2 flex flex-col gap-2">
        <div className="w-full rounded-3xl overflow-hidden relative shadow-sm border border-[#E5EEF4] bg-white">
          <div className="w-full aspect-16/9 relative overflow-hidden">
            <img
              src={banners[currentBannerIndex].image}
              alt={banners[currentBannerIndex].titleAr}
              className="w-full h-full object-cover transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"></div>
            
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#08BDF4] mb-0.5">
                {language === 'ar' ? banners[currentBannerIndex].tagAr : banners[currentBannerIndex].tagEn}
              </span>
              <h2 className="text-lg font-black leading-tight text-white mb-1.5">
                {language === 'ar' ? banners[currentBannerIndex].titleAr : banners[currentBannerIndex].titleEn}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-white/90 font-medium max-w-[200px] truncate">
                  {language === 'ar' ? banners[currentBannerIndex].descAr : banners[currentBannerIndex].descEn}
                </p>
                <button
                  onClick={() => navigateTo('partner_select')}
                  className="px-3.5 py-1.5 bg-[#08BDF4] hover:bg-[#079FD0] text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  {language === 'ar' ? banners[currentBannerIndex].ctaAr : banners[currentBannerIndex].ctaEn}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Dots Indicator */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBannerIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentBannerIndex === idx ? 'w-6 bg-[#08BDF4]' : 'w-2 bg-[#E5EEF4]'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. ACTIVE ORDER SNIPPET (If active order exists)               */}
      {/* ============================================================== */}
      {activeTrackingOrder && activeTrackingOrder.status !== 'delivered' && activeTrackingOrder.status !== 'cancelled' && (
        <div className="px-4 pt-2">
          <div
            onClick={() => {
              setActiveTrackingOrder(activeTrackingOrder);
              navigateTo('order_tracking');
            }}
            className="w-full p-3.5 bg-white rounded-3xl border border-[#08BDF4]/40 shadow-sm cursor-pointer hover:border-[#08BDF4] transition relative"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black text-[#183247]">
                {t[`status_${activeTrackingOrder.status}` as keyof typeof t] || activeTrackingOrder.status}
              </p>
              <span className="text-[10px] font-bold text-[#079FD0] bg-[#EAF8FF] px-2 py-0.5 rounded-lg border border-[#08BDF4]/30">
                #{activeTrackingOrder.referenceNumber}
              </span>
            </div>

            <div className="w-full bg-[#EAF8FF] h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-[#08BDF4] h-full rounded-full transition-all duration-500"
                style={{
                  width:
                    activeTrackingOrder.status === 'order_received'
                      ? '15%'
                      : activeTrackingOrder.status === 'order_confirmed'
                      ? '30%'
                      : activeTrackingOrder.status === 'courier_to_pickup'
                      ? '45%'
                      : activeTrackingOrder.status === 'clothes_collected'
                      ? '60%'
                      : activeTrackingOrder.status === 'at_laundry'
                      ? '75%'
                      : '90%'
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#718596]">
              <div className="flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-[#079FD0]" />
                <span className="font-medium">كابتن محمود الشريف</span>
              </div>
              <span className="text-[#079FD0] font-bold text-xs">
                {t.viewDetails} {language === 'ar' ? '←' : '→'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. خدماتنا السريعة (QUICK SERVICES)                           */}
      {/* ============================================================== */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-black text-[#183247] tracking-tight">
            {t.quickServicesTitle}
          </h3>
          <button
            onClick={() => setTab('services')}
            className="text-xs font-bold text-[#079FD0] hover:underline cursor-pointer"
          >
            {language === 'ar' ? 'عرض الكل' : 'View all'}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {quickServices.map(service => (
            <button
              key={service.type}
              onClick={() => handleQuickServiceClick(service.type)}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-[#E5EEF4] hover:border-[#08BDF4] transition shadow-2xs cursor-pointer group active:scale-95"
            >
              <div className={`w-10 h-10 rounded-xl ${service.bg} flex items-center justify-center text-xl mb-1 group-hover:scale-105 transition`}>
                {service.icon}
              </div>
              <span className="text-[11px] font-bold text-[#183247] text-center leading-tight">
                {language === 'ar' ? service.titleAr : service.titleEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. كرر طلبك الأخير بضغطة واحدة (REORDER PREVIOUS ORDER)        */}
      {/* ============================================================== */}
      {recentCompletedOrder && (
        <div className="px-4 pt-4">
          <div className="p-3.5 bg-gradient-to-r from-[#EAF8FF] to-white rounded-2xl border border-[#08BDF4]/30 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-[#079FD0] flex items-center justify-center shadow-xs">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#183247]">
                  {language === 'ar' ? 'كرر طلبك الأخير بضغطة واحدة' : 'Repeat your previous order'}
                </p>
                <p className="text-[11px] text-[#718596]">
                  {recentCompletedOrder.items.length} قطع · {recentCompletedOrder.finalTotal} {t.currency}
                </p>
              </div>
            </div>

            <button
              onClick={() => reorder(recentCompletedOrder)}
              className="px-3 py-1.5 bg-[#08BDF4] hover:bg-[#079FD0] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {language === 'ar' ? 'اطلب نفس الطلب' : 'Reorder'}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. CITY SELECTION BOTTOM SHEET / MODAL                        */}
      {/* ============================================================== */}
      {showCitySheet && (
        <div
          onClick={() => setShowCitySheet(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full bg-white rounded-t-3xl max-h-[82%] overflow-y-auto p-5 shadow-2xl flex flex-col no-scrollbar border-t border-slate-100 animate-in slide-in-from-bottom duration-250"
          >
            <div className="w-12 h-1 bg-[#CBD5E1] rounded-full mx-auto mb-3"></div>

            <div className="flex items-center justify-between pb-3 border-b border-[#E5EEF4] mb-4">
              <div>
                <h3 className="text-sm font-black text-[#183247]">
                  {language === 'ar' ? 'اختر مدينة التوصيل' : 'Select Delivery City'}
                </h3>
                <p className="text-xs text-[#718596]">
                  {language === 'ar' ? 'المناطق والمدن المغطاة بالخدمة في مصر' : 'Active coverage zones in Egypt'}
                </p>
              </div>
              <button
                onClick={() => setShowCitySheet(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {CITIES.map(city => {
                const isSelected = selectedCity === city.id;
                return (
                  <div
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city.id);
                      setShowCitySheet(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#08BDF4] bg-[#EAF8FF] ring-2 ring-[#08BDF4]/20'
                        : 'border-[#E5EEF4] bg-white hover:border-[#08BDF4]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                        isSelected ? 'bg-[#08BDF4] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-[#183247]">
                            {language === 'ar' ? city.nameAr : city.nameEn}
                          </h4>
                          <span className="text-[10px] font-bold text-[#18A875] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {language === 'ar' ? 'خدمة مفعلة 🟢' : 'Active 🟢'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#718596] mt-0.5">
                          {language === 'ar' ? city.governorateAr : city.governorateEn} · {city.neighborhoods.slice(0, 3).map(n => n.ar).join('، ')}
                        </p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#08BDF4] bg-[#08BDF4] text-white' : 'border-[#E5EEF4]'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
