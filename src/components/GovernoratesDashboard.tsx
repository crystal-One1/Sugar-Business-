import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  MapPin, 
  TrendingUp, 
  Users, 
  ChevronLeft, 
  FileText, 
  PhoneCall, 
  ShieldCheck, 
  Calculator as CalcIcon, 
  Search, 
  X, 
  Info, 
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  Globe,
  Settings,
  Plus,
  Trash2,
  Clock,
  Eye,
  CheckCircle,
  Share2,
  AlertTriangle,
  CreditCard,
  History,
  TrendingDown,
  Activity,
  Lock
} from 'lucide-react';
import { User, Transaction } from '../types';
import { useCMS, ServiceProvider } from '../CMSContext';
import { ImageUploader } from './ImageUploader';

interface GovernoratesDashboardProps {
  currentUser: User | null;
  onOpenContact: () => void;
}

export interface GovernorateData {
  id: string;
  name: string;
  fullName: string;
  photoUrl: string;
  capital: string;
  sectors: string[];
  activeInvestment: string;
  annualROI: string;
  activePartners: number;
  branches: { name: string; address: string; capacity: string }[];
  supervisors: { name: string; role: string; phone: string }[];
  news: string;
  description: string;
  emblemSvg: () => React.ReactNode;
}

// 5 Main Governorates represented in detail
const FIVE_MAIN_GOVERNORATES: GovernorateData[] = [
  {
    id: 'asyut',
    name: 'أسيوط',
    fullName: 'محافظة أسيوط',
    photoUrl: 'https://images.unsplash.com/photo-1572252009286-268ecec500d0?auto=format&fit=crop&q=80&w=600',
    capital: 'أسيوط الجديدة',
    sectors: ['صناعة السكر وتكريره', 'اللوجستيات والشحن البري', 'تعبئة وتوزيع السكر المعتمد'],
    activeInvestment: '٢٤,٥٠٠,٠٠٠ ج.م',
    annualROI: '٣٨.٤٪ - ٤٢.٥٪',
    activePartners: 3410,
    branches: [
      { name: 'مستودع غرب أسيوط المركزي', address: 'المنطقة الصناعية ببني غالب، أسيوط', capacity: '١٥,٠0٠ طن متري' },
      { name: 'نقطة توزيع الفتح الإقليمية', address: 'طريق أسيوط الغردقة المشترك، الفتح', capacity: '٥,٠٠٠ طن بالتعبئة' }
    ],
    supervisors: [
      { name: 'م. أشرف عبد الموجود السيوطي', role: 'كبير مراقبي جودة خطوط الشحن', phone: '01011223344' },
      { name: 'أ. حامد الشناوي', role: 'مدير العمليات والتعويضات المباشرة', phone: '01022334455' }
    ],
    news: 'يجري حالياً مضاعفة الطاقة الاستيعابية لمخازن الفتح لتسهيل عمليات التوزيع الصيفية وتغطية احتياجات قطاعات المضاربة في جنوب الصعيد.',
    description: 'تعتبر محافظة أسيوط هي العاصمة الاقتصادية لإقليم جنوب الصعيد وحجر الزاوية اللوجستي لعمليات شوجر بيزنس إي جي التجارية.',
    emblemSvg: () => (
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="#1D4ED8" strokeWidth="3" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="41" fill="#FFFBEB" />
        <path d="M50 20 L58 36 L75 36 L61 46 L67 63 L50 52 L33 63 L39 46 L25 36 L42 36 Z" fill="#D97706" />
        <circle cx="50" cy="46" r="10" fill="#1E3A8A" />
        <path d="M45 46 Q50 38 55 46 Z" fill="#FFFFFF" />
        <ellipse cx="50" cy="50" rx="4" ry="1.5" fill="#DC2626" />
        <path d="M22 65 Q18 50 24 35" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M78 65 Q82 50 76 35" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
        <text x="50" y="80" textAnchor="middle" fill="#1E3A8A" fontSize="8" fontWeight="bold">أسيوط</text>
      </svg>
    )
  },
  {
    id: 'qena',
    name: 'قنا',
    fullName: 'محافظة قنا',
    photoUrl: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600',
    capital: 'قنا الجديدة',
    sectors: ['عصر القصب الخام', 'مضاربات التوريد والتكامل الغذائي', 'الباقات العائلية التكافلية'],
    activeInvestment: '١٨,٢٠٠,٠٠٠ ج.م',
    annualROI: '٣٦.٥٪ - ٤٠.٢٪',
    activePartners: 2190,
    branches: [
      { name: 'خزانات تفريغ قنا الكبرى', address: 'شمال الكوبري العلوي، مدينة قنا', capacity: '٩,٠٠٠ طن مكرر' },
      { name: 'مركز شحن نجع حمادي المعتمد', address: 'بجوار مصنع سكر نجع حمادي، نجع حمادي', capacity: '١٢,٠٠٠ طن سنوي' }
    ],
    supervisors: [
      { name: 'أ. رضوان خلف الله الجبالي', role: 'رئيس لجنة الحوكمة واستحقاق الأرباح لتوريد الصعيد', phone: '01055667788' }
    ],
    news: 'ارتفعت أصول عقود توريد السيلوز وقصب السكر هذا الأسبوع بقنا لتسجل نمواً يعزز هامش الأرباح الإضافية لأعضاء كارت شوجر بنسبة ٢٪.',
    description: 'تحتل محافظة قنا مكانة تاريخية في صناعة استخراج قصب السكر، وهي بمثابة المركز الإنتاجي الأول للشراكات التوريدية بالمنصة.',
    emblemSvg: () => (
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="#1D4ED8" strokeWidth="3" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="41" fill="#EFF6FF" />
        <rect x="35" y="38" width="30" height="24" rx="2" fill="#D97706" />
        <rect x="42" y="46" width="16" height="16" fill="#EFF6FF" />
        <polygon points="32,38 68,38 62,32 38,32" fill="#92400E" />
        <line x1="46" y1="46" x2="46" y2="62" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="54" y1="46" x2="54" y2="62" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M25 70 Q37.5 65 50 70 T75 70" stroke="#2563EB" strokeWidth="2.5" fill="none" />
        <path d="M25 76 Q37.5 71 50 76 T75 76" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
        <text x="50" y="27" textAnchor="middle" fill="#92400E" fontSize="8" fontWeight="bold">قنا</text>
      </svg>
    )
  },
  {
    id: 'minya',
    name: 'المنيا',
    fullName: 'محافظة المنيا',
    photoUrl: 'https://images.unsplash.com/photo-1608958416733-be6834b6b177?auto=format&fit=crop&q=80&w=600',
    capital: 'المنيا الجديدة',
    sectors: ['استصلاح أراضي السكر', 'تطوير خطوط عصر وتدوير البنجر', 'عقود تزويد الفنادق الكبرى المغلقة'],
    activeInvestment: '٢٩,٠٠٠,٠٠٠ ج.م',
    annualROI: '٤٠.٠٪ - ٤٥.١٪',
    activePartners: 4120,
    branches: [
      { name: 'مجمع مستودعات شرق النيل', address: 'طريق المنيا الصحراوي الشرقي، المنيا', capacity: '٢٢,٠٠٠ طن تخزين كلي' },
      { name: 'محطة الفرز الآلي بملوي', address: 'المنطقة الصناعية بملوي، المنيا', capacity: '١١,٠٠٠ طن إنتاج' }
    ],
    supervisors: [
      { name: 'د. يوسف المغازي', role: 'مستشار الجدوى الزراعية في المنيا الكبرى', phone: '01066778899' },
      { name: 'م. مريم جرجس حنا', role: 'مدير محطة كرتنة وتعبئة السلع الاستراتيجية', phone: '01077889900' }
    ],
    news: 'تم البدء في التشغيل التجريبي للتوسعة الثالثة لساحة تخريد بنجر السكر شرق النيل بمقدار ١٠ آلاف طن إضافية لضمان أمان الشركاء.',
    description: 'عروس الصعيد وأعظم قلاع استزراع بنجر السكر الحديث في الشرق الأوسط، وتعد من أكثر المحافظات تحقيقاً لنسب العوائد بالمنصة.',
    emblemSvg: () => (
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="#1D4ED8" strokeWidth="3" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="41" fill="#FFF7ED" />
        <path d="M42 68 Q50 68 52 58 Q55 52 50 42 Q45 32 47 25 L58 20 L62 44 Q60 55 54 68 Z" fill="#065F46" />
        <circle cx="52" cy="28" r="4" fill="#F59E0B" />
        <path d="M38 68 H62 L58 75 H42 Z" fill="#DC2626" />
        <path d="M25 65 Q18 50 25 35 Q50 20 75 35 Q82 50 75 65" stroke="#059669" strokeWidth="2" strokeDasharray="2 3" fill="none" />
        <text x="50" y="83" textAnchor="middle" fill="#047857" fontSize="8" fontWeight="bold">المنيا</text>
      </svg>
    )
  },
  {
    id: 'sohag',
    name: 'سوهاج',
    fullName: 'محافظة سوهاج',
    photoUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=600',
    capital: 'سوهاج الجديدة',
    sectors: ['النقل الروتيني والسكك الحديدية', 'البيع المباشر والتعاقدات الحكومية', 'لوجستيات الشحن المائي'],
    activeInvestment: '١٥,٩٠٠,٠٠٠ ج.م',
    annualROI: '٣٥.٠٪ - ٣٩.٢٪',
    activePartners: 1850,
    branches: [
      { name: 'مخازن الكوثر الشاملة', address: 'حي الكوثر الفرعي، سوهاج', capacity: '٨,٥٠٠ طن غذائي ومعبأ' },
      { name: 'مستودع جرجا الجنوبي للمضاربات', address: 'المنطقة الصناعية الكايرولوجية، جرجا', capacity: '٦,٠٠٠ طن مكرر' }
    ],
    supervisors: [
      { name: 'المستشار علاء الدين السوهاجي', role: 'كبير المستشارين القانونيين للتوثيق المباشر بمكتب الصعيد', phone: '01088990011' }
    ],
    news: 'نجحت المنصة في تغطية ٩٢٪ من منافذ بيع كارت الأمان الغذائي في جرجا والمنشأة، مع تطبيق نظام تسوية الأرباح نصف السنوي للشركاء.',
    description: 'قلب الصعيد النابض بالتجارة الأصيلة والتاريخ الفريد، وتوفر بوابة أمان متميز لكافة التعاقدات للمستثمرين المتوسطين والمحترفين.',
    emblemSvg: () => (
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="#1D4ED8" strokeWidth="3" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="41" fill="#F8FAFC" />
        <path d="M38 70 Q42 55 45 45 Q40 38 48 20 Q52 10 56 22 Q58 35 55 45 Q58 55 62 70 Z" fill="#DC2626" />
        <path d="M43 45 C48 43 52 43 55 45" stroke="#F59E0B" strokeWidth="2" fill="none" />
        <rect x="42" y="70" width="16" height="6" fill="#1E3A8A" />
        <text x="50" y="84" textAnchor="middle" fill="#1E3A8A" fontSize="7" fontWeight="bold">سوهاج</text>
        <circle cx="50" cy="13" r="1.5" fill="#F59E0B" />
      </svg>
    )
  },
  {
    id: 'alexandria',
    name: 'الإسكندرية',
    fullName: 'محافظة الإسكندرية',
    photoUrl: 'https://images.unsplash.com/photo-1552331501-13c54fb9f82d?auto=format&fit=crop&q=80&w=600',
    capital: 'الإسكندرية',
    sectors: ['التصدير والاستيراد البحري', 'عقود الشحن للحسابات الإقليمية ومصانع الدلتا', 'تزويد الموانئ بالحصص المعتمدة'],
    activeInvestment: '٣١,٢٠٠,٠٠٠ ج.م',
    annualROI: '٤٢.٢٪ - ٤٦.٨٪',
    activePartners: 5890,
    branches: [
      { name: 'مستودع المكس البحري العملاق', address: 'بجوار ممر الدخول بميناء الإسكندرية، الإسكندرية', capacity: '٣٥,٠٠٠ طن كلي' },
      { name: 'ساحة الدخيلة للتداول والفرز الخارجي', address: 'طريق الميناء الجديد، الدخيلة', capacity: '٢٠,٠٠٠ طن مفرز' }
    ],
    supervisors: [
      { name: 'ربان بحري طارق رستم', role: 'مدير لوجستيات التصدير البحري والتفاوض الإقليمي', phone: '01099001122' },
      { name: 'أ. جيهان السكندري', role: 'منسق عام حسابات الشركات وعقود الامتياز الفيدرالي', phone: '01033445566' }
    ],
    news: 'بدأت أعمال تحميل أولى سفن التصدير الموثقة لـ شوجر بيزنس إي جي لشمال أفريقيا هذا الأسبوع، مما يحفز نمو عوائد باقات الاستثمار الرأسمالية الكبرى.',
    description: 'عروس البحر الأبيض المتوسط وبوابتنا الصناعية الاستراتيجية للتصدير الخارجي وخطوط التجارة الدولية والتبادل البيني.',
    emblemSvg: () => (
      <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="#1D4ED8" strokeWidth="3" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="41" fill="#F0FDF4" />
        <rect x="46" y="35" width="8" height="25" fill="#1E3A8A" />
        <polygon points="44,35 56,35 50,22" fill="#D97706" />
        <circle cx="50" cy="20" r="2.5" fill="#FCE7F3" className="animate-pulse" />
        <path d="M43 60 H57 L55 68 H45 Z" fill="#475569" />
        <path d="M30 72 Q40 68 50 72 T70 72" stroke="#0284C7" strokeWidth="2" fill="none" />
        <path d="M28 78 Q40 74 52 78 T72 78" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
        <text x="50" y="85" textAnchor="middle" fill="#1E3A8A" fontSize="7.5" fontWeight="bold">الأسكندرية</text>
      </svg>
    )
  }
];

// Remaining 22 governorates for buttons in grid
const THE_REST_OF_GOVERNORATES = [
  { id: 'cairo', name: 'القاهرة', capital: 'القاهرة', roi: '٤٤٪', capacity: '٥٥,٠٠٠ طن تعاقد تجاري' },
  { id: 'giza', name: 'الجيزة', capital: 'الجيزة', roi: '٤١٪', capacity: '٤٠,٠٠٠ طن لوجستي' },
  { id: 'qalyubia', name: 'القليوبية', capital: 'بنها', roi: '٣٩٪', capacity: '١٥,٠٠٠ طن لتوريد الخامات' },
  { id: 'dakahlia', name: 'الدقهلية', capital: 'المنصورة', roi: '٤٢٪', capacity: '٢٥,٠٠٠ طن مستودع شمال الدلتا' },
  { id: 'sharkia', name: 'الشرقية', capital: 'الزقازيق', roi: '٤٠٪', capacity: '٣٠,٠٠٠ طن لوجستيات توزيع وثائقي' },
  { id: 'gharbia', name: 'الغربية', capital: 'طنطا', roi: '٣٨٪', capacity: '١٢,٠٠٠ طن تعبئة وتجزيء وسط الدلتا' },
  { id: 'monufia', name: 'المنوفية', capital: 'شبين الكوم', roi: '٣٧٪', capacity: '١٠,٠٠٠ طن مستودع مأمون الجانب' },
  { id: 'beheira', name: 'البحيرة', capital: 'دمنهور', roi: '٤١٪', capacity: '٢٠,٠٠٠ طن سليم تخزين الحبوب' },
  { id: 'kafr-el-sheikh', name: 'كفر الشيخ', capital: 'كفر الشيخ', roi: '٤٣٪', capacity: '٣٢,٠٠٠ طن تكرير من البنجر مباشر' },
  { id: 'damietta', name: 'دمياط', capital: 'دمياط', roi: '٤٤٪', capacity: '١٨,٠٠٠ طن امتياز ميناء دمياط البحري' },
  { id: 'port-said', name: 'بورسعيد', capital: 'بورسعيد', roi: '٤٥٪', capacity: '١٤,٠٠٠ طن منطقة معفية جمركياً' },
  { id: 'ismailia', name: 'الإسماعيلية', capital: 'الإسماعيلية', roi: '٤٠٪', capacity: '١٦,٠٠٠ طن منطقة حليفة القناة السويس' },
  { id: 'suez', name: 'السويس', capital: 'السويس', roi: '٤٢٪', capacity: '١٢,٠٠٠ طن تموين صناعي إقليمي لخليج السويس' },
  { id: 'luxor', name: 'الأقصر', capital: 'الأقصر', roi: '٣٧٪', capacity: '٨,٠٠٠ طن سياحة إستراتيجية وفندقة مغلقة' },
  { id: 'aswan', name: 'أسوان', capital: 'أسوان', roi: '٣٩٪', capacity: '١٠,٠٠٠ طن كوم أمبو وخطوط عصر السكر الكبرى' },
  { id: 'faiyum', name: 'الفيوم', capital: 'الفيوم', roi: '٣٦٪', capacity: '٧,٠٠٠ طن توزيع وصناعات تعبئة صغيرة' },
  { id: 'beni-suef', name: 'بني سويف', capital: 'بني سويف', roi: '٣٨٪', capacity: '٩,٥٠٠ طن مستوع الصعيد الأول للتخزين الصناعي' },
  { id: 'matrouh', name: 'مطروح', capital: 'مرسى مطروح', roi: '٣٩٪', capacity: '٥,٠٠٠ طن تأمين خطوط مطروح وتوريد ليبيا البيني' },
  { id: 'red-sea', name: 'البحر الأحمر', capital: 'الغردقة', roi: '٤١٪', capacity: '٦,٠٠٠ طن لوجستيات موانئ سفاجا والغردقة' },
  { id: 'new-valley', name: 'الوادي الجديد', capital: 'الخارجة', roi: '٤١٪', capacity: '١٥,٠٠٠ طن استصلاح زراعي للسلع السكرية الكبرى' },
  { id: 'north-sinai', name: 'شمال سيناء', capital: 'العريش', roi: '٣٨٪', capacity: '٥,٥٠٠ طن خطوط تطوير ومنافذ التوزيع الأمني' },
  { id: 'south-sinai', name: 'جنوب سيناء', capital: 'الطور', roi: '٤٠٪', capacity: '٤,٢٠٠ طن تغذية شرم الشيخ ودهب بالحصص القانونية' }
];

