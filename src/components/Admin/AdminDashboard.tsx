import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminDashboard: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { orders, products, announcements, updateOrderStatus, showToast } = useStore();

  const totalRevenue = orders.reduce((acc, ord) => acc + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.filter((o) => o.status !== 'Cancelled').length : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const pendingOrders = orders.filter((o) => o.status === 'Pending');

  const exportSalesCsv = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Items Count', 'Payment Method', 'Status', 'Total'];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      o.items.reduce((s, it) => s + it.quantity, 0),
      o.paymentMethod,
      o.status,
      o.total.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Report Exported', 'Sales CSV generated and downloaded.', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Executive Performance Overview</h2>
          <p className="text-xs text-stone-500">Live operational data, revenue stats, and catalog telemetry.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="export-sales-csv-btn"
            onClick={exportSalesCsv}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-stone-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Sales CSV</span>
          </button>
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Net Sales</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-950">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-stone-500">From {orders.length} total customer orders</p>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Orders</span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-950">{orders.length}</span>
            {pendingOrders.length > 0 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {pendingOrders.length} Pending
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500">
            {orders.filter((o) => o.status === 'Delivered').length} successfully delivered
          </p>
        </div>

        {/* Average Order Value */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Average Order Value</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-950">${averageOrderValue.toFixed(2)}</span>
            <span className="text-xs font-semibold text-stone-500">per transaction</span>
          </div>
          <p className="text-[11px] text-stone-500">Reflects applied promos and bundle orders</p>
        </div>

        {/* Catalog Items & Low Stock */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Active Inventory</span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-950">{products.length} SKUs</span>
            {lowStockProducts.length > 0 && (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                {lowStockProducts.length} Low
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500">
            {products.reduce((acc, p) => acc + p.stock, 0)} total units across warehouse
          </p>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Low Inventory Alert: {lowStockProducts.length} products have 10 or fewer units remaining.
              </p>
              <p className="text-[11px] text-amber-700">
                {lowStockProducts.map((p) => `${p.name} (${p.stock} units)`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-1.5 bg-amber-900 text-white rounded-lg text-xs font-bold shrink-0 hover:bg-amber-800"
          >
            Update Stocks
          </button>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Recent Store Orders</h3>
            <p className="text-xs text-stone-500">Latest customer transactions and fulfillment statuses.</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-stone-900 hover:underline"
          >
            View All ({orders.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Items</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-stone-900">{order.id}</td>
                  <td className="py-3.5 px-5">
                    <p className="font-bold text-stone-900">{order.customerName}</p>
                    <p className="text-[11px] text-stone-400">{order.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-5 text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-5 text-stone-600">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-3.5 px-5 capitalize font-medium text-stone-700">
                    {order.paymentMethod.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-5 font-black text-stone-900">${order.total.toFixed(2)}</td>
                  <td className="py-3.5 px-5">
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
                      onClick={() => onNavigateTab('orders')}
                      className="text-stone-600 hover:text-stone-900 font-semibold underline"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
