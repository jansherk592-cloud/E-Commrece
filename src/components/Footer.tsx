import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Lock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { businessInfo, categories, setSelectedCategory, setCurrentView } = useStore();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('all-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWhatsApp = () => {
    const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${businessInfo.name}! I am browsing your online store and would like to ask a quick question.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-xs">
      {/* Trust & Guarantee Badges Bar */}
      <div className="border-b border-stone-800/80 py-8 bg-stone-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-stone-800 text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Insured Courier Delivery</h4>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Free standard express shipping on qualifying orders over $150.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-stone-800 text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">2-Year Precision Warranty</h4>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Full manufacturer coverage against mechanical and hardware defects.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-stone-800 text-indigo-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct WhatsApp Support</h4>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Speak directly with technical consultants for order & setup guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-950 font-black flex items-center justify-center text-sm shadow">
                ▲
              </div>
              <span className="text-lg font-black text-white tracking-tight">{businessInfo.name}</span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              {businessInfo.tagline}. Designed for professionals who demand meticulous craftsmanship, pristine ergonomics, and reliable long-term durability.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-2 pt-2">
              <a
                href={businessInfo.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-900 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={businessInfo.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-900 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-white transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={businessInfo.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-900 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-white transition-colors"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={businessInfo.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-900 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories Col */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Catalog</h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => handleCategoryClick(c.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation Col */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Assistance</h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('track-order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Order Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Our Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Map
                </button>
              </li>
            </ul>
          </div>

          {/* Business Contact Desk */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Showroom & Inquiries</h4>
            <div className="space-y-2.5 text-stone-400 text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>
                  {businessInfo.address}, {businessInfo.city}, {businessInfo.country}
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <a href={`tel:${businessInfo.phone}`} className="hover:text-white">
                  {businessInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-500" />
                <button onClick={handleOpenWhatsApp} className="hover:text-emerald-400 text-emerald-500 font-semibold cursor-pointer">
                  WhatsApp: {businessInfo.whatsappNumber}
                </button>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <a href={`mailto:${businessInfo.email}`} className="hover:text-white">
                  {businessInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Link */}
        <div className="pt-8 mt-12 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} {businessInfo.name}, Inc. All rights reserved.</p>

          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Encrypted
            </span>
            <button
              id="footer-admin-link"
              onClick={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-stone-400 hover:text-amber-400 transition-colors font-semibold cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
