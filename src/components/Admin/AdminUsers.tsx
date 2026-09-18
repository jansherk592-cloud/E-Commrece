import React, { useState } from 'react';
import { Shield, UserPlus, Trash2, Check, UserCheck, KeyRound } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminRole, AdminUser } from '../../types';

export const AdminUsers: React.FC = () => {
  const { adminUsers, currentAdmin, addAdminUser, deleteAdminUser, showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('Store Manager');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addAdminUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      active: true,
    });

    setName('');
    setEmail('');
    setRole('Store Manager');
    showToast('Admin Created', `New team member ${name} granted ${role} privileges.`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in text-xs">
      <div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">Team Roles & Permissions</h2>
        <p className="text-stone-500">
          Manage administrative staff accounts, assign granular role privileges, and review system access.
        </p>
      </div>

      {/* Add Admin Staff */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-stone-900">Provision Team Member</h3>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Staff Member Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
          />
          <input
            type="email"
            required
            placeholder="Work Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white font-bold"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Store Manager">Store Manager</option>
            <option value="Support">Support Specialist</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Grant Access</span>
          </button>
        </form>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-stone-50 border-b border-stone-200 font-bold text-stone-800">
          Authorized System Administrators ({adminUsers.length})
        </div>
        <div className="divide-y divide-stone-100">
          {adminUsers.map((user) => {
            const isSelf = currentAdmin?.id === user.id;
            return (
              <div key={user.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900 text-sm">{user.name}</span>
                      {isSelf && (
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full">
                          You (Current Session)
                        </span>
                      )}
                    </div>
                    <span className="text-stone-500">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'Super Admin'
                        ? 'bg-amber-100 text-amber-900'
                        : user.role === 'Store Manager'
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {user.role}
                  </span>

                  {!isSelf && (
                    <button
                      onClick={() => {
                        if (confirm(`Revoke admin privileges for ${user.name}?`)) {
                          deleteAdminUser(user.id);
                        }
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Revoke Admin Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Privileges Reference Matrix */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-900 text-sm">Role Privilege Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600">
              <tr>
                <th className="py-2.5 px-4">Capability</th>
                <th className="py-2.5 px-4 text-center">Super Admin</th>
                <th className="py-2.5 px-4 text-center">Store Manager</th>
                <th className="py-2.5 px-4 text-center">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="py-2 px-4 font-medium">Add, Edit, Delete Products & Inventory</td>
                <td className="py-2 px-4 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2 px-4 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2 px-4 text-center text-stone-300">✕</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">Fulfill Orders & Update Tracking Codes</td>
                <td className="py-2 px-4 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2 px-4 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2 px-4 text-center text-emerald-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">Publish Announcements & Flash Offers</td>
                <td className="py-2 px-4 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2 px-4 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2 px-4 text-center text-stone-300">✕</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">Store Profile, Phone & WhatsApp Configuration</td>
                <td className="py-2 px-4 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2 px-4 text-center text-stone-300">✕</td>
                <td className="py-2 px-4 text-center text-stone-300">✕</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">Export/Import Database Backups & Team Roles</td>
                <td className="py-2 px-4 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2 px-4 text-center text-stone-300">✕</td>
                <td className="py-2 px-4 text-center text-stone-300">✕</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