const DEFAULT_SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: 'prov-asyut-1',
    govId: 'asyut',
    name: "م. محمد فوزي جلال السيوطي",
    serviceName: "معرض النخبة للأثاث المنزلي والمطابخ والموبيليات الفاخرة",
    serviceType: "الموبيليا والأثاث المنزلي",
    photoUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400",
    extraPhotos: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=400"
    ],
    address: "شارع الهلالي، بجوار سينما رنيسانس، أسيوط",
    phone: "01098765432",
    websiteUrl: "https://sugar-furniture.com",
    locationUrl: "https://maps.google.com/?q=27.1818,31.1895",
    description: "يقدم معرض النخبة أرقى الموبيليات العصرية بتسهيلات متميزة جداً لمنتسبي بطاقة شوجر وعوائل الشراكة في محافظات الصعيد.",
    workingHours: "مفتوح الآن • يغلق الساعة ١٠:٠٠ مساءً"
  },
  {
    id: 'prov-asyut-2',
    govId: 'asyut',
    name: "د. هاني عياد عبد الملاك",
    serviceName: "سلسلة معامل التميز للتحاليل الطبية الشاملة والفحوصات الجينية",
    serviceType: "معامل التحاليل الطبية",
    photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
    extraPhotos: [
      "https://images.unsplash.com/photo-1579154204601-01588f35116f?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=400"
    ],
    address: "طريق النميس، برج الأطباء الاستثماري، أسيوط",
    phone: "01288776655",
    websiteUrl: "https://sugar-labs-excellence.com",
    locationUrl: "https://maps.google.com/?q=27.1856,31.1843",
    description: "تقدم معامل التميز تخفيض فوري قدره ٤٠٪ وأولوية الخدمة لجميع شركاء ومستثمري ومسؤولي شوجر بيزنس إي جي.",
    workingHours: "يفتح غداً • من ٩:٠٠ صباحاً إلى ١١:٠٠ مساءً"
  },
  {
    id: 'prov-qena-1',
    govId: 'qena',
    name: "أ. عبد الرحيم قناوي الجبلاوي",
    serviceName: "معرض قصر الهلال للأجهزة الكهربائية المنزلية والتكييفات والمبردات",
    serviceType: "معارض لأجل الكهربائية",
    photoUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
    extraPhotos: [
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=400"
    ],
    address: "ميدان الساعة، بجوار بنك مصر، مدينة قنا",
    phone: "01044332211",
    websiteUrl: "https://alhilal-electro.qena-sugar.com",
    locationUrl: "https://maps.google.com/?q=26.1613,32.7158",
    description: "نوفر كافة الشاشات والأجهزة الكهربائية بأطول فترات سداد ميسرة مدعومة بكفالة استثمارية لعملاء الدعم الغذائي والمشروعات القناوية.",
    workingHours: "مفتوح الآن • يغلق الساعة ١٢:٠٠ منتصف الليل"
  },
  {
    id: 'prov-minya-1',
    govId: 'minya',
    name: "أ. فريد الديب المنياوي",
    serviceName: "معرض المستقبل للكهربائيات والإنارة الذكية ومستلزمات العرائس",
    serviceType: "معارض لأجل الكهربائية",
    photoUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400",
    extraPhotos: [
      "https://images.unsplash.com/photo-1565538810844-1e1194ac2298?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400"
    ],
    address: "كورنيش النيل، مول رويال سنتر، المنيا",
    phone: "01088776655",
    websiteUrl: "https://mustaqbal-electric.com",
    locationUrl: "https://maps.google.com/?q=28.0871,30.7618",
    description: "يقدم المعرض تسهيلات عقارية ومضاربات توريدية كاملة لخدمة تجهيز بيت الزوجية بأسعار منافسة وجودة أوروبية مضمونة بالكامل.",
    workingHours: "مفتوح الآن • يغلق الساعة ١١:٠٠ مساءً"
  },
  {
    id: 'prov-alexandria-1',
    govId: 'alexandria',
    name: "أ. كمال السيوفي السكندري",
    serviceName: "معرض الصفا والشركة السكندري للأثاث الراقي والصناعات الخشبية الكلاسيكية",
    serviceType: "الموبيليا والأثاث المنزلي",
    photoUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400",
    extraPhotos: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400"
    ],
    address: "طريق الحرية، منطقة جليم، الإسكندرية",
    phone: "01122334455",
    websiteUrl: "https://alex-royal-furniture.com",
    locationUrl: "https://maps.google.com/?q=31.2001,29.9187",
    description: "نوفر غرف نوم وصالونات فاخرة بتخفيضات تصل لـ ٢٥٪ لجميع المودعين ومؤسسي برنامج التنمية العقارية والمضاربات بـ شوجر بيزنس.",
    workingHours: "مفتوح اليوم • يغلق الساعة ١٠:٠٠ مساءً"
  }
];

