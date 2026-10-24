import React, { useState } from 'react';
import {
  MapPin,
  Building,
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../data/mockData';
import { Address } from '../../types';

export const AddressFormScreen: React.FC = () => {
  const {
    language,
    t,
    addAddress,
    updateAddress,
    selectedAddress,
    goBack,
    user
  } = useApp();

  const isEditing = Boolean(selectedAddress?.id);

  const [title, setTitle] = useState(isEditing ? selectedAddress.title : 'المنزل الجديد');
  const [city, setCity] = useState(isEditing ? selectedAddress.city : 'الزقازيق');
  const [neighborhood, setNeighborhood] = useState(isEditing ? selectedAddress.neighborhood : 'حي الجامعة');
  const [street, setStreet] = useState(isEditing ? selectedAddress.street : 'شارع السلام');
  const [building, setBuilding] = useState(isEditing ? selectedAddress.building : 'عمارة 12');
  const [floor, setFloor] = useState(isEditing ? selectedAddress.floor : 'الدور 3');
  const [apartment, setApartment] = useState(isEditing ? selectedAddress.apartment : 'شقة 6');
  const [landmark, setLandmark] = useState(isEditing ? selectedAddress.landmark || '' : 'بجوار صيدلية العزبي');
  const [contactName, setContactName] = useState(isEditing ? selectedAddress.contactName : user?.name || 'أحمد محمود');
  const [contactPhone, setContactPhone] = useState(isEditing ? selectedAddress.contactPhone : user?.phone || '+20 101 234 5678');
  const [isDefault, setIsDefault] = useState(isEditing ? selectedAddress.isDefault : false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !street || !building) return;

    if (isEditing && selectedAddress) {
      updateAddress({
        ...selectedAddress,
        title,
        city,
        neighborhood,
        street,
        building,
        floor,
        apartment,
        landmark,
        contactName,
        contactPhone,
        isDefault
      });
    } else {
      addAddress({
        title,
        city,
        neighborhood,
        street,
        building,
        floor,
        apartment,
        landmark,
        contactName,
        contactPhone,
        isDefault
      });
    }

    goBack();
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 select-none bg-white">
      <div className="mb-4">
        <h2 className="text-xl font-black text-[#183247] mb-1">
          {isEditing
            ? language === 'ar'
              ? 'تعديل تفاصيل العنوان'
              : 'Edit Address'
            : language === 'ar'
            ? 'إضافة عنوان استلام جديد'
            : 'Add New Address'}
        </h2>
        <p className="text-xs text-[#718596]">
          {language === 'ar'
            ? 'أدخل بيانات العنوان بدقة لمساعدة المندوب في الوصول إليك بسهولة'
            : 'Fill in exact building and apartment details for seamless delivery'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
        {/* Title */}
        <div>
          <label className="block font-bold text-[#183247] mb-1">
            {language === 'ar' ? 'تسمية العنوان (المنزل، العمل...)' : 'Address Label'}
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] font-medium bg-[#F4FBFF]"
            required
          />
        </div>

        {/* City & Neighborhood */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'المدينة' : 'City'}
            </label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[#E5EEF4] font-medium bg-[#F4FBFF] cursor-pointer"
            >
              {CITIES.map(c => (
                <option key={c.id} value={c.nameAr}>
                  {language === 'ar' ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'الحي / المنطقة' : 'District'}
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={e => setNeighborhood(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[#E5EEF4] font-medium bg-[#F4FBFF]"
              required
            />
          </div>
        </div>

        {/* Street */}
        <div>
          <label className="block font-bold text-[#183247] mb-1">
            {language === 'ar' ? 'اسم الشارع' : 'Street Name'}
          </label>
          <input
            type="text"
            value={street}
            onChange={e => setStreet(e.target.value)}
            placeholder="مثال: شارع السلام متفرع من المحافظة"
            className="w-full h-11 px-3 rounded-xl border border-[#E5EEF4] font-medium bg-[#F4FBFF]"
            required
          />
        </div>

        {/* Building, Floor, Apartment */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'العمارة / البرج' : 'Building'}
            </label>
            <input
              type="text"
              value={building}
              onChange={e => setBuilding(e.target.value)}
              placeholder="برج 14"
              className="w-full h-11 px-2.5 rounded-xl border border-[#E5EEF4] font-medium bg-[#F4FBFF]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'الدور' : 'Floor'}
            </label>
            <input
              type="text"
              value={floor}
              onChange={e => setFloor(e.target.value)}
              placeholder="الدور 4"
              className="w-full h-11 px-2.5 rounded-xl border border-[#E5EEF4] font-medium bg-[#F4FBFF]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'رقم الشقة' : 'Apartment'}
            </label>
            <input
              type="text"
              value={apartment}
              onChange={e => setApartment(e.target.value)}
              placeholder="شقة 8"
              className="w-full h-11 px-2.5 rounded-xl border border-[#E5EEF4] font-medium bg-[#F4FBFF]"
              required
            />
          </div>
        </div>

        {/* Landmark */}
        <div>
          <label className="block font-bold text-[#183247] mb-1">
            {language === 'ar' ? 'علامة مميزة قريبة (اختياري)' : 'Nearby Landmark (Optional)'}
          </label>
          <input
            type="text"
            value={landmark}
            onChange={e => setLandmark(e.target.value)}
            placeholder="مثال: أمام البنك الأهلي، بجوار صيدلية العزبي"
            className="w-full h-11 px-3 rounded-xl border border-[#E5EEF4] font-medium bg-[#F4FBFF]"
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'اسم المستلم' : 'Contact Name'}
            </label>
            <input
              type="text"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[#E5EEF4] font-medium bg-[#F4FBFF]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'رقم هاتف المستلم' : 'Contact Phone'}
            </label>
            <input
              type="tel"
              dir="ltr"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[#E5EEF4] font-medium bg-[#F4FBFF]"
              required
            />
          </div>
        </div>

        {/* Default toggle */}
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={e => setIsDefault(e.target.checked)}
            className="w-4 h-4 rounded text-[#08BDF4] focus:ring-[#08BDF4]"
          />
          <span className="font-bold text-[#183247]">
            {language === 'ar' ? 'تعيين هذا العنوان كعنوان رئيسي افتراضي' : 'Set as primary default address'}
          </span>
        </label>
      </form>

      {/* Floating Bottom Action */}
      <div
        className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5EEF4] p-3 shadow-lg w-full mt-auto"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
      >
        <button
          onClick={handleSubmit}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>{language === 'ar' ? 'حفظ العنوان' : 'Save Address'}</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
