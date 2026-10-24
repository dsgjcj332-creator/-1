import React from 'react';
import { useOperations } from '../context/OperationsContext';
import {
  LayoutDashboard,
  FileCheck2,
  Store,
  ShoppingBag,
  Truck,
  Users,
  MapPin,
  Percent,
  Receipt,
  AlertTriangle,
  History,
  Tag,
  Wallet,
  Settings,
  ClipboardList,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileDrawer = false,
  onCloseMobile
}) => {
  const { currentUser, language, applications, orders, deliveryJobs } = useOperations();
  const isRtl = language === 'ar';

  const newAppsCount = applications.filter(a => a.status === 'new').length;
  const pendingOrdersCount = orders.filter(
    o => o.status === 'awaiting_laundry_confirmation' || o.status === 'inspection_required'
  ).length;
  const unassignedJobsCount = deliveryJobs.filter(
    j => j.status === 'awaiting_assignment'
  ).length;

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    if (isMobileDrawer && onCloseMobile) {
      onCloseMobile();
    }
  };

  // Navigation Items per Persona
  const renderNavItems = () => {
    if (currentUser.role === 'platform_admin' || currentUser.role === 'dispatcher') {
      return (
        <div className="space-y-6">
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              {isRtl ? 'الرقابة المركزية' : 'Platform Control'}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('overview')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'overview'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isRtl ? 'نظرة عامة على المنصة' : 'Operations Overview'}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('applications')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'applications'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4" />
                  <span>{isRtl ? 'طلبات انضمام المغاسل' : 'Merchant Applications'}</span>
                </div>
                {newAppsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                    {newAppsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('merchants')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'merchants'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4" />
                  <span>{isRtl ? 'المغاسل الشريكة' : 'Partner Laundries'}</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              {isRtl ? 'إدارة الطلبات واللوجستيات' : 'Orders & Dispatch'}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'orders'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isRtl ? 'الطلبات والرقابة' : 'Central Orders'}</span>
                </div>
                {pendingOrdersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('dispatch')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'dispatch'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4" />
                  <span>{isRtl ? 'غرفة توزيع المهام' : 'Dispatch Console'}</span>
                </div>
                {unassignedJobsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                    {unassignedJobsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('drivers')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'drivers'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>{isRtl ? 'أسطول المناديب' : 'Couriers & Drivers'}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('zones')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'zones'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>{isRtl ? 'نطاقات المدن (الزقازيق / المنصورة)' : 'Service Zones'}</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              {isRtl ? 'الماليات والنزاعات' : 'Finance & Audit'}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('commissions')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'commissions'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Percent className="w-4 h-4" />
                  <span>{isRtl ? 'قواعد العمولات (8% و20 ج)' : 'Commission Rules'}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('settlements')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'settlements'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4" />
                  <span>{isRtl ? 'تسويات ومستحقات المغاسل' : 'Merchant Settlements'}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('support')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'support'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{isRtl ? 'البلاغات والنزاعات' : 'Support & Disputes'}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('audit')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'audit'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4" />
                  <span>{isRtl ? 'سجل العمليات والتدقيق' : 'Audit Logs'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentUser.role === 'merchant_owner' || currentUser.role === 'merchant_staff') {
      return (
        <div className="space-y-6">
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              {isRtl ? 'بوابة المغسلة' : 'Merchant Workspace'}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('merchant_overview')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'merchant_overview'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isRtl ? 'لوحة أداء المغسلة' : 'Merchant Overview'}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('merchant_orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'merchant_orders'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ClipboardList className="w-4 h-4" />
                  <span>{isRtl ? 'الطلبات وفحص الاستلام' : 'Store Orders & Intake'}</span>
                </div>
                {pendingOrdersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('merchant_catalog')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'merchant_catalog'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4" />
                  <span>{isRtl ? 'كتالوج الخدمات والأسعار' : 'Services & Catalog'}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('merchant_settlements')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'merchant_settlements'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4" />
                  <span>{isRtl ? 'أرباحي ومستحقات التسوية' : 'Revenues & Payouts'}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('merchant_settings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentTab === 'merchant_settings'
                    ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>{isRtl ? 'بيانات وساعات العمل' : 'Store Settings'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Driver persona
    return (
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
            {isRtl ? 'مهام الكابتن' : 'Driver Console'}
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleTabClick('driver_tasks')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentTab === 'driver_tasks'
                  ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4" />
                <span>{isRtl ? 'مهام الاستلام والتوصيل' : 'My Assigned Jobs'}</span>
              </div>
            </button>

            <button
              onClick={() => handleTabClick('driver_cash')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentTab === 'driver_cash'
                  ? 'bg-[#08BDF4] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="w-4 h-4" />
                <span>{isRtl ? 'الكاش والعهد النقدية' : 'Cash on Hand'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isMobileDrawer) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="font-extrabold text-sm text-slate-900">
            {isRtl ? 'قائمة أقسام المنظومة' : 'Navigation Menu'}
          </span>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {renderNavItems()}
      </div>
    );
  }

  return (
    <aside className="w-64 bg-white border-l border-slate-200 p-4 shrink-0 hidden md:block overflow-y-auto">
      {renderNavItems()}
    </aside>
  );
};
