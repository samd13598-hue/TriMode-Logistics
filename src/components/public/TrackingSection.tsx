import React, { useState } from 'react';
import { Search, MapPin, ArrowLeft, Shield, Package, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Shipment } from '../../types';
import { StatusBadge, ModeIcon, MODE_LABELS, formatDate, CopyButton } from '../common';

export const TrackingSection: React.FC = () => {
  const { getShipmentByTracking, shipments } = useStore();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Shipment | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (trackingCodeToSearch?: string) => {
    const code = (trackingCodeToSearch || query).trim();
    if (!code) return;

    setLoading(true);
    setError('');
    setSearched(true);

    setTimeout(() => {
      const found = getShipmentByTracking(code);
      if (found) {
        setResult(found);
        setError('');
      } else {
        setResult(null);
        setError('تعذر العثور على شحنة بهذا الرقم. تأكد من إدخال الرمز بدقة (مثال: TM-982410).');
      }
      setLoading(false);
    }, 350);
  };

  const handleQuickPick = (code: string) => {
    setQuery(code);
    handleSearch(code);
  };

  return (
    <section id="tracking" className="tracking-section section-anchor py-20 bg-white border-t border-[#e6eaeb]">
      <div className="container tracking-layout grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="section-intro lg:col-span-5">
          <span className="eyebrow text-amber-700 text-xs font-semibold tracking-wider block mb-2">
            رحلة واضحة، خطوة بخطوة
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#102b3b] leading-tight mb-4">
            شحنتك في الطريق.
            <br />
            <span className="text-amber-600">ابقَ على اطلاع.</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            أدخل رقم التتبع الذي حصلت عليه من فريقنا لمعرفة آخر تحديث وموقع شحنتك.
          </p>

          <div className="trust-note inline-flex items-center gap-2 text-xs text-slate-500 bg-[#f6f4ef] px-4 py-2.5 rounded-md border border-[#e6eaeb]">
            <Shield size={18} className="text-amber-600 shrink-0" />
            <span>معلومات العميل الخاصة لا تظهر في التتبع</span>
          </div>

          <div className="mt-8 p-4 bg-amber-50/60 rounded-lg border border-amber-200/60 text-xs">
            <span className="font-bold text-amber-900 flex items-center gap-1 mb-2">
              <Sparkles size={14} className="text-amber-600" />
              <span>أرقام تتبع تجريبية سريعة:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {shipments.slice(0, 3).map((s) => (
                <button
                  key={s.trackingNumber}
                  type="button"
                  onClick={() => handleQuickPick(s.trackingNumber)}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 rounded font-manrope font-semibold transition-colors cursor-pointer"
                >
                  {s.trackingNumber} ({MODE_LABELS[s.mode]})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tracking-card lg:col-span-7 bg-[#f6f4ef] rounded-lg p-6 sm:p-8 border border-[#e6eaeb]">
          <div className="card-top flex items-center gap-3.5 mb-6 pb-4 border-b border-[#e6eaeb]">
            <span className="mini-icon w-11 h-11 rounded bg-[#102b3b] text-amber-400 flex items-center justify-center shrink-0">
              <Package size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#102b3b]">تتبع شحنتك</h3>
              <p dir="ltr" className="font-manrope text-[10px] text-slate-400 font-bold tracking-wider">
                SHIPMENT TRACKING
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mb-6"
          >
            <label htmlFor="tracking-input" className="block text-xs font-semibold text-slate-700 mb-2">
              رقم البوليصة / التتبع
            </label>
            <div className="tracking-input-row flex flex-col sm:flex-row gap-3">
              <input
                id="tracking-input"
                dir="ltr"
                placeholder="TM-…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                minLength={4}
                maxLength={48}
                required
                autoComplete="off"
                className="flex-1 bg-white border border-[#e6eaeb] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded px-4 py-2.5 text-sm font-manrope font-semibold uppercase tracking-wider outline-none"
              />
              <button
                className="button bg-[#db8c42] hover:bg-[#b96b25] text-slate-900 font-bold px-6 py-2.5 rounded text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>جاري البحث…</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>تتبع الشحنة</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs mb-6">
              {error}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="tracking-placeholder py-12 text-center text-slate-400">
              <div className="route-line flex items-center justify-center gap-3 mb-3 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-16 h-0.5 bg-slate-200 dashed" />
                <MapPin size={18} className="text-amber-500" />
              </div>
              <p className="text-xs">من نقطة الانطلاق… حتى الوصول إليك</p>
            </div>
          )}

          {result && (
            <div className="tracking-result bg-white rounded-lg p-5 sm:p-6 border border-[#e6eaeb] shadow-xs">
              <div className="result-heading flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <strong dir="ltr" className="font-manrope text-xl font-extrabold text-[#102b3b]">
                    {result.trackingNumber}
                  </strong>
                  <CopyButton value={result.trackingNumber} />
                </div>
                <StatusBadge status={result.status} />
              </div>

              <div className="shipment-route bg-slate-50 p-4 rounded-md mb-4 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <div>
                  <small className="block text-[10px] text-slate-400 font-medium">من</small>
                  <strong className="text-slate-800">{result.origin}</strong>
                </div>
                <ArrowLeft size={18} className="text-amber-600 shrink-0" />
                <div>
                  <small className="block text-[10px] text-slate-400 font-medium">إلى</small>
                  <strong className="text-slate-800">{result.destination}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-700 mb-4 bg-amber-50/50 p-3 rounded border border-amber-100/60 leading-relaxed">
                <strong className="text-amber-900 block mb-1">وصف البضاعة:</strong>
                {result.cargo}
              </p>

              <div className="detail-line flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pb-4 mb-6 border-b border-slate-100">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <ModeIcon mode={result.mode} size={16} className="text-amber-600" />
                  <span>الشحن {MODE_LABELS[result.mode]}</span>
                </span>
                <span>
                  الوصول المتوقع: <strong className="text-slate-800">{formatDate(result.eta)}</strong>
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-4">سجل حركة الشحنة</h4>
                <ol className="timeline relative border-r border-amber-200/80 mr-3 pr-5 space-y-6">
                  {result.events.map((event, idx) => (
                    <li key={event.id || idx} className="relative">
                      <span className="timeline-dot absolute -right-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-500" />
                      <strong className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                        {event.message}
                      </strong>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <MapPin size={13} className="text-amber-600 shrink-0" />
                        <span>{event.location}</span>
                        <span>· {formatDate(event.occurredAt, true)}</span>
                      </p>
                    </li>
                  ))}
                </ol>
                {result.events.length === 0 && (
                  <p className="text-xs text-slate-400">لا توجد تحديثات مسجلة بعد.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
