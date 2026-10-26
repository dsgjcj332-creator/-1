import React, { useState } from 'react';
import {
  MapPin,
  Building,
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Map,
  Compass,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../data/mockData';
import { Address } from '../../types';
import { InteractiveMapModal, SelectedLocationData } from '../common/InteractiveMapModal';

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

  const [title, setTitle] = useState(isEditing ? selectedAddress.title : 'المنزل');
  const [city, setCity] = useState(isEditing ? selectedAddress.city : 'الزقازيق');
  const [neighborhood, setNeighborhood] = useState(isEditing ? selectedAddress.neighborhood : 'حي الجامعة');
  const [street, setStreet] = useState(isEditing ? selectedAddress.street : 'شارع السلام');
  const [building, setBuilding] = useState(isEditing ? selectedAddress.building : '');
  const [floor, setFloor] = useState(isEditing ? selectedAddress.floor : '');
  const [apartment, setApartment] = useState(isEditing ? selectedAddress.apartment : '');
  const [landmark, setLandmark] = useState(isEditing ? selectedAddress.landmark || '' : '');
  const [contactName, setContactName] = useState(isEditing ? selectedAddress.contactName : user?.name || '');
  const [contactPhone, setContactPhone] = useState(isEditing ? selectedAddress.contactPhone : user?.phone || '');
  const [isDefault, setIsDefault] = useState(isEditing ? selectedAddress.isDefault : false);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapLocationSelected, setMapLocationSelected] = useState<SelectedLocationData | null>(null);

  const handleLocationPicked = (data: SelectedLocationData) => {
    setMapLocationSelected(data);
    if (data.city) setCity(data.city);
    if (data.neighborhood) setNeighborhood(data.neighborhood);
    if (data.street) setStreet(data.street);
    if (data.fullAddress && !landmark) {
      setLandmark(`محدد عبر الخريطة (${data.neighborhood})`);
    }
  };

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
      <div className="mb-3">
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
            ? 'حدد موقعك عبر الخريطة بدقة ليتم استيراد المحافظة والحي والشارع تلقائياً'
            : 'Pin your location on map or type address details manually'}
        </p>
      </div>

      {/* Interactive Map Button Banner */}
      <div className="mb-4 p-3.5 bg-gradient-to-r from-[#EAF8FF] to-sky-50 border border-[#08BDF4]/30 rounded-2xl flex flex-col gap-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#08BDF4] text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#183247]">
                {language === 'ar' ? 'تحديد الموقع على الخريطة' : 'Interactive Map Picker'}
              </h4>
              <p className="text-[11px] text-[#718596]">
                {language === 'ar' ? 'انقر لفتح الخريطة واختيار مكانك أو استخدام GPS' : 'Open map to pinpoint doorstep location'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            className="px-3.5 py-2 bg-[#08BDF4] hover:bg-[#079FD0] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <Map className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'فتح الخريطة 🗺️' : 'Open Map'}</span>
          </button>
        </div>

        {mapLocationSelected && (
          <div className="pt-2 border-t border-[#08BDF4]/20 flex items-center justify-between text-[11px] text-[#079FD0] font-bold">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>تم استيراد الموقع: {mapLocationSelected.street}، {mapLocationSelected.neighborhood}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="text-xs text-[#183247] underline hover:text-[#08BDF4]"
            >
              تغيير
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
        {/* Title */}
        <div>
          <label className="block font-bold text-[#183247] mb-1">
            {language === 'ar' ? 'تسمية العنوان (المنزل، العمل، الشاليه...)' : 'Address Label'}
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="مثال: المنزل، المكتب، بيت العائلة..."
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

      {/* Interactive Map Modal */}
      <InteractiveMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={handleLocationPicked}
        title={language === 'ar' ? 'تحديد موقع التوصيل على الخريطة' : 'Pick Delivery Location on Map'}
      />
    </div>
  );
};
