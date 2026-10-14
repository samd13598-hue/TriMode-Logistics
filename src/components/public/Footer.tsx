import React from 'react';
import { MapPin, ArrowLeft, ShieldCheck, Phone, Mail, MessageCircle } from 'lucide-react';
import { Brand } from '../common';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  onNavigateAuth: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAuth, onNavigateHome }) => {
  const { currentUser } = useStore();

  const handleNav = (anchorId: string) => {
    onNavigateHome();
    setTimeout(() => {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <footer className="site-footer bg-[#102b3b] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="container footer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
        {/* Brand & Intro */}
        <div className="lg:col-span-4">
          <div className="mb-4">
            <Brand light onClick={onNavigateHome} />
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm mb-4">
            تراي مود للخدمات اللوجستية والنقل الشامل (المصدر اليمني).
            <br />
            شريكك الموثوق للاستيراد والتصدير والتخليص الجمركي في اليمن والمنطقة، براً وبحراً وجواً.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <a
              href="https://wa.me/967780888887"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25d366] hover:bg-[#20ba5a] text-white text-xs font-bold px-3.5 py-1.5 rounded transition-colors"
            >
              <MessageCircle size={15} />
              <span>واتساب 780888887</span>
            </a>
            <a
              href="tel:780888887"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold px-3 py-1.5 rounded transition-colors font-manrope"
            >
              <Phone size={13} className="text-amber-400" />
              <span>اتصال مباشر</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-200 mb-4 pb-1 border-b border-white/10 w-fit">
            ابدأ من هنا
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('services');
                }}
                className="hover:text-amber-400 transition-colors"
              >
                خدمات الشحن
              </a>
            </li>
            <li>
              <a
                href="#sectors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('sectors');
                }}
                className="hover:text-amber-400 transition-colors"
              >
                قطاعات الأعمال
              </a>
            </li>
            <li>
              <a
                href="#tracking"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('tracking');
                }}
                className="hover:text-amber-400 transition-colors"
              >
                تتبع الشحنة
              </a>
            </li>
            <li>
              <a
                href="#quote"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('quote');
                }}
                className="hover:text-amber-400 transition-colors"
              >
                طلب عرض سعر
              </a>
            </li>
          </ul>
        </div>

        {/* Fast Services */}
        <div className="lg:col-span-3">
          <h3 className="text-sm font-bold text-slate-200 mb-4 pb-1 border-b border-white/10 w-fit">
            خدماتنا السريعة
          </h3>
          <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
            <li>• استيراد وتصدير المواد الخام والمنتجات</li>
            <li>• شحن بحري وجوي وبري متكامل</li>
            <li>• تخليص جمركي ومتابعة الشحنات</li>
            <li>• حلول التخزين وسلاسل الإمداد والتوصيل</li>
          </ul>
        </div>

        {/* Contact Info (Updated with real details from user's site) */}
        <div className="lg:col-span-3">
          <h3 className="text-sm font-bold text-amber-400 mb-4 pb-1 border-b border-white/10 w-fit">
            تواصل معنا مباشرة
          </h3>
          <div className="space-y-3.5 text-xs text-slate-300">
            {/* Phone & WhatsApp */}
            <div className="flex items-start gap-2.5">
              <Phone size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">الاتصال والواتساب:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="tel:780888887"
                    dir="ltr"
                    className="font-manrope font-bold text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    780888887
                  </a>
                  <span className="text-slate-500">-</span>
                  <a
                    href="tel:772090806"
                    dir="ltr"
                    className="font-manrope font-bold text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    772090806
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2.5">
              <Mail size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-slate-400 mb-0.5">البريد الإلكتروني:</span>
                <a
                  href="mailto:mostfaalyamani@gmail.com"
                  dir="ltr"
                  className="font-manrope font-bold text-slate-200 hover:text-amber-400 hover:underline break-all"
                >
                  mostfaalyamani@gmail.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-slate-400 mb-0.5">المقر الرئيسي:</span>
                <span className="font-semibold text-slate-200">الجمهورية اليمنية — صنعاء</span>
              </div>
            </div>

            {/* Staff portal link */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={onNavigateAuth}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
              >
                <ShieldCheck size={14} />
                <span>{currentUser ? 'مساحة العمل (لوحة التحكم)' : 'دخول الموظفين'}</span>
                <ArrowLeft size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <span>جميع الحقوق محفوظة © {new Date().getFullYear()} TriMode Logistics | تراي مود للخدمات اللوجستية والنقل الشامل</span>
        <span dir="ltr" className="font-manrope text-[11px] tracking-widest text-slate-400">
          SANA'A, YEMEN · TEL: 780888887 / 772090806
        </span>
      </div>
    </footer>
  );
};
