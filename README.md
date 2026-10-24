# عالسريع — Ala El Saree
### Premium On-Demand Mobile Laundry & Cleaning App for Egypt

**Ala El Saree (عالسريع)** is an Egyptian mobile application for laundry, ironing, dry cleaning, and doorstep pickup and delivery. The application connects customers across target Egyptian cities (Zagazig, Mansoura, 10th of Ramadan, and Cairo) with verified hotel-grade partner laundries.

---

## 📱 Features & Highlights

1. **True Mobile-First UX & Touch Ergonomics**:
   - Designed strictly for smartphone viewports with natural thumb reach zones, 44–48px touch targets, mobile status bar, and fixed bottom navigation.
   - Interactive preview frame toggle in desktop browsers: iPhone 16 Pro, Android, or Responsive fluid mode.
2. **Bilingual Localization (Arabic RTL & English LTR)**:
   - Full layout flipping with native `dir="rtl"` and `dir="ltr"` support.
   - Egyptian Pound pricing (`ج.م` / `EGP`), Cairo business hours, and Egyptian address hierarchies.
3. **Egyptian Phone & OTP Authentication**:
   - Phone validation for Egyptian telecom providers (Vodafone `010`, Etisalat `011`, Orange `012`, WE `015`).
   - OTP verification with test code helper (`1234`) and resend cooldown.
   - Guest mode for exploring services without registration.
4. **Complete 5-Destination Main Navigation**:
   - **الرئيسية (Home)**: Personalized greeting, address selector, promotional carousel, quick service shortcuts, live active order card, reorder shortcut.
   - **خدماتنا (Services)**: Searchable garment catalog with category filters and price lists.
   - **طلباتي (My Orders)**: History categorized into All, Active, Completed, and Cancelled, with reorder and rating shortcuts.
   - **العناوين (Addresses)**: Full Egyptian address management (City, Neighborhood, Street, Building, Floor, Apartment, Landmark).
   - **حسابي (Account)**: Profile details, language switcher, support center, terms, and account deletion.
5. **Garment & Service Customization**:
   - Tops, Bottoms, Traditional Wear (Jalabiya, Abaya, Isdal), Suits & Dresses, Bedding & Blankets, and Footwear care.
   - Custom care options: Washing & Ironing, Wash Only, Steam Iron, Dry Clean; Arabic Oud, Lavender, Breeze fragrances; starch levels; hangers vs folded packaging.
   - Persistent live bottom summary bar updating subtotal in real-time.
6. **Partner Laundries & Dynamic Scheduling**:
   - Certified partners in Zagazig, Mansoura, 10th of Ramadan, and Cairo with ratings and turnaround estimates.
   - Horizontally scrollable date pickers and Cairo operating time windows.
   - Express 6-hour delivery option (+30 EGP).
7. **Checkout & Real Local Payment**:
   - Promo coupon validation (`SAREE20` for 20% off, `FIRSTFREE` for free delivery, `RAMADAN25` for 25 EGP flat discount).
   - Payment methods: Cash on Delivery (COD), InstaPay / Vodafone Cash, and Card.
8. **Live 9-Stage Order Tracking Timeline**:
   - Step-by-step progress from order receipt to doorstep dropoff.
   - Assigned courier details with direct WhatsApp and phone call buttons.
   - Interactive development status advance simulator to preview any stage.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom brand tokens:
  - Primary Cyan: `#08BDF4`
  - Deep Cyan: `#079FD0`
  - Pale Cyan: `#F4FBFF`
  - Text: `#183247`
- **Typography**: Google Fonts `Tajawal` (Arabic) and `Plus Jakarta Sans` (English)
- **Icons**: Lucide Icons
- **State Management**: React Context (`AppContext`) with persistent `localStorage` cache for addresses, draft baskets, orders, and language.

---

## 🚀 Running the App

```bash
# Start development server
npm run dev

# Run TypeScript checks
npm run lint

# Build production bundle
npm run build
```

---

## 📦 Store Submission Checklist (Google Play & Apple App Store)

1. **App Identity**:
   - Bundle ID / Package Name: `com.alaelsaree.app`
   - Display Name: `عالسريع / Ala El Saree`
   - Version: `1.0.0` (Build 1)
2. **Permissions Required**:
   - Internet access (`android.permission.INTERNET`)
   - Location (Optional / coarse for nearby laundry discovery; fallback manual address entry supported)
   - Push Notifications (For courier arrival and status alerts)
3. **Capacitor / Expo Native Wrapper**:
   To bundle into native `.apk` / `.aab` (Android) and `.ipa` (iOS):
   ```bash
   npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
   npx cap init "Ala El Saree" "com.alaelsaree.app" --web-dir "dist"
   npm run build
   npx cap add android
   npx cap add ios
   npx cap open android
   ```
