import React from 'react';
import { useMerchantAuth } from '../context/MerchantAuthContext';
import {
  Store,
  Power,
  LogOut,
  Bell,
  Globe,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  QrCode,
  Tag,
  ShoppingBag,
  TrendingUp,
  Settings
} from 'lucide-react';

interface MerchantHeaderProps {
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  onOpenLoginModal: () => void;
  onOpenScannerModal: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const MerchantHeader: React.FC<MerchantHeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenLoginModal,
  onOpenScannerModal,
  activeTab,
  onSelectTab
}) => {
  const {
    activeMerchant,
    activeStaff,
    isStoreAcceptingOrders,
    toggleStoreAcceptingOrders,
    orderMetrics,
    logout
  } = useMerchantAuth();

  const isRtl = language === 'ar';

  return (
    <>
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Brand & Store Identity */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
                <Store className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight shrink-0">
                    عالسريع
                  </span>
                  <span className="text-[9px] sm:text-[10px] bg-sky-100 text-sky-800 font-extrabold px-1.5 py-0.5 rounded-md shrink-0">
                    بوابة المغسلة
                  </span>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[120px] sm:max-w-none">
                    {activeMerchant?.nameAr || 'المغسلة المعتمدة'}
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                  <span>{activeMerchant?.city}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium truncate">
                    {activeStaff?.name || 'مسؤول الوردية'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Header Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Quick Barcode Scanner Trigger */}
              <button
                onClick={onOpenScannerModal}
                className="bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border border-slate-200"
                title="مسح سريع لباركود الكيس"
              >
                <QrCode className="w-4 h-4 text-sky-600" />
                <span className="hidden md:inline">مسح كيس سريع</span>
              </button>

              {/* Store Intake Status Toggle */}
              <button
                onClick={toggleStoreAcceptingOrders}
                title={isStoreAcceptingOrders ? 'المغسلة تستقبل أكياس جديدة' : 'المغسلة متوقفة مؤقتاً'}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer border ${
                  isStoreAcceptingOrders
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isStoreAcceptingOrders ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="hidden sm:inline">
                  {isStoreAcceptingOrders ? 'تستقبل أكياس' : 'معلقة مؤقتاً'}
                </span>
              </button>

              {/* Language Switch */}
              <button
                onClick={onToggleLanguage}
                className="p-1.5 sm:p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="تغيير اللغة"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden lg:inline">{language === 'ar' ? 'English' : 'عربي'}</span>
              </button>

              {/* Switch Branch & Logout */}
              <div className="flex items-center gap-1 border-r border-slate-200 pr-1.5 mr-0.5 sm:pr-2 sm:mr-1">
                <button
                  onClick={onOpenLoginModal}
                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition text-xs flex items-center gap-1 cursor-pointer"
                  title="تبديل الفرع"
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden xl:inline text-[11px] font-bold">الفرع</span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="تسجيل خروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop & Tablet Sub-Navigation */}
          <div className="hidden sm:flex items-center justify-between border-t border-slate-100 py-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => onSelectTab('queue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'queue'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🧺 طابور الطلبات</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'queue' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {orderMetrics.total}
                </span>
              </button>

              <button
                onClick={() => onSelectTab('intake')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'intake'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🔍 فحص الكاونتر</span>
                {orderMetrics.inspectionRequired > 0 && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                    {orderMetrics.inspectionRequired}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('approval')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'approval'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>⏳ موافقات الأسعار</span>
                {orderMetrics.awaitingCustomerApproval > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                    {orderMetrics.awaitingCustomerApproval}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'catalog'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>قائمة الأسعار والخدمات</span>
              </button>

              <button
                onClick={() => onSelectTab('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'revenue'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>💰 إيرادات الوردية</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">
                  {orderMetrics.todayNetEgp.toLocaleString()} ج.م
                </span>
              </button>

              <button
                onClick={() => onSelectTab('settings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>إعدادات الفرع</span>
              </button>
            </div>

            {/* Capacity Progress Bar */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">سعة اليوم:</span>
              <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    orderMetrics.occupancyPercent > 80
                      ? 'bg-rose-500'
                      : orderMetrics.occupancyPercent > 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${orderMetrics.occupancyPercent}%` }}
                />
              </div>
              <span className="font-bold font-mono text-[11px] text-slate-700">
                {orderMetrics.occupancyPercent}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation Bar (< 640px) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg flex items-center justify-around"
      >
        <button
          onClick={() => onSelectTab('queue')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition relative ${
            activeTab === 'queue' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>الطلبات</span>
          {orderMetrics.total > 0 && (
            <span className="absolute top-0 right-1 bg-sky-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {orderMetrics.total}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('intake')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition relative ${
            activeTab === 'intake' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>الفحص</span>
          {orderMetrics.inspectionRequired > 0 && (
            <span className="absolute top-0 right-1 bg-amber-500 text-slate-950 text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
              {orderMetrics.inspectionRequired}
            </span>
          )}
        </button>

        <button
          onClick={onOpenScannerModal}
          className="flex flex-col items-center -mt-4 bg-sky-500 hover:bg-sky-600 text-white p-2.5 rounded-full shadow-lg shadow-sky-500/30 cursor-pointer"
        >
          <QrCode className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectTab('catalog')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition ${
            activeTab === 'catalog' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>الأسعار</span>
        </button>

        <button
          onClick={() => onSelectTab('revenue')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition ${
            activeTab === 'revenue' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>الأرباح</span>
        </button>
      </nav>
    </>
  );
};
