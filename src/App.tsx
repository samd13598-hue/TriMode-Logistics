import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/public/Header';
import { Hero } from './components/public/Hero';
import { ServicesSection } from './components/public/ServicesSection';
import { SectorsSection } from './components/public/SectorsSection';
import { TrackingSection } from './components/public/TrackingSection';
import { QuoteCalculatorSection } from './components/public/QuoteCalculatorSection';
import { Footer } from './components/public/Footer';
import { AuthPage } from './components/auth/AuthPage';
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { ShipmentsManager } from './components/admin/ShipmentsManager';
import { ShipmentEditor } from './components/admin/ShipmentEditor';
import { QuotesManager } from './components/admin/QuotesManager';
import { RatesManager } from './components/admin/RatesManager';
import { StaffManager } from './components/admin/StaffManager';
import { WaybillModal } from './components/admin/WaybillModal';
import { TransportMode, Shipment } from './types';
import { MessageCircle, Shield, Phone } from 'lucide-react';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';

function MainApp() {
  const { currentUser } = useStore();

  // Navigation mode: 'public' | 'auth' | 'admin'
  const [view, setView] = useState<'public' | 'auth' | 'admin'>(() => {
    const path = window.location.pathname.replace(/\/$/, '');
    if (path === '/login') return 'auth';
    if (path.startsWith('/admin')) return 'admin';
    return 'public';
  });

  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | undefined>();
  const [selectedWaybillShipment, setSelectedWaybillShipment] = useState<Shipment | null>(null);
  const [initialCalculatorMode, setInitialCalculatorMode] = useState<TransportMode>('sea');

  // Sync browser history state
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '');
      if (path === '/login') {
        setView('auth');
      } else if (path.startsWith('/admin')) {
        setView('admin');
        if (path === '/admin/shipments') setAdminTab('shipments');
        else if (path === '/admin/quotes') setAdminTab('quotes');
        else if (path === '/admin/rates') setAdminTab('rates');
        else if (path === '/admin/staff') setAdminTab('staff');
        else setAdminTab('overview');
      } else {
        setView('public');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newView: 'public' | 'auth' | 'admin', path = '/') => {
    setView(newView);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminSelectTab = (tab: AdminTab, shipmentId?: string) => {
    setAdminTab(tab);
    setSelectedShipmentId(shipmentId);
    let path = '/admin';
    if (tab === 'shipments') path = '/admin/shipments';
    else if (tab === 'shipment-new') path = '/admin/shipments/new';
    else if (tab === 'shipment-edit' && shipmentId) path = `/admin/shipments/${shipmentId}`;
    else if (tab === 'quotes') path = '/admin/quotes';
    else if (tab === 'rates') path = '/admin/rates';
    else if (tab === 'staff') path = '/admin/staff';
    window.history.pushState({}, '', path);
  };

  const handleScrollTo = (elementId: string) => {
    if (view !== 'public') {
      navigateTo('public', '/');
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(elementId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuoteClick = (mode?: TransportMode) => {
    if (mode) setInitialCalculatorMode(mode);
    handleScrollTo('quote');
  };

  // View: Auth
  if (view === 'auth') {
    return (
      <AuthPage
        onSuccess={() => navigateTo('admin', '/admin')}
        onBackToHome={() => navigateTo('public', '/')}
      />
    );
  }

  // View: Admin
  if (view === 'admin') {
    // If not logged in, prompt to log in or switch to login page
    if (!currentUser) {
      return (
        <AuthPage
          onSuccess={() => navigateTo('admin', '/admin')}
          onBackToHome={() => navigateTo('public', '/')}
        />
      );
    }

    return (
      <>
        <AdminLayout
          currentTab={adminTab}
          onSelectTab={handleAdminSelectTab}
          onBackToHome={() => navigateTo('public', '/')}
        >
          {adminTab === 'overview' && (
            <DashboardOverview onSelectTab={handleAdminSelectTab} />
          )}

          {adminTab === 'shipments' && (
            <ShipmentsManager
              onSelectTab={handleAdminSelectTab}
              onOpenWaybill={(shp) => setSelectedWaybillShipment(shp)}
            />
          )}

          {(adminTab === 'shipment-new' || adminTab === 'shipment-edit') && (
            <ShipmentEditor
              shipmentId={adminTab === 'shipment-edit' ? selectedShipmentId : undefined}
              onSelectTab={handleAdminSelectTab}
              onOpenWaybill={(shp) => setSelectedWaybillShipment(shp)}
            />
          )}

          {adminTab === 'quotes' && <QuotesManager />}

          {adminTab === 'rates' && <RatesManager />}

          {adminTab === 'staff' && <StaffManager />}
        </AdminLayout>

        {selectedWaybillShipment && (
          <WaybillModal
            shipment={selectedWaybillShipment}
            onClose={() => setSelectedWaybillShipment(null)}
          />
        )}
      </>
    );
  }

  // View: Public Landing Page
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#183343]">
      <Header
        onNavigateAuth={() => navigateTo(currentUser ? 'admin' : 'auth', currentUser ? '/admin' : '/login')}
        onNavigateHome={() => navigateTo('public', '/')}
      />

      <main className="flex-1">
        <Hero
          onQuoteClick={() => handleQuoteClick()}
          onTrackClick={() => handleScrollTo('tracking')}
          onExploreClick={() => handleScrollTo('services')}
        />

        <ServicesSection onQuoteClick={handleQuoteClick} />

        <SectorsSection onQuoteClick={() => handleQuoteClick()} />

        <TrackingSection />

        <QuoteCalculatorSection initialMode={initialCalculatorMode} />
      </main>

      <Footer
        onNavigateAuth={() => navigateTo(currentUser ? 'admin' : 'auth', currentUser ? '/admin' : '/login')}
        onNavigateHome={() => navigateTo('public', '/')}
      />

      {/* Floating Fast Action: WhatsApp, Direct Call and Staff Quick Badge */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5 no-print">
        <a
          href="https://wa.me/967780888887"
          target="_blank"
          rel="noreferrer"
          aria-label="تواصل عبر واتساب 780888887"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="تواصل معنا عبر واتساب (780888887)"
        >
          <MessageCircle size={26} />
        </a>

        <a
          href="tel:780888887"
          aria-label="اتصال مباشر 780888887"
          className="w-12 h-12 rounded-full bg-[#102b3b] text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="اتصال مباشر: 780888887"
        >
          <Phone size={22} />
        </a>

        {currentUser && (
          <button
            onClick={() => navigateTo('admin', '/admin')}
            className="px-3 py-1.5 rounded-full bg-[#102b3b] text-amber-400 border border-amber-400 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
          >
            <Shield size={14} />
            <span>لوحة التحكم</span>
          </button>
        )}
      </div>

      <PwaInstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
