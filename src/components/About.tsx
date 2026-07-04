import React from 'react';
import { ShieldCheck, Compass, Target, Star, FileText } from 'lucide-react';
import { Logo } from './Header';
import { useCMS } from '../CMSContext';
import { EditableText } from './EditableText';

export const About: React.FC = () => {
  const { t } = useCMS();

  return (
    <section id="about" className="py-20 bg-[#0A0A0A] relative overflow-hidden border-t border-neutral-900">
      {/* Decorative details */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-900/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column: Visual and Logo Showcase */}
          <div className="lg:col-span-5 order-last lg:order-first">
            <div className="relative bg-[#0F0F0F] rounded-3xl p-8 border border-neutral-800 shadow-2xl space-y-8 overflow-hidden text-right">
              {/* Egypt map background glow */}
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/5 rounded-full pointer-events-none"></div>

              {/* Decorative top header */}
              <div className="flex justify-between items-center pb-6 border-b border-neutral-800">
                <span className="text-xs font-bold text-indigo-400 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">منظومتنا المالية</span>
                <span className="text-[10px] font-semibold text-neutral-400 font-mono">
                  <EditableText translationKey="about_badge" defaultText="تأسيس 2022" />
                </span>
              </div>

              {/* Central Logo Illustration */}
              <div className="flex justify-center py-6">
                <div className="p-4 bg-[#0A0A0A]/50 rounded-2xl border border-neutral-800 shadow-inner flex items-center justify-center">
                  <Logo className="h-16 animate-pulse" />
                </div>
              </div>

              {/* Mini cards inside */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-neutral-800">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-2 shadow-md">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-200">رؤيتنا</h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">تمكين الأفراد من تنمية ثرواتهم بمبالغ مدروسة وآمنة.</p>
                </div>

                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-neutral-800">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-200">مهمتنا</h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">بناء بيئة استثمارية مضمونة قانونيا ومتوافقة للشريعة.</p>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="flex items-center gap-2 justify-center bg-[#070707] text-emerald-400 py-3 rounded-2xl border border-neutral-800 text-xs font-bold font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                جميع عقودنا الاستثمارية موثقة ومعتمدة قانونياً
              </div>
            </div>
          </div>

          {/* Left Column: Text Content and Detailed Paragraphs matching the Image */}
          <div className="lg:col-span-7 text-right space-y-6 sm:space-y-8">
            
            {/* Tagline */}
            <div className="space-y-2">
              <span className="text-sm font-bold uppercase tracking-wider text-indigo-400 block">
                <EditableText translationKey="about_title_brand" defaultText="تطبيق شوجر بيزنس إي جي" />
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                <EditableText translationKey="about_title" defaultText="بوابتك الرائدة للاستثمار الآمن والمستمر" />
              </h2>
            </div>

            {/* Core Paragraph Box matching literal content in the image */}
            <div className="space-y-4 text-neutral-300 text-base sm:text-lg leading-relaxed">
              <div>
                <EditableText translationKey="about_desc1" defaultText="بعد نجاحنا المميز في عام 2022، قمنا بإنشاء تطبيق Sugar business كوجهة استثمارية فريدة وموثوقة، تم تصميمها خصيصاً لتناسب احتياجات المستثمر المصري الذي يبحث عن الأمان وتحقيق نمو مالي هيكلي حقيقي." isMultiline />
              </div>
              
              <div>
                <EditableText translationKey="about_desc2" defaultText="تتيح لك منصتنا حرية كاملة في اختيار قنوات وحلول الاستثمار بمبالغ تبدأ صغيرة لتناسب جميع الأفراد والشرائح، مع الحصول على أرباح سنوية مدروسة بطرق سلسة ومضمونة بالكامل وبأسلوب تخطيط احترافي ومبسط يسهل على الجميع التعامل معه." isMultiline />
              </div>

              <blockquote className="border-r-4 border-indigo-500 bg-neutral-900/60 p-4 rounded-l-2xl text-neutral-100 font-medium text-sm sm:text-base mt-4 block">
                <EditableText translationKey="about_quote" defaultText='"إن هـدفنا الأسمى هو تـمكين جـميع الأفراد مـن بناء وتنمية ثرواتهم وتحقيق الاستقلال المالي المنشود عبر توفير بيئة خالية من المخاطر وشراكات استراتيجية متكاملة."' isMultiline />
              </blockquote>
            </div>

            {/* Highlighted items */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center text-indigo-400 mt-1 flex-shrink-0">
                  <span className="w-2 h-2 rounded-xs bg-indigo-500"></span>
                </div>
                <div>
                  <div className="font-bold text-neutral-200 text-sm">
                    <EditableText translationKey="about_highlight1_title" defaultText="البدء من 5000 جنيه فقط" />
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    <EditableText translationKey="about_highlight1_desc" defaultText="نكسر حواجز الاستثمار لنجعله متاحاً ومتوفراً للجميع." />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center text-purple-400 mt-1 flex-shrink-0">
                  <span className="w-2 h-2 rounded-xs bg-purple-500"></span>
                </div>
                <div>
                  <div className="font-bold text-neutral-200 text-sm">
                    <EditableText translationKey="about_highlight2_title" defaultText="أرباح متكاملة بضمان قانوني" />
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    <EditableText translationKey="about_highlight2_desc" defaultText="عقود رسمية يتم تسليمها فورياً تحفظ كامل حقوقك الاستثمارية." />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
