import React from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Address } from '../../types';

export const AddressesScreen: React.FC = () => {
  const {
    language,
    t,
    addresses,
    deleteAddress,
    setDefaultAddress,
    navigateTo,
    setSelectedAddress
  } = useApp();

  const handleEdit = (addr: Address) => {
    setSelectedAddress(addr);
    navigateTo('address_form');
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black text-[#183247] mb-1">
            {t.myAddresses}
          </h1>
          <p className="text-xs text-[#718596]">
            {language === 'ar' ? 'إدارة أماكن استلام وتوصيل الملابس' : 'Manage your pickup & delivery addresses'}
          </p>
        </div>

        <button
          onClick={() => {
            // New address form
            navigateTo('address_form');
          }}
          className="px-3 py-1.5 bg-[#08BDF4] hover:bg-[#079FD0] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'إضافة عنوان' : 'Add Address'}</span>
        </button>
      </div>

      {/* Address cards list */}
      <div className="flex flex-col gap-3">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className={`p-4 bg-white rounded-3xl border transition shadow-2xs flex flex-col gap-3 ${
              addr.isDefault ? 'border-[#08BDF4] ring-1 ring-[#08BDF4]/20' : 'border-[#E5EEF4]'
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EAF8FF] flex items-center justify-center text-[#079FD0]">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#183247]">{addr.title}</h3>
                  <span className="text-[10px] text-[#718596] font-semibold">{addr.city}</span>
                </div>
              </div>

              {addr.isDefault ? (
                <span className="text-[10px] font-bold text-[#079FD0] bg-[#EAF8FF] px-2.5 py-0.5 rounded-full">
                  {language === 'ar' ? 'العنوان الافتراضي' : 'Default'}
                </span>
              ) : (
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  className="text-[10px] font-semibold text-[#718596] hover:text-[#08BDF4] cursor-pointer"
                >
                  {language === 'ar' ? 'تعيين كافتراضي' : 'Set as default'}
                </button>
              )}
            </div>

            {/* Address Details */}
            <div className="text-xs text-[#718596] leading-relaxed">
              <p className="text-[#183247] font-medium">
                {addr.street}، {addr.building}، {addr.floor}، {addr.apartment} ({addr.neighborhood})
              </p>
              {addr.landmark && (
                <p className="text-[#079FD0] text-[11px] mt-0.5">
                  علامة مميزة: {addr.landmark}
                </p>
              )}
              <p className="text-[11px] text-[#718596] mt-1">
                المستلم: {addr.contactName} ({addr.contactPhone})
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5EEF4]">
              {addresses.length > 1 && (
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#E55353] hover:bg-red-50 transition cursor-pointer"
                  title={t.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => handleEdit(addr)}
                className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-[#183247] border border-[#E5EEF4] rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-slate-600" />
                <span>{t.edit}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
