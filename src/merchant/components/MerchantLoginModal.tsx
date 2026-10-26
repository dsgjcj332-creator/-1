import React, { useState, useEffect } from 'react';
import { useMerchantAuth } from '../context/MerchantAuthContext';
import { Store, ShieldCheck, Lock, UserCheck, CheckCircle2, X, ArrowLeft } from 'lucide-react';

interface MerchantLoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onBackToLanding?: () => void;
}

export const MerchantLoginModal: React.FC<MerchantLoginModalProps> = ({
  isOpen,
  onClose,
  onBackToLanding
}) => {
  const { availableMerchants, login, activeMerchant, isAuthenticated } = useMerchantAuth();
  const [selectedId, setSelectedId] = useState<string>(activeMerchant?.id || availableMerchants[0]?.id || '');
  const [pinCode, setPinCode] = useState<string>('');
  const [staffName, setStaffName] = useState<string>(
    activeMerchant?.ownerName || activeMerchant?.nameAr || 'مسؤول المغسلة'
  );
  const [error, setError] = useState<string>('');

  // Keep selected ID and staff name synchronized with active merchant
  useEffect(() => {
    if (activeMerchant) {
      setSelectedId(activeMerchant.id);
      setStaffName(activeMerchant.ownerName || activeMerchant.nameAr || 'مسؤول المغسلة');
    } else if (availableMerchants.length > 0 && !selectedId) {
      setSelectedId(availableMerchants[0].id);
    }
  }, [activeMerchant, availableMerchants, isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) {
      setError('يرجى اختيار الفرع المطلوب');
      return;
    }

    const success = login(selectedId, pinCode, staffName);
    if (success) {
      setError('');
      if (onClose) onClose();
    } else {
      setError('كلمة المرور غير صحيحة، يرجى التأكد وإعادة المحاولة');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-right relative"
        dir="rtl"
      >
        {/* Header with Close (X) button */}
        <div className="bg-gradient-to-r from-sky-600 to-cyan-500 p-6 text-white text-center relative">
          {/* Close X Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 start-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="w-13 h-13 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-inner">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-black">بيانات فرع المغسلة</h2>
          <p className="text-sky-100 text-xs mt-1">
            {isAuthenticated
              ? 'معاينة الفرع المعتمد ومسؤول الوردية الحالي'
              : 'تسجيل دخول وتأكيد الفرع المعتمد لبوابة الشركاء'}
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-200 flex items-center gap-2">
              <span className="font-bold">تنبيه:</span> {error}
            </div>
          )}

          {/* Select Merchant Laundry */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              الفرع المعتمد حالياً:
            </label>
            <div className="space-y-2">
              {availableMerchants.map(m => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-right p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                    selectedId === m.id
                      ? 'border-sky-500 bg-sky-50/70 shadow-xs ring-1 ring-sky-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        selectedId === m.id ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.nameAr.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{m.nameAr}</div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {m.city} - {m.district || m.address}
                      </div>
                    </div>
                  </div>
                  {selectedId === m.id && (
                    <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
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
                placeholder="اسم المسؤول الحالي"
                className="w-full ps-3 pe-9 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-start"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute end-2.5 top-2.5" />
            </div>
          </div>

          {/* Fast PIN / Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              كلمة مرور الحساب (PIN للوردية):
            </label>
            <div className="relative">
              <input
                type="password"
                value={pinCode}
                onChange={e => setPinCode(e.target.value)}
                placeholder="كلمة مرور الحساب (اختياري عند التبديل)"
                className="w-full ps-3 pe-9 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-start"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute end-2.5 top-2.5" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              * إذا كنت مسجل دخول بالفعل، يمكنك تأكيد الفرع أو إغلاق النافذة مباشرة.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>تأكيد ومتابعة في بوابة المغسلة</span>
            </button>

            <div className="flex items-center gap-2">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer text-center"
                >
                  إغلاق النافذة
                </button>
              )}

              {onBackToLanding && (
                <button
                  type="button"
                  onClick={onBackToLanding}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>الموقع الرئيسي</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
