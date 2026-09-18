import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Bell,
  Sliders,
  Search,
  Users,
  LogOut,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminAuthModal } from './AdminAuthModal';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminAnnouncements } from './AdminAnnouncements';
import { AdminContentSettings } from './AdminContentSettings';
import { AdminSEO } from './AdminSEO';
import { AdminUsers } from './AdminUsers';

export const AdminPanel: React.FC = () => {
  const { currentAdmin, logoutAdmin, setCurrentView, businessInfo } = useStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (!currentAdmin) {
    return <AdminAuthModal />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Stock', icon: Package },
    { id: 'orders', label: 'Orders & Tracking', icon: ShoppingBag },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'content', label: 'Store Settings & Data', icon: Sliders },
    { id: 'seo', label: 'SEO & Google Indexing', icon: Search },
    { id: 'users', label: 'Admin Team & Roles', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm shadow-sm">
              ▲
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                <span>{businessInfo.name}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-amber-400 font-bold">
                  Admin Console
                </span>
              </h1>
              <p className="text-[10px] text-stone-400">Session User: {currentAdmin.name} ({currentAdmin.role})</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="admin-to-storefront-btn"
              onClick={() => setCurrentView('home')}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={logoutAdmin}
              className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Sub-bar */}
        <div className="bg-stone-950/80 border-t border-stone-800/80 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-stone-800 text-amber-400 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={setActiveTab} />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'announcements' && <AdminAnnouncements />}
        {activeTab === 'content' && <AdminContentSettings />}
        {activeTab === 'seo' && <AdminSEO />}
        {activeTab === 'users' && <AdminUsers />}
      </main>
    </div>
  );
};
