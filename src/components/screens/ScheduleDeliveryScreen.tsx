import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Zap,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TIME_SLOTS } from '../../data/mockData';

export const ScheduleDeliveryScreen: React.FC = () => {
  const {
    language,
    t,
    pickupSchedule,
    deliverySchedule,
    setDeliverySchedule,
    selectedPartner,
    navigateTo
  } = useApp();

  const [isExpress, setIsExpress] = useState<boolean>(deliverySchedule.isExpress && selectedPartner.expressAvailable);
  const [instructions, setInstructions] = useState<string>(deliverySchedule.instructions || '');

  // Generate delivery dates: If express, can start from pickup date evening or next day morning. If standard, starts next day.
  const baseDate = new Date(pickupSchedule.date);
  const minOffset = isExpress ? 0 : 1;

  const deliveryDays = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + minOffset + i);
    const isoDate = d.toISOString().split('T')[0];

    const dayNameAr =
      i === 0 && minOffset === 0
        ? 'نفس اليوم (سريع)'
        : i === 0 && minOffset === 1
        ? 'غداً'
        : d.toLocaleDateString('ar-EG', { weekday: 'short' });

    const dayNameEn =
      i === 0 && minOffset === 0
        ? 'Same Day'
        : i === 0 && minOffset === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayNum = d.getDate();
    const monthName =
      language === 'ar'
        ? d.toLocaleDateString('ar-EG', { month: 'short' })
        : d.toLocaleDateString('en-US', { month: 'short' });

    return {
      isoDate,
      dayName: language === 'ar' ? dayNameAr : dayNameEn,
      dayNum,
      monthName
    };
  });

  const [selectedDate, setSelectedDate] = useState<string>(deliveryDays[0].isoDate);
  const [selectedSlot, setSelectedSlot] = useState<string>(
    deliverySchedule.timeSlot || TIME_SLOTS[2].textAr
  );

  const handleContinue = () => {
    setDeliverySchedule({
      date: selectedDate,
      timeSlot: selectedSlot,
      isExpress,
      instructions
    });
    navigateTo('checkout');
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 select-none">
      <div className="mb-4">
        <h2 className="text-xl font-black text-[#183247] mb-1">
          {t.deliveryScheduleTitle}
        </h2>
        <p className="text-xs text-[#718596]">
          {language === 'ar'
            ? 'حدد موعد إعادة ملابسك مغسولة، معقمة، ومكوية بالبخار'
            : 'Choose when you want your fresh garments delivered back'}
        </p>
      </div>

      {/* Express Delivery Option (If supported by partner) */}
      {selectedPartner.expressAvailable && (
        <div
          onClick={() => setIsExpress(!isExpress)}
          className={`p-4 rounded-2xl border transition cursor-pointer mb-5 flex items-center justify-between ${
            isExpress
              ? 'border-[#18A875] bg-[#EAF8FF] ring-2 ring-[#18A875]/20'
              : 'border-[#E5EEF4] bg-white hover:border-[#08BDF4]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isExpress ? 'bg-[#18A875] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-[#183247]">{t.expressDeliveryOption}</h4>
                <span className="text-[10px] font-black bg-emerald-100 text-[#18A875] px-1.5 py-0.5 rounded-md">
                  +30 {t.currency}
                </span>
              </div>
              <p className="text-[11px] text-[#718596]">
                {language === 'ar' ? 'تسليم فائق السرعة خلال 6 ساعات فقط' : 'Ultra-fast delivery in just 6 hours'}
              </p>
            </div>
          </div>

          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            isExpress ? 'border-[#18A875] bg-[#18A875] text-white' : 'border-[#E5EEF4]'
          }`}>
            {isExpress && <CheckCircle2 className="w-4 h-4" />}
          </div>
        </div>
      )}

      {/* 1. Date Selector (Horizontal Scrollable) */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-[#183247] mb-2.5 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#08BDF4]" />
          <span>{t.selectDeliveryDate}</span>
        </label>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {deliveryDays.map(day => {
            const isSelected = selectedDate === day.isoDate;
            return (
              <button
                key={day.isoDate}
                onClick={() => setSelectedDate(day.isoDate)}
                className={`flex flex-col items-center justify-center min-w-[62px] py-2.5 px-2 rounded-2xl border transition cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-[#08BDF4] bg-[#08BDF4] text-white shadow-md shadow-[#08BDF4]/25'
                    : 'border-[#E5EEF4] bg-white text-[#183247] hover:border-[#08BDF4]/40'
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

      {/* 2. Time Slot Selector */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-[#183247] mb-2.5 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#08BDF4]" />
          <span>{t.selectDeliveryTime}</span>
        </label>

        <div className="flex flex-col gap-2">
          {TIME_SLOTS.map(slot => {
            const slotText = language === 'ar' ? slot.textAr : slot.textEn;
            const isSelected = selectedSlot === slot.textAr || selectedSlot === slot.textEn;

            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.textAr)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition cursor-pointer text-start ${
                  isSelected
                    ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0] shadow-xs'
                    : 'border-[#E5EEF4] bg-white text-[#183247] hover:bg-slate-50'
                }`}
              >
                <span>{slotText}</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-[#08BDF4] bg-[#08BDF4] text-white' : 'border-[#E5EEF4]'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Delivery Instructions */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-[#183247] mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#08BDF4]" />
          <span>{t.deliveryInstructions}</span>
        </label>
        <textarea
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder={
            language === 'ar'
              ? 'مثال: يرجى الاتصال قبل الوصول بـ 10 دقائق، رن جرس الشقة...'
              : 'e.g., Please ring the bell, call 10 mins prior...'
          }
          rows={2}
          className="w-full p-3 rounded-2xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-xs bg-white resize-none"
        />
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
          <span>{language === 'ar' ? 'متابعة إلى مراجعة وتأكيد الطلب' : 'Proceed to Checkout'}</span>
          {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
