import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, Smartphone, Store, ShieldCheck } from 'lucide-react';

interface AppDownloadPageProps {
  onBackToLanding: () => void;
}

export const AppDownloadPage: React.FC<AppDownloadPageProps> = ({ onBackToLanding }) => {
  const [isIos, setIsIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    setIsIos(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstall(false);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-[#F4FBFF] text-[#183247] flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={onBackToLanding} className="flex items-center gap-2 text-[#079FD0] font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /><span>العودة للموقع</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#08BDF4] to-[#0596c7] text-white flex items-center justify-center font-bold">ع</span>
            <span className="font-black text-sm tracking-tight">عالسريع</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-[#08BDF4]/15 flex items-center justify-center mx-auto mb-5 text-[#08BDF4]">
            <Smartphone className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">تطبيق عالسريع قادم قريباً</h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
            تطبيق الغسيل والتنظيف الجاف ليصل طلبك إلى باب بيتك. استلم وتسلم ملابسك في الموعد المحدد، مع مغاسل معتمدة وموثوقة.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            { icon: <Download className="w-5 h-5 text-[#08BDF4]" />, title: 'حمل من المتجر', desc: 'تطبيق رسمي قادم على جوجل بلاي وآب ستور.' },
            { icon: <Smartphone className="w-5 h-5 text-[#08BDF4]" />, title: 'تجربة تشبه التطبيق', desc: 'ثبت الموقع على شاشة الرئيسية واستخدمه كتطبيق.' },
            { icon: <ShieldCheck className="w-5 h-5 text-[#08BDF4]" />, title: 'آمن وموثوق', desc: 'مغاسل شريكة معتمدة ومدفوعات آمنة.' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#F4FBFF] flex items-center justify-center">{item.icon}</div>
              <h3 className="font-black text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-10">
          <a href="https://play.google.com/store/apps/details?id=com.alaelsaree.customer" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border-2 border-[#08BDF4] bg-white text-[#08BDF4] font-black text-sm shadow-sm hover:bg-[#08BDF4] hover:text-white transition">
            <Download className="w-5 h-5" /><span>حمل على جوجل بلاي (Google Play)</span>
          </a>
          <a href="https://apps.apple.com/app/ala-elsaree" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-black text-sm shadow-sm hover:bg-slate-50 transition">
            <Store className="w-5 h-5 text-[#08BDF4]" /><span>حمل على آب ستور (App Store)</span>
          </a>
        </div>

        {showInstall && !isIos && (
          <div className="bg-[#183247] rounded-3xl p-6 md:p-8 text-white shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg mb-1">ثبت تطبيق عالسريع</h3>
              <p className="text-slate-300 text-sm">أضف الموقع إلى شاشة الرئيسية لاستخدامه كتطبيق بدون تحميل من المتجر.</p>
            </div>
            <button onClick={handleInstall} className="px-6 py-3 rounded-xl bg-[#08BDF4] text-white font-bold shadow-lg hover:bg-[#079FD0] transition">تثبيت الآن</button>
          </div>
        )}

        {isIos && (
          <div className="bg-[#183247] rounded-3xl p-6 text-white shadow-xl mb-10">
            <h3 className="font-black text-lg mb-2">تثبيت على آيفون</h3>
            <p className="text-slate-300 text-sm mb-4">اضغط على زر المشاركة في سفاري، ثم اختر "إضافة إلى الشاشة الرئيسية".</p>
          </div>
        )}

        <div className="mt-auto pt-8">
          <button onClick={onBackToLanding} className="w-full py-4 rounded-2xl border border-slate-200 bg-white text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition">
            <ArrowLeft className="w-4 h-4" /><span>العودة للموقع</span>
          </button>
        </div>
      </main>
    </div>
  );
};
