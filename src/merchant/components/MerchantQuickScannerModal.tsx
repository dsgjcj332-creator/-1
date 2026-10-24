import React, { useState } from 'react';
import { useMerchantAuth } from '../context/MerchantAuthContext';
import { LaundryOrder } from '../../operations/types';
import { QrCode, Search, CheckCircle2, AlertCircle, X, ShoppingBag, ArrowRight } from 'lucide-react';

interface MerchantQuickScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (order: LaundryOrder) => void;
}

export const MerchantQuickScannerModal: React.FC<MerchantQuickScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectOrder
}) => {
  const { merchantOrders } = useMerchantAuth();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<LaundryOrder | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const term = barcodeInput.toLowerCase().trim();
    const found = merchantOrders.find(
      o =>
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerPhone.includes(term) ||
        o.customerName.toLowerCase().includes(term)
    );

    setSearched(true);
    setMatchedOrder(found || null);
  };

  const handleQuickPreset = (orderNum: string) => {
    setBarcodeInput(orderNum);
    const found = merchantOrders.find(o => o.orderNumber === orderNum);
    setSearched(true);
    setMatchedOrder(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-right" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-cyan-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">مسح باركود كيس الملابس السريع</h3>
              <p className="text-[11px] text-sky-100">ابحث برقم الباركود أو هاتف العميل</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ادخل رقم الطلب أو باركود الكيس:
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={barcodeInput}
                  onChange={e => {
                    setBarcodeInput(e.target.value);
                    setSearched(false);
                  }}
                  placeholder="مثال: ORD-2026-0814 أو رقم الهاتف..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>فحص ومطابقة الطلب</span>
            </button>
          </form>

          {/* Quick Click presets */}
          <div>
            <div className="text-[11px] text-slate-500 font-bold mb-1.5">أحدث الطلبات في الكاونتر:</div>
            <div className="flex flex-wrap gap-1.5">
              {merchantOrders.slice(0, 3).map(ord => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => handleQuickPreset(ord.orderNumber)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-lg text-xs font-mono font-bold transition cursor-pointer"
                >
                  {ord.orderNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result Box */}
          {searched && (
            <div className="pt-2 border-t border-slate-100">
              {matchedOrder ? (
                <div className="bg-sky-50 p-3.5 rounded-xl border border-sky-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-sky-950">
                      {matchedOrder.orderNumber}
                    </span>
                    <span className="text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full font-bold">
                      {matchedOrder.items.length} قطع
                    </span>
                  </div>

                  <div className="text-xs text-slate-700">
                    <div>العميل: <span className="font-bold">{matchedOrder.customerName}</span></div>
                    <div className="text-slate-500 text-[11px]">{matchedOrder.customerPhone}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectOrder(matchedOrder);
                      onClose();
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>فتح الفحص والمطابقة فوراً</span>
                  </button>
                </div>
              ) : (
                <div className="bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>لم يتم العثور على طلب بهذا الرقم في مغسلتك الحالية. تأكد من الرقم.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
