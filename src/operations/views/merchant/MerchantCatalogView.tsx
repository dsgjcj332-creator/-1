import React, { useState } from 'react';
import { useOperations } from '../../context/OperationsContext';
import { Tag, Clock, Plus, Check, Save, Sparkles } from 'lucide-react';

interface CatalogServiceItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  priceEgp: number;
  processingHours: number;
  isActive: boolean;
}

const DEFAULT_CATALOG: CatalogServiceItem[] = [
  { id: 'srv-1', nameAr: 'قميص رجالي / بلوزة', nameEn: 'Shirt / Blouse', category: 'غسيل وكي بخار', priceEgp: 25, processingHours: 24, isActive: true },
  { id: 'srv-2', nameAr: 'بنطلون جينز / قماش', nameEn: 'Pants / Jeans', category: 'غسيل وكي بخار', priceEgp: 30, processingHours: 24, isActive: true },
  { id: 'srv-3', nameAr: 'بدلة رجالي كاملة', nameEn: 'Full Suit', category: 'دراي كلين', priceEgp: 90, processingHours: 48, isActive: true },
  { id: 'srv-4', nameAr: 'فستان سهرة ناعم', nameEn: 'Evening Dress', category: 'دراي كلين', priceEgp: 120, processingHours: 48, isActive: true },
  { id: 'srv-5', nameAr: 'جلابية رجالي فاخرة', nameEn: 'Men Jalabiya', category: 'غسيل وكي بخار', priceEgp: 40, processingHours: 24, isActive: true },
  { id: 'srv-6', nameAr: 'بطانية كبيرة مزدوجة', nameEn: 'Double Blanket', category: 'مفروشات وبطاطين', priceEgp: 120, processingHours: 48, isActive: true },
  { id: 'srv-7', nameAr: 'طقم ملايات وسرير', nameEn: 'Bed Sheets Set', category: 'مفروشات وبطاطين', priceEgp: 50, processingHours: 24, isActive: true }
];

export const MerchantCatalogView: React.FC = () => {
  const { currentMerchant, language } = useOperations();
  const isRtl = language === 'ar';

  const [items, setItems] = useState<CatalogServiceItem[]>(DEFAULT_CATALOG);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePriceChange = (id: string, newPrice: number) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, priceEgp: Math.max(0, newPrice) } : i))
    );
  };

  const handleToggleActive = (id: string) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, isActive: !i.isActive } : i))
    );
  };

  const handleSaveAll = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#08BDF4]" />
            <span>{isRtl ? 'قائمة الخدمات والأسعار المعتمدة' : 'Service Catalog & Pricing'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRtl
              ? `إدارة أسعار الخدمات لمغسلة (${currentMerchant?.nameAr || 'المغسلة'}) ومدة التجهيز بالساعات.`
              : 'Manage service prices, unit rates, and estimated turnaround hours.'}
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-4 py-2 bg-[#08BDF4] hover:bg-cyan-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? 'حفظ تعديلات الأسعار' : 'Save Changes'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{isRtl ? 'تم تحديث قائمة الأسعار بنجاح في تطبيق العملاء.' : 'Catalog prices updated successfully.'}</span>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-right border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <th className="p-3.5">{isRtl ? 'الخدمة / القطعة' : 'Service Item'}</th>
              <th className="p-3.5">{isRtl ? 'التصنيف' : 'Category'}</th>
              <th className="p-3.5">{isRtl ? 'السعر (ج.م)' : 'Price (EGP)'}</th>
              <th className="p-3.5">{isRtl ? 'وقت التجهيز المقدر' : 'Turnaround'}</th>
              <th className="p-3.5 text-center">{isRtl ? 'الحالة في التطبيق' : 'Active'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition">
                <td className="p-3.5 font-bold text-slate-900">
                  {item.nameAr}
                  <span className="text-slate-400 font-normal block text-[11px]">{item.nameEn}</span>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-700 font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="p-3.5 font-mono">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    value={item.priceEgp}
                    onChange={e => handlePriceChange(item.id, Number(e.target.value))}
                    className="w-20 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-900"
                  />{' '}
                  <span className="text-slate-500 font-sans">ج.م</span>
                </td>
                <td className="p-3.5 text-slate-600 flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.processingHours} ساعة</span>
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => handleToggleActive(item.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                      item.isActive
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                        : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-800'
                    }`}
                  >
                    {item.isActive ? (isRtl ? 'متاحة للطلب' : 'Available') : (isRtl ? 'معطلة مؤقتاً' : 'Disabled')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
