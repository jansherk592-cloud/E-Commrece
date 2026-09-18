export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type AdminRole = 'Super Admin' | 'Store Manager' | 'Support';

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  videoUrl?: string;
  description: string;
  specifications: Record<string, string>;
  isNewArrival: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  notes?: string;
  paymentMethod: 'cash_on_delivery' | 'card_online' | 'bank_transfer' | 'whatsapp_order';
  createdAt: string;
  trackingNumber?: string;
  timeline: OrderTimeline[];
}

export type AnnouncementType = 'new_arrival' | 'special_offer' | 'discount' | 'business' | 'important';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  active: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  minSpend: number;
  active: boolean;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  country: string;
  hours: string;
  currencySymbol: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  aboutStory: string;
  announcementBarText: string;
  announcementBarActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLogin?: string;
  active: boolean;
}
