import React, { useState, useEffect } from 'react';
import { Phone, User, Wallet, ShieldCheck, Sparkles, Send, CheckCircle2, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { EditableText } from './EditableText';
import { FeedbackModal } from './FeedbackModal';
import { useCMS } from '../CMSContext';

interface ContactFormProps {
  preFilledAmount?: number;
}

export const ContactForm: React.FC<ContactFormProps> = ({ preFilledAmount }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: 'استشارة خدمات تجارية وشراكة',
    budget: preFilledAmount ? preFilledAmount.toString() : '20000',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Feedback State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { submitFeedback } = useCMS();

  // Sync props if changed
  useEffect(() => {
    if (preFilledAmount) {
      setFormData(prev => ({
        ...prev,
        budget: preFilledAmount.toString()
      }));
    }
  }, [preFilledAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validation
    if (!formData.name.trim()) {
      setErrorMessage('من فضلك أدخل الاسم بالكامل لتسجيل الاستشارة.');
      return;
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('من فضلك أدخل رقم هاتف مصري صحيح ومكون من 11 رقماً.');
      return;
    }

    setIsLoading(true);

    // Simulate sending data to lead management CRM
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Trigger feedback modal after a short delay
      setTimeout(() => setIsFeedbackOpen(true), 2500);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      interest: 'استشارة خدمات تجارية وشراكة',
      budget: '20000',
      notes: ''
    });
    setIsSuccess(false);
  };

  return (
    <section id="contact" className="py-20 bg-[#0A0A0A] relative border-t border-neutral-900">
      <div className="absolute top-20 left-10 w-48 h-48 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-tr from-[#0F0F0F] via-[#0A0A0A] to-[#050505] rounded-3xl border border-neutral-800 p-8 sm:p-12 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Right Column: Information & Guarantee Slogan */}
            <div className="lg:col-span-12 lg:col-span-5 text-right space-y-6">
              <span className="text-xs font-bold bg-neutral-900 text-indigo-400 px-3 py-1.5 rounded-full border border-neutral-800">
                <EditableText translationKey="contact_badge" defaultText="طلب الحجز والاستشارة متوفر مجاناً بالكامل" />
              </span>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                <EditableText translationKey="contact_title" defaultText="ابدأ رحلتك الاستثمارية الناجحة اليوم" />
              </h2>

              <p className="text-neutral-450 text-neutral-400 text-xs sm:text-sm leading-relaxed">
                <EditableText translationKey="contact_desc" defaultText="سجّل بياناتك في النموذج وسيقوم مستشار مالي معتمد من فريق شوجر بيزنس إي جي بالاتصال بك فوراً لتأكيد باقتك وشرح الشروط الميكانيكية وصياغة عقدك القانوني الموثق لحفظ رأس مالك كامل الأركان." isMultiline />
              </p>

              {/* Guarantees Box */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3 bg-[#0A0A0A] p-4.5 rounded-2xl border border-neutral-850 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-450 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-200">
                      <EditableText translationKey="contact_g1_title" defaultText="عقود رسمية ومحمية قانونياً" />
                    </h4>
                    <p className="text-[11px] text-neutral-450 text-neutral-400">
                      <EditableText translationKey="contact_g1_desc" defaultText="نحرص على صياغة وتوثيق كافة العقود قانونياً لضمان سلامة استثمار ورأس مال العميل." isMultiline />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#0A0A0A] p-4.5 rounded-2xl border border-neutral-850 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-indigo-450 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-200">
                      <EditableText translationKey="contact_g2_title" defaultText="مكالمة استشارية مجانية 100%" />
                    </h4>
                    <p className="text-[11px] text-neutral-450 text-neutral-400">
                      <EditableText translationKey="contact_g2_desc" defaultText="مستشارنا يجيب على جميع أسئلتك بوضوح ويرشدك نحو اختيار خطط الأرباح الملائمة لميزانيتك." isMultiline />
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Left Column: Form Element */}
            <div className="lg:col-span-12 lg:col-span-7">
              <div className="bg-[#0A0A0A] rounded-2xl border border-neutral-850 shadow-md p-6 sm:p-8">
                
                {isSuccess ? (
                  /* Success Screen */
                  <div className="text-center py-10 space-y-6">
                    <div className="w-16 h-16 bg-neutral-900 text-emerald-400 border border-neutral-800 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white">
                        <EditableText translationKey="contact_success_title" defaultText="تم تسجيل طلب استشارتك بنجاح!" />
                      </h3>
                      <p className="text-sm text-neutral-450 text-neutral-400 max-w-md mx-auto">
                        <EditableText translationKey="contact_success_desc" defaultText="سعداء بثقتك الغالية. سيقوم مستشارنا المخصص بالتواصل معك هاتفياً أو عبر تطبيق واتساب خلال الـ 15 دقيقة القادمة للإجابة وإتمام العقد." isMultiline />
                      </p>
                    </div>

                    {/* Pre-fill Summary details of success call */}
                    <div className="bg-[#0F0F0F] p-4 rounded-xl border border-dotted border-neutral-800 text-xs text-neutral-400 max-w-xs mx-auto space-y-1 text-right font-mono">
                      <p>● <span className="font-bold text-white">الاسم:</span> {formData.name}</p>
                      <p>● <span className="font-bold text-white">الهاتف:</span> {formData.phone}</p>
                      <p>● <span className="font-bold text-white">موضوع الاستفسار:</span> {formData.interest}</p>
                      <p>● <span className="font-bold text-white">ميزانية استثمارك:</span> {parseInt(formData.budget).toLocaleString()} ج.م</p>
                    </div>

                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 border border-neutral-800 px-4 py-2.5 rounded-xl hover:bg-neutral-900 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <EditableText translationKey="contact_success_reset" defaultText="تسجيل طلب استشارة جديدة" />
                    </button>
                  </div>
                ) : (
                  /* Dynamic Contact Form */
                  <form onSubmit={handleSubmit} className="space-y-5 text-right">
                    
                    {/* Error Banner */}
                    {errorMessage && (
                      <div className="bg-red-950/40 text-red-400 p-4 rounded-xl text-xs font-bold border border-red-900/45 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Name input */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-bold text-neutral-200 block">
                        <EditableText translationKey="contact_label_name" defaultText="الاسم الثلاثي أو الثنائي:" />
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-[#0F0F0F] border border-neutral-800 p-3.5 rounded-xl text-right text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-neutral-900 transition-all text-white font-semibold"
                          placeholder="مثال: أحمد محمد علي"
                          maxLength={60}
                        />
                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500">
                          <User className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Phone input */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-bold text-neutral-200 block">
                        <EditableText translationKey="contact_label_phone" defaultText="رقم هاتف الاتصال والواتساب:" />
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-[#0F0F0F] border border-neutral-800 p-3.5 rounded-xl text-left font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-neutral-900 transition-all text-white font-semibold"
                          placeholder="01xxxxxxxxx"
                        />
                        <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs text-neutral-500 pointer-events-none">
                          <EditableText translationKey="contact_label_phone_tag" defaultText="الهاتف:" />
                        </span>
                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500">
                          <Phone className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Side-by-side Selectors: Interest and Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Interest Select */}
                      <div className="space-y-1.5">
                        <label className="text-xs sm:text-sm font-bold text-neutral-200 block">
                          <EditableText translationKey="contact_label_interest" defaultText="موضوع الاهتمام الرئيسي:" />
                        </label>
                        <select
                          name="interest"
                          value={formData.interest}
                          onChange={handleInputChange}
                          className="w-full bg-[#0F0F0F] border border-neutral-800 p-3 rounded-xl text-right text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-neutral-900 transition-all font-semibold text-neutral-300 pointer-events-auto"
                        >
                          <option value="استشارة خدمات تجارية وشراكة" className="bg-neutral-950 text-neutral-300">استشارة خدمات تجارية وشراكة</option>
                          <option value="طلب شراكة للرعاية الطبية والخصومات" className="bg-neutral-950 text-neutral-300">طلب شراكة للرعاية الطبية والخصومات</option>
                          <option value="طلب إصدار كروت شوجر الذاتية" className="bg-neutral-950 text-neutral-300">طلب إصدار كروت شوجر الذاتية</option>
                          <option value="استفسارات عامة ومقترحات" className="bg-neutral-950 text-neutral-300">استفسارات عامة ومقترحات</option>
                        </select>
                      </div>

                      {/* Budget Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs sm:text-sm font-bold text-neutral-200 block">
                          <EditableText translationKey="contact_label_budget" defaultText="رأس المال المبدئي (ج.م):" />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full bg-[#0F0F0F] border border-neutral-800 p-3 rounded-xl text-right font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-neutral-900 transition-all text-white font-bold"
                            placeholder="20,000"
                          />
                          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500">
                            <Wallet className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Extra Notes */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-bold text-neutral-200 block">
                        <EditableText translationKey="contact_label_notes" defaultText="أسئلة أو ملاحظات إضافية (اختياري):" />
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full bg-[#0F0F0F] border border-neutral-800 p-3 rounded-xl text-right text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-neutral-900 transition-all text-white font-semibold"
                        placeholder="ما هي الأسئلة التي تود من مستشارك المالي الإجابة عليها؟"
                      />
                    </div>

                    {/* Submit Button */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => !isLoading && handleSubmit({ preventDefault: () => {} } as any)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          !isLoading && handleSubmit({ preventDefault: () => {} } as any);
                        }
                      }}
                      className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-[15px] p-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-4.5 w-4.5 border-b-2 border-white"></span>
                          <span>جاري تسجيل بيانات استشارتك الآمنة...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 rotate-180" />
                          <span>
                            <EditableText translationKey="contact_btn_submit" defaultText="احجز استشارتك المجانية واتصل بي" />
                          </span>
                        </>
                      )}
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>

      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={(rating, comment) => submitFeedback(rating, comment, 'Lead Inquiry Form')}
      />
    </section>
  );
};
