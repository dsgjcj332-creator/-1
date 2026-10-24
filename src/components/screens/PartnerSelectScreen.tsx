import React, { useState } from 'react';
import {
  Star,
  Clock,
  Bike,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LAUNDRY_PARTNERS } from '../../data/mockData';
import { LaundryPartner } from '../../types';

export const PartnerSelectScreen: React.FC = () => {
  const {
    language,
    t,
    selectedCity,
    selectedPartner,
    setSelectedPartner,
    partners,
    navigateTo,
    cartSubtotal,
    showToast
  } = useApp();

  // Filter partners by selected city or show all
  const partnersList = partners && partners.length > 0 ? partners : LAUNDRY_PARTNERS;
  const cityPartners = partnersList.filter(
    p => p.city === selectedCity || partnersList.length <= 2
  );
  const partnersToShow = cityPartners.length > 0 ? cityPartners : partnersList;

  const [activePartnerId, setActivePartnerId] = useState<string>(
    selectedPartner?.id || partnersToShow[0]?.id || 'm-zag-01'
  );

  const handleSelect = (partner: LaundryPartner) => {
    setActivePartnerId(partner.id);
    setSelectedPartner(partner);
  };

  const handleContinue = () => {
    const chosen = partnersToShow.find(p => p.id === activePartnerId) || partnersToShow[0];
    if (cartSubtotal < chosen.minOrderAmount) {
      showToast(
        language === 'ar'
          ? `الحد الأدنى لطلب هذه المغسلة هو ${chosen.minOrderAmount} ج.م`
          : `Minimum order for this partner is ${chosen.minOrderAmount} EGP`
      );
      return;
    }
    setSelectedPartner(chosen);
    navigateTo('pickup_schedule');
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 select-none">
      <div className="mb-4">
        <h2 className="text-xl font-black text-[#183247] mb-1">
          {language === 'ar' ? 'اختر المغسلة المعتمدة' : 'Select Certified Laundry'}
        </h2>
        <p className="text-xs text-[#718596]">
          {language === 'ar'
            ? 'شركاؤنا معتمدون ومجهزون بأحدث مغاسل البخار والتعقيم الفندقي'
            : 'All partners are hotel-grade certified with modern steam equipment'}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {partnersToShow.map(partner => {
          const isSelected = activePartnerId === partner.id;

          return (
            <div
              key={partner.id}
              onClick={() => handleSelect(partner)}
              className={`p-4 bg-white rounded-2xl border transition shadow-2xs cursor-pointer flex flex-col gap-3 ${
                isSelected
                  ? 'border-[#08BDF4] ring-2 ring-[#08BDF4]/20'
                  : 'border-[#E5EEF4] hover:border-[#08BDF4]/50'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#183247]">
                      {language === 'ar' ? partner.nameAr : partner.nameEn}
                    </h3>
                    {partner.badgeAr && (
                      <span className="text-[10px] font-bold text-[#079FD0] bg-[#EAF8FF] px-2 py-0.5 rounded-full">
                        {language === 'ar' ? partner.badgeAr : partner.badgeEn}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#718596] mt-0.5">
                    {language === 'ar' ? partner.neighborhoodAr : partner.neighborhoodEn}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="text-xs font-black text-amber-800">{partner.rating}</span>
                  <span className="text-[10px] text-amber-600 font-semibold">({partner.ratingCount})</span>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E5EEF4] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#718596] block">
                    {language === 'ar' ? 'وقت الإنجاز' : 'Turnaround'}
                  </span>
                  <span className="font-bold text-[#183247]">
                    {partner.estimatedHours} {language === 'ar' ? 'ساعة' : 'hrs'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#718596] block">
                    {language === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}
                  </span>
                  <span className="font-bold text-[#079FD0]">
                    {partner.deliveryFee} {t.currency}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#718596] block">
                    {language === 'ar' ? 'الحد الأدنى' : 'Min Order'}
                  </span>
                  <span className="font-bold text-[#183247]">
                    {partner.minOrderAmount} {t.currency}
                  </span>
                </div>
              </div>

              {/* Express availability tag */}
              <div className="flex items-center justify-between text-xs">
                {partner.expressAvailable ? (
                  <span className="text-[11px] font-semibold text-[#18A875] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-[#18A875]" />
                    {language === 'ar'
                      ? `خدمة سريعة متاحة خلال ${partner.expressHours} ساعات`
                      : `Express ready in ${partner.expressHours} hrs`}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#718596]">
                    {language === 'ar' ? 'الخدمة العادية خلال 24 ساعة' : 'Standard 24h service'}
                  </span>
                )}

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-[#08BDF4] bg-[#08BDF4] text-white' : 'border-[#E5EEF4]'
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Action */}
      <div
        className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5EEF4] p-3 shadow-lg w-full mt-auto"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
      >
        <button
          onClick={handleContinue}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>{language === 'ar' ? 'متابعة إلى تحديد موعد الاستلام' : 'Continue to Pickup Schedule'}</span>
          {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
