import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Truck, Headphones, RotateCcw, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { banners, setCurrentView, setFilterBadge, setActiveVideoUrl } = useStore();
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleCtaClick = () => {
    if (currentBanner.ctaLink === '#new-arrivals') {
      setFilterBadge('new-arrivals');
      setCurrentView('all-products');
    } else if (currentBanner.ctaLink === '#special-offers') {
      setFilterBadge('special-offers');
      setCurrentView('all-products');
    } else {
      setFilterBadge('all');
      setCurrentView('all-products');
    }
  };

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Banner Slide */}
      <div className="relative min-h-[480px] lg:min-h-[540px] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center opacity-40 transition-all duration-700 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            {currentBanner.badge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {currentBanner.badge}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4">
              {currentBanner.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed mb-8 max-w-xl">
              {currentBanner.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                id="hero-banner-cta-btn"
                onClick={handleCtaClick}
                className="px-6 py-3.5 bg-white text-stone-950 hover:bg-stone-100 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
              >
                <span>{currentBanner.ctaText || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-watch-demo-btn"
                onClick={() =>
                  setActiveVideoUrl(
                    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                  )
                }
                className="px-5 py-3.5 bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Watch Product Reel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2">
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))
              }
              className="p-2 bg-stone-900/60 hover:bg-stone-900 border border-stone-700 text-white rounded-lg transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1.5 px-2">
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? 'w-6 bg-emerald-400' : 'w-2 bg-stone-600'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="p-2 bg-stone-900/60 hover:bg-stone-900 border border-stone-700 text-white rounded-lg transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Trust & Confidence Value Bar */}
      <div className="border-t border-stone-800/80 bg-stone-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-stone-900 text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200">Express Delivery</p>
              <p className="text-[11px] text-stone-400">Free courier on orders $150+</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-stone-900 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200">2-Year Warranty</p>
              <p className="text-[11px] text-stone-400">Official manufacturer protection</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-stone-900 text-emerald-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200">Instant Support</p>
              <p className="text-[11px] text-stone-400">Direct WhatsApp & Phone desk</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-stone-900 text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200">Easy Returns</p>
              <p className="text-[11px] text-stone-400">30-day hassle-free exchange</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
