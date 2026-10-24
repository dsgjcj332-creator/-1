import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { DeliveryJob, DeliveryJobStatus } from '../../types';
import {
  Truck,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Send,
  Check
} from 'lucide-react';

export const DriverTasksView: React.FC = () => {
  const {
    currentDriver,
    filteredDeliveryJobs,
    driverUpdateJobStatus,
    driverLogFailedAttempt,
    language
  } = useOperations();

  const isRtl = language === 'ar';

  const [proofNote, setProofNote] = useState('');
  const [completeJobModal, setCompleteJobModal] = useState<DeliveryJob | null>(null);
  const [cashCollectedCheck, setCashCollectedCheck] = useState(true);

  const [failModalJob, setFailModalJob] = useState<DeliveryJob | null>(null);
  const [failReason, setFailReason] = useState('');

  if (!currentDriver) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Truck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
        <p className="font-bold text-slate-700">
          {isRtl ? 'لم يتم ربط حساب مندوب توصيل' : 'No driver account linked'}
        </p>
      </div>
    );
  }

  const activeJobs = filteredDeliveryJobs.filter(j => j.status !== 'completed');
  const completedJobs = filteredDeliveryJobs.filter(j => j.status === 'completed');

  const handleConfirmComplete = () => {
    if (!completeJobModal) return;
    driverUpdateJobStatus(
      completeJobModal.id,
      'completed',
      proofNote || 'تم التسليم/الاستلام بنجاح ومطابقة الكود',
      completeJobModal.cashToCollectEgp > 0 ? cashCollectedCheck : false
    );
    setCompleteJobModal(null);
    setProofNote('');
  };

  const handleConfirmFail = () => {
    if (!failModalJob || !failReason.trim()) return;
    driverLogFailedAttempt(failModalJob.id, failReason.trim());
    setFailModalJob(null);
    setFailReason('');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Driver Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-sky-400">
            {currentDriver.serviceZone} | {currentDriver.driverCode}
          </span>
          <h1 className="text-lg sm:text-xl font-black mt-0.5">
            {isRtl ? `كابتن التوصيل: ${currentDriver.name}` : `Courier: ${currentDriver.name}`}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl
              ? `المهام المسندة لك اليوم: ${activeJobs.length} مهام جارية | الكاش باليد: ${currentDriver.cashInHandEgp} ج.م`
              : `${activeJobs.length} active jobs | Cash on hand: ${currentDriver.cashInHandEgp} EGP`}
          </p>
        </div>

        <div className="text-left font-mono font-bold text-sm bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
          {currentDriver.plateNumber || 'موتوسيكل'}
        </div>
      </div>

      {/* Active Tasks List */}
      <div className="space-y-3">
        <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-[#08BDF4]" />
          <span>{isRtl ? 'مهام التوصيل الجارية المطلوب تنفيذها:' : 'Active Assigned Deliveries:'}</span>
        </h2>

        {activeJobs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="font-bold text-sm">
              {isRtl ? 'عاش يا بطل! لا توجد مهام معلقة حالياً' : 'All jobs completed! No pending tasks'}
            </p>
          </div>
        ) : (
          activeJobs.map(job => {
            const isPickup = job.jobType === 'pickup';
            const isArrived = job.status === 'arrived_pickup';

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
              >
                {/* Job Tag & Reference */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span
                    className={`px-2.5 py-1 rounded-lg font-black uppercase text-[10px] ${
                      isPickup
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isPickup
                      ? isRtl ? 'مهمة 1: استلام ملابس من العميل' : 'Leg 1: Pickup from Customer'
                      : isRtl ? 'مهمة 2: تسليم ملابس مغسولة للعميل' : 'Leg 2: Return to Customer'}
                  </span>
                  <span className="font-mono font-bold text-slate-800">{job.jobReference}</span>
                </div>

                {/* Contact & Destination */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {isPickup ? (isRtl ? 'العميل المستهدف للاستلام:' : 'Customer:') : (isRtl ? 'المغسلة (استلام الكيس):' : 'Origin Laundry:')}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {isPickup ? job.originName : job.originName}
                      </span>
                    </div>

                    <a
                      href={`tel:${isPickup ? job.originPhone : job.destinationPhone}`}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 font-mono text-xs cursor-pointer shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isPickup ? job.originPhone : job.destinationPhone}</span>
                    </a>
                  </div>

                  <div className="text-slate-600 flex items-start gap-1.5 pt-1 border-t border-slate-200/60">
                    <MapPin className="w-4 h-4 text-[#08BDF4] shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">
                      {isPickup ? job.originAddress : job.destinationAddress}
                    </span>
                  </div>
                </div>

                {/* Cash & Window */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.scheduledWindow}</span>
                  </span>

                  {job.cashToCollectEgp > 0 && (
                    <span className="font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {isRtl ? 'تحصيل كاش مطلوب: ' : 'Collect COD: '} {job.cashToCollectEgp} ج.م
                    </span>
                  )}
                </div>

                {/* Driver Action Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {!isArrived && (
                    <button
                      onClick={() => driverUpdateJobStatus(job.id, 'arrived_pickup')}
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl cursor-pointer transition flex items-center justify-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'أنا وصلت للموقع الآن' : 'I have Arrived'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setCompleteJobModal(job);
                      setCashCollectedCheck(job.cashToCollectEgp > 0);
                    }}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl cursor-pointer shadow-xs transition flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isPickup
                        ? isRtl ? 'تم استلام الكيس بنجاح' : 'Pickup Completed'
                        : isRtl ? 'تم التسليم للعميل بنجاح' : 'Delivery Completed'}
                    </span>
                  </button>

                  <button
                    onClick={() => setFailModalJob(job)}
                    className="px-3 py-2 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold rounded-xl cursor-pointer transition"
                    title={isRtl ? 'تعذر إتمام المهمة' : 'Report failure'}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completion Confirmation Modal */}
      {completeJobModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <h3 className="text-base font-black text-slate-900">
              {completeJobModal.jobType === 'pickup'
                ? isRtl ? 'تأكيد استلام كيس الملابس' : 'Confirm Bag Collection'
                : isRtl ? 'تأكيد تسليم الملابس للعميل' : 'Confirm Garments Delivery'}
            </h3>

            {completeJobModal.cashToCollectEgp > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                  <input
                    type="checkbox"
                    checked={cashCollectedCheck}
                    onChange={e => setCashCollectedCheck(e.target.checked)}
                    className="w-4 h-4 text-[#08BDF4]"
                  />
                  <span>
                    {isRtl ? `تم تحصيل مبلغ ${completeJobModal.cashToCollectEgp} ج.م نقداً من العميل` : `Collected ${completeJobModal.cashToCollectEgp} EGP cash`}
                  </span>
                </label>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {isRtl ? 'ملاحظة إثبات الاستلام / التسليم:' : 'Proof of handoff note:'}
              </label>
              <input
                type="text"
                value={proofNote}
                onChange={e => setProofNote(e.target.value)}
                placeholder={isRtl ? 'مثال: تم الاستلام بحالة جيدة مطابق لرقم الطلب' : 'e.g. Bag handed over in sealed Ala El Saree bag'}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCompleteJobModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl cursor-pointer shadow-xs"
              >
                {isRtl ? 'تأكيد وإغلاق المهمة' : 'Complete Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Failure Report Modal */}
      {failModalJob && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <h3 className="text-base font-black text-rose-700 flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5" />
              <span>{isRtl ? 'تسجيل تعذر المهمة' : 'Log Failed Attempt'}</span>
            </h3>
            <p className="text-slate-500">
              {isRtl ? 'يرجى كتابة السبب الدقيق لتعذر الاستلام أو التسليم' : 'Provide exact reason'}
            </p>
            <textarea
              rows={3}
              value={failReason}
              onChange={e => setFailReason(e.target.value)}
              placeholder={isRtl ? 'مثال: هاتف العميل مغلق / غير متواجد بالعنوان' : 'e.g. Customer unreachable'}
              className="w-full p-2.5 border border-slate-200 rounded-xl"
            />
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFailModalJob(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={!failReason.trim()}
                onClick={handleConfirmFail}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50"
              >
                {isRtl ? 'حفظ السبب' : 'Log Failure'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
