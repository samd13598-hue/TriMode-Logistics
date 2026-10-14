import React from 'react';
import {
  LayoutDashboard,
  Package,
  FileSpreadsheet,
  Users,
  Coins,
  LogOut,
  ArrowLeft,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { Brand } from '../common';
import { useStore } from '../../context/StoreContext';

export type AdminTab = 'overview' | 'shipments' | 'shipment-new' | 'shipment-edit' | 'quotes' | 'rates' | 'staff';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab, shipmentId?: string) => void;
  onBackToHome: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onBackToHome,
  children,
}) => {
  const { currentUser, logout } = useStore();

  const navItems = [
    {
      id: 'overview' as AdminTab,
      label: 'نظرة عامة',
      icon: LayoutDashboard,
    },
    {
      id: 'shipments' as AdminTab,
      label: 'الشحنات',
      icon: Package,
    },
    {
      id: 'quotes' as AdminTab,
      label: 'طلبات الأسعار',
      icon: FileSpreadsheet,
    },
    ...(currentUser?.role === 'admin'
      ? [
          {
            id: 'staff' as AdminTab,
            label: 'الموظفون',
            icon: Users,
          },
          {
            id: 'rates' as AdminTab,
            label: 'أسعار الحاسبة',
            icon: Coins,
          },
        ]
      : []),
  ];

  return (
    <div className="admin-shell min-h-screen bg-[#f0f4f7] flex flex-col md:grid md:grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside className="admin-sidebar bg-[#102b3b] text-white p-5 flex flex-col justify-between border-l border-slate-800">
        <div>
          <div className="mb-6">
            <Brand light onClick={onBackToHome} />
          </div>

          <div className="sidebar-caption text-[11px] font-bold tracking-widest text-slate-400 mb-3 px-3 uppercase">
            مساحة العمل
          </div>

          <nav className="flex flex-col gap-1.5" aria-label="التنقل في لوحة التحكم">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentTab === item.id ||
                (item.id === 'shipments' &&
                  (currentTab === 'shipment-new' || currentTab === 'shipment-edit'));

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-right w-full ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom / Current User */}
        <div className="sidebar-bottom pt-5 border-t border-white/10 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="session-avatar w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-sm">
              {currentUser?.name?.slice(0, 1) || 'ف'}
            </div>
            <div className="session-info min-w-0 leading-tight">
              <strong className="block text-xs font-bold text-white truncate">
                {currentUser?.name || 'عضو الفريق'}
              </strong>
              <span className="text-[10px] text-amber-400">
                {currentUser?.role === 'admin' ? 'مدير النظام' : 'موظف شحنات'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              onBackToHome();
            }}
            className="icon-button text-slate-400 hover:text-red-400 hover:bg-white/10 p-2 rounded transition-colors cursor-pointer"
            title="تسجيل الخروج"
            aria-label="تسجيل الخروج"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="admin-body flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <header className="admin-topbar bg-white border-b border-[#e6eaeb] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#102b3b]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>لوحة تحكم تراي مود للخدمات اللوجستية</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('shipment-new')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>شحنة جديدة</span>
            </button>

            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              <span>عرض الموقع</span>
              <ExternalLink size={13} />
            </button>

            <button
              onClick={() => {
                logout();
                onBackToHome();
              }}
              className="icon-button text-slate-500 hover:text-red-600 p-1.5 rounded cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
