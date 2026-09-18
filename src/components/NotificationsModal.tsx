import React, { useState } from 'react';
import { X, Bell, Tag, Sparkles, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AnnouncementType } from '../types';

export const NotificationsModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, announcements, setCurrentView } = useStore();
  const [filter, setFilter] = useState<'all' | AnnouncementType>('all');

  if (!isNotificationsOpen) return null;

  const filtered = announcements.filter((ann) => {
    if (!ann.active) return false;
    if (filter === 'all') return true;
    return ann.type === filter;
  });

  const getTypeBadge = (type: AnnouncementType) => {
    switch (type) {
      case 'new_arrival':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3 h-3" /> New Arrival
          </span>
        );
      case 'discount':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <Tag className="w-3 h-3" /> Discount Offer
          </span>
        );
      case 'special_offer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Tag className="w-3 h-3" /> Special Promo
          </span>
        );
      case 'important':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3" /> Important
          </span>
        );
      case 'business':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 border border-stone-200">
            <Building2 className="w-3 h-3" /> Store News
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Store Announcements & Offers</h2>
              <p className="text-xs text-stone-500">Stay informed on new launches, promotions, and store updates</p>
            </div>
          </div>
          <button
            id="close-notifications-btn"
            onClick={() => setIsNotificationsOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-stone-100 bg-white flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              filter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Updates ({announcements.filter((a) => a.active).length})
          </button>
          <button
            onClick={() => setFilter('special_offer')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              filter === 'special_offer' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Special Offers
          </button>
          <button
            onClick={() => setFilter('new_arrival')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              filter === 'new_arrival' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            New Arrivals
          </button>
          <button
            onClick={() => setFilter('discount')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              filter === 'discount' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Discounts
          </button>
          <button
            onClick={() => setFilter('business')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              filter === 'business' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Business News
          </button>
        </div>

        {/* Announcements List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 divide-y divide-stone-100">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <CheckCircle2 className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="font-medium text-stone-700">No announcements in this category</p>
              <p className="text-xs text-stone-400 mt-1">Check back soon for upcoming product drops and offers.</p>
            </div>
          ) : (
            filtered.map((ann) => (
              <div key={ann.id} className="pt-4 first:pt-0">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(ann.type)}
                    <span className="text-xs text-stone-400">
                      {new Date(ann.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1.5">{ann.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{ann.content}</p>
                {ann.linkUrl && (
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      if (ann.linkUrl?.startsWith('#prod-')) {
                        const id = ann.linkUrl.replace('#', '');
                        window.location.hash = `product-${id}`;
                      } else {
                        setCurrentView('all-products');
                      }
                    }}
                    className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-2.5 underline underline-offset-4"
                  >
                    View Details & Shop Now →
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Active Announcements: {filtered.length}</span>
          <button
            id="dismiss-notifications-footer-btn"
            onClick={() => setIsNotificationsOpen(false)}
            className="px-4 py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
