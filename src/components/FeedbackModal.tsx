import React, { useState } from 'react';
import { Star, X, CheckCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  advisorName?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, advisorName = "مستشار شوجر بيزنس" }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    await onSubmit(rating, comment);
    setIsSubmitting(false);
    setIsDone(true);
    
    setTimeout(() => {
      onClose();
      setIsDone(false);
      setRating(0);
      setComment('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl"
            dir="rtl"
          >
            {!isDone ? (
              <form onSubmit={handleSubmit} className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20 text-amber-500">
                    <Star className="w-8 h-8 fill-current" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">تقييم تجربة الاستشارة</h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    نشكرك على تواصلك مع <span className="text-amber-500">{advisorName}</span>. كيف تصف تجربتك؟
                  </p>
                </div>

                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="p-1 transition-transform active:scale-90"
                    >
                      <Star 
                        className={`w-10 h-10 transition-all ${
                          star <= (hover || rating) 
                            ? 'fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-4 mb-8">
                  <label className="text-[10px] font-black text-neutral-500 block">هل لديك أي ملاحظات إضافية؟ (اختياري)</label>
                  <div className="relative">
                    <MessageSquare className="absolute top-3 right-3 w-4 h-4 text-neutral-600" />
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="اكتب رسالتك لمدير الجودة هنا..."
                      className="w-full p-3 pr-10 rounded-2xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-amber-500 min-h-[100px] resize-none focus:outline-none placeholder-neutral-700"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-2xl text-[11px] font-black text-neutral-400 bg-neutral-800 hover:bg-neutral-700 transition-all"
                  >
                    لاحقاً
                  </button>
                  <button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className="flex-[2] py-3.5 rounded-2xl text-[11px] font-black text-neutral-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:shadow-none"
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 text-emerald-500">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">شكراً لمشاركتك!</h3>
                <p className="text-xs text-neutral-500 font-bold leading-relaxed">
                  تم استلام تقييمك بنجاح. تساعدنا رأيك في تقديم خدمة استشارية أفضل لجميع عملائنا.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
