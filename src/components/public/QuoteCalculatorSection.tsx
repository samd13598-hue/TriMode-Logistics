import React, { useState } from 'react';
import { Calculator, CheckCircle2, ArrowLeft, Globe, Loader2, Sparkles, MessageCircle, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { TransportMode, QuoteRequest } from '../../types';
import { ModeIcon, MODE_LABELS, MODE_UNITS, formatUSD, CopyButton } from '../common';

export const QuoteCalculatorSection: React.FC<{ initialMode?: TransportMode }> = ({ initialMode = 'sea' }) => {
  const { rates, addQuote } = useStore();
  const [mode, setMode] = useState<TransportMode>(initialMode);
  const [quantity, setQuantity] = useState<string>('1');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('صنعاء، اليمن');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);
  const [error, setError] = useState('');

  // Live estimate calculation
  const currentRate = rates.find((r) => r.mode === mode)?.price ?? null;
  const numQty = parseFloat(quantity) || 0;
  const estimatedTotal = currentRate && numQty > 0 ? numQty * currentRate : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot detection

    if (!name.trim() || !phone.trim() || !origin.trim() || !destination.trim() || numQty <= 0) {
      setError('يرجى ملء جميع الحقول المطلوبة والتأكد من صحة الكمية.');
      return;
    }

    setSubmitting(true);
    setError('');

    setTimeout(() => {
      try {
        const created = addQuote({
          mode,
          origin: origin.trim(),
          destination: destination.trim(),
          quantity: numQty,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          notes: notes.trim() || undefined,
          estimatedAmount: estimatedTotal,
        });
        setSubmittedQuote(created);
      } catch (err: any) {
        setError(err.message || 'تعذر إرسال الطلب، يرجى المحاولة مرة أخرى.');
      } finally {
        setSubmitting(false);
      }
    }, 400);
  };

  const handleReset = () => {
    setSubmittedQuote(null);
    setQuantity('1');
    setOrigin('');
    setDestination('صنعاء، اليمن');
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setError('');
  };

  return (
    <section id="quote" className="quote-section section-anchor py-20 bg-[#f6f4ef]">
      <div className="container quote-layout grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="section-intro lg:col-span-5">
          <span className="eyebrow text-amber-700 text-xs font-semibold tracking-wider block mb-2">
            خطوتك الأولى تبدأ هنا
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#102b3b] leading-tight mb-4">
            خطّط لشحنتك.
            <br />
            <span className="text-amber-600">نرتّب لك الباقي.</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            اختر طريقة الشحن وأخبرنا عن بضاعتك. يصل طلبك مباشرة إلى فريقنا لمراجعة التفاصيل وتأكيد السعر.
          </p>

          <ul className="check-list space-y-3.5 mb-8">
            <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
              <CheckCircle2 size={18} className="text-amber-600 shrink-0" />
              <span>عرض يناسب نوع الشحنة ووجهتها</span>
            </li>
            <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
              <CheckCircle2 size={18} className="text-amber-600 shrink-0" />
              <span>متابعة من المصدر حتى التسليم</span>
            </li>
            <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
              <CheckCircle2 size={18} className="text-amber-600 shrink-0" />
              <span>توضيح التكاليف قبل تأكيد الشحن</span>
            </li>
          </ul>

          <div className="quote-callout bg-white p-5 rounded-lg border border-[#e6eaeb] flex items-center gap-4">
            <span className="w-12 h-12 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Globe size={28} />
            </span>
            <div className="text-xs sm:text-sm text-slate-600">
              <span>من المصانع والموردين حول العالم</span>
              <strong className="block text-slate-900 font-bold mt-0.5">
                إلى باب مخزنك في اليمن
              </strong>
            </div>
          </div>
        </div>

        <div className="quote-card lg:col-span-7 bg-white rounded-lg p-6 sm:p-8 border border-[#e6eaeb] shadow-sm">
          <div className="card-top flex items-center gap-3.5 mb-6 pb-4 border-b border-[#e6eaeb]">
            <span className="mini-icon w-11 h-11 rounded bg-[#102b3b] text-amber-400 flex items-center justify-center shrink-0">
              <Calculator size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#102b3b]">حاسبة الشحن وطلب عرض السعر</h3>
              <p dir="ltr" className="font-manrope text-[10px] text-slate-400 font-bold tracking-wider">
                LET'S MOVE YOUR BUSINESS
              </p>
            </div>
          </div>

          {submittedQuote ? (
            <div className="quote-success text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">وصلنا طلبك بنجاح</h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6">
                احتفظ برقم الطلب. يتواصل فريقنا معك على الرقم الذي أدخلته لمراجعة تفاصيل الشحنة وتثبيت الأسعار.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-sm mx-auto mb-6 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">رقم الطلب المرجعي:</span>
                <div className="flex items-center gap-2">
                  <strong dir="ltr" className="font-manrope text-base text-amber-800 font-extrabold">
                    {submittedQuote.reference}
                  </strong>
                  <CopyButton value={submittedQuote.reference} />
                </div>
              </div>

              {submittedQuote.estimatedAmount && (
                <div className="mb-6 text-sm text-slate-700">
                  <span>التقدير الأولي التقريبي: </span>
                  <strong className="text-amber-700 font-bold font-manrope text-base">
                    {formatUSD(submittedQuote.estimatedAmount)}
                  </strong>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <a
                  href={`https://wa.me/967780888887?text=${encodeURIComponent(
                    `مرحباً تراي مود، أود تأكيد ومتابعة طلب عرض السعر رقم: ${submittedQuote.reference} (${submittedQuote.origin} إلى ${submittedQuote.destination})`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2.5 rounded text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-transform hover:scale-105"
                >
                  <MessageCircle size={16} />
                  <span>تأكيد فوري عبر واتساب 780888887</span>
                </a>

                <a
                  href="tel:780888887"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded text-xs font-bold inline-flex items-center gap-1.5 font-manrope transition-colors"
                >
                  <Phone size={14} className="text-amber-600" />
                  <span>اتصال: 780888887</span>
                </a>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="button bg-[#102b3b] hover:bg-[#183343] text-white px-6 py-2 rounded text-xs font-semibold cursor-pointer"
                >
                  إرسال طلب آخر
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Mode Switcher */}
              <div className="mode-picker grid grid-cols-3 gap-2 p-1.5 bg-[#f6f4ef] rounded-md mb-6">
                {(['sea', 'air', 'land'] as TransportMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      mode === m
                        ? 'bg-white text-[#102b3b] shadow-xs border border-amber-300'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ModeIcon mode={m} size={18} className={mode === m ? 'text-amber-600' : 'text-slate-400'} />
                    <span>الشحن {MODE_LABELS[m]}</span>
                  </button>
                ))}
              </div>

              {/* Form Grid */}
              <div className="form-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    بلد / مدينة المصدر <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="مثال: شنغهاي، الصين / دبي، الإمارات"
                    minLength={2}
                    maxLength={200}
                    required
                    className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2 text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    الوجهة في اليمن <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="مثال: صنعاء، اليمن / عدن / الحديدة"
                    minLength={2}
                    maxLength={200}
                    required
                    className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2 text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    الكمية ({MODE_UNITS[mode]}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    min="0.01"
                    max="1000000"
                    step="0.01"
                    dir="ltr"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2 text-xs sm:text-sm font-manrope font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    الاسم / الشركة <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسمك الكريم أو اسم المؤسسة"
                    autoComplete="name"
                    minLength={2}
                    maxLength={200}
                    required
                    className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2 text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    رقم الجوال (واتساب) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    minLength={6}
                    maxLength={40}
                    placeholder="+967 7…"
                    required
                    className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2 text-xs sm:text-sm font-manrope outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    name="email"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@company.com"
                    autoComplete="email"
                    maxLength={200}
                    className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2 text-xs sm:text-sm font-manrope outline-none transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    وصف البضاعة / ملاحظات
                  </label>
                  <textarea
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    maxLength={1500}
                    placeholder="نوع البضاعة، الأوزان، أو أي متطلبات خاصة (مثل فحص أو تبريد)"
                    className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 py-2 text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Honeypot field for bot protection */}
              <div className="sr-only" aria-hidden="true">
                <input
                  name="website"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Dynamic Estimate Display */}
              <div className="estimate bg-amber-50/70 border border-amber-200/80 rounded-md p-4 mb-4 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-amber-900 font-medium">التكلفة التقديرية الأولية</span>
                  <span className="text-[11px] text-amber-700/80">
                    بناءً على سعر الشحن المعتمد حالياً ({currentRate ? `$${currentRate}/${MODE_UNITS[mode]}` : 'مراجعة'})
                  </span>
                </div>
                <strong className="text-xl sm:text-2xl font-bold font-manrope text-amber-900">
                  {estimatedTotal !== null ? formatUSD(estimatedTotal) : 'عرض سعر بعد المراجعة'}
                </strong>
              </div>

              <p className="form-note text-[11px] text-slate-500 leading-normal mb-5">
                السعر الأولي، إن توفر، لا يشمل الجمارك والضرائب ورسوم الموانئ. يؤكّد الفريق السعر النهائي فور استلام الطلب.
              </p>

              {error && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs mb-4">
                  {error}
                </div>
              )}

              <button
                className="button wide w-full bg-[#db8c42] hover:bg-[#b96b25] text-slate-900 font-bold py-3 rounded text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>جاري إرسال الطلب…</span>
                  </>
                ) : (
                  <>
                    <span>تأكيد وطلب عرض السعر</span>
                    <ArrowLeft size={18} />
                  </>
                )}
              </button>

              <div className="text-center mt-3">
                <small className="privacy-note text-[10px] text-slate-400">
                  تُستخدم بيانات التواصل للرد على طلب الشحن فقط.
                </small>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
