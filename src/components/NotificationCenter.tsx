import React, { useState } from 'react';
import { User, PriceAlertNotification } from '../types';
import { useCMS } from '../CMSContext';
import { X, Bell, BellOff, Mail, MessageSquare, Trash2, CheckCircle, Clock, TrendingDown, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationCenterProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ currentUser, isOpen, onClose }) => {
  const { markNotificationsRead, updateAlertProfile } = useCMS();
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  
  // Settings local state
  const [email, setEmail] = useState(currentUser.email || '');
  const [whatsappEnabled, setWhatsappEnabled] = useState(currentUser.whatsappEnabled ?? true);
  const [emailEnabled, setEmailEnabled] = useState(currentUser.emailEnabled ?? false);
  const [isSaving, setIsSaving] = useState(false);

  const notifications = currentUser.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateAlertProfile({ email, whatsappEnabled, emailEnabled });
    setIsSaving(false);
  };

  const handleMarkRead = async () => {
    if (unreadCount > 0) {
      await markNotificationsRead();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end sm:p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-full max-w-md h-full sm:h-[90vh] bg-neutral-900 border-l sm:border border-neutral-800 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">مركز التنبيهات والذكاء المالي</h2>
                  <p className="text-[10px] text-neutral-500 font-bold">إدارة تنبيهات الأسعار والعوائد الاستثمارية</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-800">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-3 text-xs font-black transition-all border-b-2 ${
                  activeTab === 'notifications' 
                    ? 'border-indigo-500 text-white bg-indigo-500/5' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                التنبيهات ({unreadCount})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-3 text-xs font-black transition-all border-b-2 ${
                  activeTab === 'settings' 
                    ? 'border-indigo-500 text-white bg-indigo-500/5' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                إعدادات التواصل
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {activeTab === 'notifications' ? (
                <div className="space-y-4">
                  {notifications.length > 0 && unreadCount > 0 && (
                    <button 
                      onClick={handleMarkRead}
                      className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors mb-2 block"
                    >
                      تحديد الكل كمقروء ✓
                    </button>
                  )}
                  
                  {notifications.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-600">
                        <BellOff className="w-8 h-8" />
                      </div>
                      <p className="text-xs text-neutral-500 font-bold">لا يوجد تنبيهات حالية. تابع استثماراتك لتصلك التحديثات.</p>
                    </div>
                  ) : (
                    <motion.div 
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                      className="space-y-4"
                    >
                      {notifications.map((n) => (
                        <motion.div 
                          key={n.id} 
                          variants={{
                            hidden: { opacity: 0, x: 20 },
                            show: { opacity: 1, x: 0 }
                          }}
                          className={`p-4 rounded-2xl border transition-all ${
                            n.read ? 'bg-neutral-900/30 border-neutral-800 opacity-60' : 'bg-indigo-500/5 border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                          }`}
                        >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 p-2 rounded-lg ${n.type === 'price_drop' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {n.type === 'price_drop' ? <TrendingDown className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-xs font-black text-white">{n.productTitle}</h4>
                              {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
                            </div>
                            <p className="text-[11px] text-neutral-400 font-medium mb-3">
                              نحيطك علماً بأن {n.type === 'price_drop' ? 'سعر' : 'عوائد'} هذا المنتج قد انخفضت من <span className="font-black text-white">{n.oldValue}</span> إلى <span className="font-black text-indigo-400">{n.newValue}</span> مما قد يشكل فرصة شراء أو استلزام متابعة.
                            </p>
                            <div className="flex items-center gap-2 text-[9px] text-neutral-600 font-bold">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(n.timestamp).toLocaleString('ar-EG')}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                </div>
              ) : (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                    <p className="text-xs text-indigo-400 font-black leading-relaxed">
                      اختر وسيلة التواصل التي تفضل تلقي التحديثات والفرص الاستثمارية من خلالها لضمان عدم فوات أفضل العروض.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* WhatsApp Setting */}
                    <div className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white">تنبيهات رسائل واتساب</h4>
                          <p className="text-[10px] text-neutral-500 font-medium">عبر الرقم {currentUser.phone}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                        className={`w-10 h-5 rounded-full relative transition-all ${whatsappEnabled ? 'bg-emerald-500' : 'bg-neutral-800'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${whatsappEnabled ? 'right-6' : 'right-1'}`} />
                      </button>
                    </div>

                    {/* Email Setting */}
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-all space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white">تنبيهات البريد الإلكتروني</h4>
                            <p className="text-[10px] text-neutral-500 font-medium">رسائل دورية بالعروض المتابعة</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEmailEnabled(!emailEnabled)}
                          className={`w-10 h-5 rounded-full relative transition-all ${emailEnabled ? 'bg-indigo-500' : 'bg-neutral-800'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${emailEnabled ? 'right-6' : 'right-1'}`} />
                        </button>
                      </div>

                      {emailEnabled && (
                        <div className="pt-2 animate-in slide-in-from-top-2 duration-150">
                          <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="username@example.com"
                            className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 text-left focus:outline-none placeholder-neutral-600"
                            dir="ltr"
                            required={emailEnabled}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:bg-neutral-800 disabled:text-neutral-500"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span>حفظ تفضيلات التواصل بنجاح</span>
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-center">
              <p className="text-[9px] text-neutral-600 font-black">نظام شوجر بيزنس المتطور للحماية والتنبيهات © ٢٠٢٦</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
