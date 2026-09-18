import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CreditCard,
  Banknote,
  Building,
  MessageCircle,
  CheckCircle2,
  Tag,
  Lock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    directBuyItem,
    appliedPromo,
    applyPromo,
    removePromo,
    createOrder,
    setCurrentView,
    showToast,
  } = useStore();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('94105');
  const [country, setCountry] = useState('United States');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'card_online' | 'bank_transfer' | 'whatsapp_order'>('card_online');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine items being purchased
  const checkoutItems = directBuyItem
    ? [
        {
          productId: directBuyItem.product.id,
          name: directBuyItem.product.name,
          price: directBuyItem.product.discountPrice ?? directBuyItem.product.price,
          quantity: directBuyItem.quantity,
          image: directBuyItem.product.images[0],
        },
      ]
    : cart.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        price: c.product.discountPrice ?? c.product.price,
        quantity: c.quantity,
        image: c.product.images[0],
      }));

  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-stone-900 mb-2">No items to checkout</h2>
        <p className="text-sm text-stone-500 mb-6">Your shopping cart or direct buy queue is empty.</p>
        <button
          onClick={() => setCurrentView('all-products')}
          className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const subtotal = checkoutItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const shippingFee = subtotal >= 150 ? 0 : 15;
  const discountAmount = appliedPromo
    ? Number(((subtotal * appliedPromo.discountPercent) / 100).toFixed(2))
    : 0;
  const grandTotal = Number((subtotal + shippingFee - discountAmount).toFixed(2));

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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !address.trim()) {
      showToast('Missing Details', 'Please complete your contact name, phone, email, and street address.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: {
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
        },
        notes: deliveryNotes.trim() || undefined,
        paymentMethod,
        itemsOverride: checkoutItems,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
        <button
          id="checkout-back-btn"
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
        <div className="flex items-center space-x-2 text-xs text-stone-500">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold text-stone-800">2-Step Express Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Customer & Shipping Information */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact Information */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-stone-900 text-base">Contact & Recipient Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    placeholder="e.g. Jonathan Vance"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-stone-900 text-base">Delivery Address</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Street Address & Unit / Suite <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    placeholder="e.g. 500 Howard St, Suite 400"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">State / Prov</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Delivery Instructions / Building Access (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Leave with reception or door code #1234"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-stone-900 text-base">Select Payment Method</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Credit Card / Instant */}
                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'card_online'
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-stone-900" />
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'card_online'}
                      onChange={() => setPaymentMethod('card_online')}
                      className="text-stone-900"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-900">Credit / Debit Card</span>
                  <span className="text-[11px] text-stone-500">Instant online authorization</span>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-5 h-5 text-emerald-700" />
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="text-stone-900"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-stone-500">Pay cash upon courier arrival</span>
                </label>

                {/* Direct Bank Transfer */}
                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Building className="w-5 h-5 text-indigo-700" />
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="text-stone-900"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-900">Bank Wire / ACH</span>
                  <span className="text-[11px] text-stone-500">Commercial wire invoice</span>
                </label>

                {/* WhatsApp Guided Order */}
                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'whatsapp_order'
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'whatsapp_order'}
                      onChange={() => setPaymentMethod('whatsapp_order')}
                      className="text-stone-900"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-900">WhatsApp Guided</span>
                  <span className="text-[11px] text-stone-500">Confirm directly with an agent</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5 sticky top-28">
              <h3 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
                Order Summary ({checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-stone-100">
                {checkoutItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 pt-3 first:pt-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-stone-100 border border-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{item.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-stone-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <div className="pt-2 border-t border-stone-100">
                {appliedPromo ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Code: {appliedPromo.code} (-{appliedPromo.discountPercent}%)
                    </span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-stone-500 hover:text-stone-900 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Coupon (e.g. APEX15)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl uppercase placeholder:normal-case"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Courier Shipping</span>
                  <span className="font-semibold text-stone-900">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-black text-stone-950 pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="place-order-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isSubmitting ? 'Verifying & Securing Order...' : `Place Order ($${grandTotal.toFixed(2)})`}</span>
              </button>

              <div className="space-y-1.5 pt-2 text-[11px] text-stone-400 text-center">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Order Confirmation & Tracking ID Provided</span>
                </p>
                <p className="flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-500" />
                  <span>Insured Door-to-Door Courier Delivery</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
