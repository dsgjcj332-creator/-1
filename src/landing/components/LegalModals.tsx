import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { Language } from '../data/translations';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
  language: Language;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, language }) => {
  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-start max-h-[85vh] flex flex-col relative animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 absolute top-5 end-5 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center shrink-0">
            {type === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-black text-[#183247]">
              {type === 'privacy'
                ? language === 'ar'
                  ? 'سياسة الخصوصية وحماية البيانات'
                  : 'Privacy Policy & Data Protection'
                : language === 'ar'
                ? 'شروط وأحكام الخدمة'
                : 'Terms of Service'}
            </h3>
            <span className="text-xs text-slate-400">
              {language === 'ar' ? 'منصة عالسريع — جمهورية مصر العربية' : 'Ala El Saree Platform — Egypt'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed no-scrollbar">
          {type === 'privacy' ? (
            language === 'ar' ? (
              <>
                <p className="font-bold text-[#183247]">1. المقدمة ونطاق التطبيق</p>
                <p>
                  تحترم منصة «عالسريع» خصوصية جميع زوارها وعملائها وشركائها من المغاسل ومندوبي التوصيل.
                  تخضع هذه السياسة لأحكام القانون المصري رقم 151 لسنة 2020 بشأن حماية البيانات الشخصية.
                </p>
                <p className="font-bold text-[#183247]">2. البيانات التي يتم جمعها</p>
                <p>
                  نجمع فقط البيانات الضرورية لتنفيذ الخدمة، مثل: الاسم، رقم الهاتف المحمول، العنوان التفصيلي،
                  وبالنسبة للشركاء: اسم المغسلة، النطاق الجغرافي، ونوع الخدمات المقدمة.
                </p>
                <p className="font-bold text-[#183247]">3. الغرض من معالجة البيانات</p>
                <p>
                  تُستخدم البيانات فقط لترتيب مواعيد استلام وتسليم الملابس، والتواصل مع مقدمي الطلبات ومراجعة
                  طلبات الشراكة، ولن يتم بيع أو مشاركة أي بيانات شخصية مع أطراف ثالثة لأغراض تسويقية غير مصرح بها.
                </p>
                <p className="font-bold text-[#183247]">4. حقوق أصحاب البيانات</p>
                <p>
                  يحق لكل مستخدم أو شريك طلب الاطلاع على بياناته المسجلة أو تصحيحها أو طلب حذفها عبر قنوات
                  الدعم الفني الرسمية.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-[#183247]">1. Introduction</p>
                <p>
                  Ala El Saree is committed to safeguarding personal data in compliance with Egyptian Law
                  No. 151 of 2020 on Personal Data Protection.
                </p>
                <p className="font-bold text-[#183247]">2. Information Collected</p>
                <p>
                  We only gather information necessary to provide laundry dispatch and partner onboarding,
                  including contact name, mobile number, neighborhood location, and service preferences.
                </p>
                <p className="font-bold text-[#183247]">3. Data Utilization</p>
                <p>
                  Data is processed strictly to manage garment collection, verify partnership inquiries, and
                  coordinate delivery logistics. We never sell personal data to unauthorized third parties.
                </p>
              </>
            )
          ) : (
            language === 'ar' ? (
              <>
                <p className="font-bold text-[#183247]">1. طبيعة المنصة</p>
                <p>
                  منصة «عالسريع» هي منصة وسيطة تربط بين العملاء والمغاسل الشريكة المستقلة، وتوفر أدوات رقمية
                  لتنظيم استلام وتسليم الملابس وتنسيق مواعيد الخدمة.
                </p>
                <p className="font-bold text-[#183247]">2. شروط الشراكة مع المغاسل</p>
                <p>
                  تقديم استمارة الشراكة عبر الموقع لا يُعد قبولاً ملزماً أو ترخيصاً بالتشغيل الفوري.
                  يتم إبرام اتفاقية التعاون التجاري والتأكد من مطابقة معايير الخدمة قبل تفعيل أي مغسلة.
                </p>
                <p className="font-bold text-[#183247]">3. العناية بالملابس والمسؤولية</p>
                <p>
                  تلتزم المغاسل الشريكة باتباع إرشادات الغسيل المدونة على بطاقة كل قطعة، وفي حال وجود أي قطعة
                  تحتاج معالجة خاصة أو ملاحظات مسبقة، يتعين تدوين ذلك في حقل الملاحظات.
                </p>
                <p className="font-bold text-[#183247]">4. التعديلات والقوانين الحاكمة</p>
                <p>
                  تخضع هذه الشروط وتُفسر وفقاً للقوانين السارية في جمهورية مصر العربية وتختص محاكمها بالفصل
                  في أي نزاع.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-[#183247]">1. Platform Role</p>
                <p>
                  Ala El Saree acts as a digital marketplace connecting consumers with verified independent
                  laundry businesses and courier logistics.
                </p>
                <p className="font-bold text-[#183247]">2. Partner Onboarding Terms</p>
                <p>
                  Submitting a partnership application does not constitute automatic approval. Activation
                  requires manual verification and bilateral agreement on operational standards.
                </p>
                <p className="font-bold text-[#183247]">3. Applicable Law</p>
                <p>
                  These terms are governed by the applicable laws of the Arab Republic of Egypt.
                </p>
              </>
            )
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
