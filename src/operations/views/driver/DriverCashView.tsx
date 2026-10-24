import React from 'react';
import { useOperations } from '../../context/OperationsContext';
import { Wallet, DollarSign, CheckCircle2, ArrowDownLeft, ShieldCheck } from 'lucide-react';

export const DriverCashView: React.FC = () => {
  const { currentDriver, language } = useOperations();
  const isRtl = language === 'ar';

  if (!currentDriver) {
    return <div className="p-8 text-center text-slate-500">لا يوجد مندوب محدد</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-[#08BDF4]" />
          <span>{isRtl ? 'العهدة النقدية والتحصيل اليومي' : 'Cash on Hand & Remittances'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isRtl
            ? `متابعة المبالغ النقدية المحصلة من عملاء الدفع عند الاستلام بعهدة الكابتن (${currentDriver.name}).`
            : 'Track cash-on-delivery amounts collected and awaiting platform hub remittance.'}
        </p>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <span className="text-slate-400 text-xs font-bold block">
          {isRtl ? 'إجمالي العهدة النقدية في اليد حالياً:' : 'Current Cash in Hand:'}
        </span>
        <div className="text-3xl sm:text-4xl font-black text-[#08BDF4]">
          {currentDriver.cashInHandEgp.toLocaleString()}{' '}
          <span className="text-base font-normal text-slate-400">ج.م</span>
        </div>
        <p className="text-xs text-slate-400">
          {isRtl
            ? 'تُسلّم العهدة النقدية يومياً لمنسق العمليات بمقر الزقازيق أو عبر التحويل المباشر لحساب المنصة.'
            : 'Remitted daily to operations coordinator at local zone hub.'}
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
          {isRtl ? 'تعليمات وقواعد تداول الكاش' : 'Cash Handling Protocols'}
        </h3>
        <ul className="space-y-2 text-slate-600 list-disc list-inside">
          <li>{isRtl ? 'لا تسلّم كيس الملابس للعميل إلا بعد استلام القيمة المحددة بالكامل في التطبيق.' : 'Only hand over garments after collecting the exact total.'}</li>
          <li>{isRtl ? 'تأكد من عدم وجود أي مبالغ إضافية غير مسجلة في فاتورة المنظومة الرسمية.' : 'Never collect amounts outside the official digital bill.'}</li>
          <li>{isRtl ? 'الحد الأقصى المسموح به للعهدة قبل التوريد هو 1,500 ج.م.' : 'Maximum cash on hand limit before mandatory remittance is 1,500 EGP.'}</li>
        </ul>
      </div>
    </div>
  );
};
