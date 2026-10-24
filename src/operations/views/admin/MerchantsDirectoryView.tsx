import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { Store, MapPin, Phone, Star, ShieldCheck, Clock, Plus, Search, Check } from 'lucide-react';

export const MerchantsDirectoryView: React.FC = () => {
  const { merchants, addMerchant, language } = useOperations();
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Merchant Form State
  const [nameAr, setNameAr] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('الزقازيق');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [activeHours, setActiveHours] = useState('09:00 ص - 11:00 م');
  const [capacity, setCapacity] = useState(40);
  const [payoutMethod, setPayoutMethod] = useState<'instapay' | 'bank_transfer' | 'vodafone_cash'>('instapay');
  const [payoutDetails, setPayoutDetails] = useState('');

  const filtered = merchants.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.nameAr.toLowerCase().includes(q) ||
      m.ownerName.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.district.toLowerCase().includes(q) ||
      m.commercialRegNo.toLowerCase().includes(q)
    );
  });

  const handleCreateMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !ownerName.trim() || !phone.trim()) return;

    addMerchant({
      nameAr,
      nameEn: nameAr,
      commercialRegNo: `CR-${Math.floor(100000 + Math.random() * 900000)}`,
      taxNumber: `TAX-${Math.floor(100000 + Math.random() * 900000)}`,
      ownerName,
      phone,
      governorate: city === 'الزقازيق' ? 'الشرقية' : city === 'المنصورة' ? 'الدقهلية' : 'القاهرة',
      city,
      district: district || address,
      address: address || district,
      status: 'active',
      commissionRate: 0.08,
      serviceFeePayer: 'customer',
      capacityBagsPerDay: Number(capacity),
      activeHours,
      payoutMethod,
      payoutDetails: payoutDetails || `${phone}@instapay`
    });

    setShowAddModal(false);
    // Reset form
    setNameAr('');
    setOwnerName('');
    setPhone('');
    setDistrict('');
    setAddress('');
    setPayoutDetails('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-[#08BDF4]" />
            <span>{isRtl ? 'المغاسل الشريكة المعتمدة' : 'Partner Laundries Directory'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRtl
              ? 'سجل المغاسل المؤهلة تجارياً وتشغيلياً في نطاق محافظتي الشرقية والدقهلية.'
              : 'Directory of verified and activated laundry businesses in Sharqia and Dakahlia.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'إضافة مغسلة جديدة يدوياً' : 'Add New Laundry'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={
            isRtl
              ? 'بحث باسم المغسلة، اسم المالك، المدينة، الحي، أو السجل التجاري...'
              : 'Search by laundry, owner, city, district, or CR number...'
          }
          className="w-full text-xs bg-transparent focus:outline-hidden text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(merchant => (
          <div
            key={merchant.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#08BDF4] font-bold">
                  {merchant.commercialRegNo}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-0.5">
                  {merchant.nameAr}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isRtl ? `المالك: ${merchant.ownerName}` : `Owner: ${merchant.ownerName}`}
                </p>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                {merchant.status === 'active' ? (isRtl ? 'نشطة ومعتمدة' : 'Active') : merchant.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{merchant.city} - {merchant.district}</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono dir-ltr text-right">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{merchant.phone}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{merchant.activeHours}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="font-extrabold text-slate-900 block">{merchant.rating} ★</span>
                <span className="text-[10px] text-slate-500">{isRtl ? 'التقييم' : 'Rating'}</span>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="font-extrabold text-purple-700 block">
                  {Math.round(merchant.commissionRate * 100)}%
                </span>
                <span className="text-[10px] text-slate-500">{isRtl ? 'العمولة' : 'Comm.'}</span>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="font-extrabold text-slate-900 block">{merchant.totalOrdersFulfilled}</span>
                <span className="text-[10px] text-slate-500">{isRtl ? 'طلبات منفذة' : 'Orders'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Onboard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {isRtl ? 'إضافة مغسلة معتمدة جديدة' : 'Add New Partner Laundry'}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  {isRtl ? 'تسجيل مباشر لشريك متعاقد بدون انتظار تقديم الويب' : 'Direct manual onboarding'}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMerchant} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isRtl ? 'اسم المغسلة التجاري:' : 'Business Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={e => setNameAr(e.target.value)}
                  placeholder={isRtl ? 'مثال: مغسلة الفيروز البخارية' : 'e.g. Al-Fayrouz Cleaners'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isRtl ? 'اسم المالك أو المدير:' : 'Owner / Manager:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder={isRtl ? 'محمود عبد السلام' : 'Owner name'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isRtl ? 'رقم الهاتف المحمول:' : 'Mobile Number:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono dir-ltr text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'المدينة:' : 'City:'}</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="الزقازيق">{isRtl ? 'الزقازيق' : 'Zagazig'}</option>
                    <option value="المنصورة">{isRtl ? 'المنصورة' : 'Mansoura'}</option>
                    <option value="العاشر من رمضان">{isRtl ? 'العاشر من رمضان' : '10th of Ramadan'}</option>
                    <option value="القاهرة">{isRtl ? 'القاهرة' : 'Cairo'}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'الحي / المنطقة:' : 'District:'}</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder={isRtl ? 'حي الجامعة / القومية' : 'District'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'العنوان التفصيلي:' : 'Full Address:'}</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder={isRtl ? 'شارع فاروق بجوار البنك الأهلي' : 'Address details'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'ساعات العمل:' : 'Hours:'}</label>
                  <input
                    type="text"
                    value={activeHours}
                    onChange={e => setActiveHours(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'سعة الأكياس / يوم:' : 'Bag Capacity:'}</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{isRtl ? 'بيانات التحويل المعتمدة:' : 'Payout Details:'}</label>
                <input
                  type="text"
                  value={payoutDetails}
                  onChange={e => setPayoutDetails(e.target.value)}
                  placeholder="e.g. alnoor@instapay"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black rounded-xl cursor-pointer shadow-xs"
                >
                  {isRtl ? 'اعتماد وتفعيل المغسلة' : 'Save & Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
