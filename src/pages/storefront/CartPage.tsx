"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const CartPage = () => {
  const { cart, products, updateCartQuantity, removeFromCart, settings } = useStore();
  const navigate = useNavigate();

  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const variant = item.variantId ? product?.variants?.find((v) => v.id === item.variantId) : null;
    return {
      ...item,
      product,
      variant,
    };
  }).filter((item) => item.product !== undefined);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant ? item.variant.price : (item.product?.price || 0);
    return sum + price * item.quantity;
  }, 0);

  const currency = settings.currency === "USD" ? "$" : settings.currency;
  const freeShippingThreshold = settings.freeShippingThreshold;
  const toFreeShip = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />

      <main className="flex-grow py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-10 uppercase">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={24} className="text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
              <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products" className="inline-block mt-8">
                <Button className="rounded-full h-12 px-8 font-bold uppercase tracking-widest text-xs">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Free Shipping Progress Bar */}
                {toFreeShip > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>
                        Add <span className="text-primary">{currency}{toFreeShip.toFixed(2)}</span> more for FREE shipping
                      </span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-100">
                  {cartItems.map((item) => {
                    const product = item.product!;
                    const variant = item.variant;
                    const price = variant ? variant.price : product.price;
                    const compareAtPrice = variant ? variant.price : product.compareAtPrice;
                    const savings = compareAtPrice && compareAtPrice > price ? compareAtPrice - price : 0;

                    return (
                      <div key={`${item.productId}-${item.variantId || ""}`} className="p-6 md:p-8 bg-white flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        {/* Image */}
                        <div className="w-24 h-24 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center p-3 flex-shrink-0">
                          <img
                            src={variant?.imageUrl || product.imageUrl}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="font-bold text-slate-900 text-base truncate hover:text-primary transition-colors">
                            <Link to={`/product/${product.id}`}>{product.title}</Link>
                          </h3>
                          {variant && (
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Option: {variant.optionValue}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 font-medium">
                            SKU: {variant?.sku || product.sku}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 rounded-full p-1 bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(product.id, item.quantity - 1, item.variantId)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-slate-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(product.id, item.quantity + 1, item.variantId)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price & Delete */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto gap-4 sm:gap-1">
                          <div className="text-right">
                            <p className="font-black text-slate-900 text-base">
                              {currency}{(price * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-[11px] text-slate-400 font-medium">
                                {currency}{price.toFixed(2)} each
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(product.id, item.variantId)}
                            className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                  Order Summary
                </h2>

                <div className="space-y-4 border-b border-slate-200/60 pb-6">
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-bold">{currency}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Shipping</span>
                    <span className="text-slate-900 font-bold">
                      {subtotal > freeShippingThreshold ? "FREE" : `${currency}9.99`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Estimated Tax</span>
                    <span className="text-slate-900 font-bold">
                      {currency}{(subtotal * settings.taxRate).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">
                      {currency}
                      {(
                        subtotal +
                        (subtotal > freeShippingThreshold ? 0 : 9.99) +
                        subtotal * settings.taxRate
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-xs gap-2 shadow-lg shadow-primary/10"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </Button>

                {/* Trust Badges */}
                <div className="pt-4 space-y-3 border-t border-slate-200/60">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <ShieldCheck size={16} className="text-primary" />
                    <span>Secure 256-bit SSL checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <RotateCcw size={16} className="text-primary" />
                    <span>30-day money-back guarantee</span>
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