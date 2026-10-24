import React, { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  Calendar,
  Clock,
  Tag,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  FileText,
  Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GARMENTS } from '../../data/mockData';

export const CheckoutScreen: React.FC = () => {
  const {
    language,
    t,
    cartItems,
    cartPhotos,
    selectedPartner,
    pickupSchedule,
    deliverySchedule,
    selectedAddress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    calculatedSummary,
    placeOrder,
    navigateTo,
    showToast
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
      showToast(res.message);
    }
  };

  const handleConfirmOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder();
      setIsSubmitting(false);
      navigateTo('order_confirmed');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-28 select-none">
      {/* Step Indicator Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center gap-1.5 text-[#18A875]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'القطع (تم)' : 'Garments'}</span>
          </div>
          <span className="text-[#718596]">←</span>
          <div className="flex items-center gap-1.5 text-[#18A875]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التصوير (تم)' : 'Photos'}</span>
          </div>
          <span className="text-[#718596]">←</span>
          <div className="flex items-center gap-1.5 text-[#18A875]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الموعد (تم)' : 'Schedule'}</span>
          </div>
          <span className="text-[#718596]">←</span>
          <div className="flex items-center gap-1.5 text-[#079FD0] bg-[#EAF8FF] px-2 py-0.5 rounded-lg border border-[#08BDF4]/30">
            <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
            <span>{language === 'ar' ? 'التأكيد والدفع' : 'Confirm'}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-black text-[#183247] mb-1">
          {t.checkoutTitle}
        </h2>
        <p className="text-xs text-[#718596]">
          {language === 'ar'
            ? 'راجع تفاصيل طلبك وطريقة الدفع قبل التأكيد النهائي'
            : 'Review your order summary, schedule, and payment'}
        </p>
      </div>

      {/* 1. Itemized Garments List */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EEF4] mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#08BDF4]" />
            <h3 className="text-xs font-black text-[#183247]">{t.orderSummary}</h3>
          </div>
          <span className="text-xs font-bold text-[#079FD0]">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)} {t.itemsCount}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {cartItems.map((item, idx) => {
            const garment = GARMENTS.find(g => g.id === item.garmentId);
            return (
              <div key={idx} className="flex items-start justify-between text-xs pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-start gap-2.5">
                  <span className="text-xl p-1 bg-[#F4FBFF] rounded-lg">{garment?.icon || '👔'}</span>
                  <div>
                    <h4 className="font-bold text-[#183247]">
                      {language === 'ar' ? garment?.nameAr : garment?.nameEn}
                    </h4>
                    <p className="text-[11px] text-[#718596] mt-0.5">
                      {t[`service_${item.customization.serviceType}` as keyof typeof t]} · {t[`fragrance_${item.customization.fragrance}` as keyof typeof t]}
                    </p>
                    <span className="text-[10px] text-[#079FD0] font-semibold">
                      {t[`packaging_${item.customization.packaging}` as keyof typeof t]}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="font-black text-[#183247] block">
                    {item.unitPrice * item.quantity} {t.currency}
                  </span>
                  <span className="text-[10px] text-[#718596]">
                    {item.quantity} × {item.unitPrice} {t.currency}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Documented Garment Photos */}
      {cartPhotos.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E5EEF4] mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#08BDF4]" />
              <h3 className="text-xs font-black text-[#183247]">
                {language === 'ar' ? 'صور توثيق القطع المرفقة' : 'Documented Piece Photos'}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#18A875] bg-[#EAFBF3] px-2 py-0.5 rounded-lg border border-[#18A875]/30">
              {cartPhotos.length} {language === 'ar' ? 'صور محفوظة' : 'photos'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {cartPhotos.map(photo => (
              <div
                key={photo.id}
                className="rounded-xl overflow-hidden border border-[#E5EEF4] bg-[#F4FBFF] aspect-square relative group shadow-2xs"
              >
                <img
                  src={photo.photoUrl}
                  alt={photo.garmentNameAr}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-2xs p-1 text-center">
                  <span className="text-[9px] font-bold text-white block truncate">
                    {language === 'ar' ? `قطعة ${photo.pieceIndex}` : `Piece ${photo.pieceIndex}`}
                  </span>
                  {photo.tag && (
                    <span className="text-[8px] text-[#08BDF4] block truncate">
                      {photo.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Schedule & Partner Card */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <h3 className="text-xs font-black text-[#183247] mb-3 pb-2 border-b border-[#E5EEF4]">
          {language === 'ar' ? 'مواعيد الاستلام والتوصيل' : 'Schedules & Partner'}
        </h3>

        <div className="flex flex-col gap-3 text-xs">
          {/* Partner */}
          <div className="flex items-center justify-between">
            <span className="text-[#718596]">{t.partnerLaundry}:</span>
            <span className="font-bold text-[#183247]">
              {language === 'ar' ? selectedPartner.nameAr : selectedPartner.nameEn}
            </span>
          </div>

          {/* Pickup */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5 text-[#718596]">
              <Calendar className="w-3.5 h-3.5 text-[#08BDF4]" />
              <span>{t.pickupDetails}:</span>
            </div>
            <div className="text-end font-semibold text-[#183247]">
              <span>{pickupSchedule.date}</span>
              <span className="block text-[11px] text-[#718596]">{pickupSchedule.timeSlot}</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5 text-[#718596]">
              <Clock className="w-3.5 h-3.5 text-[#18A875]" />
              <span>{t.deliveryDetails}:</span>
            </div>
            <div className="text-end font-semibold text-[#183247]">
              <span>{deliverySchedule.date}</span>
              <span className="block text-[11px] text-[#718596]">{deliverySchedule.timeSlot}</span>
              {deliverySchedule.isExpress && (
                <span className="text-[10px] font-bold text-[#18A875] bg-emerald-50 px-1.5 py-0.5 rounded">
                  توصيل سريع (6-8 ساعات)
                </span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start justify-between pt-2 border-t border-[#E5EEF4]">
            <div className="flex items-center gap-1.5 text-[#718596]">
              <MapPin className="w-3.5 h-3.5 text-[#08BDF4]" />
              <span>{language === 'ar' ? 'العنوان' : 'Address'}:</span>
            </div>
            <div className="text-end font-semibold text-[#183247] max-w-[200px]">
              <span className="block text-xs font-bold">{selectedAddress.title}</span>
              <span className="text-[11px] text-[#718596]">
                {selectedAddress.street}، {selectedAddress.building} ({selectedAddress.city})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Promo Code Form */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <label className="block text-xs font-black text-[#183247] mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[#08BDF4]" />
          <span>{t.couponCode}</span>
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{appliedCoupon.code}</span>
              <span className="text-[11px] font-normal text-emerald-700">
                ({language === 'ar' ? appliedCoupon.descriptionAr : appliedCoupon.descriptionEn})
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-xs text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={e => {
                setCouponInput(e.target.value);
                setCouponError(null);
              }}
              placeholder={t.enterCoupon}
              className="flex-1 h-10 px-3 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-xs font-bold uppercase tracking-wider bg-[#F4FBFF]"
            />
            <button
              type="submit"
              className="px-4 h-10 bg-[#08BDF4] hover:bg-[#079FD0] text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              {t.apply}
            </button>
          </form>
        )}

        {couponError && (
          <p className="text-[11px] text-[#E55353] mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{couponError}</span>
          </p>
        )}
      </div>

      {/* 4. Payment Method Selection */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <label className="block text-xs font-black text-[#183247] mb-3">
          {t.paymentMethod}
        </label>

        <div className="flex flex-col gap-2">
          {/* COD */}
          <button
            type="button"
            onClick={() => setPaymentMethod('cod')}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              paymentMethod === 'cod'
                ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0]'
                : 'border-[#E5EEF4] text-[#183247] hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Banknote className="w-4 h-4 text-[#18A875]" />
              <span>{t.payCod}</span>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              paymentMethod === 'cod' ? 'border-[#08BDF4] bg-[#08BDF4] text-white' : 'border-[#E5EEF4]'
            }`}>
              {paymentMethod === 'cod' && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* InstaPay / Vodafone Cash */}
          <button
            type="button"
            onClick={() => setPaymentMethod('instapay')}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              paymentMethod === 'instapay'
                ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0]'
                : 'border-[#E5EEF4] text-[#183247] hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <span>{t.payInstapay}</span>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              paymentMethod === 'instapay' ? 'border-[#08BDF4] bg-[#08BDF4] text-white' : 'border-[#E5EEF4]'
            }`}>
              {paymentMethod === 'instapay' && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              paymentMethod === 'card'
                ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0]'
                : 'border-[#E5EEF4] text-[#183247] hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>{t.payCard}</span>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              paymentMethod === 'card' ? 'border-[#08BDF4] bg-[#08BDF4] text-white' : 'border-[#E5EEF4]'
            }`}>
              {paymentMethod === 'card' && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </button>
        </div>
      </div>

      {/* 5. Special Notes */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <label className="block text-xs font-black text-[#183247] mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#08BDF4]" />
          <span>{t.orderNotes}</span>
        </label>
        <input
          type="text"
          value={orderNotes}
          onChange={e => setOrderNotes(e.target.value)}
          placeholder={
            language === 'ar'
              ? 'مثال: بقعة حبر على القميص الأبيض، انتبه للزرار...'
              : 'e.g. Ink spot on white shirt, please handle with care...'
          }
          className="w-full h-10 px-3 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-xs bg-[#F4FBFF]"
        />
      </div>

      {/* 6. Pricing Breakdown */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs text-xs flex flex-col gap-2">
        <div className="flex justify-between text-[#718596]">
          <span>{language === 'ar' ? 'قيمة خدمات الغسيل والكي:' : 'Garments Subtotal:'}</span>
          <span className="font-bold text-[#183247]">{calculatedSummary.subtotal} {t.currency}</span>
        </div>

        <div className="flex justify-between text-[#718596]">
          <span>{language === 'ar' ? 'رسوم التوصيل والاستلام:' : 'Delivery & Pickup Fee:'}</span>
          <span className="font-bold text-[#183247]">
            {calculatedSummary.deliveryFee === 0 ? (
              <strong className="text-emerald-600 font-bold">مجاني</strong>
            ) : (
              `${calculatedSummary.deliveryFee} ${t.currency}`
            )}
          </span>
        </div>

        {calculatedSummary.expressFee > 0 && (
          <div className="flex justify-between text-amber-600">
            <span>{language === 'ar' ? 'رسوم الخدمة المستعجلة (6 ساعات):' : 'Express Service Fee:'}</span>
            <span className="font-bold">+{calculatedSummary.expressFee} {t.currency}</span>
          </div>
        )}

        {calculatedSummary.discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>{language === 'ar' ? 'قيمة الخصم بالكوبون:' : 'Promo Discount:'}</span>
            <span className="font-bold">-{calculatedSummary.discount} {t.currency}</span>
          </div>
        )}

        <div className="flex justify-between text-sm font-black text-[#183247] pt-2 border-t border-[#E5EEF4]">
          <span>{language === 'ar' ? 'الإجمالي النهائي المطلوب:' : 'Final Confirmed Total:'}</span>
          <span className="text-[#079FD0] text-base font-black">
            {calculatedSummary.finalTotal} {t.currency}
          </span>
        </div>
      </div>

      {/* Floating Bottom Confirmation CTA */}
      <div
        className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5EEF4] p-3 shadow-lg w-full mt-auto"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
      >
        <button
          onClick={handleConfirmOrder}
          disabled={isSubmitting}
          className="w-full h-13 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] active:scale-[0.98] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#08BDF4]/25 transition cursor-pointer"
        >
          {isSubmitting ? (
            <span className="inline-block animate-spin mr-2">⏳</span>
          ) : (
            <ShieldCheck className="w-5 h-5" />
          )}
          <span>{isSubmitting ? 'جاري تسجيل الطلب...' : `${t.confirmOrderCTA} (${calculatedSummary.finalTotal} ${t.currency})`}</span>
        </button>
      </div>
    </div>
  );
};
