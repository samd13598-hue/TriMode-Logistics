import React, { useState } from 'react';
import { MapPin, ArrowLeft, Menu, X, ShieldCheck } from 'lucide-react';
import { Brand } from '../common';
import { useStore } from '../../context/StoreContext';

interface HeaderProps {
  onNavigateAuth: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateAuth, onNavigateHome }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useStore();

  const handleNavClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    onNavigateHome();
    setTimeout(() => {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <>
      <div className="topbar">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-amber-500" />
              <span>اليمن — صنعاء</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <a
              href="tel:780888887"
              dir="ltr"
              className="hidden sm:inline-flex items-center gap-1 text-[#c9d4db] hover:text-amber-400 font-manrope font-semibold transition-colors"
            >
              <span>780888887</span>
            </a>
            <span className="hidden sm:inline-block text-slate-500">·</span>
            <a
              href="tel:772090806"
              dir="ltr"
              className="hidden sm:inline-flex items-center gap-1 text-[#c9d4db] hover:text-amber-400 font-manrope font-semibold transition-colors"
            >
              <span>772090806</span>
            </a>
            <span className="hidden lg:inline-block text-slate-500">|</span>
            <a
              href="mailto:mostfaalyamani@gmail.com"
              dir="ltr"
              className="hidden lg:inline-flex items-center gap-1 text-[#c9d4db] hover:text-amber-400 font-manrope text-[11px] transition-colors"
            >
              <span>mostfaalyamani@gmail.com</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span dir="ltr" className="hidden xl:inline font-semibold text-slate-400 text-[10px]">
              LAND · SEA · AIR
            </span>
            <button
              onClick={onNavigateAuth}
              className="flex items-center gap-1 text-[#c9d4db] hover:text-white transition-colors cursor-pointer text-[11px]"
            >
              {currentUser ? (
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <ShieldCheck size={14} />
                  <span>لوحة التحكم ({currentUser.name})</span>
                  <ArrowLeft size={13} />
                </span>
              ) : (
                <>
                  <span>دخول الموظفين</span>
                  <ArrowLeft size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <header className="site-header sticky top-0 z-40 bg-white/95 backdrop-blur shadow-xs">
        <div className="container header-inner">
          <Brand onClick={onNavigateHome} />

          <button
            className="mobile-menu icon-button md:hidden"
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={mobileMenuOpen ? 'open' : ''}>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('services');
              }}
            >
              خدمات الشحن
            </a>
            <a
              href="#sectors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('sectors');
              }}
            >
              قطاعات الأعمال
            </a>
            <a
              href="#tracking"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('tracking');
              }}
            >
              تتبع الشحنة
            </a>
            <a
              href="#quote"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('quote');
              }}
            >
              حاسبة الأسعار
            </a>
            <a
              href="#quote"
              className="button header-quote"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('quote');
              }}
            >
              طلب عرض سعر
            </a>
          </nav>
        </div>
      </header>
    </>
  );
};
