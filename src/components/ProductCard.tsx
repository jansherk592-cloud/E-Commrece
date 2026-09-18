import React, { useState } from 'react';
import {
  ShoppingCart,
  Zap,
  Star,
  MessageCircle,
  Play,
  Check,
  AlertTriangle,
  Flame,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProduct, addToCart, startDirectBuy, setActiveVideoUrl, businessInfo } = useStore();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
    const priceText = product.discountPrice ? `$${product.discountPrice}` : `$${product.price}`;
    const text = encodeURIComponent(
      `Hello! I'm interested in "${product.name}" (${priceText}). Is it currently available for immediate order?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.videoUrl) {
      setActiveVideoUrl(product.videoUrl);
    }
  };

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => openProduct(product.id)}
      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Media / Image Container */}
      <div
        className="relative aspect-square w-full bg-stone-100 overflow-hidden"
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImgIndex(1);
        }}
        onMouseLeave={() => setCurrentImgIndex(0)}
      >
        <img
          src={product.images[currentImgIndex] || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
              <Sparkles className="w-3 h-3" /> New
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-900 text-white shadow-sm">
              Featured
            </span>
          )}
          {discountPercent > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm">
              <Flame className="w-3 h-3" /> -{discountPercent}%
            </span>
          )}
        </div>

        {/* Video Icon Trigger (if product has video) */}
        {product.videoUrl && (
          <button
            onClick={handleVideoClick}
            className="absolute bottom-3 right-3 p-2 bg-stone-900/80 hover:bg-stone-900 text-white rounded-xl backdrop-blur-sm shadow-md transition-colors flex items-center gap-1 text-[11px] font-semibold z-10"
            title="Watch Product Video Demo"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span className="hidden sm:inline">Video</span>
          </button>
        )}

        {/* Stock Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-3 py-1 bg-stone-900 text-rose-400 border border-rose-500/40 rounded-lg text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-stone-950 shadow-sm">
              <AlertTriangle className="w-3 h-3" /> Only {product.stock} Left!
            </span>
          </div>
        ) : null}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Rating and Review Count */}
        <div className="flex items-center space-x-1 mb-1.5 text-xs text-stone-500">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold text-stone-800">{product.rating}</span>
          </div>
          <span>•</span>
          <span>({product.reviewCount} reviews)</span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm sm:text-base font-bold text-stone-900 line-clamp-2 mb-2 group-hover:text-stone-700 transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Short Specs Snippet */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <p className="text-xs text-stone-500 mb-3 truncate">
            {Object.entries(product.specifications)[0][0]}: {Object.entries(product.specifications)[0][1]}
          </p>
        )}

        {/* Price Row */}
        <div className="mt-auto pt-2 border-t border-stone-100 flex items-baseline justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-stone-950">
              ${product.discountPrice ?? product.price}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${product.price}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" /> In Stock
          </span>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now & WhatsApp */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Add to Cart */}
            <button
              id={`add-to-cart-btn-${product.id}`}
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Cart</span>
            </button>

            {/* Buy Now (Direct Fast Checkout) */}
            <button
              id={`buy-now-btn-${product.id}`}
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                startDirectBuy(product, 1);
              }}
              className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* WhatsApp Direct Inquiry Button */}
          <button
            id={`whatsapp-inquire-btn-${product.id}`}
            onClick={handleWhatsAppInquiry}
            className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600" />
            <span>Inquire on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
