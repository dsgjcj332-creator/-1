import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { MerchantApplication, MerchantApplicationStatus } from '../../types';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Store,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Filter,
  Check,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const ApplicationsReviewView: React.FC = () => {
  const {
    applications,
    reviewApplication,
    advanceOnboardingStage,
    language
  } = useOperations();

  const isRtl = language === 'ar';
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<MerchantApplication | null>(null);

  // Review modal state
  const [reviewNote, setReviewNote] = useState('');
  const [decisionReason, setDecisionReason] = useState('');

  const filtered = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: MerchantApplicationStatus) => {
    switch (status) {
      case 'new':
        return {
          label: isRtl ? 'طلب جديد' : 'New',
          color: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      case 'under_review':
        return {
          label: isRtl ? 'قيد المراجعة' : 'Under Review',
          color: 'bg-blue-100 text-blue-800 border-blue-300'
        };
      case 'info_requested':
        return {
          label: isRtl ? 'مطلوب استيفاء بيانات' : 'Info Requested',
          color: 'bg-purple-100 text-purple-800 border-purple-300'
        };
      case 'approved':
        return {
          label: isRtl ? 'تمت الموافقة' : 'Approved',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
      case 'rejected':
        return {
          label: isRtl ? 'مرفوض' : 'Rejected',
          color: 'bg-rose-100 text-rose-800 border-rose-300'
        };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const handleApprove = () => {
    if (!selectedApp) return;
    reviewApplication(selectedApp.id, 'approved', reviewNote, decisionReason);
    advanceOnboardingStage(selectedApp.id, 'commercial_terms');
    setSelectedApp(null);
    setReviewNote('');
    setDecisionReason('');
  };

  const handleReject = () => {
    if (!selectedApp) return;
    reviewApplication(selectedApp.id, 'rejected', reviewNote, decisionReason || 'لا يستوفي معايير الجودة الحالية للمنصة');
    setSelectedApp(null);
    setReviewNote('');
    setDecisionReason('');
  };

  const handleRequestInfo = () => {
    if (!selectedApp) return;
    reviewApplication(selectedApp.id, 'info_requested', reviewNote, decisionReason || 'يرجى تزويدنا بصورة السجل التجاري ورخصة المحل');
    setSelectedApp(null);
    setReviewNote('');
    setDecisionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-[#08BDF4]" />
            <span>{isRtl ? 'طلبات انضمام المغاسل الشريكة' : 'Merchant Partnership Applications'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRtl
              ? 'تستقبل المنصة الطلبات المقدمة عبر الموقع التعريفي الرسمي لفحصها وتأهيل المغاسل في الزقازيق والمنصورة.'
              : 'Incoming applications submitted via corporate landing page for due diligence and onboarding.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: isRtl ? 'الكل' : 'All' },
            { id: 'new', label: isRtl ? 'جديدة' : 'New' },
            { id: 'under_review', label: isRtl ? 'قيد المراجعة' : 'Under Review' },
            { id: 'info_requested', label: isRtl ? 'مطلوب بيانات' : 'Info Requested' },
            { id: 'approved', label: isRtl ? 'معتمدة' : 'Approved' },
            { id: 'rejected', label: isRtl ? 'مرفوضة' : 'Rejected' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                statusFilter === f.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Store className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-sm">
              {isRtl ? 'لا توجد طلبات مطابقة للفلتر المحدد' : 'No applications matching filter'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl
                ? 'يمكنك تجربة إرسال طلب جديد من نموذج التقديم في الموقع التعريفي وسيظهر هنا مباشرة!'
                : 'Submit a new application from the Corporate Landing page form to see it live here!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3.5">{isRtl ? 'الرقم المرجعي' : 'Ref #'}</th>
                  <th className="p-3.5">{isRtl ? 'اسم المغسلة وصاحبها' : 'Business & Applicant'}</th>
                  <th className="p-3.5">{isRtl ? 'المدينة والمنطقة' : 'City & Location'}</th>
                  <th className="p-3.5">{isRtl ? 'رقم الهاتف' : 'Mobile'}</th>
                  <th className="p-3.5">{isRtl ? 'الخدمات المقدمة' : 'Services'}</th>
                  <th className="p-3.5">{isRtl ? 'تاريخ التقديم' : 'Received At'}</th>
                  <th className="p-3.5">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3.5 text-center">{isRtl ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(app => {
                  const badge = getStatusBadge(app.status);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        {app.referenceNumber}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{app.businessName}</div>
                        <div className="text-[11px] text-slate-500">{app.applicantName}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{app.city}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {app.address}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 dir-ltr text-right">
                        {app.mobile}
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {app.services.slice(0, 2).map((srv, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-700 font-medium"
                            >
                              {srv}
                            </span>
                          ))}
                          {app.services.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{app.services.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {new Date(app.receivedAt).toLocaleDateString('ar-EG', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewNote(app.reviewerNotes || '');
                            setDecisionReason(app.decisionReason || '');
                          }}
                          className="px-3 py-1.5 bg-[#08BDF4]/15 hover:bg-[#08BDF4] text-[#08BDF4] hover:text-slate-950 font-bold rounded-lg transition cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'فحص ومعالجة' : 'Review'}</span>
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

      {/* Review & Onboarding Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#08BDF4]">
                  {selectedApp.referenceNumber}
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedApp.businessName}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRtl ? 'طلب انضمام شريك مغسلة' : 'Merchant Partnership Application'}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Applicant Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block mb-0.5">{isRtl ? 'اسم مقدم الطلب:' : 'Applicant:'}</span>
                <span className="font-bold text-slate-800">{selectedApp.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">{isRtl ? 'رقم الهاتف المحمول:' : 'Mobile:'}</span>
                <span className="font-bold text-slate-800 font-mono dir-ltr inline-block">
                  {selectedApp.mobile}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">{isRtl ? 'المحافظة والمدينة:' : 'Location:'}</span>
                <span className="font-bold text-slate-800">
                  {selectedApp.governorate} - {selectedApp.city}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">{isRtl ? 'طاقة الاستيعاب المقدرة:' : 'Capacity:'}</span>
                <span className="font-bold text-slate-800">
                  {selectedApp.capacity || (isRtl ? 'غير محددة' : 'Not specified')}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-0.5">{isRtl ? 'العنوان التفصيلي:' : 'Full Address:'}</span>
                <span className="font-semibold text-slate-700">{selectedApp.address}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-0.5">{isRtl ? 'الخدمات المختارة:' : 'Services:'}</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedApp.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {selectedApp.notes && (
                <div className="sm:col-span-2 bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                  <span className="text-slate-400 block mb-0.5">{isRtl ? 'ملاحظات مقدم الطلب:' : 'Notes:'}</span>
                  <p className="text-slate-700 italic">{selectedApp.notes}</p>
                </div>
              )}
            </div>

            {/* Onboarding Stage Tracker (If Approved) */}
            {selectedApp.status === 'approved' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? 'مراحل التأهيل والتدشين التشغيلي' : 'Onboarding & Activation Pipeline'}</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    {selectedApp.onboardingStage === 'activated'
                      ? isRtl ? 'تم التفعيل في المنظومة' : 'Active Merchant'
                      : isRtl ? 'قيد استكمال المتطلبات' : 'In Progress'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  {[
                    { id: 'pending_docs', label: isRtl ? 'فحص السجل' : 'Docs' },
                    { id: 'commercial_terms', label: isRtl ? 'توقيع العقد' : 'Terms (8%)' },
                    { id: 'catalog_setup', label: isRtl ? 'ضبط الأسعار' : 'Catalog' },
                    { id: 'activated', label: isRtl ? 'تفعيل المغسلة' : 'Activated' }
                  ].map((step, idx) => {
                    const isPassed =
                      (selectedApp.onboardingStage === 'activated') ||
                      (selectedApp.onboardingStage === 'catalog_setup' && idx <= 2) ||
                      (selectedApp.onboardingStage === 'commercial_terms' && idx <= 1) ||
                      (selectedApp.onboardingStage === 'pending_docs' && idx === 0);
                    return (
                      <div
                        key={step.id}
                        className={`p-2 rounded-lg font-bold border transition ${
                          isPassed
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        {step.label}
                      </div>
                    );
                  })}
                </div>

                {selectedApp.onboardingStage !== 'activated' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        const nextStage =
                          selectedApp.onboardingStage === 'pending_docs'
                            ? 'commercial_terms'
                            : selectedApp.onboardingStage === 'commercial_terms'
                            ? 'catalog_setup'
                            : 'activated';
                        advanceOnboardingStage(selectedApp.id, nextStage);
                        setSelectedApp(prev => prev ? { ...prev, onboardingStage: nextStage } : null);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'نقل للمرحلة التالية والتفعيل' : 'Advance Stage & Activate'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Internal Reviewer Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {isRtl ? 'ملاحظات المراجعة الداخلية (خاصة بإدارة المنصة):' : 'Internal Reviewer Notes:'}
              </label>
              <textarea
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
                rows={2}
                placeholder={
                  isRtl
                    ? 'اكتب نتائج التواصل مع صاحب المغسلة، حالة المعدات، المعاينة الميدانية...'
                    : 'Notes on applicant phone call, site inspection, commercial terms...'
                }
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#08BDF4]"
              />
            </div>

            {/* Decision Reason (if rejecting or requesting info) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {isRtl ? 'سبب القرار أو تفاصيل البيانات المطلوبة:' : 'Decision Reason / Requested Info:'}
              </label>
              <input
                type="text"
                value={decisionReason}
                onChange={e => setDecisionReason(e.target.value)}
                placeholder={
                  isRtl
                    ? 'مثال: مطلوب إرسال صورة السجل التجاري ورخصة المحل عبر واتساب'
                    : 'e.g., Please provide commercial registration and municipality permit'
                }
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#08BDF4]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>{isRtl ? 'رفض الطلب' : 'Reject'}</span>
              </button>

              <button
                type="button"
                onClick={handleRequestInfo}
                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{isRtl ? 'طلب استيفاء بيانات' : 'Request Info'}</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRtl ? 'الموافقة وبدء التأهيل' : 'Approve Application'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
