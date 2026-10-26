import React, { useState } from 'react';
import { LaundryOrder } from '../../operations/types';
import { useOperations } from '../../operations/context/OperationsContext';
import {
  CheckCircle2,
  AlertTriangle,
  Camera,
  Plus,
  Minus,
  Sparkles,
  Send,
  Printer,
  X,
  FileText,
  ShieldAlert,
  Info
} from 'lucide-react';

interface MerchantIntakeModalProps {
  order: LaundryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBagTag?: (order: LaundryOrder) => void;
}

export const MerchantIntakeModal: React.FC<MerchantIntakeModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenBagTag
}) => {
  const { recordIntakeInspection, simulateCustomerApproval, startOrderProcessing } = useOperations();

  if (!isOpen || !order) return null;

  // Item counts & condition tracking
  const [itemsMap, setItemsMap] = useState<Record<string, { qty: number; notes: string; condition: string }>>(() => {
    const initial: Record<string, { qty: number; notes: string; condition: string }> = {};
    order.items.forEach(it => {
      initial[it.id] = {
        qty: it.receivedQuantity !== undefined ? it.receivedQuantity : it.quantity,
        notes: it.stainDamageNotes || '',
        condition: 'good'
      };
    });
    return initial;
  });

  const [extraDiscrepancyReason, setExtraDiscrepancyReason] = useState<string>(
    order.discrepancy?.reason || ''
  );
  const [extraChargeEgp, setExtraChargeEgp] = useState<number>(
    order.discrepancy?.differenceEgp || 0
  );
  const [requireCustomerApproval, setRequireCustomerApproval] = useState<boolean>(
    order.discrepancy?.customerApprovalStatus === 'pending' || false
  );
  const [intakePhotoUploaded, setIntakePhotoUploaded] = useState<boolean>(false);
  const [activeStepTab, setActiveStepTab] = useState<'inspection' | 'approval' | 'treatment'>('inspection');

  // Handle Qty change
  const handleUpdateQty = (itemId: string, delta: number) => {
    setItemsMap(prev => {
      const current = prev[itemId] || { qty: 1, notes: '', condition: 'good' };
      const newQty = Math.max(0, current.qty + delta);
      return {
        ...prev,
        [itemId]: { ...current, qty: newQty }
      };
    });
  };

  const handleUpdateNotes = (itemId: string, notes: string) => {
    setItemsMap(prev => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || { qty: 1, condition: 'good' }), notes }
    }));
  };

  const handleUpdateCondition = (itemId: string, condition: string) => {
    setItemsMap(prev => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || { qty: 1, notes: '' }), condition }
    }));
  };

  // Calculate revised total
  const calculatedItemsTotal = order.items.reduce((sum, item) => {
    const qty = itemsMap[item.id]?.qty ?? item.quantity;
    return sum + (qty * item.unitPrice);
  }, 0);

  const totalRevisedLaundry = calculatedItemsTotal + Number(extraChargeEgp || 0);
  const diffFromOriginal = totalRevisedLaundry - order.laundrySubtotal;

  const handleSaveInspection = () => {
    const inspectedItems = order.items.map(item => ({
      itemId: item.id,
      receivedQty: itemsMap[item.id]?.qty ?? item.quantity,
      stainsDamageNote: itemsMap[item.id]?.notes
        ? `${itemsMap[item.id]?.condition !== 'good' ? `[حالة: ${itemsMap[item.id]?.condition}] ` : ''}${itemsMap[item.id]?.notes}`
        : (itemsMap[item.id]?.condition !== 'good' ? `حالة: ${itemsMap[item.id]?.condition}` : undefined),
      unitPrice: item.unitPrice
    }));

    recordIntakeInspection(
      order.id,
      inspectedItems,
      extraDiscrepancyReason || (diffFromOriginal !== 0 ? `فرق فحص كاونتر: ${diffFromOriginal > 0 ? '+' : ''}${diffFromOriginal} ج.م` : undefined),
      diffFromOriginal > 0 ? diffFromOriginal : 0,
      requireCustomerApproval || diffFromOriginal > 0
    );

    onClose();
  };

  const handleDirectStartWash = () => {
    handleSaveInspection();
    startOrderProcessing(order.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col max-h-[92vh]" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-cyan-500 p-4 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black">فحص ومطابقة استلام الملابس</span>
              <span className="bg-white/20 text-white font-mono text-xs px-2 py-0.5 rounded-md font-bold">
                {order.orderNumber}
              </span>
            </div>
            <p className="text-sky-100 text-xs mt-0.5">
              العميل: {order.customerName} • {order.customerPhone} • {order.neighborhood}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-2 sm:px-4 text-xs font-bold shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveStepTab('inspection')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeStepTab === 'inspection'
                ? 'border-sky-500 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>مطابقة القطع والعدد</span>
            <span className="bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded-full text-[10px]">
              {order.items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveStepTab('approval')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeStepTab === 'approval'
                ? 'border-sky-500 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>فروقات السعر وموافقة العميل</span>
            {diffFromOriginal !== 0 && (
              <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {diffFromOriginal > 0 ? `+${diffFromOriginal}` : diffFromOriginal} ج.م
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveStepTab('treatment')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeStepTab === 'treatment'
                ? 'border-sky-500 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>تعليمات العناية والتصوير</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {activeStepTab === 'inspection' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-xs text-sky-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">إرشادات الكاونتر: </span>
                  راجع عدد القطع المستلمة داخل الكيس. إذا كانت هناك قطعة إضافية أو ناقصة، عدّل العدد وسيتم احتساب الفرق تلقائياً.
                </div>
              </div>

              {/* Items Table / Cards */}
              <div className="space-y-3">
                {order.items.map(item => {
                  const currentQty = itemsMap[item.id]?.qty ?? item.quantity;
                  const itemSubtotal = currentQty * item.unitPrice;
                  const isQtyChanged = currentQty !== item.quantity;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition ${
                        isQtyChanged
                          ? 'border-amber-300 bg-amber-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{item.nameAr}</div>
                          <div className="text-[11px] text-slate-500">
                            {item.serviceType === 'wash_iron' ? 'غسيل وكوي بالبخار' : item.serviceType === 'dry_clean' ? 'دراي كلين جاف' : 'كوي فقط'} • {item.unitPrice} ج.م / قطعة
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs cursor-pointer font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <div className="w-9 text-center">
                            <span className="font-black text-xs font-mono text-slate-900">
                              {currentQty}
                            </span>
                            {isQtyChanged && (
                              <div className="text-[9px] text-amber-600 font-bold">
                                (الأصل {item.quantity})
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-xs cursor-pointer font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Condition & Defect Selector */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            حالة القطعة عند الاستلام:
                          </label>
                          <select
                            value={itemsMap[item.id]?.condition || 'good'}
                            onChange={e => handleUpdateCondition(item.id, e.target.value)}
                            className="w-full text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800"
                          >
                            <option value="good">سليمة بدون عيوب ظاهرة</option>
                            <option value="stains">يوجد بقع صعبة (زيت / صبغة / دم)</option>
                            <option value="torn">قطع في القماش أو أزرار مفقودة</option>
                            <option value="color_risk">قماش حساس يبهت ألوانه</option>
                            <option value="delicate">خامة حساسة (حرير / صوف طبيعي)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            ملاحظة الفحص (تظهر للعميل):
                          </label>
                          <input
                            type="text"
                            value={itemsMap[item.id]?.notes || ''}
                            onChange={e => handleUpdateNotes(item.id, e.target.value)}
                            placeholder="مثال: بقعة حبر على الياقة قبل البدء"
                            className="w-full text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeStepTab === 'approval' && (
            <div className="space-y-4">
              {/* Financial comparison card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>قيمة الطلب المبدئية عند الحجز:</span>
                  <span className="font-bold">{order.laundrySubtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>قيمة القطع الفعلية بعد الفحص:</span>
                  <span className="font-bold font-mono">{calculatedItemsTotal} ج.م</span>
                </div>
                {extraChargeEgp > 0 && (
                  <div className="flex justify-between text-xs text-amber-700">
                    <span>مصاريف معالجة إضافية (بقع / غسيل خاص):</span>
                    <span className="font-bold font-mono">+{extraChargeEgp} ج.م</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-black text-slate-900">
                  <span>الإجمالي الجديد المطلوب اعتماده:</span>
                  <span className="text-sky-700 font-mono text-base">{totalRevisedLaundry} ج.م</span>
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>صافي الفارق:</span>
                  <span className={`font-bold ${diffFromOriginal > 0 ? 'text-amber-600' : diffFromOriginal < 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {diffFromOriginal > 0 ? `زيادة (+${diffFromOriginal} ج.م)` : diffFromOriginal < 0 ? `نقصان (${diffFromOriginal} ج.م)` : 'مطابق تماماً'}
                  </span>
                </div>
              </div>

              {/* Extra charge manual input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  إضافة رسوم معالجة بقع أو غسيل خاص (اختياري ج.م):
                </label>
                <input
                  type="number"
                  min="0"
                  value={extraChargeEgp || ''}
                  onChange={e => setExtraChargeEgp(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              {/* Reason for customer */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  سبب تعديل السعر الموجه للعميل:
                </label>
                <textarea
                  rows={2}
                  value={extraDiscrepancyReason}
                  onChange={e => setExtraDiscrepancyReason(e.target.value)}
                  placeholder="مثال: تم العثور على بدلة إضافية داخل الكيس مع إزالة بقعة شحوم صعبة"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              {/* Approval status banner */}
              {order.discrepancy && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">حالة موافقة العميل الحالية: </span>
                    <span className="font-bold underline">
                      {order.discrepancy.customerApprovalStatus === 'pending'
                        ? 'بانتظار موافقة العميل'
                        : order.discrepancy.customerApprovalStatus === 'approved'
                        ? 'تمت الموافقة من العميل'
                        : 'تم الرفض'}
                    </span>
                  </div>

                  {order.discrepancy.customerApprovalStatus === 'pending' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => simulateCustomerApproval(order.id, true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer"
                      >
                        محاكاة: وافق العميل
                      </button>
                      <button
                        type="button"
                        onClick={() => simulateCustomerApproval(order.id, false)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer"
                      >
                        محاكاة: رفض
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeStepTab === 'treatment' && (
            <div className="space-y-4 text-xs">
              {/* Customer Documented Photos */}
              {order.photos && order.photos.length > 0 && (
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5 space-y-2">
                  <div className="font-bold text-sky-950 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-sky-600" />
                    <span>صور توثيق العميل قبل الاستلام ({order.photos.length} قطع):</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {order.photos.map((p, idx) => (
                      <div key={idx} className="bg-white rounded-lg border border-sky-200 overflow-hidden shadow-2xs">
                        <img src={p.photoUrl} alt={p.garmentNameAr} className="w-full h-24 object-cover" />
                        <div className="p-1.5 text-[10px]">
                          <div className="font-bold text-slate-800 truncate">{p.garmentNameAr}</div>
                          <div className="text-emerald-700 font-semibold">{p.tag || 'سليمة'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Special Instructions */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">تعليمات العميل الخاصة المسجلة في التطبيق:</div>
                <div className="text-slate-600">
                  {order.specialInstructions || 'لا توجد تعليمات خاصة إضافية من العميل'}
                </div>
              </div>

              {/* Photo Simulation */}
              <div className="border border-slate-200 rounded-xl p-4 text-center space-y-2">
                <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mx-auto text-sky-600">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-800">تصوير حالة الملابس أو البقع بالكاونتر</div>
                <p className="text-[11px] text-slate-500">
                  التقط صورة لحفظ حق المغسلة والعميل قبل بدء دورة الغسيل
                </p>

                {intakePhotoUploaded ? (
                  <div className="bg-emerald-50 text-emerald-700 text-xs p-2 rounded-lg font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم حفظ صورة الفحص في سجل الطلب بنجاح</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIntakePhotoUploaded(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                  >
                    📸 التقاط صورة الفحص بالكاميرا
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenBagTag && (
              <button
                type="button"
                onClick={() => onOpenBagTag(order)}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[40px]"
              >
                <Printer className="w-4 h-4 text-sky-600" />
                <span>طباعة بوليصة الكيس</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={handleSaveInspection}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm min-h-[40px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ نتائج الفحص</span>
            </button>

            <button
              type="button"
              onClick={handleDirectStartWash}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm min-h-[40px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>اعتماد وبدء الغسيل فوراً</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
