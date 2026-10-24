import React, { useState } from 'react';
import { Star, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RateOrderScreen: React.FC = () => {
  const { language, t, activeTrackingOrder, rateOrder, navigateTo } = useApp();

  const [serviceRating, setServiceRating] = useState(5);
  const [pickupRating, setPickupRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [comment, setComment] = useState('ملابس نظيفة جداً ومكوية بالبخار ورائحة العطر ممتازة.. شكراً عالسريع!');

  const order = activeTrackingOrder;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    rateOrder(order.id, serviceRating, pickupRating, deliveryRating, comment);
    navigateTo('main');
  };

  const renderStars = (current: number, setVal: (v: number) => void) => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setVal(star)}
            className="p-1 cursor-pointer transition transform active:scale-110"
          >
            <Star
              className={`w-7 h-7 ${
                star <= current
                  ? 'fill-amber-400 text-amber-500'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white select-none">
      <div>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto mb-3">
            <Star className="w-7 h-7 fill-amber-400" />
          </div>
          <h2 className="text-xl font-black text-[#183247] mb-1">
            {language === 'ar' ? 'تقييم تجربة طلبك' : 'Rate Your Experience'}
          </h2>
          <p className="text-xs text-[#718596]">
            {language === 'ar'
              ? `طلب رقم #${order?.referenceNumber || 'AS-9482'}`
              : `Order #${order?.referenceNumber || 'AS-9482'}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Service Quality */}
          <div className="p-4 bg-[#F4FBFF] rounded-2xl border border-[#E5EEF4] flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-bold text-[#183247]">
              {language === 'ar' ? 'جودة نظافة وكي الملابس' : 'Garment Cleanliness & Pressing Quality'}
            </span>
            {renderStars(serviceRating, setServiceRating)}
          </div>

          {/* Pickup Experience */}
          <div className="p-4 bg-[#F4FBFF] rounded-2xl border border-[#E5EEF4] flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-bold text-[#183247]">
              {language === 'ar' ? 'التزام المندوب في موعد الاستلام' : 'Pickup Punctuality & Courier'}
            </span>
            {renderStars(pickupRating, setPickupRating)}
          </div>

          {/* Delivery Experience */}
          <div className="p-4 bg-[#F4FBFF] rounded-2xl border border-[#E5EEF4] flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-bold text-[#183247]">
              {language === 'ar' ? 'سرعة التوصيل وسلامة التغليف' : 'Delivery Speed & Packaging'}
            </span>
            {renderStars(deliveryRating, setDeliveryRating)}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-[#183247] mb-1.5">
              {language === 'ar' ? 'رأيك يهمنا (اختياري):' : 'Review & Comments (Optional):'}
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder={
                language === 'ar'
                  ? 'اكتب رأيك وتجربتك مع خدمة عالسريع...'
                  : 'Write your feedback...'
              }
              className="w-full p-3 rounded-2xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-xs bg-white resize-none"
            />
          </div>
        </form>
      </div>

      <div className="w-full pt-4 pb-2">
        <button
          onClick={handleSubmit}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          <span>{language === 'ar' ? 'إرسال التقييم' : 'Submit Review'}</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
