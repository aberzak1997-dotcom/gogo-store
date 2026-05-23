"use client";

import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2, CheckCircle, AlertTriangle, ArrowLeft,
  ShieldCheck, Truck, CreditCard, Lock, Zap, RotateCcw, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "../../utils/toast";
import { Product, CartItem } from "../../types";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const isPayPalConfigured = Boolean(
  import.meta.env.VITE_PAYPAL_CLIENT_ID &&
  import.meta.env.VITE_PAYPAL_CLIENT_ID !== "test" &&
  !import.meta.env.VITE_PAYPAL_CLIENT_ID.includes("YOUR")
);

const CheckoutPage = () => {
  const { cart, products, settings, createOrder, updatePaymentStatus } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [address, setAddress]       = useState("");
  const [city, setCity]             = useState("");
  const [country, setCountry]       = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cod">("paypal");
  const [isPlacing, setIsPlacing]   = useState(false);
  const [orderId, setOrderId]       = useState<string | null>(null);
  const [paidVia, setPaidVia]       = useState<"card" | "paypal" | "cod">("paypal");

  const isFormValid = Boolean(
    fullName.trim() && email.trim() && phone.trim() &&
    address.trim() && city.trim() && country.trim()
  );

  const enrichedCart = useMemo(() => {
    return cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...item, product } : null;
    }).filter(Boolean) as (CartItem & { product: Product })[];
  }, [cart, products]);

  if (enrichedCart.length === 0 && !orderId) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow section-container py-24">
          <div className="max-w-xl mx-auto text-center p-16 rounded-none bg-slate-50 border border-slate-100">
            <div className="w-24 h-24 bg-white rounded-none flex items-center justify-center mx-auto mb-10 shadow-sm">
              <AlertTriangle className="h-12 w-12 text-slate-200" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-slate-900 uppercase tracking-tight">Your Cart is Empty</h2>
            <p className="text-slate-500 mb-12 text-lg font-medium">
              You need to add some tech gear to your cart before you can checkout.
            </p>
            <Button size="lg" className="rounded-full h-16 px-12 text-sm font-black uppercase tracking-widest" onClick={() => navigate("/")}>
              Return to Store
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = enrichedCart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal > (settings.freeShippingThreshold || 100) ? 0 : 9.99;
  const tax      = Math.round(subtotal * (settings.taxRate || 0.07) * 100) / 100;
  const total    = subtotal + shipping + tax;
  const currency = settings.currency || "USD";

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const placeOrder = (method: "card" | "paypal" | "cod"): string | null => {
    return createOrder({ customerName: fullName, email, phone, address, city, country });
  };

  // ─── Card / COD submit ─────────────────────────────────────────────────────

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) { showError("Please fill in all required fields"); return; }
    setIsPlacing(true);
    await new Promise(res => setTimeout(res, 1200));
    const newOrderId = placeOrder(paymentMethod as "card" | "cod");
    if (newOrderId) {
      setPaidVia(paymentMethod as "card" | "paypal" | "cod");
      setOrderId(newOrderId);
    }
    setIsPlacing(false);
  };

  // ─── Success screen ────────────────────────────────────────────────────────

  if (orderId) {
    const methodLabel =
      paidVia === "paypal" ? "PayPal" :
      paidVia === "cod"    ? "Cash on Delivery (COD)" :
                             "Credit Card";
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow section-container py-24">
          <div className="max-w-2xl mx-auto rounded-none shadow-2xl border border-slate-100 overflow-hidden bg-white">
            <div className="bg-slate-900 p-16 text-center text-white">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">Order Confirmed!</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Thank you for shopping with ElectroStore
              </p>
            </div>
            <div className="p-16 space-y-10">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Number</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{orderId}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
                  <p className="text-xl font-black text-slate-900">{currency} {total.toFixed(2)}</p>
                </div>
              </div>
              <Separator className="bg-slate-100" />
              <div className="space-y-6">
                <p className="text-slate-500 leading-relaxed text-center font-medium">
                  We've sent a confirmation email to <span className="font-black text-slate-900">{email}</span>
                </p>
                <div className="bg-slate-50 p-8 rounded-none border border-slate-100 flex items-center gap-6">
                  <div className="p-4 bg-white rounded-none shadow-sm text-primary"><Truck size={28} /></div>
                  <div>
                    <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Estimated Delivery</p>
                    <p className="text-sm text-slate-500 font-bold">3–5 Business Days</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-none border border-slate-100 flex items-center gap-6">
                  <div className="p-4 bg-white rounded-none shadow-sm text-primary"><CreditCard size={28} /></div>
                  <div>
                    <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Payment Method</p>
                    <p className="text-sm text-slate-500 font-bold">{methodLabel}</p>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full rounded-full h-16 text-sm font-black uppercase tracking-widest gap-3 shadow-2xl shadow-primary/20"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Main checkout ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow section-container py-16">
        <div className="flex items-center justify-between mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Store
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">

          {/* ── Left: Shipping + Payment ─────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Shipping */}
            <div className="rounded-none border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 border-b border-slate-100 p-8">
                <h3 className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-900">
                  <div className="p-2 bg-white rounded-none text-primary shadow-sm"><Truck size={20} /></div>
                  Shipping Information
                </h3>
              </div>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                  <Input className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                  <Input type="email" className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</Label>
                  <Input className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Street Address</Label>
                  <Input className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Tech Lane" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</Label>
                  <Input className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white" value={city} onChange={e => setCity(e.target.value)} placeholder="San Francisco" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Country</Label>
                  <Input className="h-14 rounded-none border-slate-200 bg-slate-50/50 focus:bg-white" value={country} onChange={e => setCountry(e.target.value)} placeholder="United States" required />
                </div>
              </form>
            </div>

            {/* Payment */}
            <div className="rounded-none border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 border-b border-slate-100 p-8">
                <h3 className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-900">
                  <div className="p-2 bg-white rounded-none text-primary shadow-sm"><CreditCard size={20} /></div>
                  Payment Method
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}>
                  <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 bg-slate-50/50 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isPayPalConfigured && (
                      <SelectItem value="paypal">
                        <span className="font-bold">PayPal</span>
                      </SelectItem>
                    )}
                    <SelectItem value="card">Credit / Debit Card</SelectItem>
                    <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                  </SelectContent>
                </Select>

                {/* PayPal */}
                {paymentMethod === "paypal" && (
                  <div className="space-y-4">
                    {/* PayPal logo banner */}
                    <div className="flex items-center gap-3 bg-[#003087]/5 border border-[#009cde]/20 rounded-xl p-4">
                      <img
                        src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
                        alt="PayPal"
                        className="h-6"
                      />
                      <div>
                        <p className="text-sm font-black text-[#003087]">Pay securely with PayPal</p>
                        <p className="text-xs text-slate-500">You'll be redirected to PayPal to complete payment</p>
                      </div>
                    </div>

                    {!isFormValid ? (
                      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-700 font-medium">
                          Please fill in all shipping information above before paying with PayPal.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl overflow-hidden">
                        <PayPalButtons
                          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 48 }}
                          disabled={!isFormValid}
                          createOrder={(_data, actions) =>
                            actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [{
                                description: "GoGo Store Purchase",
                                amount: {
                                  currency_code: currency,
                                  value: total.toFixed(2),
                                  breakdown: {
                                    item_total: { currency_code: currency, value: subtotal.toFixed(2) },
                                    shipping:   { currency_code: currency, value: shipping.toFixed(2) },
                                    tax_total:  { currency_code: currency, value: tax.toFixed(2) },
                                  },
                                },
                              }],
                            })
                          }
                          onApprove={async (_data, actions) => {
                            await actions.order!.capture();
                            const newOrderId = placeOrder("paypal");
                            if (newOrderId) {
                              updatePaymentStatus(newOrderId, "paid");
                              setPaidVia("paypal");
                              setOrderId(newOrderId);
                              showSuccess("Payment successful! Order confirmed.");
                            }
                          }}
                          onError={() => showError("PayPal payment failed. Please try again.")}
                          onCancel={() => showError("Payment cancelled.")}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Card */}
                {paymentMethod === "card" && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-primary"><Lock size={22} /></div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">Secure Payment</p>
                        <p className="text-xs text-slate-500 font-medium">SSL-encrypted, processed safely</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-transparent font-black text-[10px] uppercase tracking-wider rounded-full">
                      Encrypted
                    </Badge>
                  </div>
                )}

                {/* COD */}
                {paymentMethod === "cod" && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-primary"><Truck size={22} /></div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">Cash on Delivery</p>
                      <p className="text-xs text-slate-500 font-medium">
                        Pay {currency} {total.toFixed(2)} in cash when your order arrives.
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
                  By placing your order you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ──────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-none border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6">Order Summary</h3>
                  <div className="divide-y divide-slate-50">
                    {enrichedCart.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 py-4">
                        <div className="w-12 h-12 rounded-none bg-slate-50 border border-slate-100 p-1.5 flex-shrink-0">
                          <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-slate-900 text-xs uppercase tracking-tight line-clamp-1">{item.product.title}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-black text-slate-900 text-sm tracking-tight flex-shrink-0">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-slate-900">{currency} {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Shipping</span>
                    <span className={shipping === 0 ? "text-emerald-600" : "text-slate-900"}>
                      {shipping === 0 ? "FREE" : `${currency} ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Tax ({Math.round((settings.taxRate || 0.07) * 100)}%)</span>
                    <span className="text-slate-900">{currency} {tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4 bg-slate-50" />
                  <div className="flex justify-between items-end">
                    <span className="text-slate-900 font-black text-lg uppercase tracking-tighter">Total</span>
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">
                      {currency} {total.toFixed(2)}
                    </span>
                  </div>

                  {/* Place Order button — only for card / COD */}
                  {paymentMethod !== "paypal" && (
                    <Button
                      form="checkout-form"
                      type="submit"
                      className="w-full h-16 text-sm font-black uppercase tracking-widest gap-3 rounded-full shadow-2xl shadow-primary/20 mt-4"
                      disabled={isPlacing}
                    >
                      {isPlacing ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                      ) : (
                        <>Place Order <Zap size={20} /></>
                      )}
                    </Button>
                  )}

                  {paymentMethod === "paypal" && !isFormValid && (
                    <p className="text-center text-xs text-slate-400 font-medium pt-2">
                      Fill in your shipping info to unlock PayPal checkout
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-none border border-slate-100 flex flex-col items-center text-center gap-3">
                  <ShieldCheck className="text-emerald-500" size={28} />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Checkout</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-none border border-slate-100 flex flex-col items-center text-center gap-3">
                  <RotateCcw className="text-blue-500" size={28} />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
