import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { LaundryOrder, OrderLifecycleStatus } from '../../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Eye,
  Store,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const OrdersSupervisionView: React.FC = () => {
  const {
    filteredOrders,
    merchants,
    serviceZones,
    exportToCsv,
    language
  } = useOperations();

  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedMerchant, setSelectedMerchant] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeOrderDetail, setActiveOrderDetail] = useState<LaundryOrder | null>(null);

  const filtered = filteredOrders.filter(o => {
    if (selectedCity !== 'all' && o.city !== selectedCity) return false;
    if (selectedMerchant !== 'all' && o.merchantId !== selectedMerchant) return false;
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.merchantName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderLifecycleStatus) => {
    switch (status) {
      case 'awaiting_laundry_confirmation':
        return { label: isRtl ? 'بانتظار قبول المغسلة' : 'Awaiting Laundry', color: 'bg-amber-100 text-amber-800' };
      case 'accepted':
        return { label: isRtl ? 'تم القبول وجدولة الاستلام' : 'Accepted', color: 'bg-blue-100 text-blue-800' };
      case 'collected':
        return { label: isRtl ? 'تم استلام الملابس من العميل' : 'Collected', color: 'bg-sky-100 text-sky-800' };
      case 'inspection_required':
        return { label: isRtl ? 'بالمغسلة / فحص الاستلام' : 'Intake Inspection', color: 'bg-purple-100 text-purple-800' };
      case 'awaiting_customer_approval':
        return { label: isRtl ? 'بانتظار موافقة العميل على الفروق' : 'Awaiting Cust. Approval', color: 'bg-orange-100 text-orange-800' };
      case 'processing':
        return { label: isRtl ? 'قيد الغسيل والكي' : 'Processing', color: 'bg-indigo-100 text-indigo-800' };
      case 'ready_for_delivery':
        return { label: isRtl ? 'جاهز للتسليم النهائي' : 'Ready for Delivery', color: 'bg-emerald-100 text-emerald-800' };
      case 'out_for_delivery':
        return { label: isRtl ? 'المندوب في الطريق للتسليم' : 'Out for Delivery', color: 'bg-teal-100 text-teal-800' };
      case 'delivered':
        return { label: isRtl ? 'تم التسليم للعميل' : 'Delivered', color: 'bg-emerald-100 text-emerald-800' };
      case 'completed':
        return { label: isRtl ? 'مكتمل ومحاسب عليه' : 'Completed', color: 'bg-slate-100 text-slate-800' };
      case 'failed_pickup':
        return { label: isRtl ? 'تعذر استلام الملابس' : 'Failed Pickup', color: 'bg-rose-100 text-rose-800' };
      case 'failed_delivery':
        return { label: isRtl ? 'تعذر تسليم الملابس' : 'Failed Delivery', color: 'bg-rose-100 text-rose-800' };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700' };
    }
  };

  const handleExport = () => {
    const rows = filtered.map(o => ({
      OrderNumber: o.orderNumber,
      Date: o.createdAt,
      Customer: o.customerName,
      Phone: o.customerPhone,
      Merchant: o.merchantName,
      City: o.city,
      Status: o.status,
      LaundrySubtotal: o.laundrySubtotal,
      CommissionAmount: o.commissionAmount,
      PlatformFee: o.platformFee,
      CustomerTotalPaid: o.customerTotalPaid,
      MerchantPayableAmount: o.merchantPayableAmount,
      PaymentMethod: o.paymentMethod,
      IsSettled: o.isSettled ? 'Yes' : 'No'
    }));
    exportToCsv(rows, 'ala-el-saree-orders-ledger');
  };

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#08BDF4]" />
            <span>{isRtl ? 'إدارة وسجل طلبات المنصة' : 'Central Marketplace Orders'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRtl
              ? 'متابعة تدفق الطلبات عبر كافة المغاسل والمدن، وتدقيق حسابات العمولات والتسويات.'
              : 'Supervision across all participating laundries, items intake checks, and financial snapshots.'}
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#08BDF4]" />
          <span>{isRtl ? 'تصدير كشف الطلبات (CSV)' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              isRtl
                ? 'بحث برقم الطلب، اسم العميل، الهاتف، أو المغسلة...'
                : 'Search order #, customer, phone, or laundry...'
            }
            className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#08BDF4]"
          />
        </div>

        {/* City Filter */}
        <select
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
        >
          <option value="all">{isRtl ? 'كافة المدن' : 'All Cities'}</option>
          <option value="الزقازيق">{isRtl ? 'الزقازيق' : 'Zagazig'}</option>
          <option value="المنصورة">{isRtl ? 'المنصورة' : 'Mansoura'}</option>
        </select>

        {/* Merchant Filter */}
        <select
          value={selectedMerchant}
          onChange={e => setSelectedMerchant(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
        >
          <option value="all">{isRtl ? 'كافة المغاسل' : 'All Laundries'}</option>
          {merchants.map(m => (
            <option key={m.id} value={m.id}>
              {m.nameAr}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
        >
          <option value="all">{isRtl ? 'كافة الحالات' : 'All Statuses'}</option>
          <option value="awaiting_laundry_confirmation">{isRtl ? 'بانتظار قبول المغسلة' : 'Awaiting Laundry'}</option>
          <option value="inspection_required">{isRtl ? 'فحص الاستلام' : 'Inspection Required'}</option>
          <option value="awaiting_customer_approval">{isRtl ? 'بانتظار موافقة العميل' : 'Awaiting Approval'}</option>
          <option value="processing">{isRtl ? 'قيد الغسيل والكي' : 'Processing'}</option>
          <option value="ready_for_delivery">{isRtl ? 'جاهز للتسليم' : 'Ready'}</option>
          <option value="completed">{isRtl ? 'مكتمل' : 'Completed'}</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-sm">
              {isRtl ? 'لا توجد طلبات تطابق معايير البحث' : 'No orders matching criteria'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3.5">{isRtl ? 'رقم الطلب' : 'Order #'}</th>
                  <th className="p-3.5">{isRtl ? 'العميل' : 'Customer'}</th>
                  <th className="p-3.5">{isRtl ? 'المغسلة الشريكة' : 'Laundry'}</th>
                  <th className="p-3.5">{isRtl ? 'المدينة' : 'City'}</th>
                  <th className="p-3.5">{isRtl ? 'قيمة الغسيل' : 'Laundry Subtotal'}</th>
                  <th className="p-3.5">{isRtl ? 'عمولة المنصة (8%)' : 'Commission (8%)'}</th>
                  <th className="p-3.5">{isRtl ? 'صافي مستحق المغسلة' : 'Net Merchant'}</th>
                  <th className="p-3.5">{isRtl ? 'الحالة التشغيلية' : 'Status'}</th>
                  <th className="p-3.5 text-center">{isRtl ? 'التفاصيل' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(ord => {
                  const badge = getStatusBadge(ord.status);
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {ord.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono dir-ltr inline-block">
                          {ord.customerPhone}
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        {ord.merchantName}
                      </td>
                      <td className="p-3.5 text-slate-600">{ord.city}</td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {ord.laundrySubtotal} ج.م
                        {ord.adjustmentsTotal > 0 && (
                          <span className="text-[10px] text-amber-600 font-semibold block">
                            (+{ord.adjustmentsTotal} فروقات)
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-purple-700 font-bold">
                        {ord.commissionAmount} ج.م
                      </td>
                      <td className="p-3.5 font-mono text-emerald-700 font-bold">
                        {ord.merchantPayableAmount} ج.م
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setActiveOrderDetail(ord)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#08BDF4] hover:text-slate-950 font-bold rounded-lg transition cursor-pointer inline-flex items-center gap-1 text-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'عرض' : 'View'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {activeOrderDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#08BDF4]">
                  {activeOrderDetail.orderNumber}
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  {isRtl ? 'تفاصيل الطلب والحساب المالي' : 'Order & Ledger Breakdown'}
                </h2>
                <p className="text-slate-500">
                  {activeOrderDetail.merchantName} | {activeOrderDetail.customerName}
                </p>
              </div>
              <button
                onClick={() => setActiveOrderDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Financial Ledger Snapshot Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>{isRtl ? 'حسبة العمولات والرسوم المعتمدة للطلب:' : 'Financial Ledger Snapshot:'}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                  {activeOrderDetail.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام (COD)' : 'إلكتروني'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">{isRtl ? 'قيمة خدمات الغسيل:' : 'Laundry Subtotal:'}</span>
                  <span className="font-bold text-slate-900">{activeOrderDetail.laundrySubtotal} ج.م</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{isRtl ? 'عمولة المنصة (8%):' : 'Platform Comm. (8%):'}</span>
                  <span className="font-bold text-purple-700">{activeOrderDetail.commissionAmount} ج.م</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{isRtl ? 'رسوم المنصة (ثابتة):' : 'Platform Fee:'}</span>
                  <span className="font-bold text-slate-800">{activeOrderDetail.platformFee} ج.م</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{isRtl ? 'رسوم التوصيل للعميل:' : 'Delivery Fee:'}</span>
                  <span className="font-bold text-slate-800">{activeOrderDetail.deliveryFeeCustomer} ج.م</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-xs">
                <div>
                  <span className="text-slate-500">{isRtl ? 'إجمالي المطلوب من العميل: ' : 'Customer Total: '}</span>
                  <span className="text-slate-900 font-extrabold">{activeOrderDetail.customerTotalPaid} ج.م</span>
                </div>
                <div>
                  <span className="text-slate-500">{isRtl ? 'صافي مستحق المغسلة: ' : 'Net Payable to Laundry: '}</span>
                  <span className="text-emerald-700 font-black">{activeOrderDetail.merchantPayableAmount} ج.م</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900">{isRtl ? 'قطع الملابس المفحوصة:' : 'Garment Items:'}</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">{isRtl ? 'القطعة' : 'Item'}</th>
                      <th className="p-2.5">{isRtl ? 'الخدمة' : 'Service'}</th>
                      <th className="p-2.5">{isRtl ? 'الكمية' : 'Qty'}</th>
                      <th className="p-2.5">{isRtl ? 'سعر الوحدة' : 'Unit Price'}</th>
                      <th className="p-2.5">{isRtl ? 'المجموع' : 'Subtotal'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeOrderDetail.items.map(item => (
                      <tr key={item.id}>
                        <td className="p-2.5">
                          <div className="font-bold text-slate-800">{item.nameAr}</div>
                          {item.stainDamageNotes && (
                            <div className="text-[10px] text-amber-700 bg-amber-50 p-1 rounded mt-0.5">
                              ⚠️ {item.stainDamageNotes}
                            </div>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-600">
                          {item.serviceType === 'wash_iron' ? 'غسيل وكي بخار' : item.serviceType === 'dry_clean' ? 'دراي كلين' : 'غسيل فقط'}
                        </td>
                        <td className="p-2.5 font-bold text-slate-800">{item.quantity}</td>
                        <td className="p-2.5">{item.unitPrice} ج.م</td>
                        <td className="p-2.5 font-bold text-slate-900">{item.subtotal} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timeline History */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900">{isRtl ? 'سجل تتبع ومراحل الطلب:' : 'Order Event Timeline:'}</h3>
              <div className="space-y-2 border-r-2 border-slate-200 pr-3 mr-1">
                {activeOrderDetail.statusHistory.map((hist, idx) => (
                  <div key={idx} className="relative">
                    <span className="w-2 h-2 rounded-full bg-[#08BDF4] absolute -right-[17px] top-1"></span>
                    <div className="font-bold text-slate-800">{getStatusBadge(hist.status).label}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(hist.timestamp).toLocaleTimeString('ar-EG')} - {hist.actor}
                    </div>
                    {hist.note && <div className="text-[11px] text-slate-600 italic mt-0.5">{hist.note}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveOrderDetail(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