const FlashSaleTimer: React.FC<{ endsAt: string }> = ({ endsAt }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endsAt) - +new Date();
      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  if (!timeLeft) {
    return (
      <div className="text-xs font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 inline-flex items-center gap-1 font-mono">
        ⌛ انتهى وقت هذا العرض
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 font-sans" dir="rtl">
      <span className="text-[10px] text-neutral-400 ml-1">ينتهي خلال:</span>
      {timeLeft.days > 0 && (
        <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-xs font-black min-w-[20px] text-center font-mono">
          {timeLeft.days} يوم
        </span>
      )}
      <span className="bg-neutral-900 border border-neutral-800 text-amber-500 px-2 py-0.5 rounded text-xs font-black min-w-[25px] text-center font-mono">
        {String(timeLeft.hours).padStart(2, '0')}
      </span>
      <span className="text-neutral-500 font-bold font-mono text-[10px]">:</span>
      <span className="bg-neutral-900 border border-neutral-800 text-amber-500 px-2 py-0.5 rounded text-xs font-black min-w-[25px] text-center font-mono">
        {String(timeLeft.minutes).padStart(2, '0')}
      </span>
      <span className="text-neutral-500 font-bold font-mono text-[10px]">:</span>
      <span className="bg-neutral-900 border border-neutral-800 text-rose-400 px-2 py-0.5 rounded text-xs font-black min-w-[25px] text-center font-mono">
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export const GovernoratesDashboard: React.FC<GovernoratesDashboardProps> = ({ currentUser, onOpenContact }) => {
  const { 
    providers: cmsProviders, 
    saveProvider: cmsSaveProvider, 
    deleteProvider: cmsDeleteProvider,
    settings: cmsSettings,
    translations: cmsTranslations,
    updateTranslation: cmsUpdateTranslation,
    users: cmsUsers,
    approveUser: cmsApproveUser,
    addAdmin: cmsAddAdmin,
    updateConfig: cmsUpdateConfig,
    flashSales,
    saveFlashSale: cmsSaveFlashSale,
    deleteFlashSale: cmsDeleteFlashSale,
    changePassword: cmsChangePassword,
    transactions,
    t,
    isEditModeEnabled
  } = useCMS();

  const [selectedGov, setSelectedGov] = useState<GovernorateData | null>(null);
  const [selectedRestGov, setSelectedRestGov] = useState<typeof THE_REST_OF_GOVERNORATES[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom states for Dynamic Emblem Uploading
  const [editingEmblemGov, setEditingEmblemGov] = useState<GovernorateData | null>(null);
  const [tempEmblemUrl, setTempEmblemUrl] = useState('');
  
  // Custom states for Dynamic Service Providers
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  // Admin Portal overall toggle and local subtab state
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'users' | 'providers' | 'translations' | 'settings' | 'flash_sales'>('users');

  // Restricted governorate info popup model
  const [showRestrictionModal, setShowRestrictionModal] = useState<string | null>(null);

  // Flash Sales form states
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [saleGovId, setSaleGovId] = useState<string>('all');
  const [saleTitle, setSaleTitle] = useState<string>('');
  const [saleBadge, setSaleBadge] = useState<string>('فرصة وقتية عاجلة');
  const [saleDescription, setSaleDescription] = useState<string>('');
  const [saleEndsAt, setSaleEndsAt] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().substring(0, 16);
  });
  const [saleCtaText, setSaleCtaText] = useState<string>('احجز فرصتك الحصرية بالواتساب للتعاقد');
  const [saleSaveSuccess, setSaleSaveSuccess] = useState<string>('');

  // Change Password states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState('');
  const [cpSuccess, setCpSuccess] = useState('');

  // Load and manage service providers from CMS Context or fallback to Defaults
  useEffect(() => {
    if (cmsProviders && cmsProviders.length > 0) {
      setProviders(cmsProviders);
    } else {
      setProviders(DEFAULT_SERVICE_PROVIDERS);
    }
  }, [cmsProviders]);

  // Form states for adding/editing a provider
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProvName, setNewProvName] = useState('');
  const [newProvServiceName, setNewProvServiceName] = useState('');
  const [newProvType, setNewProvType] = useState('معارض لأجل الكهربائية');
  const [newProvPhotoUrl, setNewProvPhotoUrl] = useState('');
  const [newProvExtraPhoto1, setNewProvExtraPhoto1] = useState('');
  const [newProvExtraPhoto2, setNewProvExtraPhoto2] = useState('');
  const [newProvAddress, setNewProvAddress] = useState('');
  const [newProvPhone, setNewProvPhone] = useState('');
  const [newProvWebsiteUrl, setNewProvWebsiteUrl] = useState('');
  const [newProvLocationUrl, setNewProvLocationUrl] = useState('');
  const [newProvDescription, setNewProvDescription] = useState('');
  const [newProvWorkingHours, setNewProvWorkingHours] = useState('مفتوح الآن • يغلق الساعة ١٠:٠٠ مساءً');
  const [newProvAudience, setNewProvAudience] = useState<'all' | 'members'>('all');

  // Edit states for existing provider in dynamic dialog
  const [isEditingProviderId, setIsEditingProviderId] = useState<string | null>(null);

  // Translation editing state
  const [transSearch, setTransSearch] = useState('');
  const [editingTransKey, setEditingTransKey] = useState<string | null>(null);
  const [editingTransVal, setEditingTransVal] = useState('');

  // Add new admin state
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminNationalId, setNewAdminNationalId] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminAddSuccess, setAdminAddSuccess] = useState('');
  const [adminAddError, setAdminAddError] = useState('');

  // Global settings local form states
  const [configWhatsapp, setConfigWhatsapp] = useState(cmsSettings.whatsappNumber || '');
  const [configBannerText, setConfigBannerText] = useState(cmsSettings.bannerText || '');
  const [configShowNotification, setConfigShowNotification] = useState(cmsSettings.showNotification);
  const [configSaveSuccess, setConfigSaveSuccess] = useState('');

  // User governorate update loading state
  const [updatingUserPhone, setUpdatingUserPhone] = useState<string | null>(null);

  useEffect(() => {
    setConfigWhatsapp(cmsSettings.whatsappNumber || '');
    setConfigBannerText(cmsSettings.bannerText || '');
    setConfigShowNotification(cmsSettings.showNotification);
  }, [cmsSettings]);

  // Standard keys list that the admin can edit dynamically
  const EDITABLE_TRANSLATION_KEYS = [
    { key: 'hero_title', label: 'العنوان الرئيسي للواجهة', defaultVal: 'المستقبل الآمن لاستثمار أموالك وعوائدك بمصر لعام ٢٠٢٦' },
    { key: 'hero_desc', label: 'الوصف الفرعي للواجهة', defaultVal: 'شارك في المضاربات اللوجستية وعقود تكرير وتوريد السكر المعتمد بنظام شراكة مرن، مستدام، ومضمون قانونيًا بجميع محافظات جمهورية مصر العربية.' },
    { key: 'about_badge', label: 'شارة التأسيس في "عن الشركة"', defaultVal: 'تأسيس 2022' },
    { key: 'about_title_brand', label: 'العنوان الفرعي في "عن الشركة"', defaultVal: 'تطبيق شوجر بيزنس إي جي' },
    { key: 'about_title', label: 'العنوان الرئيسي لقصة التأسيس', defaultVal: 'بوابتك الرائدة للاستثمار الآمن والمستمر' },
    { key: 'about_desc1', label: 'الفقرة اللوجستية الأولى للتأسيس', defaultVal: 'بعد نجاحنا المميز في عام 2022، قمنا بإنشاء تطبيق Sugar business كوجهة استثمارية فريدة وموثوقة، تم تصميمها خصيصاً لتناسب احتياجات المستثمر المصري الذي يبحث عن الأمان وتحقيق نمو مالي هيكلي حقيقي.' },
    { key: 'about_desc2', label: 'الفقرة اللوجستية الثانية للتأسيس', defaultVal: 'تتيح لك منصتنا حرية كاملة في اختيار قنوات وحلول الاستثمار بمبالغ تبدأ صغيرة لتناسب جميع الأفراد والشرائح، مع الحصول على أرباح سنوية مدروسة بطرق سلسة ومضمونة بالكامل وبأسلوب تخطيط احترافي ومبسط يسهل على الجميع التعامل معه.' },
    { key: 'about_quote', label: 'الاقتباس الإداري في "عن الشركة"', defaultVal: '"إن هـدفنا الأسمى هو تـمكين جـميع الأفراد مـن بناء وتنمية ثرواتهم وتحقيق الاستقلال المالي المنشود عبر توفير بيئة خالية من المخاطر وشراكات استراتيجية متكاملة."' },
    { key: 'about_highlight1_title', label: 'عنوان ميزة البدء بمبالغ صغيرة', defaultVal: 'البدء من 5000 جنيه فقط' },
    { key: 'about_highlight1_desc', label: 'وصف ميزة القدرة على تجزئة الأموال', defaultVal: 'نكسر حواجز الاستثمار لنجعله متاحاً ومتوفراً للجميع.' },
    { key: 'about_highlight2_title', label: 'عنوان ميزة عقود الضمان', defaultVal: 'أرباح متكاملة بضمان قانوني' },
    { key: 'about_highlight2_desc', label: 'وصف ميزة التوثيق القانوني المباشر', defaultVal: 'عقود رسمية يتم تسليمها فورياً تحفظ كامل حقوقك الاستثمارية.' }
  ];

  // Combine default keys with other custom keys from translations database
  const allKeysToShow = [...EDITABLE_TRANSLATION_KEYS];
  Object.keys(cmsTranslations).forEach(key => {
    if (!allKeysToShow.some(x => x.key === key)) {
      allKeysToShow.push({ key, label: `مفتاح مخصص ونصوص إضافية: ${key}`, defaultVal: cmsTranslations[key] });
    }
  });

  const filteredKeys = allKeysToShow.filter(item => 
    item.key.toLowerCase().includes(transSearch.toLowerCase()) || 
    item.label.toLowerCase().includes(transSearch.toLowerCase()) ||
    t(item.key, item.defaultVal).toLowerCase().includes(transSearch.toLowerCase())
  );

  // Governorate Reports state hook
  const [governorateReports, setGovernorateReports] = useState<{
    id: string;
    govId: string;
    govName: string;
    title: string;
    content: string;
    phone: string;
    capacity: string;
    createdAt: string;
  }[]>(() => {
    try {
      const saved = localStorage.getItem('sugar_gov_reports_v1');
      return saved ? JSON.parse(saved) : [
        {
          id: 'default-asyut',
          govId: 'asyut',
          govName: 'أسيوط',
          title: 'التقرير الربع سنوي لأمان المخزون الاستراتيجي بأسيوط',
          content: 'تم الإشراف بالكامل على تعبئة الحصص التموينية واللوجستيات لضمان حوكمة العوائد وتجنب المضاربات العشوائية بالصعيد.',
          phone: '01011223344',
          capacity: '20000',
          createdAt: '2026-05-24'
        }
      ];
    } catch {
      return [];
    }
  });

  // Save reports helper
  const saveReportsToLocals = (newReports: typeof governorateReports) => {
    setGovernorateReports(newReports);
    try {
      localStorage.setItem('sugar_gov_reports_v1', JSON.stringify(newReports));
    } catch (e) {
      console.error('Failed to save reports locally:', e);
    }
  };

  // Deletion confirmation state
  const [reportToDelete, setReportToDelete] = useState<{
    id: string;
    govId: string;
    govName: string;
    title: string;
    content: string;
    phone: string;
    capacity: string;
    createdAt: string;
  } | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // View state toggle for Admin
  const [adminViewMode, setAdminViewMode] = useState<'dashboard' | 'add_report'>('dashboard');

  // Input fields for report form
  const [reportGovId, setReportGovId] = useState('asyut');
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [reportPhone, setReportPhone] = useState('');
  const [reportCapacity, setReportCapacity] = useState('');
  
  // Real-time validation error tracking
  const [reportValidationErrors, setReportValidationErrors] = useState<{
    phone?: string;
    capacity?: string;
    title?: string;
    content?: string;
  }>({});

  // Real-time field helper validation function before saving
  const validateGovReportFields = (phoneStr: string, capacityStr: string, titleStr: string, contentStr: string) => {
    const errs: typeof reportValidationErrors = {};
    
    if (phoneStr) {
      const phoneRegex = /^01[0125]\d{8}$/;
      if (!phoneRegex.test(phoneStr)) {
        errs.phone = 'رقم الهاتف غير صحيح! يجب أن يتكون من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015.';
      }
    } else {
      errs.phone = 'رقم الهاتف مطلوب لتلقي تفاصيل البلاغات والتقارير.';
    }
    
    if (capacityStr) {
      const capacityNum = parseFloat(capacityStr);
      if (isNaN(capacityNum) || capacityNum <= 0) {
        errs.capacity = 'السعة يجب أن تكون رقماً موجباً أكبر من الصفر طن (مثال: 5000).';
      }
    } else {
      errs.capacity = 'يرجى إدخال السعة الاستيعابية للمنشأة.';
    }

    if (!titleStr || titleStr.trim().length < 5) {
      errs.title = 'عنوان التقرير الفعلي قصير جداً (على الأقل 5 أحرف).';
    }

    if (!contentStr || contentStr.trim().length < 10) {
      errs.content = 'مضمون التقرير وتفاصيل الجرد الإنشائي قصيرة جداً (على الأقل 10 أحرف للتوضيح).';
    }

    return errs;
  };

  // Real-time validation handler triggered as admin types
  useEffect(() => {
    if (reportPhone || reportCapacity || reportTitle || reportContent) {
      const errs = validateGovReportFields(reportPhone, reportCapacity, reportTitle, reportContent);
      setReportValidationErrors(errs);
    } else {
      setReportValidationErrors({});
    }
  }, [reportPhone, reportCapacity, reportTitle, reportContent]);

  const handleAddReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // final validation check
    const errs = validateGovReportFields(reportPhone, reportCapacity, reportTitle, reportContent);
    if (Object.keys(errs).length > 0) {
      setReportValidationErrors(errs);
      alert('يرجى مراجعة وتصحيح الحقول الحمراء ذات التنسيق غير الصالح أولاً!');
      return;
    }

    const matchedGov = FIVE_MAIN_GOVERNORATES.find(g => g.id === reportGovId) || THE_REST_OF_GOVERNORATES.find(g => g.id === reportGovId);
    const govName = matchedGov ? matchedGov.name : 'محافظة غير محددة';

    const newReportItem = {
      id: `report-${Date.now()}`,
      govId: reportGovId,
      govName,
      title: reportTitle.trim(),
      content: reportContent.trim(),
      phone: reportPhone.trim(),
      capacity: reportCapacity.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newReportItem, ...governorateReports];
    saveReportsToLocals(updated);

    // Reset and toggle back
    setReportTitle('');
    setReportContent('');
    setReportPhone('');
    setReportCapacity('');
    setAdminViewMode('dashboard');
    
    // Beautiful feedback notification
    alert(`تم إصدار التقرير بنجاح للمحافظة: ${govName}!`);
  };

  // Active Governorate ID
  const activeGovId = selectedGov ? selectedGov.id : (selectedRestGov ? selectedRestGov.id : null);

  // Filter providers based on current governorate
  const activeGovProviders = providers.filter(p => p.govId === activeGovId && (serviceFilter === 'all' || p.serviceType === serviceFilter));

  // Determine if active user is allowed to view a specific governorate
  const isGovAllowed = (govId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (!currentUser.allowedGovs) return false;
    if (currentUser.allowedGovs.includes('all')) return true;
    return currentUser.allowedGovs.includes(govId);
  };

  // Sync selected governorate from/to localStorage keyed by user's phone to persist their choice
  useEffect(() => {
    if (!currentUser) {
      setSelectedGov(null);
      setSelectedRestGov(null);
      return;
    }

    const savedGovId = localStorage.getItem(`sugar_selected_gov_id_${currentUser.phone}`);
    const savedRestGovId = localStorage.getItem(`sugar_selected_rest_gov_id_${currentUser.phone}`);

    if (savedGovId) {
      const foundMain = FIVE_MAIN_GOVERNORATES.find(g => g.id === savedGovId);
      if (foundMain && isGovAllowed(foundMain.id)) {
        setSelectedGov(foundMain);
        setSelectedRestGov(null);
      }
    } else if (savedRestGovId) {
      const foundRest = THE_REST_OF_GOVERNORATES.find(g => g.id === savedRestGovId);
      if (foundRest && isGovAllowed(foundRest.id)) {
        setSelectedRestGov(foundRest);
        setSelectedGov(null);
      }
    }
  }, [currentUser]);

  // Keep localStorage updated on manual changes
  useEffect(() => {
    if (currentUser) {
      if (selectedGov) {
        localStorage.setItem(`sugar_selected_gov_id_${currentUser.phone}`, selectedGov.id);
        localStorage.removeItem(`sugar_selected_rest_gov_id_${currentUser.phone}`);
      } else if (selectedRestGov) {
        localStorage.setItem(`sugar_selected_rest_gov_id_${currentUser.phone}`, selectedRestGov.id);
        localStorage.removeItem(`sugar_selected_gov_id_${currentUser.phone}`);
      } else {
        localStorage.removeItem(`sugar_selected_gov_id_${currentUser.phone}`);
        localStorage.removeItem(`sugar_selected_rest_gov_id_${currentUser.phone}`);
      }
    }
  }, [selectedGov, selectedRestGov, currentUser]);

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGovId) return;

    const newProvider: Partial<ServiceProvider> = {
      id: `prov-${activeGovId}-${Date.now()}`,
      govId: activeGovId,
      name: newProvName || "أخصائي معتمد",
      serviceName: newProvServiceName || "خدمة تجارية لوجستية معتمدة",
      serviceType: newProvType,
      photoUrl: newProvPhotoUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400",
      extraPhotos: [
        newProvExtraPhoto1 || "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=400",
        newProvExtraPhoto2 || "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&q=80&w=400"
      ],
      address: newProvAddress || "وسط البلد، المنطقة المركزية",
      phone: newProvPhone || "01012345678",
      websiteUrl: newProvWebsiteUrl || "https://sugar-business.com",
      locationUrl: newProvLocationUrl || "https://maps.google.com",
      description: newProvDescription || "تفاصيل الخدمة الاستثنائية لشركائنا بجميع مدن مصر.",
      workingHours: newProvWorkingHours || "مفتوح الآن • يغلق الساعة ١٠:٠٠ مساءً",
      audience: newProvAudience
    };

    const success = await cmsSaveProvider(newProvider);
    if (success) {
      setIsAddingNew(false);
      // Reset fields
      setNewProvName('');
      setNewProvServiceName('');
      setNewProvPhotoUrl('');
      setNewProvExtraPhoto1('');
      setNewProvExtraPhoto2('');
      setNewProvAddress('');
      setNewProvPhone('');
      setNewProvWebsiteUrl('');
      setNewProvLocationUrl('');
      setNewProvDescription('');
      setNewProvWorkingHours('مفتوح الآن • يغلق الساعة ١٠:٠٠ مساءً');
      setNewProvAudience('all');
    } else {
      alert("عذراً، حدث خطأ أثناء الحفظ بقاعدة البيانات المشتركة.");
    }
  };

  const handleDeleteProvider = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("هل أنت متأكد من حذف مقدم الخدمة هذا نهائياً للجميع؟")) {
      const success = await cmsDeleteProvider(id);
      if (success) {
        if (selectedProvider && selectedProvider.id === id) {
          setSelectedProvider(null);
        }
      } else {
        alert("فشلت عملية الحذف من قاعدة البيانات.");
      }
    }
  };

  const handleUpdateProvider = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const target = providers.find(p => p.id === id);
    if (!target) return;

    const updated: Partial<ServiceProvider> = {
      id,
      govId: target.govId,
      name: newProvName || target.name,
      serviceName: newProvServiceName || target.serviceName,
      serviceType: newProvType || target.serviceType,
      photoUrl: newProvPhotoUrl || target.photoUrl,
      extraPhotos: [
        newProvExtraPhoto1 || (target.extraPhotos ? target.extraPhotos[0] : ''),
        newProvExtraPhoto2 || (target.extraPhotos ? target.extraPhotos[1] : '')
      ],
      address: newProvAddress || target.address,
      phone: newProvPhone || target.phone,
      websiteUrl: newProvWebsiteUrl || target.websiteUrl,
      locationUrl: newProvLocationUrl || target.locationUrl,
      description: newProvDescription || target.description,
      workingHours: newProvWorkingHours || target.workingHours,
      audience: newProvAudience || target.audience
    };

    const success = await cmsSaveProvider(updated);
    if (success) {
      setIsEditingProviderId(null);
      setSelectedProvider(null);
    } else {
      alert("عذراً، فشلت عملية تحديث مقدم الخدمة.");
    }
  };

  // Filter rest of governorates
  const filteredRest = THE_REST_OF_GOVERNORATES.filter(g => 
    g.name.includes(searchTerm.trim()) || 
    g.capital.includes(searchTerm.trim())
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-[#070707] text-right animate-fade-in" dir="rtl" id="egypt-governorates-section">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Admin Portal Toggle Banner */}
        {currentUser?.role === 'admin' && (
          <div className="bg-gradient-to-r from-amber-600/10 via-[#0e0e0e] to-neutral-900 border border-amber-500/20 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-550/20 flex items-center justify-center text-amber-550 shrink-0">
                <Settings className="w-6 h-6 animate-spin text-amber-500" style={{ animationDuration: '6s' }} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white">لوحة تحكم الأدمين العليا الموحدة 👑</h4>
                <p className="text-xs text-neutral-450 font-medium font-sans">بصفتك مديراً معتمداً؛ تتيح لك قنواتنا الرقابية تحرير كافة الكلمات وتصديق طلبات الشركاء والبنرات في مصر.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAdminPortalOpen(!isAdminPortalOpen);
              }}
              className={`px-5 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer text-center ${
                isAdminPortalOpen 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow'
                  : 'bg-neutral-900 hover:bg-neutral-850 text-amber-400 border border-amber-500/30'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{isAdminPortalOpen ? 'رجوع لتصفح المحافظات العامة' : 'افتتاح قسم الأدمين والتحرير المالي'}</span>
            </button>
          </div>
        )}

        {isAdminPortalOpen && currentUser?.role === 'admin' ? (
          <div className="bg-[#090909] border border-neutral-850 p-6 sm:p-8 rounded-3xl space-y-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-850 pb-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-amber-450">منصة الرقابة والتعريب والتدقيق التلقائي لجمهورية مصر العربية</h3>
                <p className="text-xs text-neutral-500 font-medium font-sans">سجلات حرة مشفّرة لمراجعة واعتماد طلبات الانتساب وحفظ كلمات وقيم الواجهات.</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('users')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    adminActiveTab === 'users'
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  👥 إدارة الشركاء والتراخيص ({cmsUsers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('providers')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    adminActiveTab === 'providers'
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  🏢 مقدمي الخدمات في مصر ({providers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('translations')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    adminActiveTab === 'translations'
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  ✍️ تعريب وتحرير الكلمات
                </button>
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('settings')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    adminActiveTab === 'settings'
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  ⚙️ تهيئة البنر والواتساب والأدمن
                </button>
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('flash_sales')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    adminActiveTab === 'flash_sales'
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  ⚡ العروض المؤقتة (Flash Sales)
                </button>
              </div>
            </div>

            {/* TAB 1: USER REGISTRATIONS AND GOVERNORATES ACCESS CONFIG */}
            {adminActiveTab === 'users' && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                  <p className="text-xs text-amber-400 font-medium leading-relaxed font-sans">
                    💡 <strong>صلاحية المحافظات المحددة:</strong> لا يمكن للمستثمر المصري استكشاف فروع وإحصائيات وعوائد أي محافظة ما لم تقم كإدارة بمنحه صلاحية صريحة لتلك المحافظة أو تمنحه ترخيصاً كاملاً "كل المحافظات". سيظهر له قفل أمان يطلب منه التواصل معك بالواتساب إذا حاول الولوج لفرع غير مفعّل.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-850 text-neutral-400 font-bold bg-[#111] table-row">
                        <th className="p-3.5 text-right font-bold">الاسم والصفة</th>
                        <th className="p-3.5 text-right font-bold">رقم الهاتف (الرقم القومي)</th>
                        <th className="p-3.5 text-right font-bold">حالة تفعيل الحساب</th>
                        <th className="p-3.5 text-right font-bold">المحافظات النشطة بنطاقه</th>
                        <th className="p-3.5 text-center font-bold">أوامر التحكم الشاملة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {cmsUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-10 text-center text-neutral-500 bg-neutral-950">
                            لا توجد حسابات شركاء مسجلة حالياً بقاعدة البيانات المشتركة.
                          </td>
                        </tr>
                      ) : (
                        cmsUsers.map((user) => (
                          <tr key={user.phone} className="hover:bg-neutral-900/40 transition-all table-row">
                            <td className="p-3.5 font-bold text-white">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                                <span>{user.name}</span>
                                {user.role === 'admin' && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">مدير نظام</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5 text-neutral-300 font-mono">
                              <div>{user.phone}</div>
                              <div className="text-[10px] text-neutral-500 mt-0.5">الرقم القومي: {user.nationalId || 'مخفي أو أدمين'}</div>
                            </td>
                            <td className="p-3.5">
                              {user.isBlocked ? (
                                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] inline-block font-extrabold font-sans">
                                  🚫 محظور ومجمد ماليًا
                                </span>
                              ) : user.isInactive ? (
                                <span className="px-2.5 py-1 rounded-full bg-amber-550/10 border border-amber-550/30 text-amber-500 text-[10px] inline-block font-extrabold font-sans">
                                  ⚠️ حساب خامل حالياً
                                </span>
                              ) : user.approved ? (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] inline-block font-extrabold font-sans">
                                  ✓ معتمد ومفعل ماليًا
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-indigo-550/10 border border-indigo-550/20 text-indigo-400 text-[10px] inline-block font-extrabold font-sans">
                                  ⏳ بانتظار موافقة الإدارة
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              {user.allowedGovs && user.allowedGovs.includes('all') ? (
                                <span className="text-indigo-400 font-sans font-bold">كل المحافظات بمصر (وصول كامل 🌍)</span>
                              ) : (
                                <div className="flex flex-wrap gap-1 max-w-sm">
                                  {user.allowedGovs && user.allowedGovs.length > 0 ? (
                                    user.allowedGovs.map(gid => {
                                      const title = FIVE_MAIN_GOVERNORATES.find(x => x.id === gid)?.name || THE_REST_OF_GOVERNORATES.find(x => x.id === gid)?.name || gid;
                                      return (
                                        <span key={gid} className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 text-[9px] font-sans">
                                          {title}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <span className="text-neutral-500 font-mono">لا توجد محافظات مفعّلة له</span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {/* Toggle Approval Button */}
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={async () => {
                                    setUpdatingUserPhone(user.phone);
                                    const nextState = !user.approved;
                                    const success = await cmsApproveUser(user.phone, nextState, user.allowedGovs || [], user.role, user.isBlocked, user.isInactive);
                                    setUpdatingUserPhone(null);
                                    if (!success) alert("عذراً، فشل تحديث حالة انتساب العضو.");
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      (e.currentTarget as any).click();
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                    user.approved
                                      ? 'bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900 text-rose-400'
                                      : 'bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900 text-emerald-405'
                                  } ${
                                    (user.role === 'admin' || updatingUserPhone === user.phone) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                                  }`}
                                >
                                  {user.approved ? 'سحب الاعتماد وتجميد' : 'اعتماد الحساب وتفعيل'}
                                </div>

                                {/* Toggle Block Status */}
                                {user.role !== 'admin' && (
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={async () => {
                                      setUpdatingUserPhone(user.phone);
                                      const nextBlocked = !user.isBlocked;
                                      const success = await cmsApproveUser(user.phone, user.approved, user.allowedGovs || [], user.role, nextBlocked, user.isInactive);
                                      setUpdatingUserPhone(null);
                                      if (!success) alert("عذراً، فشل تحديث حالة حظر العضو.");
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        (e.currentTarget as any).click();
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                      user.isBlocked
                                        ? 'bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900 text-emerald-400'
                                        : 'bg-rose-955/20 hover:bg-rose-900/40 border border-rose-900/50 text-rose-300'
                                    } ${
                                      updatingUserPhone === user.phone ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                                    }`}
                                  >
                                    {user.isBlocked ? 'إلغاء حظر الحساب' : 'حظر الحساب 🚫'}
                                  </div>
                                )}

                                {/* Toggle Inactivity Status */}
                                {user.role !== 'admin' && (
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={async () => {
                                      setUpdatingUserPhone(user.phone);
                                      const nextInactive = !user.isInactive;
                                      const success = await cmsApproveUser(user.phone, user.approved, user.allowedGovs || [], user.role, user.isBlocked, nextInactive);
                                      setUpdatingUserPhone(null);
                                      if (!success) alert("عذراً، فشل تحديث حالة خمول العضو.");
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        (e.currentTarget as any).click();
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                      user.isInactive
                                        ? 'bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 text-neutral-300'
                                        : 'bg-amber-955/20 hover:bg-amber-900/40 border border-amber-900/40 text-amber-300'
                                    } ${
                                      updatingUserPhone === user.phone ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                                    }`}
                                  >
                                    {user.isInactive ? 'تنشيط العضوية' : 'جعل الحساب خاملاً ⏳'}
                                  </div>
                                )}

                                {/* Manage Allowed Governorates Drops */}
                                {user.role !== 'admin' && (
                                  <select
                                    disabled={updatingUserPhone === user.phone}
                                    value={user.allowedGovs && user.allowedGovs.includes('all') ? 'all' : (user.allowedGovs?.[0] || 'none')}
                                    onChange={async (e) => {
                                      setUpdatingUserPhone(user.phone);
                                      const val = e.target.value;
                                      const nextGovs = val === 'all' ? ['all'] : val === 'none' ? [] : [val];
                                      await cmsApproveUser(user.phone, user.approved, nextGovs, user.role, user.isBlocked, user.isInactive);
                                      setUpdatingUserPhone(null);
                                    }}
                                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 text-[10px] text-white outline-none cursor-pointer"
                                  >
                                    <option value="none">تعطيل ترخيص النطاق</option>
                                    <option value="all">كل المحافظات بمصر (كامل)</option>
                                    {/* Map all */}
                                    {FIVE_MAIN_GOVERNORATES.map(g => (
                                      <option key={g.id} value={g.id}>محافظة {g.name} فقط</option>
                                    ))}
                                    {THE_REST_OF_GOVERNORATES.map(g => (
                                      <option key={g.id} value={g.id}>محافظة {g.name} فقط</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: SERVICE PROVIDERS MANAGEMENT */}
            {adminActiveTab === 'providers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
                  <h4 className="text-sm font-black text-white">إضافة وتعديل مقدمي خدمات الشراكة بمصر</h4>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setIsAddingNew(!isAddingNew);
                      // Select Cairo as target if empty
                      setSelectedGov(FIVE_MAIN_GOVERNORATES[0]);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsAddingNew(!isAddingNew);
                        setSelectedGov(FIVE_MAIN_GOVERNORATES[0]);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddingNew ? 'إغلاق نافذة الإضافة' : 'إضافة مقدم خدمة أو معرض جديد'}</span>
                  </div>
                </div>

                {isAddingNew && (
                  <form onSubmit={handleCreateProvider} className="p-6 bg-[#0c0c0c] border border-neutral-800 rounded-2xl space-y-4 font-sans text-xs">
                    <p className="text-amber-400 font-bold border-b border-neutral-850 pb-2">📂 إضافة مقدم خدمة جديد لمحافظة: {selectedGov?.fullName || 'القاهرة'}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-neutral-400 block font-bold">اسم مقدم الخدمة:</label>
                        <input
                          type="text" required
                          value={newProvName} onChange={e => setNewProvName(e.target.value)}
                          placeholder="مثال: شركة النيل المعتمدة لتوريد الآليات"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-400 block font-bold">اسم الخدمة بالكامل:</label>
                        <input
                          type="text" required
                          value={newProvServiceName} onChange={e => setNewProvServiceName(e.target.value)}
                          placeholder="مثال: توريد جرارات حرارية ومعدات غربلة ميكانيكية"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-400 block font-bold">نوع ومبنى الشريك:</label>
                        <select
                          value={newProvType} onChange={e => setNewProvType(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white cursor-pointer"
                        >
                          <option value="معارض لأجل الكهربائية">معارض لأجل الكهربائية</option>
                          <option value="معارض خدمات سيارات الشركاء">معارض خدمات سيارات الشركاء</option>
                          <option value="فروع عقارية وقانونية">فروع عقارية وقانونية</option>
                          <option value="بنوك استثمارية وسيادية">بنوك استثمارية وسيادية</option>
                          <option value="المستندات والعقود الرسمية">المستندات والعقود الرسمية</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-400 block font-bold">المحافظة التابع لها:</label>
                        <select
                          onChange={(e) => {
                            const gid = e.target.value;
                            const f = FIVE_MAIN_GOVERNORATES.find(x => x.id === gid) || { id: gid, name: gid, fullName: gid } as any;
                            setSelectedGov(f);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white cursor-pointer"
                        >
                          {FIVE_MAIN_GOVERNORATES.map(g => <option key={g.id} value={g.id}>{g.fullName}</option>)}
                          {THE_REST_OF_GOVERNORATES.map(g => <option key={g.id} value={g.id}>محافظة {g.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-400 block font-bold">رقم الهاتف الدائم:</label>
                        <input
                          type="text" required
                          value={newProvPhone} onChange={e => setNewProvPhone(e.target.value)}
                          placeholder="مثال: 0100223344"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-400 block font-bold">موقع الويب (اختياري):</label>
                        <input
                          type="text"
                          value={newProvWebsiteUrl} onChange={e => setNewProvWebsiteUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1 col-span-full">
                        <label className="text-neutral-400 block font-bold">رابط لوكيشن خرائط GPS من جوجل (مهم للعميل):</label>
                        <input
                          type="text"
                          value={newProvLocationUrl} onChange={e => setNewProvLocationUrl(e.target.value)}
                          placeholder="https://maps.google.com/?q=..."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1 col-span-full">
                        <label className="text-neutral-400 block font-bold">العنوان الجغرافي كتابةً:</label>
                        <input
                          type="text" required
                          value={newProvAddress} onChange={e => setNewProvAddress(e.target.value)}
                          placeholder="مثال: شارع الجمهورية، بجوار البنك الأهلي المصري"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1 col-span-full">
                        <ImageUploader
                          value={newProvPhotoUrl}
                          onChange={setNewProvPhotoUrl}
                          label="الصورة الرئيسية للشعار أو الواجهة الموثقة (تحميل صورة أو رابط):"
                          adminPhone={currentUser?.phone}
                          placeholder="تحميل صورة الواجهة/الموظف..."
                        />
                      </div>
                      <div className="space-y-1 col-span-full">
                        <label className="text-neutral-400 block font-bold">شرح وتفاصيل ونسبة الخصم لشريك السكر:</label>
                        <textarea
                          rows={3} required
                          value={newProvDescription} onChange={e => setNewProvDescription(e.target.value)}
                          placeholder="اكتب هنا العروض الخصم الحصرية لمنتسبي تطبيق شوجر بيزنس إي جي..."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white resize-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black cursor-pointer">
                      حفظ وتصدير مقدم الخدمة فوراً لكافة التطبيقات 🗄️
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {providers.map(p => {
                    const govName = FIVE_MAIN_GOVERNORATES.find(x => x.id === p.govId)?.name || THE_REST_OF_GOVERNORATES.find(x => x.id === p.govId)?.name || p.govId;
                    return (
                      <div key={p.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">{govName}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">{p.serviceType}</span>
                          </div>
                          <h5 className="font-extrabold text-white text-[13px]">{p.name}</h5>
                          <p className="text-neutral-450 truncate mt-1">{p.serviceName}</p>
                          <p className="text-[10px] text-neutral-500 truncate">{p.address}</p>
                        </div>
                        <div className="pt-2 border-t border-neutral-850 flex items-center justify-between">
                          <span className="text-neutral-450 font-mono">{p.phone}</span>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => handleDeleteProvider(p.id, e)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleDeleteProvider(p.id, e as any);
                              }
                            }}
                            className="p-1 px-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all text-[10px] font-black cursor-pointer"
                          >
                            حذف نهائي
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: APP-WIDE TRANSLATIONS AND TEXT EDITOR */}
            {adminActiveTab === 'translations' && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-2">
                  <p className="text-xs text-amber-400 font-bold font-sans">✍️ تحرير نصوص وكافة كلمات شوجر بيزنس إي جي بالكامل لجميع الزوار والأعضاء:</p>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-semibold font-sans">
                    يمكنك تعديل أي مفتاح لترجمة التطبيق، بمجرد حفظ التعديل هنا، سيتم حفظ القيمة فوراً بالخادم السحابي ويحدث تغيير تلقائي فوري ينعكس لدى كافة الأدمينات والمستثمرين دون وميض أو خروج!
                  </p>
                </div>

                <div className="relative max-w-sm">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={transSearch}
                    onChange={e => setTransSearch(e.target.value)}
                    placeholder="ابحث عن كلمة للتعريب السريع..."
                    className="w-full text-xs text-right pr-9 pl-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-amber-555 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredKeys.map(item => {
                    const currentVal = t(item.key, item.defaultVal);
                    const isEditing = editingTransKey === item.key;
                    return (
                      <div key={item.key} className="p-4 bg-[#0a0a0a] border border-neutral-800 rounded-2xl space-y-3 flex flex-col justify-between text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-500 font-mono uppercase block">{item.key}</span>
                          <strong className="text-neutral-300 block">{item.label}</strong>
                          
                          {isEditing ? (
                            <textarea
                              rows={3}
                              value={editingTransVal}
                              onChange={e => setEditingTransVal(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white text-xs text-right mt-2 outline-none font-medium"
                            />
                          ) : (
                            <p className="p-2.5 bg-neutral-900/40 rounded-xl border border-neutral-900 text-white leading-relaxed text-[11px] font-sans">
                              {currentVal}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-neutral-850 flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={async () => {
                                    const ok = await cmsUpdateTranslation(item.key, editingTransVal);
                                    if (ok) {
                                      setEditingTransKey(null);
                                    } else {
                                      alert("حدث خطأ أثناء الاتصال بالخادم الرئيسي.");
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      (e.currentTarget as any).click();
                                    }
                                  }}
                                  className="px-3 py-1 bg-emerald-500 text-black font-extrabold rounded text-[10px] cursor-pointer"
                                >
                                  حفظ وتعميم فوري
                                </div>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => setEditingTransKey(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      setEditingTransKey(null);
                                    }
                                  }}
                                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded text-[10px] cursor-pointer"
                                >
                                  إلغاء
                                </div>
                            </>
                          ) : (
                            <div
                               role="button"
                               tabIndex={0}
                               onClick={() => {
                                 setEditingTransKey(item.key);
                                 setEditingTransVal(currentVal);
                               }}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter' || e.key === ' ') {
                                   e.preventDefault();
                                   setEditingTransKey(item.key);
                                   setEditingTransVal(currentVal);
                                 }
                               }}
                               className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-500 border border-neutral-800 rounded text-[10px] font-black cursor-pointer"
                             >
                               ✍️ تحرير الكلمة
                             </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: GLOBAL BANNER & WHATSAPP NUMBER & USER ROLES */}
            {adminActiveTab === 'settings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
                {/* Panel 1 */}
                <div className="space-y-6 bg-[#0a0a0a] border border-neutral-800 p-6 rounded-2xl relative">
                  <h4 className="text-sm font-black text-white border-b border-neutral-850 pb-2 flex items-center gap-1.5 text-amber-500 font-sans">
                    <span>⚙️ إعدادات الإشعارات وأرقام الهواتف</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold block">رقم هاتف الواتساب للمدير والفرع المركزي بمصر:</label>
                      <input
                        type="text"
                        value={configWhatsapp}
                        onChange={e => setConfigWhatsapp(e.target.value)}
                        placeholder="مثال: 201112223344"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
                      />
                      <span className="text-[10px] text-neutral-500 font-medium font-sans">مهم: يجب كتابة الرمز الدولي 20 في البداية (مثال: 201012345678)</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold block">مضمون شريط الإعلان الدائم أعلى الفروع (البنر):</label>
                      <textarea
                        rows={3}
                        value={configBannerText}
                        onChange={e => setConfigBannerText(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white leading-relaxed text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="showNotifyCheck2"
                        checked={configShowNotification}
                        onChange={e => setConfigShowNotification(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-amber-500 cursor-pointer"
                      />
                      <label htmlFor="showNotifyCheck2" className="text-neutral-300 font-bold cursor-pointer select-none">تفعيل وإظهار البنر الترويجي العلوي للعام الحالي</label>
                    </div>

                    {configSaveSuccess && <p className="text-emerald-450 font-bold text-[11px] font-sans">{configSaveSuccess}</p>}

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={async () => {
                        const success = await cmsUpdateConfig({
                          whatsappNumber: configWhatsapp,
                          bannerText: configBannerText,
                          showNotification: configShowNotification
                        });
                        if (success) {
                          setConfigSaveSuccess("تم تحديث وحفظ قيم الإعدادات والبنر بنجاح وتعميمها للجميع.");
                          setTimeout(() => setConfigSaveSuccess(''), 4000);
                        } else {
                          alert("فشل تحديث الإعدادات.");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          (e.currentTarget as any).click();
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold cursor-pointer text-center"
                    >
                      حفظ التغييرات ونشرها فوراً للجميع 🛰️
                    </div>
                  </div>
                </div>

                {/* Panel 2 */}
                <div className="space-y-6 bg-[#0a0a0a] border border-neutral-800 p-6 rounded-2xl">
                  <h4 className="text-sm font-black text-white border-b border-neutral-850 pb-2 flex items-center gap-1.5 text-indigo-400 font-sans">
                    <span>👑 تنصيب وتعيين مدير نظام (أدمن) جديد</span>
                  </h4>

                  <div className="space-y-3.5">
                    <p className="text-[11px] text-neutral-450 leading-relaxed font-semibold font-sans">
                      تسمح لك هذه النافذة بتوليد حساب أدمين مالي إقليمي بالرقم القومي، وسيحصل فوراً على الصلاحية العليا لاعتماد الشركاء، وحذف مقدمي خدمات وتعديل معاني الكلمات بالمملكة والجمهورية.
                    </p>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-bold block">الاسم الثلاثي أو المسؤول المعتمد:</label>
                      <input
                        type="text"
                        value={newAdminName} onChange={e => setNewAdminName(e.target.value)}
                        placeholder="مثال: أ. فاروق عبد النعيم"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-bold block">رقم هاتف المسؤول (يبدأ بـ 01 ويستخدم لتسجيل الدخول):</label>
                      <input
                        type="text"
                        value={newAdminPhone} onChange={e => setNewAdminPhone(e.target.value)}
                        placeholder="مثال: 01012345678"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-bold block">الرقم القومي الدائم (١٤ رقماً):</label>
                      <input
                        type="text"
                        value={newAdminNationalId} onChange={e => setNewAdminNationalId(e.target.value)}
                        placeholder="٢٩٩١٨٢٠..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-300 font-bold block">كلمة السر الآمنة للأدمن:</label>
                      <input
                        type="password"
                        value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)}
                        placeholder="كتب هنا كلمة سر قوية..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
                      />
                    </div>

                    {adminAddSuccess && <p className="text-emerald-450 font-bold text-[11px] font-sans">{adminAddSuccess}</p>}
                    {adminAddError && <p className="text-rose-450 font-bold text-[11px] font-sans">{adminAddError}</p>}

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={async () => {
                        setAdminAddSuccess('');
                        setAdminAddError('');
                        if (!newAdminPhone || !newAdminName || !newAdminPassword) {
                          setAdminAddError("يرجى ملء كامل الحقول الأساسية بالأعلى.");
                          return;
                        }
                        const ok = await cmsAddAdmin(newAdminPhone, newAdminName, newAdminNationalId, newAdminPassword);
                        if (ok) {
                          setAdminAddSuccess("تم إنشاء وترقية المسؤول الجديد بنجاح مالي تام.");
                          setNewAdminName('');
                          setNewAdminPhone('');
                          setNewAdminNationalId('');
                          setNewAdminPassword('');
                        } else {
                          setAdminAddError("فشل تسجيل الأدمن، قد يكون رقم الهاتف لعام ٢٠٢٦ مسجلاً مسبقاً.");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          (e.currentTarget as any).click();
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-emerald-600 text-white font-extrabold shadow shadow-indigo-950/20 cursor-pointer text-center"
                    >
                      تسجيل وترقية المدير الجديد للعمل 👑
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: FLASH SALES BANNER CARDS MANAGEMENT */}
            {adminActiveTab === 'flash_sales' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs font-sans">
                {/* Create/Edit Form */}
                <div className="lg:col-span-1 space-y-6 bg-[#0a0a0a] border border-neutral-800 p-6 rounded-2xl relative text-right" dir="rtl">
                  <h4 className="text-sm font-black text-white border-b border-neutral-850 pb-2 flex items-center gap-1.5 text-rose-500">
                    <span>⚡ {editingSaleId ? 'تعديل العرض الترويجي الحالي' : 'تكويد عرض مؤقت جديد'}</span>
                  </h4>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!saleTitle || !saleDescription || !saleEndsAt) {
                      alert("يرجى ملء جميع الحقول الإلزامية.");
                      return;
                    }

                    const success = await cmsSaveFlashSale({
                      id: editingSaleId || undefined,
                      govId: saleGovId,
                      title: saleTitle,
                      badge: saleBadge,
                      description: saleDescription,
                      endsAt: new Date(saleEndsAt).toISOString(),
                      ctaText: saleCtaText
                    });

                    if (success) {
                      setSaleSaveSuccess("تم حفظ ونشر العرض الترويجي بنجاح!");
                      setTimeout(() => setSaleSaveSuccess(''), 4000);
                      // Clear form
                      setEditingSaleId(null);
                      setSaleTitle('');
                      setSaleBadge('فرصة وقتية عاجلة');
                      setSaleDescription('');
                      setSaleCtaText('احجز فرصتك الحصرية بالواتساب للتعاقد');
                    } else {
                      alert("عذراً، فشل حفظ العرض الترويجي.");
                    }
                  }} className="space-y-4 text-right">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold block">المحافظة المستهدفة بالعرض:</label>
                      <select
                        value={saleGovId}
                        onChange={e => setSaleGovId(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white outline-none cursor-pointer font-sans text-xs"
                      >
                        <option value="all">كل المحافظات بجمهورية مصر (عرض عام 🌍)</option>
                        {FIVE_MAIN_GOVERNORATES.map(g => (
                          <option key={g.id} value={g.id}>محافظة {g.name}</option>
                        ))}
                        {THE_REST_OF_GOVERNORATES.map(g => (
                          <option key={g.id} value={g.id}>محافظة {g.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold block">العنوان المثير الرئيسي (عنوان العرض):</label>
                      <input
                        type="text"
                        required
                        value={saleTitle}
                        onChange={e => setSaleTitle(e.target.value)}
                        placeholder="مثال: عرض شراكة استثنائية بنسبة %40 بمحافظة أسيوط"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold block">شارة التنبيه (شارة العرض):</label>
                      <input
                        type="text"
                        value={saleBadge}
                        onChange={e => setSaleBadge(e.target.value)}
                        placeholder="مثال: عرض حصري لفترة محدودة"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold block">مضمون الإعلان والتفاصيل (سريع وجذاب):</label>
                      <textarea
                        rows={4}
                        required
                        value={saleDescription}
                        onChange={e => setSaleDescription(e.target.value)}
                        placeholder="اكتب هنا كافة المميزات والخصائص الاستثمارية أو الخدمية المتاحة لآخر فترة..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white leading-relaxed text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold block">توقيت وتاريخ انتهاء العرض (Countdown Expiration):</label>
                      <input
                        type="datetime-local"
                        required
                        value={saleEndsAt}
                        onChange={e => setSaleEndsAt(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-bold block">عنوان زر الاتصال بالواتساب (CTA Button):</label>
                      <input
                        type="text"
                        value={saleCtaText}
                        onChange={e => setSaleCtaText(e.target.value)}
                        placeholder="مثال: احجز فرصتك الحصرية بالواتساب للتعاقد"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white text-xs"
                      />
                    </div>

                    {saleSaveSuccess && <p className="text-emerald-450 font-bold block text-xs">{saleSaveSuccess}</p>}

                    <div className="flex gap-2 pt-2">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          const form = (e.currentTarget.parentElement as any);
                          if (form.reportValidity()) {
                            form.requestSubmit();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            (e.currentTarget as any).click();
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-black font-extrabold cursor-pointer transition-all text-xs text-center"
                      >
                        {editingSaleId ? 'تحديث العرض ⚡' : 'حفظ ونشر العرض فوراً 🚀'}
                      </div>
                      
                      {editingSaleId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSaleId(null);
                            setSaleTitle('');
                            setSaleBadge('فرصة وقتية عاجلة');
                            setSaleDescription('');
                            setSaleCtaText('احجز فرصتك الحصرية بالواتساب للتعاقد');
                          }}
                          className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl cursor-pointer text-xs"
                        >
                          إلغاء التعديل
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Existing Flash Sales List */}
                <div className="lg:col-span-2 space-y-6 text-right" dir="rtl">
                  <div className="bg-[#0a0a0a] border border-neutral-800 p-6 rounded-2xl relative">
                    <h4 className="text-sm font-black text-white border-b border-neutral-850 pb-2 mb-4 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-500">
                        ⚡ عروض الفلاش سايل النشطة بجمهورية مصر العربية ({flashSales?.length || 0})
                      </span>
                    </h4>

                    {(!flashSales || flashSales.length === 0) ? (
                      <div className="p-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl text-xs">
                        لا توجد أي عروض أو بنرات تنازلية نشطة حالياً بالنظام. استخدم النموذج على اليمين لتكويد أول عرض استثماري أو خدمي.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {flashSales.map((sale) => {
                          const targetGov = sale.govId === 'all' 
                            ? 'كل المحافظات بجمهورية مصر 🌍' 
                            : (FIVE_MAIN_GOVERNORATES.find(g => g.id === sale.govId)?.fullName || THE_REST_OF_GOVERNORATES.find(g => g.id === sale.govId)?.name || sale.govId);
                          
                          const hasExpired = +new Date(sale.endsAt) < +new Date();

                          return (
                            <div key={sale.id} className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-neutral-800 transition-all text-xs">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10">
                                    {targetGov}
                                  </span>
                                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/10">
                                    {sale.badge || 'فرصة استثمارية وقتية'}
                                  </span>
                                  {hasExpired ? (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-400 border border-rose-900 font-mono">منتهي الصلاحية</span>
                                  ) : (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900 font-mono">نشط ومباشر</span>
                                  )}
                                </div>
                                <h5 className="text-xs font-bold text-white">{sale.title}</h5>
                                <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2 max-w-xl">{sale.description}</p>
                                <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 font-mono">
                                  <span>تاريخ الانتهاء:</span>
                                  <span>{new Date(sale.endsAt).toLocaleString('ar-EG')}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingSaleId(sale.id);
                                    setSaleGovId(sale.govId);
                                    setSaleTitle(sale.title);
                                    setSaleBadge(sale.badge || '');
                                    setSaleDescription(sale.description);
                                    setSaleCtaText(sale.ctaText || 'احجز فرصتك الحصرية بالواتساب للتعاقد');
                                    const dateObj = new Date(sale.endsAt);
                                    const offset = dateObj.getTimezoneOffset() * 60000;
                                    const localISOTime = (new Date(dateObj.getTime() - offset)).toISOString().slice(0, 16);
                                    setSaleEndsAt(localISOTime);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 text-[10px] font-black cursor-pointer transition-all"
                                >
                                  تعديل الكود
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm("هل أنت متأكد من رغبتك في حذف هذا العرض الترويجي؟")) {
                                      const success = await cmsDeleteFlashSale(sale.id);
                                      if (!success) alert("فشل الحذف.");
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-rose-950/30 text-rose-400 hover:bg-rose-900/40 border border-rose-900 hover:border-rose-700 text-[10px] font-black cursor-pointer transition-all"
                                >
                                  حذف
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* NEW: Admin Mode Toggle controls for reports vs dashboard */}
            {currentUser?.role === 'admin' && (
              <div className="bg-[#0e0e0e] border border-amber-500/20 p-4.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl mb-6">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-xs shrink-0">🛠️ بوابتك الإدارية لعام ٢٠٢٦</span>
                  <p className="text-xs text-neutral-400 font-medium">قم بإصدار ومزامنة التقارير المالية الموثقة للمحافظات وتحديث مستويات المخزون بالدولة.</p>
                </div>
                <div className="flex gap-2">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setAdminViewMode('dashboard')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setAdminViewMode('dashboard');
                        }
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                        adminViewMode === 'dashboard'
                          ? 'bg-indigo-600 text-white shadow border border-indigo-500/35 font-extrabold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>تصفح لوحة التحكم ومخازن المحافظات</span>
                    </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setAdminViewMode('add_report')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setAdminViewMode('add_report');
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                      adminViewMode === 'add_report'
                        ? 'bg-amber-600 text-black shadow font-extrabold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة تقرير تشغيلي جديد للمحافظة</span>
                  </div>
                </div>
              </div>
            )}

            {adminViewMode === 'add_report' && currentUser?.role === 'admin' && (
              <div className="bg-[#090909] border border-neutral-850 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative text-right animate-fade-in">
                <div className="border-b border-neutral-850 pb-4">
                  <h3 className="text-base sm:text-lg font-black text-amber-500">✍️ إصدار ونشر تقرير محاسبي ولوجستي معتمد</h3>
                  <p className="text-xs text-neutral-400 font-medium font-sans mt-1">
                    قم بإعداد ونشر تقرير رسمي عن سعة المستودع والاتصال المباشر لضمان الشفافية ومكافحة المضاربات.
                  </p>
                </div>

                <form onSubmit={handleAddReportSubmit} className="space-y-5 text-right">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Governorate Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-neutral-300 block">اختر المحافظة المستهدفة بالتقرير *</label>
                      <select
                        value={reportGovId}
                        onChange={(e) => setReportGovId(e.target.value)}
                        className="w-full text-xs p-3 bg-neutral-900 border border-neutral-850 rounded-xl text-white outline-none focus:border-indigo-500"
                      >
                        <optgroup label="المحافظات اللوجستية الرئيسية">
                          {FIVE_MAIN_GOVERNORATES.map(g => (
                            <option key={g.id} value={g.id}>{g.name} (رئيسية)</option>
                          ))}
                        </optgroup>
                        <optgroup label="باقي محافظات الجمهورية">
                          {THE_REST_OF_GOVERNORATES.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Report Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-neutral-300 block">عنوان التقرير أو المنشور اللوجستي *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: التقرير التشغيلي لأمان المخازن بأسيوط"
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        className={`w-full text-xs p-3 bg-neutral-900 border rounded-xl text-white outline-none transition-all ${
                          reportValidationErrors.title ? 'border-red-500 focus:border-red-500' : 'border-neutral-850 focus:border-indigo-500'
                        }`}
                      />
                      {reportValidationErrors.title && (
                        <p className="text-[10px] text-red-500 font-bold">{reportValidationErrors.title}</p>
                      )}
                    </div>

                    {/* Capacity (Validate in real-time) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-neutral-300 block">السعة الاستيعابية المجهزة بالطن (موجب) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="مثال: 15000"
                        value={reportCapacity}
                        onChange={(e) => setReportCapacity(e.target.value)}
                        className={`w-full text-xs p-3 bg-neutral-900 border rounded-xl text-white outline-none transition-all ${
                          reportValidationErrors.capacity ? 'border-red-500 focus:border-red-500' : 'border-neutral-850 focus:border-indigo-500'
                        }`}
                      />
                      {reportValidationErrors.capacity ? (
                        <p className="text-[10px] text-red-500 font-bold">{reportValidationErrors.capacity}</p>
                      ) : (
                        <p className="text-[10px] text-neutral-500">يجب إدخال عدد صحيح موجب يمثل السعة الاستيعابية للمخزن.</p>
                      )}
                    </div>

                    {/* Supervisor Phone (Validate in real-time) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-neutral-300 block">رقم هاتف مسؤول المعاينة بمصر (11 رقماً) *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: 01012345678"
                        value={reportPhone}
                        onChange={(e) => setReportPhone(e.target.value)}
                        className={`w-full text-xs p-3 bg-neutral-900 border rounded-xl text-white outline-none transition-all text-left font-mono ${
                          reportValidationErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-neutral-850 focus:border-indigo-500'
                        }`}
                      />
                      {reportValidationErrors.phone ? (
                        <p className="text-[10px] text-red-500 font-bold">{reportValidationErrors.phone}</p>
                      ) : (
                        <p className="text-[10px] text-neutral-500">يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقماً تماماً.</p>
                      )}
                    </div>

                  </div>

                  {/* Operational Content */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-neutral-300 block">التحليل والمضمون التشغيلي والمالي للموقع *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="صف حالة جرد الشاحنات، والمخزون الموثق، والعوائد اللوجستية المباشرة لشركاء كارت شوجر..."
                      value={reportContent}
                      onChange={(e) => setReportContent(e.target.value)}
                      className={`w-full text-xs p-3 bg-neutral-950/60 border rounded-xl text-white outline-none transition-all ${
                        reportValidationErrors.content ? 'border-red-500 focus:border-red-500' : 'border-neutral-850 focus:border-indigo-500'
                      }`}
                    ></textarea>
                    {reportValidationErrors.content && (
                      <p className="text-[10px] text-red-500 font-bold">{reportValidationErrors.content}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
                    <button
                      type="submit"
                      disabled={Object.keys(reportValidationErrors).length > 0}
                      className={`px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer text-white shadow ${
                        Object.keys(reportValidationErrors).length > 0
                          ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-850'
                          : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.01]'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>حفظ ونشر التقرير للمحافظة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReportTitle('');
                        setReportContent('');
                        setReportPhone('');
                        setReportCapacity('');
                        setAdminViewMode('dashboard');
                      }}
                      className="px-5 py-3 rounded-xl text-xs font-black bg-neutral-900 hover:bg-neutral-850 hover:text-white transition-all text-neutral-400 cursor-pointer"
                    >
                      إلغاء وتراجع
                    </button>
                  </div>
                </form>
              </div>
            )}

            {adminViewMode !== 'add_report' && (
              <>
                {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-[#0E0E0E] to-neutral-900 border border-neutral-850 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
              <div className="space-y-2 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>مستودع البيانات الموثقة ماليًا لعام ٢٠٢٦</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  أهلاً بك مجدداً يا <span className="text-indigo-400 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">{currentUser?.name || 'مستثمر شوجر المميز'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-450 max-w-2xl font-medium leading-relaxed">
                  لقد قمت بتسجيل الدخول بنجاح. تتيح لك قنواتنا الآن الاطلاع على إحصائيات المحافظات التكريرية، معدلات الأمان، الفروع ومستويات الربحية المتاحة لشراكاتك التجارية المباشرة بجمهورية مصر العربية.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <div
                   role="button"
                   tabIndex={0}
                   onClick={() => setIsChangePasswordOpen(true)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') {
                       e.preventDefault();
                       setIsChangePasswordOpen(true);
                     }
                   }}
                   className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer border border-neutral-800"
                   title="تغيير كلمة المرور الشخصية"
                 >
                   <Settings className="w-4 h-4" />
                 </div>
                <div className="h-10 w-[1px] bg-neutral-800 mx-1 hidden md:block" />
                <a 
                  href={`https://wa.me/${cmsSettings.whatsappNumber}?text=${encodeURIComponent('أهلاً إدارة شوجر بيزنس إي جي، أود التواصل مع المدير الإقليمي ومناقشة عروض المضاربات وتكرير السكر ومعدلات الاستثمار الحالية لعام ٢٠٢٦.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-500/10 text-center"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>تواصل بالواتساب مع المدير الإقليمي</span>
                </a>
              </div>
            </div>

            {/* User Transaction History Module */}
            {currentUser && (
              <div className="bg-[#0E0E0E] border border-neutral-850 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase">
                      <History className="w-3 h-3" />
                      <span>كشف حساب المعاملات المباشرة</span>
                    </div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                      سِـجلّ حـركاتـك المـالـيـة المـوثـقـة
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left bg-neutral-950 p-3 rounded-2xl border border-neutral-900 min-w-[140px]">
                      <span className="text-[10px] text-neutral-500 block font-bold mb-0.5">إجمالي الأرباح المعتمدة</span>
                      <span className="text-md font-black text-emerald-400">
                        {transactions
                          .filter(tx => tx.userPhone === currentUser.phone && tx.type === 'profit' && tx.status === 'completed')
                          .reduce((sum, tx) => sum + tx.amount, 0)
                          .toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                </div>

                {(() => {
                  const userTxs = transactions.filter(tx => tx.userPhone === currentUser.phone);
                  if (userTxs.length === 0) {
                    return (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-neutral-950/40 rounded-2xl border border-dashed border-neutral-800">
                        <div className="p-4 rounded-full bg-neutral-900 text-neutral-500">
                          <Activity className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-xs text-neutral-500 font-bold max-w-[250px]">لا يوجد عمليات مالية مسجلة في حسابك حالياً. سيقوم النظام بعرض الإيداعات والأرباح هنا فور اعتمادها.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="border-b border-neutral-850 text-neutral-500 font-black">
                            <th className="pb-4 text-right pr-2">التاريخ</th>
                            <th className="pb-4 text-right">نوع الحركة</th>
                            <th className="pb-4 text-right">المبلغ</th>
                            <th className="pb-4 text-right">الوصف والبيان</th>
                            <th className="pb-4 text-center">أمر استلام</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...userTxs].reverse().map(tx => (
                            <tr key={tx.id} className="border-b border-neutral-900/50 hover:bg-neutral-900/20 transition-colors group">
                              <td className="py-4 font-mono text-[10px] text-neutral-400 pr-2">
                                {new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </td>
                              <td className="py-4">
                                <span className={`px-2.5 py-1 rounded-lg font-black text-[9px] inline-flex items-center gap-1.5 ${
                                  tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  tx.type === 'withdrawal' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                  tx.type === 'profit' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                  {tx.type === 'deposit' && <TrendingUp className="w-3 h-3" />}
                                  {tx.type === 'withdrawal' && <TrendingDown className="w-3 h-3" />}
                                  {tx.type === 'profit' && <Sparkles className="w-3 h-3" />}
                                  {tx.type === 'investment' && <Layers className="w-3 h-3" />}
                                  {tx.type === 'deposit' ? 'إيداع رصيد' : 
                                   tx.type === 'withdrawal' ? 'سحب نقدي' : 
                                   tx.type === 'profit' ? 'صرف أرباح' : 'دورة استثمارية'}
                                </span>
                              </td>
                              <td className="py-4">
                                <span className={`font-black text-sm ${
                                  tx.type === 'deposit' || tx.type === 'profit' ? 'text-white' : 'text-neutral-300'
                                }`}>
                                  {tx.amount.toLocaleString()} ج.م
                                </span>
                              </td>
                              <td className="py-4 text-neutral-450 font-medium">
                                {tx.description}
                              </td>
                              <td className="py-4 text-center">
                                <div 
                                  role="button"
                                  tabIndex={0}
                                  className="p-2 text-neutral-500 hover:text-white transition-all cursor-pointer inline-block"
                                >
                                  <FileText className="w-4 h-4" />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
                
                <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                    ملاحظة: جميع المعاملات المالية المذكورة أعلاه موثقة بشهادات استلام رقمية. في حال وجود أي تضارب في الأرقام، يرجى التواصل مع المدير المالي الإقليمي عبر الواتساب فوراً.
                  </p>
                </div>
              </div>
            )}

            {/* Visual Header inspired exactly by user upload */}
            {!(selectedGov || selectedRestGov) && (
              <>
                <div className="text-center space-y-3 pb-4">
                  <p className="text-indigo-400 font-black text-xs sm:text-sm tracking-widest uppercase">شوجر بيزنس إي جي • محفظة مصر الاستثمارية</p>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight select-none">
                    برجاء اختيار المحافظة لمشاهدة المحتوى
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-450 max-w-xl mx-auto leading-relaxed">
                    المنطقة الإدارية واللوجستية لشوجر بيزنس. انقر فوق زر أي محافظة لمشاهدة الفروع النشطة ومعدلات الشراكة وعوائد التشغيل الفوري.
                  </p>
                </div>

                {/* Five Major Governorates (Strictly as Depicted in User Upload Frame) */}
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8"
                >
                  {FIVE_MAIN_GOVERNORATES.map((gov) => {
                    const isSelected = selectedGov?.id === gov.id;
                    const isAllowed = isGovAllowed(gov.id);
                    return (
                      <motion.div 
                        key={gov.id}
                        variants={{
                          hidden: { opacity: 0, scale: 0.9, y: 30 },
                          show: { opacity: 1, scale: 1, y: 0 }
                        }}
                        id={`gov-card-${gov.id}`}
                        onClick={() => {
                          if (!isAllowed) {
                            setShowRestrictionModal(gov.fullName);
                          } else {
                            setSelectedGov(gov);
                            setSelectedRestGov(null);
                            setSelectedProvider(null);
                            setTimeout(() => {
                              const el = document.getElementById('governorate-content-viewer');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }
                        }}
                        className={`bg-[#0A0A0A] border rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group relative ${
                          !isAllowed ? 'opacity-70 cursor-pointer' : ''
                        } ${
                          isSelected 
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-950/40 translate-y-[-4px]' 
                            : 'border-neutral-850 hover:border-neutral-700 hover:translate-y-[-2px]'
                        }`}
                      >
                        {/* 1. Header/Landmark Landscape Image */}
                        <div className="h-44 relative overflow-hidden bg-neutral-900 shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
                          <img 
                            src={gov.photoUrl} 
                            alt={gov.fullName} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Floating specs badge */}
                          <span className="absolute top-3 left-3 z-20 text-[9px] font-black tracking-wide text-white bg-indigo-600 px-2.5 py-1 rounded-full shadow border border-indigo-500/30">
                            عائد {gov.annualROI.split('٪')[0] + '٪'}
                          </span>

                          {/* Overlapping lock overlay if restricted */}
                          {!isAllowed && (
                            <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px]">
                              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
                                🔒 غير مدرج بنطاقك
                              </span>
                              <span className="text-[9px] text-neutral-400 font-bold">اضغط للتفعيل ماليًا</span>
                            </div>
                          )}

                          {/* 2. Overlapping Emblem Block (exactly as depicted in image) */}
                          <motion.div 
                            animate={{ 
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            onClick={(e) => {
                              if (isEditModeEnabled && currentUser?.role === 'admin') {
                                e.stopPropagation();
                                e.preventDefault();
                                setEditingEmblemGov(gov);
                                setTempEmblemUrl(t(`gov_emblem_${gov.id}`, ''));
                              }
                            }}
                            className={`absolute bottom-[-24px] right-1/2 translate-x-1/2 z-20 bg-white p-2.5 rounded-2xl shadow-2xl border flex items-center justify-center transform transition-all duration-200 ${
                              isEditModeEnabled && currentUser?.role === 'admin'
                                ? 'border-indigo-400 ring-2 ring-indigo-500/30 cursor-pointer hover:scale-110 hover:border-indigo-500' 
                                : 'border-neutral-200/50 group-hover:scale-105'
                            }`}
                            title={isEditModeEnabled && currentUser?.role === 'admin' ? "تغيير شعار المحافظة" : undefined}
                          >
                            <div className="bg-transparent rounded-lg p-0.5 flex items-center justify-center w-16 h-16 relative">
                              {t(`gov_emblem_${gov.id}`, '') ? (
                                <img 
                                  src={t(`gov_emblem_${gov.id}`, '')} 
                                  alt={gov.fullName} 
                                  className="w-16 h-16 object-contain rounded-lg"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                gov.emblemSvg()
                              )}
                              
                              {isEditModeEnabled && currentUser?.role === 'admin' && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow border border-indigo-550 animate-pulse">
                                  <Settings className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </motion.div>
                        </div>

                        {/* Spacer representing emblem overlap */}
                        <div className="h-8 shrink-0" />

                        {/* Card Content & Micro details */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-5 text-center">
                          <div className="space-y-2">
                            <h3 className="text-base font-black text-white group-hover:text-indigo-400 transition-colors">
                              {gov.fullName}
                            </h3>
                            <p className="text-[11px] text-neutral-450 leading-relaxed line-clamp-2 h-8 font-medium">
                              {gov.description}
                            </p>
                          </div>

                          {/* Simple Key Metrics List */}
                          <div className="grid grid-cols-2 gap-2 p-2 bg-[#0E0E0E] rounded-2xl border border-neutral-850 text-right">
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-neutral-500 block">المضاربة النشطة:</span>
                              <span className="text-[10px] font-bold text-white block">{gov.activeInvestment}</span>
                            </div>
                            <div className="space-y-0.5 border-r border-[#1C1C1C] pr-2">
                              <span className="text-[9px] text-neutral-500 block">الشركاء المحليين:</span>
                              <span className="text-[10px] font-bold text-emerald-400 block">{gov.activePartners.toLocaleString('ar-EG')} عضو</span>
                            </div>
                          </div>

                          {/* 3. Deep Blue action/view button (exactly as depicted in image) */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAllowed) {
                                setShowRestrictionModal(gov.fullName);
                                return;
                              }
                              setSelectedGov(gov);
                              setSelectedRestGov(null);
                              setSelectedProvider(null);
                              // Scroll to target content
                              setTimeout(() => {
                                const el = document.getElementById('governorate-content-viewer');
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 100);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                (e.currentTarget as any).click();
                              }
                            }}
                            className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5 ${
                              !isAllowed
                                ? 'bg-[#0F0F0F] border border-[#222] text-neutral-400 hover:bg-neutral-850'
                                : isSelected 
                                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-950/30'
                                  : 'bg-[#1E3A8A] text-white hover:bg-[#1E40AF] hover:shadow-[#1E3A8A]/20'
                            }`}
                          >
                            <span>{isAllowed ? `عرض محتويات ${gov.name}` : 'طلب ترخيص وازدواج'}</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </>
            )}
              </>
            )}
          </>
        )}

        {/* Dynamic Interactive Drawer/Details Panel for SELECTED Governorate */}
        <AnimatePresence mode="wait">
          {(selectedGov || selectedRestGov) && (
            <motion.div
              id="governorate-content-viewer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0A0A0A] border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden"
            >
              {/* Absolute background graphics */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

              {/* Header inside viewer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-850 pb-5">
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => {
                      if (isEditModeEnabled && selectedGov && currentUser?.role === 'admin') {
                        setEditingEmblemGov(selectedGov);
                        setTempEmblemUrl(t(`gov_emblem_${selectedGov.id}`, ''));
                      }
                    }}
                    className={`p-1 bg-white rounded-2xl shadow border transition-all ${
                      isEditModeEnabled && selectedGov && currentUser?.role === 'admin'
                        ? 'border-dashed border-indigo-400 ring-2 ring-indigo-500/30 cursor-pointer hover:scale-105'
                        : 'border-neutral-200'
                    }`}
                  >
                    {selectedGov ? (
                      t(`gov_emblem_${selectedGov.id}`, '') ? (
                        <img 
                          src={t(`gov_emblem_${selectedGov.id}`, '')} 
                          alt={selectedGov.fullName} 
                          className="w-16 h-16 object-contain rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        selectedGov.emblemSvg()
                      )
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-indigo-950 flex items-center justify-center text-indigo-400 font-bold text-center text-xs">
                        شعار مصر
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {currentUser?.role === 'admin' && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => { setSelectedGov(null); setSelectedRestGov(null); setSelectedProvider(null); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedGov(null); setSelectedRestGov(null); setSelectedProvider(null);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-extrabold mb-1.5 transition-all cursor-pointer bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/20"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>الرجوع لقائمة المحافظات بالكامل</span>
                      </div>
                    )}
                    <span className="text-[10px] sm:text-xs text-indigo-400 font-extrabold flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>قطاع لوجستيات الصعيد والبحر الأحمر ومحافظات الدلتا الكبرى</span>
                    </span>
                    <h3 className="text-xl sm:text-3xl font-black text-white">
                      تمثيل واستحقاق {selectedGov ? selectedGov.fullName : `محافظة ${selectedRestGov?.name}`}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Admin controls toggle */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setIsAdminMode(!isAdminMode);
                      setIsAddingNew(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsAdminMode(!isAdminMode);
                        setIsAddingNew(false);
                      }
                    }}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      isAdminMode 
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-950/30' 
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>{isAdminMode ? 'تعطيل وضع المسؤول' : 'التعديل بصفتك المسؤول (الأدمين)'}</span>
                  </div>

                  {currentUser?.role === 'admin' && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => { setSelectedGov(null); setSelectedRestGov(null); setSelectedProvider(null); }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedGov(null); setSelectedRestGov(null); setSelectedProvider(null);
                        }
                      }}
                      className="p-2.5 sm:p-3 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-all cursor-pointer"
                      title="إغلاق العرض"
                    >
                      <X className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Main Core Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Right / Left Side: Analytics and Indicators */}
                <div className="lg:col-span-2 space-y-8">

                  {/* Governorate Flash Sale Banner Card */}
                  {(() => {
                    const currentSale = flashSales?.find(s => s.govId === activeGovId || s.govId === 'all');
                    if (!currentSale) return null;

                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative overflow-hidden bg-gradient-to-r from-rose-950/40 via-[#0D090A]/95 to-amber-950/30 border-2 border-rose-500 p-6 rounded-2xl space-y-4 shadow-2xl shadow-rose-500/35 ring-2 ring-rose-500/30 hover:border-rose-400 transition-all duration-300 transform hover:scale-[1.01]"
                      >
                        {/* Pulse effect badge */}
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                            </span>
                            <span className="bg-rose-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                              🚨 {currentSale.badge || "فرصة وقتية عاجلة"}
                            </span>
                          </div>
                          
                          {/* Timer */}
                          <FlashSaleTimer endsAt={currentSale.endsAt} />
                        </div>

                        <div className="space-y-1.5 font-sans leading-normal">
                          <h4 className="text-base sm:text-lg font-black text-rose-200 flex items-center gap-2 border-b border-rose-500/20 pb-2">
                            <span className="px-2 py-0.5 rounded bg-rose-550 bg-rose-500/20 text-rose-400 text-[10px] font-black animate-pulse shrink-0 border border-rose-500/30">تنبيه عاجل</span>
                            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                            <span>{currentSale.title}</span>
                          </h4>
                          <p className="text-xs sm:text-sm text-neutral-350 leading-relaxed font-semibold">
                            {currentSale.description}
                          </p>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-1 select-none">
                          <a 
                            href={`https://wa.me/${cmsSettings.whatsappNumber}?text=${encodeURIComponent(`أهلاً شوجر بيزنس إي جي، أنا مهتم جداً بالعرض المؤقت النشط في محافظة ${selectedGov ? selectedGov.name : selectedRestGov?.name || ''}: "${currentSale.title}"`)}`}
                            target="_blank"
                            rel="referrer noopener"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-rose-500/10 cursor-pointer"
                          >
                            <Clock className="w-4 h-4 animate-spin text-black" style={{ animationDuration: '4s' }} />
                            <span>{currentSale.ctaText || "احجز فرصتك الحصرية بالواتساب للتعاقد"}</span>
                          </a>
                        </div>
                      </motion.div>
                    );
                  })()}
                  
                  {/* Overview Intro card */}
                  <div className="bg-[#0E0E0E] border border-neutral-850 p-5 rounded-2xl space-y-3">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Info className="w-4 h-4 text-indigo-400" />
                      <span>التقرير التشغيلي للمحافظة لعام ٢٠٢٦</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-350 leading-relaxed font-medium">
                      {selectedGov ? selectedGov.description : `محافظة من المحافظات الأساسية في منظومة توريد وتوزيع مصر لـ شوجر بيزنس إي جي. ترتبط هذه المحافظة بخطوط لوجستية ومستودعات تخمير وتعبئة لتلبية الطلب المحلي على السكر البني والأبيض المخصص لحاملي كروت الدعم والمضاربات.`}
                    </p>
                  </div>

                  {/* ---------------- NEW USER REQUEST MODULE ---------------- */}
                  {/* Service Providers List Section */}
                  <div className="space-y-6 pt-2 border-t border-neutral-900">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black inline-block">عروض مستدامة</span>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-indigo-400" />
                          <span>الخدمات والمحلات والمكاتب المعتمدة والمتاحة</span>
                        </h4>
                      </div>

                      {/* Service categories filter */}
                      <div className="flex flex-wrap gap-2">
                        {['all', 'معارض لأجل الكهربائية', 'الموبيليا والأثاث المنزلي', 'معامل التحاليل الطبية'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setServiceFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              serviceFilter === cat 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-850'
                            }`}
                          >
                            {cat === 'all' ? 'جميع الخدمات' : cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Admin button to add a new service provider */}
                    {isAdminMode && !isAddingNew && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNew(true);
                          setIsEditingProviderId(null);
                        }}
                        className="w-full py-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-emerald-400 border border-emerald-500/30 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-dashed"
                      >
                        <Plus className="w-4.5 h-4.5 text-emerald-400" />
                        <span>إضافة مقدم خدمة أو معرض جديد في {selectedGov ? selectedGov.name : selectedRestGov?.name}</span>
                      </button>
                    )}

                    {/* New Service Provider submission form */}
                    {isAdminMode && isAddingNew && (
                      <form onSubmit={handleCreateProvider} className="bg-neutral-950 border border-emerald-500/30 p-6 rounded-2xl space-y-4 animate-fade-in text-right">
                        <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                          <h5 className="text-xs font-black text-emerald-400">إضافة مزود خدمة جديد كمسؤول</h5>
                          <button 
                            type="button" 
                            onClick={() => setIsAddingNew(false)}
                            className="text-neutral-500 hover:text-white text-xs font-bold"
                          >
                            إلغاء
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-bold block">اسم الشخص / صاحب الخدمة *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="مثال: أ. يوسف عبد القادر"
                              value={newProvName}
                              onChange={(e) => setNewProvName(e.target.value)}
                              className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-bold block">الخدمة التي يقدمها (سجل تجاري / نشاط) *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="مثال: توفير غرف أطفال ومطابخ بالتقسيط"
                              value={newProvServiceName}
                              onChange={(e) => setNewProvServiceName(e.target.value)}
                              className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-bold block">نوع الخدمة (لأجل الإشعارات) *</label>
                            <select 
                              value={newProvType}
                              onChange={(e) => setNewProvType(e.target.value)}
                              className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                            >
                              <option value="معارض لأجل الكهربائية">معارض لأجل الكهربائية</option>
                              <option value="الموبيليا والأثاث المنزلي">الموبيليا والأثاث المنزلي</option>
                              <option value="معامل التحاليل الطبية">معامل التحاليل الطبية</option>
                              <option value="عيادات ومراكز طبية">عيادات ومراكز طبية</option>
                              <option value="مستودعات ومنافذ السلع">مستودعات ومنافذ السلع</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-bold block">مواعيد العمل والإغلاق *</label>
                            <input 
                              type="text" 
                              placeholder="مثال: مفتوح الآن • يغلق الساعة ١٠:٠٠ مساءً"
                              value={newProvWorkingHours}
                              onChange={(e) => setNewProvWorkingHours(e.target.value)}
                              className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-bold block">الجمهور المستهدف للخدمة *</label>
                            <select 
                              value={newProvAudience}
                              onChange={(e) => setNewProvAudience(e.target.value as any)}
                              className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white cursor-pointer"
                            >
                              <option value="all">الجمهور العام (للجميع)</option>
                              <option value="members">الأعضاء المسجلين فقط (🔒)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-bold block">رقم هاتف التواصل للشركاء *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="مثال: 01012345678"
                              value={newProvPhone}
                              onChange={(e) => setNewProvPhone(e.target.value)}
                              className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-bold block">أدخل عنوان الفرع التفصيلي *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="العنوان ومكان المعرض"
                              value={newProvAddress}
                              onChange={(e) => setNewProvAddress(e.target.value)}
                              className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-bold block">لينك الموقع الإلكتروني للشركة / صاحب الخدمة</label>
                            <input 
                              type="url" 
                              placeholder="https://example.com"
                              value={newProvWebsiteUrl}
                              onChange={(e) => setNewProvWebsiteUrl(e.target.value)}
                              className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-left"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-bold block">لينك اللوكيشن / خرائط جوجل الخاص بصاحب الخدمة</label>
                            <input 
                              type="url" 
                              placeholder="https://maps.google.com/?q=..."
                              value={newProvLocationUrl}
                              onChange={(e) => setNewProvLocationUrl(e.target.value)}
                              className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-left"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-neutral-850 pt-3">
                          <ImageUploader
                            value={newProvPhotoUrl}
                            onChange={setNewProvPhotoUrl}
                            label="الصورة الرئيسية للمحل/الخدمة:"
                            adminPhone={currentUser?.phone}
                            placeholder="تحميل صورة الواجهة..."
                          />
                          
                          <ImageUploader
                            value={newProvExtraPhoto1}
                            onChange={setNewProvExtraPhoto1}
                            label="صورة إضافية لمعرض المنتجات (١):"
                            adminPhone={currentUser?.phone}
                            placeholder="تحميل صورة إضافية (١)..."
                          />

                          <ImageUploader
                            value={newProvExtraPhoto2}
                            onChange={setNewProvExtraPhoto2}
                            label="صورة إضافية لمعرض المنتجات (٢):"
                            adminPhone={currentUser?.phone}
                            placeholder="تحميل صورة إضافية (٢)..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400 font-bold block">وصف الخدمة ونظام التخفيض بالتفصيل</label>
                          <textarea 
                            rows={3}
                            placeholder="اكتب وصفاً مفصلاً يظهر داخل الصفحة الداخلية للخدمة عند النقر عليها..."
                            value={newProvDescription}
                            onChange={(e) => setNewProvDescription(e.target.value)}
                            className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                          ></textarea>
                        </div>

                        <button 
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer"
                        >
                          حفظ وإدخال مقدم الخدمة الفوري
                        </button>
                      </form>
                    )}

                    {/* Service Providers grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {activeGovProviders.map((prov) => (
                        <div
                          key={prov.id}
                          onClick={() => setSelectedProvider(prov)}
                          className="bg-[#0D0D0D] border border-neutral-850 hover:border-indigo-500/30 rounded-2xl overflow-hidden shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col group relative"
                        >
                          {/* Badge Notification / Service Type (Strictly represented above the photo view) */}
                          <div className="absolute top-3 right-3 z-20">
                            <span className="text-[10px] sm:text-xs font-black px-3 py-1 bg-indigo-600/90 text-white rounded-full shadow-lg border border-indigo-500/20 backdrop-blur-sm">
                              📢 {prov.serviceType}
                            </span>
                          </div>

                          {/* Float Admin Controls */}
                          {isAdminMode && (
                            <div className="absolute top-3 left-3 z-20 flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEditingProviderId(prov.id);
                                  setSelectedProvider(prov); // Opens edit panel instantly
                                }}
                                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-555 text-white shadow"
                                title="تعديل البيانات تفصيلياً"
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteProvider(prov.id, e)}
                                className="p-2 rounded-lg bg-red-600 hover:bg-red-555 text-white shadow"
                                title="حذف بالكامل"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Service photo area */}
                          <div className="h-44 relative bg-neutral-900 overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
                            <img 
                              src={prov.photoUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400"} 
                              alt={prov.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {prov.audience === 'members' && (
                              <span className="absolute top-3 left-3 z-20 text-[10px] font-black text-amber-200 bg-indigo-950/85 border border-indigo-700/50 px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-300" />
                                <span>خاص بالأعضاء 🔒</span>
                              </span>
                            )}
                            
                            {/* Running time / Working hours floating above the photo strictly! */}
                            <span className="absolute bottom-3 right-3 z-20 text-[10px] font-black text-rose-200 bg-rose-950/70 border border-rose-800/40 px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
                              <Clock className="w-3 h-3 text-rose-300" />
                              <span>{prov.workingHours}</span>
                            </span>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-1.5">
                              <div className="text-[10px] text-neutral-400 font-bold block">اسم المسؤول: <span className="text-white font-extrabold">{prov.name}</span></div>
                              <h5 className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                                {prov.serviceName}
                              </h5>
                              <p className="text-[11px] text-neutral-450 line-clamp-2 leading-relaxed">
                                {prov.description}
                              </p>
                            </div>

                            <div className="space-y-2.5 pt-3 border-t border-neutral-900 text-xs font-medium text-neutral-350">
                              <p className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                <span className="truncate">{prov.address}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <PhoneCall className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <span className="font-mono text-indigo-400 font-bold">{prov.phone}</span>
                              </p>
                            </div>

                            {/* Custom Action Areas - Website Link + Google Location */}
                            <div className="pt-3 flex items-center justify-between gap-2.5">
                              {/* Website link */}
                              {prov.websiteUrl ? (
                                <a 
                                  href={prov.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex-1 py-2 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/20 text-indigo-400 text-[10px] font-extrabold text-center flex items-center justify-center gap-1.5 transition-all"
                                >
                                  <Globe className="w-3 h-3 text-indigo-450" />
                                  <span>موقع الويب</span>
                                </a>
                              ) : (
                                <span className="flex-1 py-2 text-[10px] text-neutral-600 text-center bg-neutral-900 rounded-xl">لا يوجد موقع ويب</span>
                              )}

                              {/* Map pointer location */}
                              {prov.locationUrl ? (
                                <a 
                                  href={prov.locationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex-1 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold text-center flex items-center justify-center gap-1.5 transition-all"
                                >
                                  <MapPin className="w-3 h-3 text-emerald-450" />
                                  <span>موقع الخريطة</span>
                                </a>
                              ) : (
                                <span className="flex-1 py-2 text-[10px] text-neutral-600 text-center bg-neutral-900 rounded-xl">لا يوجد لوكيشن</span>
                              )}
                            </div>

                            <div className="pt-2 text-center">
                              <span className="text-[10px] text-indigo-500 font-bold group-hover:underline flex items-center justify-center gap-1">
                                <span>أنقر لفتح التفاصيل والصور الإضافية</span>
                                <ArrowRight className="w-3 h-3 rotate-180" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {activeGovProviders.length === 0 && (
                        <div className="col-span-full py-10 text-center bg-neutral-950 rounded-2xl border border-neutral-900 text-neutral-500 text-xs">
                          لا توجد خدمات شريكة مسجلة لهذه الفئة في هذه المحافظة حالياً. {isAdminMode && "انقر فوق زر إضافة أعلاه لإنشاء واحدة جديدة."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Branches / Storage Hubs in that Governorates */}
                  <div className="space-y-3 pt-6 border-t border-neutral-900">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Building className="w-4.5 h-4.5 text-indigo-400" />
                      <span>المستودعات التجارية ونقاط الفرز النشطة بالمنطقة</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedGov ? selectedGov.branches.map((b, i) => (
                        <div key={i} className="bg-[#090909] border border-neutral-850 p-4.5 rounded-2xl space-y-2 hover:border-indigo-500/20 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-indigo-400">{b.name}</span>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/35 border border-emerald-900 px-2 py-0.5 rounded-full">سعة مؤمنة</span>
                          </div>
                          <div className="space-y-1 text-xs text-neutral-400 font-medium">
                            <p className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                              <span>{b.address}</span>
                            </p>
                            <p className="text-[11px] text-neutral-500">الحجم الاستيعابي الأقصى للحبوب والسكر: <strong className="text-white">{b.capacity}</strong></p>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-2 bg-[#090909] border border-neutral-850 p-4.5 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-indigo-400">مستودع المحافظة المركزي الفرعي</span>
                            <span className="text-[10px] text-emerald-400 font-bold">نشط بالكامل</span>
                          </div>
                          <p className="text-xs text-neutral-400 font-medium">
                            السعة التخزينية المخصصة لهذه المحافظة تبلغ تقديراً: <strong className="text-white">{selectedRestGov?.capacity}</strong> لدعم عقود ومضاربات أثرياء ومنتسبي كارت شوجر الإقليمي.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* News & Bulletins of operations */}
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
                      <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                      <span>آخر المستجدات التشغيلية والمخزون الحالي بالموقع:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
                      {selectedGov ? selectedGov.news : `تم استكمال جرد المخازن والربط اللوجستي الإلكتروني بالكامل لعام 2026. معدلات الطلب والنمو المحلي تفيد بجاهزية المحافظة لتغطية حركات المضاربة القادمة.`}
                    </p>
                  </div>

                  {/* Dynamic Governorate Reports Section */}
                  <div className="space-y-3 pt-6 border-t border-neutral-900 text-right">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5 text-indigo-400" />
                      <span>التقارير المالية والتشغيلية المعتمدة للمحافظة ({governorateReports.filter(r => r.govId === activeGovId).length})</span>
                    </h4>
                    
                    {governorateReports.filter(r => r.govId === activeGovId).length > 0 ? (
                      <div className="space-y-4">
                        {governorateReports.filter(r => r.govId === activeGovId).map((report) => (
                          <div key={report.id} className="bg-[#0c0c0c] border border-neutral-850 hover:border-indigo-500/30 p-4 rounded-2xl space-y-3 relative group transition-all text-right">
                            {/* Delete report if user is admin */}
                            {currentUser?.role === 'admin' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReportToDelete(report);
                                  setDeleteConfirmationText('');
                                }}
                                className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 p-1 rounded bg-red-950 hover:bg-red-900 text-red-100 text-[10px] font-bold transition-all cursor-pointer border border-red-800"
                                title="حذف التقرير"
                              >
                                حذف التقرير 🗑️
                              </button>
                            )}
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-2">
                              <div>
                                <h5 className="text-xs font-black text-amber-500">{report.title}</h5>
                                <span className="text-[9px] text-neutral-500 font-mono">تاريخ الإصدار: {report.createdAt}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                <span className="text-[10px] text-emerald-450 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-sans">
                                  سعة السكر: {report.capacity && parseFloat(report.capacity).toLocaleString('ar-EG')} طن
                                </span>
                                <span className="text-[10px] text-indigo-450 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg font-mono">
                                  الهاتف: {report.phone}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                              {report.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#090909] border border-neutral-850/50 p-4.5 rounded-2xl text-center text-xs text-neutral-500 font-medium">
                        لا توجد تقارير تشغيلية مخصصة من الإدارة الموثقة لـ {selectedGov ? selectedGov.name : `محافظة ${selectedRestGov?.name}`} لليوم.
                      </div>
                    )}
                  </div>

                </div>

                {/* Left Side: Financial summaries, supervisor profiles and actions */}
                <div className="space-y-6">
                  
                  {/* High performance metrics card */}
                  <div className="bg-gradient-to-b from-[#0E0E0E] to-neutral-950 border border-indigo-500/20 p-5 rounded-2xl space-y-4">
                    <div className="text-center pb-2 border-b border-[#1C1C1C]">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">صافي ربحية الباقة المخصصة للمحافظة</span>
                      <h4 className="text-2xl font-black text-white mt-1">
                        {selectedGov ? selectedGov.annualROI : `${selectedRestGov?.roi} سنوياً`}
                      </h4>
                    </div>

                    <div className="space-y-3.5 text-xs text-neutral-300">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">الحد الأدنى للاستثمار:</span>
                        <span className="font-bold text-white">١٥,٠٠٠ ج.م</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">تغطية الأمان المالي:</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>١٠٠٪ مغطى بوثيقة</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">حجم الاستثمارات الأنشط:</span>
                        <span className="font-bold text-white">
                          {selectedGov ? selectedGov.activeInvestment : '١١,٢٠٠,٠٠٠ ج.م'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">فترة الاستحقاق وجرد الأرباح:</span>
                        <span className="font-bold text-indigo-400">ربع سنوي / سنوي مدمج</span>
                      </div>
                    </div>

                    {/* Quick Local Action */}
                    <a 
                      href={`https://wa.me/${cmsSettings.whatsappNumber}?text=${encodeURIComponent(`أهلاً إدارة شوجر بيزنس إي جي الموقرة، أود حجز عقد تزويد ومضاربة استثمارية معتمدة للفرع النشط في محافظة: ${selectedGov ? selectedGov.fullName : selectedRestGov ? `محافظة ${selectedRestGov.name}` : 'مصر'}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black hover:opacity-90 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow block"
                    >
                      <CalcIcon className="w-4 h-4" />
                      <span>حجز عقد تزويد في {selectedGov ? selectedGov.name : selectedRestGov?.name}</span>
                    </a>
                  </div>

                  {/* Certified regional supervisors details */}
                  <div className="bg-[#0D0D0D] border border-neutral-850 p-5 rounded-2xl space-y-4">
                    <h5 className="text-xs font-black text-white flex items-center gap-1.5 pb-2 border-b border-[#1C1C1C]">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>المشرف الفني والقانوني المعتمد للمحافظة:</span>
                    </h5>

                    {selectedGov ? selectedGov.supervisors.map((s, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-xs font-bold text-white">{s.name}</p>
                        <p className="text-[10px] text-neutral-500">{s.role}</p>
                        <p className="text-[11px] text-indigo-400 flex items-center gap-1 font-mono">
                          <PhoneCall className="w-3 h-3 text-neutral-500" />
                          <span>+20 {s.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}</span>
                        </p>
                      </div>
                    )) : (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">أ. محمود عبد الباري المصري</p>
                        <p className="text-[10px] text-neutral-500">المنسق اللوجستي الأول لقطاع المحافظات الفرعية</p>
                        <p className="text-[11px] text-indigo-400 flex items-center gap-1 font-mono">
                          <PhoneCall className="w-3 h-3 text-neutral-500" />
                          <span>+20 01012345678</span>
                        </p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!(selectedGov || selectedRestGov) && (
          <>
            {/* Search bar and compact filter layout for Egypt's rest governorates */}
            <div className="border-t border-neutral-850 pt-10 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span className="text-emerald-400">📌</span>
                  <span>باقي محافظات جمهورية مصر العربية</span>
                </h3>

                {/* In-app Instant filter input */}
                <div className="relative w-full sm:w-80">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input 
                    type="text"
                    placeholder="ابحث عن محافظتك (مثال: المنصورة، البحيرة...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs text-right pr-9 pl-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white outline-none font-medium transition-all"
                  />
                </div>
              </div>

              {/* Render the remaining governorates as buttons (strictly as requested!) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredRest.map((gov) => {
                  const isSelected = selectedRestGov?.id === gov.id;
                  const isAllowed = isGovAllowed(gov.id);
                  return (
                    <div
                      role="button"
                      tabIndex={0}
                      key={gov.id}
                      id={`gov-btn-${gov.id}`}
                      onClick={() => {
                        if (!isAllowed) {
                          setShowRestrictionModal(`محافظة ${gov.name}`);
                          return;
                        }
                        setSelectedRestGov(gov);
                        setSelectedGov(null);
                        setSelectedProvider(null);
                        // scroll to target container
                        setTimeout(() => {
                          const el = document.getElementById('governorate-content-viewer');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          (e.currentTarget as any).click();
                        }
                      }}
                      className={`py-3.5 px-4 rounded-xl text-xs font-black transition-all text-center border cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow'
                          : !isAllowed
                            ? 'bg-[#0A0A0A]/70 text-neutral-500 border-neutral-850/60 hover:bg-[#121212] hover:border-amber-500/20'
                            : 'bg-neutral-900/60 text-neutral-300 border-neutral-850 hover:border-neutral-700 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="truncate w-full block">
                          {!isAllowed && '🔒 '}{gov.name}
                        </span>
                        <span className="text-[9px] text-neutral-500 block">
                          {isAllowed ? `عائد ${gov.roi}` : 'غير مصرح للفرع'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredRest.length === 0 && (
                  <div className="col-span-full py-8 text-center text-neutral-500 text-xs">
                    لم نعثر على أي نتائج مطابقة لاسم المحافظة المُدخلة. يرجى تجربة كتابتها بلغة عربية صحيحة أو تجربة أخرى.
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </div>

      {/* ----------------- SERVICE PROVIDERS DETAILED PAGE MODAL ----------------- */}
      <AnimatePresence>
        {selectedProvider && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-md" dir="rtl">
            <motion.div
              id="sector-details-modal"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#0B0B0B] border border-neutral-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative text-right flex flex-col my-8"
            >
              {/* Floating Head Action Ribbon */}
              <div className="p-4 bg-neutral-900/80 border-b border-neutral-850 flex items-center justify-between z-10 sticky top-0 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-450 text-[10px] font-black uppercase">
                    تفاصيل الخدمة الرسمية
                  </span>
                  <p className="text-xs text-neutral-400 font-bold hidden sm:block">شريك معتمد لشوجر بيزنس إي جي</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvider(null);
                    setIsEditingProviderId(null);
                  }}
                  className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                  title="إغلاق الصفحة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable details Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
                
                {/* 1. Working Hours Display strictly ABOVE the Main Image (as requested by user!) */}
                <div className="p-4 rounded-2xl bg-gradient-to-l from-emerald-950/20 to-neutral-900 border border-emerald-500/35 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>مواعيد النشاط والعمل الرسمية للفروع:</span>
                  </div>
                  <span className="text-xs font-black text-white bg-emerald-600 px-3 py-1 rounded-full shadow">
                    🕒 {selectedProvider.workingHours}
                  </span>
                </div>

                {/* Edit Form inside the Modal if Admin clicked Edit */}
                {isEditingProviderId === selectedProvider.id ? (
                  <form onSubmit={(e) => handleUpdateProvider(e, selectedProvider.id)} className="space-y-4 bg-neutral-950 p-5 rounded-2xl border border-indigo-500/30 text-right">
                    <h4 className="text-xs font-black text-indigo-400">تعديل معلومات مقدم الخدمة / المعرض كمسؤول للشركة:</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 block">اسم الشخص / صاحب الخدمة</label>
                        <input 
                          type="text" 
                          defaultValue={selectedProvider.name}
                          onChange={(e) => setNewProvName(e.target.value)}
                          className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 block">الخدمة التي يقدمها</label>
                        <input 
                          type="text" 
                          defaultValue={selectedProvider.serviceName}
                          onChange={(e) => setNewProvServiceName(e.target.value)}
                          className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 block">مواعيد العمل والإغلاق</label>
                        <input 
                          type="text" 
                          defaultValue={selectedProvider.workingHours}
                          onChange={(e) => setNewProvWorkingHours(e.target.value)}
                          className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 block">رقم للتواصل الهاتفي</label>
                        <input 
                          type="text" 
                          defaultValue={selectedProvider.phone}
                          onChange={(e) => setNewProvPhone(e.target.value)}
                          className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 block">رابط الموقع الرسمي / ويب سايت</label>
                        <input 
                          type="url" 
                          defaultValue={selectedProvider.websiteUrl}
                          onChange={(e) => setNewProvWebsiteUrl(e.target.value)}
                          className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-left"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 block">خرائط وجي بي إس لوكيشن</label>
                        <input 
                          type="url" 
                          defaultValue={selectedProvider.locationUrl}
                          onChange={(e) => setNewProvLocationUrl(e.target.value)}
                          className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-left"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 block">فئة الجمهور المستهدف للخدمة</label>
                        <select 
                          defaultValue={selectedProvider.audience || 'all'}
                          onChange={(e) => setNewProvAudience(e.target.value as any)}
                          className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white cursor-pointer"
                        >
                          <option value="all">الجمهور العام (للجميع)</option>
                          <option value="members">الأعضاء المسجلين فقط (🔒)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 block">روابط إضافة الصورتين الإضافيتين (حتى صورتين إضافيتين!)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text"
                          placeholder="رابط الصورة الإضافية ١"
                          defaultValue={selectedProvider.extraPhotos ? selectedProvider.extraPhotos[0] : ''}
                          onChange={(e) => setNewProvExtraPhoto1(e.target.value)}
                          className="w-full text-xs p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-left"
                        />
                        <input 
                          type="text"
                          placeholder="رابط الصورة الإضافية ٢"
                          defaultValue={selectedProvider.extraPhotos ? selectedProvider.extraPhotos[1] : ''}
                          onChange={(e) => setNewProvExtraPhoto2(e.target.value)}
                          className="w-full text-xs p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-left"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 block">كتابة وصف مفصل وعروض</label>
                      <textarea 
                        rows={3}
                        defaultValue={selectedProvider.description}
                        onChange={(e) => setNewProvDescription(e.target.value)}
                        className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                      ></textarea>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        حفظ التعديلات
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditingProviderId(null)}
                        className="px-5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-350 text-xs transition-all cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                ) : selectedProvider.audience === 'members' && !currentUser ? (
                  <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-500">
                      <Lock className="w-8 h-8 animate-bounce" />
                    </div>
                    <h3 className="text-base font-black text-white">هذه الخدمة متاحة حصرياً للأعضاء</h3>
                    <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
                      هذا العرض الخدمي اللوجستي خاص وحصري للأعضاء والشركاء المسجلين بنظام شوجر بيزنس إي جي. يرجى التواصل مع الإدارة أو تسجيل الدخول لعرض كامل البيانات والملفات والاتصال بالشركاء.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProvider(null);
                        onOpenContact();
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-amber-200" />
                      <span>اتصل بنا للتفعيل الفوري للعضوية</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Main Image Banner */}
                    <div className="h-64 sm:h-80 w-full relative rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />
                      <img 
                        src={selectedProvider.photoUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"} 
                        alt={selectedProvider.serviceName} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Name of services & Person overlapping bottom right */}
                      <div className="absolute bottom-4 right-4 z-20 space-y-1">
                        <span className="text-[10px] font-black bg-indigo-600 px-2 py-0.5 rounded text-white inline-block">
                          {selectedProvider.serviceType}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-white block">
                          {selectedProvider.serviceName}
                        </h3>
                        <p className="text-xs text-neutral-200">بإشراف وتقديم: <strong className="text-indigo-400 font-extrabold">{selectedProvider.name}</strong></p>
                      </div>
                    </div>

                    {/* TWO ADDITIONAL IMAGES Section (as requested by user!) */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span>📸 ألبوم الصور التوضيحية الإضافية للمنتجات المعروضة:</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        {selectedProvider.extraPhotos && selectedProvider.extraPhotos[0] ? (
                          <div className="h-36 sm:h-44 rounded-xl overflow-hidden border border-neutral-800 shadow relative bg-neutral-950">
                            <img 
                              src={selectedProvider.extraPhotos[0]} 
                              alt="عرض إضافي ١" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-2 right-2 z-10 text-[9px] bg-black/60 text-neutral-350 px-2 py-0.5 rounded">صورة توضيحية ١</span>
                          </div>
                        ) : (
                          <div className="h-36 sm:h-44 rounded-xl border border-dashed border-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 text-center">
                            لا توجد صورة إضافية تظاهر أولى
                          </div>
                        )}

                        {selectedProvider.extraPhotos && selectedProvider.extraPhotos[1] ? (
                          <div className="h-36 sm:h-44 rounded-xl overflow-hidden border border-neutral-800 shadow relative bg-neutral-950">
                            <img 
                              src={selectedProvider.extraPhotos[1]} 
                              alt="عرض إضافي ٢" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-2 right-2 z-10 text-[9px] bg-black/60 text-neutral-350 px-2 py-0.5 rounded">صورة توضيحية ٢</span>
                          </div>
                        ) : (
                          <div className="h-36 sm:h-44 rounded-xl border border-dashed border-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 text-center">
                            لا توجد صورة إضافية تظاهر ثانية
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Full Detailed Description (كتابة وصف) */}
                    <div className="space-y-2.5 bg-[#0F0F0F] p-5 rounded-2xl border border-neutral-850">
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span>الوصف ونظام المضاربة المشتركة للشركة:</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
                        {selectedProvider.description}
                      </p>
                    </div>

                    {/* Compact Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-neutral-300">
                      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 space-y-1">
                        <span className="text-neutral-550 block text-[10px]">عنوان المعرض أو الفرع:</span>
                        <p className="text-white font-bold flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-neutral-500" />
                          <span>{selectedProvider.address}</span>
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 space-y-1">
                        <span className="text-neutral-550 block text-[10px]">رقم هاتف الاتصال والاستفسار:</span>
                        <p className="text-white font-bold flex items-center gap-2 font-mono">
                          <PhoneCall className="w-4 h-4 text-indigo-450" />
                          <span>+20 {selectedProvider.phone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Share Service Details Section */}
                    <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-850 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <Share2 className="w-4 h-4 text-indigo-400" />
                          <span>مشاركة بيانات هذا المعرض والخدمة:</span>
                        </h4>
                        {shareSuccess && (
                          <span className="text-[10px] text-emerald-400 font-extrabold animate-pulse bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                            ✓ تم النسخ بنجاح!
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-semibold">
                        يمكنك مشاركة تفاصيل وعنوان ورقم هاتف صاحب الخدمة المعتمد مع زملائك أو عبر منصات التواصل الاجتماعي المختلفة بضغطة واحدة:
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {/* 1. Direct Web Share API or Copy Info */}
                        <button
                          type="button"
                          onClick={() => {
                            const shareTitle = `${selectedProvider.serviceName} - ${selectedProvider.name}`;
                            const shareText = `📌 تفاصيل الخدمة والفرع لشريك مشروعنا:
⭐ الاسم: ${selectedProvider.name}
💡 الخدمة: ${selectedProvider.serviceName}
📍 العنوان: ${selectedProvider.address}
📞 الهاتف: +20 ${selectedProvider.phone}
🕒 مواعيد العمل: ${selectedProvider.workingHours}
عبر منصة شوجر بيزنس إي جي.`;
                            const shareUrl = selectedProvider.websiteUrl || window.location.href;

                            if (navigator.share) {
                              navigator.share({
                                title: shareTitle,
                                text: shareText,
                                url: shareUrl,
                              })
                              .then(() => {
                                setShareSuccess(true);
                                setTimeout(() => setShareSuccess(false), 2500);
                              })
                              .catch((err) => console.log('Error sharing:', err));
                            } else {
                              // Fallback copy info
                              const copyContent = `${shareText}\n🔗 رابط الموقع: ${shareUrl}`;
                              navigator.clipboard.writeText(copyContent)
                                .then(() => {
                                  setShareSuccess(true);
                                  setTimeout(() => setShareSuccess(false), 2500);
                                })
                                .catch((err) => console.log('Error copying to clipboard:', err));
                            }
                          }}
                          className="py-2.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>نسخ أو مشاركة</span>
                        </button>

                        {/* 2. Share on WhatsApp */}
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `*${selectedProvider.serviceName} - ${selectedProvider.name}*\n\n📌 تفاصيل الخدمة والفرع لشريك مشروعنا:\n⭐ الاسم: ${selectedProvider.name}\n💡 الخدمة: ${selectedProvider.serviceName}\n📍 العنوان: ${selectedProvider.address}\n📞 الهاتف: +20 ${selectedProvider.phone}\n🕒 مواعيد العمل: ${selectedProvider.workingHours}\n\n🔗 الرابط: ${selectedProvider.websiteUrl || window.location.href}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.9 1.45 5.516.002 10.003-4.485 10.006-10 0-2.672-1.04-5.184-2.926-7.07C16.743 1.644 14.232.602 11.56.602c-5.52.002-10.01 4.49-10.01 10.008 0 1.908.5 3.486 1.446 4.978l-.993 3.626 3.73-.978L6.64 19.15zm11.303-4.103c-.3-.147-1.78-.876-2.053-.978-.276-.098-.476-.147-.675.15-.198.29-.77.97-.943 1.17-.173.193-.347.218-.647.072-.3-.15-1.26-.464-2.398-1.48-.886-.79-1.485-1.77-1.66-2.07-.17-.3-.018-.46.13-.61.137-.135.305-.35.457-.525.15-.173.2-.3.3-.497.1-.2.05-.37-.02-.52-.07-.15-.675-1.62-.924-2.22-.24-.58-.485-.5-.675-.51-.174-.01-.373-.01-.572-.01-.2 0-.523.074-.797.373-.273.3-1.045 1.02-1.045 2.487s1.07 2.882 1.22 3.08c.15.2 2.1 3.21 5.1 4.51.714.31 1.272.49 1.704.63.717.23 1.368.2 1.884.12.573-.08 1.78-.727 2.03-1.43.25-.7.25-1.3.173-1.43-.07-.13-.27-.21-.57-.35z"/>
                          </svg>
                          <span>واتساب</span>
                        </a>

                        {/* 3. Share on Telegram */}
                        <a
                          href={`https://telegram.me/share/url?url=${encodeURIComponent(
                            selectedProvider.websiteUrl || window.location.href
                          )}&text=${encodeURIComponent(
                            `*${selectedProvider.serviceName} - ${selectedProvider.name}*\n\n📌 تفاصيل الخدمة والفرع لشريك مشروعنا:\n⭐ الاسم: ${selectedProvider.name}\n💡 الخدمة: ${selectedProvider.serviceName}\n📍 العنوان: ${selectedProvider.address}\n📞 الهاتف: +20 ${selectedProvider.phone}\n🕒 مواعيد العمل: ${selectedProvider.workingHours}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-sky-600/10 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/20 text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M11.944 0C5.344 0 0 5.344 0 12c0 6.656 5.344 12 11.944 12 6.656 0 12-5.344 12-12 0-6.656-5.344-12-12-12zm5.892 8.268l-1.932 9.08c-.14.64-.524.8-.106.336l-2.946-2.17-1.42 1.368c-.158.156-.29.29-.594.29l.21-2.99 5.448-4.92c.236-.21-.052-.33-.362-.12l-6.73 4.236-2.9-.9c-.63-.2-.64-.63.13-.93L16.273 6.61c.88-.32 1.65.21 1.563 1.658z"/>
                          </svg>
                          <span>تيليجرام</span>
                        </a>

                        {/* 4. Share on Facebook */}
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            selectedProvider.websiteUrl || window.location.href
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                          <span>فيسبوك</span>
                        </a>
                      </div>
                    </div>

                    {/* Core links for user request - Web Link at bottom, Location is below it! */}
                    <div className="space-y-3 pt-4 border-t border-neutral-900">
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 font-bold block">رابط المعشر والويب سايت الخاص بالشركة:</span>
                        {selectedProvider.websiteUrl ? (
                          <a 
                            href={selectedProvider.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                          >
                            <Globe className="w-4 h-4" />
                            <span>زيارة الموقع الإلكتروني الخاص بصاحب الخدمة ({selectedProvider.websiteUrl})</span>
                          </a>
                        ) : (
                          <div className="w-full py-3 bg-neutral-900 text-neutral-500 text-xs text-center rounded-2xl font-bold border border-neutral-850">
                            لا تتوفر لافتة ويب سايت حالية لمقدم الخدمة هذا.
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 font-bold block">العنوان الجغرافي وخريطة الـ GPS المعتمدة:</span>
                        {selectedProvider.locationUrl ? (
                          <a 
                            href={selectedProvider.locationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>انقر للانتقال الفوري إلى اللوكيشن على خرائط جوجل</span>
                          </a>
                        ) : (
                          <div className="w-full py-3 bg-neutral-900 text-neutral-500 text-xs text-center rounded-2xl font-bold border border-neutral-850">
                            لا تتوفر خرائط GPS مدخلة حالية لمقدم الخدمة هذا.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </div>

              {/* Modal footer information */}
              <div className="p-4 bg-neutral-950/90 border-t border-neutral-850 flex items-center justify-between text-[10px] font-bold text-neutral-500">
                <span>تاريخ التوثيق: ٢٠٢٦ م</span>
                <span>بواسطة قطاع الدعم الفني لشوجر بيزنس إي جي</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- ACCESS RESTRICTION WARNING MODAL ----------------- */}
      <AnimatePresence>
        {showRestrictionModal && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-fade-in" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0D0D0D] border border-neutral-800 rounded-3xl w-full max-w-md p-6 relative text-right space-y-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-amber-500 border-b border-neutral-850 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white font-sans">عذراً، المحافظة غير مدرجة بنطاقك!</h4>
                  <p className="text-[10px] text-neutral-500 font-medium font-mono">نظام حوكمة ومراقبة الصعيد للثروات</p>
                </div>
              </div>

              <div className="space-y-3 font-sans">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  عذراً يا شريكنا الكريم؛ لم يتم إدراج <span className="text-amber-400 font-extrabold">{showRestrictionModal}</span> ضمن محافظتك المصرحة بتطبيق شوجر بيزنس إي جي حالياً.
                </p>
                <p className="text-xs text-neutral-450 leading-relaxed font-semibold">
                  بموجب الإقرارات المالية واللوجستية التابعة لوزارة التموين والمضاربات الحرة بمصر لعام ٢٠٢٦، يجب الحصول على موافقة مسؤول القطاع لربط الرقم القومي الجديد بنطاق هذه المحافظة.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`https://wa.me/${cmsSettings.whatsappNumber}?text=${encodeURIComponent(`أهلاً إدارة شوجر بيزنس إي جي، قمت بتسجيل حسابي بنجاح بالرقم القومي، وأرجو توسيع الترخيص لاعتماد دخولي لمشاهدة فروع وإحصائيات وعقود لـ ${showRestrictionModal}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black text-center flex items-center justify-center gap-1.5 shadow transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>مراسلة الإدارة بالواتساب لاعتماد الترخيص فوراً</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowRestrictionModal(null)}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-400 text-xs font-bold text-center border border-neutral-800"
                >
                  إغلاق وتصفح محافظاتي المصرحة فقط
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- CUSTOM REPORT DELETION CONFIRMATION DIALOG ----------------- */}
      <AnimatePresence>
        {reportToDelete && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-fade-in" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              className="bg-[#0b0b0d] border border-red-900 rounded-3xl w-full max-w-lg p-6 sm:p-8 relative text-right space-y-6 shadow-3xl text-white"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setReportToDelete(null);
                  setDeleteConfirmationText('');
                }}
                className="absolute top-4 left-4 p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Warning Header */}
              <div className="flex items-center gap-3 text-red-500 border-b border-neutral-850 pb-4">
                <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white font-sans">تأكيد الإجراء الإداري الحساس</h4>
                  <p className="text-[10px] text-red-400 font-bold font-mono">حذف تقرير مالي ولوجستي معتمد نهائياً</p>
                </div>
              </div>

              {/* Report Description Wrapper */}
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 space-y-2 text-right">
                <span className="text-[10px] text-neutral-500 block font-bold">التقرير الجاري حذفه:</span>
                <div className="text-xs text-neutral-200 font-sans font-bold leading-relaxed">
                  {reportToDelete.title} ({reportToDelete.govName})
                </div>
                <p className="text-[11px] text-neutral-400 font-sans line-clamp-3 leading-relaxed mt-1">
                  {reportToDelete.content}
                </p>
              </div>

              {/* Instructions text */}
              <div className="space-y-2 font-sans text-right">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  هذا الإجراء <span className="text-red-400 font-extrabold">نهائي وغير قابل للتراجع</span>. سيتم شطب السعة المخزنية والبيانات المعتمدة من خوادم شوجر بيزنس إي جي فوراً.
                </p>
                <p className="text-xs text-neutral-450 leading-relaxed font-semibold">
                  لتجنب الفقدان العشوائي أو الحذف غير المقصود، يرجى كتابة الكلمة التأكيدية <span className="text-red-400 font-mono font-black border border-red-500/20 px-2 py-0.5 rounded bg-red-500/5 tracking-wider select-none">DELETE</span> بالإنجليزية في الحقل أدناه للموافقة:
                </p>
              </div>

              {/* Input for DELETE confirmation */}
              <div className="space-y-1.5 text-right">
                <input
                  type="text"
                  placeholder="اكتب DELETE للتأكيد"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 hover:border-red-500/30 focus:border-red-500 text-center uppercase tracking-widest text-[#25C1F2] placeholder-neutral-600 rounded-xl px-4 py-3 text-xs font-mono font-bold outline-none transition-colors"
                  autoFocus
                />
                
                {deleteConfirmationText.trim().toUpperCase() === 'DELETE' ? (
                  <p className="text-[10px] text-emerald-450 font-bold font-sans text-center transition-all animate-pulse">
                    ✓ الكلمة مطابقة تماماً. يمكنك الحذف الآن.
                  </p>
                ) : deleteConfirmationText.trim() !== '' ? (
                  <p className="text-[10px] text-red-400 font-bold font-sans text-center transition-all">
                    ✗ يرجى مطابقة الكلمة المطلوبة تماماً بأحرف كبيرة (DELETE).
                  </p>
                ) : null}
              </div>

              {/* Call to action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                  onClick={() => {
                    const updated = governorateReports.filter(r => r.id !== reportToDelete.id);
                    saveReportsToLocals(updated);
                    setReportToDelete(null);
                    setDeleteConfirmationText('');
                  }}
                  className={`w-full py-3 rounded-xl text-white text-xs font-black text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    deleteConfirmationText.trim().toUpperCase() === 'DELETE'
                      ? 'bg-red-800 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-red-650'
                      : 'bg-neutral-900 text-neutral-600 border border-neutral-850 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>تأكيد الحذف نهائياً 🗑️</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReportToDelete(null);
                    setDeleteConfirmationText('');
                  }}
                  className="w-full py-3 rounded-xl bg-[#141416] hover:bg-[#1a1a1d] text-neutral-300 text-xs font-bold text-center border border-neutral-800 cursor-pointer"
                >
                  تراجع عن الإلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {editingEmblemGov && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#0B0B0B] border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-right flex flex-col p-6 space-y-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setEditingEmblemGov(null)}
                className="absolute top-4 left-4 p-2 rounded-xl text-neutral-450 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white font-sans">تخصيص هوية المحافظة الموثقة</h4>
                  <p className="text-[10px] text-indigo-400 font-bold font-mono">تحديث شعار المحافظة وربطه بالنظام</p>
                </div>
              </div>

              {/* Info Text */}
              <p className="text-xs text-neutral-450 leading-relaxed font-sans font-medium">
                يمكن لمدير شوجر بيزنس رفع شعار مخصص بدقة عالية (مثل صور معالم، شعار تجاري مخصص، أو صورة رمزية مميزة للمحافظة الاستثمارية) لتستبدل الرمز التلقائي.
              </p>

              {/* Emblem Logo Preview */}
              <div className="bg-[#050505] border border-neutral-900 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-550 block font-bold">المحافظة النشطة:</span>
                  <span className="text-xs font-bold text-white block">محافظة {editingEmblemGov.name}</span>
                </div>
                <div className="p-1 px-2.5 bg-neutral-900/60 rounded-xl border border-neutral-800 text-center">
                  <span className="text-[9px] text-amber-500 font-black animate-pulse block mb-1">معاينة الشعار الحالي</span>
                  <div className="w-12 h-12 mx-auto flex items-center justify-center bg-white p-1.5 rounded-xl">
                    {tempEmblemUrl ? (
                      <img src={tempEmblemUrl} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      editingEmblemGov.emblemSvg()
                    )}
                  </div>
                </div>
              </div>

              {/* Image Uploader */}
              <ImageUploader
                value={tempEmblemUrl}
                onChange={setTempEmblemUrl}
                label="ملف شعار المحافظة الجديد (تحميل صورة أو رابط):"
                adminPhone={currentUser?.phone}
                placeholder="تحميل شعار مخصص أو اسحب صورة..."
              />

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    await cmsUpdateTranslation(`gov_emblem_${editingEmblemGov.id}`, tempEmblemUrl);
                    setEditingEmblemGov(null);
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs text-center transition-all cursor-pointer"
                >
                  حفظ الشعار المخصص
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await cmsUpdateTranslation(`gov_emblem_${editingEmblemGov.id}`, '');
                    setEditingEmblemGov(null);
                  }}
                  className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-rose-450 font-bold text-xs text-center border border-neutral-800 cursor-pointer"
                >
                  استعادة الشعار الافتراضي
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-neutral-800 w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  تغيير كلمة المرور الشخصية
                </h3>
                <div 
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsChangePasswordOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsChangePasswordOpen(false);
                      setOldPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                      setCpError('');
                      setCpSuccess('');
                    }
                  }}
                  className="p-2 text-neutral-500 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </div>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setCpError('');
                  setCpSuccess('');
                  
                  if (newPassword !== confirmNewPassword) {
                    setCpError('كلمات المرور الجديدة غير متطابقة!');
                    return;
                  }
                  
                  if (newPassword.length < 6) {
                    setCpError('يجب أن تكون كلمة المرور الجديدة ٦ أحرف على الأقل.');
                    return;
                  }

                  setCpLoading(true);
                  const result = await cmsChangePassword(oldPassword, newPassword);
                  if (result.success) {
                    setCpSuccess(result.message);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setTimeout(() => setIsChangePasswordOpen(false), 2000);
                  } else {
                    setCpError(result.message);
                  }
                  setCpLoading(false);
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">كلمة المرور الحالية:</label>
                  <input 
                    type="password"
                    required
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">كلمة المرور الجديدة:</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">تأكيد كلمة المرور الجديدة:</label>
                  <input 
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>

                {cpError && <p className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[11px] font-bold">{cpError}</p>}
                {cpSuccess && <p className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[11px] font-bold">{cpSuccess}</p>}

                <button
                  type="submit"
                  disabled={cpLoading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-sm transition-all shadow-lg"
                >
                  {cpLoading ? 'جاري التحديث...' : 'تغيير كلمة المرور الآن'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
