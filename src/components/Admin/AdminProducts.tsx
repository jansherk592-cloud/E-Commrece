import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image,
  Video,
  Sparkles,
  Flame,
  Check,
  X,
  Star,
  Play,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    setActiveVideoUrl,
    showToast,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '']);
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const [specs, setSpecs] = useState<Record<string, string>>({});

  const resetForm = () => {
    setName('');
    setCategoryId(categories[0]?.id || '');
    setPrice('');
    setDiscountPrice('');
    setStock('');
    setSku('');
    setImageUrls(['', '', '']);
    setVideoUrl('');
    setDescription('');
    setIsNewArrival(false);
    setIsFeatured(false);
    setIsBestSeller(false);
    setSpecs({});
    setSpecKey('');
    setSpecVal('');
    setEditingProduct(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategoryId(prod.categoryId);
    setPrice(prod.price.toString());
    setDiscountPrice(prod.discountPrice ? prod.discountPrice.toString() : '');
    setStock(prod.stock.toString());
    setSku(prod.sku);
    setImageUrls([
      prod.images[0] || '',
      prod.images[1] || '',
      prod.images[2] || '',
    ]);
    setVideoUrl(prod.videoUrl || '');
    setDescription(prod.description);
    setIsNewArrival(prod.isNewArrival);
    setIsFeatured(prod.isFeatured);
    setIsBestSeller(prod.isBestSeller);
    setSpecs(prod.specifications || {});
    setIsAddModalOpen(true);
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setSpecs((prev) => ({ ...prev, [specKey.trim()]: specVal.trim() }));
    setSpecKey('');
    setSpecVal('');
  };

  const handleRemoveSpec = (key: string) => {
    setSpecs((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !stock || !sku.trim()) {
      showToast('Validation Error', 'Please complete required product fields.', 'error');
      return;
    }

    const cleanedImages = imageUrls.map((u) => u.trim()).filter(Boolean);
    const finalImages =
      cleanedImages.length > 0
        ? cleanedImages
        : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'];

    const payload = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      stock: parseInt(stock, 10),
      sku: sku.trim().toUpperCase(),
      images: finalImages,
      videoUrl: videoUrl.trim() || undefined,
      description: description.trim() || 'Premium engineered equipment with official manufacturer warranty.',
      specifications: specs,
      isNewArrival,
      isFeatured,
      isBestSeller,
      tags: [name.toLowerCase(), sku.toLowerCase()],
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? p.stock <= 10 && p.stock > 0
        : stockFilter === 'out'
        ? p.stock <= 0
        : p.stock > 10;
    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Catalog & Inventory Management</h2>
          <p className="text-xs text-stone-500">
            Add, update, or archive store items, multi-image assets, demonstration videos, and pricing.
          </p>
        </div>
        <button
          id="add-new-product-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
        >
          <option value="all">All Stock Statuses</option>
          <option value="in">In Stock (10+)</option>
          <option value="low">Low Stock (≤10)</option>
          <option value="out">Out of Stock (0)</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Product Info</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / Discount</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Media</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-stone-400">
                    No products matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  const isLow = p.stock <= 10 && p.stock > 0;
                  const isOut = p.stock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 truncate max-w-xs">{p.name}</p>
                            <span className="text-[10px] text-stone-400">Rating: ★ {p.rating} ({p.reviewCount})</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-700">{p.sku}</td>
                      <td className="py-3 px-4 text-stone-600">{cat?.name || 'General'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-stone-900">${p.discountPrice ?? p.price}</span>
                          {p.discountPrice && (
                            <span className="text-[10px] text-stone-400 line-through">${p.price}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isOut
                              ? 'bg-rose-100 text-rose-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} units {isOut ? '(Out)' : isLow ? '(Low)' : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isNewArrival && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                              New
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 text-[9px] font-bold">
                              Featured
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[9px] font-bold">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[11px] text-stone-500">{p.images.length} imgs</span>
                          {p.videoUrl && (
                            <button
                              onClick={() => setActiveVideoUrl(p.videoUrl!)}
                              className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                              title="Preview product video"
                            >
                              <Play className="w-3.5 h-3.5 fill-emerald-600" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="bg-white w-full max-w-3xl rounded-3xl border border-stone-200 shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {editingProduct ? 'Edit Product Details' : 'Add New Catalog Product'}
                </h3>
                <p className="text-xs text-stone-500">Specify inventory specifications, images, and pricing.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Precision Mechanical Keyboard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. APX-KB-750"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="199.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Price ($ Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="169.00"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Inventory Stock Units *</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Video Demo URL (.mp4 or demo)</label>
                  <input
                    type="url"
                    placeholder="https://commondatastorage.googleapis.com/.../demo.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              {/* Multiple Images Array */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-700">Multiple Product Image URLs (Up to 3)</label>
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="url"
                      placeholder={`Image URL #${idx + 1} (e.g. Unsplash high-res photo)`}
                      value={url}
                      onChange={(e) => {
                        const copy = [...imageUrls];
                        copy[idx] = e.target.value;
                        setImageUrls(copy);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                    />
                    {url && (
                      <img src={url} alt="" className="w-8 h-8 rounded object-cover border border-stone-200" />
                    )}
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe material finish, ergonomics, connectivity, and acoustic output..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                />
              </div>

              {/* Badges Toggles */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded text-stone-900"
                  />
                  <span className="font-bold text-stone-800">New Arrival Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-stone-900"
                  />
                  <span className="font-bold text-stone-800">Featured Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded text-stone-900"
                  />
                  <span className="font-bold text-stone-800">Best Seller Badge</span>
                </label>
              </div>

              {/* Technical Specifications Builder */}
              <div className="space-y-3">
                <label className="block font-bold text-stone-700">Product Technical Specifications</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g. Battery Life)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Spec Value (e.g. 45 Hours ANC)"
                    value={specVal}
                    onChange={(e) => setSpecVal(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-3.5 py-2 bg-stone-800 text-white rounded-xl font-bold"
                  >
                    Add
                  </button>
                </div>

                {Object.keys(specs).length > 0 && (
                  <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                    {Object.entries(specs).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between p-2.5 bg-white">
                        <span className="font-bold text-stone-700">{k}:</span>
                        <span className="text-stone-600">{v}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(k)}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-colors shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
