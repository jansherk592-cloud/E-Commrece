import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Review,
  CartItem,
  Order,
  OrderStatus,
  Announcement,
  Banner,
  PromoCode,
  BusinessInfo,
  AdminUser,
  AdminRole,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_BANNERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PROMO_CODES,
  INITIAL_ORDERS,
  INITIAL_BUSINESS_INFO,
  INITIAL_ADMIN_USERS,
} from '../data/initialData';

export type ViewMode = 'home' | 'product-detail' | 'checkout' | 'order-confirmation' | 'about' | 'contact' | 'admin' | 'all-products' | 'track-order';

interface ToastState {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Navigation & View
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedProductId: string | null;
  selectedProduct: Product | undefined;
  openProduct: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  filterBadge: 'all' | 'new-arrivals' | 'featured' | 'best-sellers' | 'special-offers';
  setFilterBadge: (badge: 'all' | 'new-arrivals' | 'featured' | 'best-sellers' | 'special-offers') => void;

  // Drawer / Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  activeVideoUrl: string | null;
  setActiveVideoUrl: (url: string | null) => void;

  // Toast
  toast: ToastState | null;
  toasts: ToastState[];
  removeToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;

  // Data
  products: Product[];
  categories: Category[];
  reviews: Review[];
  orders: Order[];
  announcements: Announcement[];
  banners: Banner[];
  promoCodes: PromoCode[];
  businessInfo: BusinessInfo;
  adminUsers: AdminUser[];
  activeAdmin: AdminUser | null;
  currentAdmin: AdminUser | null;

  // Cart & Direct Buy
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  directBuyItem: { product: Product; quantity: number } | null;
  startDirectBuy: (product: Product, quantity?: number) => void;

