import React from 'react';
import { Logo } from './Header';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { EditableText } from './EditableText';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-neutral-900 text-neutral-400 py-16 text-right font-sans relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Logo & Description block (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-[#0F0F0F] border border-neutral-800 rounded-2xl p-3 inline-block">
              <Logo className="h-10" />
            </div>
            
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              <EditableText translationKey="footer_desc" defaultText="منصة شوجر بيزنس إي جي هي المنظومة والوجهة الاستثمارية الرائدة والأولى في مصر التي تهدف لتبسيط الاستثمار وتمكين الأفراد من تنمية مدخراتهم بحرية وأمان كامل بضمانات قانونية حقيقية." isMultiline />
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-neutral-900 p-3 rounded-xl border border-neutral-800 w-fit">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span>
                <EditableText translationKey="footer_guarantee_badge" defaultText="عقود موثقة قانونياً بالكامل" />
              </span>
            </div>
          </div>

          {/* Quick links block (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-widest border-r-2 border-indigo-500 pr-2.5">
              <EditableText translationKey="footer_links_title" defaultText="روابط سريعة" />
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-neutral-400">
              <li>
                <span 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                  className="hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                  role="button"
                  tabIndex={0}
                >
                  <EditableText translationKey="footer_link_home" defaultText="الصفحة الرئيسية" />
                </span>
              </li>
              <li>
                <span 
                  onClick={() => handleScrollTo('about')} 
                  className="hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                  role="button"
                  tabIndex={0}
                >
                  <EditableText translationKey="footer_link_about" defaultText="من نحن وقصتنا" />
                </span>
              </li>
              <li>
                <span 
                  onClick={() => handleScrollTo('features')} 
                  className="hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                  role="button"
                  tabIndex={0}
                >
                  <EditableText translationKey="footer_link_features" defaultText="لماذا نحن؟" />
                </span>
              </li>
              <li>
                <span 
                  onClick={() => handleScrollTo('packages')} 
                  className="hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                  role="button"
                  tabIndex={0}
                >
                  <EditableText translationKey="footer_link_packages" defaultText="باقات الاستثمار المتاحة" />
                </span>
              </li>
              <li>
                <span 
                  onClick={() => handleScrollTo('calculator')} 
                  className="hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                  role="button"
                  tabIndex={0}
                >
                  <EditableText translationKey="footer_link_calc" defaultText="حاسبة الأرباح التفاعلية" />
                </span>
              </li>
              <li>
                <span 
                  onClick={() => handleScrollTo('faq')} 
                  className="hover:text-indigo-400 transition-colors cursor-pointer inline-block"
                  role="button"
                  tabIndex={0}
                >
                  <EditableText translationKey="footer_link_faq" defaultText="الأسئلة والأجوبة الشائعة" />
                </span>
              </li>
            </ul>
          </div>

          {/* Contact details block (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-widest border-r-2 border-indigo-500 pr-2.5">
              <EditableText translationKey="footer_contact_title" defaultText="بيانات ووسائل اتصال" />
            </h3>
            <ul className="space-y-3.5 text-xs text-neutral-400 font-semibold">
              <li className="flex items-center gap-2.5 justify-start">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span dir="ltr" className="font-mono text-neutral-200 hover:text-indigo-400 transition-colors text-[13px] block">
                  <EditableText translationKey="footer_contact_phone" defaultText="+20 102 345 6789" />
                </span>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-neutral-205 text-neutral-240 hover:text-indigo-400 transition-colors text-slate-200">
                  <EditableText translationKey="footer_contact_email" defaultText="support@sugarbusiness-eg.com" />
                </span>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>
                  <EditableText translationKey="footer_contact_address" defaultText="برج التجارة الإداري، مصر الجديدة، القاهرة، جمهورية مصر العربية" isMultiline />
                </span>
              </li>
            </ul>
            
            {/* Regulatory Slogan */}
            <p className="text-[10px] text-neutral-500 leading-normal pt-2">
              <EditableText translationKey="footer_regulatory_slogan" defaultText="* جميع العمليات تخضع لأحكام قانون الاستثمار رقم 72 لسنة 2017 بجمهورية مصر العربية بموجب تنظيمات الشراكة الموثقة." isMultiline />
            </p>
          </div>

        </div>

        {/* Bottom Line & Legal Info */}
        <div className="mt-12 pt-8 border-t border-neutral-900 text-center space-y-4 font-sans">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold text-neutral-500">
            <a href="#about" className="hover:text-neutral-450 hover:text-neutral-400 transition-colors">
              <EditableText translationKey="footer_legal_terms" defaultText="الشروط والأحكام" />
            </a>
            <span className="text-neutral-800">•</span>
            <a href="#about" className="hover:text-neutral-450 hover:text-neutral-400 transition-colors">
              <EditableText translationKey="footer_legal_privacy" defaultText="سياسة الخصوصية وأمان البيانات" />
            </a>
            <span className="text-neutral-800">•</span>
            <a href="#about" className="hover:text-neutral-450 hover:text-neutral-400 transition-colors">
              <EditableText translationKey="footer_legal_aml" defaultText="قوانين حظر التهرب وتبييض الأموال" />
            </a>
          </div>

          <div className="text-xs text-neutral-500 flex items-center justify-center gap-1.5 font-bold flex-row-reverse flex-wrap">
            <span>
              <EditableText translationKey="footer_copyright" defaultText={`جميع الحقوق محفوظة لشركة شوجر بيزنس إي جي © ${currentYear}`} />
            </span>
            <span className="text-neutral-800">•</span>
            <span className="flex items-center gap-1 text-neutral-500 justify-center">
              <EditableText translationKey="footer_made_with_love" defaultText="صُنع بكل حب من أجل استثمار آمن" />
              <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse shrink-0" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
