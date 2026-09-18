import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const OrderTrackingSearch: React.FC = () => {
  const { orders, setCurrentView } = useStore();
  const [trackingInput, setTrackingInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    const term = trackingInput.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === term ||
        o.customerPhone.replace(/[^0-9]/g, '').includes(term.replace(/[^0-9]/g, '')) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === term)
    );

    setSearchedOrder(found || null);
    setSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
          <Package className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Track Your Order & Courier Delivery
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Enter your Order ID (e.g. <span className="font-mono font-bold text-stone-700">ORD-89421</span>), tracking number, or phone number.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-10">
        <div className="relative flex items-center shadow-md rounded-2xl overflow-hidden border border-stone-300 bg-white">
          <Search className="w-5 h-5 text-stone-400 absolute left-4" />
          <input
            id="order-tracker-input"
            type="text"
            required
            placeholder="e.g. ORD-89421 or +1 (415) 890-4122"
            value={trackingInput}
            onChange={(e) => {
              setTrackingInput(e.target.value);
              setSearched(false);
            }}
            className="w-full pl-12 pr-28 py-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          <button
            id="order-tracker-submit-btn"
            type="submit"
            className="absolute right-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Track
          </button>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div className="animate-fade-in">
          {searchedOrder ? (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
                <div>
                  <span className="text-xs text-stone-400">Order Reference</span>
                  <h3 className="text-xl font-extrabold text-stone-900 font-mono">{searchedOrder.id}</h3>
                  <p className="text-xs text-stone-500">
                    Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-900 text-white">
                    {searchedOrder.status}
                  </span>
                </div>
              </div>

              {/* Courier Tracking */}
              {searchedOrder.trackingNumber && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-900 font-medium">Carrier Tracking Number:</span>
                    <span className="font-mono font-bold text-emerald-950">{searchedOrder.trackingNumber}</span>
                  </div>
                  <span className="text-emerald-700 font-semibold">In Transit</span>
                </div>
              )}

              {/* Progress Timeline */}
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-4">Milestone Timeline</h4>
                <div className="space-y-4 pl-4 border-l-2 border-emerald-500">
                  {searchedOrder.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-xs text-stone-900">{event.status}</span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {event.note && <p className="text-xs text-stone-500 mt-0.5">{event.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in this order */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-bold text-stone-900 text-sm mb-3">Order Items ({searchedOrder.items.length})</h4>
                <div className="space-y-2">
                  {searchedOrder.items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1">
                      <span className="text-stone-800 font-medium">
                        {it.name} <span className="text-stone-400">× {it.quantity}</span>
                      </span>
                      <span className="font-bold text-stone-900">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-black text-stone-950">
                    <span>Total</span>
                    <span>${searchedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-8 text-center max-w-md mx-auto">
              <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <h3 className="font-bold text-stone-800 text-sm">No Order Found</h3>
              <p className="text-xs text-stone-500 mt-1">
                We could not find an active order matching that reference or phone number.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
