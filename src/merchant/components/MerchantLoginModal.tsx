import React, { useState } from 'react';
import { useMerchantAuth } from '../context/MerchantAuthContext';
import { Store, ShieldCheck, Lock, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MerchantLoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const MerchantLoginModal: React.FC<MerchantLoginModalProps> = ({ isOpen, onClose }) => {
  const { availableMerchants, login, activeMerchant } = useMerchantAuth();
  const [selectedId, setSelectedId] = useState<string>(activeMerchant?.id || 'm-zag-01');
  const [pinCode, setPinCode] = useState<string>('');
  const [staffName, setStaffName] = useState<string>('أحمد فتحي - مسؤول الوردية');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) {
      setError('يرجى اختيار المغسلة المصرح لها');
      return;
    }

    const success = login(selectedId, pinCode, staffName);
    if (success) {
      setError('');
      if (onClose) onClose();
    } else {
      setError('فشل تسجيل الدخول. يرجى مراجعة الصلاحيات');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-right" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-cyan-500 p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black">بوابة شريك المغسلة — عالسريع</h2>
          <p className="text-sky-100 text-xs mt-1">
            تسجيل دخول آمن لموظفي ومسؤولي كاونتر استلام الغسيل
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleLogin} className="p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-200 flex items-center gap-2">
              <span className="font-bold">تنبيه:</span> {error}
            </div>
          )}

          {/* Select Merchant Laundry */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              اختر فرع المغسلة المعتمد:
            </label>
            <div className="space-y-2">
              {availableMerchants.map(m => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-right p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                    selectedId === m.id
                      ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      selectedId === m.id ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {m.nameAr.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{m.nameAr}</div>
                      <div className="text-[11px] text-slate-500">{m.city} - {m.district}</div>
                    </div>
                  </div>
                  {selectedId === m.id && (
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Staff Member Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم مسؤول الاستلام / الكاونتر الحالي:
            </label>
            <div className="relative">
              <input
                type="text"
                value={staffName}
                onChange={e => setStaffName(e.target.value)}
                placeholder="مثال: أحمد فتحي - فني الكاونتر"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 pl-8"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Fast PIN / Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              رمز الدخول السريع (PIN للوردية):
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={pinCode}
                onChange={e => setPinCode(e.target.value)}
                placeholder="1 2 3 4 (اختياري للتجربة)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 tracking-widest pl-8"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              * في البيئة التجريبية، يتم تسجيل الدخول الفوري دون حاجة لكلمة سر معقدة.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تأكيد تسجيل الدخول لبوابة المغسلة</span>
          </button>
        </form>
      </div>
    </div>
  );
};
