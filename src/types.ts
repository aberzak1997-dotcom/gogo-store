export interface ProductVariant {
  id: string;
  productId: string;
  optionName: string;
  optionValue: string;
  sku: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

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
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  title: string;
  quantity: number;
  price: number;
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
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "unpaid" | "paid" | "refunded" | "partially_refunded";
  fulfillmentStatus: "unfulfilled" | "fulfilled" | "refunded";
  totalAmount: number;
  items: OrderItem[];
  timeline: { status: string; date: string; note?: string }[];
  internalNotes?: string;
  notes?: string;
}

export interface Discount {
  id: string;
  code: string;
  amount: number;
  type: "percentage" | "fixed";
  expiresAt?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  reason: string;
  status: "requested" | "approved" | "rejected" | "refunded";
  requestedAt: string;
  refundAmount: number;
  items: OrderItem[];
}

export interface MarketingCampaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  discountCode?: string;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: "active" | "returning" | "VIP" | "blocked";
  notes?: string;
  tags?: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// Helper to calculate status based on orders
export function calculateCustomerStatus(customer: Customer): "active" | "returning" | "VIP" | "blocked" {
  if (customer.totalOrders >= 3) return "VIP";
  if (customer.totalOrders > 1) return "returning";
  return "active";
}
