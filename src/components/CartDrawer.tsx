import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
  ShieldCheck,
  MessageCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    appliedPromo,
    applyPromo,
    removePromo,
    setCurrentView,
    businessInfo,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const discountAmount = appliedPromo
    ? Number(((cartSubtotal * appliedPromo.discountPercent) / 100).toFixed(2))
    : 0;

  const estimatedShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : 15;
  const estimatedTotal = Number((cartSubtotal + estimatedShipping - discountAmount).toFixed(2));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyPromo(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppFastOrder = () => {
    const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsList = cart
      .map((item) => `- ${item.product.name} (x${item.quantity}) - $${(item.product.discountPrice ?? item.product.price) * item.quantity}`)
      .join('\n');

    const msg = encodeURIComponent(
      `Hello ${businessInfo.name}! I would like to place an order for the following items in my cart:\n\n${itemsList}\n\nEstimated Total: $${estimatedTotal}\nPlease guide me through payment and shipping!`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-stone-900" />
              <h2 className="text-base font-bold text-stone-900">Your Shopping Cart</h2>
              <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 text-xs font-bold">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-stone-900 text-white p-3.5 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                {amountNeeded === 0
                  ? '🎉 Free Express Delivery Unlocked!'
                  : `Add $${amountNeeded.toFixed(2)} more for Free Express Delivery`}
              </span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-4">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-stone-800 text-base mb-1">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Discover our engineered wireless audio, smart gear, and ergonomics to get started.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('all-products');
                  }}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const unitPrice = item.product.discountPrice ?? item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-all shadow-sm"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-100"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 truncate leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs my-1">
                        <span className="font-extrabold text-stone-900">${unitPrice}</span>
                        {item.product.discountPrice && (
                          <span className="text-[10px] text-stone-400 line-through">
                            ${item.product.price}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-stone-600 hover:bg-stone-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1.5 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-stone-900">
                          ${(unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Calculations and Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
              {/* Coupon Code Section */}
              {appliedPromo ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon {appliedPromo.code} (-{appliedPromo.discountPercent}%)</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-stone-400 hover:text-stone-800 text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. APEX15)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 uppercase placeholder:normal-case"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-stone-200 pt-3">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Promo Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Courier</span>
                  <span className="font-semibold text-stone-900">
                    {estimatedShipping === 0 ? 'FREE' : `$${estimatedShipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-950 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span>${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2">
                <button
                  id="cart-proceed-checkout-btn"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="cart-whatsapp-order-btn"
                  onClick={handleWhatsAppFastOrder}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>Order Directly via WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted & Verified Safe Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
