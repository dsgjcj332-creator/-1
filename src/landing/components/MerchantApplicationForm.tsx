import React, { useState } from 'react';
import { Store, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';
import { EGYPT_GOVERNORATES } from '../data/egyptLocations';
import {
  submitMerchantApplication,
  validateEgyptianPhone,
  MerchantApplicationData
} from '../services/merchantApplicationService';

interface MerchantApplicationFormProps {
  t: LandingTranslation;
  language: Language;
}

export const MerchantApplicationForm: React.FC<MerchantApplicationFormProps> = ({
  t,
  language
}) => {
  const [formData, setFormData] = useState<MerchantApplicationData>({
    applicantName: '',
    businessName: '',
    mobile: '',
    governorate: '',
    city: '',
    address: '',
    services: ['wash_iron', 'wash_only'],
    operatingStatus: 'active',
    contactMethod: 'phone',
    email: '',
    whatsapp: '',
    website: '',
    capacity: '',
    notes: '',
    locationLink: '',
    privacyConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ message: string; ref?: string } | null>(null);

  const selectedGov = EGYPT_GOVERNORATES.find(g => g.id === formData.governorate);

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => {
      const exists = prev.services.includes(serviceId);
      const updated = exists
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.applicantName.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال اسم مقدم الطلب' : 'Please enter your name');
      return;
    }
    if (!formData.businessName.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال اسم المغسلة' : 'Please enter business name');
      return;
    }
    if (!validateEgyptianPhone(formData.mobile)) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى إدخال رقم هاتف محمول مصري صحيح (مثال: 01012345678)'
          : 'Please enter a valid Egyptian mobile number (e.g. 01012345678)'
      );
      return;
    }
    if (!formData.governorate) {
      setErrorMessage(language === 'ar' ? 'يرجى اختيار المحافظة' : 'Please select governorate');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى تحديد المدينة أو الحي' : 'Please select or enter city');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال العنوان التفصيلي' : 'Please enter detailed address');
      return;
    }
    if (formData.services.length === 0) {
      setErrorMessage(language === 'ar' ? 'يرجى اختيار خدمة واحدة على الأقل' : 'Select at least one service');
      return;
    }
    if (!formData.privacyConsent) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى الموافقة على شروط التواصل واستخدام البيانات للمتابعة'
          : 'Please agree to contact terms to proceed'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitMerchantApplication(formData, language);
      if (res.success) {
        setSuccessResult({
          message: res.message,
          ref: res.referenceId
        });
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage(
        language === 'ar'
          ? 'حدث خطأ غير متوقع أثناء إرسال البيانات. يرجى المحاولة لاحقاً.'
          : 'An unexpected error occurred. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccessResult(null);
    setErrorMessage(null);
    setFormData({
      applicantName: '',
      businessName: '',
      mobile: '',
      governorate: '',
      city: '',
      address: '',
      services: ['wash_iron'],
      operatingStatus: 'active',
      contactMethod: 'phone',
      email: '',
      whatsapp: '',
      website: '',
      capacity: '',
      notes: '',
      locationLink: '',
      privacyConsent: false
    });
  };

  return (
    <section id="merchant-application" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#079FD0] uppercase tracking-wider mb-2">
            <Store className="w-4 h-4 text-[#08BDF4]" />
            <span>{language === 'ar' ? 'طلب شراكة جديد' : 'Partnership Application'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#183247] tracking-tight mb-3">
            {t.formHeading}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.formSubhead}
          </p>
        </div>

        {/* Success Card State */}
        {successResult ? (
          <div className="bg-[#F4FBFF] border border-[#08BDF4]/40 rounded-3xl p-8 sm:p-12 text-center shadow-lg animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-[#08BDF4]/10 text-[#08BDF4] mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#183247] mb-3">
              {language === 'ar' ? 'شكراً لاهتمامك بالانضمام لعالسريع!' : 'Thank you for your interest!'}
            </h3>

            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
              {successResult.message}
            </p>

            {successResult.ref && (
              <div className="inline-block bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-700 mb-8 tabular-nums">
                {language === 'ar' ? 'رقم الإشارة للتجربة: ' : 'Demo Reference ID: '}
                <span className="text-[#079FD0]">{successResult.ref}</span>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                {language === 'ar' ? 'تقديم طلب لمغسلة أخرى' : 'Submit Another Application'}
              </button>
            </div>
          </div>
        ) : (
          /* The Form */
          <form
            onSubmit={handleSubmit}
            className="bg-[#F4FBFF]/40 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs text-start space-y-8"
          >
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Part 1: Applicant & Shop Basic Info */}
            <div>
              <h3 className="text-base font-black text-[#183247] mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>{language === 'ar' ? 'البيانات الأساسية للمغسلة' : 'Basic Business Details'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1.5">
                    {t.formApplicantName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.applicantName}
                    onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                    placeholder={t.formApplicantNamePlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] placeholder:text-slate-400 focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1.5">
                    {t.formBusinessName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder={t.formBusinessNamePlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] placeholder:text-slate-400 focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1.5">
                    {t.formMobile} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder={t.formMobilePlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] placeholder:text-slate-400 focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition text-start"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {language === 'ar' ? 'رقم مصري مكوّن من 11 رقماً يبدأ بـ 01' : '11-digit Egyptian mobile starting with 01'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1.5">
                    {t.formWhatsAppOptional}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] placeholder:text-slate-400 focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition text-start"
                  />
                </div>
              </div>
            </div>

            {/* Part 2: Location & Address */}
            <div>
              <h3 className="text-base font-black text-[#183247] mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center text-xs font-black">
                  2
                </span>
                <span>{language === 'ar' ? 'الموقع والنطاق الجغرافي' : 'Location & Coverage'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1.5">
                    {t.formGovernorate} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.governorate}
                    onChange={e => {
                      setFormData({
                        ...formData,
                        governorate: e.target.value,
                        city: ''
                      });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition cursor-pointer"
                  >
                    <option value="">{t.formGovernoratePlaceholder}</option>
                    {EGYPT_GOVERNORATES.map(gov => (
                      <option key={gov.id} value={gov.id}>
                        {language === 'ar' ? gov.nameAr : gov.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1.5">
                    {t.formCity} <span className="text-rose-500">*</span>
                  </label>
                  {selectedGov && selectedGov.cities.length > 0 ? (
                    <select
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition cursor-pointer"
                    >
                      <option value="">{t.formCityPlaceholder}</option>
                      {selectedGov.cities.map(c => (
                        <option key={c.id} value={c.nameAr}>
                          {language === 'ar' ? c.nameAr : c.nameEn}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder={t.formCityPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] placeholder:text-slate-400 focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183247] mb-1.5">
                  {t.formAddress} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t.formAddressPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] placeholder:text-slate-400 focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition"
                />
              </div>
            </div>

            {/* Part 3: Available Services & Operating Capabilities */}
            <div>
              <h3 className="text-base font-black text-[#183247] mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span>{t.formServicesLabel}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
                {[
                  { id: 'wash_iron', label: t.formServiceWashIron },
                  { id: 'wash_only', label: t.formServiceWashOnly },
                  { id: 'iron_only', label: t.formServiceIronOnly },
                  { id: 'dry_clean', label: t.formServiceDryClean },
                  { id: 'linens', label: t.formServiceLinens },
                  { id: 'carpets', label: t.formServiceCarpets }
                ].map(s => {
                  const isChecked = formData.services.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleServiceToggle(s.id)}
                      className={`p-3 rounded-xl border text-xs font-bold text-start flex items-center justify-between transition cursor-pointer ${
                        isChecked
                          ? 'border-[#08BDF4] bg-[#EAF8FF] text-[#079FD0] shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>{s.label}</span>
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                          isChecked
                            ? 'bg-[#08BDF4] border-[#08BDF4] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Operating Status & Contact Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1.5">
                    {t.formOperatingStatus}
                  </label>
                  <select
                    value={formData.operatingStatus}
                    onChange={e => setFormData({ ...formData, operatingStatus: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition cursor-pointer"
                  >
                    <option value="active">{t.formStatusActive}</option>
                    <option value="expanding">{t.formStatusExpanding}</option>
                    <option value="new">{t.formStatusNew}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183247] mb-1.5">
                    {t.formContactMethod}
                  </label>
                  <select
                    value={formData.contactMethod}
                    onChange={e => setFormData({ ...formData, contactMethod: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition cursor-pointer"
                  >
                    <option value="phone">{t.formContactPhone}</option>
                    <option value="whatsapp">{t.formContactWhatsApp}</option>
                    <option value="email">{t.formContactEmail}</option>
                  </select>
                </div>
              </div>

              {/* Optional Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-[#183247] mb-1.5">
                  {t.formNotesOptional}
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={
                    language === 'ar'
                      ? 'أي معلومات إضافية تود مشاركتها عن الماكينات أو نطاق الحي...'
                      : 'Any additional notes about capacity, machinery, or coverage...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#183247] placeholder:text-slate-400 focus:outline-none focus:border-[#08BDF4] focus:ring-2 focus:ring-[#08BDF4]/20 transition resize-none"
                />
              </div>
            </div>

            {/* Part 4: Consent & Submission */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition">
                <input
                  type="checkbox"
                  required
                  checked={formData.privacyConsent}
                  onChange={e => setFormData({ ...formData, privacyConsent: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#08BDF4] focus:ring-[#08BDF4] cursor-pointer"
                />
                <span className="text-xs text-slate-700 leading-relaxed font-medium">
                  {t.formPrivacyConsent} <span className="text-rose-500">*</span>
                </span>
              </label>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <span className="text-[11px] text-slate-400">
                  {t.formRequiredNotice}
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition cursor-pointer active:scale-98 ${
                    isSubmitting
                      ? 'bg-slate-400 text-white cursor-wait'
                      : 'bg-[#08BDF4] hover:bg-[#079FD0] text-white hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.formSubmitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.formSubmitBtn}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
