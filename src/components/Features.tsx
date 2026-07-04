import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileSpreadsheet, 
  Headphones, 
  TrendingUp, 
  Handshake, 
  Briefcase, 
  Coins 
} from 'lucide-react';
import { FEATURE_ITEMS } from '../data';
import { EditableText } from './EditableText';

// Helper to map string to Lucid Icon
const getIconComponent = (name: string) => {
  switch (name) {
    case 'ShieldCheck':
      return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
    case 'Users':
      return <Users className="w-6 h-6 text-indigo-400" />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet className="w-6 h-6 text-indigo-400" />;
    case 'Headphones':
      return <Headphones className="w-6 h-6 text-indigo-400" />;
    case 'TrendingUp':
      return <TrendingUp className="w-6 h-6 text-indigo-400" />;
    case 'Handshake':
      return <Handshake className="w-6 h-6 text-indigo-400" />;
    case 'Briefcase':
      return <Briefcase className="w-6 h-6 text-indigo-400" />;
    case 'Coins':
      return <Coins className="w-6 h-6 text-indigo-400" />;
    default:
      return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
  }
};

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-[#0F0F0F] relative border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold bg-neutral-900 text-indigo-400 px-3 py-1.5 rounded-full border border-neutral-800 inline-block">
            <EditableText translationKey="features_badge" defaultText="لماذا تختار شوجر بيزنس؟" />
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            <EditableText translationKey="features_title" defaultText="بيئة مالية واستثمارية متكاملة تضمن ريادتك" />
          </h2>
          <div className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            <EditableText translationKey="features_subtitle" defaultText="نحن نوفر لعملائنا في مصر حلولاً مبتكرة تجمع بين العوائد القوية وسهولة الإجراءات ومعايير الأمان المالي والقانوني التام." isMultiline />
          </div>
        </div>

        {/* Feature Grid - 8 Elements customized according to the image specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {FEATURE_ITEMS.map((item) => (
            <div 
              key={item.id} 
              id={`feature-card-${item.id}`}
              className="bg-[#0A0A0A] hover:bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl hover:border-neutral-700 hover:-translate-y-1 transition-all duration-300 text-right flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-inner">
                  {getIconComponent(item.iconName)}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-white block">
                    <EditableText translationKey={`feature_title_${item.id}`} defaultText={item.title} />
                  </h3>
                  <div className="text-xs sm:text-sm text-neutral-400 leading-relaxed block">
                    <EditableText translationKey={`feature_desc_${item.id}`} defaultText={item.description} isMultiline />
                  </div>
                </div>
              </div>
              
              {/* Subtle footer accent to increase layout premiumness */}
              <div className="mt-4 pt-4 border-t border-neutral-850 text-[10px] text-neutral-400 font-bold tracking-widest flex items-center gap-1">
                <span>Sugar business</span>
                <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                <span>مضمون</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic CTA Banner below features */}
        <div className="mt-16 bg-gradient-to-r from-[#0A0A0A] to-[#0F0F0F] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-neutral-800 relative overflow-hidden text-right">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <h3 className="text-xl sm:text-2xl font-extrabold lg:text-3xl leading-snug">
              <EditableText translationKey="features_cta_title" defaultText="البدء برأس مال صغير يضعك على أولى خطوات بناء الثروة" />
            </h3>
            <div className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              <EditableText translationKey="features_cta_desc" defaultText="لا يشترط وجود مبالغ ضخمة لتبدأ استثمارك اليوم، فقط اختر الباقة التي تناسبك من 5000 ج.م وابدأ في جني أرباح رسمية مضمونة بشكل شهري أو ربع سنوي بمرونة تامة." isMultiline />
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => {
                  const el = document.getElementById('calculator');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-neutral-200 text-black font-bold text-sm px-6 py-3 rounded-full shadow-md transition-colors cursor-pointer"
              >
                حساب الأرباح المتوقعة
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('packages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-full shadow-md transition-colors cursor-pointer"
              >
                تصفح الباقات الاستثمارية
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
