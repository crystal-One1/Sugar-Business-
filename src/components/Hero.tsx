import React from 'react';
import { ArrowLeft, Play, Shield, TrendingUp, Users, Award } from 'lucide-react';
import { useCMS } from '../CMSContext';
import { EditableText } from './EditableText';

interface HeroProps {
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const { t } = useCMS();

  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#0F0F0F] overflow-hidden pt-8 pb-16 sm:pb-24">
      {/* Decorative background grid and blurs */}
      <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none opacity-50">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1F1F1F" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-900/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column: Text and CTAs */}
          <div className="lg:col-span-7 text-right space-y-6 sm:space-y-8">
            
            {/* Live Badge */}
            <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <EditableText translationKey="hero_badge" defaultText="بوابتك الاستثمارية الأكثر أماناً في مصر" />
            </div>

            {/* Main Titles */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              <EditableText translationKey="hero_title_brand" defaultText="شوجر بيزنس إي جي" className="block" />
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-450 to-pink-400 bg-clip-text text-transparent">
                <EditableText translationKey="hero_subtitle" defaultText="وجهتك الاستثمارية الآمنة" />
              </span>
            </h1>

            {/* Description matching the image context's premise */}
            <div className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl bg-[#0F0F0F]/55 backdrop-blur-md p-4 rounded-2xl border border-neutral-850 shadow-xl">
              <EditableText translationKey="hero_desc" defaultText="حقّق تطلعاتك المالية بثقة وأمان تام. نوفر لك في شوجر بيزنس حزمة حلول وباقات استثمارية مرنة تتيح لك الاستثمار بمبالغ مدروسة والحصول على عائد سنوي هيكلي مضمون ومحمي بموجب عقود قانونية موثقة." isMultiline />
            </div>

            {/* Highlighting Points block from image */}
            <div className="flex flex-wrap gap-4 text-xs font-bold text-neutral-200">
              <span className="bg-[#0F0F0F] border border-neutral-800 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <EditableText translationKey="hero_point1" defaultText="استثمار مضمون وآمن بالكامل" />
              </span>
              <span className="bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
                <EditableText translationKey="hero_point2" defaultText="عوائد سنوية هيكلية تصل لـ 40%" />
              </span>
            </div>

            {/* Dynamic Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-start pt-2">
              <div
                onClick={onOpenContact}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <EditableText translationKey="hero_cta_consult" defaultText="احجز استشارتك مجاناً" />
                <ArrowLeft className="w-5 h-5 shrink-0" />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 sm:pt-10 border-t border-neutral-850 max-w-lg">
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-extrabold text-white block">
                  <EditableText translationKey="hero_metric1_val" defaultText="+50K" />
                </p>
                <p className="text-xs text-neutral-400 font-medium font-sans">
                  <EditableText translationKey="hero_metric1_desc" defaultText="مستثمر نشط في مصر" />
                </p>
              </div>
              <div className="text-right border-r border-neutral-800 pr-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-white block">
                  <EditableText translationKey="hero_metric2_val" defaultText="2022" />
                </p>
                <p className="text-xs text-neutral-400 font-medium font-sans">
                  <EditableText translationKey="hero_metric2_desc" defaultText="تاريخ التأسيس والنجاح" />
                </p>
              </div>
              <div className="text-right border-r border-neutral-800 pr-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-white block">
                  <EditableText translationKey="hero_metric3_val" defaultText="100%" />
                </p>
                <p className="text-xs text-neutral-400 font-medium font-sans">
                  <EditableText translationKey="hero_metric3_desc" defaultText="بضمان عقود موثقة" />
                </p>
              </div>
            </div>

          </div>

          {/* Left Column: Premium Interactive Illustration */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square bg-[#0F0F0F]/35 backdrop-blur-md rounded-3xl p-6 border border-neutral-800 shadow-inner flex items-center justify-center overflow-hidden">
              {/* Spinning/Animating Circles for backdrop */}
              <div className="absolute w-72 h-72 rounded-full border border-neutral-850 border-dashed animate-spin duration-1000s"></div>
              <div className="absolute w-80 h-80 rounded-full border border-neutral-800 animate-pulse duration-3000"></div>

              {/* Central Graphic: Animated Card showing compound growth */}
              <div className="relative bg-[#0F0F0F]/75 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-full max-w-xs border border-neutral-800 space-y-6 z-10 hover:scale-102 transition-transform duration-300">
                
                {/* Visual Header */}
                <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                  <div className="h-2.5 w-16 bg-neutral-800 rounded"></div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <TrendingUp className="w-5 h-5 animate-bounce" />
                  </div>
                </div>

                {/* Growth visual: Simulated chart bars */}
                <div className="space-y-3 pt-2">
                  <div className="text-center bg-[#070707] p-3 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block font-medium">
                      <EditableText translationKey="hero_illus_p_label" defaultText="إجمالي الأرباح المتوقعة" />
                    </span>
                    <span className="text-3xl font-extrabold text-teal-400 block tracking-tight">
                      <EditableText translationKey="hero_illus_p_val" defaultText="+40,000 ج.م" />
                    </span>
                  </div>
                  
                  {/* Bars */}
                  <div className="flex items-end justify-between h-24 pt-4 px-2">
                    <div className="w-6 bg-neutral-800/80 rounded-t-md h-8 transition-all hover:bg-indigo-500 cursor-pointer"></div>
                    <div className="w-6 bg-neutral-800 rounded-t-md h-12 transition-all hover:bg-indigo-500 cursor-pointer"></div>
                    <div className="w-6 bg-indigo-900/60 rounded-t-md h-16 transition-all hover:bg-indigo-500 cursor-pointer"></div>
                    <div className="w-6 bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-md h-24 shadow-md transition-all relative group cursor-pointer">
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#050505] text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">40%</span>
                    </div>
                  </div>
                </div>

                {/* Verified watermark */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-[10px] font-bold text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <EditableText translationKey="hero_illus_seal" defaultText="عقد موثق معتمد" />
                  </span>
                  <span>Sugar business</span>
                </div>

              </div>

              {/* Extra Floating Badge 1 */}
              <div className="absolute top-8 right-4 bg-[#0F0F0F]/90 backdrop-blur border border-neutral-800 shadow-lg px-4 py-2.5 rounded-xl flex items-center gap-2 animate-bounce hover:scale-105 transition-all z-20">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-indigo-400">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-extrabold text-neutral-200">
                    <EditableText translationKey="hero_floating1_title" defaultText="أرباح دورية" />
                  </p>
                  <p className="text-[9px] text-neutral-400">
                    <EditableText translationKey="hero_floating1_sub" defaultText="تصرف في موعدها" />
                  </p>
                </div>
              </div>

              {/* Extra Floating Badge 2 */}
              <div className="absolute bottom-6 left-2 bg-[#0F0F0F]/90 backdrop-blur border border-neutral-800 shadow-lg px-4 py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 transition-all z-20">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-emerald-500">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-extrabold text-neutral-200">
                    <EditableText translationKey="hero_floating2_title" defaultText="أمان معتمد" />
                  </p>
                  <p className="text-[9px] text-neutral-400">
                    <EditableText translationKey="hero_floating2_sub" defaultText="متوافق مع الشريعة" />
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
