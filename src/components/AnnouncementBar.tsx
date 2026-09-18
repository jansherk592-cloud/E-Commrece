import React from 'react';
import { Truck, MessageCircle, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { businessInfo, currentView, setCurrentView } = useStore();

  if (!businessInfo.announcementBarActive || currentView === 'admin') return null;

  return (
    <div className="bg-stone-900 text-white text-[11px] font-medium py-1.5 px-4 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-stone-400">
          <Truck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Complimentary Express Shipping Over $150</span>
        </div>

        <div className="flex-1 md:flex-initial text-center md:text-left truncate px-2 font-semibold text-stone-200">
          {businessInfo.announcementBarText}
        </div>

        <div className="hidden sm:flex items-center space-x-4 text-stone-400">
          <button
            onClick={() => {
              setCurrentView('track-order');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Track Order
          </button>
          <span className="text-stone-700">|</span>
          <button
            onClick={() => {
              const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
              window.open(`https://wa.me/${cleanNumber}`, '_blank');
            }}
            className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <MessageCircle className="w-3 h-3 fill-emerald-400" />
            <span>WhatsApp Desk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
