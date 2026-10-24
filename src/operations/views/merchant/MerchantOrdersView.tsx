import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { LaundryOrder, OrderLifecycleStatus } from '../../types';
import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Truck,
  Eye,
  Camera,
  Plus,
  HelpCircle,
  Check,
  Send
} from 'lucide-react';

export const MerchantOrdersView: React.FC = () => {
  const {
    filteredOrders,
    acceptOrder,
    rejectOrder,
    recordIntakeInspection,
    simulateCustomerApproval,
    startOrderProcessing,
    markOrderReadyForDelivery,
    completeOrder,
    language
  } = useOperations();

  const isRtl = language === 'ar';

  const [activeIntakeOrder, setActiveIntakeOrder] = useState<LaundryOrder | null>(null);
  const [rejectOrderModal, setRejectOrderModal] = useState<LaundryOrder | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Intake Form State
  const [intakeDiscrepancyReason, setIntakeDiscrepancyReason] = useState('');
  const [extraCharge, setExtraCharge] = useState<number>(0);
  const [requireApproval, setRequireApproval] = useState<boolean>(false);
  const [itemInspections, setItemInspections] = useState<Record<string, { qty: number; notes: string }>>({});

  const openIntakeModal = (ord: LaundryOrder) => {
    setActiveIntakeOrder(ord);
    const initialMap: Record<string, { qty: number; notes: string }> = {};
    ord.items.forEach(i => {
      initialMap[i.id] = {
        qty: i.receivedQuantity !== undefined ? i.receivedQuantity : i.quantity,
        notes: i.stainDamageNotes || ''
      };
    });
    setItemInspections(initialMap);
    setIntakeDiscrepancyReason(ord.discrepancy?.reason || '');
    setExtraCharge(ord.discrepancy?.differenceEgp || 0);
    setRequireApproval(ord.discrepancy?.customerApprovalStatus === 'pending');
  };

  const handleSaveIntake = () => {
    if (!activeIntakeOrder) return;
    const inspectedArray = activeIntakeOrder.items.map(item => ({
      itemId: item.id,
      receivedQty: itemInspections[item.id]?.qty ?? item.quantity,
      stainsDamageNote: itemInspections[item.id]?.notes,
      unitPrice: item.unitPrice
    }));

    recordIntakeInspection(
      activeIntakeOrder.id,
      inspectedArray,
      intakeDiscrepancyReason,
      extraCharge,
      requireApproval
    );
    setActiveIntakeOrder(null);
  };

  const handleConfirmReject = () => {
    if (!rejectOrderModal || !rejectReason.trim()) return;
    rejectOrder(rejectOrderModal.id, rejectReason.trim());
    setRejectOrderModal(null);
    setRejectReason('');
  };

  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'new' | 'intake' | 'approval' | 'processing' | 'ready' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const displayedOrders = filteredOrders.filter(ord => {
    if (selectedStatusTab === 'new' && ord.status !== 'awaiting_laundry_confirmation') return false;
    if (selectedStatusTab === 'intake' && ord.status !== 'inspection_required') return false;
    if (selectedStatusTab === 'approval' && ord.status !== 'awaiting_customer_approval') return false;
    if (selectedStatusTab === 'processing' && ord.status !== 'processing') return false;
    if (selectedStatusTab === 'ready' && ord.status !== 'ready_for_delivery') return false;
    if (selectedStatusTab === 'completed' && ord.status !== 'completed' && ord.status !== 'delivered') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.customerPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#08BDF4]" />
            <span>{isRtl ? 'طلبات المغسلة وفحص الاستلام' : 'Store Orders & Intake Inspection'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRtl
              ? 'فحص أكياس الملابس عند الاستلام، تسجيل فروقات القطع والبقع، وإشعار العميل بأي مبالغ إضافية للموافقة قبل بدء الغسيل.'
              : 'Inspect received garment bags, log stains or item discrepancies, and request customer price approval.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: isRtl ? 'الكل' : 'All' },
            { id: 'new', label: isRtl ? 'جديدة' : 'New' },
            { id: 'intake', label: isRtl ? 'مطلوب فحص' : 'Intake Check' },
            { id: 'approval', label: isRtl ? 'موافقة العميل' : 'Approval' },
            { id: 'processing', label: isRtl ? 'قيد الغسيل' : 'Processing' },
            { id: 'ready', label: isRtl ? 'جاهز للتسليم' : 'Ready' },
            { id: 'completed', label: isRtl ? 'مكتمل' : 'Completed' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedStatusTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                selectedStatusTab === t.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Search */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={
            isRtl
              ? 'بحث برقم الطلب، اسم العميل، أو رقم الهاتف...'
              : 'Search by order #, customer name, or phone...'
          }
          className="w-full text-xs bg-transparent focus:outline-hidden text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-sm">
              {isRtl ? 'لا توجد طلبات مطابقة للمعايير المحددة' : 'No orders matching criteria'}
            </p>
          </div>
        ) : (
          displayedOrders.map(ord => {
            const isAwaitingAcceptance = ord.status === 'awaiting_laundry_confirmation';
            const isInspectionRequired = ord.status === 'inspection_required';
            const isAwaitingApproval = ord.status === 'awaiting_customer_approval';
            const isProcessing = ord.status === 'processing';
            const isReadyForDelivery = ord.status === 'ready_for_delivery';
            const isDelivered = ord.status === 'delivered';

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-900">
                        {ord.orderNumber}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-800">{ord.customerName}</span>
                      <span className="text-slate-500 text-xs font-mono dir-ltr inline-block">
                        ({ord.customerPhone})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {ord.neighborhood} - {ord.pickupAddress}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isAwaitingAcceptance
                          ? 'bg-amber-100 text-amber-800'
                          : isInspectionRequired
                          ? 'bg-purple-100 text-purple-800'
                          : isAwaitingApproval
                          ? 'bg-orange-100 text-orange-800'
                          : isProcessing
                          ? 'bg-indigo-100 text-indigo-800'
                          : isReadyForDelivery
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isAwaitingAcceptance
                        ? isRtl ? 'طلب جديد وارد' : 'New Order'
                        : isInspectionRequired
                        ? isRtl ? 'الملابس بالمغسلة (مطلوب فحص)' : 'Intake Inspection'
                        : isAwaitingApproval
                        ? isRtl ? 'بانتظار موافقة العميل على الفروق' : 'Awaiting Cust. Approval'
                        : isProcessing
                        ? isRtl ? 'قيد الغسيل والكي' : 'Processing'
                        : isReadyForDelivery
                        ? isRtl ? 'جاهز للتسليم النهائي' : 'Ready for Delivery'
                        : isRtl ? 'مكتمل' : 'Completed'}
                    </span>
                  </div>
                </div>

                {/* Items & Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Items Preview */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="font-bold text-slate-700 block">
                      {isRtl ? 'محتويات كيس الملابس:' : 'Garment Bag Items:'}
                    </span>
                    <div className="space-y-1.5">
                      {ord.items.map(item => (
                        <div
                          key={item.id}
                          className="p-2 bg-slate-50 rounded-xl flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-800">
                              {item.quantity}× {item.nameAr}
                            </span>
                            <span className="text-[11px] text-slate-500 mr-2">
                              ({item.serviceType === 'wash_iron' ? 'غسيل وكي' : 'دراي كلين'})
                            </span>
                            {item.stainDamageNotes && (
                              <div className="text-[10px] text-amber-700 mt-0.5">
                                ⚠️ ملاحظة الفحص: {item.stainDamageNotes}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-slate-900">{item.subtotal} ج.م</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Merchant Financial Ledger */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
                      {isRtl ? 'المحاسبة المالية للمغسلة:' : 'Financial Ledger:'}
                    </span>
                    <div className="flex justify-between text-slate-600">
                      <span>{isRtl ? 'قيمة الغسيل:' : 'Subtotal:'}</span>
                      <span className="font-bold text-slate-900">{ord.laundrySubtotal} ج.م</span>
                    </div>
                    <div className="flex justify-between text-purple-700 font-semibold">
                      <span>{isRtl ? 'عمولة المنصة (8%):' : 'Commission (8%):'}</span>
                      <span className="font-mono">-{ord.commissionAmount} ج.م</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                      <span className="text-emerald-700">{isRtl ? 'صافي مستحقك:' : 'Your Net:'}</span>
                      <span className="text-emerald-700 font-black">{ord.merchantPayableAmount} ج.م</span>
                    </div>
                  </div>
                </div>

                {/* Discrepancy Alert & Customer Simulation (If active) */}
                {ord.discrepancy && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>{isRtl ? 'فروقات فحص الاستلام:' : 'Intake Discrepancy Recorded:'}</span>
                      </div>
                      <p className="text-amber-800 mt-0.5">
                        {ord.discrepancy.reason} (+{ord.discrepancy.differenceEgp} ج.م)
                      </p>
                      <div className="text-[10px] text-amber-700 mt-1">
                        {isRtl ? 'حالة موافقة العميل: ' : 'Customer Approval Status: '}
                        <strong>
                          {ord.discrepancy.customerApprovalStatus === 'pending'
                            ? isRtl ? 'بانتظار رد العميل' : 'Pending Response'
                            : ord.discrepancy.customerApprovalStatus === 'approved'
                            ? isRtl ? 'وافق العميل' : 'Approved'
                            : isRtl ? 'رفض العميل' : 'Rejected'}
                        </strong>
                      </div>
                    </div>

                    {/* Interactive Customer Approval Simulator Button */}
                    {ord.discrepancy.customerApprovalStatus === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => simulateCustomerApproval(ord.id, true)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer text-xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'محاكاة موافقة العميل' : 'Simulate Approval'}</span>
                        </button>
                        <button
                          onClick={() => simulateCustomerApproval(ord.id, false)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg cursor-pointer text-xs"
                        >
                          {isRtl ? 'رفض' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Workflow Actions Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="text-[11px] text-slate-400">
                    {isRtl ? 'الخطوة التشغيلية التالية للمغسلة' : 'Next Store Workflow Step'}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {isAwaitingAcceptance && (
                      <>
                        <button
                          onClick={() => setRejectOrderModal(ord)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          {isRtl ? 'رفض الطلب' : 'Reject'}
                        </button>
                        <button
                          onClick={() => acceptOrder(ord.id)}
                          className="px-4 py-1.5 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-xs"
                        >
                          {isRtl ? 'قبول وبدء الجدولة' : 'Accept Order'}
                        </button>
                      </>
                    )}

                    {isInspectionRequired && (
                      <button
                        onClick={() => openIntakeModal(ord)}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{isRtl ? 'فحص الاستلام وتأكيد القطع' : 'Perform Intake Inspection'}</span>
                      </button>
                    )}

                    {isProcessing && (
                      <button
                        onClick={() => markOrderReadyForDelivery(ord.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        <span>{isRtl ? 'اكتمل الغسيل والكي - جاهز للتوصيل' : 'Ready for Return Delivery'}</span>
                      </button>
                    )}

                    {isReadyForDelivery && (
                      <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isRtl ? 'تم إدراج مهمة الإرجاع في غرفة التوزيع' : 'Return job dispatched'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Intake & Discrepancy Inspection Modal */}
      {activeIntakeOrder && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#08BDF4]">
                  {activeIntakeOrder.orderNumber}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {isRtl ? 'فحص الاستلام وتدقيق قطع الملابس (Intake Discrepancy)' : 'Garment Intake Inspection'}
                </h3>
                <p className="text-slate-500">
                  {isRtl ? 'مطابقة عدد القطع وحالتها الفيزيائية مع طلب العميل' : 'Verify item counts and physical condition'}
                </p>
              </div>
              <button
                onClick={() => setActiveIntakeOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Garments Check Table */}
            <div className="space-y-3">
              <span className="font-bold text-slate-800 block">
                {isRtl ? 'تدقيق القطع المستلمة وتسجيل البقع أو التلفيات:' : 'Count & Stain Inspection:'}
              </span>

              <div className="space-y-2">
                {activeIntakeOrder.items.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.nameAr}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{isRtl ? 'الكمية المستلمة فعلياً:' : 'Counted Qty:'}</span>
                        <input
                          type="number"
                          min="0"
                          value={itemInspections[item.id]?.qty ?? item.quantity}
                          onChange={e =>
                            setItemInspections(prev => ({
                              ...prev,
                              [item.id]: {
                                ...prev[item.id],
                                qty: Number(e.target.value)
                              }
                            }))
                          }
                          className="w-16 p-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold"
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder={
                        isRtl
                          ? 'ملاحظات الفحص (مثال: بقعة زيت قديمة بالياقة / زرار مقطوع)...'
                          : 'Stain or damage notes...'
                      }
                      value={itemInspections[item.id]?.notes ?? ''}
                      onChange={e =>
                        setItemInspections(prev => ({
                          ...prev,
                          [item.id]: {
                            ...prev[item.id],
                            notes: e.target.value
                          }
                        }))
                      }
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Extra Discrepancy & Adjustment Section */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{isRtl ? 'فروقات إضافية تتطلب تعديل السعر:' : 'Extra Item Discrepancy / Extra Charges:'}</span>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  {isRtl ? 'سبب الفرق (قطعة إضافية غير مسجلة، بقعة تتطلب مذيب خاص):' : 'Reason for adjustment:'}
                </label>
                <input
                  type="text"
                  value={intakeDiscrepancyReason}
                  onChange={e => setIntakeDiscrepancyReason(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'مثال: وجد في الحقيبة فستان سواريه إضافي غير مضاف بالطلب'
                      : 'e.g. Extra evening dress found in bag'
                  }
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-slate-700 font-semibold block mb-1">
                    {isRtl ? 'قيمة المبلغ الإضافي (ج.م):' : 'Extra Charge (EGP):'}
                  </label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    value={extraCharge}
                    onChange={e => setExtraCharge(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold font-mono text-xs"
                  />
                </div>

                <div className="flex-1 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={requireApproval}
                      onChange={e => setRequireApproval(e.target.checked)}
                      className="w-4 h-4 rounded text-[#08BDF4]"
                    />
                    <span>{isRtl ? 'يتطلب موافقة العميل أولاً' : 'Requires Customer Approval'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveIntakeOrder(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveIntake}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl cursor-pointer"
              >
                {isRtl ? 'تأكيد وحفظ فحص الاستلام' : 'Confirm Intake Inspection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Order Modal */}
      {rejectOrderModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <h3 className="text-base font-black text-rose-700">
              {isRtl ? 'رفض استقبال الطلب' : 'Reject Laundry Order'}
            </h3>
            <p className="text-slate-500">
              {isRtl ? 'يرجى كتابة سبب الرفض لتوجيهه لخدمة العملاء والديسباتشر' : 'Please provide reason for order rejection'}
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder={isRtl ? 'مثال: تجاوز الطاقة الاستيعابية اليومية للمغسلة' : 'e.g. Daily washing capacity exceeded'}
              className="w-full p-2.5 border border-slate-200 rounded-xl"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectOrderModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                disabled={!rejectReason.trim()}
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50"
              >
                {isRtl ? 'تأكيد الرفض' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
