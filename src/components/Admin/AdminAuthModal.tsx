import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminRole } from '../../types';

export const AdminAuthModal: React.FC = () => {
  const { loginAdmin, adminUsers, setCurrentView } = useStore();
  const [email, setEmail] = useState('admin@apexcommerce.com');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Super Admin');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginAdmin(email, selectedRole);
    if (!success) {
      setError('Invalid credentials or unauthorized account.');
    }
  };

  const handleQuickFill = (userEmail: string, role: AdminRole) => {
    setEmail(userEmail);
    setSelectedRole(role);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-stone-900 text-white text-center">
          <div className="w-14 h-14 rounded-2xl bg-stone-800 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-stone-700 shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Admin & Management Portal</h2>
          <p className="text-xs text-stone-400 mt-1">
            Secure administrative control room for inventory, orders, and content.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Access Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Account Role Privilege</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="Super Admin">Super Admin (Full Read/Write Access)</option>
              <option value="Store Manager">Store Manager (Products, Orders, Offers)</option>
              <option value="Support">Support (Orders, Tracking, Customer Care)</option>
            </select>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Authenticate & Access Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Demo Quick Switcher */}
          <div className="pt-4 border-t border-stone-100">
            <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              One-Click Demo Profiles:
            </span>
            <div className="space-y-1.5">
              {adminUsers.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => handleQuickFill(u.email, u.role)}
                  className="w-full py-1.5 px-2.5 bg-stone-50 hover:bg-stone-100 rounded-lg text-left text-xs text-stone-700 flex items-center justify-between border border-stone-200/60"
                >
                  <span className="font-semibold truncate">{u.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-bold">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="text-xs text-stone-500 hover:text-stone-900 underline"
            >
              Return to Customer Storefront
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
