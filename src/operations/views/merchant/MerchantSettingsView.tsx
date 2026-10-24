import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { Settings, Save, CheckCircle2, Store, Clock, MapPin, Phone } from 'lucide-react';

export const MerchantSettingsView: React.FC = () => {
  const { currentMerchant, updateMerchantDetails, language } = useOperations();
  const isRtl = language === 'ar';

  const [activeHours, setActiveHours] = useState(currentMerchant?.activeHours || '09:00 ص - 11:30 م');
  const [capacity, setCapacity] = useState(currentMerchant?.capacityBagsPerDay || 45);
  const [address, setAddress] = useState(currentMerchant?.address || '');
  const [phone, setPhone] = useState(currentMerchant?.phone || '');
  const [payoutDetails, setPayoutDetails] = useState(currentMerchant?.payoutDetails || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!currentMerchant) {
    return <div className="p-8 text-center text-slate-500">لا توجد مغسلة محددة</div>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMerchantDetails(currentMerchant.id, {
      activeHours,
      capacityBagsPerDay: Number(capacity),
      address,
      phone,
      payoutDetails
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#08BDF4]" />
          <span>{isRtl ? 'بيانات وساعات عمل المغسلة' : 'Store Settings & Operations'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isRtl
            ? 'تعديل ساعات العمل اليومية، العنوان التفصيلي، والطاقة الاستيعابية اليومية للأكياس.'
            : 'Update daily working hours, bag intake capacity, and payout info.'}
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isRtl ? 'تم حفظ التعديلات بنجاح.' : 'Settings saved successfully.'}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px]">{isRtl ? 'رقم السجل التجاري:' : 'Commercial Reg:'}</span>
            <span className="font-bold font-mono text-slate-800">{currentMerchant.commercialRegNo}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">{isRtl ? 'البطاقة الضريبية:' : 'Tax Card #:'}</span>
            <span className="font-bold font-mono text-slate-800">{currentMerchant.taxNumber}</span>
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'ساعات العمل اليومية واستقبال الطلبات:' : 'Operating Hours:'}</label>
          <input
            type="text"
            value={activeHours}
            onChange={e => setActiveHours(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'الطاقة الاستيعابية القصوى (كيس ملابس / يوم):' : 'Daily Bag Capacity:'}</label>
          <input
            type="number"
            value={capacity}
            onChange={e => setCapacity(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'العنوان التفصيلي ونقطة الاستلام للمندوب:' : 'Detailed Address:'}</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'رقم الهاتف المباشر للمغسلة:' : 'Store Phone:'}</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono dir-ltr text-right"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'بيانات التحويل المعتمدة (InstaPay / حساب بنكي):' : 'Payout Details:'}</label>
          <input
            type="text"
            value={payoutDetails}
            onChange={e => setPayoutDetails(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2.5 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black rounded-xl cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? 'حفظ البيانات' : 'Save Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
