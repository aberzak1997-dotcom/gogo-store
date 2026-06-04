export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'returning' | 'VIP' | 'blocked';
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
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  optionName: string;
  optionValue: string;
  sku: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
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
  status: 'active' | 'draft';
  compatibility: string[];
  specs: Record<string, string>;
  warranty: string;
  condition: 'new' | 'refurbished' | 'used';
  createdAt: string;
  variants?: ProductVariant[];
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'unpaid' | 'paid' | 'partially_refunded' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'fulfilled' | 'partial';
  totalAmount: number;
  items: OrderItem[];
  timeline: OrderTimelineEvent[];
  notes?: string;
  internalNotes?: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ReturnItem {
  productId: string;
  variantId?: string;
  title: string;
  quantity: number;
  price: number;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  reason: string;
  status: 'requested' | 'approved' | 'rejected' | 'refunded';
  requestedAt: string;
  refundAmount: number;
  items: ReturnItem[];
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'banner';
  status: 'draft' | 'active' | 'paused' | 'ended';
  startDate?: string;
  endDate?: string;
  budget?: number;
  description?: string;
  createdAt: string;
}

export interface PaymentConfig {
  // Stripe
  stripeEnabled?: boolean;
  stripePublishableKey?: string;
  // PayPal
  paypalEnabled?: boolean;
  paypalClientId?: string;
  // COD
  codEnabled?: boolean;
  // Bank Transfer
  bankEnabled?: boolean;
  bankName?: string;
  bankHolder?: string;
  bankRib?: string;
  bankIban?: string;
  bankSwift?: string;
  bankInstructions?: string;
  bankQrUrl?: string;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
  paymentConfig?: PaymentConfig;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
  createdAt: string;
}

export function calculateCustomerStatus(customer: Customer): 'active' | 'returning' | 'VIP' | 'blocked' {
  if (customer.totalOrders >= 3) return 'VIP';
  if (customer.totalOrders > 1) return 'returning';
  return 'active';
}
