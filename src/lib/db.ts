/**
 * Database operations — thin wrappers around Supabase.
 * Every function returns the mapped TypeScript type.
 * Called by StoreContext; components never touch this directly.
 */

import { supabase } from "./supabase";
import type {
  Product, ProductVariant, Order, OrderItem, OrderTimelineEvent,
  Customer, Discount, Review, ReturnRequest, ReturnItem,
  MarketingCampaign, Collection, StoreSettings,
} from "../types";

// ─── Mappers (snake_case DB → camelCase TS) ───────────────────────────────

function mapVariant(r: Record<string, unknown>): ProductVariant {
  return {
    id: r.id as string,
    productId: r.product_id as string,
    optionName: r.option_name as string,
    optionValue: r.option_value as string,
    sku: r.sku as string,
    price: r.price as number,
    stockQuantity: r.stock_quantity as number,
    imageUrl: r.image_url as string | undefined,
  };
}

function mapProduct(r: Record<string, unknown>): Product {
  const variants = (r.variants as Record<string, unknown>[] | undefined) ?? [];
  return {
    id: r.id as string,
    title: r.title as string,
    description: r.description as string,
    sku: r.sku as string,
    brand: r.brand as string,
    category: r.category as string,
    subcategory: r.subcategory as string,
    price: r.price as number,
    compareAtPrice: r.compare_at_price as number | undefined,
    stockQuantity: r.stock_quantity as number,
    imageUrl: r.image_url as string,
    galleryImages: (r.gallery_images as string[]) ?? [],
    rating: r.rating as number,
    reviewCount: r.review_count as number,
    status: r.status as "active" | "draft",
    compatibility: (r.compatibility as string[]) ?? [],
    specs: (r.specs as Record<string, string>) ?? {},
    warranty: r.warranty as string,
    condition: r.condition as "new" | "refurbished" | "used",
    createdAt: r.created_at as string,
    variants: variants.map(mapVariant),
  };
}

function mapOrder(r: Record<string, unknown>): Order {
  const rawItems = (r.items as Record<string, unknown>[]) ?? [];
  const rawTimeline = (r.timeline as Record<string, unknown>[]) ?? [];
  const items: OrderItem[] = rawItems.map(i => ({
    productId: i.product_id as string,
    variantId: i.variant_id as string | undefined,
    title: i.title as string,
    quantity: i.quantity as number,
    price: i.price as number,
  }));
  const timeline: OrderTimelineEvent[] = rawTimeline.map(t => ({
    status: t.status as string,
    date: t.date as string,
    note: t.note as string | undefined,
  }));
  return {
    id: r.id as string,
    customerName: r.customer_name as string,
    email: r.email as string,
    phone: r.phone as string | undefined,
    address: r.address as string | undefined,
    city: r.city as string | undefined,
    country: r.country as string | undefined,
    date: r.date as string,
    status: r.status as Order["status"],
    paymentStatus: r.payment_status as Order["paymentStatus"],
    fulfillmentStatus: r.fulfillment_status as Order["fulfillmentStatus"],
    totalAmount: r.total_amount as number,
    items,
    timeline,
    notes: r.notes as string | undefined,
    internalNotes: r.internal_notes as string | undefined,
  };
}

function mapCustomer(r: Record<string, unknown>): Customer {
  return {
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    phone: r.phone as string | undefined,
    location: r.location as string | undefined,
    totalOrders: r.total_orders as number,
    totalSpent: r.total_spent as number,
    lastOrderDate: r.last_order_date as string | undefined,
    status: r.status as Customer["status"],
    notes: r.notes as string | undefined,
    tags: (r.tags as string[]) ?? [],
    createdAt: r.created_at as string,
  };
}

function mapDiscount(r: Record<string, unknown>): Discount {
  return {
    id: r.id as string,
    code: r.code as string,
    type: r.type as Discount["type"],
    value: r.value as number,
    minOrderAmount: r.min_order_amount as number | undefined,
    maxUses: r.max_uses as number | undefined,
    usedCount: r.used_count as number,
    expiresAt: r.expires_at as string | undefined,
    isActive: r.is_active as boolean,
    createdAt: r.created_at as string,
  };
}

