import React from 'react';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react';
import { ModeIcon } from '../common';
import { TransportMode } from '../../types';

interface HeroProps {
  onQuoteClick: () => void;
  onTrackClick: () => void;
  onExploreClick: () => void;
}

const MODES: { mode: TransportMode; title: string }[] = [
  { mode: 'sea', title: 'الشحن البحري' },
  { mode: 'air', title: 'الشحن الجوي' },
  { mode: 'land', title: 'الشحن البري' },
];

export const Hero: React.FC<HeroProps> = ({ onQuoteClick, onTrackClick, onExploreClick }) => {
  return (
    <section className="hero relative overflow-hidden text-white bg-[#102b3b] min-h-[680px] lg:min-h-[730px] flex flex-col justify-between">
      <img
        src="/hero-ports.png"
        alt="ميناء حاويات وطائرة شحن وشاحنات للنقل البري عند الغروب"
        className="hero-image absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        fetchPriority="high"
      />
      <div className="hero-shade absolute inset-0 bg-gradient-to-r from-[#09212eed] via-[#09212ecc] to-[#09212e60]" />

      <div className="container hero-content relative z-10 pt-16 md:pt-24 pb-12 flex-1 flex flex-col justify-center">
        <span className="hero-eyebrow inline-flex items-center gap-2.5 text-xs font-semibold tracking-wider text-amber-400 mb-6 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>شريكك التجاري واللوجستي</span>
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
          من أي مكان.
          <br />
          عبر كل طريق.
          <br />
          <span className="text-amber-400">حتى باب مخزنك.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed mb-8">
          حلول متكاملة للاستيراد والتصدير والنقل الشامل.
          <br />
          نربط تجارتك بالعالم، براً وبحراً وجواً.
        </p>

        <div className="hero-actions flex flex-wrap items-center gap-4 text-sm font-semibold mb-10">
          <button
            onClick={onQuoteClick}
            className="button bg-[#db8c42] hover:bg-[#b96b25] text-slate-900 px-6 py-3 rounded font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <span>ابدأ رحلتك معنا</span>
            <ArrowLeft size={19} />
          </button>
          <button
            onClick={onTrackClick}
            className="hero-track inline-flex items-center gap-2.5 px-6 py-3 rounded border border-white/20 hover:border-white/50 text-white font-semibold transition-colors cursor-pointer bg-black/20 backdrop-blur"
          >
            <Search size={18} className="text-amber-400" />
            <span>تتبع شحنتك</span>
          </button>
        </div>

        <div className="hero-modes flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
          {MODES.map((item) => (
            <span
              key={item.mode}
              className="inline-flex items-center gap-2 bg-slate-900/40 backdrop-blur px-3 py-1.5 rounded border border-white/10"
            >
              <ModeIcon mode={item.mode} size={16} className="text-amber-400" />
              <span>{item.title}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="hero-bottom relative z-10 border-t border-white/10 py-4">
        <div className="container flex justify-between items-center text-xs text-slate-400">
          <span dir="ltr" className="font-manrope tracking-widest text-[10px] text-slate-400">
            CONNECTED BY EVERY ROUTE.
          </span>
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>اكتشف خدماتنا</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
