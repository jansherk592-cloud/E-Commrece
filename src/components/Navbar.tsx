import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Phone,
  MessageCircle,
  Bell,
  Menu,
  X,
  Shield,
  Sparkles,
  ChevronRight,
  Package,
  Layers,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    businessInfo,
    cartCount,
    setIsCartOpen,
    setIsNotificationsOpen,
    announcements,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    activeAdmin,
    filterBadge,
    setFilterBadge,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeAnnouncementsCount = announcements.filter((a) => a.active).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('all-products');
    }
  };

  const openWhatsApp = () => {
    const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${businessInfo.name}, I would like to inquire about products on your website!`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Notification / Announcement Bar */}
      {businessInfo.announcementBarActive && businessInfo.announcementBarText && (
        <div className="bg-stone-900 text-stone-100 text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="font-medium tracking-wide truncate">{businessInfo.announcementBarText}</span>
            </div>
            <div className="flex items-center space-x-4 shrink-0 text-stone-300">
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="hover:text-white underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <Bell className="w-3 h-3" />
                <span>View All Notices ({activeAnnouncementsCount})</span>
              </button>
              <span className="hidden sm:inline text-stone-600">|</span>
              <a
                href={`tel:${businessInfo.phone}`}
                className="hidden sm:inline hover:text-white flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>{businessInfo.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-6">
            <button
              id="brand-logo-btn"
              onClick={() => {
                setCurrentView('home');
                setSelectedCategory(null);
                setFilterBadge('all');
                setSearchQuery('');
              }}
              className="flex items-center space-x-3 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl tracking-tighter shadow-md group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="text-xl font-extrabold text-stone-900 tracking-tight block leading-tight">
                  {businessInfo.name}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">
                  Official Business Store
                </span>
              </div>
            </button>
          </div>

          {/* Prominent Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative">
                <input
                  id="navbar-search-input"
                  type="text"
                  placeholder="Search products by name, specs, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-2.5 bg-stone-100/80 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-16 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 px-1"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right Action Icons & Direct Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Direct Call Button */}
            <a
              id="call-contact-btn"
              href={`tel:${businessInfo.phone}`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              title="Call Customer Support"
            >
              <Phone className="w-3.5 h-3.5 text-stone-600" />
              <span>Call Us</span>
            </a>

            {/* Direct WhatsApp Contact Button */}
            <button
              id="whatsapp-contact-nav-btn"
              onClick={openWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
              title="Chat with Us on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Notifications Bell */}
            <button
              id="notifications-bell-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2.5 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
              title="View Announcements & Special Offers"
            >
              <Bell className="w-5 h-5" />
              {activeAnnouncementsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Cart Icon & Badge */}
            <button
              id="cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer shadow-sm"
              title="Open Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-semibold text-xs hidden sm:inline">Cart</span>
              <span className="bg-emerald-500 text-stone-950 font-extrabold text-[11px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {cartCount}
              </span>
            </button>

            {/* Admin Portal Link */}
            <button
              id="admin-nav-btn"
              onClick={() => setCurrentView('admin')}
              className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                currentView === 'admin'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
              }`}
              title="Business Admin Dashboard"
            >
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="hidden xl:inline">{activeAdmin ? activeAdmin.role : 'Admin'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category & Quick Links Bar (Desktop) */}
        <div className="hidden md:flex items-center justify-between py-2.5 border-t border-stone-100 text-xs font-medium text-stone-600">
          <div className="flex items-center space-x-6 overflow-x-auto">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setFilterBadge('all');
                setCurrentView('home');
              }}
              className={`hover:text-stone-900 transition-colors pb-0.5 ${
                selectedCategory === null && filterBadge === 'all' && currentView === 'home'
                  ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                  : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setFilterBadge('new-arrivals');
                setCurrentView('all-products');
              }}
              className={`hover:text-stone-900 flex items-center gap-1 ${
                filterBadge === 'new-arrivals' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>New Arrivals</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setFilterBadge('featured');
                setCurrentView('all-products');
              }}
              className={`hover:text-stone-900 ${filterBadge === 'featured' ? 'text-stone-900 font-bold' : ''}`}
            >
              Featured Products
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setFilterBadge('best-sellers');
                setCurrentView('all-products');
              }}
              className={`hover:text-stone-900 ${filterBadge === 'best-sellers' ? 'text-stone-900 font-bold' : ''}`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setFilterBadge('special-offers');
                setCurrentView('all-products');
              }}
              className={`hover:text-stone-900 text-rose-600 font-semibold ${
                filterBadge === 'special-offers' ? 'underline underline-offset-4' : ''
              }`}
            >
              Special Offers %
            </button>

            {/* Individual Categories */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setFilterBadge('all');
                  setCurrentView('all-products');
                }}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id ? 'text-stone-900 font-bold border-b-2 border-stone-900' : ''
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-5 text-stone-500 shrink-0">
            <button
              onClick={() => setCurrentView('track-order')}
              className={`hover:text-stone-900 flex items-center gap-1 ${
                currentView === 'track-order' ? 'text-stone-900 font-bold' : ''
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className={`hover:text-stone-900 ${currentView === 'about' ? 'text-stone-900 font-bold' : ''}`}
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className={`hover:text-stone-900 ${currentView === 'contact' ? 'text-stone-900 font-bold' : ''}`}
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Prominent Search Bar (Always visible on mobile) */}
      <div className="md:hidden px-4 py-2.5 bg-stone-50 border-t border-stone-200">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            id="mobile-search-input"
            type="text"
            placeholder="Search products, brands, models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-20 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded-lg"
          >
            Find
          </button>
        </form>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 animate-fade-in shadow-xl">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setCurrentView('home');
                setSelectedCategory(null);
                setFilterBadge('all');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 bg-stone-50 rounded-xl text-left font-semibold text-stone-800 flex items-center justify-between"
            >
              <span>Home Store</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
            <button
              onClick={() => {
                setCurrentView('all-products');
                setFilterBadge('new-arrivals');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 bg-emerald-50 rounded-xl text-left font-semibold text-emerald-800 flex items-center justify-between"
            >
              <span>New Arrivals</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={() => {
                setCurrentView('all-products');
                setFilterBadge('featured');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 bg-stone-50 rounded-xl text-left font-semibold text-stone-800 flex items-center justify-between"
            >
              <span>Featured Gear</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
            <button
              onClick={() => {
                setCurrentView('all-products');
                setFilterBadge('special-offers');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 bg-rose-50 rounded-xl text-left font-semibold text-rose-800 flex items-center justify-between"
            >
              <span>Special Offers</span>
              <ChevronRight className="w-4 h-4 text-rose-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">Categories</p>
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c.id);
                    setFilterBadge('all');
                    setCurrentView('all-products');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-sm text-stone-700 hover:bg-stone-50 rounded-lg flex items-center justify-between"
                >
                  <span>{c.name}</span>
                  <ChevronRight className="w-4 h-4 text-stone-300" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2 text-xs">
            <button
              onClick={() => {
                setCurrentView('track-order');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 bg-stone-100 text-stone-800 font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Track Existing Order</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('about');
                setIsMobileMenuOpen(false);
              }}
              className="p-2 text-stone-600 hover:text-stone-900 text-center"
            >
              About {businessInfo.name}
            </button>
            <button
              onClick={() => {
                setCurrentView('contact');
                setIsMobileMenuOpen(false);
              }}
              className="p-2 text-stone-600 hover:text-stone-900 text-center"
            >
              Contact & Business Address
            </button>
            <button
              onClick={() => {
                setCurrentView('admin');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Open Business Admin Panel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
