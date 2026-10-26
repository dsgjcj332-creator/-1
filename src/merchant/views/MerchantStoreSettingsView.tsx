import React, { useState } from 'react';
import { useMerchantAuth } from '../context/MerchantAuthContext';
import {
  Store,
  Clock,
  ShoppingBag,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  Power,
  Zap,
  Tag,
  Sparkles,
  Scissors,
  Layers,
  Footprints,
  Shirt,
  DollarSign
} from 'lucide-react';

export const MerchantStoreSettingsView: React.FC = () => {
  const {
    activeMerchant,
    isStoreAcceptingOrders,
    toggleStoreAcceptingOrders,
    dailyIntakeCap,
    setDailyIntakeCap,
    expressAvailable,
    expressHours,
    estimatedHours,
    minOrderAmount,
    openingHours: ctxOpeningHours,
    counterPhone: ctxCounterPhone,
    driverArrivalNote: ctxDriverArrivalNote,
    offeredServices,
    toggleOfferedService,
    saveOfferedServices,
    stainOptions,
    updateStainOption,
    updateStoreSettings
  } = useMerchantAuth();

  // Local form state
  const [capacity, setCapacity] = useState<number>(dailyIntakeCap || 60);
  const [isExpress, setIsExpress] = useState<boolean>(expressAvailable ?? true);
  const [expHours, setExpHours] = useState<number>(expressHours || 6);
  const [stdHours, setStdHours] = useState<number>(estimatedHours || 24);
  const [minOrder, setMinOrder] = useState<number>(minOrderAmount !== undefined ? minOrderAmount : 20);
  const [openingHours, setOpeningHours] = useState<string>(
    ctxOpeningHours || activeMerchant?.activeHours || '08:00 AM - 11:00 PM'
  );
  const [counterPhone, setCounterPhone] = useState<string>(
    ctxCounterPhone || activeMerchant?.phone || '01012345678'
  );
  const [driverArrivalNote, setDriverArrivalNote] = useState<string>(
    ctxDriverArrivalNote ||
      'يرجى من الطيار الدخول مباشرة لكاونتر الاستلام في الخلف وتسليم باركود الكيس.'
  );

  const [localServices, setLocalServices] = useState<Record<string, boolean>>(offeredServices || {});
  const [localStains, setLocalStains] = useState(stainOptions);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync when offeredServices or stainOptions from context changes
  React.useEffect(() => {
    if (offeredServices) {
      setLocalServices(offeredServices);
    }
  }, [offeredServices]);

  React.useEffect(() => {
    setLocalStains(stainOptions);
  }, [stainOptions]);

  const handleToggleLocalService = (key: string) => {
    setLocalServices(prev => ({
      ...prev,
      [key]: prev[key] === false ? true : false
    }));
  };

  const handleStainPriceChange = (id: string, newPrice: number) => {
    setLocalStains(prev =>
      prev.map(s => (s.id === id ? { ...s, price: Math.max(0, newPrice) } : s))
    );
  };

  const handleToggleStain = (id: string) => {
    setLocalStains(prev =>
      prev.map(s => (s.id === id ? { ...s, isAvailable: s.isAvailable === false } : s))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Save general store turnaround and minimum order settings
    updateStoreSettings({
      dailyIntakeCap: capacity,
      expressAvailable: isExpress,
      expressHours: expHours,
      estimatedHours: stdHours,
      minOrderAmount: Math.max(0, Number(minOrder) || 0),
      openingHours,
      counterPhone,
      driverArrivalNote
    });

    // 2. Save stains customization
    localStains.forEach(st => {
      updateStainOption(st.id, { price: st.price, isAvailable: st.isAvailable !== false });
    });

    // 3. Save offered services (custom wash/iron/dryclean/bedding/shoes)
    saveOfferedServices(localServices);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const SERVICE_OPTIONS = [
    { key: 'wash_iron', labelAr: 'غسيل وكي بالبخار', descAr: 'الغسيل الكامل مع الكي الفندقي', icon: Shirt },
    { key: 'wash_only', labelAr: 'غسيل وتجفيف فقط', descAr: 'بدون كي، معبأة مطوية', icon: Sparkles },
    { key: 'iron_only', labelAr: 'كي بالبخار فقط', descAr: 'فرد التكسيرات وتعليق على شماعة', icon: Scissors },
    { key: 'dry_clean', labelAr: 'تنظيف جاف (دراي كلين)', descAr: 'للأقمشة الحساسة والبدل والسواريه', icon: Tag },
    { key: 'bedding', labelAr: 'بطاطين ومفروشات ولحاف', descAr: 'ماكينات السعة الكبيرة والتعقيم', icon: Layers },
    { key: 'shoes', labelAr: 'أحذية رياضية وجلود', descAr: 'تنظيف عميق وإزالة الروائح', icon: Footprints }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 text-right" dir="rtl">
      {/* Title & Master Store Toggle */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-sky-600" />
            <span>لوحة تحكم إعدادات وخدمات المغسلة</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            تحكم فوري في الخدمة السريعة، تسعير معالجة البقع، والخدمات المتاحة للعملاء
          </p>
        </div>

        {/* Master Active Status */}
        <button
          type="button"
          onClick={toggleStoreAcceptingOrders}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
            isStoreAcceptingOrders
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-xs'
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 shadow-xs'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isStoreAcceptingOrders ? 'المغسلة تعمل وتستقبل طلبات' : 'المغسلة متوقفة مؤقتاً'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div>تم حفظ كافة التحديثات بنجاح!</div>
            <div className="text-[11px] font-normal text-emerald-700 mt-0.5">
              تم تحديث بطاقة المغسلة، خيارات البقع، ومواعيد الخدمة السريعة للعملاء فوراً.
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* ── SECTION 1: Express Service Controls ── */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span>الخدمة السريعة (عالسريع المستعجل ⚡)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                تتيح للعملاء طلب استلام وغسيل وتسليم سريع خلال ساعات محددة
              </p>
            </div>

            {/* Express Toggle */}
            <button
              type="button"
              onClick={() => setIsExpress(!isExpress)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isExpress
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isExpress ? 'fill-white' : ''}`} />
              <span>{isExpress ? 'الخدمة السريعة مفعلة' : 'الخدمة السريعة معطلة'}</span>
            </button>
          </div>

          {/* Express Hours Picker */}
          {isExpress ? (
            <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <label className="block text-xs font-bold text-emerald-950">
                حدد عدد ساعات إنجاز الخدمة السريعة بالظبط:
              </label>

              {/* Quick Hours Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {[3, 4, 6, 8, 12].map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setExpHours(h)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 border ${
                      expHours === h
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-100/50'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>خلال {h} ساعات</span>
                  </button>
                ))}
              </div>

              {/* Custom Number Input */}
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="text-slate-600 font-medium">أو أدخل عدد ساعات مخصص:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={expHours}
                    onChange={e => setExpHours(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2 py-1 text-xs border border-emerald-300 rounded-lg text-center font-bold font-mono bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500">ساعة</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 bg-white/80 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  نص البطاقة الظاهر للعميل حالياً:{' '}
                  <strong className="text-emerald-900">خدمة سريعة متاحة خلال {expHours} ساعات</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              الخدمة السريعة متوقفة مؤقتاً في فرعك. سيظهر للعميل: <strong>الخدمة العادية خلال {stdHours} ساعة</strong>.
            </div>
          )}
        </div>

        {/* ── SECTION 2: General Turnaround & Pricing Controls ── */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>مواعيد الإنجاز العادي والحد الأدنى للطلب (بطاقة المغسلة)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Standard Turnaround */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                وقت الإنجاز العادي (بالساعات):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="6"
                  max="72"
                  step="6"
                  value={stdHours}
                  onChange={e => setStdHours(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold font-mono text-center focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <span className="text-xs text-slate-500 font-bold shrink-0">ساعة</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">يظهر في بطاقة المغسلة (مثال: 24 ساعة)</span>
            </div>

            {/* Minimum Order */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  الحد الأدنى لقيمة الطلب:
                </label>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  minOrder === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                }`}>
                  {minOrder === 0 ? 'بدون حد أدنى (حر)' : `${minOrder} ج.م`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={minOrder}
                  onChange={e => setMinOrder(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold font-mono text-center focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  placeholder="0"
                />
                <span className="text-xs text-slate-500 font-bold shrink-0">ج.م</span>
              </div>

              {/* Quick Preset Buttons for Merchant Convenience */}
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                {[
                  { val: 0, label: '0 (بدون حد)' },
                  { val: 20, label: '20 ج.م' },
                  { val: 35, label: '35 ج.م' },
                  { val: 50, label: '50 ج.م' },
                  { val: 85, label: '85 ج.م' },
                  { val: 100, label: '100 ج.م' }
                ].map(preset => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setMinOrder(preset.val)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                      minOrder === preset.val
                        ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <span className="text-[10px] text-slate-500 mt-1.5 block leading-tight">
                {minOrder === 0
                  ? '✅ متاح للعميل إرسال أي طلب دون اشتراط حد أدنى للسلة.'
                  : `⚠️ العميل ملزم بسلة لا تقل عن ${minOrder} ج.م لإتمام الحجز.`}
              </span>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Custom Services Offered by Merchant ── */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Shirt className="w-4 h-4 text-violet-600" />
                <span>تخصيص الخدمات المتاحة بفرعك (الخدمات المعروضة للعميل)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                اضغط على أي خدمة لتفعيلها أو إيقافها، ثم اضغط "حفظ كافة التعديلات" بالأسفل لتنعكس فوراً على العميل
              </p>
            </div>
            <div className="text-[11px] text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-200 font-bold">
              المفعل: {Object.values(localServices).filter(v => v !== false).length} من {SERVICE_OPTIONS.length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SERVICE_OPTIONS.map(srv => {
              const Icon = srv.icon;
              const isEnabled = localServices[srv.key] !== false;

              return (
                <div
                  key={srv.key}
                  onClick={() => handleToggleLocalService(srv.key)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-2.5 ${
                    isEnabled
                      ? 'border-violet-300 bg-violet-50/50 shadow-2xs hover:border-violet-400'
                      : 'border-slate-200 bg-slate-50/70 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-xl shrink-0 ${isEnabled ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                        <span>{srv.labelAr}</span>
                        {isEnabled ? (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">مفعل</span>
                        ) : (
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black">معطل</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-snug">{srv.descAr}</div>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isEnabled ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isEnabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 4: Stain Treatment Cards & Pricing ── */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>بطاقات معالجة البقع المتخصصة وتسعيرها (التاجر يحدد السعر)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                تظهر هذه البطاقات للعميل لاختيار نوع البقعة وإضافة سعرها تلقائياً مع القطعة
              </p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-xl border border-amber-200 font-bold self-start sm:self-auto">
              سعر إضافي يضاف لحساب المغسلة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {localStains.map(stain => {
              const isAvailable = stain.isAvailable !== false;

              return (
                <div
                  key={stain.id}
                  className={`p-3.5 rounded-2xl border transition space-y-2.5 ${
                    isAvailable
                      ? 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{stain.icon || '🧼'}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">{stain.nameAr}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{stain.nameEn}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStain(stain.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer border ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-200 text-slate-500 border-slate-300'
                      }`}
                    >
                      {isAvailable ? 'مفعل' : 'معطل'}
                    </button>
                  </div>

                  {/* Price Setting */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-600 font-medium">سعر المعالجة:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-bold">+</span>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={stain.price}
                        onChange={e => handleStainPriceChange(stain.id, Number(e.target.value))}
                        disabled={!isAvailable}
                        className="w-16 px-2 py-1 text-xs border border-slate-300 rounded-lg text-center font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100"
                      />
                      <span className="text-slate-500 font-bold">ج.م</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 5: Daily Intake, Hours & Driver Instructions ── */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>بيانات الفرع وملاحظات وصول الطيارين</span>
          </h3>

          {/* Daily Capacity */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-sky-600" />
              <span>سعة استقبال أكياس الغسيل اليومية (كيس/يوم):</span>
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3">
              <input
                type="number"
                min="10"
                max="300"
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                className="w-32 px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold font-mono text-center focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <span className="text-[11px] sm:text-xs text-slate-500">
                عند وصول عدد الطلبات لهذا الحد، يتوقف استقبال طلبات إضافية لحين انتهاء الدفعات الحالية.
              </span>
            </div>
          </div>

          {/* Operating Hours & Counter Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>مواعيد تشغيل المغسلة واستلام الطيارين:</span>
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={e => setOpeningHours(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-sky-600" />
                <span>هاتف كاونتر المغسلة المباشر:</span>
              </label>
              <input
                type="text"
                value={counterPhone}
                onChange={e => setCounterPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Driver Arrival Note */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>ملاحظات وإرشادات وصول طياري ومندوبي المنصة:</span>
            </label>
            <textarea
              rows={2}
              value={driverArrivalNote}
              onChange={e => setDriverArrivalNote(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* ── Submit Button Pinned at Bottom ── */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>حفظ كافة إعدادات وخدمات وأسعار الفرع</span>
          </button>
        </div>
      </form>
    </div>
  );
};
