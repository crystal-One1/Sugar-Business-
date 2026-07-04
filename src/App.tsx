import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Features } from './components/Features';
import { Services } from './components/Services';
import { FAQ } from './components/FAQ';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { GovernoratesDashboard } from './components/GovernoratesDashboard';
import { Shop } from './components/Shop';
import { MyOrders } from './components/MyOrders';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { TrackingDashboard } from './components/TrackingDashboard';
import { User } from './types';
import { Phone, MessageSquare, ShieldAlert, Sparkles, X, Activity, ArrowUp } from 'lucide-react';
import { CMSProvider, useCMS } from './CMSContext';
import { useTracking, trackEvent } from './lib/tracking';

function AppInternal({
  activePage,
  setActivePage,
  preFilledAmount,
  setPreFilledAmount,
  showNotification,
  setShowNotification,
  servicesForm,
  setServicesForm,
  currentUser,
  setCurrentUser,
  isAuthModalOpen,
  setIsAuthModalOpen,
  authModalMode,
  setAuthModalMode,
  handleAuthSuccess,
  handleLogout,
  handleOpenContact,
  handleOpenEmployment,
  handleOpenAuth
}: any) {
  const { 
    settings, 
    loading, 
    isEditModeEnabled, 
    setEditModeEnabled, 
    refreshData, 
    updateConfig,
    users,
    recruitmentRequests,
    serviceAdditionRequests,
    passwordResetRequests,
    orders
  } = useCMS();

  const pendingUsersCount = (users || []).filter(u => !u.approved && !u.isBlocked && !u.isInactive).length;
  const pendingRecruitmentCount = (recruitmentRequests || []).filter((r: any) => r.status === 'pending').length;
  const pendingServiceAddCount = (serviceAdditionRequests || []).filter((r: any) => r.status === 'pending').length;
  const pendingPasswordResetsCount = (passwordResetRequests || []).filter((r: any) => r.status === 'pending').length;
  const pendingOrdersCount = (orders || []).filter((o: any) => o.status === 'pending').length;

  const totalAdminAlerts = pendingUsersCount + pendingRecruitmentCount + pendingServiceAddCount + pendingPasswordResetsCount + pendingOrdersCount;

  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useTracking(currentUser, activePage);

  const isBannerVisible = showNotification && settings.showNotification && settings.bannerText;

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("مرحباً شوجر بيزنس إي جي، أود الاستفسار عن باقات الاستثمار والعوائد المتاحة لعام ٢٠٢٦")}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-200 font-sans tracking-wide antialiased transition-colors duration-300">
      
      {/* Admin Quick Editor Panel */}
      {currentUser?.role === 'admin' && (
        <div className="bg-neutral-950 border-b border-indigo-500/25 text-white text-xs py-2 px-4 shadow-xl select-none z-55 flex flex-wrap items-center justify-between gap-3 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isEditModeEnabled ? 'bg-emerald-400' : 'bg-neutral-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isEditModeEnabled ? 'bg-emerald-400' : 'bg-neutral-500'}`}></span>
            </span>
            <span className="font-extrabold text-[11px] text-neutral-200">
               لوحة التحكم السريعة للمدير • <span className="text-[#25C1F2] font-black">شوجر بيزنس إي جي</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* WhatsApp Management */}
            <div className="flex items-center gap-2 border-r border-[#1F2937] border-neutral-800 pr-4">
              <span className="text-[10px] text-neutral-400 font-bold">رقم الواتساب:</span>
              <input 
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => updateConfig({ whatsappNumber: e.target.value })}
                placeholder="2010..."
                className="bg-neutral-900 border border-neutral-800 text-white text-[10px] px-2 py-0.5 rounded w-28 focus:border-indigo-500 outline-none transition-all"
                title="الرقم الذي يوجه إليه جميع أزرار الواتساب في التطبيق"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] text-neutral-400 font-bold">
                {isEditModeEnabled ? 'وضع تعديل النصوص المباشر نشط الآن ✅' : 'تفعيل خيار التعديل المباشر'}
              </span>
              <button
                type="button"
                onClick={() => setEditModeEnabled(!isEditModeEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isEditModeEnabled ? 'bg-emerald-500' : 'bg-neutral-705 bg-neutral-700'
                }`}
                aria-label="تفعيل خيار التعديل"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isEditModeEnabled ? '-translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <button
              onClick={() => setActivePage('governorates')}
              className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-md font-extrabold text-[10px] transition-all cursor-pointer flex items-center gap-1.5 relative border border-emerald-500/20"
            >
              <span>فتح لوحة المحافظات الإدارية ←</span>
              {totalAdminAlerts > 0 && (
                <span className="flex h-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white font-black animate-pulse">
                  {totalAdminAlerts}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsTrackingOpen(true)}
              className="px-2.5 py-1 bg-indigo-500 text-white hover:bg-indigo-600 rounded-md font-black text-[10px] shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            >
              <Activity className="w-3 h-3" />
              تتبع سلوك العملاء (AI Tracking)
            </button>
          </div>
        </div>
      )}

      {isTrackingOpen && currentUser?.role === 'admin' && (
        <TrackingDashboard adminPhone={currentUser.phone} onClose={() => setIsTrackingOpen(false)} />
      )}

      {/* Top Notification Banner */}
      {isBannerVisible && (
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-850 text-white text-[11px] sm:text-xs font-bold py-2.5 px-4 text-center relative z-50 flex items-center justify-center gap-1.5 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
          <span className="line-clamp-1">{settings.bannerText}</span>
          <button 
            type="button" 
            onClick={() => setShowNotification(false)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-1 text-indigo-200 hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <Header 
        activePage={activePage}
        onChangePage={(page) => {
          setActivePage(page);
          if (page !== 'services') {
            setServicesForm(null);
          }
        }}
        onOpenContact={handleOpenContact}
        onOpenEmployment={handleOpenEmployment}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Pages Container with smooth transition */}
      <main className="animate-fadeIn min-h-[70vh]">
        {activePage === 'home' && (
          <div className="space-y-0">
            {/* Hero presentation screen */}
            <Hero 
              onOpenContact={handleOpenContact}
            />

            {/* About Section - Details of starting date 2022 and startup profile */}
            <About />

            {/* Why Sugar Business section - Grid of 8 outstanding attributes */}
            <Features />
          </div>
        )}

        {activePage === 'services' && (
          <Services 
            onOpenContact={handleOpenContact} 
            activeForm={servicesForm}
            setActiveForm={setServicesForm}
            currentUser={currentUser}
          />
        )}

        {activePage === 'support' && (
          <div className="space-y-0">
            {/* Interactive consulting registration form */}
            <ContactForm 
              preFilledAmount={preFilledAmount}
            />

            {/* Structured Collapsible FAQ block */}
            <FAQ />
          </div>
        )}

        {activePage === 'shop' && (
          <Shop 
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activePage === 'my-orders' && (
          <MyOrders 
            currentUser={currentUser}
          />
        )}

        {activePage === 'governorates' && currentUser?.role === 'admin' ? (
          <div className="space-y-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-end">
              <button 
                onClick={() => {
                  window.location.hash = window.location.hash === '#supervisor' ? '' : '#supervisor';
                  refreshData();
                }}
                className="px-5 py-2.5 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-400 hover:text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {window.location.hash === '#supervisor' ? '← العودة لوحدة المحافظات التفاعلية' : 'الانتقال للوحة مهام المشرفين والطلبات والتوظيف ⚙️'}
              </button>
            </div>
            {window.location.hash === '#supervisor' ? (
              <SupervisorDashboard currentUser={currentUser} />
            ) : (
              <GovernoratesDashboard 
                currentUser={currentUser}
                onOpenContact={handleOpenContact}
              />
            )}
          </div>
        ) : activePage === 'governorates' && currentUser?.role === 'supervisor2' ? (
          <SupervisorDashboard currentUser={currentUser} />
        ) : activePage === 'governorates' ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center select-none bg-neutral-900/40 rounded-3xl border border-neutral-900 max-w-xl mx-auto my-16 shadow-2xl relative">
            <ShieldAlert className="w-14 h-14 text-[#25C1F2] mb-5 animate-pulse" />
            <h2 className="text-xl font-black text-white">عذراً، هذه اللوحة مخصصة لإدارة المشرفين والمدير المالي بمصر.</h2>
            <p className="text-xs text-neutral-450 mt-2.5 max-w-sm font-medium">يرجى تسجيل الدخول للحساب المشرف الخاص بك للمتابعة بالعملية.</p>
            <button onClick={() => setActivePage('home')} className="mt-8 px-7 py-3 bg-gradient-to-r from-indigo-550 to-indigo-650 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer">العودة للرئيسية</button>
          </div>
        ) : null}
      </main>

      {/* Brand Style footer section */}
      <Footer />

      {/* Floating Action Button (FAB) for Instant WhatsApp Assistance - Standard Egyptian Conversion optimizer */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
        title="تواصل مباشر عبر الواتساب"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-xs font-black ml-0 group-hover:ml-2">
          تحدث مباشرة مع مستشار مالي
        </span>
        <MessageSquare className="w-6 h-6" />
      </a>

      {/* Premium Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-neutral-900/90 text-[#25C1F2] border border-[#25C1F2]/40 shadow-[0_0_20px_rgba(37,193,242,0.25)] hover:bg-[#25C1F2] hover:text-white hover:border-[#25C1F2] transition-all duration-300 cursor-pointer flex items-center justify-center hover:-translate-y-1 active:scale-95 animate-fadeIn"
          title="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5 animate-pulse" />
        </button>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'services' | 'support' | 'governorates' | 'shop' | 'my-orders'>(() => {
    try {
      const savedUser = localStorage.getItem('sugar_current_user');
      return savedUser ? 'governorates' : 'home';
    } catch {
      return 'home';
    }
  });
  const [preFilledAmount, setPreFilledAmount] = useState<number>(20005);
  const [showNotification, setShowNotification] = useState<boolean>(true);
  const [servicesForm, setServicesForm] = useState<'ad' | 'service' | 'card' | 'work' | null>(null);

  // User Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('sugar_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setActivePage('governorates');
  };

  const handleLogout = () => {
    if (currentUser) {
      localStorage.removeItem(`sugar_selected_gov_id_${currentUser.phone}`);
      localStorage.removeItem(`sugar_selected_rest_gov_id_${currentUser.phone}`);
    }
    localStorage.removeItem('sugar_current_user');
    setCurrentUser(null);
    setActivePage('home');
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenContact = () => {
    setActivePage('support');
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleOpenEmployment = () => {
    setServicesForm('work');
    setActivePage('services');
    setTimeout(() => {
      const el = document.getElementById('action-apply-work') || document.getElementById('services-sectors');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <CMSProvider currentUser={currentUser}>
      <AppInternal 
        activePage={activePage}
        setActivePage={setActivePage}
        preFilledAmount={preFilledAmount}
        setPreFilledAmount={setPreFilledAmount}
        showNotification={showNotification}
        setShowNotification={setShowNotification}
        servicesForm={servicesForm}
        setServicesForm={setServicesForm}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        authModalMode={authModalMode}
        setAuthModalMode={setAuthModalMode}
        handleAuthSuccess={handleAuthSuccess}
        handleLogout={handleLogout}
        handleOpenContact={handleOpenContact}
        handleOpenEmployment={handleOpenEmployment}
        handleOpenAuth={handleOpenAuth}
      />
    </CMSProvider>
  );
}
