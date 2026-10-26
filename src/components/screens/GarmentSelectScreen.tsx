import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Sparkles,
  SlidersHorizontal,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GARMENT_CATEGORIES, GARMENTS, DEFAULT_STAIN_OPTIONS } from '../../data/mockData';
import {
  GarmentItem,
  ServiceType,
  StainTreatmentOption,
  OrderItemCustomization
} from '../../types';

export const GarmentSelectScreen: React.FC = () => {
  const {
    language,
    t,
    cartItems,
    addItemToCart,
    updateCartItemQuantity,
    getCartItemCount,
    totalItemsCount,
    cartSubtotal,
    navigateTo,
    showToast,
    selectedPartner,
    getGarmentPrice
  } = useApp();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('top');

  // Load custom stains configured by this merchant
  const getMerchantStains = (): StainTreatmentOption[] => {
    try {
      if (selectedPartner?.id) {
        const raw = localStorage.getItem(`ala_el_saree_merchant_stains_${selectedPartner.id}`);
        if (raw) {
          const list: StainTreatmentOption[] = JSON.parse(raw);
          return list.filter(s => s.isAvailable !== false);
        }
      }
      const activeRaw = localStorage.getItem('ala_el_saree_merchant_stains_active');
      if (activeRaw) {
        const list: StainTreatmentOption[] = JSON.parse(activeRaw);
        return list.filter(s => s.isAvailable !== false);
      }
    } catch {}
    return DEFAULT_STAIN_OPTIONS.filter(s => s.isAvailable !== false);
  };

  // Load offered services configured by this merchant
  const getMerchantOfferedServices = (): Record<string, boolean> => {
    try {
      if (selectedPartner?.id) {
        const raw = localStorage.getItem(`ala_el_saree_merchant_services_${selectedPartner.id}`);
        if (raw) return JSON.parse(raw);
      }
      const activeRaw = localStorage.getItem('ala_el_saree_merchant_services_active');
      if (activeRaw) return JSON.parse(activeRaw);
    } catch {}
    return {
      wash_iron: true,
      wash_only: true,
      iron_only: true,
      dry_clean: true,
      bedding: true,
      shoes: true
    };
  };

  const [availableStains, setAvailableStains] = useState<StainTreatmentOption[]>(() => getMerchantStains());
  const [offeredServices, setOfferedServices] = useState<Record<string, boolean>>(() => getMerchantOfferedServices());

  React.useEffect(() => {
    const handleUpdate = () => {
      setAvailableStains(getMerchantStains());
      setOfferedServices(getMerchantOfferedServices());
    };
    window.addEventListener('ala_el_saree_merchant_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ala_el_saree_merchant_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [selectedPartner?.id]);

  const ALL_SERVICES: { type: ServiceType; label: string }[] = [
    { type: 'wash_iron', label: t.service_wash_iron },
    { type: 'wash_only', label: t.service_wash_only },
    { type: 'iron_only', label: t.service_iron_only },
    { type: 'dry_clean', label: t.service_dry_clean }
  ];

  // Only display services that the merchant enabled in the dashboard
  const availableServices = ALL_SERVICES.filter(s => offeredServices[s.type] !== false);

  // Available categories based on merchant customization (e.g., bedding / shoes toggles)
  const availableCategories = GARMENT_CATEGORIES.filter(c => {
    if (c.id === 'bedding' && offeredServices.bedding === false) return false;
    if (c.id === 'shoes_delicates' && offeredServices.shoes === false) return false;
    return true;
  });

  const activeCategory =
    availableCategories.find(c => c.id === activeCategoryId) || availableCategories[0] || GARMENT_CATEGORIES[0];

  const categoryGarments = GARMENTS.filter(g => {
    if (g.categoryId !== activeCategory.id) return false;
    if (g.categoryId === 'bedding' && offeredServices.bedding === false) return false;
    if (g.categoryId === 'shoes_delicates' && offeredServices.shoes === false) return false;
    return true;
  });

  // Modal / Bottom Sheet for customizing a specific garment
  const [customizingGarment, setCustomizingGarment] = useState<GarmentItem | null>(null);
  const [modalCustomization, setModalCustomization] = useState<OrderItemCustomization>({
    serviceType: 'wash_iron',
    stains: [],
    stainCost: 0,
    notes: ''
  });
  const [modalQty, setModalQty] = useState(1);

  const openCustomizer = (garment: GarmentItem) => {
    setCustomizingGarment(garment);
    const existing = cartItems.find(i => i.garmentId === garment.id);
    const defaultType: ServiceType = availableServices.length > 0 ? availableServices[0].type : 'wash_iron';
    const chosenType = existing && offeredServices[existing.customization.serviceType] !== false
      ? existing.customization.serviceType
      : defaultType;

    setModalCustomization({
      serviceType: chosenType,
      stains: existing?.customization.stains ? [...existing.customization.stains] : [],
      stainCost: existing?.customization.stainCost || 0,
      notes: existing ? existing.customization.notes || '' : ''
    });
    setModalQty(1);
  };

  const handleToggleStain = (stain: StainTreatmentOption) => {
    setModalCustomization(prev => {
      const currentStains = prev.stains || [];
      const isSelected = currentStains.includes(stain.id);
      const nextStains = isSelected
        ? currentStains.filter(id => id !== stain.id)
        : [...currentStains, stain.id];

      const newCost = nextStains.reduce((sum, sId) => {
        const found = availableStains.find(s => s.id === sId);
        return sum + (found?.price || 0);
      }, 0);

      return {
        ...prev,
        stains: nextStains,
        stainCost: newCost
      };
    });
  };

  const handleSaveCustomization = () => {
    if (!customizingGarment) return;
    addItemToCart(customizingGarment.id, modalCustomization, modalQty);
    setCustomizingGarment(null);
  };

  const handleQuickAdd = (garment: GarmentItem) => {
    const existing = [...cartItems].reverse().find(i => i.garmentId === garment.id);
    if (existing) {
      updateCartItemQuantity(garment.id, existing.customization, 1);
    } else {
      openCustomizer(garment);
    }
  };

  const handleQuickSubtract = (garment: GarmentItem) => {
    const existing = [...cartItems].reverse().find(i => i.garmentId === garment.id);
    if (existing) {
      updateCartItemQuantity(garment.id, existing.customization, -1);
    }
  };

  const handleProceed = () => {
    if (totalItemsCount === 0) {
      showToast(t.emptyGarmentsSelected);
      return;
    }
    navigateTo('garment_photos');
  };

  return (
    <div className="flex-1 flex flex-col relative pb-28">
      {/* Selected Partner Header Banner */}
      {selectedPartner && (
        <div className="bg-[#EAF8FF] border-b border-[#08BDF4]/30 px-4 py-2.5 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">🧺</span>
            <div className="min-w-0">
              <span className="text-[10px] text-[#718596] block">
                {language === 'ar' ? 'المغسلة المعتمدة:' : 'Selected Laundry:'}
              </span>
              <span className="font-black text-[#183247] truncate block">
                {language === 'ar' ? selectedPartner.nameAr : selectedPartner.nameEn}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigateTo('partner_select')}
            className="text-[11px] font-bold text-[#079FD0] bg-white px-2.5 py-1 rounded-lg border border-[#08BDF4]/30 hover:bg-[#08BDF4]/10 transition cursor-pointer"
          >
            {language === 'ar' ? 'تغيير' : 'Change'}
          </button>
        </div>
      )}

      {/* 1. Garment Category Horizontal Pills (Sticky Top) */}
      <div className="bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-[#E5EEF4] sticky top-0 z-20 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-2xs">
        {availableCategories.map(cat => {
          const isSelected = activeCategory.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#08BDF4] text-white shadow-xs'
                  : 'bg-[#F4FBFF] text-[#718596] hover:bg-slate-100 border border-[#E5EEF4]'
              }`}
            >
              <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Garments List for Active Category */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#183247]">
            {language === 'ar' ? activeCategory.nameAr : activeCategory.nameEn}
          </h3>
          <span className="text-[11px] text-[#718596]">
            {categoryGarments.length} {language === 'ar' ? 'أنواع متوفرة' : 'types'}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {categoryGarments.map(garment => {
            const count = getCartItemCount(garment.id);
            const activePrices = availableServices.map(s => getGarmentPrice(garment.id, s.type));
            const minPrice = activePrices.length > 0
              ? Math.min(...activePrices)
              : getGarmentPrice(garment.id, 'wash_iron');
            const isSelected = count > 0;

            return (
              <div
                key={garment.id}
                className={`p-3 bg-white rounded-2xl border transition shadow-2xs flex items-center justify-between gap-3 ${
                  isSelected ? 'border-[#08BDF4] ring-1 ring-[#08BDF4]/20' : 'border-[#E5EEF4]'
                }`}
              >
                {/* Left: Garment Info & Tap to customize */}
                <div
                  onClick={() => openCustomizer(garment)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F4FBFF] border border-[#E5EEF4] flex items-center justify-center text-2xl shrink-0">
                    {garment.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#183247] leading-tight truncate">
                      {language === 'ar' ? garment.nameAr : garment.nameEn}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-xs font-black text-[#079FD0]">
                        {language === 'ar' ? `يبدأ من ${minPrice} ${t.currency}` : `From ${minPrice} ${t.currency}`}
                      </span>
                      <span className="text-[10px] text-[#718596] bg-[#F4FBFF] px-1.5 py-0.5 rounded-md border border-[#E5EEF4]">
                        {language === 'ar' ? 'تخصيص كامل' : 'Customizable'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Stepper and Customize button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openCustomizer(garment)}
                    className="p-1.5 rounded-lg text-[11px] font-semibold text-[#079FD0] bg-[#EAF8FF] hover:bg-[#08BDF4]/20 transition cursor-pointer flex items-center gap-1"
                    title={t.customizeGarment}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 bg-[#F4FBFF] border border-[#E5EEF4] p-1 rounded-xl">
                    {count > 0 && (
                      <button
                        onClick={() => handleQuickSubtract(garment)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer bg-white text-[#183247] shadow-2xs hover:bg-[#E5EEF4]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {count > 0 && (
                      <span className="w-5 text-center text-xs font-black text-[#183247]">
                        {count}
                      </span>
                    )}

                    <button
                      onClick={() => handleQuickAdd(garment)}
                      className={`h-7 rounded-lg bg-[#08BDF4] text-white flex items-center justify-center shadow-xs hover:bg-[#079FD0] transition cursor-pointer active:scale-95 ${
                        count > 0 ? 'w-7' : 'px-2.5 gap-1 text-[11px] font-bold'
                      }`}
                      aria-label="Increase or customize quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {count === 0 && <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Garment Customization Bottom Sheet / Modal */}
      {/* 4. Garment Customization Bottom Sheet / Modal (Fully Contained Inside Mobile Viewport) */}
      {customizingGarment && (
        <div
          onClick={() => setCustomizingGarment(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full bg-white rounded-t-3xl max-h-[85%] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250 border-t border-slate-100"
          >
            {/* Sheet Pinned Header */}
            <div className="p-4 pb-3 border-b border-[#E5EEF4] shrink-0 bg-white">
              {/* Sheet Drag Handle */}
              <div className="w-12 h-1 bg-[#CBD5E1] rounded-full mx-auto mb-3"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-2xl bg-[#F4FBFF] border border-[#E5EEF4]">
                    {customizingGarment.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#183247]">
                      {language === 'ar' ? customizingGarment.nameAr : customizingGarment.nameEn}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-[#079FD0]">
                        {getGarmentPrice(customizingGarment.id, modalCustomization.serviceType) + (modalCustomization.stainCost || 0)} {t.currency}
                      </span>
                      <span className="text-[10px] text-[#718596]">/ {language === 'ar' ? 'للقطعة' : 'per piece'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCustomizingGarment(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer active:scale-95"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sheet Scrollable Customization Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar">
              {/* Service Choice */}
              <div>
                <label className="block text-xs font-bold text-[#183247] mb-2">
                  {language === 'ar' ? 'نوع الخدمة المطلوبة:' : 'Service Type:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableServices.length > 0 ? (
                    availableServices.map(s => (
                      <button
                        key={s.type}
                        type="button"
                        onClick={() =>
                          setModalCustomization(prev => ({
                            ...prev,
                            serviceType: s.type
                          }))
                        }
                        className={`py-2 px-3 rounded-xl border text-xs font-bold text-start flex items-center justify-between transition cursor-pointer ${
                          modalCustomization.serviceType === s.type
                            ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0] shadow-xs'
                            : 'border-[#E5EEF4] text-[#718596] hover:bg-slate-50'
                        }`}
                      >
                        <span>{s.label}</span>
                        <span className="text-[11px] font-black">
                          {getGarmentPrice(customizingGarment.id, s.type)} {t.currency}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-2 p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200">
                      {language === 'ar' ? 'الخدمات معلقة مؤقتاً في هذا الفرع' : 'Services temporarily paused'}
                    </div>
                  )}
                </div>
              </div>

              {/* Stain Treatment Choice Cards (Replaces fragrance, starch, packaging as requested) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#183247]">
                    {language === 'ar' ? 'معالجة بقع متخصصة (اختياري):' : 'Special Stain Treatment (Optional):'}
                  </label>
                  <span className="text-[10px] text-[#718596]">
                    {language === 'ar' ? 'حدد أي بقع بالقطعة لإزالتها' : 'Select any stains to treat'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {availableStains.map(stain => {
                    const isSelected = (modalCustomization.stains || []).includes(stain.id);
                    return (
                      <button
                        key={stain.id}
                        type="button"
                        onClick={() => handleToggleStain(stain)}
                        className={`p-2.5 rounded-xl border text-xs text-start transition cursor-pointer flex items-center justify-between gap-1.5 ${
                          isSelected
                            ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0] shadow-xs ring-1 ring-[#08BDF4]/30'
                            : 'border-[#E5EEF4] text-[#475569] hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-base shrink-0">{stain.icon || '🧼'}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-[11px] truncate leading-tight">
                              {language === 'ar' ? stain.nameAr : stain.nameEn}
                            </div>
                            <div className={`text-[10px] font-black mt-0.5 ${isSelected ? 'text-[#079FD0]' : 'text-emerald-600'}`}>
                              +{stain.price} {t.currency}
                            </div>
                          </div>
                        </div>

                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#08BDF4] border-[#08BDF4] text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special instructions / notes for this piece */}
              <div>
                <label className="block text-xs font-bold text-[#183247] mb-1.5">
                  {language === 'ar' ? 'ملاحظة خاصة بالقطعة (اختياري):' : 'Special Piece Note (Optional):'}
                </label>
                <input
                  type="text"
                  value={modalCustomization.notes || ''}
                  onChange={e =>
                    setModalCustomization(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))
                  }
                  placeholder={
                    language === 'ar'
                      ? 'مثال: بقعة حبر على الجيب الأيمن، كي بدون ثنيات'
                      : 'e.g. Ink stain on right pocket, extra care'
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EEF4] bg-[#F4FBFF] focus:bg-white focus:outline-none focus:border-[#08BDF4] text-[#183247] placeholder:text-[#94A3B8]"
                />
              </div>
            </div>

            {/* Sheet Pinned Footer (Always Visible, Never Pushed Off Screen) */}
            <div
              className="p-3.5 bg-white border-t border-[#E5EEF4] shrink-0 space-y-2.5 shadow-lg"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 14px)' }}
            >
              {/* Quantity Stepper in modal */}
              {(() => {
                const basePiecePrice = getGarmentPrice(customizingGarment.id, modalCustomization.serviceType);
                const stainExtra = modalCustomization.stainCost || 0;
                const singlePieceTotal = basePiecePrice + stainExtra;
                const totalAmount = singlePieceTotal * modalQty;

                return (
                  <>
                    <div className="flex items-center justify-between px-3 py-2 bg-[#F4FBFF] rounded-xl border border-[#E5EEF4]">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#183247]">
                          {language === 'ar' ? 'الكمية المطلوبة:' : 'Quantity:'}
                        </span>
                        <span className="text-[10px] text-[#718596]">
                          {modalQty} × {singlePieceTotal} = {totalAmount} {t.currency}
                          {stainExtra > 0 && (
                            <span className="text-emerald-600 font-bold mr-1">
                              (يشمل +{stainExtra * modalQty} {t.currency} إزالة بقع)
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setModalQty(q => Math.max(1, q - 1))}
                          className="w-7 h-7 rounded-lg bg-white border border-[#E5EEF4] flex items-center justify-center text-slate-700 cursor-pointer active:scale-95 shadow-2xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black text-[#183247] min-w-5 text-center">{modalQty}</span>
                        <button
                          type="button"
                          onClick={() => setModalQty(q => q + 1)}
                          className="w-7 h-7 rounded-lg bg-[#08BDF4] text-white flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Confirm button */}
                    <button
                      type="button"
                      onClick={handleSaveCustomization}
                      className="w-full h-11 rounded-xl bg-[#08BDF4] hover:bg-[#079FD0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer active:scale-98"
                    >
                      <span>
                        {language === 'ar'
                          ? `إضافة للسلة (${totalAmount} ${t.currency})`
                          : `Add to Cart (${totalAmount} ${t.currency})`}
                      </span>
                      <Check className="w-4 h-4" />
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 5. Persistent Live Order Summary Bar pinned to bottom */}
      <div
        className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5EEF4] p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between w-full mt-auto"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
      >
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#18A875]"></span>
            <span className="text-xs font-semibold text-[#718596]">
              {totalItemsCount} {t.itemsCount}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-[#183247]">
              {cartSubtotal}
            </span>
            <span className="text-xs font-bold text-[#079FD0]">{t.currency}</span>
            <span className="text-[10px] text-[#718596] mr-1">
              ({language === 'ar' ? 'تقديري' : 'est.'})
            </span>
          </div>
        </div>

        <button
          onClick={handleProceed}
          className={`h-12 px-6 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer ${
            totalItemsCount > 0
              ? 'bg-[#08BDF4] hover:bg-[#079FD0] text-white shadow-[#08BDF4]/25 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{language === 'ar' ? 'متابعة الطلب' : 'Continue Order'}</span>
          {language === 'ar' ? (
            <ArrowLeft className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
