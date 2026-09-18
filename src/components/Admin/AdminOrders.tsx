import React, { useState } from 'react';
import {
  Search,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  X,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  Building,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderTracking, showToast, businessInfo } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status Change State inside Modal
  const [newStatus, setNewStatus] = useState<OrderStatus>('Pending');
  const [statusNote, setStatusNote] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setTrackingNumberInput(order.trackingNumber || '');
  };

  const handleSaveStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    if (newStatus !== selectedOrder.status || statusNote.trim()) {
      updateOrderStatus(selectedOrder.id, newStatus, statusNote.trim() || undefined);
    }

    if (trackingNumberInput.trim() !== (selectedOrder.trackingNumber || '')) {
      updateOrderTracking(selectedOrder.id, trackingNumberInput.trim());
    }

    showToast('Order Updated', `Order ${selectedOrder.id} updated to ${newStatus}.`, 'success');

    // Update active modal reference
    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            trackingNumber: trackingNumberInput.trim() || prev.trackingNumber,
          }
        : null
    );
  };

  const handleWhatsAppCustomer = (order: Order) => {
    const cleanNumber = order.customerPhone.replace(/[^0-9]/g, '');
    const trackingMsg = order.trackingNumber
      ? ` Your courier tracking code is: ${order.trackingNumber}.`
      : '';
    const text = encodeURIComponent(
      `Hello ${order.customerName}! This is ${businessInfo.name} regarding your order #${order.id}. Current Status: ${order.status}.${trackingMsg} Let us know if you need any assistance!`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.customerPhone.includes(term) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(term));
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">Order Fulfillment & Tracking</h2>
        <p className="text-xs text-stone-500">
          Process fulfillment workflows, update courier tracking numbers, and manage customer communications.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
        {/* Status Pill Tabs */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-stone-100">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {statusOptions.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  statusFilter === st
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{st}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID (ORD-...), customer name, phone, or courier tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer Name & Phone</th>
                <th className="py-3.5 px-4">City / Destination</th>
                <th className="py-3.5 px-4">Items / Total</th>
                <th className="py-3.5 px-4">Tracking Code</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-stone-900">{order.id}</td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-stone-900">{order.customerName}</p>
                      <p className="text-[11px] text-stone-500">{order.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {order.shippingAddress.city}, {order.shippingAddress.country}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-stone-900">${order.total.toFixed(2)}</span>
                      <span className="text-[10px] text-stone-400 block">
                        ({order.items.reduce((s, i) => s + i.quantity, 0)} items)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {order.trackingNumber ? (
                        <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                          {order.trackingNumber}
                        </span>
                      ) : (
                        <span className="text-stone-300 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Processing'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-stone-900 font-mono">Order {selectedOrder.id}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-900 text-white uppercase">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Received {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleWhatsAppCustomer(selectedOrder)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                  title="Notify customer on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs"
                  title="Print Packing Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status & Tracking Updater Form */}
              <form onSubmit={handleSaveStatusChange} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  Update Fulfillment & Tracking
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Status Transition</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none font-bold"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Carrier Tracking Number</label>
                    <input
                      type="text"
                      placeholder="e.g. APX-TRK-9842"
                      value={trackingNumberInput}
                      onChange={(e) => setTrackingNumberInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Timeline Milestone Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Scanned at regional outbound terminal"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-colors shadow-sm"
                  >
                    Save Fulfillment Update
                  </button>
                </div>
              </form>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-1">
                  <span className="font-bold text-stone-400 uppercase text-[10px]">Customer Contact</span>
                  <p className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</p>
                  <p className="text-stone-600">{selectedOrder.customerEmail}</p>
                  <p className="text-stone-600">{selectedOrder.customerPhone}</p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-1">
                  <span className="font-bold text-stone-400 uppercase text-[10px]">Delivery Address</span>
                  <p className="text-stone-800 font-semibold">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-stone-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-stone-600">{selectedOrder.shippingAddress.country}</p>
                  {selectedOrder.notes && (
                    <p className="text-[11px] text-stone-500 italic pt-1">Notes: "{selectedOrder.notes}"</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <div className="bg-stone-50 p-3 border-b border-stone-200 font-bold text-stone-800">
                  Itemized Manifest ({selectedOrder.items.length})
                </div>
                <div className="divide-y divide-stone-100">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={it.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{it.name}</p>
                          <p className="text-stone-500">Unit: ${it.price} × {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-1 text-right">
                  <p className="text-stone-500">Subtotal: ${selectedOrder.subtotal.toFixed(2)}</p>
                  {selectedOrder.discountAmount > 0 && (
                    <p className="text-emerald-700 font-semibold">Discount: -${selectedOrder.discountAmount.toFixed(2)}</p>
                  )}
                  <p className="text-stone-500">Shipping: ${selectedOrder.shippingFee.toFixed(2)}</p>
                  <p className="text-sm font-black text-stone-950 pt-1">
                    Total: ${selectedOrder.total.toFixed(2)} ({selectedOrder.paymentMethod.replace(/_/g, ' ')})
                  </p>
                </div>
              </div>

              {/* History Timeline */}
              <div>
                <h4 className="font-bold text-stone-800 text-xs mb-3">Fulfillment Audit Timeline</h4>
                <div className="space-y-3 pl-4 border-l-2 border-stone-300">
                  {selectedOrder.timeline.map((event, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-stone-900 ring-4 ring-white" />
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-stone-900">{event.status}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {event.note && <p className="text-stone-500 mt-0.5">{event.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
