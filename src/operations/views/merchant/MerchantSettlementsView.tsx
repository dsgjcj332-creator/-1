import React from 'react';
import { useOperations } from '../../context/OperationsContext';
import { Wallet, CheckCircle2, Clock, DollarSign, Download, ArrowUpRight } from 'lucide-react';

export const MerchantSettlementsView: React.FC = () => {
  const { currentMerchant, filteredSettlements, filteredOrders, exportToCsv, language } = useOperations();
  const isRtl = language === 'ar';

  const completedOrders = filteredOrders.filter(o => o.status === 'completed' || o.status === 'delivered');
  const totalEarnedGross = completedOrders.reduce((sum, o) => sum + o.laundrySubtotal, 0);
  const totalCommissionPaid = completedOrders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const totalNetReceivable = completedOrders.reduce((sum, o) => sum + o.merchantPayableAmount, 0);

  const handleExport = () => {
    const rows = filteredSettlements.map(s => ({
      StatementNumber: s.statementNumber,
      Period: `${s.periodStart} to ${s.periodEnd}`,
      OrdersCount: s.totalOrdersCount,
      GrossEarnings: s.grossLaundryValue,
      Commission8Percent: s.commissionDeducted,
      NetReceived: s.netPayableAmount,
      Status: s.status,
      BankReference: s.bankTransferReference || 'Pending'
    }));
    exportToCsv(rows, `ala-el-saree-settlements-${currentMerchant?.id || 'merchant'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#08BDF4]" />
            <span>{isRtl ? 'الأرباح ومستحقات التسوية المالية' : 'Store Revenue & Payout Ledger'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRtl
              ? `كشوف الحساب الدورية والتحويلات البنكية الخاصة بمغسلة (${currentMerchant?.nameAr || 'المغسلة'}).`
              : 'Periodical statements, 8% commission deductions, and InstaPay/Bank transfer receipts.'}
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#08BDF4]" />
          <span>{isRtl ? 'تحميل كشف الحساب (CSV)' : 'Export Statements'}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">
            {isRtl ? 'إجمالي المبيعات المنفذة' : 'Gross Laundry Volume'}
          </span>
          <div className="text-2xl font-black text-slate-900">
            {totalEarnedGross.toLocaleString()} <span className="text-xs font-normal text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {completedOrders.length} {isRtl ? 'طلب مكتمل' : 'completed orders'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">
            {isRtl ? 'عمولة المنصة المقتطعة (8%)' : 'Platform Commission (8%)'}
          </span>
          <div className="text-2xl font-black text-purple-700">
            -{totalCommissionPaid.toLocaleString()} <span className="text-xs font-normal text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isRtl ? 'مطبقة على قيمة الغسيل فقط' : 'Applied on laundry subtotal only'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">
            {isRtl ? 'صافي أرباح المغسلة' : 'Net Store Earnings'}
          </span>
          <div className="text-2xl font-black text-emerald-700">
            {totalNetReceivable.toLocaleString()} <span className="text-xs font-normal text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {isRtl ? 'محولة عبر InstaPay أو الحساب البنكي' : 'Paid via InstaPay / Bank'}
          </span>
        </div>
      </div>

      {/* Payout Details Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">
            {isRtl ? 'بيانات التحويل المعتمدة لاستلام المستحقات:' : 'Active Payout Method:'}
          </span>
          <div className="font-extrabold text-base text-[#08BDF4]">
            {currentMerchant?.payoutDetails}
          </div>
          <p className="text-slate-400 mt-0.5">
            {isRtl
              ? `طريقة الصرف: ${currentMerchant?.payoutMethod === 'instapay' ? 'محفظة InstaPay الفورية' : 'تحويل بنكي'}`
              : `Method: ${currentMerchant?.payoutMethod}`}
          </p>
        </div>
        <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4" />
          <span>{isRtl ? 'حساب مصرفي مدقق ونشط' : 'Verified Payout Account'}</span>
        </div>
      </div>

      {/* Statements Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-right border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <th className="p-3.5">{isRtl ? 'رقم كشف التسوية' : 'Statement #'}</th>
              <th className="p-3.5">{isRtl ? 'الفترة المحاسبية' : 'Period'}</th>
              <th className="p-3.5">{isRtl ? 'عدد الطلبات' : 'Orders'}</th>
              <th className="p-3.5">{isRtl ? 'إجمالي المبيعات' : 'Gross Volume'}</th>
              <th className="p-3.5">{isRtl ? 'عمولة 8%' : 'Comm. 8%'}</th>
              <th className="p-3.5">{isRtl ? 'الصافي المحول' : 'Net Paid'}</th>
              <th className="p-3.5">{isRtl ? 'رقم عملية التحويل' : 'Transfer Ref #'}</th>
              <th className="p-3.5">{isRtl ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSettlements.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  {isRtl ? 'لا توجد كشوف تسوية مسجلة لهذه المغسلة بعد' : 'No statements recorded yet'}
                </td>
              </tr>
            ) : (
              filteredSettlements.map(stl => (
                <tr key={stl.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {stl.statementNumber}
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono">
                    {stl.periodStart} ~ {stl.periodEnd}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">{stl.totalOrdersCount}</td>
                  <td className="p-3.5 font-bold text-slate-900">{stl.grossLaundryValue.toLocaleString()} ج.م</td>
                  <td className="p-3.5 font-mono text-purple-700 font-bold">-{stl.commissionDeducted.toLocaleString()} ج.م</td>
                  <td className="p-3.5 font-mono text-emerald-700 font-black text-sm">
                    {stl.netPayableAmount.toLocaleString()} ج.م
                  </td>
                  <td className="p-3.5 font-mono text-slate-700">
                    {stl.bankTransferReference || (isRtl ? 'قيد المراجعة' : 'Pending')}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {stl.status === 'paid' ? (isRtl ? 'تم الصرف' : 'Paid') : stl.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
