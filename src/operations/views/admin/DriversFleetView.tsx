import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { Truck, MapPin, Phone, Wallet, CheckCircle2, ShieldCheck, Plus, Search } from 'lucide-react';

export const DriversFleetView: React.FC = () => {
  const { drivers, addDriver, language } = useOperations();
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Driver Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [serviceZone, setServiceZone] = useState('الزقازيق');
  const [vehicleType, setVehicleType] = useState<'motorcycle' | 'van' | 'car' | 'bicycle'>('motorcycle');
  const [plateNumber, setPlateNumber] = useState('');

  const filtered = drivers.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.driverCode.toLowerCase().includes(q) ||
      d.mobile.includes(q) ||
      d.serviceZone.toLowerCase().includes(q)
    );
  });

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    addDriver({
      name,
      mobile,
      serviceZone,
      vehicleType,
      plateNumber: plateNumber || 'دراجة نارية',
      status: 'active',
      joinedAt: new Date().toISOString().slice(0, 10)
    });

    setShowAddModal(false);
    setName('');
    setMobile('');
    setPlateNumber('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#08BDF4]" />
            <span>{isRtl ? 'أسطول مناديب وكباتن التوصيل' : 'Delivery Drivers Fleet'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRtl
              ? 'متابعة مناديب الاستلام والتوصيل في الزقازيق والمنصورة، والمهام النشطة والعهد النقدية المحصلة.'
              : 'Fleet management for pickup & delivery operations across Zagazig & Mansoura zones.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'إضافة كابتن توصيل جديد' : 'Add New Courier'}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={
            isRtl
              ? 'بحث باسم الكابتن، كود المندوب، رقم الهاتف، أو النطاق...'
              : 'Search by driver name, driver code, mobile, or zone...'
          }
          className="w-full text-xs bg-transparent focus:outline-hidden text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(driver => (
          <div
            key={driver.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#08BDF4] font-bold">
                  {driver.driverCode}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-0.5">
                  {driver.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {driver.serviceZone} | {driver.plateNumber || 'دراجة نارية'}
                </p>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                driver.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {driver.status === 'active' ? (isRtl ? 'نشط ومتاح' : 'Active') : driver.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-mono dir-ltr text-right">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{driver.mobile}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{isRtl ? 'العهدة النقدية في اليد:' : 'Cash on Hand:'}{' '}
                  <strong className="text-slate-900 font-bold">{driver.cashInHandEgp} ج.م</strong>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="font-extrabold text-blue-600 block">{driver.activeJobsCount}</span>
                <span className="text-[10px] text-slate-500">{isRtl ? 'مهام نشطة' : 'Active'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="font-extrabold text-emerald-600 block">{driver.completedJobsTotal}</span>
                <span className="text-[10px] text-slate-500">{isRtl ? 'منفذة' : 'Completed'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="font-extrabold text-slate-900 block">{driver.rating} ★</span>
                <span className="text-[10px] text-slate-500">{isRtl ? 'التقييم' : 'Rating'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {isRtl ? 'إضافة كابتن توصيل جديد' : 'Add Delivery Courier'}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  {isRtl ? 'تسجيل مندوب جديد بأسطول التوصيل' : 'Register a new courier in fleet'}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isRtl ? 'اسم المندوب الرباعي:' : 'Driver Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={isRtl ? 'أحمد عبد الرحيم السيد' : 'Driver Name'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isRtl ? 'رقم الهاتف المحمول (واتساب / مكالمات):' : 'Mobile Phone:'}
                </label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="01099887766"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono dir-ltr text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isRtl ? 'نطاق الخدمة والمدينة:' : 'Service Zone:'}
                  </label>
                  <select
                    value={serviceZone}
                    onChange={e => setServiceZone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="الزقازيق">{isRtl ? 'الزقازيق' : 'Zagazig'}</option>
                    <option value="المنصورة">{isRtl ? 'المنصورة' : 'Mansoura'}</option>
                    <option value="العاشر من رمضان">{isRtl ? 'العاشر من رمضان' : '10th of Ramadan'}</option>
                    <option value="القاهرة">{isRtl ? 'القاهرة' : 'Cairo'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isRtl ? 'وسيلة الانتقال:' : 'Vehicle Type:'}
                  </label>
                  <select
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="motorcycle">{isRtl ? 'موتوسيكل' : 'Motorcycle'}</option>
                    <option value="car">{isRtl ? 'سيارة' : 'Car'}</option>
                    <option value="van">{isRtl ? 'فان مغلقة' : 'Van'}</option>
                    <option value="bicycle">{isRtl ? 'دراجة' : 'Bicycle'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isRtl ? 'رقم اللوحة المعدنية أو كود المركبة:' : 'Plate Number:'}
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={e => setPlateNumber(e.target.value)}
                  placeholder={isRtl ? 'مثال: ر ق ص 4921' : 'e.g. 4921-EG'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
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
                  {isRtl ? 'حفظ وتفعيل الكابتن' : 'Add Courier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
