import React from 'react';
import {
  CheckCircle,
  Package,
  Printer,
  MessageCircle,
  ArrowRight,
  Clock,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  Building,
  Banknote,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { lastPlacedOrder, setCurrentView, businessInfo } = useStore();

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-stone-900 mb-2">No active order session</h2>
        <p className="text-sm text-stone-500 mb-6">You can check your order status using our tracker.</p>
        <button
          onClick={() => setCurrentView('track-order')}
          className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl"
        >
          Track An Existing Order
        </button>
      </div>
    );
  }

  const order = lastPlacedOrder;

  const handlePrint = () => {
    window.print();
  };

  const handleSendToWhatsApp = () => {
    const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsText = order.items
      .map((it) => `${it.name} (x${it.quantity}) - $${(it.price * it.quantity).toFixed(2)}`)
      .join('\n');

    const msg = encodeURIComponent(
      `Hello ${businessInfo.name} Team!\n\nI just placed Order ID: *${order.id}*.\nName: ${order.customerName}\nPhone: ${order.customerPhone}\nItems:\n${itemsText}\n\nTotal: $${order.total}\nPayment Method: ${order.paymentMethod.replace('_', ' ').toUpperCase()}\n\nPlease confirm dispatch details! Thank you.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
  };

  const statusSteps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIdx = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Top Banner */}
      <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center mb-8 shadow-sm">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <CheckCircle className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-full">
          Order Successfully Placed
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-3 mb-2">
          Thank you, {order.customerName.split(' ')[0]}!
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          We have registered your order <span className="font-mono font-bold text-stone-900">{order.id}</span>. A confirmation notification has been sent to{' '}
          <span className="font-semibold text-stone-800">{order.customerEmail}</span>.
        </p>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div className="flex items-center space-x-2 text-xs text-stone-500">
          <Clock className="w-4 h-4 text-stone-400" />
          <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="print-order-receipt-btn"
            onClick={handlePrint}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          <button
            id="whatsapp-order-copy-btn"
            onClick={handleSendToWhatsApp}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>Send Order via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Live Order Timeline Tracker */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-stone-900 text-base">Live Order Tracking</h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-900 text-white">
            Status: {order.status}
          </span>
        </div>

        {/* Stepper */}
        <div className="relative flex justify-between items-center mb-8">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentStepIdx) / (statusSteps.length - 1)) * 100}%`,
            }}
          />

          {statusSteps.map((step, idx) => {
            const isDone = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    isDone
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                    isCurrent ? 'text-emerald-700' : isDone ? 'text-stone-900' : 'text-stone-400'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tracking info */}
        {order.trackingNumber && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span className="text-stone-600">Carrier Courier Tracking Code:</span>
              <span className="font-mono font-bold text-stone-900">{order.trackingNumber}</span>
            </div>
            <span className="text-emerald-700 font-semibold">Tracked via Apex Priority Logistics</span>
          </div>
        )}
      </div>

      {/* Order Details & Summary Receipt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Shipping & Recipient Information */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm pb-3 border-b border-stone-100">
            <MapPin className="w-4 h-4 text-stone-500" />
            <span>Shipping Destination</span>
          </div>
          <div className="text-xs text-stone-600 space-y-1">
            <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-2 text-stone-500">Phone: {order.customerPhone}</p>
            <p className="text-stone-500">Email: {order.customerEmail}</p>
            {order.notes && (
              <p className="pt-2 italic text-stone-500">Special Notes: "{order.notes}"</p>
            )}
          </div>
        </div>

        {/* Payment & Invoice Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm pb-3 border-b border-stone-100">
            <CreditCard className="w-4 h-4 text-stone-500" />
            <span>Payment Summary</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Payment Mode</span>
              <span className="font-bold text-stone-900 capitalize">
                {order.paymentMethod.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-stone-900">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order.couponCode || 'Promo'})</span>
                <span>-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Courier Delivery</span>
              <span className="font-semibold text-stone-900">
                {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-stone-950 pt-2 border-t border-stone-100">
              <span>Paid / Total Due</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Order Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm mb-10">
        <div className="p-6 bg-stone-50 border-b border-stone-200">
          <h3 className="font-bold text-stone-900 text-sm">Ordered Items ({order.items.length})</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                  <p className="text-xs text-stone-500">Unit: ${item.price} • Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="text-sm font-black text-stone-900 shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Return to Shop */}
      <div className="text-center">
        <button
          id="confirmation-continue-shopping-btn"
          onClick={() => setCurrentView('home')}
          className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Continue Shopping Apex Store</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
