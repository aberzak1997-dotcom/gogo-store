import type { Discount, Product, StoreSettings } from "../types";

/**
 * Single source of truth for cart / checkout / order totals.
 * Prices include VAT, so no tax is added on top.
 */

export const SHIPPING_FEE = 9.99;
export const DEFAULT_FREE_SHIPPING_THRESHOLD = 50;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Price of one unit: the variant's price when it has one, else the product's */
export function unitPrice(product: Product, variantId?: string): number {
  const variant = variantId ? product.variants?.find(v => v.id === variantId) : undefined;
  return variant && variant.price > 0 ? variant.price : product.price;
}

export function freeShippingThreshold(settings: StoreSettings): number {
  return settings.freeShippingThreshold || DEFAULT_FREE_SHIPPING_THRESHOLD;
}

/** Returns an error message, or null when the code can be used on this subtotal */
export function discountError(discount: Discount | undefined, subtotal: number, currency: string): string | null {
  if (!discount || !discount.isActive) return "Invalid or expired discount code.";
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) return "This discount code has expired.";
  if (discount.maxUses && discount.usedCount >= discount.maxUses) return "This discount code has reached its usage limit.";
  if (discount.minOrderAmount && subtotal < discount.minOrderAmount) {
    return `This code needs a minimum order of ${currency} ${discount.minOrderAmount.toFixed(2)}.`;
  }
  return null;
}

export function findDiscount(discounts: Discount[], code: string): Discount | undefined {
  const normalized = code.trim().toUpperCase();
  return normalized ? discounts.find(d => d.code.toUpperCase() === normalized) : undefined;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

/** Free shipping is based on the merchandise subtotal, before any discount */
export function calculateTotals(subtotal: number, settings: StoreSettings, discount?: Discount | null): Totals {
  const threshold = freeShippingThreshold(settings);
  const shipping = subtotal >= threshold ? 0 : SHIPPING_FEE;
  const discountAmount = !discount
    ? 0
    : discount.type === "percentage"
      ? round2(subtotal * (discount.value / 100))
      : Math.min(discount.value, subtotal);

  return {
    subtotal: round2(subtotal),
    discount: discountAmount,
    shipping,
    total: round2(Math.max(0, subtotal - discountAmount) + shipping),
    freeShippingThreshold: threshold,
    amountToFreeShipping: Math.max(0, round2(threshold - subtotal)),
  };
}

// The applied code travels from the cart drawer to checkout for this visit
const DISCOUNT_KEY = "applied_discount_code";

export function getSavedDiscountCode(): string {
  try {
    return sessionStorage.getItem(DISCOUNT_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveDiscountCode(code: string | null) {
  try {
    if (code) sessionStorage.setItem(DISCOUNT_KEY, code);
    else sessionStorage.removeItem(DISCOUNT_KEY);
  } catch {
    /* storage unavailable: the code just won't carry over */
  }
}
