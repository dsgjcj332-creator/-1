import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  X,
  Phone,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  Check
} from 'lucide-react';

export interface OrderChatMessage {
  id: string;
  orderId: string;
  sender: 'merchant' | 'customer';
  senderName: string;
  text: string;
  photoUrl?: string;
  timestamp: string;
  isPriceApprovalPrompt?: boolean;
  priceDifferenceEgp?: number;
}

interface OrderChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  merchantName: string;
  merchantPhone?: string;
  currentUserRole: 'merchant' | 'customer';
  currentUserName: string;
  discrepancy?: {
    reason?: string;
    differenceEgp?: number;
    customerApprovalStatus?: 'pending' | 'approved' | 'rejected';
  } | null;
  onApprovePriceAdjustment?: (approved: boolean) => void;
}

const CHAT_STORAGE_KEY = 'ala_el_saree_order_chats';

export const OrderChatModal: React.FC<OrderChatModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  customerName,
  customerPhone,
  merchantName,
  merchantPhone = '01012345671',
  currentUserRole,
  currentUserName,
  discrepancy,
  onApprovePriceAdjustment
}) => {
  const [messages, setMessages] = useState<OrderChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load chat messages from localStorage
  const loadMessages = () => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      const allChats: Record<string, OrderChatMessage[]> = raw ? JSON.parse(raw) : {};
      const orderMsgs = allChats[orderId] || [];

      // If empty and discrepancy exists, seed with initial price approval notification
      if (orderMsgs.length === 0 && discrepancy) {
        const initialMsg: OrderChatMessage = {
          id: `msg-seed-${orderId}`,
          orderId,
          sender: 'merchant',
          senderName: merchantName,
          text: `مرحباً ${customerName}، أثناء فحص الملابس على كاونتر المغسلة تبين وجود قطع تحتاج عناية إضافية: ${
            discrepancy.reason || 'إزالة بقع ومعالجة خاصة'
          }. مطلوب تعديل السعر بمقدار ${discrepancy.differenceEgp || 30} ج.م.`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          isPriceApprovalPrompt: true,
          priceDifferenceEgp: discrepancy.differenceEgp || 30
        };
        setMessages([initialMsg]);
        allChats[orderId] = [initialMsg];
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
        return;
      }

      setMessages(orderMsgs);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen, orderId]);

  // Real-time synchronization
  useEffect(() => {
    const handleChatSync = (e: any) => {
      if (e?.detail?.orderId === orderId || !e?.detail) {
        loadMessages();
      }
    };
    window.addEventListener('ala_el_saree_chat_updated', handleChatSync);
    window.addEventListener('storage', handleChatSync);
    return () => {
      window.removeEventListener('ala_el_saree_chat_updated', handleChatSync);
      window.removeEventListener('storage', handleChatSync);
    };
  }, [orderId]);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Send message
  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content && !attachedPhoto) return;

    const newMsg: OrderChatMessage = {
      id: `msg-${Date.now()}`,
      orderId,
      sender: currentUserRole,
      senderName: currentUserName,
      text: content,
      photoUrl: attachedPhoto || undefined,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      const allChats: Record<string, OrderChatMessage[]> = raw ? JSON.parse(raw) : {};
      const updatedOrderMsgs = [...(allChats[orderId] || []), newMsg];
      allChats[orderId] = updatedOrderMsgs;
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));

      setMessages(updatedOrderMsgs);
      setInputText('');
      setAttachedPhoto(null);

      window.dispatchEvent(
        new CustomEvent('ala_el_saree_chat_updated', {
          detail: { orderId, message: newMsg }
        })
      );
    } catch (e) {
      console.error('Failed to send chat message:', e);
    }
  };

  // Quick photo attachment
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setAttachedPhoto(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // WhatsApp link
  const targetPhone = currentUserRole === 'merchant' ? customerPhone : merchantPhone;
  const whatsappUrl = `https://wa.me/2${targetPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `السلام عليكم بخصوص طلب عالسريع #${orderNumber}، `
  )}`;

  // Quick message chips based on role
  const quickChips =
    currentUserRole === 'merchant'
      ? [
          'ملابسك وصلت المغسلة وبدأنا دورة الغسيل ✨',
          'يوجد بقعة صعبة ومحتاجين تأكيدك على التنظيف الخاص ⚠️',
          'طلبك مغلف وجاهز للتسليم مع المندوب 🛵',
          'تم الانتهاء بنجاح، نتمنى لك تجربة ممتعة ✓'
        ]
      : [
          'تمام، موافق على التعديل، اتفضل اغسل 👍',
          'شكراً لحضرتك، هل الطلب هيوصل في الموعد؟',
          'يرجى الاهتمام بكي القمصان بالبخار 🙏',
          'أنا في انتظار المندوب، شكراً لكم'
        ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full h-[88vh] max-h-[660px] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm shrink-0 border border-sky-400/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xs sm:text-sm text-white">
                  {currentUserRole === 'merchant' ? `محادثة العميل: ${customerName}` : `محادثة المغسلة: ${merchantName}`}
                </h3>
                <span className="text-[10px] bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded-full font-mono">
                  {orderNumber}
                </span>
              </div>
              <span className="text-[10px] text-slate-300 block">
                تواصل مباشر فوري لمتابعة تفاصيل الفحص وتعديل الأسعار
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {targetPhone && (
              <>
                <a
                  href={`tel:${targetPhone}`}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-emerald-400 transition"
                  title="اتصال هاتفي"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white transition"
                  title="محادثة واتساب"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price Adjustment Action Banner if pending */}
        {discrepancy && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-amber-900">تعديل كاونتر مطلوب: </span>
                <span className="text-amber-800 font-semibold">
                  {discrepancy.reason || 'معالجة بقع وعناية خاصة'} (+{discrepancy.differenceEgp || 30} ج.م)
                </span>
              </div>
            </div>

            {currentUserRole === 'customer' && onApprovePriceAdjustment && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onApprovePriceAdjustment(true);
                    handleSendMessage('تمت الموافقة على تعديل السعر، يرجى متابعة الغسيل بنجاح ✓');
                  }}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <Check className="w-3 h-3" />
                  <span>موافقة</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApprovePriceAdjustment(false);
                    handleSendMessage('تم رفض تعديل السعر، يرجى استرجاع القطعة بدون غسيل.');
                  }}
                  className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  رفض
                </button>
              </div>
            )}
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MessageCircle className="w-10 h-10 mb-2 text-slate-300 stroke-1" />
              <p className="text-xs font-bold text-slate-600">لا توجد رسائل سابقة في هذا الطلب</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                يمكنك إرسال استفسار أو تنبيه حول فحص الملابس أو مواعيد الاستلام والتسليم
              </p>
            </div>
          ) : (
            messages.map(msg => {
              const isMine = msg.sender === currentUserRole;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                    {msg.senderName}
                  </span>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-xs text-xs leading-relaxed ${
                      isMine
                        ? 'bg-[#08BDF4] text-white rounded-tl-none font-medium'
                        : 'bg-white text-[#183247] border border-slate-200 rounded-tr-none'
                    }`}
                  >
                    {msg.photoUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-black/10 bg-black/5 max-h-48">
                        <img
                          src={msg.photoUrl}
                          alt="مرفق توضيحي"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div
                      className={`text-[9px] mt-1 text-left ${
                        isMine ? 'text-white/80' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Message Chips */}
        <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="shrink-0 text-[10px] bg-slate-100 hover:bg-[#EAF8FF] hover:text-[#079FD0] text-slate-600 font-bold px-2.5 py-1 rounded-full border border-slate-200 transition cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Attached Photo Preview */}
        {attachedPhoto && (
          <div className="p-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <img
                src={attachedPhoto}
                alt="المرفق"
                className="w-10 h-10 rounded-lg object-cover border border-slate-300"
              />
              <span className="text-[11px] font-bold text-slate-700">صورة جاهزة للإرسال مع الرسالة</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedPhoto(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
            >
              إلغاء الصورة
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
            title="إرفاق صورة توضيحية للملابس أو البقعة"
          >
            <Camera className="w-5 h-5 text-slate-500" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium focus:outline-none focus:border-[#08BDF4] transition"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() && !attachedPhoto}
            className="w-10 h-10 rounded-xl bg-[#08BDF4] hover:bg-[#079FD0] disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shrink-0 active:scale-95 shadow-xs"
          >
            <Send className="w-4 h-4 -scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
};
