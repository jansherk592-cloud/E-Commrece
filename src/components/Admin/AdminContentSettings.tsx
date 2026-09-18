import React, { useState } from 'react';
import {
  Building2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Megaphone,
  Save,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Tag,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BusinessInfo, PromoCode, Category } from '../../types';

export const AdminContentSettings: React.FC = () => {
  const {
    businessInfo,
    updateBusinessInfo,
    promoCodes,
    addPromoCode,
    deletePromoCode,
    categories,
    addCategory,
    deleteCategory,
    exportDataJson,
    importDataJson,
    resetToDefaults,
    showToast,
  } = useStore();

  const [info, setInfo] = useState<BusinessInfo>(businessInfo);

  // New Coupon Form
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('15');
  const [couponMinSpend, setCouponMinSpend] = useState('100');

  // New Category Form
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessInfo(info);
    showToast('Settings Saved', 'Business details and storefront config updated.', 'success');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    addPromoCode({
      code: couponCode.trim().toUpperCase(),
      discountPercent: parseInt(couponDiscount, 10),
      description: `${couponDiscount}% storewide deduction`,
      minSpend: parseFloat(couponMinSpend),
      active: true,
    });
    setCouponCode('');
    setCouponDiscount('15');
    setCouponMinSpend('100');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    addCategory({
      name: catName.trim(),
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      imageUrl: catImage.trim() || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    });
    setCatName('');
    setCatImage('');
  };

  const handleExportBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex_commerce_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Database Exported', 'Full store backup JSON downloaded.', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJson(content);
        if (success) {
          showToast('Data Restored', 'Database state successfully imported.', 'success');
        } else {
          showToast('Import Error', 'Invalid JSON backup format.', 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-10 animate-fade-in text-xs">
      {/* Business Profile & Brand Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-stone-900">Brand Profile & Contact Configuration</h3>
          <p className="text-stone-500">
            Customize official business metadata, phone, direct WhatsApp desk, and header announcement banner.
          </p>
        </div>

        <form onSubmit={handleSaveInfo} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Company / Store Name</label>
              <input
                type="text"
                required
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={info.tagline}
                onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Customer Support Phone Number</label>
              <input
                type="tel"
                required
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">WhatsApp Order Desk Number</label>
              <input
                type="tel"
                required
                value={info.whatsappNumber}
                onChange={(e) => setInfo({ ...info, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Official Support Email</label>
              <input
                type="email"
                required
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={info.hours}
                onChange={(e) => setInfo({ ...info, hours: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Physical Showroom / Headquarters Address</label>
              <input
                type="text"
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">City / State</label>
              <input
                type="text"
                value={info.city}
                onChange={(e) => setInfo({ ...info, city: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Country</label>
              <input
                type="text"
                value={info.country}
                onChange={(e) => setInfo({ ...info, country: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Brand Heritage & About Story</label>
              <textarea
                rows={3}
                value={info.aboutStory}
                onChange={(e) => setInfo({ ...info, aboutStory: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Header Announcement Bar Settings */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800">Top Header Announcement Bar</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={info.announcementBarActive}
                  onChange={(e) => setInfo({ ...info, announcementBarActive: e.target.checked })}
                  className="rounded text-stone-900"
                />
                <span className="font-semibold text-stone-700">Display to visitors</span>
              </label>
            </div>
            <input
              type="text"
              value={info.announcementBarText}
              onChange={(e) => setInfo({ ...info, announcementBarText: e.target.value })}
              placeholder="e.g. Free insured worldwide delivery on all orders over $150 • Official Manufacturer Warranty"
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Update Storefront Profile</span>
          </button>
        </form>
      </div>

      {/* Categories Management */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-stone-900">Product Categories</h3>
          <p className="text-stone-500">Add or manage shop taxonomy and department image banners.</p>
        </div>

        {/* Add Category */}
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <input
            type="text"
            required
            placeholder="New Category Title (e.g. Mechanical Keyboards)"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl"
          />
          <input
            type="url"
            placeholder="Category Cover Image URL"
            value={catImage}
            onChange={(e) => setCatImage(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 shrink-0"
          >
            Add Category
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="p-3 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <img src={c.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'} alt={c.name} className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-stone-900 truncate">{c.name}</p>
                  <p className="text-[10px] text-stone-400 font-mono">/{c.slug}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Remove category "${c.name}"?`)) deleteCategory(c.id);
                }}
                className="text-stone-400 hover:text-rose-600 p-1.5"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Promo & Discount Coupons */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-stone-900">Promotions & Coupon Codes</h3>
          <p className="text-stone-500">Issue custom percentage promotional codes redeemable at cart or checkout.</p>
        </div>

        {/* Add Coupon */}
        <form onSubmit={handleAddCoupon} className="flex flex-col sm:flex-row gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <input
            type="text"
            required
            placeholder="Coupon Code (e.g. VIP25)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl uppercase font-mono font-bold"
          />
          <input
            type="number"
            min="1"
            max="90"
            required
            placeholder="Discount %"
            value={couponDiscount}
            onChange={(e) => setCouponDiscount(e.target.value)}
            className="w-full sm:w-28 px-3 py-2 bg-white border border-stone-300 rounded-xl"
          />
          <input
            type="number"
            min="0"
            required
            placeholder="Min Spend $"
            value={couponMinSpend}
            onChange={(e) => setCouponMinSpend(e.target.value)}
            className="w-full sm:w-28 px-3 py-2 bg-white border border-stone-300 rounded-xl"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 shrink-0"
          >
            Create Coupon
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {promoCodes.map((p) => (
            <div key={p.code} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <span className="font-mono font-black text-stone-900 text-sm tracking-wide">{p.code}</span>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  {p.discountPercent}% OFF (Orders over ${p.minSpend})
                </p>
              </div>
              <button
                onClick={() => deletePromoCode(p.code)}
                className="text-stone-400 hover:text-rose-600 p-1"
                title="Remove Coupon"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Database Backup & Restore */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">Database Backup & Disaster Recovery</h3>
          <p className="text-stone-500">
            Export a full standalone JSON image of all catalog products, customer orders, and settings, or reset to initial demo seeds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            id="admin-export-backup-btn"
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Database JSON Backup</span>
          </button>

          <label className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center gap-2 border border-stone-200 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Restore From Backup JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Reset entire catalog, orders, and announcements to standard seed state?')) {
                resetToDefaults();
              }
            }}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold flex items-center gap-2 border border-rose-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Store to Factory State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
