import React, { useState } from 'react';
import { X, Phone, Lock, User as UserIcon, Shield, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { User } from '../types';
import { useCMS } from '../CMSContext';
import { getApiUrl } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onAuthSuccess, 
  initialMode = 'login' 
}) => {
  const { settings, submitPasswordReset } = useCMS();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  
  // Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regIdentificationCode, setRegIdentificationCode] = useState('');

  // Forgot Password fields
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotName, setForgotName] = useState('');
  const [forgotNationalId, setForgotNationalId] = useState('');

  // Password visibility triggers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status and response handling
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Local signup action
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    if (!regName.trim() || regName.trim().length < 3) {
      setErrorMsg('فضلاً، يرجى إدخال اسم ثلاثي صحيح لا يقل عن 3 أحرف.');
      return;
    }

    if (!regPhone.trim() || regPhone.trim().length < 10) {
      setErrorMsg('فضلاً، يرجى إدخال رقم هاتف محمول صحيح (مثال: 010xxxxxxxx).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('يجب أن تكون كلمة المرور مكونة من 6 خانات أو أكثر لحماية حسابك.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('خطأ: كلمتا المرور غير متطابقتين. يرجى تجربة الكتابة مرة أخرى.');
      return;
    }

    if (!/^\d{14}$/.test(regNationalId)) {
      setErrorMsg('خطأ: الرقم القومي المصري يجب أن يتكون من 14 رقماً صحيحاً تماماً.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/users/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: regPhone.trim(),
          name: regName.trim(),
          nationalId: regNationalId.trim(),
          password: regPassword,
          identificationCode: regIdentificationCode.trim()
        })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        if (data.pending) {
          setSuccessMsg(data.message);
          setErrorMsg((
            <div className="flex flex-col gap-2 p-2 bg-[#0E0E0E] rounded-xl border border-neutral-800 text-[11px]">
              <span className="text-yellow-400 font-bold">⚠️ الحساب قيد التدقيق الإداري حالياً:</span>
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-lg text-white mb-1">
                <span className="block text-indigo-400 font-black mb-1">كود الدخول الموحد الخاص بك:</span>
                <span className="text-sm font-mono tracking-widest">{data.user.identificationCode}</span>
              </div>
              <span>يمكنك استخدام هذا الكود أو رقم هاتفك للدخول فور اعتماد الحساب.</span>
              <a 
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`أهلاً إدارة شوجر بيزنس، يرجى تفعيل حسابي المعتمد بالرقم القومي للمسجل: ${regName} وهاتف: ${regPhone} وكود: ${data.user.identificationCode}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline inline-flex items-center justify-center gap-1.5 text-emerald-400 font-extrabold hover:text-emerald-300 transition-colors mt-1 py-1 px-3 bg-emerald-500/10 rounded border border-emerald-500/20"
              >
                تواصل مباشر عبر الواتساب للتفعيل فورا
              </a>
            </div>
          ) as any);
        } else {
          // Automatic login for master seed admin
          localStorage.setItem('sugar_current_user', JSON.stringify(data.user));
          setSuccessMsg('تم تعيينك مديراً للنظام! جاري تسجيل الدخول فورا...');
          setTimeout(() => {
            onAuthSuccess(data.user);
            onClose();
          }, 1500);
        }
      } else {
        setErrorMsg(data.message || 'فشلت عملية إنشاء الحساب، يرجى التثبت من صحة البيانات.');
      }
    } catch (err) {
      setErrorMsg('حدث خطأ فني أثناء الاتصال بالخادم. يرجى إعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotPhone.trim() || !forgotName.trim() || forgotNationalId.length !== 14) {
      setErrorMsg('يرجى التأكد من ملء جميع البيانات بشكل صحيح (الهاتف، الاسم، والرقم القومي 14 رقماً).');
      return;
    }

    setLoading(true);
    const success = await submitPasswordReset({
      phone: forgotPhone.trim(),
      name: forgotName.trim(),
      nationalId: forgotNationalId.trim()
    });

    if (success) {
      setSuccessMsg('تم إرسال طلبك للإدارة بنجاح. يرجى انتظار المراجعة والموافقة لتتمكن من تعيين كلمة مرور جديدة.');
      setForgotPhone('');
      setForgotName('');
      setForgotNationalId('');
      setTimeout(() => setMode('login'), 3000);
    } else {
      setErrorMsg('فشل إرسال الطلب. يرجى التأكد من صحة البيانات المسجلة مسبقاً.');
    }
    setLoading(false);
  };

  // Local login action
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginPhone.trim() || !loginPassword) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة للمتابعة.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: loginPhone.trim(),
          password: loginPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('sugar_current_user', JSON.stringify(data.user));
        setSuccessMsg('تم تسجيل الدخول بنجاح! أهلاً بك في حسابك الموثق.');
        setTimeout(() => {
          onAuthSuccess(data.user);
          onClose();
          setLoginPhone('');
          setLoginPassword('');
        }, 1200);
      } else if (data.pending) {
        setErrorMsg((
          <div className="flex flex-col gap-2 p-2 bg-[#0E0E0E] rounded-xl border border-neutral-800 text-[11px]">
            <span className="text-yellow-400 font-bold">⚠️ عذراً يا شريكنا الكريم؛ حسابك قيد التدقيق الإداري حالياً ولم يتم اعتماده بعد:</span>
            <span>يرجى التواصل مع مسؤول القطاع لتفعيل حسابك بالرقم القومي لمشاهدة إحصائيات وعقود المحافظات.</span>
            <a 
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`أهلاً إدارة شوجر بيزنس، قمت بإنشاء حساب بالرقم: ${loginPhone} وهي قيد المراجعة؛ أرجو اعتمادها وتحديد المحافظات المصرحة لي بمصر.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline inline-flex items-center justify-center gap-1.5 text-emerald-400 font-extrabold hover:text-emerald-300 transition-colors mt-1 py-1 px-3 bg-emerald-500/10 rounded border border-emerald-500/20"
            >
              تواصل مباشرة بالمدير الإداري لاعتماد الحساب فورا
            </a>
          </div>
        ) as any);
      } else {
        setErrorMsg(data.message || 'بيانات الدخول غير صحيحة. يرجى إعادة المحاولة.');
      }
    } catch (err) {
      setErrorMsg('حدث خطأ فني أثناء الاتصال بالخادم الرئيسي لإجراء فحص الأمان.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="authentication-backdrop"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
    >
      {/* Dark blur overlay */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        onClick={() => { if (!loading) onClose(); }}
      />

      {/* Auth Card Content */}
      <div 
        className="bg-[#0A0A0A] border border-neutral-800 rounded-3xl max-w-md w-full overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.2)] relative z-10 transform scale-100 transition-all flex flex-col text-right animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header background flare gradient */}
        <div className="absolute top-0 right-0 left-0 h-40 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

        <div className="p-6 sm:p-8 space-y-6 relative">
          
          {/* Top section: Close and Title */}
          <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
            <h3 className="text-xl font-black text-white">
              {mode === 'login' ? '🔑 تسجيل الدخول بالمنصة' : mode === 'register' ? '✨ إنشاء حساب ذكي جديد' : '🔄 استعادة كلمة المرور'}
            </h3>
            <button 
              type="button"
              disabled={loading}
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-all cursor-pointer disabled:opacity-50"
              aria-label="إغلاق خيارات الدخول"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick instructions / Info message */}
          <div className="text-xs text-neutral-400 bg-[#0E0E0E] border border-neutral-850 p-3 rounded-xl flex items-start gap-2">
            <Shield className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              جميع تعاملاتك ومشاهدات المحفظة والخصومات محاطة بميثاق الجودة التشغيلية المعتمد لعام 2026 وحفظ السرية وفقاً للنظام المصري.
            </p>
          </div>

          {/* Toast style dynamic alert blocks */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-start gap-2.5 animate-pulse text-right">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-start gap-2.5 text-right">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Main Auth Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-neutral-900 rounded-2xl border border-neutral-850 text-center">
              <button 
                type="button"
                onClick={() => { setErrorMsg(''); setSuccessMsg(''); setMode('login'); }}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  mode === 'login' 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950/40'
                }`}
              >
                تسجيل الدخول
              </button>
              <button 
                type="button"
                onClick={() => { setErrorMsg(''); setSuccessMsg(''); setMode('register'); }}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  mode === 'register' 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950/40'
                }`}
              >
                إنشاء حساب جديد
              </button>
            </div>
          )}

          {/* Authentication forms wrapper */}
          {mode === 'login' ? (
            /* --- LOGIN FORM --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
              
              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-300 block">رقم الهاتف المحمول أو الكود الموحد</label>
                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-neutral-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: 010xxxxxxxx أو SUGAR-XXXXXX"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs text-right pr-10 pl-4 py-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white outline-none font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-neutral-300 block">كلمة المرور الحالية</label>
                  <span className="text-[10px] text-neutral-500">من 6 خانات أو أكثر</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs pr-10 pl-11 py-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white text-left outline-none font-medium transition-all"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 text-neutral-500 hover:text-neutral-300 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-start">
                  <button 
                    type="button"
                    onClick={() => { setErrorMsg(''); setSuccessMsg(''); setMode('forgot'); }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
              </div>

              {/* Master Test Credentials Hint Removed */}


              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black shadow-lg shadow-indigo-500/10 hover:opacity-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>جاري تفعيل الاتصال الآمن...</span>
                  </>
                ) : (
                  <span>تسجيل الدخول الآمن الآن</span>
                )}
              </button>
            </form>
          ) : mode === 'register' ? (
            /* --- CREATE ACCOUNT / REGISTER FORM --- */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-right">
              
              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-300 block">الاسم بالكامل (ثلاثي كما بالبطاقة)</label>
                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-neutral-500">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input 
                    type="text"
                    required
                    placeholder="الاسم ثلاثي أو رباعي"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs text-right pr-10 pl-4 py-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white outline-none font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-300 block">رقم الهاتف المحمول</label>
                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-neutral-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input 
                    type="tel"
                    required
                    placeholder="رقم الهاتف (الواتساب المعتمد)"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs text-right pr-10 pl-4 py-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white outline-none font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-300 block">الرقم القومي (١٤ خانة بالكامل)</label>
                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-neutral-500">
                    <Shield className="w-4 h-4 text-indigo-400" />
                  </span>
                  <input 
                    type="text"
                    required
                    maxLength={14}
                    placeholder="14 رقماً مصرياً صحيحاً"
                    value={regNationalId}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // keep numbers only
                      if (val.length <= 14) setRegNationalId(val);
                    }}
                    disabled={loading}
                    className="w-full text-xs text-right pr-10 pl-4 py-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white outline-none font-medium font-mono transition-all"
                  />
                </div>
                <p className="text-[10px] text-neutral-500">سيتم استخدام أرقام البطاقة لمطابقة ملكية وثيقة واستحقاقات الأرباح.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-300 block">الكود التعريفي (اختياري)</label>
                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-neutral-500">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </span>
                  <input 
                    type="text"
                    placeholder="مثال: SUGAR-123456"
                    value={regIdentificationCode}
                    onChange={(e) => setRegIdentificationCode(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs text-right pr-10 pl-4 py-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white outline-none font-medium transition-all"
                  />
                </div>
                <p className="text-[10px] text-neutral-500">إذا كان لديك كود موحد من الإدارة، ضعه هنا. وإلا سيتم توليد كود تلقائي لك.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-neutral-300 block">كلمة المرور</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      disabled={loading}
                      className="w-full text-xs p-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white text-left outline-none font-medium transition-all"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 text-neutral-500 hover:text-neutral-300 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-neutral-300 block">تأكيد كلمة المرور</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="w-full text-xs p-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white text-left outline-none font-medium transition-all"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 text-neutral-500 hover:text-neutral-300 p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black shadow-lg shadow-indigo-500/10 hover:opacity-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>جاري معالجة البيانات وتوثيق الهوية...</span>
                  </>
                ) : (
                  <span>توثيق وإنشاء حسابي المالي</span>
                )}
              </button>
            </form>
          ) : (
            /* --- FORGOT PASSWORD FORM --- */
            <form onSubmit={handleForgotSubmit} className="space-y-4 text-right">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-300 block">رقم الهاتف المسجل</label>
                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-neutral-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input 
                    type="tel"
                    required
                    placeholder="رقم الهاتف"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs text-right pr-10 pl-4 py-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white outline-none font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-300 block">الاسم الكامل (كما بالبطاقة)</label>
                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-neutral-500">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input 
                    type="text"
                    required
                    placeholder="الاسم الثلاثي"
                    value={forgotName}
                    onChange={(e) => setForgotName(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs text-right pr-10 pl-4 py-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white outline-none font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-300 block">الرقم القومي (١٤ خانة)</label>
                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-neutral-500">
                    <Shield className="w-4 h-4 text-indigo-400" />
                  </span>
                  <input 
                    type="text"
                    required
                    maxLength={14}
                    placeholder="الرقم القومي الصحيح"
                    value={forgotNationalId}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); 
                      if (val.length <= 14) setForgotNationalId(val);
                    }}
                    disabled={loading}
                    className="w-full text-xs text-right pr-10 pl-4 py-3 bg-neutral-950/75 border border-neutral-800 rounded-xl focus:border-indigo-500 text-white outline-none font-medium font-mono transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black shadow-lg shadow-indigo-500/10 hover:opacity-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>جاري المعالجة...</span>
                    </>
                  ) : (
                    <span>إرسال طلب الاستعادة</span>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {/* Quick Notice footer */}
          <div className="text-center pt-2 border-t border-neutral-850">
            <p className="text-[10px] text-neutral-550 font-medium">
              بمتابعتك فأنت توافق تلقائياً على شروط الاستخدام ولوائح ميثاق التعويض شوجر إي جي.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
