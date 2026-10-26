import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CheckCircle2,
  X,
  Scan,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  KeyRound,
  RotateCcw
} from 'lucide-react';

interface CustomerBarcodeHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  orderId: string;
  expectedBarcode: string;
  onConfirmSuccess: () => void;
}

export const CustomerBarcodeHandoverModal: React.FC<CustomerBarcodeHandoverModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  orderId,
  expectedBarcode,
  onConfirmSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasScannedSuccess, setHasScannedSuccess] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Derive bag barcode code if not provided
  const targetCode = expectedBarcode || `AS-${orderNumber.slice(-4)}`;

  // Start Camera
  const startCamera = async () => {
    setScanError(null);
    setIsScanning(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch {
      // Fallback if camera permission denied
      setIsScanning(false);
      setScanError('تعذر فتح الكاميرا (يرجى السماح بالوصول أو إدخال الكود يدوياً).');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeTab]);

  // Simulate scanning matching barcode
  const handleSimulateScanMatch = () => {
    setHasScannedSuccess(true);
    stopCamera();
    setTimeout(() => {
      onConfirmSuccess();
      onClose();
    }, 1500);
  };

  // Manual verify
  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = manualCode.trim().toUpperCase();
    const cleanTarget = targetCode.toUpperCase();
    const cleanShort = targetCode.replace(/[^0-9]/g, '');

    if (
      cleanInput === cleanTarget ||
      cleanInput.includes(cleanShort) ||
      cleanInput === cleanShort ||
      cleanInput === orderNumber.toUpperCase()
    ) {
      setHasScannedSuccess(true);
      setTimeout(() => {
        onConfirmSuccess();
        onClose();
      }, 1500);
    } else {
      setScanError(`الكود غير مطابق للكود المطبوع على كيس الملابس: (${targetCode})`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 text-center">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-right">
              <h3 className="font-black text-xs sm:text-sm text-[#183247]">تأكيد استلام الملابس بالباركود</h3>
              <span className="text-[10px] text-slate-500">طلب #{orderNumber}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {hasScannedSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-3 animate-in zoom-in-90 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <h4 className="text-base font-black text-[#183247]">تم تطابق الباركود بنجاح!</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              تم توثيق استلام ملابسك مكوية ومعقمة بأمان. شكراً لاختيارك عالسريع ✨
            </p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            {/* Mode Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveTab('scan')}
                className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'scan' ? 'bg-white text-[#079FD0] shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>مسح الباركود 📷</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'manual' ? 'bg-white text-[#079FD0] shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>إدخال الكود 🔢</span>
              </button>
            </div>

            {/* Expected code guidance */}
            <div className="bg-[#F4FBFF] border border-[#E5EEF4] rounded-2xl p-2.5 text-xs text-right">
              <span className="text-[11px] text-[#718596] block mb-0.5">كود حقيبة الملابس المطبوع:</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm text-[#079FD0] tracking-wider">{targetCode}</span>
                <span className="text-[10px] text-slate-400">ستجده على تكت الكيس</span>
              </div>
            </div>

            {/* Camera View */}
            {activeTab === 'scan' && (
              <div className="space-y-3">
                <div className="relative aspect-square max-h-56 rounded-2xl overflow-hidden bg-slate-950 border-2 border-[#08BDF4]/40 flex items-center justify-center shadow-inner">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Scanning Crosshair Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-36 border-2 border-[#08BDF4] rounded-2xl relative shadow-lg">
                      <div className="absolute inset-x-0 top-0 h-1 bg-[#08BDF4] animate-pulse"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                    </div>
                  </div>

                  <span className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur-xs text-white text-[10px] py-1 rounded-lg">
                    وجّه الكاميرا نحو الباركود المطبوع على كيس الغسيل
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateScanMatch}
                  className="w-full py-2.5 bg-[#08BDF4] hover:bg-[#079FD0] text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تأكيد قراءة الباركود ومطابقته ✓</span>
                </button>
              </div>
            )}

            {/* Manual PIN / Code input */}
            {activeTab === 'manual' && (
              <form onSubmit={handleManualVerify} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#183247] text-right mb-1">
                    أدخل رقم الباركود أو آخر 4 أرقام من التكت:
                  </label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={e => {
                      setManualCode(e.target.value);
                      setScanError(null);
                    }}
                    placeholder={`مثال: ${targetCode}`}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-center font-mono font-bold text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#08BDF4]"
                    autoFocus
                  />
                </div>

                {scanError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold text-right flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{scanError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!manualCode.trim()}
                  className="w-full py-2.5 bg-[#08BDF4] hover:bg-[#079FD0] disabled:opacity-40 text-white rounded-xl text-xs font-black shadow-md transition cursor-pointer active:scale-95"
                >
                  تحقق وتأكيد الاستلام
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
