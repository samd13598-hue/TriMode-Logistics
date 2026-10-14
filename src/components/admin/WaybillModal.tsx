import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { Shipment } from '../../types';
import { MODE_LABELS, formatDate } from '../common';

interface WaybillModalProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({ shipment, onClose }) => {
  if (!shipment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 bg-[#102b3b]/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8 relative shadow-2xl printable-area">
        {/* Modal Controls (Hidden in print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Printer size={18} className="text-amber-600" />
            <h2 className="text-sm font-bold text-slate-800">معاينة بوليصة الشحن الرسمية</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#db8c42] hover:bg-[#b96b25] text-slate-900 font-bold px-4 py-1.5 rounded text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>طباعة المستند</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="border-2 border-slate-900 p-6 rounded-lg bg-white text-slate-900">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-8 rounded bg-[#102b3b] text-amber-500 font-extrabold flex items-center justify-center text-xs">
                  TM
                </span>
                <div>
                  <h1 className="text-xl font-black tracking-tight leading-none">
                    TRI<span className="text-amber-700">MODE</span> LOGISTICS
                  </h1>
                  <span className="text-[10px] font-bold text-slate-600">
                    تراي مود للخدمات اللوجستية والنقل الشامل — الجمهورية اليمنية
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-600 mt-2 font-medium">
                الجمهورية اليمنية — صنعاء · هاتف: <span dir="ltr">780888887 - 772090806</span> · بريد: <span dir="ltr">mostfaalyamani@gmail.com</span>
              </p>
            </div>

            <div className="text-left" dir="ltr">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                CONSIGNMENT NOTE / WAYBILL
              </span>
              <div className="text-2xl font-black font-manrope text-slate-950 mt-1">
                {shipment.trackingNumber}
              </div>
              <span className="text-[10px] text-slate-500">
                DATE: {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>

          {/* Transport Mode & Status Bar */}
          <div className="bg-slate-100 p-3 rounded flex items-center justify-between mb-5 text-xs font-bold border border-slate-300">
            <div>
              <span>نوع الشحن: </span>
              <span className="text-amber-800">الشحن {MODE_LABELS[shipment.mode]}</span>
            </div>
            <div>
              <span>الوصول المتوقع: </span>
              <span className="font-manrope">{formatDate(shipment.eta)}</span>
            </div>
            <div>
              <span>الحالة المسجلة: </span>
              <span>{shipment.status}</span>
            </div>
          </div>

          {/* Shipper & Consignee Columns */}
          <div className="grid grid-cols-2 gap-4 mb-5 border border-slate-200 rounded p-4 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                جهة الإرسال / المصدر (Shipper)
              </span>
              <strong className="block text-slate-900 text-sm mb-1">{shipment.origin}</strong>
              <p className="text-[11px] text-slate-600">المحطة الأولى للشحن والتحميل</p>
            </div>

            <div className="border-r border-slate-200 pr-4">
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                جهة الاستلام / الوجهة (Consignee)
              </span>
              <strong className="block text-slate-900 text-sm mb-1">{shipment.destination}</strong>
              <p className="text-[11px] text-slate-800 font-semibold">{shipment.customerName}</p>
              <p dir="ltr" className="text-[10px] font-manrope text-slate-600 text-right">
                {shipment.customerPhone}
              </p>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="border border-slate-200 rounded p-4 mb-5 text-xs">
            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
              بيانات ومواصفات البضاعة (Cargo Specification)
            </span>
            <p className="font-semibold text-slate-800 mb-2 leading-relaxed">{shipment.cargo}</p>
            {shipment.internalNotes && (
              <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
                <strong>ملاحظات:</strong> {shipment.internalNotes}
              </p>
            )}
          </div>

          {/* Official Verification Footer */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <span className="block text-[10px] text-slate-500 mb-6">توقيع المستلم</span>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            </div>

            <div>
              <span className="block text-[10px] text-slate-500 mb-6">مسؤول المستودع والتخليص</span>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            </div>

            <div>
              <div className="w-16 h-16 rounded-full border-2 border-amber-600/60 mx-auto flex flex-col items-center justify-center text-[8px] font-bold text-amber-800 rotate-[-12deg]">
                <span>TRIMODE</span>
                <ShieldCheck size={16} className="my-0.5 text-amber-600" />
                <span>VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
