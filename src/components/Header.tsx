import React, { useState, useEffect } from 'react';
import { Menu, X, Landmark, Percent, MessageSquare, PhoneCall, Sun, Moon, ChevronDown, Compass, LayoutGrid, Calculator as CalcIcon, Briefcase, LogIn, UserPlus, LogOut, UserCheck, Settings, RotateCcw, Check, ShieldCheck, ShieldAlert, KeyRound, Sparkles, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';
import { useCMS } from '../CMSContext';
import { User } from '../types';
import { ImageUploader } from './ImageUploader';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  activePage: 'home' | 'services' | 'support' | 'governorates' | 'shop' | 'my-orders';
  onChangePage: (page: 'home' | 'services' | 'support' | 'governorates' | 'shop' | 'my-orders') => void;
  onOpenContact: () => void;
  onOpenEmployment?: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Logo: React.FC<{ className?: string }> = ({ className = "h-11" }) => {
  const cms = useCMS();
  const [showConfig, setShowConfig] = useState(false);
  
  // Safe helper to grab the active user session from cache
  const currentUser: User | null = (() => {
    try {
      const saved = localStorage.getItem('sugar_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  // Custom states from the persistent DB/translations layer
  const iconType = cms.t('logo_icon_type', 'default');
  const customSvg = cms.t('logo_icon_svg_content', `<rect x="21" y="52" width="16" height="34" rx="8" transform="rotate(-40 29 69)" />\n<path d="M 22 46 C 16 32, 25 18, 41 16 L 72 24" />\n<path d="M 50 32 L 72 24 L 64 46" />`);
  const imageUrl = cms.t('logo_icon_image_url', '');
  const strokeColor = cms.t('logo_icon_stroke', '#25C1F2');
  const bgColor = cms.t('logo_icon_bg', '#0A0F14');

  // Temporary edit states
  const [tempType, setTempType] = useState(iconType);
  const [tempSvg, setTempSvg] = useState(customSvg);
  const [tempUrl, setTempUrl] = useState(imageUrl);
  const [tempStroke, setTempStroke] = useState(strokeColor);
  const [tempBg, setTempBg] = useState(bgColor);

  const isEditMode = cms.isEditModeEnabled;

  useEffect(() => {
    setTempType(iconType);
    setTempSvg(customSvg);
    setTempUrl(imageUrl);
    setTempStroke(strokeColor);
    setTempBg(bgColor);
  }, [iconType, customSvg, imageUrl, strokeColor, bgColor, showConfig]);

  const handleOpen = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    e.preventDefault();
    setShowConfig(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await cms.updateTranslation('logo_icon_type', tempType);
    await cms.updateTranslation('logo_icon_svg_content', tempSvg);
    await cms.updateTranslation('logo_icon_image_url', tempUrl);
    await cms.updateTranslation('logo_icon_stroke', tempStroke);
    await cms.updateTranslation('logo_icon_bg', tempBg);
    setShowConfig(false);
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('هل تريد استعادة شعار شوجر بيزنس الذكي الافتراضي التفاعلي؟')) {
      await cms.updateTranslation('logo_icon_type', 'default');
      await cms.updateTranslation('logo_icon_svg_content', `<rect x="21" y="52" width="16" height="34" rx="8" transform="rotate(-40 29 69)" />\n<path d="M 22 46 C 16 32, 25 18, 41 16 L 72 24" />\n<path d="M 50 32 L 72 24 L 64 46" />`);
      await cms.updateTranslation('logo_icon_image_url', '');
      await cms.updateTranslation('logo_icon_stroke', '#25C1F2');
      await cms.updateTranslation('logo_icon_bg', '#0A0F14');
      setShowConfig(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} dir="ltr">
      {/* Brand Text: Stylized trademark exactly as in the photo */}
      <div className="flex flex-col items-center text-center leading-none gap-1 select-none" dir="ltr">
        <div className="flex flex-row items-center justify-center select-none font-sans text-[#25C1F2] h-[22px] md:h-6" dir="ltr">
          <span className="text-lg md:text-xl font-black text-[#25C1F2] leading-none">S</span>
          {/* Custom stretched 'u' trough underline connector representing the stylized letter */}
          <svg viewBox="0 0 50 20" className="h-[10px] md:h-[12px] w-8 md:w-10 mx-[1px]" stroke="#25C1F2" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 2 2 L 2 12 Q 2 18, 8 18 L 42 18 Q 48 18, 48 12 L 48 2" />
          </svg>
          <span className="text-lg md:text-xl font-black text-[#25C1F2] leading-none">gar</span>
        </div>
        <span className="text-[11px] md:text-xs font-bold text-[#25C1F2] tracking-[0.08em] mt-0.5 font-sans uppercase">
          business
        </span>
      </div>

      {/* Brand Icon: Clean square input wrapper which acts as editable slot for admin */}
      <div 
        onClick={handleOpen}
        style={{ backgroundColor: bgColor }}
        className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-300 relative group ${
          isEditMode 
            ? 'border-dashed border-indigo-400 hover:border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] ring-2 ring-indigo-500/50 cursor-pointer' 
            : 'border-[#25C1F2]/25 shadow-[0_0_12px_rgba(37,193,242,0.1)]'
        }`}
        title={isEditMode ? "تعديل الشعار الذكي (خاص بالمسؤول الرئيسي)" : undefined}
      >
        {iconType === 'image_url' && imageUrl ? (
          <img src={imageUrl} alt="Sugar" className="w-8.5 h-8.5 object-contain rounded-lg" referrerPolicy="no-referrer" />
        ) : iconType === 'custom_svg' ? (
          <svg viewBox="0 0 100 100" className="w-9 h-9" fill="none" stroke={strokeColor} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: customSvg }} />
        ) : (
          <svg viewBox="0 0 100 100" className="w-9 h-9" fill="none" stroke={strokeColor} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Slanted Capsule/Pill representing sugar - tilted 40 deg */}
            <rect x="21" y="52" width="16" height="34" rx="8" transform="rotate(-40 29 69)" />
            
            {/* Slanted Arrow-Hook - smooth continuous interlocking line */}
            <path d="M 22 46 C 16 32, 25 18, 41 16 L 72 24" />
            {/* Arrowhead wings symmetrically pointing up-right at 45 degrees */}
            <path d="M 50 32 L 72 24 L 64 46" />
          </svg>
        )}

        {/* Small Admin Edit Tooltip indicator inside the square */}
        {isEditMode && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md">
            <Settings className="w-2.5 h-2.5 animate-spin duration-3000" />
          </span>
        )}
      </div>

      {/* Admin Quick Logo Customizer Dialog */}
      {showConfig && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans text-right" dir="rtl" onClick={(e) => e.stopPropagation()}>
          <div className="bg-[#0f1216] border border-neutral-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
              <h3 className="text-md font-black text-white flex items-center gap-2">
                <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Settings className="w-4 h-4" />
                </span>
                تعديل شعار السهم (خاص بالمسؤول الرئيسي)
              </h3>
              <button 
                type="button"
                onClick={() => setShowConfig(false)}
                className="text-neutral-400 hover:text-white p-1 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Type selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">مصدر الشعار المرئي:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTempType('default')}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      tempType === 'default'
                        ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400 shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    شعار شوجر الافتراضي
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempType('custom_svg')}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      tempType === 'custom_svg'
                        ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400 shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    كود SVG مخصص
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempType('image_url')}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      tempType === 'image_url'
                        ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400 shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    رابط صورة خارجية
                  </button>
                </div>
              </div>

              {/* Custom SVG Inputs */}
              {tempType === 'custom_svg' && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
                  <label className="text-xs font-bold text-neutral-300 block">كود عناصر الـ SVG الداخلية:</label>
                  <textarea
                    value={tempSvg}
                    onChange={(e) => setTempSvg(e.target.value)}
                    className="w-full h-20 bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-[10px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-normal text-left"
                    placeholder="<path d='...' />"
                    dir="ltr"
                  />
                  <span className="text-[9px] text-neutral-500 block">يرسم داخل صندوق الحجم 100x100</span>
                </div>
              )}

              {/* Custom Image Input - Supports File Upload & Manual Links */}
              {tempType === 'image_url' && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150 text-right">
                  <ImageUploader
                    value={tempUrl}
                    onChange={setTempUrl}
                    label="صورة الشعار المخصص (تحميل ملف أو رابط):"
                    adminPhone={currentUser?.phone}
                    placeholder="تحميل صورة الشعار المتميز..."
                  />
                </div>
              )}

              {/* Styling details */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 block">لون الشعار (Stroke):</label>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={tempStroke}
                      onChange={(e) => setTempStroke(e.target.value)}
                      className="w-6 h-6 rounded border border-neutral-800 bg-transparent cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={tempStroke}
                      onChange={(e) => setTempStroke(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-1.5 py-0.5 text-[10px] text-center shrink-0 font-mono text-white"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 block">خلفية المربع (Bg):</label>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={tempBg}
                      onChange={(e) => setTempBg(e.target.value)}
                      className="w-6 h-6 rounded border border-neutral-800 bg-transparent cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={tempBg}
                      onChange={(e) => setTempBg(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-1.5 py-0.5 text-[10px] text-center shrink-0 font-mono text-white"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Dialog action buttons */}
              <div className="flex items-center justify-between gap-1.5 pt-3 border-t border-neutral-850">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-rose-500/15"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>الافتراضي</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-black transition-all cursor-pointer shadow-md inline-flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>حفظ التعديل</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ 
  activePage, 
  onChangePage, 
  onOpenContact, 
  onOpenEmployment,
  currentUser,
  onLogout,
  onOpenAuth
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const cms = useCMS();
  const isMainAdmin = currentUser?.role === 'admin' && currentUser?.phone === '01026541250';

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = currentUser?.notifications?.filter(n => !n.read).length || 0;

  // State values for supervisor add modal
  const [showSuperModal, setShowSuperModal] = useState(false);
  const [superName, setSuperName] = useState('');
  const [superPhone, setSuperPhone] = useState('');
  const [superPassword, setSuperPassword] = useState('');
  const [superUsername, setSuperUsername] = useState('');
  const [superNationalId, setSuperNationalId] = useState('');
  const [superCode, setSuperCode] = useState('');
  const [superRole, setSuperRole] = useState<'admin' | 'supervisor2'>('admin');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);

  const handleAddSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMainAdmin) return;
    setLoadingForm(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (superPhone.length < 11) {
      setErrorMsg('يجب أن يتكون رقم هاتف تسجيل الدخول من 11 رقماً على الأقل.');
      setLoadingForm(false);
      return;
    }

    try {
      const ok = await cms.addAdmin(
        superPhone,
        superName,
        superNationalId || '29800000000000',
        superPassword,
        superRole,
        superUsername,
        superCode
      );

      if (ok) {
        setSuccessMsg(`تمت إضافة وتفعيل المشرف بنجاح وتكويده بالمنظومة: ${superName}`);
        setSuperName('');
        setSuperPhone('');
        setSuperPassword('');
        setSuperUsername('');
        setSuperNationalId('');
        setSuperCode('');
      } else {
        setErrorMsg('حدث خطأ أثناء إجراء الإضافة والمطابقة. يرجى التأكد من عدم تكرار الهاتف.');
      }
    } catch {
      setErrorMsg('حدث خطأ فني غير معروف.');
    } finally {
      setLoadingForm(false);
    }
  };

  // Register custom telemetry to track user log-in times and page entries in the CMS DB
  useEffect(() => {
    if (currentUser) {
      cms.submitTrackingEvent(
        'page_view',
        currentUser.phone,
        `دخول المستخدم: ${currentUser.name}`,
        'login_entry'
      );
    }
  }, [currentUser]);

  const handlePageSelect = (page: 'home' | 'services' | 'support' | 'governorates' | 'shop' | 'my-orders') => {
    if (currentUser) {
      cms.submitTrackingEvent(
        'item_click',
        page,
        `تفضيل تصفح قسم: ${page}`,
        'navigation_preference'
      );
    }
    onChangePage(page);
    setIsOpen(false);
    setOptionsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubScroll = (page: 'home' | 'services' | 'support' | 'governorates' | 'shop' | 'my-orders', elementId: string) => {
    if (currentUser) {
      cms.submitTrackingEvent(
        'item_click',
        `${page}#${elementId}`,
        `تصفح قسم فرعي: ${page} - ${elementId}`,
        'navigation_preference'
      );
    }
    onChangePage(page);
    setIsOpen(false);
    setOptionsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const pendingUsersCount = cms.users.filter(u => !u.approved && !u.isBlocked && !u.isInactive).length;
  const pendingRecruitmentCount = (cms.recruitmentRequests || []).filter((r: any) => r.status === 'pending').length;
  const pendingServiceAddCount = (cms.serviceAdditionRequests || []).filter((r: any) => r.status === 'pending').length;
  const pendingPasswordResetsCount = (cms.passwordResetRequests || []).filter((r: any) => r.status === 'pending').length;
  const pendingOrdersCount = (cms.orders || []).filter((o: any) => o.status === 'pending').length;

  const totalAdminAlerts = pendingUsersCount + pendingRecruitmentCount + pendingServiceAddCount + pendingPasswordResetsCount + pendingOrdersCount;

  const isAdminOrSupervisor = currentUser?.role === 'admin' || currentUser?.role === 'supervisor2';

  return (
    <header className="sticky top-0 z-50 bg-[#0F0F0F]/65 backdrop-blur-xl border-b border-neutral-800 shadow-lg transition-all duration-300">
      {/* Real-time Administrative Telemetry Counter Bar */}
      {isAdminOrSupervisor && (
        <div className="bg-neutral-950 border-b border-neutral-850 px-4 py-2 text-[10px] text-neutral-400 select-none animate-in slide-in-from-top-4 duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 font-sans" dir="rtl">
            <div className="flex items-center gap-1.5 font-black text-indigo-400 shrink-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>مؤشرات رصد الأعضاء الفورية (خاص بالإدارة والمدير) 📊</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[10.5px]">
              <div className="bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
                <span className="text-neutral-400">👤 إجمالي الأعضاء:</span>
                <span className="font-extrabold text-indigo-400 font-mono text-xs">{cms.users.length}</span>
              </div>

              <div className="bg-emerald-950/25 border border-emerald-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
                <span className="text-emerald-400 font-bold">🟢 النشطين:</span>
                <span className="font-extrabold text-[#10B981] font-mono text-xs">
                  {cms.users.filter(u => u.approved && !u.isBlocked).length}
                </span>
              </div>

              <div className="bg-amber-950/25 border border-amber-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
                <span className="text-amber-400 font-bold">🟡 الخاملين:</span>
                <span className="font-extrabold text-amber-400 font-mono text-xs">
                  {cms.users.filter(u => u.isInactive).length}
                </span>
              </div>

              <div className="bg-rose-950/25 border border-rose-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
                <span className="text-rose-400 font-bold">🚫 المحظورين/المجمدين:</span>
                <span className="font-extrabold text-rose-400 font-mono text-xs">
                  {cms.users.filter(u => u.isBlocked).length}
                </span>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
                <span className="text-neutral-300 font-bold">⏳ قيد الانتظار:</span>
                <span className="font-extrabold text-zinc-300 font-mono text-xs">
                  {cms.users.filter(u => !u.approved && !u.isBlocked && !u.isInactive).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Right Section: Brand Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handlePageSelect('home')}>
            <Logo />
          </div>

          {/* Center Section: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5 space-x-reverse text-sm font-medium">
            <button
              onClick={() => handlePageSelect('home')}
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                activePage === 'home'
                  ? 'bg-indigo-500/15 text-indigo-400 font-extrabold border border-indigo-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => handleSubScroll('home', 'about')}
              className="px-3.5 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl text-xs transition-colors"
            >
              من نحن؟
            </button>
            <button
              onClick={() => handleSubScroll('home', 'features')}
              className="px-3.5 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl text-xs transition-colors"
            >
              عوامل النجاح
            </button>

            <span className="text-neutral-700 font-normal">|</span>

            <button
              onClick={() => handlePageSelect('services')}
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                activePage === 'services'
                  ? 'bg-indigo-500/15 text-indigo-400 font-extrabold border border-indigo-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              الخدمات والقطاعات
            </button>

            <span className="text-neutral-700 font-normal">|</span>

            <button
              onClick={() => handlePageSelect('shop')}
              className={`px-3.5 py-2 rounded-xl transition-all duration-205 cursor-pointer flex items-center gap-1.5 ${
                activePage === 'shop'
                  ? 'bg-indigo-500/15 text-indigo-400 font-extrabold border border-indigo-500/20'
                  : 'text-[#25C1F2] hover:text-white hover:bg-neutral-800 font-bold'
              }`}
            >
              <span>المتجر الإلكتروني 🛒</span>
            </button>

            {currentUser && (
              <>
                <span className="text-neutral-700 font-normal">|</span>
                <button
                  onClick={() => handlePageSelect('my-orders')}
                  className={`px-3.5 py-2 rounded-xl transition-all duration-205 cursor-pointer ${
                    activePage === 'my-orders'
                      ? 'bg-indigo-500/15 text-indigo-400 font-extrabold border border-indigo-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  طلباتي وحجوزاتي
                </button>
              </>
            )}

            <span className="text-neutral-700 font-normal">|</span>

            <button
              onClick={() => handlePageSelect('support')}
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                activePage === 'support'
                  ? 'bg-indigo-500/15 text-indigo-400 font-extrabold border border-indigo-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              طلب استشارة وتواصل
            </button>
            <button
              onClick={() => handleSubScroll('support', 'faq')}
              className="px-3.5 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl text-xs transition-colors"
            >
              الأسئلة الشائعة
            </button>

            {isAdminOrSupervisor && (
              <>
                <span className="text-neutral-700 font-normal">|</span>
                <button
                  onClick={() => handlePageSelect('governorates')}
                  className={`px-3.5 py-2 rounded-xl transition-all duration-205 cursor-pointer flex items-center gap-1.5 relative ${
                    activePage === 'governorates'
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20'
                      : 'text-emerald-400 hover:text-white hover:bg-neutral-800 font-semibold'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>لوحة التحكم الإدارية</span>
                  {totalAdminAlerts > 0 && (
                    <span className="flex h-5 px-1.5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 text-[9px] text-white font-black border border-neutral-900 animate-pulse">
                      {totalAdminAlerts}
                    </span>
                  )}
                </button>
              </>
            )}
          </nav>

          {/* Left Section: Action/Options Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Separate Store Button on the outside for easy access */}
            <button
              onClick={() => handlePageSelect('shop')}
              className={`px-4.5 py-2.5 rounded-full text-xs font-black border flex items-center gap-1.5 transition-all duration-300 cursor-pointer select-none shadow-md hover:scale-105 active:scale-95 ${
                activePage === 'shop'
                  ? 'bg-[#25C1F2]/25 border-[#25C1F2] text-white shadow-[0_0_15px_rgba(37,193,242,0.25)] ring-1 ring-[#25C1F2]/40'
                  : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 text-[#25C1F2] hover:border-[#25C1F2]/50 hover:shadow-[0_0_12px_rgba(37,193,242,0.15)]'
              }`}
              title="تصفح وحجز أقوى عروض المتجر الإلكتروني"
            >
              <span>المتجر الإلكتروني 🛒</span>
            </button>

            {/* Options Dropdown Trigger (resembles the FAQ question click logic) */}
            <div className="relative">
              <button
                onClick={() => setOptionsOpen(!optionsOpen)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all duration-300 cursor-pointer select-none relative ${
                  optionsOpen
                    ? 'bg-indigo-500/15 border-indigo-500/35 text-white'
                    : 'bg-neutral-900 hover:bg-[#0A0A0A] border-neutral-800 text-neutral-200 hover:border-neutral-700'
                }`}
                title="تصفح قائمة صفحات المنصة والدليل المالي"
              >
                <LayoutGrid className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span>خيارات المنصة</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-300 ${
                  optionsOpen ? 'rotate-180 text-indigo-400' : ''
                }`} />
                {isAdminOrSupervisor && totalAdminAlerts > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-black border border-neutral-900 shadow-lg animate-bounce">
                    {totalAdminAlerts}
                  </span>
                )}
              </button>

              {/* Options list dropdown Box (same gorgeous block style as expanded FAQ) */}
              {optionsOpen && (
                <div className="absolute top-12 left-0 w-80 bg-[#0F0F0F] rounded-2xl border border-neutral-800 shadow-2xl p-4 text-right space-y-2 select-none animate-fadeIn z-50">
                  <div className="text-[10px] text-neutral-500 font-bold border-b border-neutral-850 pb-2 mb-2 flex items-center justify-between">
                    <span>قائمة الخيارات الإضافية</span>
                    <span className="text-indigo-400 font-mono">Sugar business</span>
                  </div>

                  {currentUser?.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        // Brief highlight effect logic could be added here if needed
                      }}
                      className="w-full text-right p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border cursor-pointer bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 text-indigo-400"
                    >
                      <div className="p-1.5 rounded-lg bg-neutral-900 text-indigo-400">
                        <Settings className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded">إعدادات سريعة</span>
                          <h4 className="text-xs font-bold text-white">تحديث رقم الواتساب العام</h4>
                        </div>
                        <p className="text-[9px] text-neutral-400 font-medium">تغيير الرقم الذي يتم توجيه جميع أزرار تواصل المنصة إليه حالياً</p>
                      </div>
                    </button>
                  )}

                  {isAdminOrSupervisor && (
                    <button
                      type="button"
                      onClick={() => handlePageSelect('governorates')}
                      className={`w-full text-right p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border cursor-pointer ${
                        activePage === 'governorates'
                          ? 'bg-emerald-500/10 text-white border-emerald-500/20'
                          : 'bg-[#1E3A8A]/10 hover:bg-[#1E3A8A]/25 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-neutral-900 text-emerald-400 relative">
                        <UserCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                        {totalAdminAlerts > 0 && (
                          <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white font-black z-10">
                            {totalAdminAlerts}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded">لوحة التحكم</span>
                            <h4 className="text-xs font-bold text-white">شاشة الإدارة العامة</h4>
                          </div>
                          {totalAdminAlerts > 0 && (
                            <span className="text-[8px] font-black text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/25 animate-pulse shrink-0">
                              {totalAdminAlerts} تنبيه نشط
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] text-neutral-450 font-medium mt-1">
                          {pendingUsersCount > 0 ? `هناك ${pendingUsersCount} عضو ينتظر الموافقة والتفعيل الآن.` : `عرض وإدارة الفروع والأعضاء والطلبات الحالية بمصر`}
                        </p>
                      </div>
                    </button>
                  )}

                  {isMainAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        setShowSuperModal(true);
                      }}
                      className="w-full text-right p-3 rounded-xl transition-all duration-250 flex items-start gap-3 border cursor-pointer bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400"
                    >
                      <div className="p-1.5 rounded-lg bg-neutral-900 text-rose-400">
                        <ShieldCheck className="w-4 h-4 text-rose-400 animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-rose-500/10 text-rose-400 font-extrabold px-1.5 py-0.5 rounded">خاص بالمدير الرئيسي</span>
                          <h4 className="text-xs font-black text-white">تكويد وإضافة مشرف مالي 👑</h4>
                        </div>
                        <p className="text-[9px] text-neutral-400 font-medium">سجل واعتمد مشرف أول أو مشرف ثان بكود وباسورد ويوزرنيم ورقم قومي</p>
                      </div>
                    </button>
                  )}

                  {!currentUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        onOpenAuth('login');
                      }}
                      className="w-full text-right p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border cursor-pointer bg-neutral-950/45 hover:bg-neutral-900 hover:border-indigo-500/30 text-indigo-400 border-neutral-900/40"
                    >
                      <div className="p-1.5 rounded-lg bg-neutral-900 text-indigo-400">
                        <LogIn className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-black px-1.5 py-0.5 rounded">رسمية</span>
                          <h4 className="text-xs font-bold text-white">صفحة تسجيل الدخول</h4>
                        </div>
                        <p className="text-[9px] text-neutral-400 font-medium">دخول فوري آمن لحسابك المالي ومتابعة الأرباح والخدمات</p>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => handlePageSelect('home')}
                    className={`w-full text-right p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border cursor-pointer ${
                      activePage === 'home'
                        ? 'bg-indigo-500/10 text-white border-indigo-500/20'
                        : 'bg-neutral-950/45 hover:bg-neutral-900 text-neutral-300 border-neutral-900/40 hover:border-neutral-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-neutral-900 text-indigo-400">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white">الصفحة الرئيسية</h4>
                      <p className="text-[9px] text-neutral-400 font-medium">ميثاق الأمان، والـ 8 عوامل نجاح متميزة للمشروع</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePageSelect('services')}
                    className={`w-full text-right p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border cursor-pointer ${
                      activePage === 'services'
                        ? 'bg-indigo-500/10 text-white border-indigo-500/20'
                        : 'bg-neutral-950/45 hover:bg-neutral-900 text-neutral-300 border-neutral-900/40 hover:border-neutral-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-neutral-900 text-indigo-400">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white">القطاعات والخدمات الحيوية</h4>
                      <p className="text-[9px] text-neutral-400 font-medium">تصفح الـ ٣٢ نشاطاً معتمَداً، وطلب كروت شوجر الذكية</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePageSelect('support')}
                    className={`w-full text-right p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border cursor-pointer ${
                      activePage === 'support'
                        ? 'bg-indigo-500/10 text-white border-indigo-500/20'
                        : 'bg-neutral-950/45 hover:bg-neutral-900 text-neutral-300 border-neutral-900/40 hover:border-neutral-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-neutral-900 text-indigo-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white">التعاقد وحجز الاستشارات والأسئلة</h4>
                      <p className="text-[9px] text-neutral-400 font-medium">التواصل مع الإدارة والأسئلة الشائعة وعقود المبيعات</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setOptionsOpen(false);
                      if (onOpenEmployment) onOpenEmployment();
                    }}
                    className="w-full text-right p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border cursor-pointer bg-neutral-950/45 hover:bg-neutral-900 hover:border-indigo-500/30 text-neutral-300 border-neutral-900/40"
                  >
                    <div className="p-1.5 rounded-lg bg-neutral-900 text-emerald-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white">تقديم طلب توظيف (دوام كامل)</h4>
                      <p className="text-[9px] text-neutral-400 font-medium">خطوات يسيرة للانضمام لكوادرنا بمصر عبر ملء البيانات مباشر</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              /* User Profile display instead of login buttons */
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <button
                  onClick={() => setIsNotifOpen(true)}
                  className="relative p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all cursor-pointer group"
                  title="مركز التنبيهات"
                >
                  <Bell className={`w-4.5 h-4.5 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white font-black border border-[#0F0F0F]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 max-w-[220px]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shrink-0 relative">
                  <UserCheck className="w-3.5 h-3.5 text-white" />
                  {currentUser.role === 'admin' && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[6px] text-white border border-[#0F0F0F] font-black uppercase">AD</span>
                  )}
                </div>
                <div className="flex flex-col text-right truncate">
                  <span className="text-[10px] font-black text-white truncate max-w-[100px]">{currentUser.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-indigo-400 font-bold truncate">الكود: {currentUser.identificationCode || 'قيد المعالجة'}</span>
                    <Sparkles className="w-2 h-2 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1 mr-1 text-neutral-450 hover:text-rose-400 transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
              /* Authentication Action Buttons */
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-neutral-200 hover:text-white hover:bg-neutral-850 transition-all cursor-pointer flex items-center gap-1 border border-neutral-850 bg-[#0F0F0F]"
                >
                  <LogIn className="w-3 h-3 text-indigo-400" />
                  <span>تسجيل الدخول</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all cursor-pointer flex items-center gap-1 border border-indigo-500/20"
                >
                  <UserPlus className="w-3 h-3 text-indigo-400" />
                  <span>إنشاء حساب</span>
                </button>
              </div>
            )}

            <button
              onClick={onOpenContact}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-full shadow-md hover:shadow-indigo-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              حجز استشارة مجانية
            </button>
          </div>

          {/* Mobile Right Section: Actions & Menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Separate Mobile Store Button on the outside next to navigation button */}
            <button
              onClick={() => handlePageSelect('shop')}
              className={`px-3 py-2.5 rounded-xl text-xs font-black border flex items-center gap-1 transition-all duration-300 cursor-pointer select-none shadow-md active:scale-95 ${
                activePage === 'shop'
                  ? 'bg-[#25C1F2]/25 border-[#25C1F2] text-white shadow-[0_0_12px_rgba(37,193,242,0.2)]'
                  : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 text-[#25C1F2] hover:border-[#25C1F2]/40'
              }`}
              title="المتجر"
            >
              <span>المتجر 🛒</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-indigo-400 hover:text-white hover:border-[#25C1F2]/50 transition-all focus:outline-none cursor-pointer shadow-lg relative"
              aria-expanded={isOpen}
            >
              <span className="sr-only">فتح القائمة الرئيسية</span>
              <Menu className="h-5 w-5" />
              {isAdminOrSupervisor && totalAdminAlerts > 0 && (
                <span className="absolute -top-1 -left-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white font-black border border-neutral-900 animate-bounce">
                  {totalAdminAlerts}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Modern Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            
            {/* Left-Top Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="fixed top-[74px] left-4 w-[92%] max-w-[340px] bg-[#0A0A0A] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[70] lg:hidden overflow-hidden flex flex-col max-h-[82vh]"
              dir="rtl"
            >
              <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white">شوجر بيزنس إي جي</span>
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">القائمة والخيارات</span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-white/5 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Primary Navigation Section - Exactly 3 visible items with scroll */}
                <div className="space-y-1.5">
                  <h6 className="text-[9px] font-black text-neutral-500 px-2 uppercase tracking-tighter flex items-center justify-between">
                    <span>التنقل الأساسي (مرر للمزيد ▾)</span>
                  </h6>
                  <nav className="flex flex-col gap-1 max-h-[142px] overflow-y-auto custom-scrollbar pr-1 no-scrollbar">
                    {[
                      { id: 'home', label: 'الرئيسية', icon: Compass },
                      { id: 'services', label: 'القطاعات والخدمات', icon: LayoutGrid },
                      { id: 'shop', label: 'المتجر الإلكتروني', icon: CalcIcon, badge: 'جديد' },
                      { id: 'support', label: 'طلب استشارة وتواصل', icon: MessageSquare }
                    ].map((item: any) => (
                      <button
                        key={item.id}
                        onClick={() => handlePageSelect(item.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-[1rem] transition-all group ${
                          activePage === item.id 
                            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' 
                            : 'text-neutral-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon className={`w-3.5 h-3.5 ${activePage === item.id ? 'text-indigo-400' : 'text-neutral-500 group-hover:text-indigo-400'}`} />
                          <span className="text-xs font-bold">{item.label}</span>
                        </div>
                        {item.badge && <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-[#25C1F2]/10 text-[#25C1F2] font-black">{item.badge}</span>}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Additional Utilities Section */}
                <div className="space-y-2">
                  <h6 className="text-[9px] font-black text-neutral-500 px-2 uppercase">خدمات إضافية</h6>
                  <button
                    onClick={() => { setIsOpen(false); onOpenEmployment?.(); }}
                    className="w-full flex items-center gap-2.5 p-3.5 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/10 transition-all text-right"
                  >
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-black">طلب توظيف مباشر</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={onOpenContact}
                    className="w-full flex items-center gap-2.5 p-3.5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl shadow-xl shadow-indigo-500/10 border border-white/10 transition-all text-right group active:scale-[0.98]"
                  >
                    <PhoneCall className="w-4 h-4 shrink-0 group-hover:rotate-12 transition-transform" />
                    <div className="flex-1">
                      <p className="text-xs font-black">حجز استشارة فورية</p>
                    </div>
                  </button>
                </div>

                {/* Member Services & Administrative Panel */}
                {currentUser && (
                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <h6 className="text-[9px] font-black text-indigo-400 px-2 uppercase">لوحة العضوية والإدارة 👑</h6>
                    <div className="flex flex-col gap-1.5">
                      {isAdminOrSupervisor && (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            handlePageSelect('governorates');
                          }}
                          className="w-full flex items-center justify-between p-3.5 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/10 transition-all text-right"
                        >
                          <div className="flex items-center gap-2.5">
                            <UserCheck className="w-4 h-4 shrink-0 animate-pulse" />
                            <span className="text-xs font-bold">لوحة التحكم والطلبات المعلقة</span>
                          </div>
                          {totalAdminAlerts > 0 && (
                            <span className="flex h-5 px-2 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-black animate-pulse">
                              {totalAdminAlerts} هامة
                            </span>
                          )}
                        </button>
                      )}

                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full flex items-center gap-2.5 p-3.5 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/10 transition-all text-right"
                        >
                          <Settings className="w-4 h-4 shrink-0 animate-spin-slow" />
                          <span className="text-xs font-bold">إدارة رقم الواتساب الموحد</span>
                        </button>
                      )}

                      {isMainAdmin && (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            setShowSuperModal(true);
                          }}
                          className="w-full flex items-center gap-2.5 p-3.5 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/10 transition-all text-right"
                        >
                          <ShieldCheck className="w-4 h-4 shrink-0 animate-pulse" />
                          <span className="text-xs font-black">تكويد وإضافة مشرف جديد</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* App Theme Toggle in Drawer - Day/Night Status Bar Switch */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between px-2">
                   <span className="text-[11px] font-bold text-neutral-400">تحويل الوضع ليل/نهار:</span>
                   <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white cursor-pointer hover:bg-white/10 transition-all font-bold"
                   >
                     {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                     <span>{theme === 'dark' ? 'النهار' : 'الليل'}</span>
                   </button>
                </div>

                {/* Auth & User Account Section - The Absolute Last Thing Before App Display */}
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 shadow-inner mt-4">
                   <h6 className="text-[9px] font-black text-neutral-500 mb-2 px-1 uppercase">حساب العضوية والاستثمار</h6>
                   {currentUser ? (
                     <div className="space-y-3">
                       <div className="flex items-center gap-2.5 p-2.5 bg-black/40 rounded-xl border border-white/5">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10 shrink-0">
                           <UserCheck className="w-4 h-4" />
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                            <p className="text-[8.5px] text-indigo-400 font-bold">كود: {currentUser.identificationCode || '---'}</p>
                         </div>
                       </div>
                       <div className="grid grid-cols-1 gap-1.5">
                         <button
                            onClick={() => handlePageSelect('my-orders')}
                            className="w-full py-2 bg-white/5 hover:bg-white/10 text-[10.5px] font-bold text-white rounded-lg transition-all flex items-center justify-center gap-2 border border-white/5"
                         >
                           <Landmark className="w-3 h-3" />
                           طلباتي وتاريخ العمليات
                         </button>
                         <button
                            onClick={() => { setIsOpen(false); onLogout(); }}
                            className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-[10.5px] font-black text-rose-400 rounded-lg transition-all flex items-center justify-center gap-2 border border-rose-500/10"
                         >
                           <LogOut className="w-3 h-3" />
                           تسجيل الخروج الآمن
                         </button>
                       </div>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 gap-2">
                       <button
                         onClick={() => { setIsOpen(false); onOpenAuth('login'); }}
                         className="w-full py-3 bg-[#25C1F2]/10 hover:bg-[#25C1F2]/20 border border-[#25C1F2]/20 text-[#25C1F2] rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                       >
                         <LogIn className="w-3.5 h-3.5" />
                         تسجيل الدخول للنظام
                       </button>
                       <button
                         onClick={() => { setIsOpen(false); onOpenAuth('register'); }}
                         className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                       >
                         <UserPlus className="w-3.5 h-3.5" />
                         فتح حساب استثماري جديد
                       </button>
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showSuperModal && isMainAdmin && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setShowSuperModal(false)}
        >
          <div 
            className="bg-[#0A0A0C] border-2 border-rose-500/25 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-scaleUp relative overflow-hidden text-right" 
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <div className="flex items-center gap-3 border-b border-neutral-850 pb-4">
              <span className="p-2.5 rounded-xl bg-rose-500/10 text-rose-455 text-md shrink-0">👑</span>
              <div>
                <h3 className="text-sm md:text-md font-black text-white">تأسيس وتجهيز حساب مشرف مالي جديد</h3>
                <p className="text-[10px] md:text-xs text-neutral-400 mt-0.5">خاص بصلاحيات المدير العام الفوري لتجهيز تصاريح المراقبة الجغرافية والمالية.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSuperModal(false)}
                className="mr-auto p-1 text-neutral-400 hover:text-white hover:bg-neutral-850 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupervisor} className="space-y-4">
              {/* Supervisor Role/Class Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">تصنيف الرتبة والتفويض المالي:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSuperRole('admin')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      superRole === 'admin'
                        ? 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                        : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>مشرف رئيسي أول</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuperRole('supervisor2')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      superRole === 'supervisor2'
                        ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                        : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>مشرف مساعد ثانٍ</span>
                  </button>
                </div>
                <span className="text-[9px] text-neutral-500 block">الأول يمتلك صلاحيات الإقالة والتسجيل، بينما الثاني يتابع الفروع الجغرافية المعتمدة.</span>
              </div>

              {/* Name field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300 block">الاسم الكامل للمشرف:</label>
                <input
                  type="text"
                  required
                  value={superName}
                  onChange={(e) => setSuperName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  placeholder="مثال: المهندس محمد الشافي"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone / login phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 block">رقم الهاتف المستخدم للدخول:</label>
                  <input
                    type="tel"
                    required
                    value={superPhone}
                    onChange={(e) => setSuperPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs text-left font-mono focus:outline-none focus:border-rose-500"
                    placeholder="رقم الهاتف المستخدم للدخول"
                  />
                </div>

                {/* Password input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 block">كلمة المرور الخاصة بالمشرف:</label>
                  <input
                    type="password"
                    required
                    value={superPassword}
                    onChange={(e) => setSuperPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs text-left focus:outline-none focus:border-rose-500"
                    placeholder="أدخل الباسورد السري للمشرف"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Username label (which user specifically asked to input as custom field) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 block">اليوزر نيم المخصص للمشرف:</label>
                  <input
                    type="text"
                    value={superUsername}
                    onChange={(e) => setSuperUsername(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs text-left focus:outline-none focus:border-rose-500"
                    placeholder="مثال: admin_com_shafi"
                  />
                </div>

                {/* Identification code / الكود التعريفي */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 block">الكود التعريفي للمشرف (ID):</label>
                  <input
                    type="text"
                    value={superCode}
                    onChange={(e) => setSuperCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs text-left font-mono focus:outline-none focus:border-rose-500"
                    placeholder="مثل: SUGAR-SUP-401"
                  />
                </div>
              </div>

              {/* National ID / رقم البطاقة */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300 block">رقم البطاقة (14 رقم قومي):</label>
                <input
                  type="text"
                  value={superNationalId}
                  onChange={(e) => setSuperNationalId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono text-left focus:outline-none focus:border-rose-500"
                  placeholder="298xxxx_رقم البطاقة"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/15 text-xs font-bold text-red-400">
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-xs font-bold text-emerald-400">
                  🍀 {successMsg}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2 border-t border-neutral-850">
                <button
                  type="button"
                  onClick={() => setShowSuperModal(false)}
                  className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  إغلاق النافذة
                </button>
                <button
                  type="submit"
                  disabled={loadingForm}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-black cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loadingForm ? 'جاري الحفظ...' : 'تأكيد تسجيل وتفعيل المشرف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentUser && (
        <NotificationCenter 
          currentUser={currentUser}
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />
      )}
    </header>
  );
};
