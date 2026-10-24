import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { DeliveryJob, DeliveryJobStatus } from '../../types';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Filter,
  DollarSign
} from 'lucide-react';

export const DispatchConsoleView: React.FC = () => {
  const {
    deliveryJobs,
    drivers,
    assignDriverToJob,
    reassignJob,
    driverLogFailedAttempt,
    language
  } = useOperations();

  const isRtl = language === 'ar';

  const [activeTab, setActiveTab] = useState<'all' | 'unassigned' | 'pickup' | 'return_delivery'>('all');
  const [selectedJobForAssign, setSelectedJobForAssign] = useState<DeliveryJob | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [reassignReason, setReassignReason] = useState<string>('');

  const [failAttemptJob, setFailAttemptJob] = useState<DeliveryJob | null>(null);
  const [failReason, setFailReason] = useState<string>('');

  const filteredJobs = deliveryJobs.filter(j => {
    if (activeTab === 'unassigned') return j.status === 'awaiting_assignment';
    if (activeTab === 'pickup') return j.jobType === 'pickup';
    if (activeTab === 'return_delivery') return j.jobType === 'return_delivery';
    return true;
  });

  const getJobStatusBadge = (status: DeliveryJobStatus) => {
    switch (status) {
      case 'awaiting_assignment':
        return { label: isRtl ? 'بانتظار إسناد مندوب' : 'Unassigned', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'assigned':
        return { label: isRtl ? 'تم الإسناد للمندوب' : 'Assigned', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'arrived_pickup':
        return { label: isRtl ? 'المندوب وصل للموقع' : 'Arrived', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      case 'completed':
        return { label: isRtl ? 'مكتمل بنجاح' : 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'attempt_failed':
        return { label: isRtl ? 'تعذر إتمام المحاولة' : 'Attempt Failed', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const handleConfirmAssignment = () => {
    if (!selectedJobForAssign || !selectedDriverId) return;
    if (selectedJobForAssign.assignedDriverId) {
      reassignJob(selectedJobForAssign.id, selectedDriverId, reassignReason || 'إعادة توزيع الحمل التشغيلي');
    } else {
      assignDriverToJob(selectedJobForAssign.id, selectedDriverId);
    }
    setSelectedJobForAssign(null);
    setSelectedDriverId('');
    setReassignReason('');
  };

  const handleConfirmFailedAttempt = () => {
    if (!failAttemptJob || !failReason) return;
    driverLogFailedAttempt(failAttemptJob.id, failReason);
    setFailAttemptJob(null);
    setFailReason('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#08BDF4]" />
            <span>{isRtl ? 'غرفة توزيع مهام التوصيل المركزية (ديسباتش)' : 'Central Dispatch Console'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRtl
              ? 'إدارة مرحلتي التوصيل المنفصلتين: المرحلة 1 (استلام الملابس من العميل للمغسلة) والمرحلة 2 (إرجاع الملابس المغسولة للعميل).'
              : 'Managing the 2 distinct delivery legs: Leg 1 (Pickup to Laundry) & Leg 2 (Return to Customer).'}
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: isRtl ? 'كافة المهام' : 'All Jobs' },
            { id: 'unassigned', label: isRtl ? 'غير مسندة' : 'Unassigned' },
            { id: 'pickup', label: isRtl ? 'مرحلة الاستلام (Leg 1)' : 'Leg 1: Pickup' },
            { id: 'return_delivery', label: isRtl ? 'مرحلة الإرجاع (Leg 2)' : 'Leg 2: Return' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
            <Truck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-sm">
              {isRtl ? 'لا توجد مهام توصيل مطابقة للفلتر' : 'No delivery jobs matching criteria'}
            </p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const statusBadge = getJobStatusBadge(job.status);
            const isPickup = job.jobType === 'pickup';

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition"
              >
                <div>
                  {/* Top Bar: Leg Type & Status */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                        isPickup
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isPickup
                        ? isRtl ? 'مرحلة 1: استلام ملابس' : 'Leg 1: Pickup'
                        : isRtl ? 'مرحلة 2: إرجاع للعميل' : 'Leg 2: Return Delivery'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.color}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* References */}
                  <div className="flex items-center justify-between text-xs font-mono mt-2">
                    <span className="font-bold text-slate-900">{job.jobReference}</span>
                    <span className="text-slate-400 font-semibold">{job.orderNumber}</span>
                  </div>

                  {/* Route: Origin -> Destination */}
                  <div className="space-y-2 mt-3 text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">
                          {isRtl ? 'نقطة الانطلاق (الاستلام):' : 'Pickup From:'}
                        </span>
                        <div className="font-bold text-slate-900">{job.originName}</div>
                        <div className="text-[11px] text-slate-500 truncate">{job.originAddress}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">
                          {isRtl ? 'وجهة التسليم النهائية:' : 'Deliver To:'}
                        </span>
                        <div className="font-bold text-slate-900">{job.destinationName}</div>
                        <div className="text-[11px] text-slate-500 truncate">{job.destinationAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* Scheduled Window & Zone */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.scheduledWindow}</span>
                    </span>
                    <span className="font-semibold text-slate-700">{job.serviceZone}</span>
                  </div>

                  {/* Assigned Driver Details */}
                  <div className="mt-2 p-2 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {job.assignedDriverName ? job.assignedDriverName.slice(0, 1) : '?'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">
                          {job.assignedDriverName || (isRtl ? 'غير مسند لمندوب' : 'Unassigned')}
                        </div>
                        {job.assignedDriverPhone && (
                          <div className="text-[10px] text-slate-400 font-mono dir-ltr inline-block">
                            {job.assignedDriverPhone}
                          </div>
                        )}
                      </div>
                    </div>

                    {job.cashToCollectEgp > 0 && (
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 block">{isRtl ? 'كاش مطلوب:' : 'COD:'}</span>
                        <span className="font-extrabold text-amber-700">{job.cashToCollectEgp} ج.م</span>
                      </div>
                    )}
                  </div>

                  {/* Failure reason notice if any */}
                  {job.failureReason && (
                    <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700">
                      ⚠️ {job.failureReason} (محاولة {job.attemptCount})
                    </div>
                  )}
                </div>

                {/* Dispatcher Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedJobForAssign(job);
                      setSelectedDriverId(job.assignedDriverId || '');
                    }}
                    className="flex-1 py-1.5 bg-[#08BDF4]/15 hover:bg-[#08BDF4] text-[#08BDF4] hover:text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{job.assignedDriverId ? (isRtl ? 'إعادة إسناد' : 'Reassign') : (isRtl ? 'إسناد مندوب' : 'Assign Driver')}</span>
                  </button>

                  {job.status !== 'completed' && (
                    <button
                      onClick={() => setFailAttemptJob(job)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-bold text-xs rounded-lg transition cursor-pointer"
                      title={isRtl ? 'تسجيل تعذر المحاولة' : 'Log failed attempt'}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Driver Assignment Modal */}
      {selectedJobForAssign && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#08BDF4]">
                  {selectedJobForAssign.jobReference}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {selectedJobForAssign.assignedDriverId
                    ? isRtl ? 'إعادة إسناد مهمة التوصيل' : 'Reassign Delivery Job'
                    : isRtl ? 'إسناد كابتن للمهمة' : 'Assign Delivery Driver'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJobForAssign(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                {isRtl ? 'اختر المندوب المتاح في النطاق الجغرافي:' : 'Select Available Driver:'}
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {drivers.map(drv => {
                  const isSelected = selectedDriverId === drv.id;
                  return (
                    <div
                      key={drv.id}
                      onClick={() => setSelectedDriverId(drv.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'border-[#08BDF4] bg-[#08BDF4]/10 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{drv.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">({drv.driverCode})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {drv.serviceZone} | {drv.vehicleType === 'motorcycle' ? 'دراجة نارية' : 'سيارة'}
                        </div>
                      </div>
                      <div className="text-left">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          drv.activeJobsCount === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {drv.activeJobsCount} {isRtl ? 'مهام نشطة' : 'active jobs'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedJobForAssign.assignedDriverId && (
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  {isRtl ? 'سبب إعادة الإسناد:' : 'Reason for Reassignment:'}
                </label>
                <input
                  type="text"
                  value={reassignReason}
                  onChange={e => setReassignReason(e.target.value)}
                  placeholder={isRtl ? 'مثال: تعطل دراجة المندوب الأول أو ازدحام جدول المهام' : 'e.g. Schedule overload or vehicle breakdown'}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedJobForAssign(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={!selectedDriverId}
                onClick={handleConfirmAssignment}
                className="px-4 py-2 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black rounded-xl cursor-pointer disabled:opacity-50"
              >
                {isRtl ? 'تأكيد الإسناد' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Failed Attempt Modal */}
      {failAttemptJob && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5" />
                <span>{isRtl ? 'تسجيل تعذر استلام / تسليم الملابس' : 'Record Failed Attempt'}</span>
              </h3>
              <button
                onClick={() => setFailAttemptJob(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                {isRtl ? 'سبب تعذر المحاولة (يتم إخطار العميل والديسباتشر):' : 'Reason for failure:'}
              </label>
              <textarea
                value={failReason}
                onChange={e => setFailReason(e.target.value)}
                rows={3}
                placeholder={
                  isRtl
                    ? 'مثال: هاتف العميل مغلق ولم يتواجد أحد في العقار / خطأ في العنوان التفصيلي'
                    : 'e.g., Customer phone off, nobody answered door, incorrect address'
                }
                className="w-full p-3 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFailAttemptJob(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={!failReason.trim()}
                onClick={handleConfirmFailedAttempt}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50"
              >
                {isRtl ? 'حفظ وتحديث السجل' : 'Log Failed Attempt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
