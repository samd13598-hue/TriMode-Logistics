import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ModeIcon } from '../common';
import { TransportMode } from '../../types';

interface ServicesProps {
  onQuoteClick: (mode?: TransportMode) => void;
}

const SERVICES = [
  {
    mode: 'sea' as TransportMode,
    tag: 'SEA',
    title: 'الشحن البحري',
    body: 'حاويات كاملة وشحن جزئي. من ميناء المصدر إلى وجهتك، مع متابعة لكل مرحلة من الرحلة.',
    detail: 'حاويات كاملة · شحن جزئي FCL/LCL · شحن مبرد وموانئ الصين والخليج إلى اليمن',
  },
  {
    mode: 'air' as TransportMode,
    tag: 'AIR',
    title: 'الشحن الجوي',
    body: 'لبضائعك التي لا تحتمل الانتظار. ننسّق النقل الجوي والتخليص ووصول الشحنة إلى وجهتها.',
    detail: 'بضائع عاجلة · رحلات منتظمة وسريعة · مناولة وتغليف وفحص من المصدر',
  },
  {
    mode: 'land' as TransportMode,
    tag: 'LAND',
    title: 'الشحن البري',
    body: 'نقل بري يربط الموانئ والمحافظات والوجهات الإقليمية. رحلة واضحة حتى باب مخزنك.',
    detail: 'نقل إقليمي بين المحافظات · قاطرات مجهزة ومبردة · تسليم حتى باب المستودع',
  },
];

export const ServicesSection: React.FC<ServicesProps> = ({ onQuoteClick }) => {
  return (
    <section id="services" className="services-section section-anchor py-20 bg-white">
      <div className="container">
        <div className="section-heading flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="eyebrow text-amber-700 text-xs font-semibold tracking-wider block mb-2">
              ثلاثة مسارات. شريك واحد.
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#102b3b]">
              خدمات تتحرك مع تجارتك
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm md:text-base leading-relaxed">
            من شراء البضاعة وفحصها إلى التخليص والتسليم.
            <br />
            نعتني بالتفاصيل، لتعتني أنت بأعمالك.
          </p>
        </div>

        <div className="service-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {SERVICES.map((s, idx) => (
            <article
              key={s.mode}
              className={`service-card service-${s.mode} bg-[#f6f4ef] rounded-lg p-7 border border-[#e6eaeb] hover:border-amber-400 transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="service-top flex items-center justify-between mb-8 text-slate-400">
                  <div className="text-[#db8c42]">
                    <ModeIcon mode={s.mode} size={36} />
                  </div>
                  <span dir="ltr" className="font-manrope text-xs font-bold tracking-widest">
                    0{idx + 1} / {s.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#102b3b] mb-3">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{s.body}</p>
              </div>

              <div className="service-detail border-t border-slate-200/60 pt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="line-clamp-1">{s.detail}</span>
                <button
                  onClick={() => onQuoteClick(s.mode)}
                  aria-label={`طلب عرض ${s.title}`}
                  className="p-1.5 rounded-full hover:bg-amber-100 text-[#183343] hover:text-[#db8c42] transition-colors cursor-pointer"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="customs-strip bg-[#102b3b] text-white rounded-lg p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="customs-icon w-14 h-14 rounded bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck size={32} />
            </span>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">التخليص الجمركي والاستيراد</h3>
              <p className="text-slate-300 text-xs md:text-sm">
                تنسيق المستندات والتصاريح، فحص المنتجات من المصدر، ومتابعة إجراءات التخليص في المنافذ اليمنية.
              </p>
            </div>
          </div>
          <button
            onClick={() => onQuoteClick()}
            className="button bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded shrink-0 flex items-center gap-2 cursor-pointer transition-colors text-sm"
          >
            <span>نتولى التفاصيل</span>
            <ArrowLeft size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};
