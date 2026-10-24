import React, { useState } from 'react';
import { useMerchantAuth } from '../context/MerchantAuthContext';
import {
  Store,
  Clock,
  ShoppingBag,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  Power
} from 'lucide-react';

export const MerchantStoreSettingsView: React.FC = () => {
  const {
    activeMerchant,
    isStoreAcceptingOrders,
    toggleStoreAcceptingOrders,
    dailyIntakeCap,
    setDailyIntakeCap
  } = useMerchantAuth();

  const [capacity, setCapacity] = useState<number>(dailyIntakeCap || 60);
  const [openingHours, setOpeningHours] = useState<string>(
    activeMerchant?.activeHours || '08:00 AM - 11:00 PM'
  );
  const [counterPhone, setCounterPhone] = useState<string>(activeMerchant?.phone || '01012345678');
  const [driverArrivalNote, setDriverArrivalNote] = useState<string>(
    'يرجى من الطيار الدخول مباشرة لكاونتر الاستلام في الخلف وتسليم باركود الكيس.'
  );
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDailyIntakeCap(capacity);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 text-right" dir="rtl">
      {/* Title */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-black text-slate-900">إعدادات تشغيل فرع المغسلة</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            تحكم فوري في سعة الاستقبال اليومية وساعات العمل وإرشادات الطيارين
          </p>
        </div>

        {/* Big Toggle */}
        <button
          type="button"
          onClick={toggleStoreAcceptingOrders}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
            isStoreAcceptingOrders
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-xs'
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 shadow-xs'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isStoreAcceptingOrders ? 'المغسلة تعمل وتستقبل أكياس' : 'المغسلة متوقفة مؤقتاً'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>تم حفظ تحديثات إعدادات الفرع وسعة الكاونتر بنجاح.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 sm:space-y-5">
        {/* Store Info Banner */}
        <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-100 flex items-center gap-3 text-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-sm truncate">{activeMerchant?.nameAr}</div>
            <div className="text-slate-500 text-[11px] truncate">{activeMerchant?.address} • {activeMerchant?.district}، {activeMerchant?.city}</div>
          </div>
        </div>

        {/* Daily Capacity */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-sky-600" />
            <span>سعة استقبال أكياس الغسيل اليومية (كيس/يوم):</span>
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3">
            <input
              type="number"
              min="10"
              max="300"
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
              className="w-32 px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold font-mono text-center focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <span className="text-[11px] sm:text-xs text-slate-500">
              عند وصول عدد الطلبات لهذا الحد، يتوقف استقبال طلبات إضافية لحين انتهاء الدفعات الحالية.
            </span>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>مواعيد تشغيل المغسلة واستلام الطيارين:</span>
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={e => setOpeningHours(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-sky-600" />
              <span>هاتف كاونتر المغسلة المباشر:</span>
            </label>
            <input
              type="text"
              value={counterPhone}
              onChange={e => setCounterPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Instructions for Drivers */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>ملاحظات وإرشادات وصول طياري ومندوبي المنصة:</span>
          </label>
          <textarea
            rows={3}
            value={driverArrivalNote}
            onChange={e => setDriverArrivalNote(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer transition"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات التشغيلية</span>
          </button>
        </div>
      </form>
    </div>
  );
};
