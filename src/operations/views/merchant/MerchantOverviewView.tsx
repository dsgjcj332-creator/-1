import React from 'react';
import { useOperations } from '../../context/OperationsContext';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Store,
  Sparkles
} from 'lucide-react';

interface MerchantOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const MerchantOverviewView: React.FC<MerchantOverviewProps> = ({ onNavigateTab }) => {
  const { currentMerchant, filteredOrders, filteredSettlements, language } = useOperations();
  const isRtl = language === 'ar';

  if (!currentMerchant) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Store className="w-12 h-12 mx-auto text-slate-300 mb-2" />
        <p className="font-bold text-slate-700">
          {isRtl ? 'لم يتم ربط حساب المغسلة' : 'No merchant account associated'}
        </p>
      </div>
    );
  }

  // Real data calculations (strictly isolated to current merchant)
  const newOrdersRequiringAction = filteredOrders.filter(
    o => o.status === 'awaiting_laundry_confirmation' || o.status === 'inspection_required'
  ).length;

  const processingOrders = filteredOrders.filter(
    o => o.status === 'processing' || o.status === 'accepted'
  ).length;

  const readyForDelivery = filteredOrders.filter(
    o => o.status === 'ready_for_delivery'
  ).length;

  const completedOrders = filteredOrders.filter(
    o => o.status === 'completed' || o.status === 'delivered'
  ).length;

  const grossLaundryValue = filteredOrders.reduce((sum, o) => sum + o.laundrySubtotal, 0);
  const commissionDeducted = filteredOrders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const netPayable = filteredOrders.reduce((sum, o) => sum + o.merchantPayableAmount, 0);

  const pendingSettlementBalance = filteredOrders
    .filter(o => !o.isSettled && (o.status === 'completed' || o.status === 'delivered'))
    .reduce((sum, o) => sum + o.merchantPayableAmount, 0);

  return (
    <div className="space-y-6">
      {/* Merchant Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold text-emerald-400">
              {isRtl ? 'المغسلة مفتوحة وتستقبل الطلبات' : 'Store Active & Receiving Orders'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300">{currentMerchant.activeHours}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{currentMerchant.nameAr}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {currentMerchant.city} - {currentMerchant.district} |{' '}
            {isRtl ? `نسبة العمولة المتفق عليها: ${Math.round(currentMerchant.commissionRate * 100)}%` : `Commission: ${Math.round(currentMerchant.commissionRate * 100)}%`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('merchant_orders')}
            className="px-4 py-2 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isRtl ? 'طلبات وفحص المغسلة' : 'Store Orders'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Needs Action */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">
              {isRtl ? 'طلبات تتطلب إجراء' : 'Requires Action'}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              newOrdersRequiringAction > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-500'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-2xl font-black ${newOrdersRequiringAction > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {newOrdersRequiringAction}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isRtl ? 'بانتظار القبول أو فحص الاستلام' : 'Pending intake check or acceptance'}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('merchant_orders')}
            className="mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center justify-between cursor-pointer"
          >
            <span>{isRtl ? 'معالجة فورية' : 'Process now'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Currently Processing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">
              {isRtl ? 'قيد الغسيل والكي' : 'In Processing'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{processingOrders}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isRtl ? 'ملابس جارية في خط التشغيل' : 'Garments on washer/steam lines'}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('merchant_orders')}
            className="mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-between cursor-pointer"
          >
            <span>{isRtl ? 'متابعة الخطوات' : 'View progress'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ready for Delivery */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">
              {isRtl ? 'جاهزة للتسليم النهائي' : 'Ready for Delivery'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">{readyForDelivery}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isRtl ? 'معلقة ومغلفة بانتظار المندوب' : 'Packaged awaiting courier'}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('merchant_orders')}
            className="mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-between cursor-pointer"
          >
            <span>{isRtl ? 'عرض الطلبات' : 'View orders'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Net Revenue Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">
              {isRtl ? 'رصيد التسوية المستحق' : 'Pending Settlement'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">
              {pendingSettlementBalance.toLocaleString()} <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isRtl ? 'صافي مستحق للمغسلة بعد خصم 8%' : 'Net payable after 8% commission'}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('merchant_settlements')}
            className="mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center justify-between cursor-pointer"
          >
            <span>{isRtl ? 'سجل التسويات والتحويل' : 'Payout history'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Priority Workflow Queue */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>{isRtl ? 'المهام العاجلة على طاولة المغسلة' : 'Store Priority Tasks'}</span>
        </h3>

        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              {isRtl ? 'لا توجد طلبات واردة حالياً' : 'No incoming orders right now'}
            </p>
          ) : (
            filteredOrders.map(ord => (
              <div
                key={ord.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-slate-800">{ord.customerName}</span>
                    <span className="text-slate-500 text-[11px]">({ord.neighborhood})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {ord.items.length} {isRtl ? 'قطع ملابس' : 'items'} |{' '}
                    {isRtl ? 'صافي مستحق المغسلة:' : 'Your Net:'}{' '}
                    <strong className="text-emerald-700 font-bold">{ord.merchantPayableAmount} ج.م</strong>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('merchant_orders')}
                  className="px-3.5 py-1.5 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-bold rounded-lg cursor-pointer transition shrink-0"
                >
                  {isRtl ? 'فتح وفحص الطلب' : 'Inspect & Update'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
