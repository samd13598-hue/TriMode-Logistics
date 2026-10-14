import React, { useState } from 'react';
import {
  Search,
  Phone,
  MessageCircle,
  Mail,
  ArrowLeft,
  FileSpreadsheet,
  Trash2,
  Save,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { QuoteRequest, QuoteStatus } from '../../types';
import { StatusBadge, ModeIcon, MODE_LABELS, MODE_UNITS, formatDate, formatUSD, CopyButton } from '../common';

export const QuotesManager: React.FC = () => {
  const { quotes, updateQuote, deleteQuote } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);

  const filteredQuotes = quotes.filter((q) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      q.reference.toLowerCase().includes(term) ||
      q.name.toLowerCase().includes(term) ||
      q.phone.toLowerCase().includes(term) ||
      q.origin.toLowerCase().includes(term) ||
      q.destination.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: QuoteStatus) => {
    updateQuote(id, { status: newStatus });
  };

  const handleNotesSave = (id: string) => {
    const noteText = editingNotes[id];
    if (noteText !== undefined) {
      updateQuote(id, { internalNotes: noteText });
      setSavedNoteId(id);
      setTimeout(() => setSavedNoteId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102b3b]">طلبات عروض الأسعار</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            طلبات العملاء المستلمة عبر حاسبة الموقع والمتابعة الداخلية.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-2 rounded-lg border border-[#e6eaeb]">
          إجمالي الطلبات: <strong className="font-manrope text-slate-900">{quotes.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e6eaeb] shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px] relative flex items-center">
          <Search size={16} className="absolute right-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="البحث برقم الطلب، اسم العميل أو الجوال…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 pr-10 py-2 text-xs sm:text-sm outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#f6f4ef] border border-[#e6eaeb] rounded px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer"
        >
          <option value="all">كل الحالات</option>
          <option value="new">جديد (غير متواصل به)</option>
          <option value="contacted">تم التواصل</option>
          <option value="approved">معتمد</option>
          <option value="closed">مغلق</option>
        </select>
      </div>

      {/* Quotes Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#e6eaeb] text-center text-slate-400">
          <FileSpreadsheet size={38} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-semibold text-slate-700 mb-1">لا توجد طلبات في هذا التصنيف</h3>
          <p className="text-xs">تظهر هنا طلبات العملاء بعد إرسال نموذج عرض السعر من الموقع.</p>
        </div>
      ) : (
        <div className="quotes-grid grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredQuotes.map((q) => {
            const currentNote = editingNotes[q.id] ?? (q.internalNotes || '');

            return (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-[#e6eaeb] p-5 sm:p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e6eaeb]">
                    <div className="flex items-center gap-2">
                      <strong dir="ltr" className="font-manrope text-sm font-extrabold text-amber-800">
                        {q.reference}
                      </strong>
                      <CopyButton value={q.reference} />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value as QuoteStatus)}
                        className="bg-[#f6f4ef] border border-[#e6eaeb] rounded px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer"
                      >
                        <option value="new">جديد</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="approved">معتمد</option>
                        <option value="closed">مغلق</option>
                      </select>
                      <button
                        onClick={() => deleteQuote(q.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                        title="حذف الطلب"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900 mb-1">{q.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <a
                        href={`tel:${q.phone}`}
                        className="inline-flex items-center gap-1 hover:text-amber-700"
                      >
                        <Phone size={12} className="text-amber-600" />
                        <span dir="ltr">{q.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                      >
                        <MessageCircle size={12} />
                        <span>محادثة واتساب</span>
                      </a>
                      {q.email && (
                        <a
                          href={`mailto:${q.email}`}
                          className="inline-flex items-center gap-1 hover:text-amber-700"
                        >
                          <Mail size={12} className="text-slate-400" />
                          <span dir="ltr">{q.email}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Route & Cargo Specs */}
                  <div className="bg-[#f6f4ef] p-3.5 rounded-lg mb-4 text-xs space-y-2">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span>{q.origin}</span>
                        <ArrowLeft size={13} className="text-amber-600 shrink-0" />
                        <span>{q.destination}</span>
                      </div>
                      <span className="flex items-center gap-1 text-slate-600">
                        <ModeIcon mode={q.mode} size={14} className="text-amber-600" />
                        <span>الشحن {MODE_LABELS[q.mode]}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                      <span>الكمية: {q.quantity} {MODE_UNITS[q.mode]}</span>
                      {q.estimatedAmount && (
                        <span>
                          التقدير: <strong className="font-manrope text-amber-800">{formatUSD(q.estimatedAmount)}</strong>
                        </span>
                      )}
                    </div>

                    {q.notes && (
                      <p className="text-[11px] text-slate-700 pt-1 border-t border-slate-200/60 leading-relaxed">
                        <strong className="text-slate-900">ملاحظات العميل:</strong> {q.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Staff Internal Notes form */}
                <div className="pt-3 border-t border-[#e6eaeb]">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    ملاحظات المتابعة والتسعير الداخلي
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={currentNote}
                      onChange={(e) =>
                        setEditingNotes((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="سجل نتائج الاتصال، السعر المتفق عليه، وموعد التحميل…"
                      className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded p-2 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleNotesSave(q.id)}
                      className="bg-[#102b3b] hover:bg-[#183343] text-white px-3 py-1.5 rounded text-xs font-semibold self-end transition-colors cursor-pointer"
                    >
                      {savedNoteId === q.id ? <Check size={14} className="text-emerald-400" /> : <Save size={14} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>تاريخ الطلب: {formatDate(q.createdAt, true)}</span>
                    {savedNoteId === q.id && (
                      <span className="text-emerald-600 font-semibold">تم حفظ الملاحظات!</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
