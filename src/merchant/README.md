# Merchant Portal & Operations (Phase 3 Active)

The Merchant Portal for "عالسريع" (Ala El Saree) is fully implemented in `src/operations/`:
- **Port**: 3000 (`npm run dev`)
- **Key Modules**:
  - `src/operations/views/merchant/MerchantOverviewView.tsx`: Real-time KPIs, gross laundry volume, 8% commission deductions, net store earnings.
  - `src/operations/views/merchant/MerchantOrdersView.tsx`: Order intake inspection, garment item counting, stain/damage logs, extra charges with customer approval loop.
  - `src/operations/views/merchant/MerchantCatalogView.tsx`: Service catalog and pricing editor.
  - `src/operations/views/merchant/MerchantSettlementsView.tsx`: Payout ledger and bank/InstaPay statements.
  - `src/operations/views/merchant/MerchantSettingsView.tsx`: Daily bag intake capacity, working hours, and store info.

