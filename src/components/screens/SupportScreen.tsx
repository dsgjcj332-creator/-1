import React, { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Send,
  ShieldCheck,
  FileQuestion
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupportScreen: React.FC = () => {
  const { language, t, showToast, activeTrackingOrder } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [complaintType, setComplaintType] = useState('lost_damaged');
  const [complaintText, setComplaintText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      qAr: 'كيف تتم عملية استلام الملابس من المنزل؟',
      qEn: 'How does doorstep pickup work?',
      aAr: 'يصل مندوبنا في الفترة الزمنية المحددة ومعه حقائب مخصصة ومحكمة الغلق. يتم عد القطع وفحصها أمامك وتسجيل الكود.',
      aEn: 'Our courier arrives in your booked time slot with sealed garment bags. Garments are counted and inspected on the spot.'
    },
    {
      qAr: 'ما هو الوقت المستغرق لإعادة الملابس جاهزة؟',
      qEn: 'What is the turnaround delivery time?',
      aAr: 'الخدمة العادية تستغرق 24 ساعة لضمان التجفيف والكي الفندقي السليم. كما تتوفر خدمة سريعة (إكسبريس) خلال 6 إلى 8 ساعات.',
      aEn: 'Standard service takes 24 hours. Express service takes 6-8 hours with partner laundries.'
    },
    {
      qAr: 'ما هي سياسة التعويض في حال فقدان أو تلف قطعة؟',
      qEn: 'What is the compensation policy for damaged items?',
      aAr: 'تضمن منصة عالسريع سلامة جميع الملابس. في حال حدوث أي ضرر يتم تعويض العميل بقيمة القطعة وفقاً لتقييم عادل وسريع.',
      aEn: 'We guarantee full fabric safety. In the rare event of damage or loss, fair compensation is paid promptly.'
    },
    {
      qAr: 'ما هي طرق الدفع المتاحة في مصر؟',
      qEn: 'What payment methods are supported in Egypt?',
      aAr: 'ندعم الدفع نقداً (كاش) عند تسليم الملابس، وكذلك التحويل عبر إنستاباي (InstaPay) أو محافظ فودافون كاش، والبطاقات البنكية.',
      aEn: 'We support Cash on Delivery (COD), InstaPay, Vodafone Cash, and credit/debit cards.'
    }
  ];

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    setIsSubmitted(true);
    showToast(
      language === 'ar'
        ? 'تم تسجيل بلاغك وسيقوم فريق الدعم بمراجعة وتتبع الطلب'
        : 'Your ticket has been submitted to customer support'
    );
    setComplaintText('');
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 select-none">
      <div className="mb-4">
        <h2 className="text-xl font-black text-[#183247] mb-1">
          {t.supportCenter}
        </h2>
        <p className="text-xs text-[#718596]">
          {language === 'ar'
            ? 'فريق خدمة عملاء عالسريع في خدمتك يومياً من 8 صباحاً حتى 12 منتصف الليل'
            : 'Ala El Saree support team is available daily 8am - midnight'}
        </p>
      </div>

      {/* Quick Direct Contact Buttons */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <a
          href="https://wa.me/201012345678?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D8%B9%D8%A7%D9%84%D8%B3%D8%B1%D9%8A%D8%B9%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%AE%D8%AF%D9%85%D8%A9%20%D8%A7%D9%84%D8%BA%D8%B3%D9%8A%D9%84"
          target="_blank"
          rel="noreferrer"
          className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#18A875] text-white flex items-center justify-center mb-1.5 shadow-sm">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-emerald-900">محادثة واتساب فورية</span>
          <span className="text-[10px] text-emerald-700">رد خلال 3 دقائق</span>
        </a>

        <a
          href="tel:+201012345678"
          className="p-3.5 bg-[#EAF8FF] hover:bg-[#08BDF4]/20 border border-[#08BDF4]/30 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#08BDF4] text-white flex items-center justify-center mb-1.5 shadow-sm">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#079FD0]">الخط الساخن المباشر</span>
          <span className="text-[10px] text-[#718596]" dir="ltr">+20 101 234 5678</span>
        </a>
      </div>

      {/* FAQ Accordion */}
      <div className="mb-5">
        <h3 className="text-xs font-black text-[#183247] mb-3 flex items-center gap-1.5">
          <FileQuestion className="w-4 h-4 text-[#08BDF4]" />
          <span>{language === 'ar' ? 'الأسئلة الأكثر تكراراً' : 'Frequently Asked Questions'}</span>
        </h3>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E5EEF4] overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-3.5 flex items-center justify-between text-start text-xs font-bold text-[#183247] cursor-pointer"
                >
                  <span>{language === 'ar' ? faq.qAr : faq.qEn}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#08BDF4] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 text-xs text-[#718596] leading-relaxed border-t border-slate-50 pt-2 bg-[#F4FBFF]/40">
                    {language === 'ar' ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Report an Issue or Complaint */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5EEF4] shadow-2xs">
        <h3 className="text-xs font-black text-[#183247] mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-[#E55353]" />
          <span>{language === 'ar' ? 'تقديم بلاغ أو استفسار خاص بطلب' : 'Report an Issue'}</span>
        </h3>

        {isSubmitted ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-emerald-900 mb-1">
              تم استلام رسالتك بنجاح!
            </h4>
            <p className="text-[11px] text-emerald-700">
              سيقوم مدير الجودة بمراجعة طلبك والتواصل معك هاتفياً خلال ساعة عمل.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitComplaint} className="flex flex-col gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#183247] mb-1">
                {language === 'ar' ? 'نوع البلاغ:' : 'Issue Type:'}
              </label>
              <select
                value={complaintType}
                onChange={e => setComplaintType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E5EEF4] text-xs font-medium bg-[#F4FBFF]"
              >
                <option value="lost_damaged">الإبلاغ عن قطعة تالفة أو مفقودة</option>
                <option value="delivery_delay">تأخر المندوب عن موعد الاستلام أو التوصيل</option>
                <option value="laundry_quality">ملاحظة على جودة الغسيل والكي</option>
                <option value="other">استفسار أو شكوى أخرى</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#183247] mb-1">
                {language === 'ar' ? 'تفاصيل المشكلة:' : 'Issue Description:'}
              </label>
              <textarea
                value={complaintText}
                onChange={e => setComplaintText(e.target.value)}
                rows={3}
                placeholder={
                  language === 'ar'
                    ? 'يرجى كتابة رقم الطلب وتفاصيل المشكلة أو القطعة بالتحديد...'
                    : 'Describe what happened...'
                }
                className="w-full p-3 rounded-xl border border-[#E5EEF4] focus:outline-none focus:border-[#08BDF4] text-xs bg-[#F4FBFF] resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#08BDF4] hover:bg-[#079FD0] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إرسال البلاغ لفريق الدعم' : 'Submit Ticket'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
