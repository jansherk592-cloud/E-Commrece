import React, { useState } from 'react';
import { MessageCircle, Phone, Package, X, ChevronUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FloatingContactButtons: React.FC = () => {
  const { businessInfo, currentView, setCurrentView } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't show floating customer buttons when in admin console
  if (currentView === 'admin') return null;

  const handleWhatsApp = () => {
    const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${businessInfo.name}! I need assistance with an item in your store.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2.5">
      {isExpanded && (
        <div className="flex flex-col items-end space-y-2 animate-fade-in">
          {/* Order Tracking Button */}
          <button
            id="floating-track-order-btn"
            onClick={() => {
              setCurrentView('track-order');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-white text-stone-800 rounded-full shadow-lg border border-stone-200 text-xs font-bold hover:bg-stone-50 transition-all hover:scale-105 cursor-pointer"
          >
            <Package className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Track Order</span>
          </button>

          {/* Quick Call Button */}
          <a
            id="floating-call-btn"
            href={`tel:${businessInfo.phone}`}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-stone-900 text-white rounded-full shadow-lg text-xs font-bold hover:bg-stone-800 transition-all hover:scale-105 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Call Desk</span>
          </a>
        </div>
      )}

      {/* Main WhatsApp Primary Floating Action Button */}
      <div className="flex items-center space-x-2">
        <button
          id="floating-whatsapp-btn"
          onClick={handleWhatsApp}
          className="group flex items-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl transition-all hover:scale-105 cursor-pointer"
          title="Chat with Technical Advisor on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="text-xs font-bold pr-1">Chat on WhatsApp</span>
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 bg-stone-800/80 hover:bg-stone-800 text-stone-300 rounded-full text-xs shadow-md transition-all"
          title={isExpanded ? 'Collapse quick actions' : 'Expand quick actions'}
        >
          {isExpanded ? <X className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
