import React from 'react';
import { useCMS } from '../CMSContext';
import { User, ShopOrder, Product } from '../types';
import { ShoppingBag, Landmark, Clock, CheckCircle, Truck, RefreshCw, Smartphone, MapPin, TrendingUp, Briefcase, ChevronRight, ChevronLeft, HelpCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MyOrdersProps {
  currentUser: User | null;
}

interface OrderStep {
  title: string;
  shortDesc: string;
  longDesc: string;
  tip: string;
}

const ORDER_STEPS: OrderStep[] = [
  {
    title: 'طلب الحجز المبدئي',
    shortDesc: 'تقديم وتدقيق الهوية والبيانات المالية',
    longDesc: 'تم استلام طلب الاستثمار الخاص بك بنجاح، ويقوم فريق التدقيق المالي والإداري حالياً بالتحقق من صحة المستندات المرفقة وتطابقها مع شروط الشراكة العامة لشركة شوجر بيزنس إي جي.',
    tip: 'مراجعة أولية خلال 12-24 ساعة عمل'
  },
  {
    title: 'المطابقة والاعتماد الإداري',
    shortDesc: 'مراجعة نموذج التعاقد وصياغة العقد',
    longDesc: 'تتم مراجعة طلب الحجز المالي واعتماد مطابقة الشروط، يتبعها البدء في تحرير وثيقة الإيداع ومسودة العقد النهائي مع تفصيل شامل لنسب الأرباح ومواعيد جدول الصرف والتحصيل.',
    tip: 'خلال 24 ساعة من تاريخ الموافقة'
  },
  {
    title: 'التسوية وتسييل المبلغ المالي',
    shortDesc: 'اعتماد سداد الحساب وبدء التشغيل التجاري',
    longDesc: 'إيداع وتأكيد المبالغ المالية المطلوبة بداخل حسابات الشركة المعتمدة بمصر، وبدء تحصيله وتوظيفه فورياً في المشروعات التشغيلية النشطة لضمان بدء تدفق عوائدك بفعالية دقيقة.',
    tip: 'بشكل فوري بعد تأكيد المعاملة المالية'
  },
  {
    title: 'تفعيل الاستثمار والتحصيل الرئيسي',
    shortDesc: 'توزيع العوائد وسندات الأسهم النهائية',
    longDesc: 'تهانينا الحارة! تم تشغيل الاستثمار بالكامل وصدور شهادة أسهم الملكية المعتمدة رسمياً، لتبدأ دورات استلامك للأرباح المباشرة وسحبها في أي وقت من خلال السجل المالي.',
    tip: 'مستثمر نشط بداخل المنظومة 🟢'
  }
];

const getCurrentStepIndex = (status: string) => {
  if (status === 'pending') return 0;
  if (status === 'approved') return 1;
  if (status === 'delivered') return 3;
  return 0; // fallback
};

export const MyOrders: React.FC<MyOrdersProps> = ({ currentUser }) => {
  const { orders, products, refreshData } = useCMS();

  if (!currentUser) {
    return (
      <div className="py-24 px-4 text-center select-none bg-neutral-950/45 min-h-screen flex flex-col items-center justify-center">
        <Clock className="w-12 h-12 text-[#25C1F2] mb-4 animate-spin" />
        <h3 className="text-md font-bold text-white">برجاء تسجيل الدخول أولاً للوصول لطلباتك وحجوزاتك الحية.</h3>
      </div>
    );
  }

  // Filter orders matching current user
  const myOrders = orders.filter(o => o.userPhone === currentUser.phone);

  const getProductTitleAndPhoto = (prodId: string) => {
    const p = products.find(prod => prod.id === prodId);
    return {
      title: p?.title || "عرض استثماري أو منتج شريك",
      photoUrl: p?.photoUrl || "https://images.unsplash.com/photo-1546213290-e1b76103e541?auto=format"
    };
  };

  const statusMap: Record<string, { label: string, colorClass: string, icon: any }> = {
    pending: { label: 'قيد المراجعة والتدقيق', colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
    approved: { label: 'تمت الموافقة والتنسيق 🟢', colorClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: CheckCircle },
    rejected: { label: 'العرض معلق كلياً 🔴', colorClass: 'bg-red-500/10 text-red-400 border-red-500/20', icon: Clock },
    delivered: { label: 'تم التسليم والتحصيل الفعلي ✓', colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Truck },
  };

  const { transactions } = useCMS();
  const myTransactions = transactions.filter(t => t.userPhone === currentUser.phone);
  const [activeTab, setActiveTab] = React.useState<'orders' | 'transactions'>('orders');
  const [selectedSteps, setSelectedSteps] = React.useState<Record<string, number>>({});

  return (
    <div className="py-12 bg-neutral-950 min-h-screen text-right" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header containing refreshing capabilities */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-neutral-850 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#25C1F2]" />
              <span>لوحة متابعة نشاط العضو</span>
            </h1>
            <p className="text-xs text-neutral-400 font-medium mt-1.5">
              تتبع فواتير وعقود طلبات السلع والخدمات وتاريخ معاملاتك المالية بنظام شوجر بيزنس إي جي.
            </p>
          </div>

          <button
            onClick={() => refreshData()}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin duration-3000" />
            <span>تحديث البيانات المباشرة</span>
          </button>
        </div>

        {/* Tabs switcher */}
        <div className="flex items-center gap-2 mb-8 bg-neutral-900/50 p-1 rounded-2xl border border-neutral-850 w-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            طلبات الشراء ({myOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'transactions' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            السجل المالي ({myTransactions.length})
          </button>
        </div>

        {activeTab === 'orders' ? (
          myOrders.length === 0 ? (
            <div className="py-20 px-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 text-lg">🛍️</div>
              <h3 className="text-md font-bold text-white">لم يتم تسجيل أي طلبات شراء بالمتجر لك حتى الآن.</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                يمكنك زيارة "المتجر الإلكتروني" وتحديد سلع الشركاء وحجزها مباشرة لتظهر فواتيرك التفصيلية هنا في ثوانٍ.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {myOrders.map((ord) => {
                const info = getProductTitleAndPhoto(ord.productId);
                const status = statusMap[ord.status] || statusMap.pending;
                const StatusIcon = status.icon;

                return (
                  <div key={ord.id} className="bg-neutral-900/60 border border-neutral-850 hover:border-neutral-800 rounded-3xl p-6 shadow-xl transition-all duration-200">
                    <div className="flex flex-col md:flex-row gap-6">
                      
                      {/* Compact Product Mini banner */}
                      <div className="w-full md:w-32 h-20 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                        <img 
                          src={info.photoUrl} 
                          alt={info.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        
                        {/* Top title and dynamic status grid */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono tracking-widest text-[#25C1F2] block mb-1">
                              كود المعاملة: {ord.id.substring(0, 8).toUpperCase()}
                            </span>
                            <h3 className="text-sm sm:text-md font-black text-white leading-snug">
                              {info.title}
                            </h3>
                          </div>

                          {/* Order status pill */}
                          <div className={`px-3.5 py-1 text-[11px] font-extrabold rounded-full border flex items-center gap-1.5 ${status.colorClass}`}>
                            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{status.label}</span>
                          </div>
                        </div>

                        {/* Info lines */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-neutral-850 text-xs">
                          
                          <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 font-bold block">تاريخ إصدار الحجز:</span>
                            <span className="text-neutral-300 font-semibold">{new Date(ord.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 font-bold block">طريقة ونمط السداد:</span>
                            <span className="text-indigo-400 font-extrabold">
                              {ord.paymentMethod === 'online' ? '💳 بطاقة بنكية ومحافظ رقمية' : '💵 الدفع عند التوصيل'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 font-bold block">موقع وعنوان التسليم:</span>
                            <span className="text-neutral-300 line-clamp-1 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-500" />
                              {ord.userAddress}
                            </span>
                          </div>

                        </div>

                      </div>
                    </div>

                    {/* Interactive Live Tracking Stepper Section */}
                    {ord.status === 'rejected' ? (
                      <div className="mt-6 pt-5 border-t border-neutral-850">
                        <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3.5 text-right">
                          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <div className="space-y-1.5 flex-1">
                            <h4 className="text-xs sm:text-sm font-black text-red-400">لقد تم تعليق طلب أو عرض الحجز الاستثماري مؤقتاً ⚠️</h4>
                            <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed font-semibold">
                              نأسف، تم تعليق طلبك الاستثماري لمراجعة شروط الحد الأدنى للإيداع أو عدم مطابقة وثائق التحقق القانوني المرفقة. نرجو منك التواصل الفوري مع مرشدك المالي المباشر أو فرع إدارة شوجر بيزنس لتصحيح وضعية الطلب وتنشيط دورتك الاستثمارية فوراً.
                            </p>
                            <a 
                              href={`https://wa.me/201201977755?text=${encodeURIComponent(`مرحباً مخلصين شركة شوجر بيزنس إي جي، أود المساعدة في مراجعة سبب تعليق الطلب كود (#${ord.id.substring(0,8).toUpperCase()}) للسلعة/العرض الاستثماري: ${info.title}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-black px-4 py-2 rounded-xl border border-red-500/30 text-[10px] mt-2.5 transition-all shadow-sm"
                            >
                              <span>تحدث مع مرشدك المالي للحل السريع 💬</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 pt-5 border-t border-neutral-850 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-neutral-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#25C1F2] animate-pulse" />
                            <span>تتبع مراحل الحجز التفاعلية للطلب:</span>
                          </h4>
                          <span className="text-[10px] text-indigo-400 font-extrabold animate-pulse hidden sm:inline">
                            (اضغط على إحدى المراحل بالأسفل لتفاصيل الإجراء المطلوب 💡)
                          </span>
                        </div>

                        {/* Stepper Progress Bar Row */}
                        <div className="relative flex items-center justify-between w-full my-6 px-4">
                          {/* The Gray Bottom Pipeline */}
                          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[3px] bg-neutral-800 rounded-full z-0" />
                          
                          {/* The Blue Progress Fill Line */}
                          <div 
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-[3px] bg-[#25C1F2] rounded-full z-0 transition-all duration-500 origin-right shadow-[0_0_8px_rgba(37,193,242,0.4)]"
                            style={{ 
                              left: `calc(${100 - (getCurrentStepIndex(ord.status) / 3) * 100}% + 16px)`,
                              right: '16px'
                            }} 
                          />

                          {/* Interactive Milestone Hub */}
                          {ORDER_STEPS.map((step, idx) => {
                            const currentIdx = getCurrentStepIndex(ord.status);
                            const activeStep = selectedSteps[ord.id] !== undefined ? selectedSteps[ord.id] : currentIdx;
                            
                            const isCompleted = idx < currentIdx;
                            const isCurrent = idx === currentIdx;
                            const isSelected = idx === activeStep;

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSelectedSteps(prev => ({ ...prev, [ord.id]: idx }));
                                }}
                                className={`relative z-10 w-8.5 h-8.5 rounded-full flex items-center justify-center font-black text-xs transition-all duration-350 cursor-pointer ${
                                  isCompleted 
                                    ? 'bg-[#25C1F2] text-neutral-950 border-2 border-[#25C1F2] shadow-md shadow-[#25C1F2]/20' 
                                    : isCurrent
                                    ? 'bg-neutral-900 text-[#25C1F2] border-2 border-[#25C1F2] ring-4 ring-[#25C1F2]/20 animate-pulse'
                                    : 'bg-neutral-950 text-neutral-500 border-2 border-neutral-800 hover:border-neutral-700'
                                } ${isSelected ? 'scale-120 ring-2 ring-indigo-500 shadow-xl' : ''}`}
                                aria-label={step.title}
                              >
                                {isCompleted ? '✓' : idx + 1}
                                
                                {/* Micro-text captions for layout cleanliness */}
                                <span className={`absolute top-9 whitespace-nowrap text-[9px] font-black tracking-tight transition-all max-w-[70px] truncate ${
                                  isSelected ? 'text-[#25C1F2] scale-105' : isCompleted || isCurrent ? 'text-neutral-300' : 'text-neutral-500'
                                }`}>
                                  {step.title.split(' ')[0]} {step.title.split(' ')[1] || ''}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Display Detailed Panel about the selected step */}
                        <AnimatePresence mode="wait">
                          {(() => {
                            const currentIdx = getCurrentStepIndex(ord.status);
                            const activeStep = selectedSteps[ord.id] !== undefined ? selectedSteps[ord.id] : currentIdx;
                            const activeStepData = ORDER_STEPS[activeStep];

                            return (
                              <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className={`p-4.5 rounded-2xl border transition-colors ${
                                  activeStep === currentIdx
                                    ? 'bg-indigo-950/10 border-indigo-500/20'
                                    : 'bg-neutral-950/60 border-neutral-850/80 shadow-inner'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-neutral-850/40 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                      activeStep < currentIdx ? 'bg-emerald-400 shadow-sm shadow-emerald-400/35' :
                                      activeStep === currentIdx ? 'bg-amber-400 shadow-sm shadow-amber-400/35 animate-pulse' : 'bg-neutral-700'
                                    }`} />
                                    <h5 className="text-xs sm:text-sm font-black text-white">
                                      المرحلة {activeStep + 1}: {activeStepData.title}
                                    </h5>
                                    {activeStep === currentIdx && (
                                      <span className="text-[8px] sm:text-[9px] font-black text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 animate-pulse">
                                        المرحلة الحالية للطلب 🟢
                                      </span>
                                    )}
                                    {activeStep < currentIdx && (
                                      <span className="text-[8px] sm:text-[9px] font-black text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                                        مكتملة ✓
                                      </span>
                                    )}
                                    {activeStep > currentIdx && (
                                      <span className="text-[8px] sm:text-[9px] font-black text-neutral-500 bg-neutral-900/80 px-2.5 py-0.5 rounded border border-neutral-800">
                                        انتظار اكتمال ما يسبقها
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[9px] text-[#25C1F2] font-black bg-[#25C1F2]/5 px-2.5 py-1 rounded-lg border border-[#25C1F2]/10 w-fit">
                                    ⏱️ المعدل الزمني المقدر: {activeStepData.tip}
                                  </div>
                                </div>

                                <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed font-semibold">
                                  {activeStepData.longDesc}
                                </p>

                                <div className="mt-3.5 pt-3 border-t border-neutral-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px]">
                                  <div className="flex items-center gap-1.5 text-neutral-400">
                                    <HelpCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                    <span className="font-extrabold text-white">الإجراء المطلوب منك:</span>
                                    <span className="font-bold text-neutral-350">
                                      {activeStep === 0 ? 'مراجعة بياناتك وانتظار مكالمة هاتفية من ممثلي شوجر بيزنس لتأكيد الطلب.' :
                                       activeStep === 1 ? 'تحضير الهوية الوطنية للتحقق وصياغة وثيقة بنود العائد بالشراكة.' :
                                       activeStep === 2 ? 'المباشرة في سداد الحصص أو الإيداع في الحساب الرسمي للشركة لإتمام التوزيع.' :
                                       'لا بد من الاستمتاع بأرباحك الاستثمارية النشطة بمحفظتك! تم التفعيل بالكامل.'}
                                    </span>
                                  </div>
                                  
                                  <a 
                                    href={`https://wa.me/201201977755?text=${encodeURIComponent(`مرحباً فريق شوجر بيزنس إي جي، أود المساعدة بخصوص الطلب كود (#${ord.id.substring(0,8).toUpperCase()}) في المرحلة رقم (${activeStep + 1}): ${activeStepData.title}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#25C1F2] hover:text-[#25C1F2]/80 font-black flex items-center justify-center gap-1 bg-[#25C1F2]/5 hover:bg-[#25C1F2]/10 px-3 py-1.5 rounded-xl transition-all shrink-0 border border-[#25C1F2]/10"
                                  >
                                    <span>طلب استشارة أو دعم مباشر 💬</span>
                                  </a>
                                </div>
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )
        ) : (
          myTransactions.length === 0 ? (
            <div className="py-20 px-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 text-lg">💸</div>
              <h3 className="text-md font-bold text-white">لا توجد معاملات مالية مسجلة في حسابك حالياً.</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                بمجرد تفعيل باقتك الاستثمارية وبدء عمليات الإيداع أو سحب الأرباح، ستظهر جميع تفاصيل معاملاتك الموثقة هنا بشكل آلي.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                  <span className="text-[10px] text-emerald-400 font-bold block mb-1">إجمالي الإيداعات</span>
                  <span className="text-xl font-black text-white">
                    {myTransactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} ج.م
                  </span>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl">
                  <span className="text-[10px] text-indigo-400 font-bold block mb-1">الأرباح المودعة</span>
                  <span className="text-xl font-black text-white">
                    {myTransactions.filter(t => t.type === 'profit' && t.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} ج.م
                  </span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl">
                  <span className="text-[10px] text-amber-400 font-bold block mb-1">إجمالي السحوبات</span>
                  <span className="text-xl font-black text-white">
                    {myTransactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} ج.م
                  </span>
                </div>
              </div>

              {/* Transaction List */}
              <div className="space-y-3">
                {myTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((tx) => (
                  <div key={tx.id} className="bg-neutral-900/60 border border-neutral-850 hover:border-neutral-800 rounded-2xl p-5 flex items-center justify-between gap-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                        tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' :
                        tx.type === 'withdrawal' ? 'bg-amber-500/20 text-amber-400' :
                        tx.type === 'profit' ? 'bg-indigo-500/20 text-indigo-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {tx.type === 'deposit' ? <Landmark className="w-5 h-5" /> :
                         tx.type === 'withdrawal' ? <ShoppingBag className="w-5 h-5" /> :
                         tx.type === 'profit' ? <TrendingUp className="w-5 h-5" /> :
                         <Briefcase className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{tx.description}</h4>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className={`text-md font-black block ${
                        tx.type === 'deposit' || tx.type === 'profit' ? 'text-emerald-400' : 'text-neutral-200'
                      }`}>
                        {tx.type === 'withdrawal' || tx.type === 'investment' ? '-' : '+'}{tx.amount.toLocaleString()} ج.م
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${
                        tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        tx.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-neutral-800 text-neutral-400 border-neutral-700 font-mono tracking-tighter'
                      }`}>
                        {tx.status === 'completed' ? 'تـمّ التوثيق' : tx.status === 'failed' ? 'معاملة مرفوضة' : 'قيد التدقيق..'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

      </div>
    </div>
  );
};
