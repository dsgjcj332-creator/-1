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
    selectedPartner?.id || partnersToShow[0]?.id || ''
  );

  const handleSelect = (partner: LaundryPartner) => {
    setActivePartnerId(partner.id);
    setSelectedPartner(partner);
  };

  const [refreshTick, setRefreshTick] = useState(0);

  React.useEffect(() => {
    const handleSettingsUpdated = () => setRefreshTick(t => t + 1);
    window.addEventListener('ala_el_saree_merchant_settings_updated', handleSettingsUpdated);
    return () => window.removeEventListener('ala_el_saree_merchant_settings_updated', handleSettingsUpdated);
  }, []);

  const getPartnerLiveSettings = (partner: LaundryPartner) => {
    try {
      const raw = localStorage.getItem(`ala_el_saree_merchant_settings_${partner.id}`);
      if (raw) {
        const s = JSON.parse(raw);
        return {
          estimatedHours: s.estimatedHours ?? partner.estimatedHours,
          deliveryFee: s.deliveryFee ?? partner.deliveryFee,
          minOrderAmount: s.minOrderAmount ?? partner.minOrderAmount,
          expressAvailable: s.expressAvailable !== undefined ? s.expressAvailable : partner.expressAvailable,
          expressHours: s.expressHours ?? partner.expressHours
        };
      }
    } catch {}
    return {
      estimatedHours: partner.estimatedHours,
      deliveryFee: partner.deliveryFee,
      minOrderAmount: partner.minOrderAmount,
      expressAvailable: partner.expressAvailable,
      expressHours: partner.expressHours
    };
  };

  const getPartnerPreviewPrices = (partnerId: string) => {
    try {
      const raw = localStorage.getItem(`ala_el_saree_merchant_catalog_${partnerId}`);
      if (raw) {
        const catalog = JSON.parse(raw);
        const tshirt = catalog.find((c: any) => c.id === 'g-tshirt');
        const shirt = catalog.find((c: any) => c.id === 'g-shirt');
        const suit = catalog.find((c: any) => c.id === 'g-suit-2pc');
        return {
          tshirt: tshirt?.priceWashIron ?? 25,
          shirt: shirt?.priceWashIron ?? 30,
          suit: suit?.priceWashIron ?? 110,
        };
      }
    } catch {
      // fallback
    }
    return { tshirt: 25, shirt: 30, suit: 110 };
  };

  const handleContinue = () => {
    const chosen = partnersToShow.find(p => p.id === activePartnerId) || partnersToShow[0];
    if (!chosen) {
      showToast(language === 'ar' ? 'برجاء اختيار مغسلة للمتابعة' : 'Please select a laundry to continue');
      return;
    }
    setSelectedPartner(chosen);
    navigateTo('garment_select');
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
          const live = getPartnerLiveSettings(partner);

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
                    {live.estimatedHours} {language === 'ar' ? 'ساعة' : 'hrs'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#718596] block">
                    {language === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}
                  </span>
                  <span className="font-bold text-[#079FD0]">
                    {live.deliveryFee} {t.currency}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#718596] block">
                    {language === 'ar' ? 'الحد الأدنى' : 'Min Order'}
                  </span>
                  <span className="font-bold text-[#183247]">
                    {live.minOrderAmount} {t.currency}
                  </span>
                </div>
              </div>

              {/* Sample Prices Preview */}
              {(() => {
                const samplePrices = getPartnerPreviewPrices(partner.id);
                return (
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap text-[11px]">
                    <span className="text-[10px] font-bold text-[#183247]">
                      {language === 'ar' ? 'عيّنة أسعار الغسيل والكي:' : 'Sample Wash & Iron:'}
                    </span>
                    <span className="bg-[#F4FBFF] px-2 py-0.5 rounded-lg border border-[#E5EEF4] text-[#718596]">
                      {language === 'ar' ? 'تيشيرت:' : 'T-shirt:'}{' '}
                      <b className="text-[#079FD0]">{samplePrices.tshirt} {t.currency}</b>
                    </span>
                    <span className="bg-[#F4FBFF] px-2 py-0.5 rounded-lg border border-[#E5EEF4] text-[#718596]">
                      {language === 'ar' ? 'قميص:' : 'Shirt:'}{' '}
                      <b className="text-[#079FD0]">{samplePrices.shirt} {t.currency}</b>
                    </span>
                    <span className="bg-[#F4FBFF] px-2 py-0.5 rounded-lg border border-[#E5EEF4] text-[#718596]">
                      {language === 'ar' ? 'بدلة:' : 'Suit:'}{' '}
                      <b className="text-[#079FD0]">{samplePrices.suit} {t.currency}</b>
                    </span>
                  </div>
                );
              })()}

              {/* Express availability tag */}
              <div className="flex items-center justify-between text-xs pt-1">
                {live.expressAvailable ? (
                  <span className="text-[11px] font-semibold text-[#18A875] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-[#18A875]" />
                    {language === 'ar'
                      ? `خدمة سريعة متاحة خلال ${live.expressHours} ساعات`
                      : `Express ready in ${live.expressHours} hrs`}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#718596]">
                    {language === 'ar' ? `الخدمة العادية خلال ${live.estimatedHours} ساعة` : `Standard ${live.estimatedHours}h service`}
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

        {partnersToShow.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E5EEF4]">
            <p className="text-sm font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'لا توجد مغاسل معتمدة في منطقتك حالياً' : 'No certified laundries available in your area'}
            </p>
            <p className="text-xs text-[#718596]">
              {language === 'ar' ? 'سيتم إضافة مغاسل جديدة قريباً' : 'New partners will be added soon'}
            </p>
          </div>
        )}
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
          <span>{language === 'ar' ? 'متابعة لاختيار القطع والملابس' : 'Continue to Select Garments'}</span>
          {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
