import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Home,
  Truck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderConfirmedScreen: React.FC = () => {
  const { language, t, activeTrackingOrder, navigateTo } = useApp();

  const order = activeTrackingOrder;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#EAF8FF] via-white to-white select-none text-center">
      <div className="my-auto flex flex-col items-center">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 rounded-full bg-[#18A875]/15 border-4 border-[#18A875] flex items-center justify-center text-[#18A875] mb-5 shadow-xl shadow-[#18A875]/20 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black text-[#183247] mb-1">
          {t.orderSuccessTitle}
        </h1>
        <p className="text-xs text-[#718596] max-w-xs mb-5">
          {t.orderSuccessDesc}
        </p>

        {/* Order Reference Badge */}
        <div className="px-4 py-2 bg-white rounded-2xl border border-[#08BDF4] shadow-xs mb-6 inline-flex items-center gap-2">
          <span className="text-xs text-[#718596] font-medium">{t.orderRefLabel}:</span>
          <span className="text-base font-black text-[#079FD0] tracking-wider">
            #{order?.referenceNumber || 'AS-9482'}
          </span>
        </div>

        {/* Key Details Card */}
        {order && (
          <div className="w-full bg-[#F4FBFF] rounded-2xl border border-[#E5EEF4] p-4 text-xs text-start flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5EEF4]">
              <span className="text-[#718596] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#08BDF4]" />
                {t.pickupDetails}:
              </span>
              <span className="font-bold text-[#183247]">
                {order.pickup.date} ({order.pickup.timeSlot.split(' ')[0]})
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#E5EEF4]">
              <span className="text-[#718596] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#18A875]" />
                {t.deliveryDetails}:
              </span>
              <span className="font-bold text-[#183247]">
                {order.delivery.date} ({order.delivery.timeSlot.split(' ')[0]})
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#E5EEF4]">
              <span className="text-[#718596]">{t.paymentMethod}:</span>
              <span className="font-bold text-[#183247]">
                {order.paymentMethod === 'cod'
                  ? 'كاش عند الاستلام'
                  : order.paymentMethod === 'instapay'
                  ? 'إنستاباي / محفظة'
                  : 'بطاقة بنكية'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-black text-[#183247]">
                {language === 'ar' ? 'المبلغ المؤكد المطلوب:' : 'Confirmed Total:'}
              </span>
              <span className="text-base font-black text-[#079FD0]">
                {order.finalTotal} {t.currency}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3 pb-2">
        <button
          onClick={() => navigateTo('order_tracking')}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>{t.trackOrder}</span>
        </button>

        <button
          onClick={() => navigateTo('main')}
          className="w-full h-12 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.98] text-[#183247] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#E5EEF4] transition cursor-pointer"
        >
          <Home className="w-3.5 h-3.5 text-[#718596]" />
          <span>{t.backToHome}</span>
        </button>
      </div>
    </div>
  );
};
