import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, UserCheck, KeyRound, Sparkles, Check } from 'lucide-react';
import { Brand } from '../common';
import { useStore } from '../../context/StoreContext';

interface AuthPageProps {
  onSuccess: () => void;
  onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToHome }) => {
  const { login } = useStore();
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMsg({ type: 'error', text: 'يرجى إدخال البريد الإلكتروني.' });
      return;
    }

    if (tab === 'forgot') {
      setMsg({
        type: 'success',
        text: 'إذا كان البريد مسجلاً، تم إرسال تعليمات استعادة كلمة المرور إلى صندوق الوارد.',
      });
      return;
    }

    if (tab === 'signup') {
      if (!name.trim()) {
        setMsg({ type: 'error', text: 'يرجى إدخال اسمك الكريم.' });
        return;
      }
      login(email, 'staff', name);
      onSuccess();
      return;
    }

    // Login
    login(email);
    onSuccess();
  };

  const handleQuickDemo = (role: 'admin' | 'staff') => {
    if (role === 'admin') {
      login('mostfaalyamani@gmail.com', 'admin', 'مصطفى اليماني (مدير النظام)');
    } else {
      login('operator@trimode-ye.com', 'staff', 'طارق السقاف (مسؤول الشحنات)');
    }
    onSuccess();
  };

  return (
    <div className="auth-page min-h-screen bg-[#f6f4ef] grid grid-cols-1 lg:grid-cols-12">
      {/* Left Visual Area on Large Screens */}
      <div className="auth-visual hidden lg:flex lg:col-span-5 bg-[#102b3b] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#102b3b]/80 to-[#102b3b] z-0" />
        <img
          src="/hero-ports.png"
          alt="TriMode Port Logistics"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />

        <div className="relative z-10">
          <Brand light onClick={onBackToHome} />
          <div className="mt-16 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-white/10 px-3 py-1 rounded-full">
              <ShieldCheck size={14} />
              <span>دخول آمن لفريق تراي مود</span>
            </span>
            <h2 className="text-3xl font-bold leading-tight">
              ميناء وشحن بري وجوي.
              <br />
              كل رحلة.
              <br />
              <span className="text-amber-400">تبدأ بفريق.</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              مساحة عمل واحدة لإدارة شحناتك، متابعة عملائك، وتنظيم كل تفاصيل النقل البري والبحري والجوي في اليمن.
            </p>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-6 flex items-center justify-between text-xs text-slate-400">
          <span dir="ltr" className="font-manrope">
            TRIMODE TEAM PORTAL
          </span>
          <button
            onClick={onBackToHome}
            className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>العودة إلى الموقع</span>
            <ArrowLeft size={14} />
          </button>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="auth-form-area lg:col-span-7 flex flex-col justify-center p-6 sm:p-12 md:p-16 max-w-xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between">
          <div className="lg:hidden">
            <Brand onClick={onBackToHome} />
          </div>
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>العودة للرئيسية</span>
            <ArrowLeft size={14} />
          </button>
        </div>

        {/* Quick Demo Access banner */}
        <div className="mb-8 p-4 rounded-lg bg-amber-50 border border-amber-300/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
            <Sparkles size={16} className="text-amber-600" />
            <span>تسجيل دخول سريع للتجربة (بدون كلمة مرور):</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="flex-1 min-w-[140px] bg-[#102b3b] hover:bg-[#183343] text-white py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck size={14} className="text-amber-400" />
              <span>دخول كمدير النظام (Admin)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('staff')}
              className="flex-1 min-w-[140px] bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck size={14} className="text-amber-600" />
              <span>دخول كموظف شحنات (Staff)</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-7 sm:p-9 rounded-xl border border-[#e6eaeb] shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-[#e6eaeb] mb-6">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setMsg(null);
              }}
              className={`pb-3 text-sm font-semibold relative cursor-pointer ml-6 ${
                tab === 'login' ? 'text-[#102b3b]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              تسجيل الدخول
              {tab === 'login' && (
                <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setMsg(null);
              }}
              className={`pb-3 text-sm font-semibold relative cursor-pointer ml-6 ${
                tab === 'signup' ? 'text-[#102b3b]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              إنشاء حساب موظف
              {tab === 'signup' && (
                <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('forgot');
                setMsg(null);
              }}
              className={`pb-3 text-sm font-semibold relative cursor-pointer ${
                tab === 'forgot' ? 'text-[#102b3b]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              نسيت كلمة المرور؟
              {tab === 'forgot' && (
                <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#102b3b] mb-1">
              {tab === 'login' && 'أهلاً بعودتك'}
              {tab === 'signup' && 'إنشاء حساب الموظف'}
              {tab === 'forgot' && 'تعيين كلمة المرور'}
            </h1>
            <p className="text-xs text-slate-500">
              {tab === 'login' && 'سجل الدخول لمتابعة الشحنات وطلبات الأسعار.'}
              {tab === 'signup' && 'أنشئ حسابك للوصول إلى لوحة الشحنات والمتابعة.'}
              {tab === 'forgot' && 'أدخل بريدك لتصلك تعليمات استعادة الحساب.'}
            </p>
          </div>

          {msg && (
            <div
              className={`p-3.5 rounded text-xs mb-6 ${
                msg.type === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              }`}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: صالح اليافعي"
                  required
                  className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2.5 text-xs sm:text-sm outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@trimode-ye.com"
                required
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2.5 text-xs sm:text-sm font-manrope outline-none"
              />
            </div>

            {tab !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required={tab === 'login'}
                  className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2.5 text-xs sm:text-sm outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full button bg-[#db8c42] hover:bg-[#b96b25] text-slate-900 font-bold py-3 rounded text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              {tab === 'login' && 'تسجيل الدخول'}
              {tab === 'signup' && 'إنشاء الحساب'}
              {tab === 'forgot' && 'إرسال رابط الاستعادة'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
