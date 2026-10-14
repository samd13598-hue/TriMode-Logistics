import React from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  FileSpreadsheet,
  ArrowLeft,
  PlusCircle,
  Clock,
  MapPin,
  Coins,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StatusBadge, ModeIcon, MODE_LABELS, formatDate, formatUSD } from '../common';
import { AdminTab } from './AdminLayout';

interface DashboardOverviewProps {
  onSelectTab: (tab: AdminTab, shipmentId?: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSelectTab }) => {
  const { currentUser, shipments, quotes } = useStore();

  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter(
    (s) => s.status === 'in_transit' || s.status === 'processing' || s.status === 'customs'
  ).length;
  const deliveredCount = shipments.filter((s) => s.status === 'delivered').length;
  const newQuotesCount = quotes.filter((q) => q.status === 'new').length;

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div className="bg-white p-6 rounded-xl border border-[#e6eaeb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102b3b]">
            مرحباً، {currentUser?.name || 'فريق العمل'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            كل ما تحتاجه لمتابعة العمل اليوم، في مكان واحد. الإحصاءات مبنية على أحدث السجلات المسجلة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSelectTab('shipment-new')}
            className="bg-[#db8c42] hover:bg-[#b96b25] text-slate-900 font-bold px-4 py-2 rounded text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>إضافة شحنة جديدة</span>
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onSelectTab('rates')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Coins size={15} className="text-amber-600" />
              <span>تعديل الأسعار</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card bg-white p-5 rounded-xl border border-[#e6eaeb] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">إجمالي الشحنات</span>
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package size={17} />
            </span>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold font-manrope text-[#102b3b] block">
            {totalShipments}
          </strong>
          <span className="text-[11px] text-slate-400 mt-1 block">مسجلة في النظام</span>
        </div>

        <div className="stat-card bg-white p-5 rounded-xl border border-[#e6eaeb] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">شحنات قيد الحركة</span>
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck size={17} />
            </span>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold font-manrope text-blue-700 block">
            {inTransitCount}
          </strong>
          <span className="text-[11px] text-slate-400 mt-1 block">بحري، جوي، أو بري</span>
        </div>

        <div className="stat-card bg-white p-5 rounded-xl border border-[#e6eaeb] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">الشحنات المسلّمة</span>
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={17} />
            </span>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold font-manrope text-emerald-700 block">
            {deliveredCount}
          </strong>
          <span className="text-[11px] text-slate-400 mt-1 block">تم تسليمها للمستودعات</span>
        </div>

        <div className="stat-card bg-white p-5 rounded-xl border border-[#e6eaeb] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">طلبات أسعار جديدة</span>
            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileSpreadsheet size={17} />
            </span>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold font-manrope text-amber-700 block">
            {newQuotesCount}
          </strong>
          <span className="text-[11px] text-slate-400 mt-1 block">بانتظار التواصل والتأكيد</span>
        </div>
      </div>

      {/* Two Columns: Recent Shipments & Recent Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Shipments */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#e6eaeb] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#e6eaeb] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-amber-600" />
              <h2 className="text-base font-bold text-[#102b3b]">آخر الشحنات النشطة</h2>
            </div>
            <button
              onClick={() => onSelectTab('shipments')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>عرض كل الشحنات</span>
              <ArrowLeft size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {shipments.slice(0, 4).map((shp) => (
              <div
                key={shp.id}
                onClick={() => onSelectTab('shipment-edit', shp.id)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 rounded bg-slate-100 text-[#102b3b] mt-0.5">
                    <ModeIcon mode={shp.mode} size={16} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong dir="ltr" className="font-manrope text-xs sm:text-sm font-bold text-slate-900">
                        {shp.trackingNumber}
                      </strong>
                      <span className="text-[10px] text-slate-400">· {MODE_LABELS[shp.mode]}</span>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <span>{shp.origin}</span>
                      <ArrowLeft size={11} className="text-slate-400" />
                      <span>{shp.destination}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {shp.customerName} · {shp.cargo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1.5">
                  <StatusBadge status={shp.status} />
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={11} />
                    <span>الوصول: {formatDate(shp.eta)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#e6eaeb] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#e6eaeb] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-amber-600" />
              <h2 className="text-base font-bold text-[#102b3b]">أحدث طلبات عروض الأسعار</h2>
            </div>
            <button
              onClick={() => onSelectTab('quotes')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>كل الطلبات</span>
              <ArrowLeft size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {quotes.slice(0, 4).map((q) => (
              <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <strong dir="ltr" className="font-manrope text-xs font-bold text-amber-800">
                      {q.reference}
                    </strong>
                    <StatusBadge status={q.status} />
                  </div>
                  {q.estimatedAmount && (
                    <span className="font-manrope text-xs font-bold text-slate-800">
                      {formatUSD(q.estimatedAmount)}
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-800 mb-1">{q.name}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-2">
                  <span>{q.origin}</span>
                  <ArrowLeft size={11} className="text-slate-400" />
                  <span>{q.destination}</span>
                  <span className="text-slate-400">({MODE_LABELS[q.mode]})</span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <a
                    href={`tel:${q.phone}`}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-amber-700 bg-slate-100 px-2 py-1 rounded"
                  >
                    <Phone size={11} />
                    <span dir="ltr">{q.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded"
                  >
                    <MessageCircle size={11} />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
