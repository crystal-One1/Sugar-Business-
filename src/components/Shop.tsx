import React, { useState, useEffect } from 'react';
import { useCMS } from '../CMSContext';
import { User, Product } from '../types';
import { PlusCircle, ShoppingCart, Lock, Trash2, Edit2, Archive, ShieldCheck, Heart, MessageCircle, ExternalLink, HelpCircle, Pin, Scale, Check, Minus, Bell, BellRing, Star, Search, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { motion, AnimatePresence } from 'motion/react';
import { FeedbackModal } from './FeedbackModal';

const FieldTooltip: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="group relative inline-block cursor-help mr-1.5 align-middle select-none">
      <HelpCircle className="w-3.5 h-3.5 text-neutral-500 hover:text-[#25C1F2] transition-colors" />
      <div className="absolute z-50 bottom-full right-1/2 translate-x-1/2 mb-2 w-56 p-2.5 bg-neutral-950 border border-neutral-800 text-neutral-300 text-[10px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition-all duration-200 text-right leading-relaxed font-bold">
        {text}
        <div className="absolute top-full right-1/2 translate-x-1/2 border-4 border-transparent border-t-neutral-950" />
      </div>
    </div>
  );
};

interface ShopProps {
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Shop: React.FC<ShopProps> = ({ currentUser, onOpenAuth }) => {
  const { 
    products, 
    saveProduct, 
    deleteProduct, 
    submitOrder, 
    settings, 
    toggleFollowProduct,
    toggleFavoriteProduct,
    submitProductReview
  } = useCMS();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  
  // Checkout Modal states
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentOption, setPaymentOption] = useState<'online' | 'cash'>('cash');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Guest Redirect Modal
  const [guestProduct, setGuestProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Product Reviews State
  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<string>('');

  const getProductRatingInfo = (prod: Product) => {
    const reviews = prod.reviews || [];
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return { avg: Math.round((total / reviews.length) * 10) / 10, count: reviews.length };
  };

  // Feedback State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { submitFeedback } = useCMS();

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Mobile Swiper States
  const [mobileIndex, setMobileIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

  const toggleCompare = (id: string) => {
    setCompareIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const compareProducts = products.filter(p => compareIds.includes(p.id));

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'realestate', label: 'استثمار عقاري' },
    { id: 'commercial', label: 'استثمار تجاري' },
    { id: 'agricultural', label: 'استثمار زراعي' },
    { id: 'industrial', label: 'استثمار صناعي' },
    { id: 'services', label: 'نشاطات خدمية' }
  ];

  const isExecutive = currentUser?.role === 'admin' || currentUser?.role === 'supervisor2';

  const handleOpenAdd = () => {
    setEditingProduct({
      title: '',
      price: 150,
      description: '',
      photoUrl: 'https://images.unsplash.com/photo-1546213290-e1b76103e541?auto=format&fit=crop&q=80&w=400',
      providerName: 'مؤسسة شوجر بيزنس المعتمدة',
      category: 'commercial',
      returns: 40,
      isPinned: false,
      status: 'available',
      audience: 'all'
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const ok = await saveProduct(editingProduct);
    if (ok) {
      setIsEditModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج من متجر شوجر بالكامل؟')) {
      await deleteProduct(id);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForOrder) return;
    const ok = await submitOrder(selectedProductForOrder.id, shippingAddress, paymentOption);
    if (ok) {
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        setSelectedProductForOrder(null);
        setShippingAddress('');
        // Trigger feedback modal shortly after order success
        setTimeout(() => setIsFeedbackOpen(true), 1500);
      }, 3500);
    }
  };

  const handleTogglePin = async (prod: Product) => {
    const updatedProd = { ...prod, isPinned: !prod.isPinned };
    await saveProduct(updatedProd);
  };

  const exportToPDF = async (product: Product) => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      // Create a temporary element for the PDF content
      const element = document.createElement('div');
      element.style.position = 'fixed';
      element.style.left = '-9999px';
      element.style.top = '0';
      element.style.padding = '50px';
      element.style.background = '#ffffff';
      element.style.color = '#000000';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.direction = 'rtl';
      element.style.width = '800px';
      element.innerHTML = `
        <div style="border: 2px solid #25C1F2; border-radius: 20px; overflow: hidden;">
          <div style="background: #25C1F2; padding: 30px; text-align: center; color: #000;">
            <h1 style="font-size: 32px; font-weight: 900; margin: 0;">تقرير تفاصيل الاستثمار - شوجر بيزنس</h1>
            <p style="font-size: 14px; opacity: 0.8; margin-top: 10px;">إصدار التقرير التقني لعام 2026</p>
          </div>
          
          <div style="padding: 40px;">
            <div style="display: flex; gap: 30px; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 40px;">
              <div style="flex: 1;">
                <h2 style="font-size: 24px; font-weight: 800; color: #1a1a1a; margin: 0 0 15px 0;">${product.title}</h2>
                <p style="font-size: 15px; line-height: 1.8; color: #444; margin: 0;">${product.description}</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-bottom: 40px;">
              <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border-right: 5px solid #25C1F2;">
                <p style="font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">القيمة الاستثمارية</p>
                <p style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0;">${product.price.toLocaleString('ar-EG')} جنيه مصري</p>
              </div>
              <div style="background: #f0fdf4; padding: 25px; border-radius: 15px; border-right: 5px solid #10b981;">
                <p style="font-size: 11px; font-weight: 900; color: #166534; text-transform: uppercase; margin-bottom: 8px;">العوائد المتوقعة</p>
                <p style="font-size: 22px; font-weight: 900; color: #14532d; margin: 0;">${product.returns ? `${product.returns}% سنوياً` : 'بدون تفاصيل'}</p>
              </div>
              <div style="background: #f1f5f9; padding: 25px; border-radius: 15px;">
                <p style="font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">تصنيف الاستثمار</p>
                <p style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0;">${categories.find(c => c.id === product.category)?.label}</p>
              </div>
              <div style="background: #f1f5f9; padding: 25px; border-radius: 15px;">
                <p style="font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">الجهة المسؤولة</p>
                <p style="font-size: 18px; font-weight: 700; color: #1e40af; margin: 0;">${product.providerName || 'مؤسسة شوجر بيزنس'}</p>
              </div>
            </div>

            <div style="background: #fff7ed; padding: 25px; border-radius: 15px; border: 1px dashed #fdba74; margin-bottom: 40px;">
              <p style="font-size: 13px; font-weight: 700; color: #9a3412; margin-bottom: 10px;">إخلاء مسؤولية استثمارية:</p>
              <p style="font-size: 12px; line-height: 1.6; color: #7c2d12; margin: 0;">
                هذه الوثيقة هي عرض استثماري مقدم عبر منصة شوجر بيزنس. الأرقام المذكورة هي تقديرات بناءً على دراسات الجدوى الحالية. الاستثمار يحمل دائماً درجة من المخاطرة. يرجى مراجعة القوانين واللوائح قبل إتمام أي تعاقد رسمي.
              </p>
            </div>

            <div style="text-align: center; border-top: 1px solid #eee; padding-top: 30px;">
              <p style="font-size: 11px; color: #94a3b8; font-weight: 600;">صدرت هذه الوثيقة إلكترونياً من خلال sugarbusiness-eg.com</p>
              <p style="font-size: 10px; color: #cbd5e1; margin-top: 5px;">كود الاستثمار المرجعي: ${product.id.slice(0, 8)}</p>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(element);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Investment-Report-${product.title}.pdf`);

