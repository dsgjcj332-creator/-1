import React from 'react';
import { useOperations } from '../../context/OperationsContext';
import { History, ShieldCheck, UserCheck, Clock, FileText } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, language } = useOperations();
  const isRtl = language === 'ar';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <History className="w-6 h-6 text-[#08BDF4]" />
          <span>{isRtl ? 'سجل العمليات والتدقيق الأمني' : 'System Audit & Activity Logs'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isRtl
            ? 'سجل غير قابل للتعديل يوثق كافة إجراءات اعتماد المغاسل، تحويلات المستحقات، تعديل الأسعار والإسناد.'
            : 'Immutable operational audit trail logging sensitive administrative and dispatch decisions.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {auditLogs.map(log => (
            <div key={log.id} className="p-4 hover:bg-slate-50/70 transition text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900">{log.action}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono text-slate-600">
                    {log.entityType} #{log.entityId.slice(-6)}
                  </span>
                </div>
                <div className="text-slate-600">{log.details}</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="font-semibold text-slate-700">{log.actorName}</span>
                  <span>({log.actorRole})</span>
                </div>
              </div>

              <div className="text-slate-400 font-mono text-[11px] shrink-0 sm:text-left">
                {new Date(log.timestamp).toLocaleString('ar-EG', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
