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
  Package,
  Camera,
  X,
  MessageCircle
} from 'lucide-react';
import { OrderChatModal } from '../../components/common/OrderChatModal';

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
    advanceOrderStage,
    language
  } = useOperations();

  const isRtl = language === 'ar';

  const [activeTab, setActiveTab] = useState<string>(filterStatusPreset || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rejectModalOrder, setRejectModalOrder] = useState<LaundryOrder | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<{
    pieceIndex?: number;
    garmentNameAr: string;
    photoUrl: string;
    tag?: string;
    notes?: string;
  } | null>(null);
  const [chatOrder, setChatOrder] = useState<LaundryOrder | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

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

            // Auto-expand urgent orders that need immediate action
            const isUrgent = order.status === 'awaiting_laundry_confirmation' || order.status === 'awaiting_customer_approval';
            const isExpanded = expandedOrders.has(order.id) || isUrgent;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border shadow-xs transition ${
                  isUrgent
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* ── Collapsed Header (always visible) ── */}
                <div
                  className="p-4 sm:p-5 cursor-pointer select-none"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-xs sm:text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {order.orderNumber}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] sm:text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} - {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      {/* Chevron toggle */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                        isExpanded
                          ? 'bg-sky-50 border-sky-200 text-sky-600 rotate-180'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        <ChevronLeft className="w-4 h-4 -rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Quick summary always visible */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs w-full">
                    <div>
                      <div className="text-slate-400 text-[10px] font-bold mb-0.5">العميل</div>
                      <div className="font-bold text-slate-900 truncate">{order.customerName}</div>
                      <div className="text-slate-500 text-[10px] truncate">{order.neighborhood} · {order.city}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-[10px] font-bold mb-0.5">القطع</div>
                      <div className="font-black text-sky-700 text-sm">{totalItemsCount}</div>
                      <div className="text-slate-400 text-[10px]">قطعة</div>
                    </div>
                    <div className="text-end">
                      <div className="text-slate-400 text-[10px] font-bold mb-0.5">صافي المغسلة</div>
                      <div className="font-black text-emerald-700 text-sm">{Math.round(totalLaundryAmount * 0.92)}</div>
                      <div className="text-slate-400 text-[10px]">ج.م</div>
                    </div>
                  </div>
                </div>

                {/* ── Expandable Details ── */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-slate-100 pt-3">
                    {/* Main Content Grid: Customer, Garments, Pricing */}
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

                {/* 3-Step Interactive Merchant Procedures: 1. استلام الطلب | 2. غسيل الطلب | 3. تسليم إلى المندوب */}
                {(() => {
                  const isStep1Done = [
                    'received_at_laundry',
                    'inspection_required',
                    'processing',
                    'ready_for_delivery',
                    'delivery_assigned',
                    'out_for_delivery',
                    'delivered',
                    'completed'
                  ].includes(order.status);

                  const isStep2Done = [
                    'ready_for_delivery',
                    'delivery_assigned',
                    'out_for_delivery',
                    'delivered',
                    'completed'
                  ].includes(order.status);

                  const isStep3Done = [
                    'delivery_assigned',
                    'out_for_delivery',
                    'delivered',
                    'completed'
                  ].includes(order.status);

                  return (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-sky-600" />
                          <span>إجراءات تنفيذ الطلب (اضغط على المرحلة لتأكيد إنجازها):</span>
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isStep3Done
                            ? 'bg-emerald-100 text-emerald-800'
                            : isStep2Done
                            ? 'bg-amber-100 text-amber-800'
                            : isStep1Done
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isStep3Done
                            ? 'اكتمل وتسلم للطيار ✓'
                            : isStep2Done
                            ? 'المرحلة 3: تسليم للمندوب'
                            : isStep1Done
                            ? 'المرحلة 2: قيد الغسيل والكي'
                            : 'المرحلة 1: بانتظار الاستلام'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* 1. استلام الطلب */}
                        <button
                          type="button"
                          onClick={() => advanceOrderStage(order.id, 1)}
                          className={`p-3 rounded-xl border text-right transition cursor-pointer flex items-center justify-between ${
                            isStep1Done
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-sky-300 text-slate-700 hover:bg-sky-50/40'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                                isStep1Done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>1</span>
                              <span className="text-xs font-bold truncate">استلام الطلب</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              {isStep1Done ? 'تم الاستلام والفحص ✓' : 'اضغط لتأكيد الاستلام'}
                            </span>
                          </div>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isStep1Done ? 'bg-emerald-500 text-white shadow-2xs' : 'border border-slate-300 bg-slate-50'
                          }`}>
                            {isStep1Done && <Check className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* 2. غسيل الطلب */}
                        <button
                          type="button"
                          onClick={() => advanceOrderStage(order.id, 2)}
                          disabled={!isStep1Done}
                          className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
                            isStep2Done
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs cursor-pointer'
                              : isStep1Done
                              ? 'bg-white border-sky-400 text-sky-900 hover:bg-sky-50/40 cursor-pointer shadow-xs'
                              : 'bg-slate-100/50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                                isStep2Done ? 'bg-emerald-500 text-white' : isStep1Done ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-400'
                              }`}>2</span>
                              <span className="text-xs font-bold truncate">غسيل الطلب</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              {isStep2Done ? 'اكتمل الغسيل والكي ✓' : isStep1Done ? 'اضغط لإتمام الغسيل والكي' : 'بعد استلام الملابس'}
                            </span>
                          </div>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isStep2Done ? 'bg-emerald-500 text-white shadow-2xs' : 'border border-slate-300 bg-slate-50'
                          }`}>
                            {isStep2Done && <Check className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* 3. تسليم إلى المندوب */}
                        <button
                          type="button"
                          onClick={() => advanceOrderStage(order.id, 3)}
                          disabled={!isStep2Done}
                          className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
                            isStep3Done
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs cursor-pointer'
                              : isStep2Done
                              ? 'bg-white border-sky-400 text-sky-900 hover:bg-sky-50/40 cursor-pointer shadow-xs'
                              : 'bg-slate-100/50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                                isStep3Done ? 'bg-emerald-500 text-white' : isStep2Done ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-400'
                              }`}>3</span>
                              <span className="text-xs font-bold truncate">تسليم إلى المندوب</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              {isStep3Done ? 'تم التسليم للمندوب ✓' : isStep2Done ? 'اضغط لتأكيد التسليم للطيار' : 'بعد اكتمال الغسيل'}
                            </span>
                          </div>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isStep3Done ? 'bg-emerald-500 text-white shadow-2xs' : 'border border-slate-300 bg-slate-50'
                          }`}>
                            {isStep3Done && <Check className="w-4 h-4" />}
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Customer Documented Garment Photos Gallery */}
                {(() => {
                  const orderPhotos: any[] = (order.photos && order.photos.length > 0)
                    ? order.photos
                    : (() => {
                        try {
                          const rawCust = localStorage.getItem('alasaree_orders');
                          if (rawCust) {
                            const list: any[] = JSON.parse(rawCust);
                            const match = list.find((o: any) => o.id === order.id || o.referenceNumber === order.orderNumber);
                            if (match?.photos && match.photos.length > 0) return match.photos;
                          }
                          const rawOps = localStorage.getItem('ala_el_saree_ops_orders');
                          if (rawOps) {
                            const list: any[] = JSON.parse(rawOps);
                            const match = list.find((o: any) => o.id === order.id || o.orderNumber === order.orderNumber);
                            if (match?.photos && match.photos.length > 0) return match.photos;
                          }
                        } catch {
                          // ignore
                        }
                        return [];
                      })();

                  if (orderPhotos.length > 0) {
                    return (
                      <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-sky-950 flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-sky-600" />
                            <span>صور توثيق الملابس من العميل ({orderPhotos.length} قطع):</span>
                          </span>
                          <span className="text-[10px] text-sky-600 font-semibold">اضغط على أي صورة لتكبيرها وفحصها</span>
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {orderPhotos.map((p: any, pIdx: number) => (
                            <div
                              key={pIdx}
                              onClick={() => setSelectedPhoto(p)}
                              className="shrink-0 group cursor-pointer relative rounded-xl overflow-hidden border border-sky-200 bg-white hover:shadow-md transition"
                            >
                              <img
                                src={p.photoUrl || (p as any).photo_url}
                                alt={p.garmentNameAr || (p as any).garment_name_ar || 'قطعة ملابس'}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover group-hover:scale-105 transition"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/65 backdrop-blur-xs px-1 py-0.5 text-[9px] text-white font-bold truncate text-center">
                                {p.garmentNameAr || (p as any).garment_name_ar || 'قطعة ملابس'}
                              </div>
                              {(p.tag || (p as any).photo_type) && (
                                <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded-sm shadow-xs">
                                  {p.tag || (p as any).photo_type}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200 text-slate-500 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px]">توثيق الصور: لم يرفق العميل صور مسبقة (الفحص يتم بالكاونتر)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenIntake(order)}
                        className="text-[10px] font-bold text-sky-600 hover:text-sky-700 underline cursor-pointer"
                      >
                        تسجيل فحص الكاونتر
                      </button>
                    </div>
                  );
                })()}

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

                  {/* Chat with Customer Button */}
                  <button
                    type="button"
                    onClick={() => setChatOrder(order)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer min-h-[38px] ${
                      order.status === 'awaiting_customer_approval'
                        ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm animate-pulse'
                        : 'bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200'
                    }`}
                    title="محادثة العميل"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>محادثة العميل</span>
                    {order.status === 'awaiting_customer_approval' && (
                      <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                    )}
                  </button>
                </div>
              </div>
            )}
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

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 text-right"
            dir="rtl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  صورة توثيق العميل: {selectedPhoto.garmentNameAr} {selectedPhoto.pieceIndex ? `(قطعة #${selectedPhoto.pieceIndex})` : ''}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-2 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedPhoto.photoUrl || (selectedPhoto as any).photo_url}
                alt={selectedPhoto.garmentNameAr || (selectedPhoto as any).garment_name_ar || 'قطعة ملابس'}
                className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">حالة توثيق القطعة:</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                  {selectedPhoto.tag || 'سليمة تماماً'}
                </span>
              </div>
              {selectedPhoto.notes && (
                <div className="text-left">
                  <span className="text-slate-500 block text-[11px]">ملاحظات:</span>
                  <span className="font-semibold text-slate-700">{selectedPhoto.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Order Chat Modal (Merchant ↔ Customer) */}
      {chatOrder && (
        <OrderChatModal
          isOpen={!!chatOrder}
          onClose={() => setChatOrder(null)}
          orderId={chatOrder.id}
          orderNumber={chatOrder.orderNumber}
          customerName={chatOrder.customerName}
          customerPhone={chatOrder.customerPhone}
          merchantName={activeMerchant?.nameAr || 'المغسلة'}
          currentUserRole="merchant"
          currentUserName={activeMerchant?.nameAr || 'المغسلة'}
          discrepancy={chatOrder.discrepancy as any || null}
        />
      )}
    </div>
  );
};