function mapReview(r: Record<string, unknown>): Review {
  return {
    id: r.id as string,
    productId: r.product_id as string,
    productTitle: r.product_title as string,
    customerName: r.customer_name as string,
    rating: r.rating as number,
    comment: r.comment as string,
    status: r.status as Review["status"],
    createdAt: r.created_at as string,
  };
}

function mapReturn(r: Record<string, unknown>): ReturnRequest {
  const rawItems = (r.return_items as Record<string, unknown>[]) ?? [];
  const items: ReturnItem[] = rawItems.map(i => ({
    productId: i.product_id as string,
    variantId: i.variant_id as string | undefined,
    title: i.title as string,
    quantity: i.quantity as number,
    price: i.price as number,
  }));
  return {
    id: r.id as string,
    orderId: r.order_id as string,
    customerName: r.customer_name as string,
    email: r.email as string,
    reason: r.reason as string,
    status: r.status as ReturnRequest["status"],
    requestedAt: r.requested_at as string,
    refundAmount: r.refund_amount as number,
    items,
  };
}

function mapCampaign(r: Record<string, unknown>): MarketingCampaign {
  return {
    id: r.id as string,
    name: r.name as string,
    type: r.type as MarketingCampaign["type"],
    status: r.status as MarketingCampaign["status"],
    startDate: r.start_date as string | undefined,
    endDate: r.end_date as string | undefined,
    budget: r.budget as number | undefined,
    description: r.description as string | undefined,
    createdAt: r.created_at as string,
  };
}

function mapCollection(r: Record<string, unknown>): Collection {
  const cps = (r.collection_products as { product_id: string }[]) ?? [];
  return {
    id: r.id as string,
    name: r.name as string,
    description: r.description as string | undefined,
    productIds: cps.map(cp => cp.product_id),
    createdAt: r.created_at as string,
  };
}

