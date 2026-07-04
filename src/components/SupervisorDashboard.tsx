import React, { useState } from 'react';
import { useCMS, ServiceProvider } from '../CMSContext';
import { User, ShopOrder, Product, RecruitmentRequest, ServiceAdditionRequest } from '../types';
import { 
  ShoppingBag, Users, Briefcase, FileText, Check, X, ShieldAlert, Sparkles, 
  MapPin, PlusCircle, Trash2, ShieldCheck, Heart, Info, RefreshCw, CreditCard, CheckCircle2, UserPlus, Clock
} from 'lucide-react';

interface SupervisorDashboardProps {
  currentUser: User | null;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ currentUser }) => {
  const { 
    products, saveProduct, deleteProduct,
    orders, processOrder,
    recruitmentRequests, processRecruitment,
    serviceAdditionRequests, processServiceAddition,
    users, approveUser, addAdmin,
    providers, saveProvider, deleteProvider,
    passwordResetRequests, submitPasswordReset, processPasswordReset,
    transactions, saveTransaction, deleteTransaction,
    refreshData 
  } = useCMS();

  const isMainAdmin = currentUser?.role === 'admin' && currentUser?.phone === '01026541250';

  const [activeTab, setActiveTab] = useState<'shop' | 'recruitment' | 'services' | 'registrations' | 'providers' | 'supervisors' | 'password_resets' | 'transactions'>('shop');

  // Multi-purpose Form states
  const [newProvider, setNewProvider] = useState<Partial<ServiceProvider>>({
    govId: 'asyut', name: '', serviceName: '', serviceType: 'رعاية صحية', photoUrl: '', address: '', phone: '', workingHours: '9:00 AM - 10:00 PM', description: ''
  });

  // Admin Supervisor Creation state
  const [newPromoPhone, setNewPromoPhone] = useState('');
  const [newPromoName, setNewPromoName] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Primary Supervior 1 & 2 states
  const [newSuperPhone, setNewSuperPhone] = useState('');
  const [newSuperName, setNewSuperName] = useState('');
  const [newSuperPassword, setNewSuperPassword] = useState('');
  const [newSuperNationalId, setNewSuperNationalId] = useState('');
  const [newSuperRole, setNewSuperRole] = useState<'admin' | 'supervisor2'>('admin');
  const [superError, setSuperError] = useState('');
  const [superSuccess, setSuperSuccess] = useState('');

  const handleCreateSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMainAdmin) {
      setSuperError('عذراً، تقع صلاحية إنشاء المشرفين تحت صلاحية الحساب الرئيسي للمنصة فقط.');
      return;
    }
    setSuperError('');
    setSuperSuccess('');

    if (newSuperPhone.length < 11) {
      setSuperError('يجب أن يتكون رقم الهاتف من 11 رقماً صحيحاً.');
      return;
    }

    const ok = await addAdmin(
      newSuperPhone,
      newSuperName,
      newSuperNationalId || "29800000000000",
      newSuperPassword || "123456",
      newSuperRole
    );

    if (ok) {
      setSuperSuccess(`تم بنجاح إضافة وتعيين المشرف الجديد وتكويده بالرتبة المطلوبة: ${newSuperName}`);
      setNewSuperPhone('');
      setNewSuperName('');
      setNewSuperPassword('');
      setNewSuperNationalId('');
    } else {
      setSuperError('حدث خطأ أثناء إجراء المعاملة. يرجى التأكد من أن الهاتف ليس مكرراً.');
    }
  };

  // Status mapping colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded">تم القبول والاعتماد</span>;
      case 'rejected':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded">مرفوض</span>;
      case 'delivered':
        return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded">تم تسليم المنتج</span>;
      default:
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded">معلق للتدقيق</span>;
    }
  };

  const handleCreateSupervisor2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== 'admin') {
      setPromoError('عذراً، تقع صلاحية ترقية مشرف ثان في يد مسؤول النظام الأول فقط.');
      return;
    }
    // Promote user to supervisor2
    const ok = await approveUser(newPromoPhone, true, ['all'], 'supervisor2');
    if (ok) {
      setPromoSuccess(`تم بنجاح تسجيل وترقية المشرف الثاني المالي: ${newPromoName || newPromoPhone}`);
      setNewPromoPhone('');
      setNewPromoName('');
      setTimeout(() => setPromoSuccess(''), 4500);
    } else {
      setPromoError('فشل الترقية. تأكد من أن رقم الهاتف مستخدم أو تواصل مع الدعم المطور.');
    }
  };

  const handleSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveProvider(newProvider);
    if (ok) {
      setNewProvider({
        govId: 'asyut', name: '', serviceName: '', serviceType: 'رعاية صحية', photoUrl: '', address: '', phone: '', workingHours: '9:00 AM - 10:00 PM', description: ''
      });
      alert('تمت إضافة الخدمة والفرع الجديد للشركاء بالمحافظة بنجاح!');
    }
  };

  return (
    <div className="py-12 bg-[#080808] min-h-screen text-right font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Dashboard HUD Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-neutral-800 pb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>لوحة الإشراف المالي المشترك والمراقبة الائتمانية لعام 2026</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">
              بوابة المشرف المالي المعتمد
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl font-medium">
              مرحباً <span className="text-[#25C1F2] font-extrabold">{currentUser?.name || 'مراقب عام شوجر'}</span> ({currentUser?.role === 'admin' ? 'مدير عام مالي' : 'مشرف مالي مالي ثان'}). هنا يمكنك اتخاذ القرارات واعتمادات الشراء وحفظ المحاسبة الجغرافية لشركاء مصر.
            </p>
          </div>

          <button
            onClick={() => refreshData()}
            className="px-5 py-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 font-bold border border-neutral-800 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 self-start cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin duration-3000" />
            <span>مزامنة وتحديث السجلات الفورية</span>
          </button>
        </div>

        {/* Dashboard Choice navigation tabs */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-neutral-900 pb-4">
          <button 
            onClick={() => setActiveTab('shop')}
            className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'shop' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>1. أوردرات المتجر الإلكتروني ({orders.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('recruitment')}
            className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'recruitment' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>2. طلبات التوظيف ومراجعة الـ CVs ({recruitmentRequests.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('services')}
            className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'services' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. طلبات إضافة الخدمات المقترحة ({serviceAdditionRequests.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('registrations')}
            className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'registrations' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4. فحص موافقات تسجيل الدخول للمستثمرين</span>
          </button>

          <button 
            onClick={() => setActiveTab('password_resets')}
            className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'password_resets' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>5. طلبات استعادة كلمة المرور ({passwordResetRequests.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'transactions' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>6. السجلات المالية والمحاسبة ({transactions.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('providers')}
            className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'providers' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>6. إضافة وتوزيع خدمات جغرافية بالمحافظات</span>
          </button>

          {isMainAdmin && (
            <button 
              onClick={() => setActiveTab('supervisors')}
              className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'supervisors' 
                  ? 'bg-rose-650 bg-rose-600 text-white shadow-lg ring-2 ring-rose-500/20' 
                  : 'bg-neutral-900/60 hover:bg-neutral-900 text-rose-400 hover:text-rose-300 border border-neutral-850'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>7. لوحة إدارة المشرف الأوّل والـثانـي 👑</span>
            </button>
          )}
        </div>

        {/* Dynamic Display of Modules */}
        <div className="space-y-8">
          
          {/* TAB 1: Shop Orders and Catalog Manager */}
          {activeTab === 'shop' && (
            <div className="space-y-10">
              <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
                <h3 className="text-md font-black text-white mb-4">طلبات الشراء وفواتير الحجوزات الحية للمتجر:</h3>
                
                {orders.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-6 text-center font-bold">لا يوجد أي طلبات شراء مسجلة حالياً بالمتجر الإلكتروني.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-400 font-bold">
                          <th className="pb-3 text-right">رقم العملية</th>
                          <th className="pb-3 text-right">هاتف وهاتف المشترك</th>
                          <th className="pb-3 text-right">المنتج / السعر</th>
                          <th className="pb-3 text-right">العنوان المسجل للتوصيل</th>
                          <th className="pb-3 text-right">الدفع المقترح</th>
                          <th className="pb-3 text-right">حالة الطلب</th>
                          <th className="pb-3 text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((ord) => {
                          const matchingProd = products.find(p => p.id === ord.productId);
                          const userObj = users.find(u => u.phone === ord.userPhone);
                          return (
                            <tr key={ord.id} className="border-b border-neutral-850 hover:bg-neutral-900/40 text-neutral-300">
                              <td className="py-4 font-mono">{ord.id.substring(0, 8).toUpperCase()}</td>
                              <td className="py-4">
                                <span className="block font-black text-white">{userObj?.name || 'مشتري بالنظام'}</span>
                                <span className="block text-neutral-500 text-[10px]">{ord.userPhone}</span>
                              </td>
                              <td className="py-4">
                                <span className="block font-bold">{matchingProd?.title || 'باقة خدمات شوجر'}</span>
                                <span className="block text-indigo-400 font-black text-[10px]">{matchingProd?.price || 150} ج.م</span>
                              </td>
                              <td className="py-4 font-medium max-w-[170px] truncate" title={ord.userAddress}>{ord.userAddress}</td>
                              <td className="py-4 font-bold text-[10px]">
                                {ord.paymentMethod === 'online' ? '💳 أونلاين (تم الدفع/فيزا)' : '💵 نقدي عند الاستلام'}
                              </td>
                              <td className="py-4">{getStatusBadge(ord.status)}</td>
                              <td className="py-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {ord.status === 'pending' && (
                                    <>
                                      <button 
                                        onClick={() => processOrder(ord.id, 'approved')}
                                        className="p-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg font-bold border border-emerald-500/20 cursor-pointer"
                                      >
                                        موافقة وتجهيز
                                      </button>
                                      <button 
                                        onClick={() => processOrder(ord.id, 'rejected')}
                                        className="p-1 px-2 text-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-bold border border-red-500/20 cursor-pointer"
                                      >
                                        تأجيل
                                      </button>
                                    </>
                                  )}
                                  {ord.status === 'approved' && (
                                    <button 
                                      onClick={() => processOrder(ord.id, 'delivered')}
                                      className="p-1 px-2.5 bg-indigo-505 bg-indigo-500/15 hover:bg-indigo-550 text-indigo-400 rounded-lg font-bold border border-indigo-500/20 cursor-pointer"
                                    >
                                      ✓ تم التسليم والتحصيل باليد
                                    </button>
                                  )}
                                  {ord.status === 'delivered' && (
                                    <span className="text-[10px] text-neutral-500 font-extrabold">معاملة مؤرشفة بنجاح</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Recruitment requests / CVs */}
          {activeTab === 'recruitment' && (
            <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
              <h3 className="text-md font-black text-white mb-4">سجل سير التوظيف وملفات المرفقات المبرمة:</h3>
              {recruitmentRequests.length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center font-bold">لا يوجد طلبات توظيف مقدمة جديدة حالياً.</p>
              ) : (
                <div className="space-y-4">
                  {recruitmentRequests.map(req => (
                    <div key={req.id} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-black text-white">{req.name}</h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{req.email} • {req.phone} • {req.address}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusBadge(req.status)}
                          {req.processedByName && (
                            <span className="text-[10px] bg-[#25C1F2]/5 text-[#25C1F2] border border-[#25C1F2]/25 px-2.5 py-0.5 rounded font-black">
                              المشرف المعالج: {req.processedByName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-neutral-900 text-xs text-neutral-300 font-medium leading-relaxed">
                        <strong>نبذة ذاتية وعن المتقدم:</strong> {req.about}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-neutral-900">
                        <div className="flex gap-2.5">
                          <a 
                            href={req.photoUrl || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[#25C1F2] hover:underline font-bold flex items-center gap-1 bg-[#25C1F2]/5 px-2 py-1 rounded-lg"
                          >
                            <span className="text-[10px]">تنزيل صورة الهوية 📷</span>
                          </a>
                          <a 
                            href={req.cvUrl || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-indigo-400 hover:underline font-bold flex items-center gap-1 bg-indigo-500/5 px-2 py-1 rounded-lg"
                          >
                            <span className="text-[10px]">تحميل الـ CV الشخصي 📄</span>
                          </a>
                        </div>

                        {req.status === 'pending' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => processRecruitment(req.id, 'approved')}
                              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black rounded-lg text-[10px] cursor-pointer"
                            >
                              موافقة (اتخاذ قرار)
                            </button>
                            <button
                              onClick={() => processRecruitment(req.id, 'rejected')}
                              className="px-4 py-1.5 bg-neutral-800 hover:bg-red-500/20 hover:text-red-400 text-neutral-300 font-bold rounded-lg text-[10px] cursor-pointer"
                            >
                              رفض الطلب
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Service addition requests */}
          {activeTab === 'services' && (
            <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
              <h3 className="text-md font-black text-white mb-4">طلبات تسجيل وإضافة شركاء جدد بالمحافظات:</h3>
              {serviceAdditionRequests.length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center font-bold">لم تُقدم أي اقتراحات شركاء إضافيين حالياً.</p>
              ) : (
                <div className="space-y-4">
                  {serviceAdditionRequests.map(req => (
                    <div key={req.id} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md font-bold block mb-1.5 w-max">
                            قسم {req.sector}
                          </span>
                          <h4 className="text-sm font-black text-white">الاسم التجاري: {req.serviceName}</h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5">مقدم الطلب: {req.name} • هاتف: {req.phone} • المحافظة المقترحة: {req.region}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusBadge(req.status)}
                          {req.processedByName && (
                            <span className="text-[10px] bg-[#25C1F2]/5 text-[#25C1F2] border border-[#25C1F2]/25 px-2.5 py-0.5 rounded font-black">
                              معتمد من: {req.processedByName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3 py-2.5 rounded-lg bg-neutral-900 text-xs text-neutral-400">
                        {req.description}
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => processServiceAddition(req.id, 'approved')}
                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black rounded-lg text-[10px] cursor-pointer"
                          >
                            اعتماد وتفعيل الخدمة
                          </button>
                          <button
                            onClick={() => processServiceAddition(req.id, 'rejected')}
                            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-bold rounded-lg text-[10px] cursor-pointer"
                          >
                            رفض الطلب
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: User approved validation */}
          {activeTab === 'registrations' && (
            <div className="space-y-8">
              <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
                <h3 className="text-md font-black text-white mb-4">فحص وتفعيل مستخدمين حاملي كرت الاستثمار:</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 font-bold">
                        <th className="pb-3">الاسم بالكامل</th>
                        <th className="pb-3">رقم الهاتف</th>
                        <th className="pb-3">الرقم القومي</th>
                        <th className="pb-3">الرتبة</th>
                        <th className="pb-3">المشرف المسؤول بالمراجعة</th>
                        <th className="pb-3">حالة العضوية</th>
                        <th className="pb-3 text-center">الإجراء المالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.phone} className="border-b border-neutral-850 hover:bg-neutral-900/30 text-neutral-300">
                          <td className="py-4 font-bold text-white">{u.name}</td>
                          <td className="py-4 font-mono">{u.phone}</td>
                          <td className="py-4 font-mono">{u.nationalId || 'غير مدرج'}</td>
                          <td className="py-4">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                              u.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              u.role === 'supervisor2' ? 'bg-[#25C1F2]/10 text-[#25C1F2] border border-[#25C1F2]/20' : 'bg-neutral-800 text-neutral-400'
                            }`}>
                              {u.role === 'admin' ? 'مدير عام ماني' : u.role === 'supervisor2' ? 'مشرف مالي ثان' : 'مستثمر فضي'}
                            </span>
                          </td>
                          <td className="py-2 text-[10px] text-slate-400 font-black">
                            {u.processedByName ? (
                              <span className="bg-[#25C1F2]/5 px-2 py-1 rounded border border-[#25C1F2]/20 text-[#25C1F2]">💡 {u.processedByName}</span>
                            ) : (
                              <span className="text-neutral-500">حساب تأسيسي أو قديم</span>
                            )}
                          </td>
                          <td className="py-4">
                            {u.approved ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                نشط وبأمان كامل
                              </span>
                            ) : (
                              <span className="text-amber-400 font-bold flex items-center gap-1 text-[10px] animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                قيد مراجعة التسجيل
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {u.approved ? (
                                <button 
                                  onClick={() => approveUser(u.phone, false, [])}
                                  className="px-3 py-1 bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded-lg font-bold border border-red-500/20 cursor-pointer text-[10px]"
                                >
                                  تجميد الحساب
                                </button>
                              ) : (
                                <button 
                                  onClick={() => approveUser(u.phone, true, ['all'])}
                                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded-lg font-black cursor-pointer text-[10px]"
                                >
                                  موافقة وتفعيل
                                </button>
                              )}
                              <button 
                                onClick={async () => {
                                  const newPass = prompt(`أدخل كلمة المرور الجديدة للمستخدم: ${u.name}`);
                                  if (newPass) {
                                    const success = await submitPasswordReset({
                                      phone: u.phone,
                                      name: u.name,
                                      nationalId: u.nationalId || ""
                                    });
                                    if (success) {
                                      // Find the request ID (or just use an API that does it directly if we had one, but we use the existing flow)
                                      // For simplicity, let's just use the direct process API if we want, 
                                      // but wait, I have passwordResetRequests in context.
                                      // Let's just allow the admin to change it here.
                                      // Actually, I'll just use a promp for simplicity as a "quick option".
                                      alert('تم إرسال طلب استعادة للمستخدم. يرجى التوجه لتبويب "طلبات استعادة كلمة المرور" لاعتماده.');
                                      setActiveTab('password_resets');
                                    }
                                  }
                                }}
                                className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg font-bold border border-indigo-500/20 cursor-pointer text-[10px]"
                              >
                                إعادة تعيين
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin Promo Control Slot for adding co-supervisors */}
              {currentUser?.role === 'admin' && (
                <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <h3 className="text-md font-black text-white">ترقية وتعيين "المشرف الثاني" بالنظام للتوزيع المشترك:</h3>
                  </div>

                  <form onSubmit={handleCreateSupervisor2} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400 block font-bold">اسم المشرف بالكامل:</label>
                      <input 
                        type="text"
                        required
                        value={newPromoName}
                        onChange={e => setNewPromoName(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-white text-xs text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="مثال: م. أحمد فؤاد"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400 block font-bold">هاتف المشرف المراد ترقيته (أو تسجيله):</label>
                      <input 
                        type="tel"
                        required
                        value={newPromoPhone}
                        onChange={e => setNewPromoPhone(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-white text-xs text-right focus:outline-none font-mono focus:ring-1 focus:ring-indigo-500"
                        placeholder="رقم الهاتف المسجل للمواطن"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md"
                    >
                      تأكيد ترقية "مشرف مالي ثان" 👑
                    </button>
                  </form>

                  {promoError && <p className="text-xs font-bold text-red-400 mt-2">{promoError}</p>}
                  {promoSuccess && <p className="text-xs font-bold text-emerald-400 mt-2">{promoSuccess}</p>}
                </div>
              )}
            </div>
          )}

          {/* TAB: Password Resets */}
          {activeTab === 'password_resets' && (
            <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
              <h3 className="text-md font-black text-white mb-4">طلبات استعادة الوصول وكلمات المرور:</h3>
              {passwordResetRequests.length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center font-bold">لا يوجد طلبات استعادة معلقة.</p>
              ) : (
                <div className="space-y-4">
                  {passwordResetRequests.map(req => (
                    <div key={req.id} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-black text-white">{req.name}</h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5">هاتف: {req.phone} • قومي: {req.nationalId}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusBadge(req.status)}
                          {req.processedByName && (
                            <span className="text-[10px] bg-[#25C1F2]/5 text-[#25C1F2] border border-[#25C1F2]/25 px-2.5 py-0.5 rounded font-black">
                              معتمدة من: {req.processedByName}
                            </span>
                          )}
                        </div>
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex flex-col gap-3 pt-2">
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              id={`new-password-${req.id}`}
                              placeholder="كلمة المرور الجديدة"
                              className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 w-full"
                            />
                            <button
                              onClick={async () => {
                                const input = document.getElementById(`new-password-${req.id}`) as HTMLInputElement;
                                if (!input.value) { alert('يرجى كتابة كلمة المرور الجديدة'); return; }
                                const res = await processPasswordReset(req.id, 'approved', input.value);
                                alert(res.message);
                              }}
                              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black rounded-lg text-[10px] cursor-pointer whitespace-nowrap"
                            >
                              اعتماد وتغيير كلمة المرور
                            </button>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={async () => {
                                const res = await processPasswordReset(req.id, 'rejected');
                                alert(res.message);
                              }}
                              className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-bold rounded-lg text-[10px] cursor-pointer"
                            >
                              رفض الطلب
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
                <h3 className="text-md font-black text-white mb-6">سجل العمليات المالية الشاملة لجميع الشركاء والمستثمرين:</h3>
                
                {transactions.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-10 text-center font-bold">لا يوجد سجلات مالية مقيدة حالياً بالنظام.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-400 font-bold">
                          <th className="pb-3 text-right">التاريخ</th>
                          <th className="pb-3 text-right">المستخدم / الشريك</th>
                          <th className="pb-3 text-right">نوع العملية</th>
                          <th className="pb-3 text-right">المبلغ (ج.م)</th>
                          <th className="pb-3 text-right">الوصف</th>
                          <th className="pb-3 text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...transactions].reverse().map(tx => {
                          const user = users.find(u => u.phone === tx.userPhone);
                          return (
                            <tr key={tx.id} className="border-b border-neutral-850 hover:bg-neutral-900/30 text-neutral-300">
                              <td className="py-4 font-mono text-[10px]">{new Date(tx.date).toLocaleDateString('ar-EG')}</td>
                              <td className="py-4">
                                <span className="block font-black text-white">{user?.name || 'مستخدم مجهول'}</span>
                                <span className="block text-neutral-500 font-mono text-[10px]">{tx.userPhone}</span>
                              </td>
                              <td className="py-4">
                                <span className={`px-2.5 py-0.5 rounded-lg font-black text-[9px] ${
                                  tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  tx.type === 'withdrawal' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  tx.type === 'profit' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                  {tx.type === 'deposit' ? 'إيداع نقدي' : 
                                   tx.type === 'withdrawal' ? 'سحب رصيد' : 
                                   tx.type === 'profit' ? 'تحديث أرباح' : 'استثمار'}
                                </span>
                              </td>
                              <td className="py-4 font-black text-white">{tx.amount.toLocaleString()} ج.م</td>
                              <td className="py-4 text-neutral-400 max-w-[200px] truncate">{tx.description}</td>
                              <td className="py-4 text-center">
                                <button 
                                  onClick={() => {
                                    if(confirm('هل أنت متأكد من حذف هذا السجل المالي نهائياً؟')) deleteTransaction(tx.id);
                                  }}
                                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Record Transaction Form */}
              <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
                <h3 className="text-md font-black text-white mb-4">تسجيل معاملة مالية فورية للمستشفى/المستثمر:</h3>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const tx = {
                      userPhone: formData.get('phone') as string,
                      amount: Number(formData.get('amount')),
                      type: formData.get('type') as any,
                      description: formData.get('description') as string,
                      date: new Date().toISOString(),
                      status: 'completed'
                    };
                    const ok = await saveTransaction(tx);
                    if (ok) {
                      alert('تم تسجيل العملية المالية بنجاح بالمنظومة.');
                      form.reset();
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-bold">هاتف المستخدم المعتمد:</label>
                    <input name="phone" required className="w-full bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white text-xs text-right outline-none focus:border-indigo-500" placeholder="01012345678" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-bold">المبلغ (ج.م):</label>
                    <input name="amount" type="number" required className="w-full bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white text-xs text-right outline-none focus:border-indigo-500" placeholder="5000" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-bold">نوع المعاملة:</label>
                    <select name="type" required className="w-full bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white text-xs outline-none focus:border-indigo-500">
                      <option value="deposit">إيداع / شحن رصيد</option>
                      <option value="withdrawal">سحب / مصاريف</option>
                      <option value="profit">أرباح ربع سنوية</option>
                      <option value="investment">دورة استثمارية</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-bold">ملاحظات / الوصف:</label>
                    <input name="description" required className="w-full bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-white text-xs text-right outline-none focus:border-indigo-500" placeholder="إيداع نقدي عبر المحفظة" />
                  </div>
                  <div className="lg:col-span-4 flex justify-end pt-2">
                    <button type="submit" className="w-full md:w-auto px-10 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs transition-all shadow-lg flex items-center gap-2">
                      <PlusCircle className="w-4 h-4" />
                      تأكيد وتسجيل القيد المالي
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {activeTab === 'providers' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Form to add Service Providers */}
              <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
                <h3 className="text-md font-black text-white mb-4">تسجيل وإضافة خدمات جديدة لشبكة الفروع بالمحافظات:</h3>
                
                <form onSubmit={handleSaveProvider} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 block">المحافظة الجغرافية:</label>
                      <select 
                        value={newProvider.govId}
                        onChange={e => setNewProvider(prev => ({ ...prev, govId: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                      >
                        <option value="asyut">أسيوط (الصعيد)</option>
                        <option value="qena">قنا (الصعيد)</option>
                        <option value="minya">المنيا (عروس الصعيد)</option>
                        <option value="sohag">سوهاج (قلب الصعيد)</option>
                        <option value="damietta">دمياط (الدلتا الساحلية)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 block">القطاع التجاري/الخدمي:</label>
                      <select 
                        value={newProvider.serviceType}
                        onChange={e => setNewProvider(prev => ({ ...prev, serviceType: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                      >
                        <option value="رعاية صحية">رعاية صحية وطبية</option>
                        <option value="سوبرماركت وغذاء">أقسام الغذاء والمطاعم</option>
                        <option value="تعليم وتدريب">تعليم وتدريب وتطوير</option>
                        <option value="أجهزة وموبيليا">أثاث وأجهزة وتسوق</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 block">اسم الشريك / المركز:</label>
                    <input 
                      type="text"
                      required
                      value={newProvider.name || ''}
                      onChange={e => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="مثال: مستشفى الصفا التخصصي"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 block">الخدمة المحددة المقدمة:</label>
                      <input 
                        type="text"
                        required
                        value={newProvider.serviceName || ''}
                        onChange={e => setNewProvider(prev => ({ ...prev, serviceName: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="مثال: خصم 30% على الطوارئ والعلاج"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 block">رقم للتواصل (تلفون):</label>
                      <input 
                        type="text"
                        required
                        value={newProvider.phone || ''}
                        onChange={e => setNewProvider(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none font-mono focus:ring-1 focus:ring-indigo-500"
                        placeholder="رقم الهاتف"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 block">العنوان التفصيلي ومواعيد العمل:</label>
                    <input 
                      type="text"
                      required
                      value={newProvider.workingHours || ''}
                      onChange={e => setNewProvider(prev => ({ ...prev, workingHours: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="مواعيد وساعات العمل والورديات"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 block">رابط صورة الواجهة / المقر المحتوم:</label>
                    <input 
                      type="text"
                      required
                      value={newProvider.photoUrl || ''}
                      onChange={e => setNewProvider(prev => ({ ...prev, photoUrl: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="رابط الصورة المباشرة Unsplash"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 block">شروط ونسبة العائد للمستثمر بكلمات:</label>
                    <textarea 
                      rows={3}
                      value={newProvider.description || ''}
                      onChange={e => setNewProvider(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none text-right focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer transition-all shadow-md"
                  >
                    تأكيد إضافته كشريك ومورد بالدليل
                  </button>
                </form>
              </div>

              {/* List of existing Providers with Quick Deletion option */}
              <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
                <h3 className="text-md font-black text-white mb-4">شركاء الخدمة الحاليين ومراكز الاستثمار الجغرافية:</h3>
                
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                  {providers.map(prov => (
                    <div key={prov.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-extrabold uppercase">
                          {prov.govId.toUpperCase()} • {prov.serviceType}
                        </span>
                        <h4 className="text-sm font-black text-white mt-1.5">{prov.name}</h4>
                        <p className="text-[11px] text-neutral-400">{prov.serviceName}</p>
                        <p className="text-[10px] text-neutral-500 mt-1">{prov.address} • {prov.phone}</p>
                      </div>

                      <button
                        onClick={() => deleteProvider(prov.id)}
                        className="p-3 bg-neutral-900 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-all border border-neutral-800 cursor-pointer"
                        title="حذف الشريك من دليل المحافظة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: Supervisors Management Panel (Main Admin Exclusive) */}
          {activeTab === 'supervisors' && isMainAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Add Supervisor Form */}
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-rose-950/20 border-2 border-rose-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400">👑</span>
                  <div>
                    <h3 className="text-md font-black text-white">تأسيس مشرف أول أو مشرف ثانٍ جديد:</h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">سجل الحساب مباشرة بالصلاحيات والمفاتيح الضرورية للرقابة.</p>
                  </div>
                </div>

                <form onSubmit={handleCreateSupervisor} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-450 block">اسم المشرف بالكامل:</label>
                    <input 
                      type="text"
                      required
                      value={newSuperName}
                      onChange={e => setNewSuperName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                      placeholder="مثال: م. أحمد عبد الله"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-450 block">رقم الهاتف المحمول (الرمز السري الفريد):</label>
                      <input 
                        type="tel"
                        required
                        value={newSuperPhone}
                        onChange={e => setNewSuperPhone(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs font-mono text-left focus:outline-none focus:ring-1 focus:ring-rose-500"
                        placeholder="مثل: 010xxxxxxxx"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-450 block">كلمة مرور الحساب:</label>
                      <input 
                        type="password"
                        required
                        value={newSuperPassword}
                        onChange={e => setNewSuperPassword(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs text-left focus:outline-none focus:ring-1 focus:ring-rose-500"
                        placeholder="أدخل كلمة المرور"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 block">تصنيف الرتبة الإشرافية:</label>
                      <select 
                        value={newSuperRole}
                        onChange={e => setNewSuperRole(e.target.value as 'admin' | 'supervisor2')}
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                      >
                        <option value="admin">مشرف مالي أول (مدير عام نظام كامل - admin)</option>
                        <option value="supervisor2">مشرف مالي ثانٍ (شريك جغرافي مساعد - supervisor2)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-450 block">الرقم القومي (اختياري للتدقيق):</label>
                      <input 
                        type="text"
                        value={newSuperNationalId}
                        onChange={e => setNewSuperNationalId(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs font-mono text-left focus:outline-none focus:ring-1 focus:ring-rose-500"
                        placeholder="14 رقم قومي صحيح"
                      />
                    </div>
                  </div>

                  {superError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400">
                      ⚠️ {superError}
                    </div>
                  )}

                  {superSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                      🍀 {superSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-black cursor-pointer transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>تأكيد تسجيل وتفعيل رتبة المشرف فوراً</span>
                  </button>
                </form>
              </div>

              {/* List of current supervisors */}
              <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-neutral-850 pb-3">
                  <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                  <h3 className="text-md font-black text-white">طاقم الإدارة والمشرفين الحاليين بمصر:</h3>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {users
                    .filter(u => u.role === 'admin' || u.role === 'supervisor2')
                    .map(u => {
                      const isSelf = u.phone === currentUser?.phone;
                      return (
                        <div key={u.phone} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 hover:border-neutral-800 transition-all">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-black text-white">{u.name}</h4>
                                {isSelf && (
                                  <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/30">حسابك الحالي</span>
                                )}
                              </div>
                              <div className="flex flex-col gap-1 mt-1 text-[11px] text-neutral-400">
                                <p className="font-mono"><span className="text-neutral-500">هاتف الدخول:</span> {u.phone}</p>
                                {u.username && <p className="font-mono"><span className="text-neutral-500">اليوزر نيم:</span> {u.username}</p>}
                                {u.identificationCode && <p className="font-mono text-rose-400"><span className="text-neutral-500">الكود التعريفي:</span> {u.identificationCode}</p>}
                                {u.nationalId && <p className="font-mono"><span className="text-neutral-500">رقم البطاقة:</span> {u.nationalId}</p>}
                                {u.password && <p className="text-[10px] text-indigo-400 font-mono"><span className="text-neutral-500">السري / الباسورد:</span> <span className="underline font-bold bg-neutral-900 px-1 py-0.5 rounded">{u.password}</span></p>}
                              </div>
                              <div className="mt-3 flex items-center gap-2 flex-wrap">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                                  u.role === 'admin' 
                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                }`}>
                                  {u.role === 'admin' ? '👑 مشرف أول (أدمن مالي)' : '👥 مشرف ثانٍ (جغرافي)'}
                                </span>
                                {u.approved ? (
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">نشط</span>
                                ) : (
                                  <span className="text-[9px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-bold">معلق ومجمد</span>
                                )}
                              </div>
                            </div>

                            {!isSelf && (
                              <div className="flex flex-col gap-2">
                                {/* Demote or Deactivate options */}
                                <button
                                  onClick={async () => {
                                    if (confirm(`هل أنت متأكد من سحب صلاحيات الإشراف وتحويل الموظف ${u.name} لمستثمر عادي؟`)) {
                                      await approveUser(u.phone, true, [], 'user');
                                    }
                                  }}
                                  className="px-2.5 py-1.5 bg-neutral-920 hover:bg-rose-550/10 border border-neutral-800 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400 rounded-xl transition-all font-bold text-[9px] cursor-pointer"
                                  title="تحويل لرتبة مستثمر عادي بسحب صلاحيات الإشراف"
                                >
                                  سحب الصلاحية ❌
                                </button>
                                
                                <button
                                  onClick={async () => {
                                    const actionText = u.role === 'admin' ? 'supervisor2' : 'admin';
                                    const label = u.role === 'admin' ? 'مشرف مساعد ثان' : 'مشرف عام أول';
                                    if (confirm(`هل ترغب في تغيير رتبة المشرف ${u.name} إلى ${label}؟`)) {
                                      await approveUser(u.phone, true, ['all'], actionText);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 bg-neutral-920 hover:bg-indigo-550/10 border border-neutral-800 hover:border-indigo-500/30 text-neutral-400 hover:text-indigo-400 rounded-xl transition-all font-bold text-[9px] cursor-pointer"
                                  title="تغيير الرتبة بين مشرف أول ومشرف ثان"
                                >
                                  تغيير التصنيف 🔄
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
