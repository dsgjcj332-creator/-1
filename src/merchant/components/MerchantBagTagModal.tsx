import React from 'react';
import { LaundryOrder } from '../../operations/types';
import { Printer, X, Check, QrCode, Tag, Sparkles } from 'lucide-react';

interface MerchantBagTagModalProps {
  order: LaundryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  merchantName: string;
}

export const MerchantBagTagModal: React.FC<MerchantBagTagModalProps> = ({
  order,
  isOpen,
  onClose,
  merchantName
}) => {
  if (!isOpen || !order) return null;

  const totalGarments = order.items.reduce((acc, curr) => {
    return acc + (curr.receivedQuantity !== undefined ? curr.receivedQuantity : curr.quantity);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden text-right" dir="rtl">
        {/* Modal Controls */}
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-slate-800">بوليصة كيس المغسلة (Bag Tag)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Slip Area */}
        <div className="p-5 bg-white font-mono text-slate-800 text-xs space-y-3 border-dashed border-b-2 border-slate-300 select-all" id="printable-thermal-slip">
          {/* Slip Header */}
          <div className="text-center pb-2 border-b border-slate-300">
            <div className="text-base font-black tracking-tight text-slate-900">عالسريع — ALA EL SAREE</div>
            <div className="text-[11px] font-bold text-slate-600 mt-0.5">{merchantName}</div>
            <div className="text-[10px] text-slate-500">تذكرة فحص وتعريف الملابس في المغسلة</div>
          </div>

          {/* Barcode Mock */}
          <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center space-y-1">
            <div className="text-xs font-extrabold tracking-widest text-slate-900 font-mono">
              {order.orderNumber}
            </div>
            <div className="flex justify-center items-center gap-0.5 h-7 overflow-hidden opacity-80">
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 h-full"
                  style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1.5px' : '1px' }}
                />
              ))}
            </div>
            <div className="text-[9px] text-slate-400 font-sans">امسح الباركود عند كاونتر الاستلام والتسليم</div>
          </div>

          {/* Customer & Order Metadata */}
          <div className="space-y-1 text-[11px] py-1 border-b border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">العميل:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">الهاتف:</span>
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">المنطقة:</span>
              <span>{order.neighborhood} - {order.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">تاريخ الاستلام:</span>
              <span>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>
          </div>

          {/* Itemized List */}
          <div>
            <div className="flex justify-between font-bold text-[11px] border-b border-slate-300 pb-1 mb-1">
              <span>القطعة</span>
              <span>العدد</span>
              <span>الخدمة</span>
            </div>
            <div className="space-y-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-start text-[11px]">
                  <span className="truncate max-w-[130px] font-sans font-medium">{it.nameAr}</span>
                  <span className="font-bold font-mono">×{it.receivedQuantity ?? it.quantity}</span>
                  <span className="text-[10px] text-slate-500">
                    {it.serviceType === 'wash_iron' ? 'غسيل وكوي' : it.serviceType === 'dry_clean' ? 'تنظيف جاف' : 'كوي'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {(order.specialInstructions || order.discrepancy?.photoNotes) && (
            <div className="bg-amber-50 p-2 rounded text-[10px] text-amber-900 border border-amber-200">
              <span className="font-bold">ملاحظات العناية: </span>
              <span>{order.specialInstructions || order.discrepancy?.photoNotes}</span>
            </div>
          )}

          {/* Slip Summary */}
          <div className="pt-2 border-t border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between font-bold">
              <span>إجمالي القطع في الكيس:</span>
              <span className="font-mono text-sm text-sky-700">{totalGarments} قطعة</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">قيمة الغسيل:</span>
              <span className="font-bold">{order.laundrySubtotal + (order.adjustmentsTotal || 0)} ج.م</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>طريقة الدفع:</span>
              <span>{order.paymentMethod === 'cash_on_delivery' ? 'كاش عند الاستلام' : 'مدفوع إلكترونياً'}</span>
            </div>
          </div>

          <div className="text-center text-[9px] text-slate-400 pt-1">
            شكراً لثقتكم — عالسريع Ala El Saree Hotline 19000
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التذكرة (Print)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
