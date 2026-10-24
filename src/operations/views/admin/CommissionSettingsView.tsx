import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import {
  Percent,
  CheckCircle2,
  DollarSign,
  Calculator,
  ShieldCheck,
  Save,
  AlertCircle
} from 'lucide-react';

export const CommissionSettingsView: React.FC = () => {
  const { commissionConfig, updateCommissionConfig, language } = useOperations();
  const isRtl = language === 'ar';

  const [ratePercent, setRatePercent] = useState<number>(commissionConfig.commissionRatePercent);
  const [feeEgp, setFeeEgp] = useState<number>(commissionConfig.platformFeeEgp);
  const [feePayer, setFeePayer] = useState<'customer' | 'merchant'>(commissionConfig.platformFeePayer);
  const [deliveryFee, setDeliveryFee] = useState<number>(commissionConfig.defaultDeliveryFeeCustomer);
  const [driverPayout, setDriverPayout] = useState<number>(commissionConfig.driverLegCompensationEgp);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live Simulation Inputs
  const [simLaundrySubtotal, setSimLaundrySubtotal] = useState<number>(300);

  // Computed simulation figures
  const simCommission = Math.round(simLaundrySubtotal * (ratePercent / 100) * 100) / 100;
  const simMerchantPayable =
    feePayer === 'merchant'
      ? Math.round((simLaundrySubtotal - simCommission - feeEgp) * 100) / 100
      : Math.round((simLaundrySubtotal - simCommission) * 100) / 100;
  const simCustomerTotal =
    feePayer === 'customer'
      ? simLaundrySubtotal + feeEgp + deliveryFee
      : simLaundrySubtotal + deliveryFee;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCommissionConfig({
      commissionRatePercent: Number(ratePercent),
      platformFeeEgp: Number(feeEgp),
      platformFeePayer: feePayer,
      defaultDeliveryFeeCustomer: Number(deliveryFee),
      driverLegCompensationEgp: Number(driverPayout)
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Percent className="w-6 h-6 text-[#08BDF4]" />
          <span>{isRtl ? 'قواعد العمولات والرسوم التجارية' : 'Commercial Commission & Fee Rules'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isRtl
            ? 'تحديد نسبة عمولة المغسلة ورسوم الخدمة الثابتة وطرف التحمل، مع محاكي فوري لحساب التسوية.'
            : 'Configure merchant commission rates, per-order platform fee, payer entity, and interactive calculator.'}
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            {isRtl
              ? 'تم حفظ واعتماد القواعد التجارية وتسجيل التغيير في سجل العمليات بنجاح.'
              : 'Commercial rules updated and logged to audit ledger successfully.'}
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h2 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            {isRtl ? 'إعدادات المنصة التشغيلية' : 'Platform Revenue Parameters'}
          </h2>

          {/* Commission Rate */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">
              {isRtl ? 'نسبة عمولة المنصة على خدمات الغسيل (%):' : 'Platform Commission Rate (%):'}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={ratePercent}
                onChange={e => setRatePercent(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono focus:outline-hidden focus:border-[#08BDF4]"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isRtl ? 'النسبة الافتراضية المعتمدة هي 8% من قيمة الغسيل الصافية.' : 'Default approved is 8% of eligible laundry subtotal.'}
            </p>
          </div>

          {/* Platform Service Fee */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">
              {isRtl ? 'رسوم خدمة المنصة الثابتة لكل طلب (ج.م):' : 'Fixed Platform Service Fee (EGP):'}
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={feeEgp}
                onChange={e => setFeeEgp(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono focus:outline-hidden focus:border-[#08BDF4]"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">ج.م</span>
            </div>
          </div>

          {/* Fee Payer */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              {isRtl ? 'الطرف المتحمل لرسوم الخدمة الثابتة (20 ج.م):' : 'Platform Fee Payer Entity:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFeePayer('customer')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  feePayer === 'customer'
                    ? 'border-[#08BDF4] bg-[#08BDF4]/10 text-slate-900 shadow-xs'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {isRtl ? 'العميل (تضاف للفاتورة)' : 'Customer (Added to bill)'}
              </button>
              <button
                type="button"
                onClick={() => setFeePayer('merchant')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  feePayer === 'merchant'
                    ? 'border-[#08BDF4] bg-[#08BDF4]/10 text-slate-900 shadow-xs'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {isRtl ? 'المغسلة (تخصم من الصافي)' : 'Merchant (Deducted)'}
              </button>
            </div>
          </div>

          {/* Delivery Parameters */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {isRtl ? 'رسوم توصيل العميل:' : 'Customer Delivery Fee:'}
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={e => setDeliveryFee(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {isRtl ? 'مستحق المندوب للرحلة:' : 'Driver Leg Payout:'}
              </label>
              <input
                type="number"
                value={driverPayout}
                onChange={e => setDriverPayout(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black rounded-xl cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'حفظ واعتماد القواعد' : 'Save Rules'}</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Calculator */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="font-extrabold text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#08BDF4]" />
              <span>{isRtl ? 'محاكي الحسبة المالية الفورية' : 'Live Calculation Simulator'}</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Real-time check</span>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              {isRtl ? 'قيمة خدمات الغسيل المفترضة (ج.م):' : 'Sample Laundry Subtotal (EGP):'}
            </label>
            <input
              type="number"
              step="10"
              value={simLaundrySubtotal}
              onChange={e => setSimLaundrySubtotal(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl font-mono text-base font-bold text-white focus:outline-hidden focus:border-[#08BDF4]"
            />
          </div>

          {/* Computed Breakdown */}
          <div className="space-y-2 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 font-mono">
            <div className="flex justify-between items-center text-slate-300">
              <span>{isRtl ? 'قيمة الغسيل للطلب:' : 'Laundry Subtotal:'}</span>
              <span className="font-bold text-white">{simLaundrySubtotal} ج.م</span>
            </div>

            <div className="flex justify-between items-center text-purple-300">
              <span>{isRtl ? `عمولة المنصة (${ratePercent}%):` : `Platform Commission (${ratePercent}%):`}</span>
              <span className="font-bold">-{simCommission} ج.م</span>
            </div>

            <div className="flex justify-between items-center text-sky-300">
              <span>{isRtl ? `رسوم خدمة المنصة (${feePayer === 'customer' ? 'على العميل' : 'على المغسلة'}):` : `Platform Fee (${feePayer}):`}</span>
              <span className="font-bold">{feeEgp} ج.م</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span>{isRtl ? 'رسوم التوصيل للعميل:' : 'Customer Delivery Fee:'}</span>
              <span className="font-bold">+{deliveryFee} ج.م</span>
            </div>

            <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-sm font-black">
              <span className="text-emerald-400">{isRtl ? 'صافي مستحق المغسلة:' : 'Net to Merchant:'}</span>
              <span className="text-emerald-400">{simMerchantPayable} ج.م</span>
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-slate-200">
              <span>{isRtl ? 'إجمالي المطلوب من العميل:' : 'Customer Total Bill:'}</span>
              <span className="text-white font-extrabold">{simCustomerTotal} ج.م</span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            💡 {isRtl
              ? 'توضح هذه الحسبة تطبيق المثال الإرشادي الوارد بالمواصفات (عند subtotal = 300 ج.م والعمولة 8% = 24 ج.م ورسوم المنصة 20 ج.م والتوصيل 25 ج.م).'
              : 'Matches the illustrative example from specifications (subtotal = 300 EGP, 8% commission = 24 EGP, 20 EGP fee, 25 EGP delivery).'}
          </div>
        </div>
      </form>
    </div>
  );
};
