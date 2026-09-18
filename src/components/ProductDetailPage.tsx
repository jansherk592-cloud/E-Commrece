import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingCart,
  Zap,
  MessageCircle,
  Play,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Share2,
  Check,
  AlertTriangle,
  Plus,
  Minus,
  Sparkles,
  Flame,
  Send,
  UserCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    reviews,
    addReview,
    addToCart,
    startDirectBuy,
    setActiveVideoUrl,
    businessInfo,
    setCurrentView,
    showToast,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Sync SEO Title & Structured Data
  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | ${businessInfo.name}`;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', product.description.slice(0, 160));
    }

    // Dynamic Schema.org Product structured data
    const existingScript = document.getElementById('product-schema-json');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'product-schema-json';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: product.images,
      description: product.description,
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        url: window.location.href,
        priceCurrency: 'USD',
        price: product.discountPrice ?? product.price,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
      },
    });
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('product-schema-json');
      if (s) s.remove();
    };
  }, [product, businessInfo.name]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-800">Product not found</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-semibold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleWhatsAppInquiry = () => {
    const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
    const priceText = product.discountPrice ? `$${product.discountPrice}` : `$${product.price}`;
    const text = encodeURIComponent(
      `Hello ${businessInfo.name}! I have an inquiry regarding "${product.name}" (${priceText}).\nLink: ${window.location.origin}/#product-${product.id}\nCan you assist me with the order?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      showToast('Incomplete Review', 'Please provide your name and feedback.', 'error');
      return;
    }
    setIsSubmittingReview(true);
    setTimeout(() => {
      addReview({
        productId: product.id,
        author: reviewerName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        verifiedPurchase: true,
      });
      setReviewerName('');
      setReviewComment('');
      setReviewRating(5);
      setIsSubmittingReview(false);
    }, 400);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
        <button
          id="back-to-catalog-btn"
          onClick={() => setCurrentView('all-products')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>

        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              showToast('Link Copied', 'Product link copied to clipboard.', 'info');
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900"
          title="Share Product"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Product Layout: Gallery (Left) & Purchasing Info (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left Column: Image Gallery & Video */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Large Image Box */}
          <div className="relative aspect-square w-full rounded-2xl bg-stone-100 overflow-hidden border border-stone-200 shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges Over Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.isNewArrival && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> New Arrival
                </span>
              )}
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-900 text-white shadow-md">
                  Featured Choice
                </span>
              )}
              {discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                  <Flame className="w-3.5 h-3.5" /> Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Video Preview Overlay Button */}
            {product.videoUrl && (
              <button
                id="watch-product-video-btn"
                onClick={() => setActiveVideoUrl(product.videoUrl!)}
                className="absolute bottom-4 right-4 px-4 py-2.5 bg-stone-900/90 hover:bg-stone-900 text-white rounded-xl backdrop-blur-md shadow-lg transition-all flex items-center gap-2 text-xs font-bold z-10 border border-stone-700"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Watch Product Demo Video</span>
              </button>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-stone-900 ring-2 ring-stone-900/10 scale-105'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Pricing, Actions */}
        <div className="lg:col-span-5 flex flex-col">
          {/* SKU & Category */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>SKU: {product.sku}</span>
            <span className="font-semibold text-stone-700">Official Warranty Included</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight mb-3">
            {product.name}
          </h1>

          {/* Ratings Summary */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-stone-200 text-stone-200'
                  }`}
                />
              ))}
              <span className="ml-2 font-bold text-sm text-stone-900">{product.rating}</span>
            </div>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => setActiveTab('reviews')}
              className="text-xs text-stone-600 hover:text-stone-950 font-medium underline underline-offset-4"
            >
              {product.reviewCount} customer reviews
            </button>
          </div>

          {/* Pricing Block */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 mb-6">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl sm:text-4xl font-black text-stone-950">
                ${product.discountPrice ?? product.price}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-stone-400 line-through">
                  ${product.price}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                  You save ${(product.price - product.discountPrice!).toFixed(2)} ({discountPercent}%)
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Tax included. Free express shipping on orders over $150.
            </p>
          </div>

          {/* Stock Availability Indicator */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-stone-200 mb-6 text-xs">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
              <span className="font-bold text-stone-800">
                {product.stock > 10
                  ? 'In Stock & Ready to Ship'
                  : product.stock > 0
                  ? `Low Stock Warning (Only ${product.stock} units left)`
                  : 'Currently Out of Stock'}
              </span>
            </div>
            <span className="text-stone-500">Fast 2-3 Day Courier</span>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 mb-8">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-stone-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2.5 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Instant Buy Now Button (2-Step Journey) */}
            <button
              id="product-detail-buy-now-btn"
              disabled={isOutOfStock}
              onClick={() => startDirectBuy(product, quantity)}
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Instant Buy Now (Fast 2-Step Checkout)</span>
            </button>

            {/* Add to Cart */}
            <button
              id="product-detail-add-cart-btn"
              disabled={isOutOfStock}
              onClick={() => addToCart(product, quantity)}
              className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-stone-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </button>

            {/* WhatsApp Direct Inquiry */}
            <button
              id="product-detail-whatsapp-btn"
              onClick={handleWhatsAppInquiry}
              className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Inquire / Order via WhatsApp Desk</span>
            </button>
          </div>

          {/* Highlights & Guarantees */}
          <div className="grid grid-cols-3 gap-2 border-t border-stone-200 pt-6 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <Truck className="w-4 h-4 mx-auto text-stone-700 mb-1" />
              <p className="text-[11px] font-bold text-stone-900">Express Courier</p>
              <p className="text-[10px] text-stone-500">2-3 Business Days</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <ShieldCheck className="w-4 h-4 mx-auto text-stone-700 mb-1" />
              <p className="text-[11px] font-bold text-stone-900">Official Warranty</p>
              <p className="text-[10px] text-stone-500">2-Year Guarantee</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <RotateCcw className="w-4 h-4 mx-auto text-stone-700 mb-1" />
              <p className="text-[11px] font-bold text-stone-900">Hassle-Free Return</p>
              <p className="text-[10px] text-stone-500">30-Day Policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Reviews */}
      <div className="mb-16 border-t border-stone-200 pt-8">
        <div className="flex items-center space-x-8 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab('description')}
            className={`text-sm font-bold pb-3 -mb-3 transition-colors ${
              activeTab === 'description'
                ? 'text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`text-sm font-bold pb-3 -mb-3 transition-colors ${
              activeTab === 'specifications'
                ? 'text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Specifications & Tech Specs
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-bold pb-3 -mb-3 transition-colors ${
              activeTab === 'reviews'
                ? 'text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Customer Reviews ({productReviews.length})
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'description' && (
          <div className="py-6 max-w-3xl space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed animate-fade-in">
            <p>{product.description}</p>
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 mt-4">
              <h4 className="font-bold text-stone-900 text-sm">Key Features & Engineering Highlights:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1 text-stone-600">
                <li>Factory calibrated and inspected for commercial reliability.</li>
                <li>Seamless compatibility across modern devices and workflows.</li>
                <li>Sustainable high-durability packaging with zero single-use plastics.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications Table */}
        {activeTab === 'specifications' && (
          <div className="py-6 max-w-3xl animate-fade-in">
            <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <tbody>
                  {product.specifications && Object.entries(product.specifications).length > 0 ? (
                    Object.entries(product.specifications).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? 'bg-stone-50/70' : 'bg-white'}
                      >
                        <td className="py-3 px-5 font-bold text-stone-700 border-b border-stone-100 w-1/3">
                          {key}
                        </td>
                        <td className="py-3 px-5 text-stone-600 border-b border-stone-100">
                          {val}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-6 px-5 text-stone-500 text-center" colSpan={2}>
                        Standard commercial specifications apply.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-6 max-w-4xl animate-fade-in space-y-8">
            {/* Reviews List */}
            <div className="space-y-4">
              {productReviews.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                  <p className="text-sm font-semibold text-stone-700">No customer reviews yet.</p>
                  <p className="text-xs text-stone-400 mt-1">Be the first to share your verified experience!</p>
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900 text-sm">{rev.author}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <UserCheck className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200">
              <h3 className="text-base font-bold text-stone-900 mb-1">Write a Customer Review</h3>
              <p className="text-xs text-stone-500 mb-4">
                Share your candid feedback to help other business buyers.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Miller"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Rating</label>
                    <div className="flex items-center space-x-2 pt-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setReviewRating(s)}
                          className="p-1 text-stone-400 hover:text-amber-500 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-stone-200 text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-stone-700 ml-2">{reviewRating} out of 5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Experience / Feedback</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the build quality, performance, and day-to-day usability..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Verified Review'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-stone-200 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">Related Products</h2>
              <p className="text-xs text-stone-500">More engineered essentials in this category</p>
            </div>
            <button
              onClick={() => setCurrentView('all-products')}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 underline underline-offset-4"
            >
              Browse Catalog →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
