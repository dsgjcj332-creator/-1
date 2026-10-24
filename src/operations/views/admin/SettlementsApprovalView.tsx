import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { SettlementStatement } from '../../types';
import {
  Receipt,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Plus,
  Send,
  Eye,
  FileText
} from 'lucide-react';

export const SettlementsApprovalView: React.FC = () => {
  const {
    settlements,
    merchants,
    generateSettlementStatement,
    approveSettlement,
    recordSettlementPayout,
    exportToCsv,
    language
  } = useOperations();

  const isRtl = language === 'ar';

  const [selectedMerchantId, setSelectedMerchantId] = useState(merchants[0]?.id || '');
  const [periodStart, setPeriodStart] = useState('2026-10-15');
  const [periodEnd, setPeriodEnd] = useState('2026-10-22');

  const [activePayoutModal, setActivePayoutModal] = useState<SettlementStatement | null>(null);
  const [transferRef, setTransferRef] = useState('');
  const [payoutDate, setPayoutDate] = useState(new Date().toISOString().slice(0, 10));

  const handleCreateStatement = () => {
    if (!selectedMerchantId) return;
    generateSettlementStatement(selectedMerchantId, periodStart, periodEnd);
  };

  const handleConfirmPayout = () => {
    if (!activePayoutModal || !transferRef.trim()) return;
    recordSettlementPayout(activePayoutModal.id, transferRef.trim(), payoutDate);
    setActivePayoutModal(null);
    setTransferRef('');
  };

  const handleExport = () => {
    const rows = settlements.map(s => ({
      StatementNumber: s.statementNumber,
      Merchant: s.merchantName,
      Period: `${s.periodStart} to ${s.periodEnd}`,
      OrdersCount: s.totalOrdersCount,
      GrossValue: s.grossLaundryValue,
      CommissionDeducted: s.commissionDeducted,
      NetPayable: s.netPayableAmount,
      Status: s.status,
      BankReference: s.bankTransferReference || 'N/A',
      PayoutDate: s.payoutDate || 'N/A'
    }));
    exportToCsv(rows, 'ala-el-saree-settlements-statements');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#08BDF4]" />
            <span>{isRtl ? 'تسويات ومستحقات المغاسل الشريكة' : 'Merchant Settlement & Payout Ledger'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRtl
              ? 'احتساب صافي مستحقات المغاسل بعد خصم عمولة المنصة (8%)، واعتماد كشوف الحساب وتسجيل أرقام التحويل البنكي وInstaPay.'
              : 'Calculate net payable after deducting 8% commission, review statements, and log bank/InstaPay payout transfer references.'}
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#08BDF4]" />
          <span>{isRtl ? 'تصدير كشوف التسوية (CSV)' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Generator Form */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Plus className="w-4 h-4 text-[#08BDF4]" />
          <span>{isRtl ? 'إنشاء كشف تسوية جديد لفترة محاسبية' : 'Generate Settlement Statement for Period'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'المغسلة الشريكة:' : 'Merchant:'}</label>
            <select
              value={selectedMerchantId}
              onChange={e => setSelectedMerchantId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden"
            >
              {merchants.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nameAr} ({m.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'من تاريخ:' : 'From:'}</label>
            <input
              type="date"
              value={periodStart}
              onChange={e => setPeriodStart(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'إلى تاريخ:' : 'To:'}</label>
            <input
              type="date"
              value={periodEnd}
              onChange={e => setPeriodEnd(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCreateStatement}
              className="w-full py-2.5 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black rounded-xl cursor-pointer shadow-xs"
            >
              {isRtl ? 'احتساب وإنشاء الكشف' : 'Generate Statement'}
            </button>
          </div>
        </div>
      </div>

      {/* Statements Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {settlements.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-sm">
              {isRtl ? 'لا توجد كشوف تسوية منشأة حالياً' : 'No settlement statements yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3.5">{isRtl ? 'رقم الكشف' : 'Statement #'}</th>
                  <th className="p-3.5">{isRtl ? 'المغسلة' : 'Merchant'}</th>
                  <th className="p-3.5">{isRtl ? 'الفترة' : 'Period'}</th>
                  <th className="p-3.5">{isRtl ? 'الطلبات' : 'Orders'}</th>
                  <th className="p-3.5">{isRtl ? 'إجمالي المبيعات' : 'Gross Laundry'}</th>
                  <th className="p-3.5">{isRtl ? 'العمولة المستقطعة' : 'Commission (8%)'}</th>
                  <th className="p-3.5">{isRtl ? 'الصافي المستحق' : 'Net Payable'}</th>
                  <th className="p-3.5">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3.5 text-center">{isRtl ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settlements.map(stl => {
                  const isPaid = stl.status === 'paid';
                  const isApproved = stl.status === 'approved';
                  return (
                    <tr key={stl.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {stl.statementNumber}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {stl.merchantName}
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono">
                        {stl.periodStart} ~ {stl.periodEnd}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        {stl.totalOrdersCount}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {stl.grossLaundryValue.toLocaleString()} ج.م
                      </td>
                      <td className="p-3.5 font-mono text-purple-700 font-bold">
                        -{stl.commissionDeducted.toLocaleString()} ج.م
                      </td>
                      <td className="p-3.5 font-mono text-emerald-700 font-black text-sm">
                        {stl.netPayableAmount.toLocaleString()} ج.م
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : isApproved
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isPaid
                            ? isRtl ? 'تم التحويل والصرف' : 'Paid'
                            : isApproved
                            ? isRtl ? 'معتمد للصرف' : 'Approved'
                            : isRtl ? 'قيد المراجعة' : 'Pending Review'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {!isApproved && !isPaid && (
                            <button
                              onClick={() => approveSettlement(stl.id)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer text-[11px]"
                            >
                              {isRtl ? 'اعتماد' : 'Approve'}
                            </button>
                          )}

                          {isApproved && !isPaid && (
                            <button
                              onClick={() => {
                                setActivePayoutModal(stl);
                                setTransferRef(`INSTA-EG-${Date.now().toString().slice(-6)}`);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer text-[11px] flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>{isRtl ? 'تسجيل التحويل' : 'Record Payout'}</span>
                            </button>
                          )}

                          {isPaid && (
                            <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[120px]">
                              {stl.bankTransferReference}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Confirmation Modal */}
      {activePayoutModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#08BDF4]">
                  {activePayoutModal.statementNumber}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {isRtl ? 'تأكيد تحويل مستحقات المغسلة' : 'Record Merchant Payout'}
                </h3>
              </div>
              <button
                onClick={() => setActivePayoutModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800">{activePayoutModal.merchantName}</div>
              <div className="text-slate-500">
                {isRtl ? 'الصافي المستحق للتحويل:' : 'Net Amount:'}{' '}
                <span className="font-extrabold text-emerald-700 text-sm">
                  {activePayoutModal.netPayableAmount.toLocaleString()} ج.م
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                {isRtl ? 'رقم مرجع التحويل البنكي أو InstaPay:' : 'Bank/InstaPay Transfer Reference #:'}
              </label>
              <input
                type="text"
                value={transferRef}
                onChange={e => setTransferRef(e.target.value)}
                placeholder="e.g. INSTA-EG-829104 or BM-TRX-1029"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">{isRtl ? 'تاريخ الصرف والتحويل:' : 'Payout Date:'}</label>
              <input
                type="date"
                value={payoutDate}
                onChange={e => setPayoutDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActivePayoutModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmPayout}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl cursor-pointer"
              >
                {isRtl ? 'تأكيد الصرف وتحديث السجل' : 'Confirm Payout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
