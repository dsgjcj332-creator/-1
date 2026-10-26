import React from 'react';
import { ArrowLeft, ShieldCheck, MapPin, Sparkles, Clock, Star } from 'lucide-react';
import { LandingTranslation, Language } from '../data/translations';

interface HeroSectionProps {
  t: LandingTranslation;
  language: Language;
  onOpenAppDownload: () => void;
  onScrollToMerchant: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  t,
  language,
  onOpenAppDownload,
  onScrollToMerchant
}) => {
  const isRtl = language === 'ar';

  return (
    <section id="hero" className="relative overflow-hidden bg-[#0B1F2E]">
      {/* Ambient glow blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#08BDF4]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#08BDF4]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-0">

        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#08BDF4]/30 bg-[#08BDF4]/10 text-[#08BDF4] text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#08BDF4] animate-pulse" />
            {isRtl ? 'منصة الغسيل الأولى في مصر' : 'Egypt\'s #1 Laundry Platform'}
          </span>
        </div>

        {/* Big headline */}
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-5">
            {isRtl ? (
              <>
                غسيلك علينا
                <br />
                <span className="text-[#08BDF4]">ووقتك ليك</span>
              </>
            ) : (
              <>
                Your Laundry, Our Job
                <br />
                <span className="text-[#08BDF4]">Your Time, Yours</span>
              </>
            )}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? 'اطلب غسيل وكي ملابسك من باب بيتك، ونوصّلها ليك تاني يوم نظيفة ومعطرة. لو عندك مغسلة، انضم وابدأ تاخد طلبات أونلاين.'
              : 'Order laundry pickup from your door, delivered fresh the next day. Own a laundry? Join us and start receiving online orders.'}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <button
            onClick={onOpenAppDownload}
            className="px-8 py-3.5 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] text-[#0B1F2E] font-extrabold text-sm shadow-lg shadow-[#08BDF4]/30 hover:shadow-xl transition active:scale-98 cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span>{isRtl ? 'اطلب خدمتك دلوقتي' : 'Order Now'}</span>
            {isRtl && <ArrowLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={onScrollToMerchant}
            className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition cursor-pointer w-full sm:w-auto justify-center flex items-center gap-2"
          >
            {isRtl ? 'انضم كمغسلة شريكة' : 'Join as a Partner'}
          </button>
        </div>

        {/* Coverage chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-[#08BDF4]" />
            {isRtl ? 'متاح في:' : 'Available in:'}
          </span>
          {['الزقازيق', 'المنصورة', 'العاشر من رمضان', 'القاهرة الكبرى'].map(city => (
            <span key={city} className="px-3 py-1 rounded-full bg-white/8 border border-white/10 text-[11px] font-bold text-slate-300">
              {city}
            </span>
          ))}
        </div>

        {/* Grid showcase — inspired by Alsaree3 mosaic layout */}
        <div className="grid grid-cols-12 gap-3 max-h-[440px]">
          {/* Big left image */}
          <div className="col-span-5 row-span-2 relative rounded-2xl overflow-hidden bg-slate-800 min-h-[220px]">
            <img
              src="/src/assets/images/hero_laundry_fresh_1792642989059.jpg"
              alt="غسيل ملابس عالسريع"
              className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute bottom-3 start-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-bold text-white">{isRtl ? 'غسيل وكي احترافي' : 'Pro Wash & Iron'}</span>
            </div>
          </div>

          {/* Top-center image */}
          <div className="col-span-4 relative rounded-2xl overflow-hidden bg-slate-800 min-h-[200px]">
            <div className="w-full h-full bg-gradient-to-br from-[#08BDF4]/20 to-[#0B3D52] flex flex-col items-center justify-center p-4">
              <Clock className="w-10 h-10 text-[#08BDF4] mb-2" />
              <div className="text-white font-extrabold text-lg text-center leading-tight">
                {isRtl ? 'توصيل لحد بابك' : 'Doorstep Delivery'}
              </div>
              <p className="text-slate-400 text-[11px] text-center mt-1">
                {isRtl ? 'في الموعد المحدد بالظبط' : 'Right on schedule'}
              </p>
            </div>
          </div>

          {/* Top-right: coverage */}
          <div className="col-span-3 relative rounded-2xl overflow-hidden bg-slate-800 min-h-[200px]">
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-[#0B1F2E] border border-white/10 flex flex-col items-start justify-end p-4">
              <div className="mb-2 w-full">
                {['الزقازيق', 'المنصورة', 'العاشر'].map(c => (
                  <span key={c} className="inline-block px-2 py-0.5 text-[10px] font-bold bg-[#08BDF4]/20 text-[#08BDF4] rounded-full mb-1 me-1">{c}</span>
                ))}
              </div>
              <div className="text-white font-extrabold text-sm leading-tight">
                {isRtl ? 'مناطق التغطية' : 'Service Zones'}
              </div>
              <p className="text-slate-500 text-[10px] mt-0.5">
                {isRtl ? 'وبتتوسع أكتر' : 'Growing fast'}
              </p>
            </div>
          </div>

          {/* Bottom-center: brand promise card */}
          <div className="col-span-4 relative rounded-2xl overflow-hidden bg-[#08BDF4] min-h-[200px] flex flex-col items-center justify-center p-5">
            <Sparkles className="w-8 h-8 text-[#0B1F2E] mb-2" />
            <div className="text-[#0B1F2E] font-black text-xl text-center leading-tight">
              {isRtl ? 'ملابسك ترجعلك\nعلى آخرها' : 'Clothes back\nperfect'}
            </div>
            <p className="text-[#0B3D52] text-[11px] text-center mt-1.5 font-semibold">
              {isRtl ? 'مضمون وموثق في كل مرة' : 'Guaranteed every time'}
            </p>
          </div>

          {/* Bottom-right: partner */}
          <div className="col-span-3 relative rounded-2xl bg-slate-800 border border-white/10 min-h-[200px] flex flex-col items-start justify-between p-4">
            <ShieldCheck className="w-6 h-6 text-[#08BDF4]" />
            <div>
              <div className="text-white font-extrabold text-sm leading-tight mb-1">
                {isRtl ? 'مغاسل\nمعتمدة' : 'Certified\nLaundries'}
              </div>
              <p className="text-slate-500 text-[10px]">
                {isRtl ? 'منتخبة ومفتشة بعناية' : 'Vetted & trusted'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="h-20 bg-gradient-to-b from-[#0B1F2E] to-white" />

      {/* Benefit strip */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-start">
          {[
            { icon: <MapPin className="w-4 h-4 text-[#08BDF4]" />, title: isRtl ? 'استلام وتسليم لبابك' : 'Door-to-door', sub: isRtl ? 'من بيتك مباشرة' : 'Pick & drop at home' },
            { icon: <ShieldCheck className="w-4 h-4 text-[#08BDF4]" />, title: isRtl ? 'مغاسل معتمدة' : 'Vetted Partners', sub: isRtl ? 'فحص وتقييم مستمر' : 'Quality checked always' },
            { icon: <Sparkles className="w-4 h-4 text-[#08BDF4]" />, title: isRtl ? 'عناية دقيقة' : 'Premium Care', sub: isRtl ? 'تخصيص لكل قطعة' : 'Personalized per item' },
            { icon: <Clock className="w-4 h-4 text-[#08BDF4]" />, title: isRtl ? 'مواعيد محددة' : 'Scheduled Slots', sub: isRtl ? 'يناسب يومك' : 'Fits your schedule' },
          ].map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EAF8FF] flex items-center justify-center shrink-0">{b.icon}</div>
              <div>
                <h4 className="text-xs font-bold text-[#183247]">{b.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
