import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { EditableText } from './EditableText';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // First open by default

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#0F0F0F] relative border-t border-neutral-900">
      <div className="absolute bottom-5 left-5 w-48 h-48 bg-indigo-900/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-400 mx-auto shadow-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white block">
            <EditableText translationKey="faq_title" defaultText="الأسئلة الشائعة والأجوبة التفصيلية" />
          </h2>
          <div className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            <EditableText translationKey="faq_desc" defaultText="جمعنا لكم أهم الاستفسارات الشائعة حول الباقات الاستثمارية وعمليات التعاقد الموثقة والضمانات البنكية." isMultiline />
          </div>
        </div>

        {/* FAQ List Accordions */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            
            return (
              <div 
                key={idx}
                id={`faq-item-${idx}`}
                className="bg-[#0A0A0A] rounded-2xl border border-neutral-800 shadow-xl overflow-hidden transition-all duration-350"
              >
                {/* Trigger Button */}
                <div
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-right p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-white hover:bg-[#0F0F0F] hover:bg-opacity-80 transition-colors focus:outline-none cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  <span className="text-sm sm:text-base leading-snug">
                    <EditableText translationKey={`faq_question_${idx}`} defaultText={item.question} />
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : ''
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>

                {/* Answer Content */}
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-[500px] border-t border-neutral-850' : 'max-h-0'
                  }`}
                >
                  <div className="p-5 sm:p-6 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-900/20 text-right">
                    <EditableText translationKey={`faq_answer_${idx}`} defaultText={item.answer} isMultiline />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Dynamic bottom CTA of FAQ */}
        <div className="mt-12 text-center p-6 bg-[#0A0A0A] rounded-2xl border border-neutral-800 shadow-xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white block">
                <EditableText translationKey="faq_cta_title" defaultText="هل تملك استفساراً خاصاً لم نوضحه؟" />
              </h4>
              <div className="text-[11px] text-neutral-400 block mt-0.5">
                <EditableText translationKey="faq_cta_desc" defaultText="مستشارنا المالي مستعد لشرح الإجراءات بالكامل مجاناً." />
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-colors cursor-pointer text-center"
            role="button"
            tabIndex={0}
          >
            <EditableText translationKey="faq_cta_btn" defaultText="تحدث مع مستشار مالي الآن" />
          </div>
        </div>

      </div>
    </section>
  );
};
