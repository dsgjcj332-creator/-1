import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Crosshair,
  Search,
  Check,
  X,
  Loader2,
  Navigation
} from 'lucide-react';

export interface SelectedLocationData {
  lat: number;
  lng: number;
  city: string;
  neighborhood: string;
  street: string;
  fullAddress: string;
  gmapsLink: string;
}

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (data: SelectedLocationData) => void;
  initialLat?: number;
  initialLng?: number;
  title?: string;
}

// Egyptian governorates & cities parser helper
function parseEgyptianAddress(data: any): { city: string; neighborhood: string; street: string } {
  const addr = data.address || {};

  // Extract City
  const rawCity =
    addr.city ||
    addr.town ||
    addr.municipality ||
    addr.county ||
    addr.state ||
    '';

  let city = 'الزقازيق';
  if (rawCity.includes('الزقازيق') || rawCity.includes('Zagazig')) city = 'الزقازيق';
  else if (rawCity.includes('المنصورة') || rawCity.includes('Mansoura')) city = 'المنصورة';
  else if (rawCity.includes('القاهرة') || rawCity.includes('Cairo')) city = 'القاهرة';
  else if (rawCity.includes('العاشر') || rawCity.includes('10th')) city = 'العاشر من رمضان';
  else if (rawCity) city = rawCity;

  // Extract Neighborhood / Suburb
  const neighborhood =
    addr.suburb ||
    addr.neighbourhood ||
    addr.quarter ||
    addr.residential ||
    addr.city_district ||
    addr.district ||
    'وسط المدينة';

  // Extract Street
  const street =
    addr.road ||
    addr.street ||
    addr.pedestrian ||
    addr.path ||
    (data.name && data.name !== neighborhood ? data.name : '') ||
    'الشارع الرئيسي';

  return { city, neighborhood, street };
}

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  initialLat = 30.5877, // Zagazig default
  initialLng = 31.5020,
  title = 'تحديد الموقع على الخريطة'
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });
  const [addressDetails, setAddressDetails] = useState<{
    city: string;
    neighborhood: string;
    street: string;
    fullAddress: string;
  }>({
    city: 'الزقازيق',
    neighborhood: 'وسط المدينة',
    street: 'الشارع الرئيسي',
    fullAddress: 'جاري تحميل العنوان...'
  });

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Reverse geocode whenever coords change
  const fetchAddress = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      if (res.ok) {
        const data = await res.json();
        const parsed = parseEgyptianAddress(data);
        setAddressDetails({
          city: parsed.city,
          neighborhood: parsed.neighborhood,
          street: parsed.street,
          fullAddress: data.display_name || `${parsed.street}، ${parsed.neighborhood}، ${parsed.city}`
        });
      } else {
        setAddressDetails({
          city: 'الزقازيق',
          neighborhood: 'حي الجامعة',
          street: 'شارع السلام',
          fullAddress: `الموقع المحدد: (${lat.toFixed(4)}, ${lng.toFixed(4)})`
        });
      }
    } catch {
      setAddressDetails({
        city: 'الزقازيق',
        neighborhood: 'حي الجامعة',
        street: 'شارع السلام',
        fullAddress: `الموقع المحدد: (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 15,
        zoomControl: false
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Custom pulsing SVG pin icon
      const pinIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(8, 189, 244, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #08BDF4; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style="position: absolute; bottom: -6px; width: 10px; height: 10px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(2px);"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const marker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: pinIcon,
        draggable: true
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const lat = Number(pos.lat.toFixed(6));
        const lng = Number(pos.lng.toFixed(6));
        setCurrentCoords({ lat, lng });
        fetchAddress(lat, lng);
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        const lat = Number(e.latlng.lat.toFixed(6));
        const lng = Number(e.latlng.lng.toFixed(6));
        marker.setLatLng([lat, lng]);
        setCurrentCoords({ lat, lng });
        fetchAddress(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Initial fetch
      fetchAddress(currentCoords.lat, currentCoords.lng);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]);

  // GPS Locate me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('خدمة تحديد الموقع غير مدعومة في متصفحك');
      return;
    }
    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setIsLocatingGps(false);
        setCurrentCoords({ lat, lng });
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 17);
          markerRef.current.setLatLng([lat, lng]);
        }
        fetchAddress(lat, lng);
      },
      () => {
        setIsLocatingGps(false);
        alert('تعذر الوصول لموقعك الجغرافي. يمكنك النقر على الخريطة لتحديده يدوياً.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Search location
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim() + ' مصر'
        )}&accept-language=ar&limit=5`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch {
      // ignore
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setCurrentCoords({ lat, lng });
    setSearchResults([]);
    setSearchQuery('');
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
      markerRef.current.setLatLng([lat, lng]);
    }
    fetchAddress(lat, lng);
  };

  // Confirm selection
  const handleConfirm = () => {
    const gmapsLink = `https://www.google.com/maps?q=${currentCoords.lat},${currentCoords.lng}`;
    onSelectLocation({
      lat: currentCoords.lat,
      lng: currentCoords.lng,
      city: addressDetails.city,
      neighborhood: addressDetails.neighborhood,
      street: addressDetails.street,
      fullAddress: addressDetails.fullAddress,
      gmapsLink
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[720px] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAF8FF] flex items-center justify-center text-[#08BDF4]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#183247]">{title}</h3>
              <p className="text-[11px] text-[#718596]">انقر على أي نقطة بالخريطة أو اسحب العلامة لتحديد مكانك</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & GPS Button */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-col gap-2 shrink-0 z-10">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منطقة أو شارع (مثل: حي الجامعة الزقازيق)..."
                className="w-full h-10 pr-9 pl-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#08BDF4]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="px-3 h-10 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>بحث</span>}
            </button>

            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocatingGps}
              className="px-3 h-10 bg-[#EAF8FF] hover:bg-[#d6f2ff] text-[#079FD0] border border-[#08BDF4]/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
              title="تحديد موقعي الحالي"
            >
              {isLocatingGps ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Crosshair className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">موقعي الآن</span>
                </>
              )}
            </button>
          </form>

          {/* Search dropdown results */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-h-40 overflow-y-auto divide-y divide-slate-100 z-20">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full p-2.5 text-right text-xs hover:bg-[#EAF8FF] transition flex items-center gap-2 cursor-pointer text-slate-700"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#08BDF4] shrink-0" />
                  <span className="truncate">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Canvas Container */}
        <div className="flex-1 relative w-full h-full min-h-[260px] bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Hint */}
          <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md text-[11px] font-bold text-slate-700 border border-slate-200 flex items-center gap-1.5 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#08BDF4] animate-pulse"></span>
            <span>اسحب العلامة أو اضغط في أي مكان لتغيير المكان</span>
          </div>
        </div>

        {/* Bottom Auto-detected details & Confirm Action */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3 shrink-0 z-10">
          <div className="bg-[#F4FBFF] border border-[#E5EEF4] rounded-2xl p-3 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#08BDF4] text-white flex items-center justify-center shrink-0 mt-0.5">
              {isGeocoding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#183247]">{addressDetails.city}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-[#079FD0]">{addressDetails.neighborhood}</span>
              </div>
              <p className="text-[11px] text-[#718596] truncate mt-0.5">
                {isGeocoding ? 'جاري استخراج بيانات الشارع والمنطقة...' : addressDetails.fullAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 bg-[#08BDF4] hover:bg-[#079FD0] text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>تأكيد هذا الموقع وتعبئة العنوان تلقائياً</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