  // Orders
  lastPlacedOrder: Order | null;
  createOrder: (orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: { address: string; city: string; state: string; postalCode: string; country: string };
    notes?: string;
    paymentMethod: 'cash_on_delivery' | 'card_online' | 'bank_transfer' | 'whatsapp_order';
    itemsOverride?: { productId: string; name: string; price: number; quantity: number; image: string }[];
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  updateOrderTracking: (orderId: string, trackingNumber: string) => void;
  deleteOrder: (orderId: string) => void;

  // Admin Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Admin Categories
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Admin Announcements & Banners
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  addPromoCode: (promo: Omit<PromoCode, 'id'>) => void;
  updatePromoCode: (id: string, updates: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;

  // Admin Business Info
  updateBusinessInfo: (updates: Partial<BusinessInfo>) => void;

  // Admin Auth & Users
  loginAdmin: (email: string, role?: AdminRole) => boolean;
  logoutAdmin: () => void;
  addAdminUser: (user: Omit<AdminUser, 'id'>) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;

  // Backup & Restore
  exportBackup: () => string;
  exportDataJson: () => string;
  importBackup: (jsonContent: string) => boolean;
  importDataJson: (jsonContent: string) => boolean;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'apex_commerce_state_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterBadge, setFilterBadge] = useState<'all' | 'new-arrivals' | 'featured' | 'best-sellers' | 'special-offers'>('all');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Cart & Checkout
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [directBuyItem, setDirectBuyItem] = useState<{ product: Product; quantity: number } | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Core Data Collections
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_banners`);
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_promos`);
    return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
  });

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_business`);
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_INFO;
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_admins`);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  const [activeAdmin, setActiveAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_active_admin`);
    return saved ? JSON.parse(saved) : null;
  });

  // Persist Data Changes
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_announcements`, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_promos`, JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_business`, JSON.stringify(businessInfo));
  }, [businessInfo]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_admins`, JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    if (activeAdmin) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_admin`, JSON.stringify(activeAdmin));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_active_admin`);
    }
  }, [activeAdmin]);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  // Open Product Helper (SEO hash + view update)
  const openProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = `product-${id}`;
  };

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.discountPrice ?? item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('Out of Stock', `${product.name} is currently out of stock.`, 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });

    showToast('Added to Cart', `${product.name} (${quantity}) added to your shopping cart.`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item Removed', 'Product was removed from your cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Direct Buy Flow (Fast 2-Step Journey)
  const startDirectBuy = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('Out of Stock', 'Cannot purchase out of stock item.', 'error');
      return;
    }
    setDirectBuyItem({ product, quantity });
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Promo application
  const applyPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === cleanCode && p.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired promo coupon code.' };
    }
    const currentTotal = directBuyItem
      ? (directBuyItem.product.discountPrice ?? directBuyItem.product.price) * directBuyItem.quantity
      : cartSubtotal;

    if (currentTotal < found.minSpend) {
      return {
        success: false,
        message: `Minimum order spend of $${found.minSpend} required for coupon ${cleanCode}.`,
      };
    }
    setAppliedPromo(found);
    return { success: true, message: `Promo applied! ${found.discountPercent}% off applied.` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Create Order
  const createOrder = (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: { address: string; city: string; state: string; postalCode: string; country: string };
    notes?: string;
    paymentMethod: 'cash_on_delivery' | 'card_online' | 'bank_transfer' | 'whatsapp_order';
    itemsOverride?: { productId: string; name: string; price: number; quantity: number; image: string }[];
  }): Order => {
    const orderItems = payload.itemsOverride || (
      directBuyItem
        ? [{
            productId: directBuyItem.product.id,
            name: directBuyItem.product.name,
            price: directBuyItem.product.discountPrice ?? directBuyItem.product.price,
            quantity: directBuyItem.quantity,
            image: directBuyItem.product.images[0],
          }]
        : cart.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.discountPrice ?? item.product.price,
            quantity: item.quantity,
            image: item.product.images[0],
          }))
    );

    const subtotal = orderItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const shippingFee = subtotal >= 150 ? 0 : 15;
    const discountAmount = appliedPromo ? Number(((subtotal * appliedPromo.discountPercent) / 100).toFixed(2)) : 0;
    const total = Number((subtotal + shippingFee - discountAmount).toFixed(2));

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.shippingAddress,
      items: orderItems,
      subtotal,
      shippingFee,
      discountAmount,
      couponCode: appliedPromo?.code,
      total,
      status: 'Pending',
      notes: payload.notes,
      paymentMethod: payload.paymentMethod,
      createdAt: new Date().toISOString(),
      trackingNumber: `TRK-US-${Math.floor(1000000 + Math.random() * 9000000)}`,
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Order received via ${payload.paymentMethod.replace('_', ' ').toUpperCase()}`,
        },
      ],
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingItem = orderItems.find((oi) => oi.productId === prod.id);
        if (matchingItem) {
          const newStock = Math.max(0, prod.stock - matchingItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);

    // Reset checkout states
    if (!directBuyItem) {
      clearCart();
    }
    setDirectBuyItem(null);
    setAppliedPromo(null);

    setCurrentView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Order Confirmed!', `Your order ${newOrder.id} has been placed successfully.`, 'success');

    return newOrder;
  };

  // Order Management
  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [
            ...ord.timeline,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `Status transitioned to ${status}`,
            },
          ];
          return { ...ord, status, timeline: updatedTimeline };
        }
        return ord;
      })
    );
    showToast('Order Updated', `Order ${orderId} status set to ${status}`, 'success');
  };

  const updateOrderTracking = (orderId: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, trackingNumber } : ord))
    );
    showToast('Tracking Saved', `Tracking updated for ${orderId}`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    showToast('Order Deleted', `Order ${orderId} was removed.`, 'info');
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const id = `prod-${Date.now()}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      ...productData,
      id,
      slug,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product Created', `${newProduct.name} has been added to inventory.`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
    showToast('Product Updated', 'Product changes saved successfully.', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
    showToast('Product Deleted', 'Product was removed from the catalog.', 'info');
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const id = `rev-${Date.now()}`;
    const newReview: Review = {
      ...reviewData,
      id,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate rating
    const matching = [newReview, ...reviews.filter((r) => r.productId === reviewData.productId)];
    const avg = Number((matching.reduce((acc, r) => acc + r.rating, 0) / matching.length).toFixed(1));
    setProducts((prev) =>
      prev.map((p) =>
        p.id === reviewData.productId ? { ...p, rating: avg, reviewCount: matching.length } : p
      )
    );
    showToast('Review Submitted', 'Thank you! Your verified feedback was recorded.', 'success');
  };

  // Category CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const slug = catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: Category = { ...catData, id, slug };
    setCategories((prev) => [...prev, newCategory]);
    showToast('Category Added', `Category ${newCategory.name} was created.`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
    showToast('Category Updated', 'Category details updated.', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    showToast('Category Removed', 'Category was removed.', 'info');
  };

  // Announcements & Banners
  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const id = `ann-${Date.now()}`;
    const newAnn: Announcement = {
      ...annData,
      id,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Announcement Published', 'Announcement is now live on the store.', 'success');
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann))
    );
    showToast('Announcement Saved', 'Announcement updated.', 'success');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
    showToast('Announcement Removed', 'Announcement was deleted.', 'info');
  };

  const addBanner = (bannerData: Omit<Banner, 'id'>) => {
    const id = `banner-${Date.now()}`;
    const newBanner: Banner = { ...bannerData, id };
    setBanners((prev) => [...prev, newBanner]);
    showToast('Banner Added', 'Homepage banner has been added.', 'success');
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    showToast('Banner Saved', 'Banner changes saved.', 'success');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner Removed', 'Banner removed from homepage.', 'info');
  };

  const addPromoCode = (promoData: Omit<PromoCode, 'id'>) => {
    const id = `promo-${Date.now()}`;
    const newPromo: PromoCode = { ...promoData, id, code: promoData.code.toUpperCase() };
    setPromoCodes((prev) => [...prev, newPromo]);
    showToast('Promo Code Created', `Promo coupon ${newPromo.code} created.`, 'success');
  };

  const updatePromoCode = (id: string, updates: Partial<PromoCode>) => {
    setPromoCodes((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, code: updates.code ? updates.code.toUpperCase() : p.code }
          : p
      )
    );
    showToast('Promo Saved', 'Promo code updated.', 'success');
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
    showToast('Promo Removed', 'Promo code deleted.', 'info');
  };

  // Business Info
  const updateBusinessInfo = (updates: Partial<BusinessInfo>) => {
    setBusinessInfo((prev) => ({ ...prev, ...updates }));
    showToast('Business Info Saved', 'Store information and contacts updated.', 'success');
  };

  // Admin Auth
  const loginAdmin = (email: string, role: AdminRole = 'Super Admin') => {
    const existing = adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing && existing.active) {
      const updatedUser = { ...existing, lastLogin: new Date().toISOString() };
      setActiveAdmin(updatedUser);
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === existing.id ? updatedUser : u))
      );
      showToast('Admin Authenticated', `Welcome back, ${existing.name} (${existing.role})`, 'success');
      return true;
    }

    // Default admin fallback for demo
    if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@apexcommerce.com') {
      const fallback: AdminUser = {
        id: 'adm-demo',
        name: 'Administrator',
        email,
        role: role,
        lastLogin: new Date().toISOString(),
        active: true,
      };
      setActiveAdmin(fallback);
      showToast('Admin Authenticated', `Welcome, Administrator (${role})`, 'success');
      return true;
    }

    showToast('Login Failed', 'Invalid admin email or inactive permissions.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setActiveAdmin(null);
    setCurrentView('home');
    showToast('Logged Out', 'Signed out of admin dashboard safely.', 'info');
  };

  const addAdminUser = (userData: Omit<AdminUser, 'id'>) => {
    const id = `adm-${Date.now()}`;
    const newUser: AdminUser = { ...userData, id };
    setAdminUsers((prev) => [...prev, newUser]);
    showToast('Admin Added', `User ${newUser.name} assigned ${newUser.role} permissions.`, 'success');
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    showToast('Admin Updated', 'Admin permissions updated.', 'success');
  };

  const deleteAdminUser = (id: string) => {
    if (adminUsers.length <= 1) {
      showToast('Action Denied', 'At least one admin user must remain.', 'error');
      return;
    }
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Admin Removed', 'Admin access revoked.', 'info');
  };

  // Backup & Restore
  const exportBackup = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      storeVersion: '1.0.0',
      products,
      categories,
      reviews,
      orders,
      announcements,
      banners,
      promoCodes,
      businessInfo,
      adminUsers,
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importBackup = (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.products && Array.isArray(parsed.products)) setProducts(parsed.products);
      if (parsed.categories && Array.isArray(parsed.categories)) setCategories(parsed.categories);
      if (parsed.reviews && Array.isArray(parsed.reviews)) setReviews(parsed.reviews);
      if (parsed.orders && Array.isArray(parsed.orders)) setOrders(parsed.orders);
      if (parsed.announcements && Array.isArray(parsed.announcements)) setAnnouncements(parsed.announcements);
      if (parsed.banners && Array.isArray(parsed.banners)) setBanners(parsed.banners);
      if (parsed.promoCodes && Array.isArray(parsed.promoCodes)) setPromoCodes(parsed.promoCodes);
      if (parsed.businessInfo) setBusinessInfo(parsed.businessInfo);
      if (parsed.adminUsers && Array.isArray(parsed.adminUsers)) setAdminUsers(parsed.adminUsers);

      showToast('Restore Succeeded', 'Store data successfully restored from backup file.', 'success');
      return true;
    } catch (e) {
      showToast('Restore Failed', 'Invalid JSON backup format.', 'error');
      return false;
    }
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setReviews(INITIAL_REVIEWS);
    setOrders(INITIAL_ORDERS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setBanners(INITIAL_BANNERS);
    setPromoCodes(INITIAL_PROMO_CODES);
    setBusinessInfo(INITIAL_BUSINESS_INFO);
    setAdminUsers(INITIAL_ADMIN_USERS);
    setCart([]);
    setAppliedPromo(null);
    setDirectBuyItem(null);
    showToast('Reset Complete', 'Store has been reset to rich default demo state.', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        selectedProduct: products.find((p) => p.id === selectedProductId),
        openProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filterBadge,
        setFilterBadge,

        isCartOpen,
        setIsCartOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        activeVideoUrl,
        setActiveVideoUrl,

        toast,
        toasts: toast ? [toast] : [],
        removeToast: () => setToast(null),
        showToast,

        products,
        categories,
        reviews,
        orders,
        announcements,
        banners,
        promoCodes,
        businessInfo,
        adminUsers,
        activeAdmin,
        currentAdmin: activeAdmin,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedPromo,
        applyPromo,
        removePromo,
        directBuyItem,
        startDirectBuy,

        lastPlacedOrder,
        createOrder,
        updateOrderStatus,
        updateOrderTracking,
        deleteOrder,

        addProduct,
        updateProduct,
        deleteProduct,
        addReview,

        addCategory,
        updateCategory,
        deleteCategory,

        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addBanner,
        updateBanner,
        deleteBanner,
        addPromoCode,
        updatePromoCode,
        deletePromoCode,

        updateBusinessInfo,

        loginAdmin,
        logoutAdmin,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,

        exportBackup,
        exportDataJson: exportBackup,
        importBackup,
        importDataJson: importBackup,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
