import React, { useState } from 'react';
import {
  ShoppingBag,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { GARMENTS, LAUNDRY_PARTNERS } from '../../data/mockData';

export const OrdersScreen: React.FC = () => {
  const {
    language,
    t,
    orders,
    partners,
    setActiveTrackingOrder,
    navigateTo,
    reorder
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const filteredOrders = orders.filter(order => {
    if (filterTab === 'all') return true;
    if (filterTab === 'active') {
      return order.status !== 'delivered' && order.status !== 'cancelled';
    }
    if (filterTab === 'completed') {
      return order.status === 'delivered';
    }
    if (filterTab === 'cancelled') {
      return order.status === 'cancelled';
    }
    return true;
  });

  const handleOrderClick = (order: Order) => {
    setActiveTrackingOrder(order);
    navigateTo('order_tracking');
  };

  const handleRateClick = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setActiveTrackingOrder(order);
    navigateTo('rate_order');
  };

  const handleReorderClick = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    reorder(order);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-8 select-none">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-black text-[#183247] mb-1">
          {t.navOrders}
        </h1>
        <p className="text-xs text-[#718596]">
          {language === 'ar' ? 'سجل وتاريخ جميع طلباتك السابقة والجارية' : 'History of all your current and past orders'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-2xl border border-[#E5EEF4] mb-4 shadow-2xs">
        {[
          { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
          { id: 'active', label: language === 'ar' ? 'الجارية' : 'Active' },
          { id: 'completed', label: language === 'ar' ? 'المكتملة' : 'Completed' },
          { id: 'cancelled', label: language === 'ar' ? 'الملغاة' : 'Cancelled' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer truncate ${
              filterTab === tab.id
                ? 'bg-[#08BDF4] text-white shadow-xs'
                : 'text-[#718596] hover:text-[#183247]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#E5EEF4] my-6">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF8FF] text-[#079FD0] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-[#183247] mb-1">
              {language === 'ar' ? 'لا توجد طلبات في هذا القسم' : 'No orders in this section'}
            </h3>
            <p className="text-xs text-[#718596] mb-4">
              {language === 'ar' ? 'ابدأ طلبك الأول الآن واستمتع بملابس نظيفة ومعطرة' : 'Start your first order now with free doorstep pickup'}
            </p>
            <button
              onClick={() => navigateTo('garment_select')}
              className="px-4 py-2 bg-[#08BDF4] hover:bg-[#079FD0] text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              {t.startNewOrderBtn}
            </button>
          </div>
        ) : (
          filteredOrders.map(order => {
            const partner = partners.find(p => p.id === order.partnerId || p.id === (order as any).merchantId) ||
              LAUNDRY_PARTNERS.find(p => p.id === order.partnerId) ||
              {
                id: order.partnerId,
                nameAr: (order as any).merchantName || (order as any).merchant_name || 'مغسلة معتمدة',
                nameEn: (order as any).merchantName || (order as any).merchant_name || 'Certified Partner'
              };
            const isCompleted = order.status === 'delivered';
            const isCancelled = order.status === 'cancelled';
            const isActive = !isCompleted && !isCancelled;

            return (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order)}
                className="p-4 bg-white rounded-3xl border border-[#E5EEF4] hover:border-[#08BDF4]/60 transition shadow-2xs cursor-pointer flex flex-col gap-3"
              >
                {/* Header: Ref & Status */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E5EEF4]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#079FD0]">
                      #{order.referenceNumber}
                    </span>
                    <span className="text-[10px] text-[#718596]">
                      ({order.createdAt.split(' ')[0]})
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-50 text-[#18A875]'
                        : isCancelled
                        ? 'bg-red-50 text-[#E55353]'
                        : 'bg-[#EAF8FF] text-[#079FD0]'
                    }`}
                  >
                    {t[`status_${order.status}` as keyof typeof t] || order.status}
                  </span>
                </div>

                {/* Items preview */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-[#183247]">
                      {language === 'ar' ? partner?.nameAr : partner?.nameEn}
                    </h4>
                    <p className="text-[11px] text-[#718596] mt-0.5">
                      {order.items.length} {language === 'ar' ? 'أنواع ملابس' : 'items'} ·{' '}
                      {order.items.reduce((s, i) => s + i.quantity, 0)} {t.itemsCount}
                    </p>
                  </div>

                  <div className="text-end">
                    <span className="text-sm font-black text-[#183247] block">
                      {order.finalTotal} {t.currency}
                    </span>
                    <span className="text-[10px] text-[#718596]">
                      {order.paymentMethod === 'cod' ? 'كاش' : 'إلكتروني'}
                    </span>
                  </div>
                </div>

                {/* Action Strip */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E5EEF4]">
                  <span className="text-xs font-bold text-[#079FD0] flex items-center gap-1">
                    <span>{t.trackOrder}</span>
                    {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </span>

                  <div className="flex items-center gap-2">
                    {isCompleted && !order.rating && (
                      <button
                        onClick={e => handleRateClick(e, order)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>تقييم</span>
                      </button>
                    )}

                    {isCompleted && (
                      <button
                        onClick={e => handleReorderClick(e, order)}
                        className="px-2.5 py-1 bg-[#EAF8FF] hover:bg-[#08BDF4]/20 text-[#079FD0] border border-[#08BDF4]/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{t.reorder}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
