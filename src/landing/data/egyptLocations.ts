export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  cities: { id: string; nameAr: string; nameEn: string }[];
}

export const EGYPT_GOVERNORATES: Governorate[] = [
  {
    id: 'sharqia',
    nameAr: 'الشرقية',
    nameEn: 'Al Sharqia',
    cities: [
      { id: 'zagazig', nameAr: 'الزقازيق', nameEn: 'Zagazig' },
      { id: '10th_ramadan', nameAr: 'العاشر من رمضان', nameEn: '10th of Ramadan' },
      { id: 'bilbeis', nameAr: 'بلبيس', nameEn: 'Bilbeis' },
      { id: 'minya_qamh', nameAr: 'منيا القمح', nameEn: 'Minya El Qamh' },
      { id: 'fakous', nameAr: 'فاقوس', nameEn: 'Faqous' }
    ]
  },
  {
    id: 'dakahlia',
    nameAr: 'الدقهلية',
    nameEn: 'Dakahlia',
    cities: [
      { id: 'mansoura', nameAr: 'المنصورة', nameEn: 'Mansoura' },
      { id: 'talkha', nameAr: 'طلخا', nameEn: 'Talkha' },
      { id: 'mit_ghamr', nameAr: 'ميت غمر', nameEn: 'Mit Ghamr' },
      { id: 'sinbillawin', nameAr: 'السنبلاوين', nameEn: 'Sinbillawin' }
    ]
  },
  {
    id: 'cairo',
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    cities: [
      { id: 'nasr_city', nameAr: 'مدينة نصر', nameEn: 'Nasr City' },
      { id: 'new_cairo', nameAr: 'التجمع الخامس والقاهرة الجديدة', nameEn: 'New Cairo & 5th Settlement' },
      { id: 'heliopolis', nameAr: 'مصر الجديدة', nameEn: 'Heliopolis' },
      { id: 'maadi', nameAr: 'المعادي', nameEn: 'Maadi' },
      { id: 'shorouk', nameAr: 'الشروق وبدر', nameEn: 'Al Shorouk & Badr' },
      { id: 'rehab_madinaty', nameAr: 'الرحاب ومدينتي', nameEn: 'Al Rehab & Madinaty' }
    ]
  },
  {
    id: 'giza',
    nameAr: 'الجيزة',
    nameEn: 'Giza',
    cities: [
      { id: 'dokki_mohandessin', nameAr: 'الدقي والمهندسين', nameEn: 'Dokki & Mohandessin' },
      { id: '6th_october', nameAr: 'السادس من أكتوبر', nameEn: '6th of October' },
      { id: 'sheikh_zayed', nameAr: 'الشيخ زايد', nameEn: 'Sheikh Zayed' },
      { id: 'haram', nameAr: 'الهرم وفيصل', nameEn: 'Haram & Faisal' }
    ]
  },
  {
    id: 'qalyubia',
    nameAr: 'القليوبية',
    nameEn: 'Qalyubia',
    cities: [
      { id: 'banha', nameAr: 'بنها', nameEn: 'Banha' },
      { id: 'obour', nameAr: 'العبور', nameEn: 'Al Obour' },
      { id: 'shubra_kheima', nameAr: 'شبرا الخيمة', nameEn: 'Shubra El Kheima' }
    ]
  },
  {
    id: 'alexandria',
    nameAr: 'الإسكندرية',
    nameEn: 'Alexandria',
    cities: [
      { id: 'smoha', nameAr: 'سموحة وسيدي جابر', nameEn: 'Smouha & Sidi Gaber' },
      { id: 'miami', nameAr: 'ميامي وسيدي بشر', nameEn: 'Miami & Sidi Bishr' },
      { id: 'loran', nameAr: 'لوران وجليم', nameEn: 'Loran & Glim' }
    ]
  }
];
