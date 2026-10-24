import React, { useState, useRef } from 'react';
import {
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertTriangle,
  ZoomIn,
  X,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GARMENTS } from '../../data/mockData';
import { GarmentPhoto } from '../../types';

interface ExpandedPiece {
  pieceIndex: number;
  garmentId: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  customizationLabel: string;
}

export const GarmentPhotosScreen: React.FC = () => {
  const {
    language,
    t,
    cartItems,
    cartPhotos,
    setCartPhoto,
    removeCartPhoto,
    clearCartPhotos,
    navigateTo,
    showToast
  } = useApp();

  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Expand cart items into individual pieces based on quantities
  const expandedPieces: ExpandedPiece[] = [];
  let currentIdx = 1;

  cartItems.forEach(item => {
    const garment = GARMENTS.find(g => g.id === item.garmentId);
    const nameAr = garment ? garment.nameAr : 'قطعة ملابس';
    const nameEn = garment ? garment.nameEn : 'Garment item';
    const icon = garment ? garment.icon : '👕';
    const serviceName = t[`service_${item.customization.serviceType}` as keyof typeof t] || '';
    const fragranceName = t[`fragrance_${item.customization.fragrance}` as keyof typeof t] || '';
    const custLabel = `${serviceName} • ${fragranceName}`;

    for (let i = 0; i < item.quantity; i++) {
      expandedPieces.push({
        pieceIndex: currentIdx,
        garmentId: item.garmentId,
        nameAr,
        nameEn,
        icon,
        customizationLabel: custLabel
      });
      currentIdx++;
    }
  });

  const totalPieces = expandedPieces.length;
  const capturedPhotosCount = cartPhotos.length;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    piece: ExpandedPiece
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCartPhoto(
        piece.pieceIndex,
        piece.garmentId,
        piece.nameAr,
        piece.nameEn,
        result,
        language === 'ar' ? 'سليمة تماماً' : 'Good Condition'
      );
      showToast(
        language === 'ar'
          ? `تم حفظ صورة القطعة ${piece.pieceIndex}`
          : `Photo saved for item ${piece.pieceIndex}`
      );
    };
    reader.readAsDataURL(file);
  };

  const handleDemoPhoto = (piece: ExpandedPiece) => {
    // High-quality SVG mockup photo representing the garment item
    const demoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2308BDF4"/><stop offset="100%" stop-color="%23079FD0"/></linearGradient></defs><rect width="400" height="300" fill="%23F4FBFF"/><rect x="20" y="20" width="360" height="260" rx="20" fill="white" stroke="%23E5EEF4" stroke-width="2"/><circle cx="200" cy="130" r="50" fill="%23EAF8FF"/><text x="200" y="145" font-size="50" text-anchor="middle">${encodeURIComponent(piece.icon)}</text><text x="200" y="210" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23183247" text-anchor="middle">${encodeURIComponent(piece.nameAr)}</text><text x="200" y="235" font-family="sans-serif" font-size="12" fill="%2308BDF4" text-anchor="middle">توثيق القطعة رقم ${piece.pieceIndex}</text></svg>`;

    setCartPhoto(
      piece.pieceIndex,
      piece.garmentId,
      piece.nameAr,
      piece.nameEn,
      demoSvg,
      language === 'ar' ? 'سليمة تماماً' : 'Good Condition'
    );
    showToast(
      language === 'ar'
        ? `تم إضافة صورة توثيقية للقطعة ${piece.pieceIndex}`
        : `Photo documented for item ${piece.pieceIndex}`
    );
  };

  const handleUpdateTag = (pieceIndex: number, tag: string) => {
    const existing = cartPhotos.find(p => p.pieceIndex === pieceIndex);
    if (!existing) return;
    setCartPhoto(
      pieceIndex,
      existing.garmentId,
      existing.garmentNameAr,
      existing.garmentNameEn,
      existing.photoUrl,
      tag,
      existing.notes
    );
  };

  const handleProceed = () => {
    navigateTo('partner_select');
  };

  const handleFillAllDemo = () => {
    expandedPieces.forEach(p => {
      handleDemoPhoto(p);
    });
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-28 relative">
      {/* 1. Step Indicator Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center gap-1.5 text-[#18A875]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'القطع (تم)' : 'Garments'}</span>
          </div>
          <span className="text-[#718596]">←</span>
          <div className="flex items-center gap-1.5 text-[#079FD0] bg-[#EAF8FF] px-2 py-0.5 rounded-lg border border-[#08BDF4]/30">
            <Camera className="w-3.5 h-3.5 animate-pulse" />
            <span>{language === 'ar' ? 'التصوير (الحالية)' : 'Photos'}</span>
          </div>
          <span className="text-[#718596]">←</span>
          <div className="flex items-center gap-1.5 text-[#718596]">
            <span>{language === 'ar' ? 'المغسلة والموعد' : 'Schedule'}</span>
          </div>
          <span className="text-[#718596]">←</span>
          <div className="flex items-center gap-1.5 text-[#718596]">
            <span>{language === 'ar' ? 'التأكيد' : 'Confirm'}</span>
          </div>
        </div>
      </div>

      {/* 2. Header & Overview */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#183247] mb-1">
              {language === 'ar' ? 'توثيق وتصوير الملابس' : 'Garment Photo Documentation'}
            </h1>
            <p className="text-xs text-[#718596]">
              {language === 'ar'
                ? `متاح لك ${totalPieces} ${totalPieces === 1 ? 'صورة' : 'صور'} بعدد القطع المختارة لتوثيق حالتها`
                : `You have ${totalPieces} photo ${totalPieces === 1 ? 'slot' : 'slots'} matching your selected garments`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#EAF8FF] border border-[#08BDF4]/30 flex items-center justify-center text-[#08BDF4]">
            <Camera className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Progress Card & Quick Simulator */}
      <div className="p-3.5 bg-gradient-to-r from-[#F4FBFF] to-[#EAF8FF] rounded-2xl border border-[#08BDF4]/20 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#079FD0]" />
            <span className="text-xs font-bold text-[#183247]">
              {language === 'ar'
                ? `تم توثيق ${capturedPhotosCount} من ${totalPieces} قطعة`
                : `Documented ${capturedPhotosCount} of ${totalPieces} items`}
            </span>
          </div>
          {capturedPhotosCount < totalPieces && (
            <button
              onClick={handleFillAllDemo}
              className="text-[11px] font-bold text-[#079FD0] bg-white px-2 py-1 rounded-lg border border-[#08BDF4]/30 hover:bg-[#EAF8FF] transition cursor-pointer"
            >
              {language === 'ar' ? 'تصوير سريع للكل' : 'Auto-snap all'}
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#E5EEF4]">
          <div
            className="h-full bg-[#08BDF4] transition-all duration-300 rounded-full"
            style={{
              width: `${totalPieces > 0 ? (capturedPhotosCount / totalPieces) * 100 : 0}%`
            }}
          ></div>
        </div>

        <p className="text-[10px] text-[#718596] mt-2 flex items-center gap-1">
          <Info className="w-3 h-3 text-[#079FD0] shrink-0" />
          <span>
            {language === 'ar'
              ? 'التصوير اختياري لكنه يضمن حماية ملابسك وتوثيق حالتها قبل استلام المندوب'
              : 'Photos are optional but ensure your clothes are documented before courier pickup'}
          </span>
        </p>
      </div>

      {/* 4. Dynamic Garment Photo Slots */}
      <div className="flex flex-col gap-3 mb-6">
        {expandedPieces.map(piece => {
          const photo = cartPhotos.find(p => p.pieceIndex === piece.pieceIndex);
          const isCaptured = Boolean(photo);

          return (
            <div
              key={piece.pieceIndex}
              className={`p-4 bg-white rounded-2xl border transition shadow-2xs ${
                isCaptured ? 'border-[#18A875]/40 ring-1 ring-[#18A875]/20' : 'border-[#E5EEF4]'
              }`}
            >
              {/* Piece Info Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EEF4] mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F4FBFF] border border-[#E5EEF4] flex items-center justify-center text-lg">
                    {piece.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-[#08BDF4] bg-[#EAF8FF] px-1.5 py-0.5 rounded-md">
                        {language === 'ar' ? `قطعة ${piece.pieceIndex}` : `Piece ${piece.pieceIndex}`}
                      </span>
                      <h3 className="text-xs font-black text-[#183247]">
                        {language === 'ar' ? piece.nameAr : piece.nameEn}
                      </h3>
                    </div>
                    <span className="text-[10px] text-[#718596] block mt-0.5">
                      {piece.customizationLabel}
                    </span>
                  </div>
                </div>

                {isCaptured ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#18A875] bg-[#EAFBF3] px-2 py-0.5 rounded-lg border border-[#18A875]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تم التوثيق' : 'Documented'}</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#718596] bg-[#F4FBFF] px-2 py-0.5 rounded-lg border border-[#E5EEF4]">
                    {language === 'ar' ? 'بانتظار الصورة' : 'Pending Photo'}
                  </span>
                )}
              </div>

              {/* Photo Area */}
              {isCaptured && photo ? (
                <div>
                  <div className="relative rounded-xl overflow-hidden border border-[#E5EEF4] mb-3 group bg-slate-50 aspect-video flex items-center justify-center">
                    <img
                      src={photo.photoUrl}
                      alt={`Garment ${piece.pieceIndex}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreviewModalUrl(photo.photoUrl)}
                        className="p-2 rounded-xl bg-white/90 text-[#183247] hover:bg-white transition cursor-pointer"
                        title={language === 'ar' ? 'عرض الصورة مكبرة' : 'Zoom photo'}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeCartPhoto(piece.pieceIndex)}
                        className="p-2 rounded-xl bg-white/90 text-red-600 hover:bg-white transition cursor-pointer"
                        title={language === 'ar' ? 'حذف الصورة' : 'Remove photo'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Condition Tag Selector */}
                  <div className="mb-2">
                    <label className="block text-[11px] font-bold text-[#183247] mb-1.5">
                      {language === 'ar' ? 'حالة القطعة أو ملاحظة مسبقة:' : 'Item Condition / Notes:'}
                    </label>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {[
                        language === 'ar' ? 'سليمة تماماً' : 'Good Condition',
                        language === 'ar' ? 'يوجد بقعة' : 'Has Stain',
                        language === 'ar' ? 'زر مفقود' : 'Missing Button',
                        language === 'ar' ? 'عناية خاصة' : 'Delicate'
                      ].map(tag => {
                        const isTagSelected = photo.tag === tag;
                        return (
                          <button
                            key={tag}
                            onClick={() => handleUpdateTag(piece.pieceIndex, tag)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer border ${
                              isTagSelected
                                ? 'bg-[#08BDF4] text-white border-[#08BDF4] shadow-2xs'
                                : 'bg-[#F4FBFF] text-[#718596] border-[#E5EEF4] hover:bg-slate-100'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions: Retake or Remove */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5EEF4]">
                    <button
                      onClick={() => fileInputRefs.current[piece.pieceIndex]?.click()}
                      className="text-[11px] font-bold text-[#079FD0] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{language === 'ar' ? 'إعادة التقاط صورة' : 'Retake photo'}</span>
                    </button>

                    <button
                      onClick={() => removeCartPhoto(piece.pieceIndex)}
                      className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{language === 'ar' ? 'حذف' : 'Remove'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty state: Take photo or upload */
                <div>
                  <div className="border-2 border-dashed border-[#E5EEF4] hover:border-[#08BDF4] rounded-2xl p-4 bg-[#F4FBFF]/50 text-center transition">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5EEF4] flex items-center justify-center text-[#08BDF4] mx-auto mb-2 shadow-2xs">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-[#183247] mb-1">
                      {language === 'ar'
                        ? `التقط صورة لـ ${piece.nameAr}`
                        : `Take a photo of ${piece.nameEn}`}
                    </p>
                    <p className="text-[10px] text-[#718596] mb-3">
                      {language === 'ar'
                        ? 'التقط بكاميرا الهاتف أو اختر صورة من المعرض'
                        : 'Use your camera or upload from gallery'}
                    </p>

                    <div className="flex items-center justify-center gap-2">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        ref={el => {
                          fileInputRefs.current[piece.pieceIndex] = el;
                        }}
                        onChange={e => handleFileUpload(e, piece)}
                        className="hidden"
                      />

                      <button
                        onClick={() => fileInputRefs.current[piece.pieceIndex]?.click()}
                        className="h-9 px-3.5 rounded-xl bg-[#08BDF4] hover:bg-[#079FD0] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'التقاط صورة' : 'Take Photo'}</span>
                      </button>

                      <button
                        onClick={() => handleDemoPhoto(piece)}
                        className="h-9 px-3 rounded-xl bg-white border border-[#E5EEF4] text-[#183247] hover:bg-[#EAF8FF] hover:border-[#08BDF4] text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        title={language === 'ar' ? 'إضافة صورة تجريبية' : 'Demo photo'}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#08BDF4]" />
                        <span>{language === 'ar' ? 'صورة سريعة' : 'Quick Demo'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Persistent Bottom Action Bar */}
      <div
        className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5EEF4] p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between w-full mt-auto"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
      >
        <div>
          <span className="text-xs font-bold text-[#183247] block">
            {capturedPhotosCount === totalPieces
              ? language === 'ar'
                ? 'تم توثيق جميع القطع ✓'
                : 'All pieces documented ✓'
              : language === 'ar'
              ? `${capturedPhotosCount} من ${totalPieces} موثقة`
              : `${capturedPhotosCount} of ${totalPieces} documented`}
          </span>
          <span className="text-[10px] text-[#718596]">
            {language === 'ar' ? 'الخطوة التالية: موعد الاستلام' : 'Next: Pickup Schedule'}
          </span>
        </div>

        <button
          onClick={handleProceed}
          className="h-12 px-6 rounded-2xl bg-[#08BDF4] hover:bg-[#079FD0] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#08BDF4]/25 transition cursor-pointer active:scale-95"
        >
          <span>
            {language === 'ar' ? 'متابعة لاختيار الموعد' : 'Continue to Schedule'}
          </span>
          {language === 'ar' ? (
            <ArrowLeft className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 6. Image Preview Modal */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-auto ltr:right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewModalUrl}
              alt="Enlarged view"
              className="w-full max-h-[70vh] object-contain bg-slate-900"
            />
            <div className="p-3 text-center bg-white border-t border-[#E5EEF4]">
              <span className="text-xs font-bold text-[#183247]">
                {language === 'ar' ? 'معاينة الصورة الموثقة للقطعة' : 'Documented Piece Photo'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
