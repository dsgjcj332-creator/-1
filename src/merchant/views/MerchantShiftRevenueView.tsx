import React from 'react';
import { useMerchantAuth } from '../context/MerchantAuthContext';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  DollarSign,
  Download,
  FileText
} from 'lucide-react';

export const MerchantShiftRevenueView: React.FC = () => {
  const { activeMerchant, orderMetrics, merchantOrders } = useMerchantAuth();

  return (
    <div className="space-y-4 sm:space-y-5 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 rounded-2xl p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] sm:text-xs text-sky-100 font-bold mb-1">
              مستحقات وإيرادات المغسلة المعتمدة
            </div>
            <h2 className="text-lg sm:text-xl font-black">{activeMerchant?.nameAr}</h2>
            <p className="text-[11px] sm:text-xs text-sky-100 mt-1">
              الفرع: {activeMerchant?.district}، {activeMerchant?.city} • دورة تسوية المستحقات: أسبوعية (كل أربعاء)
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-center w-full sm:w-auto">
            <div className="text-[10px] sm:text-[11px] text-sky-100 font-bold">صافي الأرباح المستحقة للتحويل</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">
              {orderMetrics.todayNetEgp.toLocaleString()} ج.م
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Gross Laundry Volume */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>إجمالي خدمات الغسيل</span>
            <Wallet className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-slate-900">
            {orderMetrics.todayGrossEgp.toLocaleString()} ج.م
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400">
            من إجمالي {orderMetrics.total} طلبات استلام وتجهيز
          </div>
        </div>

        {/* Platform Commission 8% */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>عمولة منصة عالسريع (8%)</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-amber-700">
            -{orderMetrics.todayCommissionEgp.toLocaleString()} ج.م
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400">
            رسوم الربط والتسويق والدعم الفني
          </div>
        </div>

        {/* Net Payout */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>صافي مستحقات المغسلة (92%)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-700">
            {orderMetrics.todayNetEgp.toLocaleString()} ج.م
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-600 font-medium truncate">
            يتم التحويل عبر {activeMerchant?.payoutMethod === 'instapay' ? 'InstaPay' : 'الحساب البنكي'}
          </div>
        </div>
      </div>

      {/* Settlement Account Details */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-600" />
          <span>بيانات تحويل المستحقات المسجلة لدى المنصة</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-100">
          <div>
            <div className="text-slate-400 text-[10px] sm:text-[11px]">طريقة الاستلام المفضلة:</div>
            <div className="font-bold text-slate-800 mt-0.5">
              {activeMerchant?.payoutMethod === 'instapay' ? 'محفظة / إنستاباي InstaPay' : 'تحويل بنكي IBAN'}
            </div>
          </div>

          <div>
            <div className="text-slate-400 text-[10px] sm:text-[11px]">تفاصيل الحساب / العنوان:</div>
            <div className="font-bold text-slate-800 mt-0.5 font-mono truncate">
              {activeMerchant?.payoutDetails || 'alnoor.laundry@instapay'}
            </div>
          </div>

          <div>
            <div className="text-slate-400 text-[10px] sm:text-[11px]">اسم المستفيد المعتمد:</div>
            <div className="font-bold text-slate-800 mt-0.5">
              {activeMerchant?.ownerName || 'صاحب المنشأة'}
            </div>
          </div>

          <div>
            <div className="text-slate-400 text-[10px] sm:text-[11px]">حالة الربط المصرفي:</div>
            <div className="text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>مفعل ومعتمد رسمياً</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Breakdown Ledger */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>سجل الطلبات ومحاسبة الوردية الحالية</span>
          </h3>

          <span className="text-[11px] text-slate-500 font-bold font-mono">
            {merchantOrders.length} طلبات
          </span>
        </div>

        {/* Mobile Cards (shown on small phones < 640px) */}
        <div className="sm:hidden space-y-2.5">
          {merchantOrders.map(ord => {
            const gross = ord.laundrySubtotal + (ord.adjustmentsTotal || 0);
            const comm = Math.round(gross * 0.08);
            const net = gross - comm;

            return (
              <div key={ord.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">
                    {ord.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">{ord.customerName}</div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-500">الغسيل: {gross} ج.م (عمولة {comm})</span>
                  <span className="font-bold font-mono text-emerald-700 text-xs">صافي {net} ج.م</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop & Tablet Table (shown on >= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-2.5 px-3">رقم الطلب</th>
                <th className="py-2.5 px-3">العميل</th>
                <th className="py-2.5 px-3">قيمة الغسيل</th>
                <th className="py-2.5 px-3">عمولة (8%)</th>
                <th className="py-2.5 px-3">صافي المغسلة</th>
                <th className="py-2.5 px-3">طريقة الدفع</th>
                <th className="py-2.5 px-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {merchantOrders.map(ord => {
                const gross = ord.laundrySubtotal + (ord.adjustmentsTotal || 0);
                const comm = Math.round(gross * 0.08);
                const net = gross - comm;

                return (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {ord.customerName}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {gross} ج.م
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-700">
                      -{comm} ج.م
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                      {net} ج.م
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {ord.paymentMethod === 'cash_on_delivery' ? 'كاش مع المندوب' : 'دفع إلكتروني'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                        {ord.status === 'completed' ? 'مكتمل' : ord.status === 'processing' ? 'قيد الغسيل' : 'جاري التنفيذ'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
