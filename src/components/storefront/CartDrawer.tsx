"use client";

import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, AlertCircle,
  Tag, X, ChevronRight, Truck, Gift, Sparkles, Heart, Package,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { cart, products, discounts, updateCartQuantity, removeFromCart, clearCart, settings } = useStore();
  const navigate = useNavigate();

  // ── Promo code state ─────────────────────────────────────────────────
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; amount: number; type: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  // ── Wishlist (session-only save for later) ───────────────────────────
  const [savedForLater, setSavedForLater] = useState<string[]>([]);

  // ── Enrich cart ──────────────────────────────────────────────────────
  const cartItems = useMemo(() =>
    cart
      .map(item => ({ ...item, product: products.find(p => p.id === item.productId) }))
      .filter(item => item.product !== undefined),
  [cart, products]);

  const savedItems = useMemo(() =>
    savedForLater
      .map(id => products.find(p => p.id === id))
      .filter(Boolean),
  [savedForLater, products]);

  // ── Totals ───────────────────────────────────────────────────────────
  const subtotal = cartItems.reduce((s, i) => s + i.product!.price * i.quantity, 0);
  const savedAmount = cartItems.reduce((s, i) => {
    const cp = i.product!.compareAtPrice;
    return cp && cp > i.product!.price ? s + (cp - i.product!.price) * i.quantity : s;
  }, 0);
  const freeShipThreshold = settings.freeShippingThreshold || 50;
  const shipping = subtotal >= freeShipThreshold ? 0 : 9.99;
  const promoDiscount = appliedPromo ? Math.min(appliedPromo.amount, subtotal) : 0;
  const total = Math.max(0, subtotal + shipping - promoDiscount);
  const toFreeShip = Math.max(0, freeShipThreshold - subtotal);
  const freeShipProgress = Math.min(100, (subtotal / freeShipThreshold) * 100);

  const hasStockIssues = cartItems.some(
    i => i.product!.stockQuantity < i.quantity || i.product!.status !== "active"
  );
  const currency = settings.currency || "USD";
  const totalQty = cart.reduce((s, i) => s + i.quantity, 0);

  // ── Promo code ───────────────────────────────────────────────────────
  const applyPromo = async () => {
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const found = discounts.find(d => d.code.toUpperCase() === code && d.isActive);
    if (!found) {
      setPromoError("Invalid or expired code.");
      setPromoLoading(false);
      return;
    }
    const amount = found.type === "percentage"
      ? Math.round(subtotal * (found.value / 100) * 100) / 100
      : found.value;
    setAppliedPromo({ code: found.code, amount, type: found.type });
    setPromoCode("");
    setPromoLoading(false);
  };

  const removePromo = () => { setAppliedPromo(null); setPromoCode(""); setPromoError(""); };

  // ── Save for later ───────────────────────────────────────────────────
  const saveForLater = (productId: string) => {
    setSavedForLater(prev => [...prev, productId]);
    removeFromCart(productId);
  };
  const moveToCart = (productId: string) => {
    setSavedForLater(prev => prev.filter(id => id !== productId));
    const p = products.find(x => x.id === productId);
    if (p && p.status === "active" && p.stockQuantity > 0) {
      // addToCart is called via updateCartQuantity at qty 1
      updateCartQuantity(productId, 1);
    }
  };

  const handleCheckout = () => { onOpenChange(false); navigate("/checkout"); };

  // ─────────────────────────────────────────────────────────────────────
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 border-l border-[#F0F2F8] bg-white">

        {/* ── Header ── */}
        <SheetHeader className="px-5 py-4 bg-[#0E121A] sticky top-0 z-10">
          <SheetTitle className="flex items-center gap-3 text-white">
            <div className="w-9 h-9 bg-[#1160CB] rounded-[8px] flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={17} />
            </div>
            <span className="font-bold text-[16px]">Your Cart</span>
            {totalQty > 0 && (
              <span className="ml-auto text-[11px] font-bold text-white/50 bg-white/10 px-2.5 py-1 rounded-full">
                {totalQty} item{totalQty !== 1 ? "s" : ""}
              </span>
            )}
            {totalQty > 0 && (
              <button
                onClick={clearCart}
                className="text-[10px] font-bold text-white/30 hover:text-rose-400 transition-colors uppercase tracking-wider"
              >
                Clear all
              </button>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* ── Empty state ── */}
        {cartItems.length === 0 && savedItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#F0F2F8]">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <ShoppingBag className="h-9 w-9 text-[#0C0D10]/15" />
            </div>
            <h3 className="text-[17px] font-bold text-[#0C0D10] mb-2">Your cart is empty</h3>
            <p className="text-[13px] text-[#0C0D10]/40 mb-8 max-w-[200px] leading-relaxed">
              Browse our tech collection and find something you'll love.
            </p>
            <SheetClose asChild>
              <Link to="/products">
                <Button className="bg-[#1160CB] hover:bg-[#1528A1] text-white rounded-[8px] px-8 h-11 text-[13px] font-bold transition-all gap-2">
                  Shop Now <ArrowRight size={14} />
                </Button>
              </Link>
            </SheetClose>
          </div>
        ) : (
          <>
            {/* ── Free shipping progress ── */}
            {toFreeShip > 0 && (
              <div className="px-5 py-3 bg-[#EEF4FF] border-b border-[#C7D9F8]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Truck size={12} className="text-[#1160CB]" />
                    <span className="text-[11px] font-bold text-[#1160CB]">
                      Add{" "}
                      <span className="text-[#1528A1]">
                        {currency} {toFreeShip.toFixed(2)}
                      </span>{" "}
                      more for FREE shipping
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1160CB]/50">{Math.round(freeShipProgress)}%</span>
                </div>
                <div className="h-1.5 bg-[#C7D9F8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1160CB] rounded-full transition-all duration-500"
                    style={{ width: `${freeShipProgress}%` }}
                  />
                </div>
              </div>
            )}
            {toFreeShip === 0 && subtotal > 0 && (
              <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
                <Truck size={12} className="text-emerald-600" />
                <span className="text-[11px] font-bold text-emerald-700">🎉 You've unlocked FREE shipping!</span>
              </div>
            )}

            <ScrollArea className="flex-1 bg-[#F8F9FC]">
              <div className="p-4 space-y-3">

                {/* ── Cart items ── */}
                {cartItems.map((item) => {
                  const hasStockWarn = item.product!.stockQuantity < item.quantity;
                  const isUnavailable = item.product!.status !== "active";
                  const savings = item.product!.compareAtPrice && item.product!.compareAtPrice > item.product!.price
                    ? (item.product!.compareAtPrice - item.product!.price) * item.quantity
                    : 0;

                  return (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="bg-white rounded-[14px] border border-[#F0F2F8] overflow-hidden"
                      style={{ boxShadow: "0 2px 10px rgba(21,40,161,0.05)" }}
                    >
                      <div className="flex gap-3 p-3">
                        {/* Image */}
                        <Link
                          to={`/products/${item.productId}`}
                          onClick={() => onOpenChange(false)}
                          className="w-[72px] h-[72px] rounded-[10px] bg-[#F0F2F8] overflow-hidden flex-shrink-0 flex items-center justify-center"
                        >
                          <img
                            src={item.product!.imageUrl}
                            alt={item.product!.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <Link
                              to={`/products/${item.productId}`}
                              onClick={() => onOpenChange(false)}
                              className="font-semibold text-[#0C0D10] text-[13px] leading-snug line-clamp-2 hover:text-[#1160CB] transition-colors flex-1"
                            >
                              {item.product!.title}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.productId, item.variantId)}
                              className="w-6 h-6 flex items-center justify-center rounded-full text-[#0C0D10]/20 hover:bg-rose-50 hover:text-rose-500 transition-all flex-shrink-0"
                              title="Remove item"
                            >
                              <X size={13} />
                            </button>
                          </div>

                          <p className="text-[10px] font-bold text-[#1160CB] uppercase tracking-widest mt-0.5">
                            {item.product!.brand}
                          </p>

                          {isUnavailable && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-1">
                              <AlertCircle size={9} /> Unavailable
                            </span>
                          )}
                          {!isUnavailable && hasStockWarn && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
                              <AlertCircle size={9} /> Only {item.product!.stockQuantity} left
                            </span>
                          )}

                          {/* Price + qty row */}
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              <span className="font-black text-[#1528A1] text-[14px]">
                                {currency} {(item.product!.price * item.quantity).toFixed(2)}
                              </span>
                              {item.product!.compareAtPrice && item.product!.compareAtPrice > item.product!.price && (
                                <span className="ml-1.5 text-[11px] text-[#0C0D10]/30 line-through">
                                  {currency} {(item.product!.compareAtPrice * item.quantity).toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Qty stepper */}
                            <div className="flex items-center gap-0.5 bg-[#F0F2F8] rounded-full p-0.5">
                              <button
                                onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.variantId)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-all text-[#0C0D10]/60 hover:text-[#0C0D10] disabled:opacity-30"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-7 text-center text-[13px] font-bold text-[#0C0D10]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.variantId)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-all text-[#0C0D10]/60 hover:text-[#0C0D10] disabled:opacity-30"
                                disabled={item.quantity >= item.product!.stockQuantity}
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom action bar */}
                      <div className="flex items-center border-t border-[#F0F2F8] divide-x divide-[#F0F2F8]">
                        <button
                          onClick={() => saveForLater(item.productId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-[#0C0D10]/40 hover:text-[#1160CB] hover:bg-[#F0F2F8]/60 transition-all"
                        >
                          <Heart size={11} /> Save for later
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-[#0C0D10]/40 hover:text-rose-500 hover:bg-rose-50/50 transition-all"
                        >
                          <Trash2 size={11} /> Remove
                        </button>
                        <Link
                          to={`/products/${item.productId}`}
                          onClick={() => onOpenChange(false)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-[#0C0D10]/40 hover:text-[#1160CB] hover:bg-[#F0F2F8]/60 transition-all"
                        >
                          <Package size={11} /> View details
                        </Link>
                      </div>

                      {savings > 0 && (
                        <div className="bg-emerald-50 px-3 py-1.5 flex items-center gap-1.5">
                          <Sparkles size={10} className="text-emerald-600" />
                          <span className="text-[10px] font-bold text-emerald-700">
                            You save {currency} {savings.toFixed(2)} on this item
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* ── Saved for later ── */}
                {savedItems.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0C0D10]/30 px-1 mb-2">
                      Saved for later ({savedItems.length})
                    </p>
                    {savedItems.map(p => p && (
                      <div key={p.id} className="bg-white rounded-[12px] border border-[#F0F2F8] p-3 flex gap-3 items-center mb-2">
                        <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-[8px] object-cover bg-[#F0F2F8] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#0C0D10] line-clamp-1">{p.title}</p>
                          <p className="text-[12px] font-black text-[#1528A1]">{currency} {p.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => moveToCart(p.id)}
                          className="text-[10px] font-black text-[#1160CB] border border-[#1160CB]/20 px-3 py-1.5 rounded-full hover:bg-[#1160CB] hover:text-white transition-all whitespace-nowrap"
                        >
                          Move to cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Promo code ── */}
                <div className="bg-white rounded-[14px] border border-[#F0F2F8] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={13} className="text-[#1160CB]" />
                    <p className="text-[12px] font-bold text-[#0C0D10]">Promo / Discount Code</p>
                  </div>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-[8px]"
                      style={{ background: "rgba(5,177,105,0.08)", border: "1px solid rgba(5,177,105,0.2)" }}>
                      <div>
                        <span className="text-[11px] font-black text-emerald-700">{appliedPromo.code}</span>
                        <p className="text-[11px] text-emerald-600 mt-0.5">
                          − {currency} {promoDiscount.toFixed(2)} off
                        </p>
                      </div>
                      <button onClick={removePromo} className="text-[#0C0D10]/30 hover:text-rose-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <Input
                          value={promoCode}
                          onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                          onKeyDown={e => e.key === "Enter" && applyPromo()}
                          placeholder="Enter code (e.g. SAVE10)"
                          className="h-9 rounded-[8px] text-[12px] uppercase font-semibold flex-1"
                          style={{ border: "1.5px solid #F0F2F8" }}
                        />
                        <Button
                          type="button"
                          onClick={applyPromo}
                          disabled={promoLoading || !promoCode.trim()}
                          className="h-9 px-4 rounded-[8px] text-[11px] font-black bg-[#1160CB] hover:bg-[#1528A1] text-white flex-shrink-0"
                        >
                          {promoLoading ? "..." : "Apply"}
                        </Button>
                      </div>
                      {promoError && (
                        <p className="text-[11px] text-rose-500 font-medium">{promoError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Recommend CTA */}
                <div className="flex items-center gap-2 px-1 pb-1">
                  <Gift size={12} className="text-[#1160CB]/40" />
                  <span className="text-[10px] text-[#0C0D10]/30 font-medium">Free gift wrapping available at checkout</span>
                </div>

              </div>
            </ScrollArea>

            {/* ── Footer / totals ── */}
            <div className="border-t border-[#F0F2F8] bg-white px-5 py-5 space-y-4">

              {/* Line items */}
              <div className="space-y-2">
                <div className="flex justify-between text-[12px] text-[#0C0D10]/40">
                  <span>Subtotal ({totalQty} items)</span>
                  <span className="font-semibold text-[#0C0D10]">{currency} {subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-emerald-600 font-semibold">Promo ({appliedPromo.code})</span>
                    <span className="text-emerald-600 font-bold">− {currency} {promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[12px] text-[#0C0D10]/40">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : "text-[#0C0D10]"}`}>
                    {shipping === 0 ? "FREE" : `${currency} ${shipping.toFixed(2)}`}
                  </span>
                </div>
                {savedAmount > 0 && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Sparkles size={10} /> You're saving
                    </span>
                    <span className="text-emerald-600 font-bold">{currency} {savedAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="h-px bg-[#F0F2F8] my-1" />

                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-bold text-[#0C0D10]">Total</span>
                  <span className="text-[22px] font-black text-[#1528A1]">
                    {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2">
                <Button
                  className="w-full h-12 text-[14px] font-bold rounded-[10px] bg-[#1160CB] hover:bg-[#1528A1] text-white gap-2 transition-all"
                  disabled={hasStockIssues || cartItems.length === 0}
                  onClick={handleCheckout}
                >
                  Checkout <ArrowRight size={16} />
                </Button>

                <SheetClose asChild>
                  <Link to="/products" className="w-full">
                    <button className="w-full h-10 text-[12px] font-bold rounded-[10px] border border-[#F0F2F8] text-[#0C0D10]/50 hover:text-[#1160CB] hover:border-[#1160CB]/20 transition-all flex items-center justify-center gap-1.5">
                      Continue Shopping <ChevronRight size={13} />
                    </button>
                  </Link>
                </SheetClose>
              </div>

              {hasStockIssues && (
                <div className="flex items-center gap-2 text-rose-600 text-[11px] font-medium bg-rose-50 px-3 py-2.5 rounded-[8px]">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  Please resolve stock issues before checkout
                </div>
              )}

              {/* Trust line */}
              <p className="text-center text-[10px] text-[#0C0D10]/25 font-bold uppercase tracking-[2px]">
                🔒 Secure · Fast Delivery · Easy Returns
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
