import React, { useState } from 'react';
import { Search, Sparkles, Filter, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GARMENT_CATEGORIES, GARMENTS, LAUNDRY_PARTNERS } from '../../data/mockData';
import { ServiceType } from '../../types';

export const ServicesScreen: React.FC = () => {
  const { language, t, navigateTo, setSelectedPartner } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<ServiceType | 'all'>('all');

  const filteredGarments = GARMENTS.filter(garment => {
    const matchesSearch =
      garment.nameAr.includes(searchQuery) ||
      garment.nameEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryId === 'all' || garment.categoryId === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col p-4 pb-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-black text-[#183247] mb-1">
          {language === 'ar' ? 'خدمات ودليل العناية بالملابس' : 'Services & Garment Care'}
        </h1>
        <p className="text-xs text-[#718596]">
          {language === 'ar' ? 'تصفح قائمة أسعار وخدمات الغسيل والكي والدراي كلين' : 'Explore laundry, dry cleaning and garment care catalog'}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-[#718596] absolute top-3.5 right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={language === 'ar' ? 'ابحث عن قطعة (قميص، بدلة، جلباب، بطانية...)' : 'Search garments (shirt, suit, blanket...)'}
          className="w-full h-11 px-10 rounded-2xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-xs font-semibold bg-white shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute top-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-xs text-[#718596] hover:text-[#183247]"
          >
            ×
          </button>
        )}
      </div>

      {/* Category Horizontal Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        <button
          onClick={() => setSelectedCategoryId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            selectedCategoryId === 'all'
              ? 'bg-[#08BDF4] text-white shadow-xs'
              : 'bg-white border border-[#E5EEF4] text-[#718596] hover:bg-slate-50'
          }`}
        >
          {language === 'ar' ? 'جميع الأقسام' : 'All Categories'}
        </button>
        {GARMENT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategoryId === cat.id
                ? 'bg-[#08BDF4] text-white shadow-xs'
                : 'bg-white border border-[#E5EEF4] text-[#718596] hover:bg-slate-50'
            }`}
          >
            {language === 'ar' ? cat.nameAr : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="flex flex-col gap-2.5 mb-6">
        {filteredGarments.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E5EEF4]">
            <p className="text-sm font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'لم نعثر على أي نتائج مطابقة' : 'No matching garments found'}
            </p>
            <p className="text-xs text-[#718596]">
              {language === 'ar' ? 'جرب البحث بكلمات أخرى أو اختر فئة مختلفة' : 'Try searching another garment or clear filters'}
            </p>
          </div>
        ) : (
          filteredGarments.map(garment => (
            <div
              key={garment.id}
              onClick={() => navigateTo('garment_select')}
              className="p-3 bg-white rounded-2xl border border-[#E5EEF4] hover:border-[#08BDF4] transition flex items-center justify-between cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1 bg-[#F4FBFF] rounded-xl">{garment.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-[#183247] group-hover:text-[#079FD0] transition">
                    {language === 'ar' ? garment.nameAr : garment.nameEn}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#718596] mt-0.5">
                    <span>{language === 'ar' ? 'غسيل وكي:' : 'Wash & Iron:'} <strong className="text-[#079FD0]">{garment.basePrices.wash_iron} {t.currency}</strong></span>
                    <span>·</span>
                    <span>{language === 'ar' ? 'دراي كلين:' : 'Dry clean:'} <strong>{garment.basePrices.dry_clean} {t.currency}</strong></span>
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-[#EAF8FF] flex items-center justify-center text-[#079FD0] group-hover:bg-[#08BDF4] group-hover:text-white transition">
                {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Direct Order Floating Banner */}
      <div className="mt-auto p-4 bg-gradient-to-tr from-[#08BDF4] to-[#079FD0] rounded-2xl text-white flex items-center justify-between shadow-md">
        <div>
          <h4 className="text-sm font-bold leading-tight">
            {language === 'ar' ? 'جاهز تبدأ طلبك الآن؟' : 'Ready to start your order?'}
          </h4>
          <p className="text-xs text-white/90">
            {language === 'ar' ? 'حدد الكميات والخدمات واحجز الميعاد' : 'Select items and schedule pickup'}
          </p>
        </div>

        <button
          onClick={() => navigateTo('garment_select')}
          className="px-3.5 py-2 bg-white text-[#079FD0] font-black text-xs rounded-xl shadow-xs hover:bg-[#F4FBFF] active:scale-95 transition cursor-pointer"
        >
          {language === 'ar' ? 'طلب الآن' : 'Order Now'}
        </button>
      </div>
    </div>
  );
};
