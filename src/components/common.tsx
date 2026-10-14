import React, { useState } from 'react';
import { Ship, Plane, Truck, Check, Copy } from 'lucide-react';
import { TransportMode, ShipmentStatus, QuoteStatus } from '../types';

export const MODE_LABELS: Record<TransportMode, string> = {
  sea: 'بحري',
  air: 'جوي',
  land: 'بري',
};

export const MODE_UNITS: Record<TransportMode, string> = {
  sea: 'م³',
  air: 'كجم',
  land: 'كجم',
};

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  received: 'تم الاستلام',
  processing: 'قيد التجهيز',
  in_transit: 'في الطريق',
  customs: 'التخليص الجمركي',
  delivered: 'تم التسليم',
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  approved: 'معتمد',
  closed: 'مغلق',
};

export const Brand: React.FC<{ light?: boolean; onClick?: () => void }> = ({ light = false, onClick }) => {
  return (
    <a
      href="/"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`brand ${light ? 'light' : ''}`}
      aria-label="TriMode الرئيسية"
    >
      <span className="brand-symbol">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* TriMode distinct 3-motion arrow / vessel / cargo mark */}
          <path d="M2 17h20M2 17l4-9h12l4 9M9 8V4h6v4M12 4v4" />
          <path d="M4 17l2 4h12l2-4" />
        </svg>
      </span>
      <span>
        <strong dir="ltr">
          TRI<span>MODE</span>
          <small>LOGISTICS</small>
        </strong>
        <em>تراي مود للخدمات اللوجستية</em>
      </span>
    </a>
  );
};

export const ModeIcon: React.FC<{ mode: TransportMode; size?: number; className?: string }> = ({
  mode,
  size = 22,
  className = '',
}) => {
  if (mode === 'sea') {
    return <Ship size={size} strokeWidth={1.7} className={className} />;
  }
  if (mode === 'air') {
    return <Plane size={size} strokeWidth={1.7} className={className} />;
  }
  return <Truck size={size} strokeWidth={1.7} className={className} />;
};

export const StatusBadge: React.FC<{ status: ShipmentStatus | QuoteStatus }> = ({ status }) => {
  let label = '';
  let colorClass = '';

  if (status in SHIPMENT_STATUS_LABELS) {
    label = SHIPMENT_STATUS_LABELS[status as ShipmentStatus];
    switch (status) {
      case 'received':
        colorClass = 'bg-slate-100 text-slate-700 border-slate-300';
        break;
      case 'processing':
        colorClass = 'bg-amber-50 text-amber-800 border-amber-300';
        break;
      case 'in_transit':
        colorClass = 'bg-blue-50 text-blue-800 border-blue-300';
        break;
      case 'customs':
        colorClass = 'bg-purple-50 text-purple-800 border-purple-300';
        break;
      case 'delivered':
        colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        break;
    }
  } else if (status in QUOTE_STATUS_LABELS) {
    label = QUOTE_STATUS_LABELS[status as QuoteStatus];
    switch (status) {
      case 'new':
        colorClass = 'bg-amber-50 text-amber-800 border-amber-300';
        break;
      case 'contacted':
        colorClass = 'bg-blue-50 text-blue-800 border-blue-300';
        break;
      case 'approved':
        colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        break;
      case 'closed':
        colorClass = 'bg-gray-100 text-gray-600 border-gray-300';
        break;
    }
  }

  return (
    <span
      className={`status-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}
    >
      {label}
    </span>
  );
};

export const CopyButton: React.FC<{ value: string; label?: string }> = ({ value, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      className="icon-button"
      onClick={handleCopy}
      title={copied ? 'تم النسخ' : 'نسخ'}
      aria-label="نسخ"
    >
      {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
      {label && <span className="text-xs mr-1">{copied ? 'تم النسخ' : label}</span>}
    </button>
  );
};

export const formatDate = (dateStr: string, includeTime = false) => {
  if (!dateStr) return 'غير محدد';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    };
    return d.toLocaleDateString('ar-YE', options);
  } catch {
    return dateStr;
  }
};

export const formatUSD = (amount: number | null | undefined) => {
  if (amount == null) return 'غير متوفر';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
