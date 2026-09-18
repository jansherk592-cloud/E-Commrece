import React from 'react';
import {
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Star,
  Tag,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Truck,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    setSelectedCategory,
    setCurrentView,
    businessInfo,
  } = useStore();

  const newArrivals = products.filter((p) => p.isNewArrival);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const specialOffers = products.filter((p) => Boolean(p.discountPrice));

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('all-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppContact = () => {
    const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${businessInfo.name}! I am browsing your homepage and would like to learn more about your products.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 animate-fade-in">
      {/* Hero Banner Carousel with Direct CTA */}
      <HeroBanner />

      {/* Categories Horizontal Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Curated Collections
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Precision-designed equipment arranged by workflow archetype.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('all-products');
            }}
            className="text-xs font-bold text-stone-900 hover:text-stone-600 flex items-center gap-1 group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative h-48 sm:h-56 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200"
            >
              <img
                src={category.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-0.5">
                  Collection
                </span>
                <h3 className="text-base sm:text-lg font-bold leading-tight group-hover:text-amber-200 transition-colors">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offers Section */}
      {specialOffers.length > 0 && (
        <section id="offers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white shadow-xl relative overflow-hidden border border-stone-800">
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
                  <Tag className="w-3.5 h-3.5" /> Special Promotional Offers
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Limited-Quantity Price Deductions
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-lg">
                  Direct manufacturer savings on flagship audio gear, ergonomics, and accessories.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentView('all-products');
                }}
                className="px-5 py-2.5 bg-white hover:bg-stone-100 text-stone-900 rounded-xl font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                Browse All Deals →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {specialOffers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Flagship Range</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Featured Innovations
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('all-products');
            }}
            className="text-xs font-bold text-stone-900 hover:text-stone-600 flex items-center gap-1 group cursor-pointer"
          >
            <span>All Featured</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Community Favorites</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Best Selling Hardware
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('all-products');
            }}
            className="text-xs font-bold text-stone-900 hover:text-stone-600 flex items-center gap-1 group cursor-pointer"
          >
            <span>View Rankings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Just Released</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('all-products');
            }}
            className="text-xs font-bold text-stone-900 hover:text-stone-600 flex items-center gap-1 group cursor-pointer"
          >
            <span>Browse New Drops</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Customer Reviews & Testimonials Showcase */}
      <section className="bg-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Endorsed by Audiophiles & Software Engineers
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Over 2,400 verified 5-star customer reviews across studio engineers, architects, and designers worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "The Apex Pro Spatial Headphone has replaced all three pairs of monitoring headphones in my recording studio. The planar magnetic response and zero-latency wireless bridge are masterclasses in audio engineering."
              </p>
              <div className="pt-3 border-t border-stone-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  DR
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs">Daniel Ross</h4>
                  <p className="text-[11px] text-stone-400">Audio Engineer, London UK</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "Ordering was seamless. I hit 'Buy Now', verified shipping on step two, and paid with my card. The package arrived in 48 hours in custom magnetic packaging. Highly impressed."
              </p>
              <div className="pt-3 border-t border-stone-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  SC
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs">Sarah Chen</h4>
                  <p className="text-[11px] text-stone-400">Principal Architect, Seattle WA</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "Customer care on WhatsApp responded in under 4 minutes to help me pick the right ergonomic switch weight for my mechanical keyboard. The build quality is aerospace grade."
              </p>
              <div className="pt-3 border-t border-stone-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  MK
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs">Marcus Keller</h4>
                  <p className="text-[11px] text-stone-400">Lead Systems Engineer, Berlin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Heritage & Direct Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Personalized Technical Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Have Questions Before You Order?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Connect with an Apex specialist directly on WhatsApp or telephone for custom enterprise quotes, hardware compatibility checks, or expedited shipping requests.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" /> Showroom: {businessInfo.address}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> {businessInfo.hours}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              id="cta-whatsapp-btn"
              onClick={handleWhatsAppContact}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Direct Line</span>
            </button>

            <a
              id="cta-call-btn"
              href={`tel:${businessInfo.phone}`}
              className="px-6 py-3.5 bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call {businessInfo.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