function mapSettings(r: Record<string, unknown>): StoreSettings {
  return {
    storeName: r.store_name as string,
    contactEmail: r.contact_email as string,
    currency: r.currency as string,
    taxRate: r.tax_rate as number,
    freeShippingThreshold: r.free_shipping_threshold as number,
    maintenanceMode: r.maintenance_mode as boolean,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function db() {
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

// ─── Products ─────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await db()
    .from("products")
    .select("*, variants:product_variants(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => mapProduct(r as Record<string, unknown>));
}

export async function upsertProduct(p: Product): Promise<void> {
  const { error } = await db().from("products").upsert({
    id: p.id, title: p.title, description: p.description, sku: p.sku,
    brand: p.brand, category: p.category, subcategory: p.subcategory,
    price: p.price, compare_at_price: p.compareAtPrice ?? null,
    stock_quantity: p.stockQuantity, image_url: p.imageUrl,
    gallery_images: p.galleryImages, rating: p.rating,
    review_count: p.reviewCount, status: p.status,
    compatibility: p.compatibility, specs: p.specs,
    warranty: p.warranty, condition: p.condition, created_at: p.createdAt,
  });
  if (error) throw error;
  // Upsert variants
  if (p.variants && p.variants.length > 0) {
    const { error: ve } = await db().from("product_variants").upsert(
      p.variants.map(v => ({
        id: v.id, product_id: p.id, option_name: v.optionName,
        option_value: v.optionValue, sku: v.sku, price: v.price,
        stock_quantity: v.stockQuantity, image_url: v.imageUrl ?? null,
      }))
    );
    if (ve) throw ve;
  }
}

export async function deleteProductDB(id: string): Promise<void> {
  const { error } = await db().from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertVariant(v: ProductVariant): Promise<void> {
  const { error } = await db().from("product_variants").upsert({
    id: v.id, product_id: v.productId, option_name: v.optionName,
    option_value: v.optionValue, sku: v.sku, price: v.price,
    stock_quantity: v.stockQuantity, image_url: v.imageUrl ?? null,
  });
  if (error) throw error;
}

export async function deleteVariantDB(id: string): Promise<void> {
  const { error } = await db().from("product_variants").delete().eq("id", id);
  if (error) throw error;
}

// ─── Orders ───────────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await db()
    .from("orders")
    .select("*, items:order_items(*), timeline:order_timeline(*)")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => mapOrder(r as Record<string, unknown>));
}

export async function insertOrder(o: Order): Promise<void> {
  const { error: oe } = await db().from("orders").insert({
    id: o.id, customer_name: o.customerName, email: o.email,
    phone: o.phone ?? null, address: o.address ?? null,
    city: o.city ?? null, country: o.country ?? null,
    date: o.date, status: o.status, payment_status: o.paymentStatus,
    fulfillment_status: o.fulfillmentStatus, total_amount: o.totalAmount,
    notes: o.notes ?? null, internal_notes: o.internalNotes ?? null,
  });
  if (oe) throw oe;

  if (o.items.length > 0) {
    const { error: ie } = await db().from("order_items").insert(
      o.items.map(i => ({
        order_id: o.id, product_id: i.productId,
        variant_id: i.variantId ?? null, title: i.title,
        quantity: i.quantity, price: i.price,
      }))
    );
    if (ie) throw ie;
  }

  if (o.timeline.length > 0) {
    const { error: te } = await db().from("order_timeline").insert(
      o.timeline.map(t => ({
        order_id: o.id, status: t.status, date: t.date, note: t.note ?? null,
      }))
    );
    if (te) throw te;
  }
}

export async function updateOrderDB(o: Order): Promise<void> {
  const { error } = await db().from("orders").update({
    status: o.status, payment_status: o.paymentStatus,
    fulfillment_status: o.fulfillmentStatus,
    notes: o.notes ?? null, internal_notes: o.internalNotes ?? null,
  }).eq("id", o.id);
  if (error) throw error;
}

export async function addTimelineEvent(orderId: string, event: OrderTimelineEvent): Promise<void> {
  const { error } = await db().from("order_timeline").insert({
    order_id: orderId, status: event.status, date: event.date, note: event.note ?? null,
  });
  if (error) throw error;
}

// ─── Customers ────────────────────────────────────────────────────────────

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await db()
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => mapCustomer(r as Record<string, unknown>));
}

export async function upsertCustomer(c: Customer): Promise<void> {
  const { error } = await db().from("customers").upsert({
    id: c.id, name: c.name, email: c.email, phone: c.phone ?? null,
    location: c.location ?? null, total_orders: c.totalOrders,
    total_spent: c.totalSpent, last_order_date: c.lastOrderDate ?? null,
    status: c.status, notes: c.notes ?? null, tags: c.tags ?? [],
    created_at: c.createdAt,
  });
  if (error) throw error;
}

// ─── Discounts ────────────────────────────────────────────────────────────

export async function getDiscounts(): Promise<Discount[]> {
  const { data, error } = await db()
    .from("discounts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => mapDiscount(r as Record<string, unknown>));
}

export async function upsertDiscount(d: Discount): Promise<void> {
  const { error } = await db().from("discounts").upsert({
    id: d.id, code: d.code, type: d.type, value: d.value,
    min_order_amount: d.minOrderAmount ?? null, max_uses: d.maxUses ?? null,
    used_count: d.usedCount, expires_at: d.expiresAt ?? null,
    is_active: d.isActive, created_at: d.createdAt,
  });
  if (error) throw error;
}

export async function deleteDiscountDB(id: string): Promise<void> {
  const { error } = await db().from("discounts").delete().eq("id", id);
  if (error) throw error;
}

// ─── Reviews ──────────────────────────────────────────────────────────────

export async function getReviews(): Promise<Review[]> {
  const { data, error } = await db()
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => mapReview(r as Record<string, unknown>));
}

