import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SectorsProps {
  onQuoteClick: () => void;
}

const SECTORS = [
  'خطوط إنتاج ومعدات',
  'قطع غيار وسيارات',
  'ملابس وأقمشة',
  'مواد خام وصناعية',
  'مواد غذائية ومشروبات',
  'أثاث وأدوات منزلية',
];

export const SectorsSection: React.FC<SectorsProps> = ({ onQuoteClick }) => {
  return (
    <section id="sectors" className="sectors-section section-anchor py-16 bg-[#f6f4ef]">
      <div className="container sectors-layout grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div>
          <span className="eyebrow text-amber-700 text-xs font-semibold tracking-wider block mb-2">
            مهما كان مجال تجارتك
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#102b3b] leading-tight">
            بضاعتك.
            <br />
            نعرف طريقها.
          </h2>
        </div>

        <div className="sector-list md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {SECTORS.map((sector, idx) => (
            <div
              key={sector}
              onClick={onQuoteClick}
              className="bg-white p-4 rounded-md border border-[#e6eaeb] hover:border-amber-400 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <span dir="ltr" className="font-manrope text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  0{idx + 1}
                </span>
                <span className="font-semibold text-slate-800 text-sm group-hover:text-amber-700 transition-colors">
                  {sector}
                </span>
              </div>
              <ArrowLeft
                size={16}
                className="text-slate-400 group-hover:text-amber-600 group-hover:-translate-x-1 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
