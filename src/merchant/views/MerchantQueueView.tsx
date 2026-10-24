import React, { useState } from 'react';
import { useMerchantAuth, WashProcessStage } from '../context/MerchantAuthContext';
import { useOperations } from '../../operations/context/OperationsContext';
import { LaundryOrder, OrderLifecycleStatus } from '../../operations/types';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Truck,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  ArrowRight,
  Check,
  RotateCw,
  Wind,
  Flame,
  Package
} from 'lucide-react';

interface MerchantQueueViewProps {
  onOpenIntake: (order: LaundryOrder) => void;
  onOpenBagTag: (order: LaundryOrder) => void;
  filterStatusPreset?: string;
}

export const MerchantQueueView: React.FC<MerchantQueueViewProps> = ({
  onOpenIntake,
  onOpenBagTag,
  filterStatusPreset
}) => {
  const { merchantOrders, activeMerchant, orderWashStages, setOrderWashStage } = useMerchantAuth();
  const {
    acceptOrder,
    rejectOrder,
    startOrderProcessing,
    markOrderReadyForDelivery,
    completeOrder,
    language
  } = useOperations();

  const isRtl = language === 'ar';

  const [activeTab, setActiveTab] = useState<string>(filterStatusPreset || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rejectModalOrder, setRejectModalOrder] = useState<LaundryOrder | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Status mapping badge helper
  const getStatusBadge = (status: OrderLifecycleStatus) => {
    switch (status) {
      case 'awaiting_laundry_confirmation':
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>طلب جديد بانتظار التأكيد</span>
          </span>
        );
      case 'inspection_required':
      case 'received_at_laundry':
        return (
          <span className="bg-sky-100 text-sky-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            <span>وصل الكاونتر - بانتظار الفحص</span>
          </span>
        );
      case 'awaiting_customer_approval':
        return (
          <span className="bg-orange-100 text-orange-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>بانتظار موافقة العميل على التعديل</span>
          </span>
        );
      case 'processing':
        return (
          <span className="bg-blue-100 text-blue-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>قيد دورة الغسيل والكي</span>
          </span>
        );
      case 'ready_for_delivery':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>جاهز للتسليم للطيار</span>
          </span>
        );
      case 'delivery_assigned':
      case 'out_for_delivery':
        return (
          <span className="bg-indigo-100 text-indigo-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>مع الطيار في طريق العودة</span>
          </span>
        );
      case 'delivered':
      case 'completed':
        return (
          <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>مكتمل ومسلّم للعميل</span>
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="bg-rose-100 text-rose-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>ملغي / معتذر عنه</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  // Filter list
  const filteredList = merchantOrders.filter(ord => {
    // Status Tab Filtering
    if (activeTab === 'new' && ord.status !== 'awaiting_laundry_confirmation') return false;
    if (activeTab === 'intake' && ord.status !== 'inspection_required' && ord.status !== 'received_at_laundry') return false;
    if (activeTab === 'approval' && ord.status !== 'awaiting_customer_approval') return false;
    if (activeTab === 'processing' && ord.status !== 'processing') return false;
    if (activeTab === 'ready' && ord.status !== 'ready_for_delivery') return false;
    if (activeTab === 'completed' && ord.status !== 'delivered' && ord.status !== 'completed') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchOrder = ord.orderNumber.toLowerCase().includes(q);
      const matchCustomer = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.customerPhone.includes(q);
      const matchNeighborhood = ord.neighborhood?.toLowerCase().includes(q);
      return matchOrder || matchCustomer || matchPhone || matchNeighborhood;
    }

    return true;
  });

  const handleConfirmReject = () => {
    if (!rejectModalOrder) return;
    rejectOrder(rejectModalOrder.id, rejectReason || 'اعتذار المغسلة بسبب ضغط الغسيل الحالي');
    setRejectModalOrder(null);
    setRejectReason('');
  };

  const washStagesList: Array<{ id: WashProcessStage; label: string; icon: any }> = [
    { id: 'intake_sorted', label: 'فرز ألوان', icon: ShoppingBag },
    { id: 'washing_sanitizing', label: 'غسيل وتعقيم', icon: RotateCw },
    { id: 'drying', label: 'تجفيف آلي', icon: Wind },
    { id: 'steam_ironing', label: 'كي بالبخار', icon: Flame },
    { id: 'perfumed_packaged', label: 'تغليف وتعطير', icon: Package }
  ];

  return (
    <div className="space-y-4 pb-16 sm:pb-4 text-right" dir="rtl">
      {/* Search & Status Quick Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الطلب (#ORD-...)، اسم العميل، أو الهاتف..."
              className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="text-xs text-slate-500 font-bold shrink-0 flex items-center justify-between sm:justify-end gap-1.5">
            <span>الطلبات المعروضة:</span>
            <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-mono font-bold">
              {filteredList.length} طلب
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'new', label: 'طلبات جديدة' },
            { id: 'intake', label: 'بانتظار الفحص' },
            { id: 'approval', label: 'موافقات الأسعار' },
            { id: 'processing', label: 'قيد الغسيل' },
            { id: 'ready', label: 'جاهز للتوصيل' },
            { id: 'completed', label: 'مكتملة' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">لا توجد طلبات في هذا القسم</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'لم يتم العثور على أي نتائج تطابق البحث. تأكد من كتابة الرقم بشكل صحيح.'
              : 'جميع الطلبات في هذه المرحلة مكتملة أو معالجة.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map(order => {
            const totalItemsCount = order.items.reduce((s, it) => s + (it.receivedQuantity ?? it.quantity), 0);
            const totalLaundryAmount = order.laundrySubtotal + (order.adjustmentsTotal || 0);
            const currentWashStage = orderWashStages[order.id] || 'washing_sanitizing';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition space-y-3"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs sm:text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {order.orderNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] sm:text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} - {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <div className="text-slate-400 text-[10px] sm:text-[11px] font-bold">بيانات العميل والتوصيل</div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{order.customerName}</div>
                    <div className="text-slate-600 font-mono">{order.customerPhone}</div>
                    <div className="text-slate-500 text-[11px] truncate">
                      {order.neighborhood} - {order.city}
                    </div>
                  </div>

                  {/* Garment Details & Inspection summary */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>إجمالي القطع بالكيس:</span>
                      <span className="font-mono text-sky-700 font-black">{totalItemsCount} قطعة</span>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      {order.items.slice(0, 2).map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="truncate max-w-[130px]">{it.nameAr}</span>
                          <span className="font-mono font-bold">×{it.receivedQuantity ?? it.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-slate-400 font-bold text-[10px]">
                          + {order.items.length - 2} قطع إضافية...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Net for Merchant */}
                  <div className="space-y-1 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 sm:col-span-2 md:col-span-1">
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>إجمالي الغسيل:</span>
                      <span className="font-bold font-mono">{totalLaundryAmount} ج.م</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>عمولة المنصة (8%):</span>
                      <span className="font-mono">-{Math.round(totalLaundryAmount * 0.08)} ج.م</span>
                    </div>
                    <div className="pt-1 border-t border-emerald-200 flex justify-between font-black text-emerald-900">
                      <span>صافي المغسلة:</span>
                      <span className="font-mono text-xs sm:text-sm">
                        {Math.round(totalLaundryAmount * 0.92)} ج.م
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wash Stages Interactive Bar for In-Progress Orders */}
                {order.status === 'processing' && (
                  <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sky-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        <span>مراحل دورة الغسيل الحالية (اضغط لتحديث المرحلة):</span>
                      </span>
                      <span className="text-[10px] text-sky-700 font-mono">
                        {washStagesList.find(s => s.id === currentWashStage)?.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 pt-1">
                      {washStagesList.map((stage, sIdx) => {
                        const stageIndex = washStagesList.findIndex(s => s.id === stage.id);
                        const currentIndex = washStagesList.findIndex(s => s.id === currentWashStage);
                        const isDone = stageIndex < currentIndex;
                        const isCurrent = stageIndex === currentIndex;

                        return (
                          <button
                            type="button"
                            key={stage.id}
                            onClick={() => setOrderWashStage(order.id, stage.id)}
                            className={`p-1.5 rounded-lg text-center transition cursor-pointer flex flex-col items-center gap-1 border ${
                              isCurrent
                                ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                                : isDone
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <stage.icon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold leading-tight truncate max-w-full">
                              {stage.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Special Instructions or Discrepancy Alert */}
                {(order.specialInstructions || order.discrepancy) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      {order.discrepancy ? (
                        <div>
                          <span className="font-bold">تعديل كاونتر: </span>
                          <span>{order.discrepancy.reason} (مبلغ التعديل: {order.discrepancy.differenceEgp} ج.م)</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold">ملاحظات العميل: </span>
                          <span>{order.specialInstructions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Print Bag Tag Button */}
                    <button
                      type="button"
                      onClick={() => onOpenBagTag(order)}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                      title="طباعة بوليصة كيس المغسلة"
                    >
                      <Printer className="w-3.5 h-3.5 text-sky-600" />
                      <span>طباعة تذكرة الكيس</span>
                    </button>
                  </div>

                  {/* Contextual Workflow Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.status === 'awaiting_laundry_confirmation' && (
                      <>
                        <button
                          type="button"
                          onClick={() => acceptOrder(order.id)}
                          className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition min-h-[38px]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>قبول الطلب وتأكيد الاستلام</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectModalOrder(order)}
                          className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer transition min-h-[38px]"
                        >
                          اعتذار
                        </button>
                      </>
                    )}

                    {(order.status === 'inspection_required' || order.status === 'received_at_laundry') && (
                      <button
                        type="button"
                        onClick={() => onOpenIntake(order)}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition min-h-[38px]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>فتح فحص واستلام الملابس</span>
                      </button>
                    )}

                    {order.status === 'awaiting_customer_approval' && (
                      <button
                        type="button"
                        onClick={() => onOpenIntake(order)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition min-h-[38px]"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>مراجعة حالة موافقة العميل</span>
                      </button>
                    )}

                    {order.status === 'processing' && (
                      <button
                        type="button"
                        onClick={() => markOrderReadyForDelivery(order.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition min-h-[38px]"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>اكتمل الغسيل — جاهز للتوصيل</span>
                      </button>
                    )}

                    {order.status === 'ready_for_delivery' && (
                      <button
                        type="button"
                        onClick={() => completeOrder(order.id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition min-h-[38px]"
                      >
                        <Truck className="w-3.5 h-3.5 text-sky-400" />
                        <span>تسليم الكيس للطيار (Handoff)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Order Modal */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-right space-y-4" dir="rtl">
            <div className="flex items-center gap-2 text-rose-600">
              <XCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">
                الاعتذار عن استلام طلب #{rejectModalOrder.orderNumber}
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              يرجى توضيح سبب الاعتذار ليتم إبلاغ خدمة العملاء وإعادة توجيه الطلب لمغسلة بديلة في نفس المنطقة:
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="مثال: ضغط تشغيلي في ماكينة الدراي كلين أو أعمال صيانة طارئة..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="px-3 py-2 text-xs text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                تأكيد الاعتذار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