export async function upsertReview(r: Review): Promise<void> {
  const { error } = await db().from("reviews").upsert({
    id: r.id, product_id: r.productId, product_title: r.productTitle,
    customer_name: r.customerName, rating: r.rating, comment: r.comment,
    status: r.status, created_at: r.createdAt,
  });
  if (error) throw error;
}

// ─── Returns ──────────────────────────────────────────────────────────────

export async function getReturns(): Promise<ReturnRequest[]> {
  const { data, error } = await db()
    .from("return_requests")
    .select("*, return_items(*)")
    .order("requested_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => mapReturn(r as Record<string, unknown>));
}

export async function insertReturn(r: ReturnRequest): Promise<void> {
  const { error: re } = await db().from("return_requests").insert({
    id: r.id, order_id: r.orderId, customer_name: r.customerName,
    email: r.email, reason: r.reason, status: r.status,
    requested_at: r.requestedAt, refund_amount: r.refundAmount,
  });
  if (re) throw re;

  if (r.items.length > 0) {
    const { error: ie } = await db().from("return_items").insert(
      r.items.map(i => ({
        return_id: r.id, product_id: i.productId,
        variant_id: i.variantId ?? null, title: i.title,
        quantity: i.quantity, price: i.price,
      }))
    );
    if (ie) throw ie;
  }
}

export async function updateReturnDB(id: string, status: ReturnRequest["status"]): Promise<void> {
  const { error } = await db().from("return_requests").update({ status }).eq("id", id);
  if (error) throw error;
}

// ─── Campaigns ────────────────────────────────────────────────────────────

export async function getCampaigns(): Promise<MarketingCampaign[]> {
  const { data, error } = await db()
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => mapCampaign(r as Record<string, unknown>));
}

export async function upsertCampaign(c: MarketingCampaign): Promise<void> {
  const { error } = await db().from("campaigns").upsert({
    id: c.id, name: c.name, type: c.type, status: c.status,
    start_date: c.startDate ?? null, end_date: c.endDate ?? null,
    budget: c.budget ?? null, description: c.description ?? null,
    created_at: c.createdAt,
  });
  if (error) throw error;
}

export async function deleteCampaignDB(id: string): Promise<void> {
  const { error } = await db().from("campaigns").delete().eq("id", id);
  if (error) throw error;
}

// ─── Collections ──────────────────────────────────────────────────────────

export async function getCollections(): Promise<Collection[]> {
  const { data, error } = await db()
    .from("collections")
    .select("*, collection_products(product_id)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => mapCollection(r as Record<string, unknown>));
}

export async function upsertCollection(c: Collection): Promise<void> {
  const { error } = await db().from("collections").upsert({
    id: c.id, name: c.name,
    description: c.description ?? null, created_at: c.createdAt,
  });
  if (error) throw error;

  // Sync junction table
  await db().from("collection_products").delete().eq("collection_id", c.id);
  if (c.productIds.length > 0) {
    const { error: je } = await db().from("collection_products").insert(
      c.productIds.map(pid => ({ collection_id: c.id, product_id: pid }))
    );
    if (je) throw je;
  }
}

export async function deleteCollectionDB(id: string): Promise<void> {
  const { error } = await db().from("collections").delete().eq("id", id);
  if (error) throw error;
}

// ─── Settings ─────────────────────────────────────────────────────────────

export async function getSettings(): Promise<StoreSettings | null> {
  const { data, error } = await db().from("store_settings").select("*").eq("id", 1).single();
  if (error) return null;
  return mapSettings(data as Record<string, unknown>);
}

export async function updateSettingsDB(s: StoreSettings): Promise<void> {
  const { error } = await db().from("store_settings").update({
    store_name: s.storeName, contact_email: s.contactEmail,
    currency: s.currency, tax_rate: s.taxRate,
    free_shipping_threshold: s.freeShippingThreshold,
    maintenance_mode: s.maintenanceMode,
  }).eq("id", 1);
  if (error) throw error;
}
