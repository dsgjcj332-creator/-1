import React from 'react';
import { useOperations } from '../../context/OperationsContext';
import { MapPin, CheckCircle2, XCircle, Store, Truck, DollarSign } from 'lucide-react';

export const ServiceZonesView: React.FC = () => {
  const { serviceZones, toggleZoneActive, language } = useOperations();
  const isRtl = language === 'ar';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#08BDF4]" />
          <span>{isRtl ? 'نطاقات التغطية والمدن التشغيلية' : 'Service Zones & Regional Expansion'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isRtl
            ? 'تفعيل النطاقات تدريجياً: بدءاً من الزقازيق والمنصورة مع إمكانية التوسع للعاشر من رمضان والقاهرة لاحقاً.'
            : 'Controlled launch zones: currently active in Zagazig & Mansoura, with 10th of Ramadan & Cairo planned.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serviceZones.map(zone => (
          <div
            key={zone.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 transition ${
              zone.isActive ? 'border-slate-300' : 'border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {zone.nameAr} ({zone.nameEn})
                </h3>
                <p className="text-xs text-slate-500">
                  {isRtl ? `محافظة ${zone.governorateAr}` : `${zone.governorateEn} Governorate`}
                </p>
              </div>

              <button
                onClick={() => toggleZoneActive(zone.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  zone.isActive
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                }`}
              >
                {zone.isActive ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'مفعّل حالياً' : 'Active'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'غير مفعّل (مخطط)' : 'Inactive'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <Store className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                <span className="font-bold text-slate-800 block">{zone.activeLaundriesCount}</span>
                <span className="text-[10px] text-slate-500">{isRtl ? 'مغاسل معتمدة' : 'Laundries'}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <Truck className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                <span className="font-bold text-slate-800 block">{zone.activeDriversCount}</span>
                <span className="text-[10px] text-slate-500">{isRtl ? 'مناديب نشطين' : 'Drivers'}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <DollarSign className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                <span className="font-bold text-slate-800 block">{zone.deliveryBaseFeeEgp} ج.م</span>
                <span className="text-[10px] text-slate-500">{isRtl ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
