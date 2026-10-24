import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { AlertTriangle, CheckCircle2, MessageSquare, Plus, FileText, Check } from 'lucide-react';

export const DisputesView: React.FC = () => {
  const { supportTickets, resolveSupportTicket, language } = useOperations();
  const isRtl = language === 'ar';

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [refundAdjustment, setRefundAdjustment] = useState<number>(0);

  const handleResolve = () => {
    if (!selectedTicketId || !resolutionText.trim()) return;
    resolveSupportTicket(selectedTicketId, resolutionText.trim(), refundAdjustment);
    setSelectedTicketId(null);
    setResolutionText('');
    setRefundAdjustment(0);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <span>{isRtl ? 'البلاغات والنزاعات وادعاءات التلف' : 'Disputes, Claims & Service Support'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isRtl
            ? 'التحقيق في شكاوى جودة الغسيل، بقع الأقمشة الحساسة، الفروقات السعرية، وتسوية التعويضات.'
            : 'Investigation of garment stain claims, delays, pricing discrepancies, and resolution adjustments.'}
        </p>
      </div>

      <div className="space-y-3">
        {supportTickets.map(ticket => (
          <div
            key={ticket.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900">{ticket.ticketNumber}</span>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-slate-700">{ticket.orderNumber}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                ticket.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {ticket.status === 'resolved' ? (isRtl ? 'تمت التسوية' : 'Resolved') : (isRtl ? 'قيد التحقيق' : 'Investigating')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">{isRtl ? 'العميل:' : 'Customer:'}</span>
                <span className="font-bold text-slate-800">{ticket.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{isRtl ? 'المغسلة:' : 'Merchant:'}</span>
                <span className="font-bold text-slate-800">{ticket.merchantName}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
              <span className="font-bold block mb-0.5 text-slate-900">{isRtl ? 'تفاصيل البلاغ:' : 'Description:'}</span>
              <p>{ticket.description}</p>
            </div>

            {ticket.resolutionNotes && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                <span className="font-bold block mb-0.5">{isRtl ? 'قرار التسوية المعتمد:' : 'Resolution:'}</span>
                <p>{ticket.resolutionNotes}</p>
              </div>
            )}

            {ticket.status !== 'resolved' && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className="px-4 py-1.5 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {isRtl ? 'معالجة الشكوى واعتماد التسوية' : 'Resolve Claim'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resolution Modal */}
      {selectedTicketId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <h3 className="text-base font-black text-slate-900">
              {isRtl ? 'تسوية وحل النزاع' : 'Resolve Ticket'}
            </h3>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {isRtl ? 'الإجراء المتخذ وقرار الحل:' : 'Resolution Notes:'}
              </label>
              <textarea
                rows={3}
                value={resolutionText}
                onChange={e => setResolutionText(e.target.value)}
                placeholder={isRtl ? 'مثال: تم التوجيه باستخدام مذيب البقع الإيطالي دون خصومات إضافية' : 'Resolution explanation...'}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTicketId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={!resolutionText.trim()}
                onClick={handleResolve}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50"
              >
                {isRtl ? 'اعتماد الحل' : 'Confirm Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
