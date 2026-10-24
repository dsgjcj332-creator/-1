import React, { useState } from 'react';
import { useMerchantAuth, LaundryServiceItem } from '../context/MerchantAuthContext';
import {
  Sparkles,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Check
} from 'lucide-react';

export const MerchantCatalogPriceView: React.FC = () => {
  const { servicesCatalog, toggleServiceAvailability, updateServicePrice, activeMerchant } = useMerchantAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceForm, setEditPriceForm] = useState<{ washIron: number; dryClean?: number }>({
    washIron: 0,
    dryClean: 0
  });

  const categories = [
    { id: 'all', label: 'كافة الخدمات والقطع' },
    { id: 'men', label: 'ملابس رجالي' },
    { id: 'women', label: 'ملابس حريمي' },
    { id: 'formal', label: 'بدل وسواريه' },
    { id: 'bedding', label: 'بطاطين ومفروشات' }
  ];

  const filteredItems = servicesCatalog.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return item.nameAr.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStartEdit = (item: LaundryServiceItem) => {
    setEditingItemId(item.id);
    setEditPriceForm({
      washIron: item.washIronPrice,
      dryClean: item.dryCleanPrice || 0
    });
  };

  const handleSavePrice = (itemId: string) => {
    updateServicePrice(itemId, 'washIron', Number(editPriceForm.washIron));
    if (editPriceForm.dryClean !== undefined) {
      updateServicePrice(itemId, 'dryClean', Number(editPriceForm.dryClean));
    }
    setEditingItemId(null);
  };

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-sky-600" />
            <span>قائمة أسعار وخدمات المغسلة للعملاء</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            الأسعار الظاهرة هنا تظهر مباشرة للعملاء عند حجز الطلبات من فرع {activeMerchant?.nameAr}
          </p>
        </div>

        <div className="text-xs bg-sky-50 text-sky-800 px-3 py-1.5 rounded-xl border border-sky-100 font-bold self-end sm:self-auto">
          عمولة المنصة الثابتة: 8% مخصومة آلياً من صافي الغسيل
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن قطعة أو خدمة (قميص، بدلة، بطانية، فستان...)"
              className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="text-xs text-slate-500 font-bold shrink-0">
            القطع المفعلة: {servicesCatalog.filter(i => i.isAvailable).length} من {servicesCatalog.length}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map(item => {
          const isEditing = editingItemId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs transition flex flex-col justify-between ${
                item.isAvailable
                  ? 'border-slate-200 hover:border-slate-300'
                  : 'border-slate-200 bg-slate-50/60 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{item.nameAr}</h3>
                    <div className="text-[10px] text-slate-400 font-sans">{item.nameEn}</div>
                  </div>

                  {/* Availability Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleServiceAvailability(item.id)}
                    title={item.isAvailable ? 'إيقاف استقبال هذه القطعة مؤقتاً' : 'تفعيل استقبال هذه القطعة'}
                    className={`p-1 rounded-lg transition cursor-pointer flex items-center gap-1 text-[10px] font-bold ${
                      item.isAvailable
                        ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'text-slate-500 bg-slate-200 hover:bg-slate-300'
                    }`}
                  >
                    {item.isAvailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>متاح للحجز</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>معلق مؤقتاً</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>زمن التجهيز المقدر: {item.estDurationHours} ساعة</span>
                </div>

                {/* Pricing Box */}
                {isEditing ? (
                  <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 space-y-2 mb-2">
                    <div className="text-[11px] font-bold text-sky-900">تعديل سعر المغسلة:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-600 block mb-0.5">غسيل وكوي:</label>
                        <input
                          type="number"
                          value={editPriceForm.washIron}
                          onChange={e => setEditPriceForm({ ...editPriceForm, washIron: Number(e.target.value) })}
                          className="w-full p-1 text-xs border border-slate-300 rounded font-mono font-bold"
                        />
                      </div>
                      {item.dryCleanPrice !== undefined && (
                        <div>
                          <label className="text-[10px] text-slate-600 block mb-0.5">دراي كلين:</label>
                          <input
                            type="number"
                            value={editPriceForm.dryClean}
                            onChange={e => setEditPriceForm({ ...editPriceForm, dryClean: Number(e.target.value) })}
                            className="w-full p-1 text-xs border border-slate-300 rounded font-mono font-bold"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 mb-2 text-xs">
                    <div className="flex justify-between text-slate-700">
                      <span>غسيل وكوي بخار:</span>
                      <span className="font-mono font-bold text-sky-700">{item.washIronPrice} ج.م</span>
                    </div>

                    {item.dryCleanPrice !== undefined && (
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>تنظيف جاف (دراي كلين):</span>
                        <span className="font-mono font-bold text-indigo-700">{item.dryCleanPrice} ج.م</span>
                      </div>
                    )}

                    {item.ironOnlyPrice !== undefined && (
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>كوي فقط بدون غسيل:</span>
                        <span className="font-mono">{item.ironOnlyPrice} ج.م</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => handleSavePrice(item.id)}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>حفظ السعر</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="text-slate-600 hover:text-sky-600 hover:bg-slate-100 font-bold py-1 px-2.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل السعر</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
