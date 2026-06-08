"use client";

import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, AlertCircle,
  Tag, X, ChevronLeft, Truck, Gift, Sparkles, Heart, Package,
  ShieldCheck, RotateCcw, Zap,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";

const CartPage = () => {
  const { cart, products, discounts, updateCartQuantity, removeFromCart, clearCart, settings } = useStore();
  const navigate = useNavigate();

  // ── Promo code ───────────────────────────────────────────────────────────
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; amount: number; type: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  // ── Save for later (session only) ───────────────────────────────────────
  const [savedForLater, setSavedForLater] = useState<string[]>([]);

  // ── Enriched cart ────────────────────────────────────────────────────────
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

  // ── Totals ───────────────────────────────────────────────────────────────
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

  // ── Promo code logic ─────────────────────────────────────────────────────
  const applyPromo = async () => {
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const found = discounts.find(d => d.code.toUpperCase() === code && d.isActive);
    if (!found) {
      setPromoError("Invalid or expired promo code.");
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

  // ── Save for later ───────────────────────────────────────────────────────
  const saveForLater = (productId: string) => {
    setSavedForLater(prev => [...prev, productId]);
    removeFromCart(productId);
  };
  const moveToCart = (productId: string) => {
    setSavedForLater(prev => prev.filter(id => id !== productId));
    const p = products.find(x => x.id === productId);
    if (p && p.status === "active" && p.stockQuantity > 0) {
      updateCartQuantity(productId, 1);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      <Header />

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* ── Page title ── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-black text-[#0C0D10]">
                Shopping Cart
                {totalQty > 0 && (
                  <span className="ml-3 text-[15px] font-bold text-[#0C0D10]/30">
                    ({totalQty} item{totalQty !== 1 ? "s" : ""})
                  </span>
                )}
              </h1>
              <p className="text-[13px] text-[#0C0D10]/40 mt-1">Review your items before checkout</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold text-[#0C0D10]/40 hover:text-[#1160CB] transition-colors"
            >
              <ChevronLeft size={15} /> Continue Shopping
            </Link>
          </div>

          {/* ── Empty state ── */}
          {cartItems.length === 0 && savedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#F0F2F8]">
                <ShoppingBag className="h-11 w-11 text-[#0C0D10]/15" />
              </div>
              <h2 className="text-[22px] font-black text-[#0C0D10] mb-2">Your cart is empty</h2>
              <p className="text-[14px] text-[#0C0D10]/40 mb-8 max-w-[260px] leading-relaxed">
                Browse our tech collection and find something you'll love.
              </p>
              <Link to="/products">
                <Button className="bg-[#1160CB] hover:bg-[#1528A1] text-white rounded-[10px] px-10 h-12 text-[14px] font-bold transition-all gap-2">
                  Shop Now <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

              {/* ════════════════════════════════════════
                  LEFT COLUMN — items
              ════════════════════════════════════════ */}
              <div className="lg:col-span-2 space-y-4">

                {/* Free shipping progress */}
                {toFreeShip > 0 && (
                  <div className="bg-[#EEF4FF] border border-[#C7D9F8] rounded-[14px] px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-[#1160CB]" />
                        <span className="text-[13px] font-bold text-[#1160CB]">
                          Add <span className="text-[#1528A1]">{currency} {toFreeShip.toFixed(2)}</span> more for FREE shipping
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#1160CB]/50">{Math.round(freeShipProgress)}%</span>
                    </div>
                    <div className="h-2 bg-[#C7D9F8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1160CB] rounded-full transition-all duration-500"
                        style={{ width: `${freeShipProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Cart items header row */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#0C0D10]/30">
                    Items in your cart
                  </span>
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-[11px] font-bold text-[#0C0D10]/30 hover:text-rose-500 transition-colors uppercase tracking-wider"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Cart items */}
                {cartItems.map((item) => {
                  const hasStockWarn = item.product!.stockQuantity < item.quantity;
                  const isUnavailable = item.product!.status !== "active";
                  const savings = item.product!.compareAtPrice && item.product!.compareAtPrice > item.product!.price
                    ? (item.product!.compareAtPrice - item.product!.price) * item.quantity
                    : 0;

                  return (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="bg-white rounded-[16px] border border-[#F0F2F8] overflow-hidden"
                      style={{ boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}
                    >
                      <div className="flex gap-4 p-4 sm:p-5">
                        {/* Product image */}
                        <Link
                          to={`/product/${item.productId}`}
                          className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-[12px] bg-[#F0F2F8] overflow-hidden flex-shrink-0 flex items-center justify-center"
                        >
                          <img
                            src={item.product!.imageUrl}
                            alt={item.product!.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${item.productId}`}
                                className="font-bold text-[#0C0D10] text-[15px] leading-snug hover:text-[#1160CB] transition-colors line-clamp-2"
                              >
                                {item.product!.title}
                              </Link>
                              <p className="text-[11px] font-black text-[#1160CB] uppercase tracking-widest mt-1">
                                {item.product!.brand}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId, item.variantId)}
                              className="w-7 h-7 flex items-center justify-center rounded-full text-[#0C0D10]/20 hover:bg-rose-50 hover:text-rose-500 transition-all flex-shrink-0 mt-0.5"
                              title="Remove item"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Badges */}
                          {isUnavailable && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-2">
                              <AlertCircle size={9} /> Unavailable
                            </span>
                          )}
                          {!isUnavailable && hasStockWarn && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-2">
                              <AlertCircle size={9} /> Only {item.product!.stockQuantity} left
                            </span>
                          )}

                          {/* Price + qty row */}
                          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                            <div>
                              <span className="font-black text-[#1528A1] text-[18px]">
                                {currency} {(item.product!.price * item.quantity).toFixed(2)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="ml-2 text-[12px] text-[#0C0D10]/30">
                                  ({currency} {item.product!.price.toFixed(2)} each)
                                </span>
                              )}
                              {item.product!.compareAtPrice && item.product!.compareAtPrice > item.product!.price && (
                                <span className="ml-2 text-[12px] text-[#0C0D10]/30 line-through">
                                  {currency} {(item.product!.compareAtPrice * item.quantity).toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Qty stepper */}
                            <div className="flex items-center gap-1 bg-[#F0F2F8] rounded-full p-1">
                              <button
                                onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.variantId)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-all text-[#0C0D10]/60 hover:text-[#0C0D10] disabled:opacity-30 hover:shadow-sm"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-8 text-center text-[14px] font-black text-[#0C0D10]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.variantId)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-all text-[#0C0D10]/60 hover:text-[#0C0D10] disabled:opacity-30 hover:shadow-sm"
                                disabled={item.quantity >= item.product!.stockQuantity}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Item action bar */}
                      <div className="flex items-center border-t border-[#F0F2F8] divide-x divide-[#F0F2F8]">
                        <button
                          onClick={() => saveForLater(item.productId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-[#0C0D10]/40 hover:text-[#1160CB] hover:bg-[#F0F2F8]/60 transition-all"
                        >
                          <Heart size={12} /> Save for later
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-[#0C0D10]/40 hover:text-rose-500 hover:bg-rose-50/50 transition-all"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                        <Link
                          to={`/product/${item.productId}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-[#0C0D10]/40 hover:text-[#1160CB] hover:bg-[#F0F2F8]/60 transition-all"
                        >
                          <Package size={12} /> View details
                        </Link>
                      </div>

                    </div>
                  );
                })}

                {/* ── Saved for later ── */}
                {savedItems.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#0C0D10]/30 px-1 mb-3">
                      Saved for later ({savedItems.length})
                    </p>
                    <div className="space-y-2">
                      {savedItems.map(p => p && (
                        <div key={p.id} className="bg-white rounded-[14px] border border-[#F0F2F8] p-4 flex gap-4 items-center">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-16 h-16 rounded-[10px] object-cover bg-[#F0F2F8] flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#0C0D10] line-clamp-1">{p.title}</p>
                            <p className="text-[13px] font-black text-[#1528A1] mt-0.5">{currency} {p.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => moveToCart(p.id)}
                            className="text-[12px] font-black text-[#1160CB] border border-[#1160CB]/20 px-4 py-2 rounded-full hover:bg-[#1160CB] hover:text-white transition-all whitespace-nowrap"
                          >
                            Move to cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Gift / promo note ── */}
                <div className="flex items-center gap-2 px-1">
                  <Gift size={13} className="text-[#1160CB]/40" />
                  <span className="text-[12px] text-[#0C0D10]/30 font-medium">Free gift wrapping available at checkout</span>
                </div>
              </div>

              {/* ════════════════════════════════════════
                  RIGHT COLUMN — order summary
              ════════════════════════════════════════ */}
              <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">

                {/* Promo code */}
                <div className="bg-white rounded-[16px] border border-[#F0F2F8] p-5"
                  style={{ boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={14} className="text-[#1160CB]" />
                    <p className="text-[13px] font-bold text-[#0C0D10]">Promo / Discount Code</p>
                  </div>
                  {appliedPromo ? (
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded-[10px]"
                      style={{ background: "rgba(5,177,105,0.08)", border: "1px solid rgba(5,177,105,0.2)" }}
                    >
                      <div>
                        <span className="text-[12px] font-black text-emerald-700">{appliedPromo.code}</span>
                        <p className="text-[12px] text-emerald-600 mt-0.5">
                          − {currency} {promoDiscount.toFixed(2)} off
                        </p>
                      </div>
                      <button onClick={removePromo} className="text-[#0C0D10]/30 hover:text-rose-500 transition-colors">
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={promoCode}
                          onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                          onKeyDown={e => e.key === "Enter" && applyPromo()}
                          placeholder="e.g. SAVE10"
                          className="h-10 rounded-[8px] text-[13px] uppercase font-semibold flex-1"
                          style={{ border: "1.5px solid #F0F2F8" }}
                        />
                        <Button
                          type="button"
                          onClick={applyPromo}
                          disabled={promoLoading || !promoCode.trim()}
                          className="h-10 px-5 rounded-[8px] text-[12px] font-black bg-[#1160CB] hover:bg-[#1528A1] text-white flex-shrink-0"
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

                {/* Order summary */}
                <div
                  className="bg-white rounded-[16px] border border-[#F0F2F8] p-5 space-y-4"
                  style={{ boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}
                >
                  <p className="text-[13px] font-black text-[#0C0D10] uppercase tracking-widest">Order Summary</p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#0C0D10]/50">Subtotal ({totalQty} items)</span>
                      <span className="font-semibold text-[#0C0D10]">{currency} {subtotal.toFixed(2)}</span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-[13px]">
                        <span className="text-emerald-600 font-semibold">Promo ({appliedPromo.code})</span>
                        <span className="text-emerald-600 font-bold">− {currency} {promoDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#0C0D10]/50">Shipping</span>
                      <span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : "text-[#0C0D10]"}`}>
                        {shipping === 0 ? "FREE" : `${currency} ${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    {savedAmount > 0 && (
                      <div className="flex justify-between text-[13px]">
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Sparkles size={11} /> Total savings
                        </span>
                        <span className="text-emerald-600 font-bold">{currency} {savedAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-[#F0F2F8]" />

                  <div className="flex justify-between items-center">
                    <span className="text-[16px] font-bold text-[#0C0D10]">Total</span>
                    <span className="text-[26px] font-black text-[#1528A1]">
                      {currency} {total.toFixed(2)}
                    </span>
                  </div>

                  {hasStockIssues && (
                    <div className="flex items-center gap-2 text-rose-600 text-[12px] font-medium bg-rose-50 px-3 py-2.5 rounded-[8px]">
                      <AlertCircle size={13} className="flex-shrink-0" />
                      Please resolve stock issues before checkout
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="space-y-2.5 pt-1">
                    <Button
                      className="w-full h-13 text-[15px] font-bold rounded-[12px] bg-[#1160CB] hover:bg-[#1528A1] text-white gap-2 transition-all"
                      style={{ height: 52 }}
                      disabled={hasStockIssues || cartItems.length === 0}
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout <ArrowRight size={17} />
                    </Button>
                    <Link to="/products" className="block">
                      <button className="w-full h-11 text-[13px] font-bold rounded-[12px] border border-[#F0F2F8] text-[#0C0D10]/50 hover:text-[#1160CB] hover:border-[#1160CB]/20 transition-all flex items-center justify-center gap-1.5">
                        <ChevronLeft size={14} /> Continue Shopping
                      </button>
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F0F2F8]">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <div className="w-8 h-8 bg-[#EEF4FF] rounded-full flex items-center justify-center">
                        <ShieldCheck size={14} className="text-[#1160CB]" />
                      </div>
                      <span className="text-[9px] font-bold text-[#0C0D10]/40 uppercase tracking-wide leading-tight">Secure<br/>Payment</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <div className="w-8 h-8 bg-[#EEF4FF] rounded-full flex items-center justify-center">
                        <Zap size={14} className="text-[#1160CB]" />
                      </div>
                      <span className="text-[9px] font-bold text-[#0C0D10]/40 uppercase tracking-wide leading-tight">Fast<br/>Delivery</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <div className="w-8 h-8 bg-[#EEF4FF] rounded-full flex items-center justify-center">
                        <RotateCcw size={14} className="text-[#1160CB]" />
                      </div>
                      <span className="text-[9px] font-bold text-[#0C0D10]/40 uppercase tracking-wide leading-tight">Easy<br/>Returns</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
