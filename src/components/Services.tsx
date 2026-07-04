import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../CMSContext';
import { EditableText } from './EditableText';
import { trackEvent } from '../lib/tracking';
import { User } from '../types';
import { 
  Tv, Home, FlaskConical, Bone, Activity, User as UserIcon, Shirt, ShoppingBag, 
  BookOpen, Scale, Hospital, Coffee, Camera, Laptop, Truck, Sparkles, 
  Smartphone, Wrench, Coins, MapPin, Car, Factory, ShieldCheck, HeartPulse,
  Award, Search, PlusCircle, Megaphone, CreditCard, ChevronLeft, CheckCircle2,
  Bookmark, Shield, Building, X, ExternalLink, ShieldAlert,
  Briefcase, FileText
} from 'lucide-react';

interface ServicesProps {
  onOpenContact: () => void;
  activeForm?: 'ad' | 'service' | 'card' | 'work' | null;
  setActiveForm?: (form: 'ad' | 'service' | 'card' | 'work' | null) => void;
  currentUser: User | null;
}

export const Services: React.FC<ServicesProps> = ({ 
  onOpenContact, 
  activeForm: externalActiveForm, 
  setActiveForm: externalSetActiveForm,
  currentUser
}) => {
  const { submitRecruitment, submitServiceAddition } = useCMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'health' | 'shopping' | 'food' | 'services' | 'education'>('all');
  const [selectedSector, setSelectedSector] = useState<{ title: string; tag: string; category: string; icon: any } | null>(null);
  
  const [localActiveForm, setLocalActiveForm] = useState<'ad' | 'service' | 'card' | 'work' | null>(null);
  
  const activeForm = externalActiveForm !== undefined ? externalActiveForm : localActiveForm;
  const setActiveForm = (form: 'ad' | 'service' | 'card' | 'work' | null) => {
    if (externalSetActiveForm) {
      externalSetActiveForm(form);
    } else {
      setLocalActiveForm(form);
    }
  };

  const handleSectorClick = (sector: any) => {
    setSelectedSector(sector);
    if (currentUser) {
      trackEvent(currentUser, 'item_click', {
        targetId: `sector-${sector.title}`,
        targetTitle: sector.title,
        category: 'services_sector'
      });
    }
  };

  const [submittedForm, setSubmittedForm] = useState<string | null>(null);

  // Keyboard Escape listener to close sector detail modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSector(null);
      }
    };
    if (selectedSector) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSector ? true : false]);
  
  // Forms local states
  const [adForm, setAdForm] = useState({ name: '', phone: '', businessName: '', budget: 'budget-1', notes: '' });
  const [serviceForm, setServiceForm] = useState({ name: '', phone: '', serviceName: '', sector: 'عام', region: '' });
  const [cardForm, setCardForm] = useState({ name: '', phone: '', NationalId: '', address: '', deliveryMethod: 'home' });
  const [workForm, setWorkForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    about: '',
    nationalId: '',
    photo: null as File | null,
    photoName: '',
    cv: null as File | null,
    cvName: '',
    workType: 'full-time'
  });

  const firstGroupSectors = [
    { title: "معارض أجهزة كهربائية", icon: Tv, tag: "أجهزة منزلية", category: "shopping" },
    { title: "معارض موبيليا", icon: Home, tag: "أثاث وديكور", category: "shopping" },
    { title: "معامل تحاليل", icon: FlaskConical, tag: "رعاية صحية", category: "health" },
    { title: "مراكز أشعة", icon: Bone, tag: "رعاية صحية", category: "health" },
    { title: "مراكز العلاج الطبيعي", icon: Activity, tag: "رعاية صحية", category: "health" },
    { title: "دكاترة عيادات", icon: UserIcon, tag: "أطباء متميزون", category: "health" },
    { title: "محلات ملابس", icon: Shirt, tag: "أزياء وموضة", category: "shopping" },
    { title: "هايبر ماركت", icon: ShoppingBag, tag: "سوبرماركت وغذاء", category: "food" },
    { title: "محلات فراخ", icon: Bookmark, tag: "أغذية ودواجن", category: "food" },
    { title: "محلات لحوم", icon: Award, tag: "جزارة وأغذية", category: "food" },
    { title: "أكاديميات للكورسات", icon: BookOpen, tag: "تعليم وتدريب", category: "education" },
    { title: "أكاديميات التمريض", icon: HeartPulse, tag: "تعليم رعاية صحية", category: "education" },
    { title: "محامين واستشارات", icon: Scale, tag: "خدمات قانونية", category: "education" },
    { title: "مستشفيات", icon: Hospital, tag: "صروح طبية", category: "health" }
  ];

  const secondGroupSectors = [
    { title: "كافيهات ومطاعم", icon: Coffee, tag: "أغذية ومشروبات", category: "food" },
    { title: "محلات كاميرات", icon: Camera, tag: "تصوير وتقنيات", category: "shopping" },
    { title: "محلات كمبيوتر", icon: Laptop, tag: "تكنولوجيا وأجهزة", category: "shopping" },
    { title: "شركات الشحن", icon: Truck, tag: "لوجستيات وشحن", category: "services" },
    { title: "شركات النظافة", icon: Sparkles, tag: "خدمات عامة", category: "services" },
    { title: "محلات الموبايلات", icon: Smartphone, tag: "اتصالات وأجهزة", category: "shopping" },
    { title: "حرفيين مؤهلين", icon: Wrench, tag: "أعمال يدوية وورش", category: "services" },
    { title: "صيدليات", icon: HeartPulse, tag: "أدوية ورعاية", category: "health" },
    { title: "محلات الذهب والفضة", icon: Coins, tag: "مجوهرات ومعادن", category: "shopping" },
    { title: "لوكيشن تصوير", icon: MapPin, tag: "إنتاج وتصوير", category: "services" },
    { title: "قاعات أفراح ومناسبات", icon: Sparkles, tag: "حفلات ومناسبات", category: "services" },
    { title: "مصورين فوتوغرافيين", icon: Camera, tag: "خدمات إعلامية", category: "services" },
    { title: "السيارات وخدماتها", icon: Car, tag: "معارض ومراكز صيانة", category: "services" },
    { title: "شركات التوريدات العمومية", icon: Factory, tag: "خدمات بيزنس B2B", category: "services" }
  ];

  const allSectors = [...firstGroupSectors, ...secondGroupSectors];

  const getSectorDetails = (sector: { title: string; tag: string; category: string }) => {
    const title = sector.title;
    
    // Custom definitions based on sector domains
    if (title.includes("تحاليل") || title.includes("أشعة") || title.includes("العلاج الطبيعي") || title.includes("دكاترة") || title.includes("مستشفيات") || title.includes("صيدليات") || title.includes("التمريض")) {
      return {
        description: "يُعد القطاع الطبي والرعاية الصحية عصب الشراكات الحيوية ومجالات استثمارنا المباشر في شوجر بيزنس إي جي. نعمل بالتنسيق الكامل مع كبرى معامل التحاليل والمستشفيات والصيدليات في مصر لتقديم تيسيرات فورية للخدمة والعمليات لحاملي كروت شوجر الذكية، مع الحفاظ على حوكمة مالية محكمة وجودة خدمة ممتازة.",
        benefits: [
          "خصومات حصرية تبدأ من ٢٠% وتصل حتى ٣٥% على التحاليل والأشعة والخدمات الطبية كأفضل سعر بمصر.",
          "أولوية حجز مطلقة في العيادات والمراكز والمستشفيات مع إعفاء من رسوم الانتظار الطويلة لحاملي العضوية.",
          "نظام تعويض مالي فوري للشركاء من الأطباء يضمن استمرار خدماتهم بكامل كفاءتها دون عراقيل.",
          "تحديث وتنسيق مستمر للتعاملات الطبية بما يطابق ضوابط ميثاق الجودة والمراقبة الدورية."
        ],
        growth: "نسبة النمو السنوي للشراكات الطبية: +٤٢% بمصر"
      };
    }
    
    if (title.includes("كهربائية") || title.includes("موبيليا") || title.includes("ذهب") || title.includes("كاميرات") || title.includes("كمبيوتر") || title.includes("الموبايلات") || title.includes("ملابس")) {
      return {
        description: "نسعى لرفع القوة الشرائية وتسهيل اقتناء وتجارة السلع الأساسية والمعمرة من أجهزة ومعدات ومستلزمات منزلية ومجوهرات. عبر شبكة معارضنا وشركائنا المعتمدين، نتيح باقة عروض تجارية تفضيلية فريدة من نوعها تدفع حركة المبيعات وتنعش الأنشطة لجميع المستثمرين.",
        benefits: [
          "أسعار استثنائية ونسبة خصم مباشر وموثق على جميع الأدوات، الملابس والأجهزة المستهدفة والمستدامة.",
          "برمجيات نقل وشحن مدمجة وآمنة تضمن توصيل المشتريات الثمينة لباب البيت بعناية فائقة وضمان شامل.",
          "باقات تسويق وترويج مجانية ممولة بالكامل من باقات شوجر الإعلانية لزيادة الإقبال على معرضك وشاشاتك.",
          "أنظمة تجارية مرنة لتقليل الأعباء التشغيلية وحفظ السيولة النقدية لأصحاب المعارض والأنشطة كالمعتاد."
        ],
        growth: "حجم المعاملات التجارية والسلعية النشطة: +٥.٨ مليون ج.م"
      };
    }

    if (title.includes("هايبر") || title.includes("فراخ") || title.includes("لحوم") || title.includes("مطاعم") || title.includes("كافيهات")) {
      return {
        description: "مشاريع الأغذية والسلع الاستهلاكية اليومية هي الأساس الملموس والشريك اليومي الأكبر لعملائنا في مصر. يضمن نظام شوجر بيزنس للمستهلكين وأعضاء الكارت باقات تموين استهلاكي بأسعار تفضيلية ممتازة، تضمن كفاءة عالية وتدفق مالي قوي لمستثمري صناديق ومضاربات السلع الغذائية.",
        benefits: [
          "خصومات ملموسة وواضحة وفورية على مستلزمات السلة الغذائية اليومية واللحوم الطازجة والدواجن.",
          "فحوصات سلامة ورقابة متواصلة ومطابقة جودة لكافة الأغذية وصلاحيتها الفنية للحفاظ على معايير ممتازة لعملائنا.",
          "خطوط إمداد وتوريدات وعقود مباشرة من المزارع ومجمعات الإنتاج الكبرى لتجنب الارتفاعات الفجائية للأسعار.",
          "خيارات تحضير وصيانة الطلبيات العملاقة والمأدبات للمستثمرين والأعضاء بمرونة تامة وسرعة قصوى."
        ],
        growth: "مجموع الكادر والأعضاء المستفيدين من قطاع الأغذية: +١٢,٤٠٠ عضو"
      };
    }

    if (title.includes("شحن") || title.includes("نظافة") || title.includes("حرفيين") || title.includes("تصوير") || title.includes("أفراح") || title.includes("مصورين") || title.includes("السيارات") || title.includes("التوريدات")) {
      return {
        description: "تيسير أعمال اللوجستيات، التوريدات، الصيانة، وخدمات المناسبات هي ركائز أساسية لاستقرار الحياة المهنية والاجتماعية. توفر شوجر بيزنس إي جي نخب فنية ومقدمي خدمات مجهزين ومنظمين بأعلى التقنيات لخدمتكم بشكل لائق وآمن متى احتجتم.",
        benefits: [
          "نخب فنية وحرفيين معتمدين وموثقين بشهادات وسجل أبحاث أمني لضمان الأمان والنزاهة الكاملة عند الاستقدام.",
          "تنسيق لعقود الصيانة السنوية وأنشطة الشحن بأسعار خيالية تنافس جميع التطبيقات ومنافذ الورش.",
          "التزام كامل بالتفوق الزمني لمواعيد التسليم والإنجاز بنظام توثيق وتقييم فوري من خدمة العملاء الذكية.",
          "دعم فني خاص ولجنة طوارئ متاحة على مدار ٢٤ ساعة لمساعدة حاملي الكروت في الحوادث والأمور العاجلة."
        ],
        growth: "مؤشر رضا الأعضاء عن الخدمات واللوجستيات المعتمدة: ٩٨.٦%"
      };
    }

    // Default lookup for other items
    return {
      description: "قطاع متطور يضم خدمات التدريب، التعليم، والاستشارات القانونية والمالية الأساسية في مصر لخلق الوعي ونمو المشاريع ومطابقة الأنشطة للأنظمة القانونية. يسهم هذا التوجيه في تأمين الأصول للمستثمرين وصيانة مشاريعهم التجارية بالشراكة مع النخبة.",
      benefits: [
        "تخفيضات تصل لأكثر من ٣٠% على الكورسات التأهيلية والمهنية والدبلومات الإدارية ومستويات التمريض المعولمة.",
        "جلسات استشارية وبحثية قانونية أو تجارية مجانية دورية للشركاء لتقييم الموقف الإجرائي في مصر.",
        "صياغة ومراجعة دقيقة ومحدثة للعقود لضمان حقوق المودعين والمستثمرين في برامج المضاربة التفاعلية.",
        "ربط فوري للمتدربين بالشركات ومطابقتهم للاحتياجات التشغيلية المطلوبة بسوق العمل المصري."
      ],
      growth: "إجمالي الساعات التأهيلية والتدريبية الممنوحة: +١,٥٠٠ ساعة"
    };
  };

  const filteredFirstGroup = firstGroupSectors.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredSecondGroup = secondGroupSectors.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'cv') => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setWorkForm(prev => ({
        ...prev,
        [field]: file,
        [`${field}Name`]: file.name
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent, type: 'ad' | 'service' | 'card' | 'work') => {
    e.preventDefault();
    
    if (type === 'work') {
      await submitRecruitment({
        name: workForm.name,
        phone: workForm.phone,
        email: workForm.email,
        address: workForm.address,
        about: workForm.about,
        nationalId: workForm.nationalId,
        workType: workForm.workType,
        photoUrl: workForm.photoName ? `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format` : "",
        cvUrl: workForm.cvName ? `https://example.com/cvs/attached-cv` : ""
      });
    }

    if (type === 'service') {
      await submitServiceAddition({
        name: serviceForm.name,
        phone: serviceForm.phone,
        serviceName: serviceForm.serviceName,
        sector: serviceForm.sector,
        region: serviceForm.region,
        description: `طلب تفعيل وإضافة خدمة لشوجر بيزنس: ${serviceForm.serviceName} في منطقة ${serviceForm.region}`
      });
    }

    setSubmittedForm(type);
    
    // Clear forms
    setTimeout(() => {
      setSubmittedForm(null);
      setActiveForm(null);
      // Reset structures
      if (type === 'ad') setAdForm({ name: '', phone: '', businessName: '', budget: 'budget-1', notes: '' });
      if (type === 'service') setServiceForm({ name: '', phone: '', serviceName: '', sector: 'عام', region: '' });
      if (type === 'card') setCardForm({ name: '', phone: '', NationalId: '', address: '', deliveryMethod: 'home' });
      if (type === 'work') setWorkForm({ name: '', phone: '', email: '', address: '', about: '', nationalId: '', photo: null, photoName: '', cv: null, cvName: '', workType: 'full-time' });
    }, 4500);
  };

  return (
    <section id="services-sectors" className="py-16 md:py-24 bg-[#0A0A0A] relative overflow-hidden">
      
      {/* Visual background decor objects */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[10px] md:text-xs font-mono tracking-widest text-[#6366f1] uppercase">
            <EditableText translationKey="services_breadcrumb" defaultText="Sectors We Elevate (Since 2022)" />
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            <EditableText translationKey="services_title" defaultText="القطاعات الحيوية التي نخدمها ونستثمر بها" />
          </h2>
          <p className="text-sm md:text-base text-neutral-400 font-medium max-w-2xl mx-auto">
            <EditableText translationKey="services_desc" defaultText="منذ انطلاق شوجر بيزنس إي جي عام ٢٠٢٢، قمنا بتنظيم وتطوير الشراكات لأكثر من ٢٨ قطاعاً تجارياً وخدمياً في مصر، مما يحقق للمستثمر معدلات أمان غير مسبوقة وتكاملاً تفاعلياً عميقاً." isMultiline />
          </p>
        </div>

        {/* Dynamic Live Options Actions Panel from the bottom of the image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          
          <div
            id="action-create-ad"
            onClick={() => { setActiveForm(activeForm === 'ad' ? null : 'ad'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
            className={`cursor-pointer p-6 rounded-3xl border text-right transition-all duration-300 relative group overflow-hidden flex items-start gap-4 ${
              activeForm === 'ad'
                ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)] text-white'
                : 'bg-[#0F0F0F] hover:bg-neutral-900 border-neutral-800 hover:border-indigo-500/40'
            }`}
            role="button"
            tabIndex={0}
          >
            <div className={`p-3 rounded-2xl ${activeForm === 'ad' ? 'bg-indigo-500 text-white' : 'bg-neutral-900 text-indigo-400'}`}>
              <Megaphone className="w-6 h-6 animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs text-indigo-400 font-bold block">
                <EditableText translationKey="services_act_ad_badge" defaultText="اضغط لتفعيل الميزة" />
              </span>
              <h3 className="text-lg font-extrabold text-white">
                <EditableText translationKey="services_act_ad_title" defaultText="إنشاء إعلان ترويجي" />
              </h3>
              <p className="text-xs text-neutral-400 font-medium">
                <EditableText translationKey="services_act_ad_desc" defaultText="خطط ترويجية متكاملة للأنشطة والشركات لزيادة المبيعات والعوائد عبر كرتنا." isMultiline />
              </p>
            </div>
            <ChevronLeft className={`w-5 h-5 mt-1 transition-transform duration-300 ${activeForm === 'ad' ? 'translate-x-[4px] text-indigo-400 animate-pulse' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
          </div>

          <div
            id="action-add-service"
            onClick={() => { setActiveForm(activeForm === 'service' ? null : 'service'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
            className={`cursor-pointer p-6 rounded-3xl border text-right transition-all duration-300 relative group overflow-hidden flex items-start gap-4 ${
              activeForm === 'service'
                ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)] text-white'
                : 'bg-[#0F0F0F] hover:bg-neutral-900 border-neutral-800 hover:border-indigo-500/40'
            }`}
            role="button"
            tabIndex={0}
          >
            <div className={`p-3 rounded-2xl ${activeForm === 'service' ? 'bg-indigo-500 text-white' : 'bg-neutral-900 text-indigo-400'}`}>
              <PlusCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs text-indigo-400 font-bold block">
                <EditableText translationKey="services_act_srv_badge" defaultText="خاص بالشركات والتجار" />
              </span>
              <h3 className="text-lg font-extrabold text-white">
                <EditableText translationKey="services_act_srv_title" defaultText="إضافة وتسجيل خدمة للجمهور" />
              </h3>
              <p className="text-xs text-neutral-400 font-medium">
                <EditableText translationKey="services_act_srv_desc" defaultText="سجل مجاناً نشاطك التجاري أو خدمتك الطبيّة كواحدة من الجهات المعتمدة." isMultiline />
              </p>
            </div>
            <ChevronLeft className={`w-5 h-5 mt-1 transition-transform duration-300 ${activeForm === 'service' ? 'translate-x-[4px] text-indigo-400 animate-pulse' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
          </div>

          <div
            id="action-request-card"
            onClick={() => { setActiveForm(activeForm === 'card' ? null : 'card'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
            className={`cursor-pointer p-6 rounded-3xl border text-right transition-all duration-300 relative group overflow-hidden flex items-start gap-4 ${
              activeForm === 'card'
                ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)] text-white'
                : 'bg-[#0F0F0F] hover:bg-neutral-900 border-neutral-800 hover:border-indigo-500/40'
            }`}
            role="button"
            tabIndex={0}
          >
            <div className={`p-3 rounded-2xl ${activeForm === 'card' ? 'bg-indigo-500 text-white' : 'bg-neutral-900 text-indigo-400'}`}>
              <CreditCard className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs text-indigo-400 font-bold block">
                <EditableText translationKey="services_act_card_badge" defaultText="ميزة الأعضاء والمستثمرين" />
              </span>
              <h3 className="text-lg font-extrabold text-white">
                <EditableText translationKey="services_act_card_title" defaultText="طلب كارت شوجر بيزنس" />
              </h3>
              <p className="text-xs text-neutral-400 font-medium">
                <EditableText translationKey="services_act_card_desc" defaultText="احصل على بطاقتك الذكية للاستفادة الكاملة من الخصومات ومنافع المبيعات الحصرية." isMultiline />
              </p>
            </div>
            <ChevronLeft className={`w-5 h-5 mt-1 transition-transform duration-300 ${activeForm === 'card' ? 'translate-x-[4px] text-indigo-400 animate-pulse' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
          </div>

          <div
            id="action-apply-work"
            onClick={() => { setActiveForm(activeForm === 'work' ? null : 'work'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
            className={`cursor-pointer p-6 rounded-3xl border text-right transition-all duration-300 relative group overflow-hidden flex items-start gap-4 ${
              activeForm === 'work'
                ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)] text-white'
                : 'bg-[#0F0F0F] hover:bg-neutral-900 border-neutral-800 hover:border-indigo-500/40'
            }`}
            role="button"
            tabIndex={0}
          >
            <div className={`p-3 rounded-2xl ${activeForm === 'work' ? 'bg-indigo-500 text-white' : 'bg-neutral-900 text-indigo-400'}`}>
              <Briefcase className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs text-indigo-400 font-bold block">
                <EditableText translationKey="services_act_work_badge" defaultText="انضم لفريق العمل" />
              </span>
              <h3 className="text-lg font-extrabold text-white">
                <EditableText translationKey="services_act_work_title" defaultText="تقديم طلب توظيف" />
              </h3>
              <p className="text-xs text-neutral-400 font-medium">
                <EditableText translationKey="services_act_work_desc" defaultText="قدم طلب توظيف دوام كامل وانضم لأرقى كوادرنا في مصر بمميزات رائعة." isMultiline />
              </p>
            </div>
            <ChevronLeft className={`w-5 h-5 mt-1 transition-transform duration-300 ${activeForm === 'work' ? 'translate-x-[4px] text-indigo-400 animate-pulse' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
          </div>

        </div>

        {/* Dynamic form area on Toggle Option */}
        {activeForm && (
          <div className="bg-[#0F0F0F] rounded-3xl border border-neutral-800 p-8 mb-16 animate-fadeIn relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
            
            {submittedForm === activeForm ? (
              <div className="py-12 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-white">تم استلام طلبك بنجاح!</h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">
                  نشكرك على تفاعلك مع نظام شوجر بيزنس إي جي. سيقوم منسق العمليات بمراجعة التفاصيل المذكورة والتواصل معك خلال ١٥ دقيقة هاتفياً.
                </p>
                <div className="inline-block px-3 py-1.5 bg-neutral-900 rounded-lg text-[10px] text-indigo-400 font-bold">
                  تحديث البيانات مباشر • لا حاجة لإعادة التقديم
                </div>
              </div>
            ) : (
              <>
                {activeForm === 'ad' && (
                  <form onSubmit={(e) => handleFormSubmit(e, 'ad')} className="space-y-6 text-right">
                    <div className="space-y-1.5 border-b border-neutral-850 pb-3">
                      <h4 className="text-lg font-extrabold text-white">إنشاء والترويج لإعلان تجاري جديد</h4>
                      <p className="text-xs text-neutral-400">املأ البيانات المناسبة لربط إعلانك بجميع مستثمري شوجر بيزنس إي جي في مصر</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">اسم المسؤول للاتصال</label>
                        <input 
                          type="text" 
                          required
                          value={adForm.name}
                          onChange={(e) => setAdForm({ ...adForm, name: e.target.value })}
                          placeholder="مثال: أحمد محمود"
                          className="w-full text-sm bg-neutral-950/50 hover:bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white transition-colors text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">رقم الهاتف (الواتساب)</label>
                        <input 
                          type="tel" 
                          required
                          value={adForm.phone}
                          onChange={(e) => setAdForm({ ...adForm, phone: e.target.value })}
                          placeholder="مثال: 01012345678"
                          className="w-full text-sm bg-neutral-950/50 hover:bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white transition-colors text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">اسم النشاط أو المعرض</label>
                        <input 
                          type="text" 
                          required
                          value={adForm.businessName}
                          onChange={(e) => setAdForm({ ...adForm, businessName: e.target.value })}
                          placeholder="مثال: معرض الهدى للأجهزة الكهربائية"
                          className="w-full text-sm bg-neutral-950/50 hover:bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white transition-colors text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">متوسط ميزانية الترويج الشهرية</label>
                        <select 
                          value={adForm.budget}
                          onChange={(e) => setAdForm({ ...adForm, budget: e.target.value })}
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white transition-colors text-right"
                        >
                          <option value="budget-1">من 3,000 إلى 5,000 ج.م</option>
                          <option value="budget-2">من 5,000 إلى 15,000 ج.م</option>
                          <option value="budget-3">أكثر من 15,000 ج.م شهرياً</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-300">ملاحظات أو عروض خاصة لحاملي كروت شوجر (اختياري)</label>
                      <textarea 
                        rows={3}
                        value={adForm.notes}
                        onChange={(e) => setAdForm({ ...adForm, notes: e.target.value })}
                        placeholder="مثل تقديم خصم 20% لحاملي الكارت في مصر..."
                        className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white transition-colors text-right"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setActiveForm(null)}
                        className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-450 hover:bg-neutral-900 text-xs font-bold cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-indigo-500 to-purple-600 text-white hover:opacity-90 text-xs font-bold shadow-lg shadow-indigo-500/10 cursor-pointer"
                      >
                        إرسال الطلب وحجز إعلاني
                      </button>
                    </div>
                  </form>
                )}

                {activeForm === 'service' && (
                  <form onSubmit={(e) => handleFormSubmit(e, 'service')} className="space-y-6 text-right">
                    <div className="space-y-1.5 border-b border-neutral-850 pb-3">
                      <h4 className="text-lg font-extrabold text-white">تسجيل وإضافة خدمة جديدة</h4>
                      <p className="text-xs text-neutral-400">انضم للجهات الخدمية المعتمدة في شوجر بيزنس ووفر خدماتك المتميزة للجمهور</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">الاسم الثلاثي لمالك النشاط</label>
                        <input 
                          type="text" 
                          required
                          value={serviceForm.name}
                          onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                          placeholder="مثال: د. ياسر شاهين"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">رقم الهاتف الفوري للمتابعة</label>
                        <input 
                          type="tel" 
                          required
                          value={serviceForm.phone}
                          onChange={(e) => setServiceForm({ ...serviceForm, phone: e.target.value })}
                          placeholder="مثال: 01234567890"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">اسم الخدمة أو اسم العيادة/المحل</label>
                        <input 
                          type="text" 
                          required
                          value={serviceForm.serviceName}
                          onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
                          placeholder="مثال: مركز الشفاء للعلاج الطبيعي والعمود الفقري"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">تصنيف النشاط الرائد</label>
                        <select 
                          value={serviceForm.sector}
                          onChange={(e) => setServiceForm({ ...serviceForm, sector: e.target.value })}
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        >
                          <option value="طبى">عيادات وأطباء رعاية صحية</option>
                          <option value="تحاليل">معامل تحاليل ومراكز أشعة</option>
                          <option value="كهربائيات">معارض أجهزة كهربائية وموبيليا</option>
                          <option value="كافيه">أغذية وطعام ومشروبات</option>
                          <option value="شحن">لوجستيات وشحن تجاري</option>
                          <option value="عام">أخرى</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-300">الموقع الجغرافي الكامل فروع مصر</label>
                      <input 
                        type="text" 
                        required
                        value={serviceForm.region}
                        onChange={(e) => setServiceForm({ ...serviceForm, region: e.target.value })}
                        placeholder="مثل: الجيزة، شارع الهرم الرئيسي بجوار البنك الأهلي"
                        className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setActiveForm(null)}
                        className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-450 hover:bg-neutral-900 text-xs font-bold cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-indigo-500 to-purple-600 text-white hover:opacity-90 text-xs font-bold shadow-lg shadow-indigo-500/10 cursor-pointer"
                      >
                        تأكيد الإدراج المجاني
                      </button>
                    </div>
                  </form>
                )}

                {activeForm === 'card' && (
                  <form onSubmit={(e) => handleFormSubmit(e, 'card')} className="space-y-6 text-right">
                    <div className="space-y-1.5 border-b border-neutral-850 pb-3">
                      <h4 className="text-lg font-extrabold text-white">طلب كارت شوجر بيزنس الذكي (Sugar Smart Member Card)</h4>
                      <p className="text-xs text-neutral-400">للحفاظ على هويتك كشريك مميز للاستفادة بخصومات حقيقية تتجاوز الـ 30% لدى كافة القطاعات المدرجة</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">الاسم الكامل (كما هو بالبطاقة الشخصية)</label>
                        <input 
                          type="text" 
                          required
                          value={cardForm.name}
                          onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                          placeholder="مثال: كريم حامد البنا"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">رقم الهاتف للتواصل للشحن</label>
                        <input 
                          type="tel" 
                          required
                          value={cardForm.phone}
                          onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })}
                          placeholder="مثال: 01123456789"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">الرقم القومي (١٤ رقم لغايات المطابقة القانونية لضمان الأمن)</label>
                        <input 
                          type="text" 
                          required
                          maxLength={14}
                          value={cardForm.NationalId}
                          onChange={(e) => setCardForm({ ...cardForm, NationalId: e.target.value })}
                          placeholder="مثال: 29501011234567"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-300">طريقة استلام الكارت المعتمدة</label>
                        <select 
                          value={cardForm.deliveryMethod}
                          onChange={(e) => setCardForm({ ...cardForm, deliveryMethod: e.target.value })}
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        >
                          <option value="home">شحن فوري للمنزل (خلال ٤٨ ساعة)</option>
                          <option value="branch">استلام يدوي من مقر الإدارة الرئيسي</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-300">عنوان التوصيل الكامل بالتفصيل</label>
                      <input 
                        type="text" 
                        required
                        value={cardForm.address}
                        onChange={(e) => setCardForm({ ...cardForm, address: e.target.value })}
                        placeholder="مثل: منطقة التجمع الخامس، شارع التسعين، فرع عمارة رقم 45 شقة 3"
                        className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setActiveForm(null)}
                        className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-450 hover:bg-neutral-900 text-xs font-bold cursor-pointer"
                      >
                        إلغاء مراجعة البيانات
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-indigo-500 to-purple-600 text-white hover:opacity-90 text-xs font-bold shadow-lg shadow-indigo-500/10 cursor-pointer"
                      >
                        تأكيد طلب إصدار الكارت
                      </button>
                    </div>
                  </form>
                )}

                {activeForm === 'work' && (
                  <form onSubmit={(e) => handleFormSubmit(e, 'work')} className="space-y-6 text-right" dir="rtl">
                    <div className="space-y-1.5 border-b border-neutral-850 pb-3 flex items-center justify-between flex-wrap gap-3 text-right">
                      <div>
                        <h4 className="text-lg font-extrabold text-white text-right">طلب توظيف (دوام كامل / Full-Time)</h4>
                        <p className="text-xs text-neutral-400 text-right">انضم إلى شوجر بيزنس إي جي في مصر وكن شريكاً في نمو مشاريع غدٍ واعد</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold px-3 py-1.5 rounded-full border border-emerald-500/20">
                        نوع التوظيف: دوام كامل (Full-Time)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-neutral-300">الاسم كامل</label>
                        <input 
                          type="text" 
                          required
                          value={workForm.name}
                          onChange={(e) => setWorkForm({ ...workForm, name: e.target.value })}
                          placeholder="الاسم كامل"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-neutral-300">رقم الموبايل</label>
                        <input 
                          type="tel" 
                          required
                          value={workForm.phone}
                          onChange={(e) => setWorkForm({ ...workForm, phone: e.target.value })}
                          placeholder="رقم الموبايل"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-neutral-300">البريد الإلكتروني</label>
                        <input 
                          type="email" 
                          required
                          value={workForm.email}
                          onChange={(e) => setWorkForm({ ...workForm, email: e.target.value })}
                          placeholder="البريد الإلكتروني"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-neutral-300">العنوان / المنطقة</label>
                        <input 
                          type="text" 
                          required
                          value={workForm.address}
                          onChange={(e) => setWorkForm({ ...workForm, address: e.target.value })}
                          placeholder="العنوان / المنطقة"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-neutral-300">رقم البطاقة الشخصية (الرقم القومي - ١٤ رقماً)</label>
                        <input 
                          type="text" 
                          required
                          maxLength={14}
                          value={workForm.nationalId}
                          onChange={(e) => setWorkForm({ ...workForm, nationalId: e.target.value })}
                          placeholder="رقم البطاقة الشخصية (الرقم القومي)"
                          className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                        />
                      </div>
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-neutral-300">طبيعة العقد والطلب</label>
                        <input 
                          type="text" 
                          disabled
                          value="طلب توظيف دوام كامل (Full-Time Application)"
                          className="w-full text-sm bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-450 text-right cursor-not-allowed font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-right">
                      <label className="text-xs font-bold text-neutral-300">نبذة عنك</label>
                      <textarea 
                        rows={3}
                        required
                        value={workForm.about}
                        onChange={(e) => setWorkForm({ ...workForm, about: e.target.value })}
                        placeholder="نبذة عنك"
                        className="w-full text-sm bg-neutral-950/50 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-right"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right">
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-neutral-300">الصورة الشخصية (Personal Photo)</label>
                        <div className="relative border-2 border-dashed border-neutral-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all bg-neutral-950/45 flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
                          <input 
                            type="file" 
                            accept="image/*"
                            required
                            onChange={(e) => handleFileChange(e, 'photo')}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Camera className="w-8 h-8 text-neutral-500" />
                          <span className="text-xs font-bold text-neutral-200">
                            {workForm.photoName ? workForm.photoName : 'لم يتم اختيار أي ملف'}
                          </span>
                          <span className="text-[10px] text-neutral-500">PNG, JPG, JPEG • اضغط واشحنها مباشرة</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-right">
                        <label className="text-xs font-bold text-neutral-300">سي في (CV)</label>
                        <div className="relative border-2 border-dashed border-neutral-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all bg-neutral-950/45 flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            required
                            onChange={(e) => handleFileChange(e, 'cv')}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <FileText className="w-8 h-8 text-neutral-500" />
                          <span className="text-xs font-bold text-neutral-200">
                            {workForm.cvName ? workForm.cvName : 'لم يتم اختيار أي ملف'}
                          </span>
                          <span className="text-[10px] text-neutral-500">PDF, DOC, DOCX • السيرة الذاتية المهنية</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 text-right">
                      <button 
                        type="button" 
                        onClick={() => setActiveForm(null)}
                        className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-450 hover:bg-neutral-900 text-xs font-bold cursor-pointer"
                      >
                        إلغاء التقديم
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-indigo-500 to-purple-600 text-white hover:opacity-90 text-xs font-bold shadow-lg shadow-indigo-500/10 cursor-pointer"
                      >
                        ارسال الان
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="mb-10 block select-none">
          <div className="text-center mb-4">
            <span className="text-xs text-neutral-450 font-bold block mb-1">تصفية سريعة بالقطاع والنشاط:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto px-2">
            {[
              { id: 'all', label: 'الكل (All)', icon: Sparkles, count: allSectors.length },
              { id: 'health', label: 'الرعاية والطب', icon: HeartPulse, count: allSectors.filter(s => s.category === 'health').length },
              { id: 'shopping', label: 'التسوق والأجهزة', icon: ShoppingBag, count: allSectors.filter(s => s.category === 'shopping').length },
              { id: 'food', label: 'الأغذية والمأكولات', icon: Coffee, count: allSectors.filter(s => s.category === 'food').length },
              { id: 'services', label: 'الخدمات واللوجستيات', icon: Truck, count: allSectors.filter(s => s.category === 'services').length },
              { id: 'education', label: 'التعليم والقانون', icon: BookOpen, count: allSectors.filter(s => s.category === 'education').length },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-black transition-all duration-300 transform active:scale-95 cursor-pointer ${
                    isSelected
                      ? `bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]`
                      : 'bg-[#0E0E0E] hover:bg-neutral-900 border-neutral-800 text-neutral-450 hover:text-neutral-200 hover:border-neutral-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-indigo-400' : 'text-neutral-500'}`} />
                  <span>{cat.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-indigo-500 text-white font-extrabold' : 'bg-neutral-950 border border-neutral-800 text-neutral-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input Box */}
        <div className="max-w-md mx-auto mb-16 relative">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500">
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <input 
            type="text" 
            placeholder="ابحث عن نشاطك أو قطاع معتمَد (مثل: تحاليل، دكاترة، صيدليات...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs md:text-sm bg-neutral-900 hover:bg-neutral-900/85 border border-neutral-800 focus:border-indigo-500 text-neutral-200 placeholder-neutral-500 rounded-full pr-11 pl-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-right"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute inset-y-0 left-4 text-xs text-neutral-500 hover:text-white transition-colors"
            >
              مسح
            </button>
          )}
        </div>

        {/* Two main categories grid exactly mapping to the layout shown in image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 text-right">
          
          {/* Section 1: القطاعات الاستراتيجية الفجائية */}
          <div className="space-y-6">
            <div className="border-r-4 border-indigo-500 pr-4 py-1 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white">القطاعات والمحلات الكبرى</h3>
                <p className="text-[10px] text-neutral-500 font-bold mt-0.5">HEALTHY LIVING & GENERAL SECTORS</p>
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-extrabold px-2.5 py-1 rounded-full border border-indigo-500/20">
                {selectedCategory === 'all' && !searchTerm ? '١٤ قطاع رئيسي' : `${filteredFirstGroup.length} نشط بمصر`}
              </span>
            </div>

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
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
            >
              {filteredFirstGroup.length > 0 ? (
                filteredFirstGroup.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.button 
                      key={idx} 
                      type="button"
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        show: { opacity: 1, x: 0 }
                      }}
                      onClick={() => handleSectorClick(item)}
                      className="w-full text-right p-4 rounded-2xl bg-[#0F0F0F] hover:bg-neutral-900 border border-neutral-800 hover:border-indigo-500/30 transition-all duration-300 group flex items-start gap-3.5 cursor-pointer outline-none focus:border-indigo-500"
                    >
                      <div className="p-2 w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all transform group-hover:scale-105 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <h4 className="text-sm font-black text-neutral-200 group-hover:text-white transition-colors">{item.title}</h4>
                        <span className="inline-block text-[9px] text-neutral-500 font-black tracking-wide group-hover:text-indigo-400 transition-colors uppercase">{item.tag}</span>
                      </div>
                    </motion.button>
                  );
                })
              ) : (
                <div className="col-span-2 py-8 text-center text-xs text-neutral-500 font-medium">
                  لا توجد نتائج مطابقة لمصطلح البحث أو التصفية في هذا القسم.
                </div>
              )}
            </motion.div>
          </div>

          {/* Section 2: الخدمات والموردين واللوجستيات المعتمدة */}
          <div className="space-y-6">
            <div className="border-r-4 border-purple-500 pr-4 py-1 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white">الخدمات والموردين واللوجستيات</h3>
                <p className="text-[10px] text-neutral-500 font-bold mt-0.5">VIP LIFESTYLE & SUPPLY STORES</p>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 font-extrabold px-2.5 py-1 rounded-full border border-purple-500/20">
                {selectedCategory === 'all' && !searchTerm ? '١٤ خدمة مخصصة' : `${filteredSecondGroup.length} نشط بمصر`}
              </span>
            </div>

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
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
            >
              {filteredSecondGroup.length > 0 ? (
                filteredSecondGroup.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.button 
                      key={idx} 
                      type="button"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 }
                      }}
                      onClick={() => handleSectorClick(item)}
                      className="w-full text-right p-4 rounded-2xl bg-[#0F0F0F] hover:bg-neutral-900 border border-neutral-800 hover:border-purple-500/30 transition-all duration-300 group flex items-start gap-3.5 cursor-pointer outline-none focus:border-purple-500"
                    >
                      <div className="p-2 w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[#c084fc] group-hover:bg-purple-600 group-hover:text-white transition-all transform group-hover:scale-105 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <h4 className="text-sm font-black text-neutral-200 group-hover:text-white transition-colors">{item.title}</h4>
                        <span className="inline-block text-[9px] text-neutral-500 font-black tracking-wide group-hover:text-purple-400 transition-colors uppercase">{item.tag}</span>
                      </div>
                    </motion.button>
                  );
                })
              ) : (
                <div className="col-span-2 py-8 text-center text-xs text-neutral-500 font-medium">
                  لا توجد نتائج مطابقة لمصطلح البحث أو التصفية في هذا القسم.
                </div>
              )}
            </motion.div>
          </div>

        </div>

        {/* Security / Certification badge at the bottom of the sectors list */}
        <div className="mt-16 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-850 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-indigo-500/10 text-indigo-400">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <h4 className="text-sm font-extrabold text-white">جميع الفروع والجهات تخضع لميثاق الجودة والمراقبة المالية دورياً</h4>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
            يهدف نظام شوجر بيزنس إي جي المطور منذ عام ٢٠٢٢ إلى تنظيم المدفوعات وتوفير ميثاق أمان مستدام يضمن نسبة ربحية ثابتة لبرنامج المضاربات والشراكات للمستثمرين.
          </p>
        </div>

      </div>

      {/* Sector Detail interactive Modal */}
      {selectedSector && (() => {
        const SectorIcon = selectedSector.icon;
        const details = getSectorDetails(selectedSector);
        return (
          <div 
            id="sector-details-modal" 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
          >
            {/* Blur Backdrop */}
            <div 
              className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300" 
              onClick={() => setSelectedSector(null)}
            />

            {/* Modal Card wrapper */}
            <div 
              className="bg-[#0A0A0A] border border-neutral-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.25)] relative z-10 transform transition-all duration-300 scale-100 flex flex-col text-right animate-in fade-in zoom-in-95 duration-200"
              dir="rtl"
            >
              {/* Header background flare */}
              <div className="absolute top-0 right-0 left-0 h-48 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

              {/* Main scrollable body */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-neutral-800">
                
                {/* Close and Category tag row */}
                <div className="flex items-center justify-between border-b border-neutral-850 pb-5">
                  <button 
                    type="button"
                    onClick={() => setSelectedSector(null)}
                    className="p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800/80 hover:text-white text-neutral-400 border border-neutral-800 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                    aria-label="إغلاق النافذة"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-xs font-mono tracking-wider font-extrabold uppercase bg-neutral-900 border border-neutral-850 px-3 py-1.5 rounded-full text-indigo-400">
                      {selectedSector.tag}
                    </span>
                  </div>
                </div>

                {/* Header info layout */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="p-4 rounded-2.5xl bg-neutral-900 border border-neutral-800 text-indigo-400 shrink-0 shadow-inner flex items-center justify-center w-16 h-16 transform hover:rotate-12 transition-transform duration-300">
                    <SectorIcon className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 text-center sm:text-right">
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {selectedSector.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold font-mono text-neutral-500 tracking-wider">
                      SECURED BUSINESS PARTNERSHIP • EST. 2022
                    </p>
                  </div>
                </div>

                {/* Description Box */}
                <div className="space-y-1.5 text-right">
                  <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest block">نظرة عامة على القطاع والشراكة:</h4>
                  <p className="text-sm text-neutral-300 leading-relaxed font-medium bg-[#0E0E0E]/80 border border-neutral-850/60 p-4 rounded-2xl text-right">
                    {details.description}
                  </p>
                </div>

                {/* Key Benefits List */}
                <div className="space-y-3 text-right">
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest block">أبرز المزايا والمكاسب التنافسية بهذا النشاط:</h4>
                  <div className="grid grid-cols-1 gap-2.5 text-right">
                    {details.benefits.map((benefit, i) => (
                      <div 
                        key={i} 
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-850/40 hover:border-indigo-500/10 transition-colors text-right"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                        <span className="text-xs sm:text-sm text-neutral-200 font-bold leading-relaxed text-right">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Rating & Growth Banner */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-850/80">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-neutral-400 font-bold">الحوكمة والامتثال: معتمد بالصناديق</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-extrabold flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    {details.growth}
                  </div>
                </div>

                {/* Action Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setSelectedSector(null);
                      onOpenContact();
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-l from-indigo-500 to-purple-600 text-white font-black text-sm shadow-xl shadow-indigo-500/15 hover:opacity-95 transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>تواصل معنا للاستثمار والشراكة</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedSector(null)}
                    className="w-full py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-extrabold text-sm transform active:scale-95 transition-all cursor-pointer"
                  >
                    الرجوع إلى القائمة
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

    </section>
  );
};
