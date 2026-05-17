export interface Product {
  id: string;
  title: string;
  description: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  imageUrl: string;
  galleryImages: string[];
  rating: number;
  reviewCount: number;
  status: "active" | "draft";
  compatibility: string[];
  specs: Record<string, string>;
  warranty: string;
  condition: "new" | "refurbished" | "used";
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface OrderTimelineEvent {
  status: string;
  date: string;
  note?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  date: string;
  status: "pending" | "paid" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "unpaid" | "paid" | "partially_refunded" | "refunded";
  fulfillmentStatus: "unfulfilled" | "partially_fulfilled" | "fulfilled";
  totalAmount: number;
  items: OrderItem[];
  timeline: OrderTimelineEvent[];
  notes?: string;
  internalNotes?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase?: number;
  startDate: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  status: "active" | "expired" | "scheduled";
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  rating: number;
  comment: string;
  status: "published" | "pending" | "hidden";
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  reason: "Defective item" | "Wrong product" | "Not compatible" | "Changed mind" | "Damaged during delivery" | "Other";
  status: "requested" | "approved" | "rejected" | "received" | "refunded";
  requestedAt: string;
  refundAmount: number;
  items: OrderItem[];
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: "email" | "social" | "banner";
  status: "active" | "paused" | "completed";
  reach: number;
  conversions: number;
  startDate: string;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
}