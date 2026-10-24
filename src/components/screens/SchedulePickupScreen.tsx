import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Home,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  ShieldCheck,
  Zap,
  Truck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TIME_SLOTS } from '../../data/mockData';
import { PickupSchedule, DeliverySchedule } from '../../types';

export const SchedulePickupScreen: React.FC = () => {
  const {
    language,
    t,
    pickupSchedule,
    setPickupSchedule,
    deliverySchedule,
    setDeliverySchedule,
    selectedPartner,
    selectedAddress,
    setSelectedAddress,
    addresses,
    navigateTo
  } = useApp();

  // Generate 7 days starting today
  const availableDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const isoDate = d.toISOString().split('T')[0];

    const dayNameAr =
      i === 0
        ? 'اليوم'
        : i === 1
        ? 'غداً'
        : d.toLocaleDateString('ar-EG', { weekday: 'short' });

    const dayNameEn =
      i === 0
        ? 'Today'
        : i === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayNum = d.getDate();
    const monthNameAr = d.toLocaleDateString('ar-EG', { month: 'short' });
    const monthNameEn = d.toLocaleDateString('en-US', { month: 'short' });

    return {
      isoDate,
      dayName: language === 'ar' ? dayNameAr : dayNameEn,
      dayNum,
      monthName: language === 'ar' ? monthNameAr : monthNameEn,
      isToday: i === 0
    };
  });

  const [selectedDate, setSelectedDate] = useState<string>(
    pickupSchedule.date || availableDays[0].isoDate
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(
    pickupSchedule.timeSlot || TIME_SLOTS[2].textAr
  );
  const [isExpress, setIsExpress] = useState<boolean>(deliverySchedule.isExpress);
  const [pickupMethod, setPickupMethod] = useState<'doorstep' | 'counter'>('doorstep');

  // Compute calculated delivery date based on selected pickup date and express status
  const pickupBaseDate = new Date(selectedDate);
  const deliveryOffsetDays = isExpress ? 1 : 2;
  const deliveryBaseDate = new Date(pickupBaseDate);
  deliveryBaseDate.setDate(deliveryBaseDate.getDate() + deliveryOffsetDays);
  const calculatedDeliveryDate = deliveryBaseDate.toISOString().split('T')[0];

  const handleContinue = () => {
    setPickupSchedule({
      date: selectedDate,
      timeSlot: selectedSlot,
      method: pickupMethod
    });

    setDeliverySchedule({
      date: calculatedDeliveryDate,
      timeSlot: selectedSlot,
      isExpress,
      instructions: deliverySchedule.instructions || ''
    });

    navigateTo('checkout');
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-28 select-none">
      {/* 1. Step Indicator Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center gap-1.5 text-[#18A875]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'القطع (تم)' : 'Garments'}</span>
          </div>
          <span className="text-[#718596]">←</span>
          <div className="flex items-center gap-1.5 text-[#18A875]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التصوير (تم)' : 'Photos'}</span>
          </div>
          <span className="text-[#718596]">←</span>
          <div className="flex items-center gap-1.5 text-[#079FD0] bg-[#EAF8FF] px-2 py-0.5 rounded-lg border border-[#08BDF4]/30">
            <Calendar className="w-3.5 h-3.5 animate-pulse" />
            <span>{language === 'ar' ? 'الموعد (الحالية)' : 'Schedule'}</span>
          </div>
          <span className="text-[#718596]">←</span>
          <div className="flex items-center gap-1.5 text-[#718596]">
            <span>{language === 'ar' ? 'التأكيد' : 'Confirm'}</span>
          </div>
        </div>
      </div>

      {/* 2. Header */}
      <div className="mb-4">
        <h2 className="text-xl font-black text-[#183247] mb-1">
          {language === 'ar' ? 'تحديد موعد الاستلام والتوصيل' : 'Pickup & Delivery Schedule'}
        </h2>
        <p className="text-xs text-[#718596]">
          {language === 'ar'
            ? 'حدد الوقت المناسب لك لاستلام ملابسك وإعادتها نظيفة ومعقمة'
            : 'Select convenient times for garment collection and delivery'}
        </p>
      </div>

      {/* 3. Pickup Date Selector (Horizontal Scrollable) */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <label className="block text-xs font-bold text-[#183247] mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#08BDF4]" />
            <span>{language === 'ar' ? 'تاريخ استلام المندوب للملابس:' : 'Pickup Date:'}</span>
          </div>
          <span className="text-[11px] text-[#079FD0] font-semibold">
            {language === 'ar' ? 'من باب منزلك' : 'Doorstep'}
          </span>
        </label>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {availableDays.map(day => {
            const isSelected = selectedDate === day.isoDate;
            return (
              <button
                key={day.isoDate}
                onClick={() => setSelectedDate(day.isoDate)}
                className={`flex flex-col items-center justify-center min-w-[62px] py-2.5 px-2 rounded-2xl border transition cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-[#08BDF4] bg-[#08BDF4] text-white shadow-md shadow-[#08BDF4]/25'
                    : 'border-[#E5EEF4] bg-[#F4FBFF] text-[#183247] hover:border-[#08BDF4]/40'
                }`}
              >
                <span className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-[#718596]'}`}>
                  {day.dayName}
                </span>
                <span className="text-lg font-black my-0.5">{day.dayNum}</span>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-[#718596]'}`}>
                  {day.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Time Slot Selector */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <label className="block text-xs font-bold text-[#183247] mb-2.5 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#08BDF4]" />
          <span>{language === 'ar' ? 'فترة وصول المندوب المفضلة:' : 'Courier Arrival Window:'}</span>
        </label>

        <div className="flex flex-col gap-2">
          {TIME_SLOTS.map(slot => {
            const slotText = language === 'ar' ? slot.textAr : slot.textEn;
            const isSelected = selectedSlot === slot.textAr || selectedSlot === slot.textEn;

            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.textAr)}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer text-start ${
                  isSelected
                    ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0] shadow-2xs'
                    : 'border-[#E5EEF4] bg-[#F4FBFF] text-[#183247] hover:bg-slate-100'
                }`}
              >
                <span>{slotText}</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#08BDF4] bg-[#08BDF4] text-white' : 'border-[#E5EEF4]'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Express Delivery Option & Expected Return Summary */}
      <div className="p-4 bg-gradient-to-r from-[#F4FBFF] to-[#EAF8FF] rounded-2xl border border-[#08BDF4]/20 mb-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isExpress ? 'text-amber-500 fill-amber-500' : 'text-[#718596]'}`} />
            <div>
              <h4 className="text-xs font-black text-[#183247]">
                {language === 'ar' ? 'خدمة الغسيل السريع (Express)' : 'Express Fast Delivery'}
              </h4>
              <p className="text-[11px] text-[#718596]">
                {language === 'ar' ? 'استلام وإعادة الملابس في نفس اليوم أو خلال 24 ساعة (+30 ج.م)' : 'Same day / 24h fast turnaround (+30 EGP)'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isExpress}
              onChange={e => setIsExpress(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:peer-checked:after:-translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#08BDF4]"></div>
          </label>
        </div>

        {/* Expected return info */}
        <div className="mt-3 pt-2.5 border-t border-[#08BDF4]/20 flex items-center justify-between text-xs">
          <span className="text-[#718596]">
            {language === 'ar' ? 'موعد إعادة الملابس المتوقع:' : 'Expected Delivery Date:'}
          </span>
          <span className="font-black text-[#079FD0] flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            {calculatedDeliveryDate} ({selectedSlot.split(' ')[0]})
          </span>
        </div>
      </div>

      {/* 6. Pickup Address Review */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-[#183247] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#08BDF4]" />
            <span>{language === 'ar' ? 'عنوان الاستلام والتوصيل' : 'Address'}</span>
          </label>
          <button
            onClick={() => navigateTo('address_form')}
            className="text-xs font-bold text-[#079FD0] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'عنوان جديد' : 'New Address'}</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {addresses.map(addr => {
            const isSelected = selectedAddress.id === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between ${
                  isSelected
                    ? 'border-[#08BDF4] bg-white ring-1 ring-[#08BDF4]/20'
                    : 'border-[#E5EEF4] bg-white hover:border-[#08BDF4]/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#183247]">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-[#079FD0] bg-[#EAF8FF] px-2 py-0.5 rounded-full">
                        {language === 'ar' ? 'افتراضي' : 'Default'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#718596] mt-1 leading-snug">
                    {addr.street}، {addr.building}، {addr.floor}، {addr.apartment}
                  </p>
                  <p className="text-[11px] text-[#718596] mt-1 font-semibold">
                    {addr.contactName} ({addr.contactPhone})
                  </p>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#08BDF4] bg-[#08BDF4] text-white' : 'border-[#E5EEF4]'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Action */}
      <div
        className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5EEF4] p-3 shadow-lg w-full mt-auto"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
      >
        <button
          onClick={handleContinue}
          className="w-full h-12 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>
            {language === 'ar' ? 'متابعة إلى مراجعة وتأكيد الطلب' : 'Continue to Checkout'}
          </span>
          {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