      document.body.removeChild(element);
      
      if (currentUser) {
        trackEvent(currentUser, 'export_details', { productId: product.id, productTitle: product.title });
      }
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('نعتذر، حدث خطأ أثناء تصدير ملف PDF. يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.');
    }
  };

  // Sort and Filter products: pinned first, then filter by category and search term
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const catLabel = categories.find(c => c.id === p.category)?.label || '';
    const matchesSearch = p.title.toLowerCase().includes(term) || catLabel.toLowerCase().includes(term);
    const matchesFavorites = !showFavoritesOnly || (currentUser && currentUser.favoriteProductIds?.includes(p.id));
    return matchesCategory && matchesSearch && matchesFavorites;
  });

  const autocompleteResults = searchTerm.length > 1 
    ? products.filter(p => {
        const term = searchTerm.toLowerCase();
        const catLabel = categories.find(c => c.id === p.category)?.label || '';
        return p.title.toLowerCase().includes(term) || catLabel.toLowerCase().includes(term);
      }).slice(0, 5)
    : [];
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Reset mobile card index back to zero whenever results change to avoid array overflow or index mismatch
  useEffect(() => {
    setMobileIndex(0);
  }, [sortedProducts.length, selectedCategory, searchTerm]);

  // WhatsApp Link generator for guest checkout redirection
  const getGuestWhatsAppLink = (prod: Product) => {
    const text = `مرحباً خدمة عملاء شوجر بيزنس إي جي، أود شراء المنتج المعروض بالمتجر الإلكتروني:\n- المنتج: ${prod.title}\n- السعر المذكور: ${prod.price} جنيه مصري.\nأنا مستخدم غير مسجل حالياً وأرغب في المساعدة.`;
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="py-12 bg-neutral-950 min-h-screen text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with modern responsive stats */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 to-neutral-950 p-8 md:p-12 mb-12 border border-neutral-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#25C1F2]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25C1F2]/10 text-[#25C1F2] text-xs font-black mb-6">
              <Archive className="w-3.5 h-3.5" />
              <span>المتجر الإلكتروني الموحد لعام 2026</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              تصفح وحجز أقوى المنتجات لشركاء شوجر بيزنس
            </h1>
            <p className="text-sm md:text-base text-neutral-400 mt-4 leading-relaxed">
              نوفر لجميع الزوار والمستثمرين منصة شراء وحجز موحدة لأفضل الخدمات والمستلزمات الحياتية بأسعار معلنة وضغطة زر، بموجب تعاقداتنا الشاملة مع الشركاء بالجمهورية.
            </p>

            {isExecutive && (
              <button 
                onClick={handleOpenAdd}
                className="mt-8 px-6 py-3.5 bg-[#25C1F2] hover:bg-[#25C1F2]/90 text-neutral-950 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة منتج أو باقة جديدة للمعرض</span>
              </button>
            )}
          </div>
        </div>

        {/* Integrated Options & Filters Module */}
        <div className="max-w-3xl mx-auto mb-16 relative z-30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-3 shadow-2xl shadow-black/50"
          >
            {/* Search Input Subsection */}
            <div className="relative mb-3">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-[#25C1F2] transition-colors" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowAutocomplete(true);
                }}
                onFocus={() => setShowAutocomplete(true)}
                placeholder="ابحث عن فرصة استثمارية أو منتج محدد..."
                className="w-full bg-black/40 border border-white/5 focus:border-[#25C1F2]/50 rounded-[1.8rem] py-4 pr-14 pl-12 text-sm text-white focus:outline-none focus:ring-4 focus:ring-[#25C1F2]/5 transition-all placeholder:text-neutral-600 font-medium"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute left-5 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-white/5 text-neutral-500 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Autocomplete Results Inside Module */}
              <AnimatePresence>
                {showAutocomplete && autocompleteResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-full right-0 left-0 mt-3 bg-neutral-900 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-white/5 bg-white/5">
                       <p className="text-[10px] font-black text-neutral-500 px-3 py-1 uppercase tracking-widest">المقترحات الذكية</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {autocompleteResults.map((res) => (
                        <button
                          key={res.id}
                          onClick={() => {
                            setSearchTerm(res.title);
                            setShowAutocomplete(false);
                          }}
                          className="w-full text-right p-4 hover:bg-white/5 flex items-center gap-4 transition-all group border-b border-white/5 last:border-0"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-inner">
                            <img src={res.photoUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate group-hover:text-[#25C1F2] transition-colors">{res.title}</p>
                            <span className="text-[10px] text-neutral-400 font-bold">{categories.find(c => c.id === res.category)?.label}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-[#25C1F2] transition-all" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Pills Subsection */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1 custom-scrollbar no-scrollbar" dir="rtl">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowFavoritesOnly(false);
                  }}
                  className={`px-6 py-3 rounded-[1.4rem] text-[10px] font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                    selectedCategory === cat.id && !showFavoritesOnly
                      ? 'bg-[#25C1F2] text-neutral-950 border-[#25C1F2] shadow-xl shadow-[#25C1F2]/20'
                      : 'bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <motion.div
                    animate={selectedCategory === cat.id && !showFavoritesOnly ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat.id && !showFavoritesOnly ? 'bg-neutral-950' : 'bg-neutral-600'}`}
                  />
                  {cat.label}
                </button>
              ))}

              {currentUser && (
                <>
                  <div className="h-6 w-px bg-white/10 mx-1.5 shrink-0" />
                  <button
                    onClick={() => {
                      setShowFavoritesOnly(!showFavoritesOnly);
                      if (!showFavoritesOnly) {
                        setSelectedCategory('all');
                      }
                    }}
                    className={`px-6 py-3 rounded-[1.4rem] text-[10px] font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                      showFavoritesOnly
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xl shadow-rose-500/20'
                        : 'bg-rose-950/20 text-rose-400 border-rose-900/30 hover:bg-rose-900/30 hover:text-rose-300'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current text-white animate-pulse' : 'text-rose-400'}`} />
                    <span>مفضلتي ({currentUser.favoriteProductIds?.length || 0}) ❤️</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Close overlay when autocomplete is active */}
          {showAutocomplete && autocompleteResults.length > 0 && (
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setShowAutocomplete(false)} />
          )}
        </div>

        {/* Catalog Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-neutral-950 border border-neutral-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-neutral-500 shadow-inner">
              {showFavoritesOnly ? '❤️' : '🔍'}
            </div>
            <h3 className="text-md sm:text-lg font-black text-white">
              {showFavoritesOnly ? 'قائمة المفضلة فارغة' : 'لم نجد أي نتائج متطابقة'}
            </h3>
            <p className="text-xs text-neutral-400 mt-2 font-medium leading-relaxed">
              {showFavoritesOnly 
                ? 'قم بالضغط على أيقونة القلب على أي فرصة استثمارية بالمتجر لحفظها في هذه الصفحة والرجوع إليها لاحقاً بسهولة.' 
                : 'يرجى مراجعة كلمة البحث أو فئة التصنيف المحددة والمحاولة مجدداً.'}
            </p>
            {showFavoritesOnly && (
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="mt-6 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                تصفح كافة الفرص الاستثمارية
              </button>
            )}
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sortedProducts.map((prod) => {
              const isSelectedForCompare = compareIds.includes(prod.id);
              return (
                <motion.div 
                  key={prod.id} 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px -15px rgba(37, 193, 242, 0.15)",
                  }}
                  className={`bg-neutral-900/50 border ${prod.isPinned ? 'border-indigo-500/50 shadow-indigo-500/10' : isSelectedForCompare ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-neutral-800/80'} hover:border-neutral-700/80 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group relative`}
                >
                
                {prod.isPinned && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-black shadow-lg shadow-indigo-500/30">
                    <Pin className="w-3 h-3 fill-current rotate-45" />
                    <span>عنصر مثبت</span>
                  </div>
                )}

                {/* Compare Checkbox */}
                <button 
                  onClick={() => toggleCompare(prod.id)}
                  className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-lg blur-none ${
                    isSelectedForCompare 
                      ? 'bg-amber-500 border-amber-400 text-neutral-950 scale-110' 
                      : 'bg-black/50 border-white/10 text-white/50 hover:bg-black/70 hover:text-white'
                  }`}
                  title="إضافة للمقارنة (بحد أقصى ٤ عناصر)"
                >
                  <Scale className="w-4 h-4" />
                </button>

                {/* Heart/Wishlist Button */}
                <button 
                  onClick={() => {
                    if (!currentUser) {
                      onOpenAuth('login');
                    } else {
                      toggleFavoriteProduct(prod.id);
                    }
                  }}
                  className={`absolute top-4 right-14 z-20 w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-lg blur-none ${
                    currentUser && currentUser.favoriteProductIds?.includes(prod.id)
                      ? 'bg-rose-500 border-rose-400 text-white scale-110' 
                      : 'bg-black/50 border-white/10 text-white/50 hover:bg-black/70 hover:text-rose-400'
                  }`}
                  title={currentUser && currentUser.favoriteProductIds?.includes(prod.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                >
                  <Heart className={`w-4 h-4 ${currentUser && currentUser.favoriteProductIds?.includes(prod.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Product Photo */}
              <div className="relative h-56 bg-neutral-950 overflow-hidden shrink-0">
                <img 
                  src={prod.photoUrl} 
                  alt={prod.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-80" />
                
                {/* Returns and Alert Tags */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  {prod.status && (
                    <div className={`px-2.5 py-1 rounded-lg text-neutral-950 text-[10px] font-black shadow-lg flex items-center gap-1.5 ${
                      prod.status === 'available' ? 'bg-emerald-400 shadow-emerald-500/30' :
                      prod.status === 'preorder' ? 'bg-amber-400 shadow-amber-500/30' :
                      'bg-neutral-400 shadow-neutral-500/30'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full bg-neutral-950 ${prod.status === 'available' ? 'animate-pulse' : ''}`} />
                      <span>
                        {prod.status === 'available' ? 'متاح' :
                         prod.status === 'preorder' ? 'طلب مسبق' : 'مكتمل'}
                      </span>
                    </div>
                  )}
                  {prod.audience === 'members' && (
                    <div className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black shadow-lg shadow-indigo-600/30 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-300" />
                      <span>خاص بالأعضاء 🔒</span>
                    </div>
                  )}
                  {prod.returns && (
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-500 text-neutral-950 text-[10px] font-black shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-ping" />
                      <span>عائد {prod.returns}%</span>
                    </div>
                  )}
                  {currentUser && currentUser.followedProductIds?.includes(prod.id) && (
                    <div className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 text-[10px] font-black shadow-lg shadow-amber-500/30 flex items-center gap-1.5">
                      <BellRing className="w-3 h-3" />
                      <span>منبه نشط</span>
                    </div>
                  )}
                </div>

                {/* Price tag */}
                <div className="absolute bottom-4 right-4 py-1.5 px-3 rounded-xl bg-[#25C1F2] text-neutral-950 font-black text-sm shadow-md">
                  {prod.price.toLocaleString('ar-EG')} ج.م
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-md sm:text-lg font-black text-white leading-tight mb-2 line-clamp-2">
                    {prod.title}
                  </h3>

                  {/* Rating Stars & Feedback Indicator */}
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    {(() => {
                      const { avg, count } = getProductRatingInfo(prod);
                      return (
                        <>
                          <div className="flex items-center text-amber-400 gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-3 h-3 ${star <= Math.round(avg) ? 'fill-current text-amber-400' : 'text-neutral-700'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-neutral-400 font-extrabold">
                            {count > 0 ? `${avg} (${count} تقييم)` : 'لا توجد تقييمات بعد'}
                          </span>
                        </>
                      );
                    })()}
                    <button 
                      onClick={() => {
                        setReviewingProduct(prod);
                        setReviewError('');
                        setReviewSuccess('');
                        setReviewComment('');
                        setReviewRating(5);
                      }}
                      className="text-[10px] text-[#25C1F2] hover:underline font-extrabold mr-auto bg-[#25C1F2]/10 hover:bg-[#25C1F2]/20 px-2 py-0.5 rounded transition-colors"
                    >
                      عرض الآراء 💬
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed mb-6 line-clamp-3 font-medium">
                    {prod.description}
                  </p>
                </div>

                {/* Bottom interactive metadata */}
                <div className="space-y-4">
                  
                  {/* Store/Shop Name Reveal constraint */}
                  <div className="py-2.5 px-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/60 text-xs flex items-center justify-between">
                    <span className="text-neutral-500 font-bold">المتجر العارض:</span>
                    {currentUser ? (
                      <span className="text-indigo-400 font-extrabold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        {prod.providerName || "مؤسسة شوجر بيزنس"}
                      </span>
                    ) : (
                      <button 
                        onClick={() => onOpenAuth('login')}
                        className="text-[#25C1F2] font-black cursor-pointer flex items-center gap-1 bg-[#25C1F2]/5 px-2.5 py-1 rounded-lg hover:bg-[#25C1F2]/10 transition-all text-[10px]"
                        title="يتطلب تسجيل الدخول لعرض المتجر العارض"
                      >
                        <Lock className="w-3 h-3 text-[#25C1F2]" />
                        <span>سجل لعرض اسم المتجر 🔒</span>
                      </button>
                    )}
                  </div>

                  {/* Purchase/Edit Actions */}
                  <div className="flex gap-2.5">
                    {currentUser && (
                      <button 
                        onClick={() => toggleFollowProduct(prod.id)}
                        className={`p-3 rounded-xl transition-all cursor-pointer border ${
                          currentUser.followedProductIds?.includes(prod.id)
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                            : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 border-neutral-800'
                        }`}
                        title={currentUser.followedProductIds?.includes(prod.id) ? "إيقاف تنبيهات هذا الاستثمار" : "تفعيل تنبيهات انخفاض السعر أو العوائد لهذا الاستثمار"}
                      >
                        {currentUser.followedProductIds?.includes(prod.id) ? <BellRing className="w-3.5 h-3.5 fill-current" /> : <Bell className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    
                    {/* Export PDF Button */}
                    <button 
                      onClick={() => exportToPDF(prod)}
                      className="p-3 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 transition-all cursor-pointer"
                      title="تصدير تفاصيل الاستثمار كملف PDF"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>

                    {currentUser ? (
                      <button
                        onClick={() => {
                          setSelectedProductForOrder(prod);
                          trackEvent(currentUser, 'item_click', {
                            targetId: prod.id,
                            targetTitle: prod.title,
                            category: 'shop'
                          });
                        }}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>احجز الآن بالنظام</span>
                      </button>
                    ) : prod.audience === 'members' ? (
                      <button
                        onClick={() => onOpenAuth('login')}
                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                        title="يتطلب تسجيل الدخول لعرض هذا العرض الاستثماري الحصري للأعضاء"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-200" />
                        <span>🔒 متاح للأعضاء (سجل معنا)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setGuestProduct(prod);
                          // Track guest interest (optional, but let's stick to auth users for now as per useTracking requirement)
                        }}
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>طلب الشراء (زائر)</span>
                      </button>
                    )}

                    {isExecutive && (
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleTogglePin(prod)}
                          className={`p-3 rounded-xl transition-all cursor-pointer border ${prod.isPinned ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 border-neutral-800'}`}
                          title={prod.isPinned ? "إلغاء التثبيت" : "تثبيت المنتج في المقدمة"}
                        >
                          <Pin className={`w-3.5 h-3.5 ${prod.isPinned ? 'fill-current rotate-45' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-3 bg-neutral-850 hover:bg-neutral-800 text-indigo-400 rounded-xl transition-all cursor-pointer border border-neutral-800"
                          title="تعديل المنتج"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-3 bg-neutral-850 hover:bg-red-500/10 text-red-400 rounded-xl transition-all cursor-pointer border border-neutral-800"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            );
          })}
        </motion.div>
        )}

        {/* Mobile Swipe Section */}
        <div className="block sm:hidden">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 bg-neutral-900/30 rounded-3xl border border-neutral-800">
              لا توجد منتجات تطابق البحث والخيارات الحالية.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Swipe/Drag Hint and Progress Indicator */}
              <div className="flex items-center justify-between px-2 text-xs">
                <span className="text-neutral-500 font-bold">
                  منتج <span className="text-[#25C1F2] font-black">{mobileIndex + 1}</span> من <span className="text-white">{sortedProducts.length}</span>
                </span>
                <span className="text-indigo-400 font-black flex items-center gap-1.5 animate-pulse">
                  <span>💡 اسحب لليمين/اليسار للتنقل</span>
                </span>
              </div>

              {/* Slider Area */}
              <div className="relative overflow-hidden min-h-[580px] px-1 py-2">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  {sortedProducts[mobileIndex] && (
                    <motion.div
                      key={sortedProducts[mobileIndex].id}
                      custom={direction}
                      variants={{
                        enter: (direction: number) => ({
                          x: direction > 0 ? 150 : -150,
                          opacity: 0,
                          scale: 0.95
                        }),
                        center: {
                          x: 0,
                          opacity: 1,
                          scale: 1,
                          transition: { type: 'spring', stiffness: 300, damping: 25 }
                        },
                        exit: (direction: number) => ({
                          x: direction < 0 ? 150 : -150,
                          opacity: 0,
                          scale: 0.95,
                          transition: { duration: 0.2 }
                        })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.6}
                      onDragEnd={(e, info) => {
                        const threshold = 60;
                        if (info.offset.x < -threshold) {
                          // Dragged left -> show next card (RTL layouts increment on swipe-left)
                          if (mobileIndex < sortedProducts.length - 1) {
                            setDirection(1);
                            setMobileIndex(prev => prev + 1);
                          }
                        } else if (info.offset.x > threshold) {
                          // Dragged right -> show previous card
                          if (mobileIndex > 0) {
                            setDirection(-1);
                            setMobileIndex(prev => prev - 1);
                          }
                        }
                      }}
                      className="bg-neutral-900 border border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative touch-none select-none"
                    >
                      {/* Catalog Mob Swiper Product Card */}
                      <div className="relative h-52 bg-neutral-950 overflow-hidden shrink-0">
                        {sortedProducts[mobileIndex].photoUrl && (
                          <img 
                            src={sortedProducts[mobileIndex].photoUrl} 
                            alt={sortedProducts[mobileIndex].title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-80" />
                        
                        {/* Comparison Button inside card */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(sortedProducts[mobileIndex].id);
                          }}
                          className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                            compareIds.includes(sortedProducts[mobileIndex].id) 
                              ? 'bg-amber-500 border-amber-400 text-neutral-950 scale-110' 
                              : 'bg-black/50 border-white/10 text-white/50 hover:bg-black/70 hover:text-white'
                          }`}
                        >
                          <Scale className="w-4 h-4" />
                        </button>

                        {/* Heart/Wishlist Button inside mobile card */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!currentUser) {
                              onOpenAuth('login');
                            } else {
                              toggleFavoriteProduct(sortedProducts[mobileIndex].id);
                            }
                          }}
                          className={`absolute top-4 right-14 z-20 w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                            currentUser && currentUser.favoriteProductIds?.includes(sortedProducts[mobileIndex].id)
                              ? 'bg-rose-500 border-rose-400 text-white scale-110' 
                              : 'bg-black/50 border-white/10 text-white/50 hover:bg-black/70 hover:text-rose-400'
                          }`}
                          title={currentUser && currentUser.favoriteProductIds?.includes(sortedProducts[mobileIndex].id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                        >
                          <Heart className={`w-4 h-4 ${currentUser && currentUser.favoriteProductIds?.includes(sortedProducts[mobileIndex].id) ? 'fill-current' : ''}`} />
                        </button>

                        {/* Returns and Alert Tags */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                          {sortedProducts[mobileIndex].isPinned && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-black shadow-lg">
                              <Pin className="w-3 h-3 fill-current rotate-45" />
                              <span>عنصر مثبت</span>
                            </div>
                          )}
                          {sortedProducts[mobileIndex].status && (
                            <div className={`px-2.5 py-1 rounded-lg text-neutral-950 text-[10px] font-black shadow-lg flex items-center gap-1.5 ${
                              sortedProducts[mobileIndex].status === 'available' ? 'bg-emerald-400 shadow-emerald-500/30' :
                              sortedProducts[mobileIndex].status === 'preorder' ? 'bg-amber-400 shadow-amber-500/30' :
                              'bg-neutral-400 shadow-neutral-500/30'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full bg-neutral-950 ${sortedProducts[mobileIndex].status === 'available' ? 'animate-pulse' : ''}`} />
                              <span>
                                {sortedProducts[mobileIndex].status === 'available' ? 'متاح' :
                                 sortedProducts[mobileIndex].status === 'preorder' ? 'طلب مسبق' : 'مكتمل'}
                              </span>
                            </div>
                          )}
                          {sortedProducts[mobileIndex].returns && (
                            <div className="px-2.5 py-1 rounded-lg bg-emerald-500 text-neutral-950 text-[10px] font-black shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 animate-pulse">
                              <div className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-ping" />
                              <span>عائد {sortedProducts[mobileIndex].returns}%</span>
                            </div>
                          )}
                        </div>

                        {/* Price tag */}
                        <div className="absolute bottom-4 right-4 py-1.5 px-3 rounded-xl bg-[#25C1F2] text-neutral-950 font-black text-xs shadow-md">
                          {sortedProducts[mobileIndex].price.toLocaleString('ar-EG')} ج.م
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-sm font-black text-white leading-tight line-clamp-2">
                            {sortedProducts[mobileIndex].title}
                          </h3>

                          {/* Mobile Rating Stars & Feedback Indicator */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(() => {
                              const { avg, count } = getProductRatingInfo(sortedProducts[mobileIndex]);
                              return (
                                <>
                                  <div className="flex items-center text-amber-400 gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star 
                                        key={star} 
                                        className={`w-2.5 h-2.5 ${star <= Math.round(avg) ? 'fill-current text-amber-400' : 'text-neutral-700'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-[9px] text-neutral-400 font-extrabold">
                                    {count > 0 ? `${avg} (${count} تقييم)` : 'لا توجد تقييمات'}
                                  </span>
                                </>
                              );
                            })()}
                            <button 
                              onClick={() => {
                                setReviewingProduct(sortedProducts[mobileIndex]);
                                setReviewError('');
                                setReviewSuccess('');
                                setReviewComment('');
                                setReviewRating(5);
                              }}
                              className="text-[9px] text-[#25C1F2] hover:underline font-extrabold mr-auto bg-[#25C1F2]/10 hover:bg-[#25C1F2]/20 px-1.5 py-0.5 rounded transition-colors"
                            >
                              عرض الآراء 💬
                            </button>
                          </div>

                          <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-3 font-medium">
                            {sortedProducts[mobileIndex].description}
                          </p>
                        </div>

                        <div className="space-y-3 mt-4">
                          {/* Store/Shop Name Reveal constraint */}
                          <div className="py-2 px-3 rounded-xl bg-neutral-950/80 border border-neutral-800/60 text-[10px] flex items-center justify-between">
                            <span className="text-neutral-500 font-bold">المتجر العارض:</span>
                            {currentUser ? (
                              <span className="text-indigo-400 font-extrabold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                                {sortedProducts[mobileIndex].providerName || "مؤسسة شوجر بيزنس"}
                              </span>
                            ) : (
                              <button 
                                onClick={() => {
                                  onOpenAuth('login');
                                }}
                                className="text-[#25C1F2] font-black cursor-pointer flex items-center gap-1 bg-[#25C1F2]/5 px-2 py-0.5 rounded hover:bg-[#25C1F2]/10 transition-all text-[9px]"
                              >
                                <Lock className="w-2.5 h-2.5 text-[#25C1F2]" />
                                <span>سجل لعرض اسم المتجر 🔒</span>
                              </button>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {currentUser && (
                              <button 
                                onClick={() => toggleFollowProduct(sortedProducts[mobileIndex].id)}
                                className={`p-2.5 rounded-lg transition-all cursor-pointer border ${
                                  currentUser.followedProductIds?.includes(sortedProducts[mobileIndex].id)
                                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 border-neutral-800'
                                }`}
                              >
                                {currentUser.followedProductIds?.includes(sortedProducts[mobileIndex].id) ? <BellRing className="w-3.5 h-3.5 fill-current" /> : <Bell className="w-3.5 h-3.5" />}
                              </button>
                            )}
                            
                            <button 
                              onClick={() => exportToPDF(sortedProducts[mobileIndex])}
                              className="p-2.5 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 transition-all cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {currentUser ? (
                              <button
                                onClick={() => {
                                  setSelectedProductForOrder(sortedProducts[mobileIndex]);
                                  trackEvent(currentUser, 'item_click', {
                                    targetId: sortedProducts[mobileIndex].id,
                                    targetTitle: sortedProducts[mobileIndex].title,
                                    category: 'shop'
                                  });
                                }}
                                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-black flex items-center justify-center gap-1.5 shadow-md"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>احجز الآن بالنظام</span>
                              </button>
                            ) : sortedProducts[mobileIndex].audience === 'members' ? (
                              <button
                                onClick={() => onOpenAuth('login')}
                                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-lg text-[11px] font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-200" />
                                <span>🔒 متاح للأعضاء</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setGuestProduct(sortedProducts[mobileIndex]);
                                }}
                                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-lg text-[11px] font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>طلب الشراء (زائر)</span>
                              </button>
                            )}

                            {isExecutive && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleTogglePin(sortedProducts[mobileIndex])}
                                  className={`p-2.5 rounded-lg transition-all cursor-pointer border ${sortedProducts[mobileIndex].isPinned ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 border-neutral-800'}`}
                                >
                                  <Pin className={`w-3.5 h-3.5 ${sortedProducts[mobileIndex].isPinned ? 'fill-current rotate-45' : ''}`} />
                                </button>
                                <button
                                  onClick={() => handleOpenEdit(sortedProducts[mobileIndex])}
                                  className="p-2.5 bg-neutral-850 hover:bg-neutral-800 text-indigo-400 rounded-lg border border-neutral-800"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(sortedProducts[mobileIndex].id)}
                                  className="p-2.5 bg-neutral-850 hover:bg-red-500/10 text-red-400 rounded-lg border border-neutral-800"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dots & Nav Buttons Container */}
              <div className="flex items-center justify-between mt-3 px-2">
                <button
                  type="button"
                  onClick={() => {
                    if (mobileIndex > 0) {
                      setDirection(-1);
                      setMobileIndex(prev => prev - 1);
                    }
                  }}
                  disabled={mobileIndex === 0}
                  className={`p-3.5 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                    mobileIndex === 0 
                      ? 'bg-neutral-950 border-neutral-900 text-neutral-700 cursor-not-allowed' 
                      : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                  }`}
                  aria-label="السابق"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Progress Dots */}
                <div className="flex gap-1.5 overflow-x-auto max-w-[180px] py-1 no-scrollbar justify-center items-center">
                  {sortedProducts.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDirection(idx > mobileIndex ? 1 : -1);
                        setMobileIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === mobileIndex 
                          ? 'w-6 bg-[#25C1F2]' 
                          : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                      }`}
                      aria-label={`انتقل إلى منتج ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (mobileIndex < sortedProducts.length - 1) {
                      setDirection(1);
                      setMobileIndex(prev => prev + 1);
                    }
                  }}
                  disabled={mobileIndex === sortedProducts.length - 1}
                  className={`p-3.5 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                    mobileIndex === sortedProducts.length - 1 
                      ? 'bg-neutral-950 border-neutral-900 text-neutral-700 cursor-not-allowed' 
                      : 'bg-neutral-900 border-neutral-700 text-neutral-150 hover:bg-neutral-800'
                  }`}
                  aria-label="التالي"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Compare Action */}
        <AnimatePresence>
          {compareIds.length > 0 && (
            <motion.div 
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 100, opacity: 0 }}
               className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4"
            >
              <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white">مقارنة المنتجات ({compareIds.length})</p>
                    <p className="text-[9px] text-neutral-500 font-bold">قارن بين المميزات والأسعار</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCompareIds([])}
                    className="p-2 text-neutral-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={compareIds.length < 2}
                    onClick={() => setIsCompareModalOpen(true)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                      compareIds.length >= 2 
                        ? 'bg-[#25C1F2] text-neutral-950 hover:bg-[#25C1F2]/90 cursor-pointer shadow-lg shadow-[#25C1F2]/20' 
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    {compareIds.length < 2 ? 'اختر منتجين للمقارنة' : 'ابدأ المقارنة الآن'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Modal */}
        <AnimatePresence>
          {isCompareModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-5xl bg-[#0E0E0E] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-white">جدول مقارنة الاستثمارات والمنتجات المختارة</h2>
                      <p className="text-[10px] text-neutral-500 font-bold">تحليل دقيق لأفضل فرص شوجر بيزنس (نظام ٢٠٢٦)</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCompareModalOpen(false)}
                    className="p-2 hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-all"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-x-auto custom-scrollbar p-6">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 bg-neutral-900/30 text-xs font-black text-neutral-500 border-b border-neutral-800 w-40">المعيار / المنتج</th>
                        {compareProducts.map(p => (
                          <th key={p.id} className="p-4 border-b border-neutral-800 min-w-[200px]">
                            <img 
                              src={p.photoUrl} 
                              alt={p.title} 
                              className="w-full h-24 object-cover rounded-xl mb-3 border border-neutral-800 shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                            <p className="text-xs font-black text-white line-clamp-1">{p.title}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold">
                      <tr className="border-b border-neutral-800/50">
                        <td className="p-4 bg-neutral-900/20 text-neutral-400">السعر الاستثماري</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-4 text-white font-black">{p.price.toLocaleString('ar-EG')} ج.م</td>
                        ))}
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="p-4 bg-neutral-900/20 text-neutral-400">المتجر العارض</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-4 text-indigo-400">{currentUser ? p.providerName : '🔒 سجل للعرض'}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="p-4 bg-neutral-900/20 text-neutral-400">الموقع الجغرافي</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-4 text-white">{p.governorate || 'متاح بجميع الفروع'}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="p-4 bg-neutral-900/20 text-neutral-400">التصنيف</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-4">
                            <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[9px] uppercase tracking-tighter">
                              {categories.find(c => c.id === p.category)?.label || p.category}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-neutral-800/50">
                        <td className="p-4 bg-neutral-900/20 text-neutral-400 align-top">الوصف والتفاصيل</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-4 text-neutral-500 leading-relaxed max-w-xs">{p.description}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 bg-neutral-900/20 text-neutral-400">اختياري</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="p-4">
                            <button
                              onClick={() => {
                                setIsCompareModalOpen(false);
                                if (currentUser) {
                                  setSelectedProductForOrder(p);
                                } else {
                                  setGuestProduct(p);
                                }
                              }}
                              className="w-full py-2 bg-[#25C1F2] hover:bg-[#25C1F2]/90 text-neutral-950 rounded-lg font-black transition-all shadow-md active:scale-95"
                            >
                              اختيار هذا العرض
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-neutral-900/80 border-t border-neutral-800 text-center">
                  <p className="text-[9px] text-neutral-600 font-black">نظام شوجر بيزنس إي جي للمستثمرين الذكي © ٢٠٢٦</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add/Edit Product Modal */}
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-black text-white border-b border-neutral-800 pb-3">
                {editingProduct.id ? 'تعديل منتج بالمتجر' : 'إضافة منتج جديد للمتجر الإلكتروني'}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-bold text-neutral-400">عنوان المنتج أو الخدمة المعروضة:</label>
                    <FieldTooltip text="الاسم التجاري المميز للفرصة الاستثمارية أو العقارية التي ستظهر للعملاء في واجهة المتجر." />
                  </div>
                  <input 
                    type="text"
                    required
                    value={editingProduct.title || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, title: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 text-right focus:outline-none"
                    placeholder="مثال: باقة الأثاث المنزلي الفاخر لعام 2026"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <label className="text-xs font-bold text-neutral-400">حالة التوفر (Status):</label>
                      <FieldTooltip text="تحديد ما إذا كانت الفرصة متاحة حالياً للاستثمار، متاحة للحجز المسبق فقط، أو تم اكتمالها بنجاح." />
                    </div>
                    <select
                      value={editingProduct.status || 'available'}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, status: e.target.value as any }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 text-right focus:outline-none cursor-pointer appearance-none"
                    >
                      <option value="available">متاح (Available)</option>
                      <option value="preorder">طلب مسبق (Pre-order)</option>
                      <option value="completed">مكتمل (Completed)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <label className="text-xs font-bold text-neutral-400">اسم المتجر / مقدم الخدمة:</label>
                      <FieldTooltip text="اسم المؤسسة أو الشريك القانوني المسؤول عن تنفيذ وإدارة هذه الفرصة الاستثمارية." />
                    </div>
                    <input 
                      type="text"
                      required
                      value={editingProduct.providerName || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, providerName: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 text-right focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <label className="text-xs font-bold text-neutral-400">نسبة العائد المتوقع (٪):</label>
                      <FieldTooltip text="النسبة المئوية المقدرة للربح السنوي أو الإجمالي الذي يحصل عليه المستثمر من مشاركته." />
                    </div>
                    <input 
                      type="number"
                      min={0}
                      max={100}
                      value={editingProduct.returns || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, returns: Number(e.target.value) }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-emerald-500 text-right focus:outline-none"
                      placeholder="مثال: 40"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <label className="text-xs font-bold text-neutral-400">نظام دورية الأرباح:</label>
                      <FieldTooltip text="الجدول الزمني لتوزيع الأرباح على الشركاء والمستثمرين (مثل: شهرياً، ربع سنوي، إلخ)." />
                    </div>
                    <input 
                      type="text"
                      value={editingProduct.governorate || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, governorate: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 text-right focus:outline-none"
                      placeholder="مثال: شهري، ربع سنوي..."
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-bold text-neutral-400">وصف دقيق للميزات والخصم والضمان:</label>
                    <FieldTooltip text="تفاصيل الفرصة الاستثمارية، الامتيازات الممنوحة، شروط الضمان القانوني، وكيفية استرداد رأس المال." />
                  </div>
                  <textarea 
                    rows={4}
                    required
                    value={editingProduct.description || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, description: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 text-right focus:outline-none"
                    placeholder="اكتب التجهيزات والمواصفات الكاملة للعرض المتوفر هنا..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <label className="text-xs font-bold text-neutral-400">السعر المعلن (جنيه مصري):</label>
                      <FieldTooltip text="قيمة السهم الواحد أو الحد الأدنى للمساهمة المالية المطلوبة للاشتراك في الفرصة بالجنيه المصري." />
                    </div>
                    <input 
                      type="number"
                      required
                      min={1}
                      value={editingProduct.price || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, price: Number(e.target.value) }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 text-right focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <label className="text-xs font-bold text-neutral-400">رابط صورة المنتج التوضيحية:</label>
                      <FieldTooltip text="رابط مباشر لصورة عالية الجودة تعبر عن المشروع (يفضل استخدام صور من موقع Unsplash لتكون متناسقة وسريعة التحميل)." />
                    </div>
                    <input 
                      type="text"
                      required
                      value={editingProduct.photoUrl || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, photoUrl: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 text-right focus:outline-none placeholder-neutral-600"
                      placeholder="معلومات الرابط المباشر للصور Unsplash"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-bold text-neutral-400 block">فئة الجمهور المستهدف وعرض المنتج:</label>
                    <FieldTooltip text="تحديد ظهور العرض؛ إما للجمهور العام أو يقتصر حصرياً على الأعضاء المسجلين الذين سجلوا الدخول بحساباتهم." />
                  </div>
                  <select
                    value={editingProduct.audience || 'all'}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, audience: e.target.value as any }))}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 text-right focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="all">الجمهور العام (متاح لجميع زوار المنصة)</option>
                    <option value="members">أعضاء المنصة المسجلين فقط (Members Only)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(prev => ({ ...prev!, isPinned: !prev?.isPinned }))}
                    className={`w-10 h-5 rounded-full relative transition-all ${editingProduct.isPinned ? 'bg-indigo-600' : 'bg-neutral-800'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${editingProduct.isPinned ? 'right-6' : 'right-1'}`} />
                  </button>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-neutral-300">تثبيت المنتج في مقدمة المتجر (Pinned Card)</span>
                    <FieldTooltip text="تثبيت هذا العرض في مقدمة المتجر ليكون له الأولوية والظهور الأبرز للشركاء والعملاء." />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-neutral-850">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer transition-all"
                  >
                    حفظ ونشر التعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsEditModalOpen(false); setEditingProduct(null); }}
                    className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    إلغاء الأمر
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Member Order Placement Checkout Modal */}
        {selectedProductForOrder && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 text-right">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
              <h2 className="text-md sm:text-lg font-black text-white mb-2">تأكيد طلب الشراء أون لاين بالنظام</h2>
              <p className="text-xs text-neutral-400 mb-6 font-medium">
                أنت تطلب شراء: <span className="text-[#25C1F2] font-extrabold">{selectedProductForOrder.title}</span> بسعر <span className="text-indigo-400 font-extrabold">{selectedProductForOrder.price} ج.م</span>
              </p>

              {checkoutSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold animate-bounce">✓</div>
                  <h4 className="text-sm font-black text-white">تم قيد وتسجيل حجزك بنجاح بالنظام!</h4>
                  <p className="text-[11px] text-neutral-400">ستقوم الإدارة بالاتصال بك فوراً لتأكيد السداد وتوصيل شحنتك.</p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300 block">عنوان التوصيل التفصيلي:</label>
                    <textarea 
                      required
                      rows={3}
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-indigo-500 font-medium text-right focus:outline-none"
                      placeholder="شارع الاستثمار، بجوار المعامل الصحية، محافظة دمياط، جمهورية مصر العربية..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300 block">وسيلة الدفع المفضلة:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentOption('cash')}
                        className={`p-3.5 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                          paymentOption === 'cash'
                            ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        الدفع عند الاستلام (كاش)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentOption('online')}
                        className={`p-3.5 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                          paymentOption === 'online'
                            ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        الدفع أون لاين (فيزا ومحافظ)
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t border-neutral-850">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer transition-all"
                    >
                      تأكيد الطلب المباشر
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProductForOrder(null)}
                      className="px-4 py-2.5 bg-neutral-800 text-neutral-300 rounded-xl text-xs font-bold cursor-pointer transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Guest Redirection to WhatsApp Modal */}
        {guestProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 text-right">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 text-lg font-black mx-auto mb-4 animate-pulse">!</div>
              <h2 className="text-md sm:text-lg font-black text-white text-center mb-2">خطوة مطلوبة لإتمام الشراء</h2>
              <p className="text-xs text-neutral-450 text-neutral-400 text-center leading-relaxed mb-6 font-medium">
                بما أنك زائر غير مدون في حسابات مستثمري شوجر بيزنس، يتطلب النظام توجيهك إلى خدمة العملاء بالواتساب لإتمام فواتير حجز:
                <br />
                <span className="text-white font-black block mt-2">"{guestProduct.title}"</span>
              </p>

              <div className="space-y-2">
                <a 
                  href={getGuestWhatsAppLink(guestProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setGuestProduct(null)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تأكيد التحويل إلى واتساب خدمة العملاء</span>
                </a>

                <button 
                  onClick={() => { setGuestProduct(null); onOpenAuth('login'); }}
                  className="w-full py-3 bg-[#25C1F2] hover:bg-[#25C1F2]/80 text-neutral-950 rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <span>أو قم بتسجيل الدخول للحجز فوراً</span>
                </button>

                <button 
                  onClick={() => setGuestProduct(null)}
                  className="w-full py-2.5 bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  بقاء بصفحة المتجر
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Reviews Modal */}
        {reviewingProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 text-right">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
                <button 
                  onClick={() => {
                    setReviewingProduct(null);
                    setReviewError('');
                    setReviewSuccess('');
                    setReviewComment('');
                  }}
                  className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <h2 className="text-md sm:text-lg font-black text-white">التقييمات والآراء للفرصة الاستثمارية</h2>
              </div>

              <div className="mb-6 bg-neutral-950/60 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-neutral-800">
                  <img src={reviewingProduct.photoUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs sm:text-sm font-black text-white">{reviewingProduct.title}</h4>
                  <span className="text-[10px] text-[#25C1F2] font-extrabold">{categories.find(c => c.id === reviewingProduct.category)?.label}</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xs font-black text-neutral-300">الآراء والملاحظات السابقة ({reviewingProduct.reviews?.length || 0}):</h3>
                {(!reviewingProduct.reviews || reviewingProduct.reviews.length === 0) ? (
                  <p className="text-xs text-neutral-500 py-4 text-center">لا توجد آراء مسجلة بعد لهذا العرض. كن أول من يشارك تقييمه ورأيه!</p>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {reviewingProduct.reviews.map((rev) => (
                      <div key={rev.id} className="bg-neutral-950/40 border border-white/5 p-3 rounded-xl space-y-1.5 text-right">
                        <div className="flex items-center justify-between text-[11px] flex-row-reverse">
                          <span className="text-neutral-400 font-bold text-[10px]">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('ar-EG') : ''}
                          </span>
                          <div className="flex items-center gap-1.5 flex-row-reverse">
                            <span className="font-extrabold text-white">{rev.userName}</span>
                            <div className="flex text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-2.5 h-2.5 ${star <= rev.rating ? 'fill-current' : 'text-neutral-700'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-300 font-medium leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Input Section */}
              <div className="border-t border-neutral-800 pt-4">
                <h3 className="text-xs font-black text-neutral-300 mb-3">أضف تقييمك ورأيك الخاص:</h3>
                
                {currentUser ? (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!reviewComment.trim()) {
                        setReviewError('يرجى كتابة تعليق قصير على الأقل.');
                        return;
                      }
                      setIsReviewSubmitting(true);
                      setReviewError('');
                      setReviewSuccess('');
                      const res = await submitProductReview(reviewingProduct.id, currentUser.name, reviewRating, reviewComment);
                      setIsReviewSubmitting(false);
                      if (res.success) {
                        setReviewSuccess(res.message);
                        setReviewComment('');
                        setReviewRating(5);
                        // Update current reviewingProduct's reviews list locally
                        const updatedProduct = products.find(p => p.id === reviewingProduct.id);
                        if (updatedProduct) {
                          setReviewingProduct(updatedProduct);
                        }
                      } else {
                        setReviewError(res.message);
                      }
                    }} 
                    className="space-y-3.5"
                  >
                    {reviewError && <p className="text-xs text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">{reviewError}</p>}
                    {reviewSuccess && <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">{reviewSuccess}</p>}

                    <div className="flex items-center justify-between flex-row-reverse">
                      <span className="text-xs text-neutral-400 font-bold">تقييمك بالنجوم:</span>
                      <div className="flex items-center gap-1 flex-row-reverse">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-115 transition-transform text-amber-400 focus:outline-none cursor-pointer"
                          >
                            <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current text-amber-400' : 'text-neutral-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-400 block text-right">رأيك أو تعليقك:</label>
                      <textarea
                        required
                        rows={2}
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-[#25C1F2] text-right focus:outline-none font-medium"
                        placeholder="اكتب انطباعك أو تعليقك حول هذا العرض..."
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isReviewSubmitting}
                        className="w-full py-2.5 bg-[#25C1F2] hover:bg-[#25C1F2]/90 text-neutral-950 rounded-xl text-xs font-black transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isReviewSubmitting ? 'جاري الإرسال والمزامنة...' : 'إرسال التقييم والتعليق'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 bg-neutral-950/40 border border-neutral-800 rounded-2xl text-center space-y-3">
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium">يتعين عليك تسجيل الدخول بحسابك أولاً لتتمكن من تقييم المنتجات وترك الآراء والتعليقات.</p>
                    <button
                      onClick={() => {
                        setReviewingProduct(null);
                        onOpenAuth('login');
                      }}
                      className="px-6 py-2 bg-[#25C1F2] hover:bg-[#25C1F2]/80 text-neutral-950 font-black text-xs rounded-lg transition-all cursor-pointer"
                    >
                      تسجيل الدخول الآن 🔑
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
