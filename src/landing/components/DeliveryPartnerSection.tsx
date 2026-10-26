import React, { useState } from 'react';
import { Truck, Clock, Navigation, CheckCircle2, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';
import { submitDeliveryInterest, DeliveryInterestData } from '../services/merchantApplicationService';
import deliveryDoorstepBagImg from '../../assets/images/delivery_doorstep_bag_1792642990981.jpg';

interface DeliveryPartnerSectionProps {
  t: LandingTranslation;
  language: Language;
}

export const DeliveryPartnerSection: React.FC<DeliveryPartnerSectionProps> = ({ t, language }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<DeliveryInterestData>({
    fullName: '',
    mobile: '',
    city: '',
    vehicle: 'motorcycle'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await submitDeliveryInterest(formData, language);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg(
        language === 'ar'
          ? 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSuccessMessage(null);
    setErrorMsg(null);
    setFormData({
      fullName: '',
      mobile: '',
      city: '',
      vehicle: 'motorcycle'
    });
  };

  return (
    <section id="delivery-partner" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Real High-Fidelity Delivery Doorstep Photo */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-[4/3] bg-slate-100 group">
              <img
                src={deliveryDoorstepBagImg}
                alt="حقيبة استلام وتوصيل الملابس الموثقة من عالسريع"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-102 transition duration-700"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute bottom-4 start-4 end-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-md text-start">
                <span className="text-xs font-bold text-[#183247] block mb-0.5">
                  {language === 'ar' ? 'توصيل موثق وآمن لباب البيت' : 'Respectful Doorstep Handover'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === 'ar'
                    ? 'حقائب مخصصة تحمي الملابس المكوية من أي تجاعيد أو عوامل خارجية'
                    : 'Protective garment carriers preserving ironed clothes and fabrics'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Narrative & Benefits */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start text-start">
            <div className="text-xs font-bold text-[#079FD0] uppercase tracking-wider mb-2">
              {language === 'ar' ? 'شبكة التوصيل والدعم اللوجستي' : 'Delivery & Courier Logistics'}
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-[#183247] tracking-tight mb-4 leading-tight">
              {t.deliveryHeading}
            </h2>

            <p className="text-base text-slate-600 leading-relaxed mb-6">
              {t.deliverySubhead}
            </p>

            <div className="space-y-4 mb-8 w-full">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F4FBFF]/60 border border-slate-200/70">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#08BDF4]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#183247]">{t.deliveryBenefit1Title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{t.deliveryBenefit1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F4FBFF]/60 border border-slate-200/70">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#08BDF4]">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#183247]">{t.deliveryBenefit2Title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{t.deliveryBenefit2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F4FBFF]/60 border border-slate-200/70">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#08BDF4]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#183247]">{t.deliveryBenefit3Title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{t.deliveryBenefit3Desc}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2.5 shadow-md transition active:scale-98 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#08BDF4]" />
              <span>{t.deliveryCta}</span>
            </button>

            <span className="text-[11px] text-slate-400 mt-3 block">
              {t.deliveryNotice}
            </span>
          </div>

        </div>

      </div>

      {/* Accessible Expression of Interest Modal Dialog */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delivery-modal-title"
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-start relative animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 absolute top-5 end-5 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {successMessage ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-[#183247] mb-2">
                  {language === 'ar' ? 'تم تسجيل اهتمامك بنجاح!' : 'Interest Registered!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                  {successMessage}
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 id="delivery-modal-title" className="text-lg font-black text-[#183247] mb-1">
                    {t.deliveryModalTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t.deliveryModalDesc}
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1">
                    {t.deliveryModalName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={language === 'ar' ? 'الاسم الثلاثي' : 'Full name'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1">
                    {t.deliveryModalPhone} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 text-start"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1">
                    {t.deliveryModalCity} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder={language === 'ar' ? 'مثال: الزقازيق، المنصورة، العاشر من رمضان' : 'e.g. Zagazig, Mansoura'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1">
                    {t.deliveryModalVehicle}
                  </label>
                  <select
                    value={formData.vehicle}
                    onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 cursor-pointer"
                  >
                    <option value="motorcycle">{t.deliveryVehicleMotorcycle}</option>
                    <option value="car">{t.deliveryVehicleCar}</option>
                    <option value="bicycle">{t.deliveryVehicleBicycle}</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#08BDF4] hover:bg-[#079FD0] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{t.deliveryModalSubmit}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
