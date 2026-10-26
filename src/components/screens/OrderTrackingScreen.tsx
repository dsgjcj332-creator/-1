import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Bike,
  Phone,
  MessageCircle,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Check,
  Camera,
  QrCode,
  ScanLine
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import { GARMENTS } from '../../data/mockData';
import { CustomerBarcodeHandoverModal } from '../common/CustomerBarcodeHandoverModal';
import { OrderChatModal } from '../common/OrderChatModal';

export const OrderTrackingScreen: React.FC = () => {
  const {
    language,
    t,
    activeTrackingOrder,
    setActiveTrackingOrder,
    cancelOrder,
    approvePriceAdjustment,
    fetchBackendData,
    orders,
    navigateTo,
    showToast,
    user
  } = useApp();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('غيرت رأيي / تأخر المندوب');
  const [showItemsList, setShowItemsList] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    pieceIndex?: number;
    garmentNameAr: string;
    photoUrl: string;
    tag?: string;
    notes?: string;
  } | null>(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  const order = activeTrackingOrder || orders[0];

  const STATUS_FLOW: {
    status: OrderStatus;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
  }[] = [
    {
      status: 'order_received',
      titleAr: 'تم استلام الطلب',
      titleEn: 'Order Received',
      descAr: 'تم تسجيل طلبك وتعيين المغسلة المعتمدة لتنفيذه.',
      descEn: 'Your order has been recorded and partner assigned.'
    },
    {
      status: 'order_confirmed',
      titleAr: 'تم تأكيد الطلب',
      titleEn: 'Order Confirmed',
      descAr: 'المغسلة أكدت موعد الاستلام وتجهيز مندوب المنطقة.',
      descEn: 'Partner confirmed the pickup time window.'
    },
    {
      status: 'courier_to_pickup',
      titleAr: 'المندوب في الطريق للاستلام',
      titleEn: 'Courier on way for pickup',
      descAr: 'الكابتن محمود في الطريق لعنوانك ومعه أكياس عالسريع.',
      descEn: 'Captain Mahmoud is heading to your doorstep.'
    },
    {
      status: 'clothes_collected',
      titleAr: 'تم استلام الملابس',
      titleEn: 'Clothes Collected',
      descAr: 'استلم المندوب حقيبة الملابس وجاري فحصها وتسليمها للمغسلة.',
      descEn: 'Courier collected the garment bag for processing.'
    },
    {
      status: 'at_laundry',
      titleAr: 'الملابس لدى المغسلة',
      titleEn: 'At Laundry Facility',
      descAr: 'وصلت ملابسك للمغسلة وجاري فرز الأقمشة والألوان.',
      descEn: 'Clothes arrived at the facility and being sorted.'
    },
    {
      status: 'cleaning_in_progress',
      titleAr: 'جاري تنفيذ الخدمة (غسيل وكي)',
      titleEn: 'Cleaning in Progress',
      descAr: 'جاري الغسيل والتعقيم بمساحيق معتمدة والكي بالبخار.',
      descEn: 'Hygienic wash and steam ironing active.'
    },
    {
      status: 'ready_for_delivery',
      titleAr: 'الملابس جاهزة ومعقمة',
      titleEn: 'Ready for Delivery',
      descAr: 'تم تغليف الملابس على الشماعات أو في الحقيبة وجاهزة للتسليم.',
      descEn: 'Garments packed and ready for dispatch.'
    },
    {
      status: 'courier_to_deliver',
      titleAr: 'المندوب في الطريق للتوصيل',
      titleEn: 'Courier on way to deliver',
      descAr: 'المندوب يتجه إلى باب منزلك لتسليم الملابس نظيفة ومكوية.',
      descEn: 'Courier is en route to your address.'
    },
    {
      status: 'delivered',
      titleAr: 'تم تسليم الطلب بنجاح',
      titleEn: 'Delivered Successfully',
      descAr: 'شكراً لاختيارك عالسريع! نتمنى لك تجربة ممتعة مع ملابسك.',
      descEn: 'Garments delivered. Thank you for choosing Ala El Saree!'
    }
  ];

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-bold text-[#183247] mb-3">لا توجد طلبات جارية حالياً</p>
        <button
          onClick={() => navigateTo('garment_select')}
          className="px-4 py-2 bg-[#08BDF4] text-white rounded-xl text-xs font-bold"
        >
          {t.startNewOrderBtn}
        </button>
      </div>
    );
  }

  const currentStatusIdx = STATUS_FLOW.findIndex(s => s.status === order.status);
  const isCancelled = order.status === 'cancelled';
  const isCompleted = order.status === 'delivered';
  const isAwaitingApproval = order.status === ('awaiting_customer_approval' as any) || (order as any).discrepancy?.customerApprovalStatus === 'pending';

  // Real status advance through backend API
  const handleSimulateNextStatus = async () => {
    if (isCancelled || isCompleted || isUpdatingStatus) return;
    const nextIdx = Math.min(currentStatusIdx + 1, STATUS_FLOW.length - 1);
    const nextStatus = STATUS_FLOW[nextIdx].status;
    setIsUpdatingStatus(true);
    try {
      const { api } = await import('../../api/client');
      await api.orders.updateStatus(order.id, nextStatus, `Advanced stage to ${STATUS_FLOW[nextIdx].titleAr}`);
      await fetchBackendData();
      showToast(
        language === 'ar'
          ? `تم تحديث الحالة بالخادم: ${STATUS_FLOW[nextIdx].titleAr}`
          : `Status updated on server: ${STATUS_FLOW[nextIdx].titleEn}`
      );
    } catch (err: any) {
      console.error('Failed to update status on server:', err);
      // Fallback local update
      const updated = {
        ...order,
        status: nextStatus
      };
      setActiveTrackingOrder(updated);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmCancel = () => {
    const success = cancelOrder(order.id, cancelReason);
    setShowCancelModal(false);
    if (success) {
      navigateTo('main');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-16 select-none">
      {/* 1. Header Order Banner */}
      <div className="p-4 bg-white rounded-3xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EEF4] mb-3">
          <div>
            <span className="text-[11px] font-semibold text-[#718596]">
              {language === 'ar' ? 'طلب رقم' : 'Order'}:
            </span>
            <h2 className="text-base font-black text-[#079FD0] tracking-wide">
              #{order.referenceNumber}
            </h2>
          </div>

          <div className="text-end">
            <span className="text-[11px] font-semibold text-[#718596]">
              {language === 'ar' ? 'تاريخ الإنشاء' : 'Created'}:
            </span>
            <span className="text-xs font-bold text-[#183247] block">
              {order.createdAt.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Status Callout */}
        <div className={`p-3 rounded-2xl flex items-center justify-between ${
          isCancelled
            ? 'bg-red-50 text-[#E55353] border border-red-200'
            : isCompleted
            ? 'bg-emerald-50 text-[#18A875] border border-emerald-200'
            : 'bg-[#EAF8FF] text-[#079FD0] border border-[#08BDF4]/30'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${
              isCancelled ? 'bg-[#E55353]' : isCompleted ? 'bg-[#18A875]' : 'bg-[#08BDF4] animate-ping'
            }`}></span>
            <div>
              <span className="text-xs font-black block">
                {isCancelled
                  ? 'تم إلغاء الطلب'
                  : STATUS_FLOW[currentStatusIdx]?.titleAr || order.status}
              </span>
              <span className="text-[10px] opacity-80">
                {isCancelled
                  ? `سبب الإلغاء: ${order.cancelReason || 'بناءً على طلب العميل'}`
                  : STATUS_FLOW[currentStatusIdx]?.descAr}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Main Procedures Live Bar */}
        {!isCancelled && (
          <div className="mt-3 pt-3 border-t border-[#E5EEF4]">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#183247] mb-2">
              <span>{language === 'ar' ? 'إجراءات المغسلة الحالية:' : 'Laundry Progress:'}</span>
              <span className="text-[#079FD0]">
                {['courier_to_deliver', 'delivered', 'completed', 'out_for_delivery'].includes(order.status as any)
                  ? (language === 'ar' ? 'تم التسليم للمندوب والتوصيل 🚀' : 'Handed to courier')
                  : ['ready_for_delivery'].includes(order.status as any)
                  ? (language === 'ar' ? 'اكتمل الغسيل — جاهز للتسليم ✨' : 'Wash completed')
                  : ['cleaning_in_progress', 'processing', 'at_laundry'].includes(order.status as any)
                  ? (language === 'ar' ? 'قيد الغسيل والكي 🫧' : 'Washing & Ironing')
                  : (language === 'ar' ? 'بانتظار وصول واستلام الملابس' : 'Awaiting arrival')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center">
              {/* Step 1: استلام الطلب */}
              {(() => {
                const step1Done = ['at_laundry', 'cleaning_in_progress', 'processing', 'ready_for_delivery', 'courier_to_deliver', 'out_for_delivery', 'delivered', 'completed'].includes(order.status as any);
                const step1Current = ['order_received', 'order_confirmed', 'courier_to_pickup', 'clothes_collected', 'awaiting_laundry_confirmation'].includes(order.status as any);
                return (
                  <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                    step1Done
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                      : step1Current
                      ? 'bg-[#EAF8FF] border-[#08BDF4] text-[#079FD0] shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      step1Done ? 'bg-emerald-500 text-white' : step1Current ? 'bg-[#08BDF4] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step1Done ? <Check className="w-3.5 h-3.5" /> : '1'}
                    </div>
                    <span className="text-[10px] font-bold truncate max-w-full">
                      {language === 'ar' ? '1. استلام الطلب' : '1. Received'}
                    </span>
                  </div>
                );
              })()}

              {/* Step 2: غسيل الطلب */}
              {(() => {
                const step2Done = ['ready_for_delivery', 'courier_to_deliver', 'out_for_delivery', 'delivered', 'completed'].includes(order.status as any);
                const step2Current = ['at_laundry', 'cleaning_in_progress', 'processing'].includes(order.status as any);
                return (
                  <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                    step2Done
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                      : step2Current
                      ? 'bg-[#EAF8FF] border-[#08BDF4] text-[#079FD0] shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      step2Done ? 'bg-emerald-500 text-white' : step2Current ? 'bg-[#08BDF4] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step2Done ? <Check className="w-3.5 h-3.5" /> : '2'}
                    </div>
                    <span className="text-[10px] font-bold truncate max-w-full">
                      {language === 'ar' ? '2. غسيل وكوي' : '2. Washing'}
                    </span>
                  </div>
                );
              })()}

              {/* Step 3: تسليم إلى المندوب */}
              {(() => {
                const step3Done = ['courier_to_deliver', 'out_for_delivery', 'delivered', 'completed'].includes(order.status as any);
                const step3Current = order.status === 'ready_for_delivery';
                return (
                  <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                    step3Done
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                      : step3Current
                      ? 'bg-[#EAF8FF] border-[#08BDF4] text-[#079FD0] shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      step3Done ? 'bg-emerald-500 text-white' : step3Current ? 'bg-[#08BDF4] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step3Done ? <Check className="w-3.5 h-3.5" /> : '3'}
                    </div>
                    <span className="text-[10px] font-bold truncate max-w-full">
                      {language === 'ar' ? '3. تسليم للمندوب' : '3. Handoff'}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Price Adjustment Approval Banner */}
        {isAwaitingApproval && (
          <div className="mt-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-amber-900">
                  {language === 'ar' ? 'تعديل مطلوب على قيمة الفاتورة' : 'Action Required: Price Adjustment'}
                </h4>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  {language === 'ar'
                    ? 'بعد استلام الملابس وفحصها بالكاونتر، تبين وجود قطع تتطلب عناية خاصة أو إزالة بقع دقيقة، وطلب الشريك تعديل قيمة الطلب.'
                    : 'Upon inspecting garments at the counter, additional items or specialized stain care were noted.'}
                </p>
                {(order as any).discrepancy?.reason && (
                  <div className="mt-1.5 p-2 bg-white/80 rounded-xl text-[11px] text-[#183247] font-semibold border border-amber-200">
                    <span className="text-amber-800 font-bold">{language === 'ar' ? 'ملاحظة المغسلة: ' : 'Laundry note: '}</span>
                    {(order as any).discrepancy.reason}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="text-[#718596]">
                    {language === 'ar' ? 'السعر الأصلي: ' : 'Original: '}
                    <span className="line-through font-bold">{order.finalTotal} {t.currency}</span>
                  </span>
                  <span className="text-[#079FD0] font-black">
                    {language === 'ar' ? 'السعر المعدل: ' : 'Revised: '}
                    {(order as any).discrepancy?.revisedTotal || order.finalTotal + 30} {t.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
              <button
                onClick={() => approvePriceAdjustment(order.id, true)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'موافقة ومتابعة الغسيل' : 'Approve & Wash'}</span>
              </button>
              <button
                onClick={() => approvePriceAdjustment(order.id, false)}
                className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'رفض واسترجاع' : 'Reject & Return'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Simulator Button for Reviewers */}
        {!isCancelled && !isCompleted && (
          <div className="mt-3 pt-3 border-t border-[#E5EEF4] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#718596] font-medium">
              محاكي تقدم الحالة للمعاينة (الخادم الحي):
            </span>
            <button
              onClick={handleSimulateNextStatus}
              disabled={isUpdatingStatus}
              className="px-3 py-1 bg-[#08BDF4] hover:bg-[#079FD0] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isUpdatingStatus ? 'جاري التحديث...' : 'تقديم خطوة'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Assigned Driver Card + Chat with Merchant */}
      {!isCancelled && (
        <div className="p-4 bg-white rounded-3xl border border-[#E5EEF4] mb-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF8FF] flex items-center justify-center text-[#079FD0] font-black text-xl shrink-0">
                🛵
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#183247]">{t.driverName}</h3>
                <p className="text-[11px] text-[#718596] mt-0.5">{t.driverRating}</p>
                <span className="text-[10px] text-[#18A875] font-semibold">
                  {language === 'ar' ? 'مندوب معتمد لدى عالسريع' : 'Certified Ala El Saree Courier'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Chat with Merchant Button */}
              <button
                onClick={() => setShowChatModal(true)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition cursor-pointer relative ${
                  isAwaitingApproval
                    ? 'bg-amber-400 text-white border-amber-500 animate-pulse shadow-md'
                    : 'bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200'
                }`}
                title={language === 'ar' ? 'محادثة مع المغسلة' : 'Chat with Laundry'}
              >
                <MessageCircle className="w-4 h-4" />
                {isAwaitingApproval && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-ping" />
                )}
              </button>
              <a
                href="tel:+201012345678"
                className="w-9 h-9 rounded-xl bg-[#EAF8FF] hover:bg-[#08BDF4]/20 text-[#079FD0] flex items-center justify-center border border-[#08BDF4]/30 transition cursor-pointer"
                title={t.callCourier}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Barcode Delivery Confirmation - only when courier is delivering */}
          {['courier_to_deliver', 'out_for_delivery'].includes(order.status as string) && !deliveryConfirmed && (
            <div className="mt-3 pt-3 border-t border-[#E5EEF4]">
              <button
                onClick={() => setShowBarcodeModal(true)}
                className="w-full py-2.5 bg-gradient-to-r from-[#08BDF4] to-[#079FD0] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition cursor-pointer"
              >
                <ScanLine className="w-4 h-4" />
                <span>{language === 'ar' ? 'تأكيد استلام طلبك بالباركود' : 'Confirm Delivery via Barcode'}</span>
                <QrCode className="w-4 h-4 opacity-70" />
              </button>
              <p className="text-[10px] text-[#718596] text-center mt-1.5">
                {language === 'ar' ? 'امسح الباركود الموجود على كيس الملابس لتأكيد الاستلام' : 'Scan the barcode on the garment bag to confirm receipt'}
              </p>
            </div>
          )}

          {/* Delivery Confirmed State */}
          {deliveryConfirmed && (
            <div className="mt-3 pt-3 border-t border-[#E5EEF4] flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-black text-emerald-700">
                {language === 'ar' ? 'تم تأكيد استلام الطلب بنجاح ✓' : 'Delivery confirmed successfully ✓'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3. Vertical 9-Step Timeline */}
      <div className="p-4 bg-white rounded-3xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <h3 className="text-xs font-black text-[#183247] mb-4">
          {language === 'ar' ? 'مراحل تنفيذ الطلب' : 'Order Progress Stages'}
        </h3>

        <div className="flex flex-col gap-0 relative">
          {STATUS_FLOW.map((stage, idx) => {
            const isDone = currentStatusIdx > idx;
            const isCurrent = currentStatusIdx === idx && !isCancelled;
            const isPending = currentStatusIdx < idx;

            return (
              <div key={stage.status} className="flex items-start gap-3 relative pb-6 last:pb-0">
                {/* Connecting Line */}
                {idx < STATUS_FLOW.length - 1 && (
                  <div
                    className={`absolute top-5 right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto w-0.5 h-full -ml-[1px] transition-colors ${
                      isDone ? 'bg-[#08BDF4]' : 'bg-[#E5EEF4]'
                    }`}
                  ></div>
                )}

                {/* Status Dot / Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-all ${
                    isDone
                      ? 'bg-[#08BDF4] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-white border-2 border-[#08BDF4] text-[#079FD0] shadow-md ring-4 ring-[#08BDF4]/15'
                      : 'bg-slate-100 text-slate-400 border border-[#E5EEF4]'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Text Description */}
                <div className="flex-1 -mt-0.5">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-[#079FD0] font-black'
                          : isDone
                          ? 'text-[#183247]'
                          : 'text-[#718596]'
                      }`}
                    >
                      {language === 'ar' ? stage.titleAr : stage.titleEn}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#718596] mt-0.5 leading-snug">
                    {language === 'ar' ? stage.descAr : stage.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documented Garment Photos Card */}
      {order.photos && order.photos.length > 0 && (
        <div className="p-4 bg-white rounded-3xl border border-[#E5EEF4] mb-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#08BDF4]" />
              <span className="text-xs font-bold text-[#183247]">
                {language === 'ar' ? `صور توثيق الملابس (${order.photos.length} قطع)` : `Documented Photos (${order.photos.length})`}
              </span>
            </div>
            <span className="text-[10px] text-[#079FD0] font-semibold">
              {language === 'ar' ? 'اضغط لتكبير أي صورة' : 'Tap to enlarge'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {order.photos.map((p, idx) => (
              <div
                key={p.pieceIndex || idx}
                onClick={() => setSelectedPhoto(p)}
                className="aspect-square rounded-2xl overflow-hidden border border-[#E5EEF4] bg-slate-50 relative shadow-2xs cursor-pointer group hover:border-[#08BDF4] transition"
              >
                <img
                  src={p.photoUrl || (p as any).photo_url}
                  alt={p.garmentNameAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold p-1 truncate text-center">
                  {p.garmentNameAr}
                </div>
                {p.tag && (
                  <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded-sm shadow-xs">
                    {p.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Order Items Accordion */}
      <div className="p-4 bg-white rounded-3xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <button
          onClick={() => setShowItemsList(!showItemsList)}
          className="w-full flex items-center justify-between text-xs font-bold text-[#183247] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#08BDF4]" />
            <span>
              {language === 'ar' ? 'تفاصيل الملابس والخدمات' : 'Garments & Services'} ({order.items.length})
            </span>
          </div>
          {showItemsList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showItemsList && (
          <div className="pt-3 mt-3 border-t border-[#E5EEF4] flex flex-col gap-2 text-xs">
            {order.items.map((item, idx) => {
              const garment = GARMENTS.find(g => g.id === item.garmentId);
              return (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{garment?.icon || '👔'}</span>
                    <span className="font-semibold text-[#183247]">
                      {language === 'ar' ? garment?.nameAr : garment?.nameEn}
                    </span>
                    <span className="text-[10px] text-[#718596]">({item.quantity}×)</span>
                  </div>
                  <span className="font-bold text-[#079FD0]">
                    {item.unitPrice * item.quantity} {t.currency}
                  </span>
                </div>
              );
            })}

            <div className="flex justify-between font-black text-[#183247] pt-2 border-t border-[#E5EEF4]">
              <span>{language === 'ar' ? 'الإجمالي النهائي:' : 'Total Amount:'}</span>
              <span className="text-[#079FD0]">{order.finalTotal} {t.currency}</span>
            </div>

            {order.photos && order.photos.length > 0 && (
              <div className="pt-3 mt-2 border-t border-[#E5EEF4]">
                <span className="text-[11px] font-bold text-[#183247] block mb-2">
                  {language === 'ar' ? 'صور القطع الموثقة للطلب:' : 'Documented Garment Photos:'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {order.photos.map((p, idx) => (
                    <div
                      key={p.pieceIndex || idx}
                      className="aspect-square rounded-xl overflow-hidden border border-[#E5EEF4] bg-slate-50 relative shadow-2xs"
                    >
                      <img
                        src={p.photoUrl}
                        alt={p.garmentNameAr}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] p-0.5 truncate text-center">
                        {p.garmentNameAr}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Cancel Order Action (Only if eligible, e.g. early stages) */}
      {!isCancelled && !isCompleted && currentStatusIdx <= 2 && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-xs font-bold text-[#E55353] hover:underline cursor-pointer"
          >
            {t.cancelOrder}
          </button>
        </div>
      )}

      {/* Barcode Handover Modal */}
      <CustomerBarcodeHandoverModal
        isOpen={showBarcodeModal}
        onClose={() => setShowBarcodeModal(false)}
        orderNumber={order.referenceNumber || order.id}
        orderId={order.id}
        expectedBarcode={`AS-${(order.referenceNumber || order.id).slice(-6).toUpperCase()}`}
        onConfirmSuccess={() => {
          setDeliveryConfirmed(true);
          setShowBarcodeModal(false);
          showToast(language === 'ar' ? '✅ تم تأكيد الاستلام بنجاح!' : '✅ Delivery confirmed successfully!');
        }}
      />

      {/* Order Chat Modal (Customer ↔ Merchant) */}
      <OrderChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        orderId={order.id}
        orderNumber={order.referenceNumber || order.id}
        customerName={user?.name || 'العميل'}
        customerPhone={user?.phone || ''}
        merchantName={(order as any).partnerName || 'المغسلة المعتمدة'}
        currentUserRole="customer"
        currentUserName={user?.name || 'العميل'}
        discrepancy={(order as any).discrepancy || null}
        onApprovePriceAdjustment={(approved) => {
          approvePriceAdjustment(order.id, approved);
          setShowChatModal(false);
        }}
      />

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E55353] flex items-center justify-center mb-3 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-[#183247] text-center mb-1">
              {t.cancelOrder}
            </h3>
            <p className="text-xs text-[#718596] text-center mb-4">
              {t.cancelFreeNotice}
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-[#183247] mb-2">
                {language === 'ar' ? 'سبب الإلغاء:' : 'Reason for cancellation:'}
              </label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E5EEF4] text-xs font-medium bg-[#F4FBFF]"
              >
                <option value="غيرت رأيي / لم أعد بحاجة للغسيل">غيرت رأيي / لم أعد بحاجة للغسيل</option>
                <option value="تأخر المندوب عن الموعد">تأخر المندوب عن الموعد</option>
                <option value="أريد تعديل قطع الملابس المختارة">أريد تعديل قطع الملابس المختارة</option>
                <option value="سبب آخر">سبب آخر</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 h-11 rounded-xl bg-slate-100 text-[#183247] font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
              >
                {t.back}
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 h-11 rounded-xl bg-[#E55353] text-white font-bold text-xs hover:bg-red-700 transition cursor-pointer"
              >
                تأكيد الإلغاء
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
            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 text-right"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#08BDF4]" />
                <h3 className="font-bold text-xs text-[#183247]">
                  {selectedPhoto.garmentNameAr} {selectedPhoto.pieceIndex ? `(#${selectedPhoto.pieceIndex})` : ''}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-2 flex items-center justify-center max-h-[55vh] overflow-hidden">
              <img
                src={selectedPhoto.photoUrl || (selectedPhoto as any).photo_url}
                alt={selectedPhoto.garmentNameAr}
                className="max-h-[50vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="p-3.5 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">
                  {language === 'ar' ? 'حالة توثيق القطعة:' : 'Condition:'}
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5 text-[11px]">
                  {selectedPhoto.tag || (language === 'ar' ? 'سليمة تماماً' : 'Good')}
                </span>
              </div>
              {selectedPhoto.notes && (
                <div className="text-left">
                  <span className="text-slate-500 block text-[10px]">
                    {language === 'ar' ? 'ملاحظات:' : 'Notes:'}
                  </span>
                  <span className="font-semibold text-slate-700 text-[11px]">{selectedPhoto.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
