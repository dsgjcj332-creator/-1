import React from 'react';
import {
  Bell,
  CheckCheck,
  ShoppingBag,
  Tag,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsScreen: React.FC = () => {
  const {
    language,
    t,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
    orders,
    setActiveTrackingOrder
  } = useApp();

  const handleNotificationClick = (orderId?: string, notifId?: string) => {
    if (notifId) markNotificationAsRead(notifId);
    if (orderId) {
      const match = orders.find(o => o.id === orderId);
      if (match) {
        setActiveTrackingOrder(match);
        navigateTo('order_tracking');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-16 select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-[#183247] mb-0.5">
            {t.notifications}
          </h2>
          <p className="text-xs text-[#718596]">
            {language === 'ar' ? 'تحديثات حالة الطلبات والعروض الحصرية' : 'Latest updates on orders and offers'}
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 text-xs font-bold text-[#079FD0] hover:underline cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#E5EEF4]">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-[#718596]">لا توجد إشعارات جديدة حالياً</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif.orderId, notif.id)}
              className={`p-3.5 rounded-2xl border transition shadow-2xs cursor-pointer flex items-start gap-3 ${
                notif.read
                  ? 'bg-white border-[#E5EEF4]'
                  : 'bg-[#F4FBFF] border-[#08BDF4]/40 ring-1 ring-[#08BDF4]/10'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                notif.type === 'order'
                  ? 'bg-[#EAF8FF] text-[#079FD0]'
                  : notif.type === 'promo'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {notif.type === 'order' ? (
                  <ShoppingBag className="w-4 h-4" />
                ) : notif.type === 'promo' ? (
                  <Tag className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#183247]">
                    {language === 'ar' ? notif.titleAr : notif.titleEn}
                  </h4>
                  <span className="text-[10px] text-[#718596]">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-[#718596] mt-1 leading-snug">
                  {language === 'ar' ? notif.messageAr : notif.messageEn}
                </p>

                {notif.orderId && (
                  <span className="text-[10px] font-bold text-[#079FD0] mt-1.5 inline-flex items-center gap-1">
                    <span>{language === 'ar' ? 'عرض تتبع الطلب' : 'Track Order'}</span>
                    {language === 'ar' ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
