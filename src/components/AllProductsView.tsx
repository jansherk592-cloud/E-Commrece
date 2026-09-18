import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const AllProductsView: React.FC = () => {
  const { products, categories, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();

  const [badgeFilter, setBadgeFilter] = useState<'all' | 'new' | 'featured' | 'bestseller' | 'offers'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;

      // Badge Filter
      const matchesBadge =
        badgeFilter === 'all'
          ? true
          : badgeFilter === 'new'
          ? p.isNewArrival
          : badgeFilter === 'featured'
          ? p.isFeatured
          : badgeFilter === 'bestseller'
          ? p.isBestSeller
          : Boolean(p.discountPrice);

      // Stock
      const matchesStock = inStockOnly ? p.stock > 0 : true;

      return matchesSearch && matchesCat && matchesBadge && matchesStock;
    }).sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default order
    });
  }, [products, searchQuery, selectedCategory, badgeFilter, inStockOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Explore Complete Product Catalog
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Engineered hardware, smart wearable gear, and workspace ergonomics built to rigorous tolerances.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Second Row: Badges, In-stock toggle, and Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          {/* Badge Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto">
            <button
              onClick={() => setBadgeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold ${
                badgeFilter === 'all' ? 'bg-stone-200 text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Badges
            </button>
            <button
              onClick={() => setBadgeFilter('new')}
              className={`px-3 py-1.5 rounded-lg font-bold ${
                badgeFilter === 'new' ? 'bg-emerald-100 text-emerald-800' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setBadgeFilter('offers')}
              className={`px-3 py-1.5 rounded-lg font-bold ${
                badgeFilter === 'offers' ? 'bg-rose-100 text-rose-800' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Special Offers
            </button>
            <button
              onClick={() => setBadgeFilter('bestseller')}
              className={`px-3 py-1.5 rounded-lg font-bold ${
                badgeFilter === 'bestseller' ? 'bg-amber-100 text-amber-800' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Best Sellers
            </button>
          </div>

          {/* Controls: In-Stock and Sort Dropdown */}
          <div className="flex items-center space-x-3 justify-between sm:justify-end">
            <label className="flex items-center space-x-1.5 text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-stone-900"
              />
              <span className="font-semibold">In Stock Only</span>
            </label>

            <div className="flex items-center space-x-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-semibold focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating: Highest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mb-1">No products found</h3>
          <p className="text-xs text-stone-500 mb-6">
            Try adjusting your search keywords, category selection, or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setBadgeFilter('all');
              setInStockOnly(false);
            }}
            className="px-5 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
