import React from 'react';
import { useOperations } from '../../context/OperationsContext';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  FileCheck2,
  Truck,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const {
    orders,
    applications,
    deliveryJobs,
    serviceZones,
    commissionConfig,
    language
  } = useOperations();

  const isRtl = language === 'ar';

  // Compute live operational metrics
  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    o => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  const grossLaundryValue = orders.reduce((sum, o) => sum + o.laundrySubtotal, 0);
  const totalCommissions = orders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const totalPlatformFees = orders.reduce((sum, o) => sum + o.platformFee, 0);
  const totalPlatformRevenue = Math.round((totalCommissions + totalPlatformFees) * 100) / 100;

  const newApplications = applications.filter(a => a.status === 'new').length;
  const unassignedJobs = deliveryJobs.filter(j => j.status === 'awaiting_assignment').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isRtl ? 'المنظومة التشغيلية المركزية متصلة ومستقرة' : 'Central Platform Active & Operational'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {isRtl ? 'لوحة القيادة والرقابة التشغيلية' : 'Executive Operations Console'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isRtl
              ? 'متابعة حية لطلبات المغاسل، أسطول التوصيل بالزقازيق والمنصورة، والتحصيل المالي الحقيقي.'
              : 'Real-time monitoring of laundry orders, driver fleet in Zagazig & Mansoura, and financial ledger.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('dispatch')}
            className="px-4 py-2 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>{isRtl ? 'غرفة التوزيع' : 'Dispatch Console'}</span>
          </button>
          <button
            onClick={() => onNavigateTab('applications')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'طلبات الانضمام' : 'Applications'}</span>
            {newApplications > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {newApplications}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">
              {isRtl ? 'الطلبات الجارية النشطة' : 'Active Laundry Orders'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{activeOrders}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span>{isRtl ? `من إجمالي ${totalOrders} طلب مسجل` : `Out of ${totalOrders} lifetime orders`}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-[#08BDF4] hover:text-cyan-700 flex items-center justify-between cursor-pointer"
          >
            <span>{isRtl ? 'استعراض كل الطلبات' : 'View all orders'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Gross Laundry Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">
              {isRtl ? 'إجمالي قيمة خدمات الغسيل' : 'Gross Laundry Volume'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {grossLaundryValue.toLocaleString()} <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              {isRtl ? 'مبيعات حقيقية محسوبة من الطلبات' : 'Calculated from actual completed orders'}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('settlements')}
            className="mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-between cursor-pointer"
          >
            <span>{isRtl ? 'تفاصيل التسويات المالية' : 'View settlements'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Platform Revenue (8% + 20 EGP) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">
              {isRtl ? 'إيراد المنصة (العمولة والرسوم)' : 'Platform Net Revenue'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">
              {totalPlatformRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isRtl
                ? `عمولة ${commissionConfig.commissionRatePercent}% + رسوم ${commissionConfig.platformFeeEgp} ج`
                : `${commissionConfig.commissionRatePercent}% commission + ${commissionConfig.platformFeeEgp} EGP fee`}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('commissions')}
            className="mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center justify-between cursor-pointer"
          >
            <span>{isRtl ? 'إعدادات نسبة العمولة' : 'Configure rates'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Unassigned Dispatch Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">
              {isRtl ? 'مهام توصيل بانتظار إسناد' : 'Unassigned Delivery Legs'}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              unassignedJobs > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-600'
            }`}>
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-2xl font-black ${unassignedJobs > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {unassignedJobs}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isRtl ? 'مهام استلام أو إرجاع بدون مندوب' : 'Jobs requiring driver assignment'}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('dispatch')}
            className="mt-3 pt-3 border-t border-slate-100 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center justify-between cursor-pointer"
          >
            <span>{isRtl ? 'فتح غرفة الإسناد' : 'Open dispatch board'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Active Zones & Pending Action Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Zones Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#08BDF4]" />
              <span>{isRtl ? 'نطاقات التشغيل الحالية' : 'Active Launch Zones'}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('zones')}
              className="text-xs font-bold text-[#08BDF4] hover:underline cursor-pointer"
            >
              {isRtl ? 'إدارة' : 'Manage'}
            </button>
          </div>

          <div className="space-y-3">
            {serviceZones.map(zone => (
              <div
                key={zone.id}
                className={`p-3.5 rounded-xl border transition ${
                  zone.isActive
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900">
                    {zone.nameAr} - {zone.governorateAr}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      zone.isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {zone.isActive
                      ? isRtl ? 'مفعل للإطلاق' : 'Active'
                      : isRtl ? 'توسع مستقبلي' : 'Planned'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>{isRtl ? `${zone.activeLaundriesCount} مغاسل معتمدة` : `${zone.activeLaundriesCount} laundries`}</span>
                  <span>{isRtl ? `${zone.activeDriversCount} مناديب نشطين` : `${zone.activeDriversCount} drivers`}</span>
                  <span className="font-semibold text-slate-700">{zone.deliveryBaseFeeEgp} ج.م توصيل</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Action Feed */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? 'إجراءات تشغيلية تتطلب تدخلاً عاجلاً' : 'Priority Action Queue'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {isRtl ? 'تحديث تلقائي فوري' : 'Live state feed'}
            </span>
          </div>

          <div className="space-y-2.5">
            {/* If there are pending applications */}
            {newApplications > 0 && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {isRtl
                        ? `يوجد ${newApplications} طلب انضمام مغسلة جديد من الموقع التعريفي`
                        : `${newApplications} new merchant applications received`}
                    </div>
                    <div className="text-[11px] text-amber-800">
                      {isRtl
                        ? 'مطلوب مراجعة السجل وبيانات التواصل وتحديد موعد المعاينة الميدانية'
                        : 'Requires verification and preliminary contact'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('applications')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg cursor-pointer shrink-0"
                >
                  {isRtl ? 'بدء المراجعة' : 'Review'}
                </button>
              </div>
            )}

            {/* If there are orders awaiting intake approval */}
            {orders.filter(o => o.status === 'inspection_required' || o.status === 'awaiting_customer_approval').map(ord => (
              <div
                key={ord.id}
                className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {ord.orderNumber} - {ord.merchantName} ({ord.customerName})
                    </div>
                    <div className="text-[11px] text-sky-800">
                      {ord.status === 'awaiting_customer_approval'
                        ? isRtl
                          ? `رصدت المغسلة فروق استلام (+${ord.discrepancy?.differenceEgp} ج.م) بانتظار رد العميل`
                          : 'Intake price discrepancy awaiting customer decision'
                        : isRtl
                        ? 'الملابس وصلت للمغسلة وجارٍ الفحص وتأكيد القطع'
                        : 'Clothes arrived at laundry for intake inspection'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('orders')}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                >
                  {isRtl ? 'عرض الطلب' : 'View'}
                </button>
              </div>
            ))}

            {/* Ready for delivery awaiting return leg */}
            {orders.filter(o => o.status === 'ready_for_delivery').map(ord => (
              <div
                key={ord.id}
                className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {ord.orderNumber} - {isRtl ? 'جاهز للتسليم النهائي' : 'Ready for return'}
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      {isRtl
                        ? `المغسلة أنهت الغسيل والكي. مطلوب إسناد مندوب لإرجاع الملابس لـ ${ord.customerName}`
                        : `Ready at ${ord.merchantName}. Assign driver to deliver to customer.`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('dispatch')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                >
                  {isRtl ? 'إسناد المندوب' : 'Dispatch'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
