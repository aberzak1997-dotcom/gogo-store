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
import { Separator } from "@/components/ui/separator";
import {
  Loader2, CheckCircle, AlertTriangle, ArrowLeft,
  ShieldCheck, Truck, CreditCard, Lock, Zap, RotateCcw,
  Info, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "../../utils/toast";
import { Product, CartItem } from "../../types";

// ─── Brand card logos (card-chip style) ────────────────────────────────────────

const VisaLogo = () => (
  <div className="w-[46px] h-[30px] bg-white rounded-[4px] border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
    <span className="font-black text-[15px] italic text-[#1A1F71] tracking-wider select-none">VISA</span>
  </div>
);

const MastercardLogo = () => (
  <div className="w-[46px] h-[30px] bg-white rounded-[4px] border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
    <div className="relative w-[30px] h-[20px] flex items-center">
      <div className="w-[20px] h-[20px] bg-[#EB001B] rounded-full absolute left-0" />
      <div className="w-[20px] h-[20px] bg-[#F79E1B] rounded-full absolute right-0" style={{ mixBlendMode: "multiply" }} />
    </div>
  </div>
);

const AmexLogo = () => (
  <div className="w-[46px] h-[30px] bg-[#2557D6] rounded-[4px] border border-[#1a46bb] shadow-sm flex items-center justify-center overflow-hidden">
    <span className="text-white font-black text-[9px] tracking-[2.5px] select-none">AMEX</span>
  </div>
);

const PayPalLogo = () => (
  <div className="h-[30px] px-3 bg-white rounded-[4px] border border-slate-100 shadow-sm flex items-center gap-0 overflow-hidden">
    <span className="font-black text-[#003087] text-[14px] leading-none select-none">Pay</span>
    <span className="font-black text-[#009cde] text-[14px] leading-none select-none">Pal</span>
  </div>
);

const StripeLogo = () => (
  <div className="w-[46px] h-[30px] bg-[#635BFF] rounded-[4px] border border-[#4e45e5] shadow-sm flex items-center justify-center overflow-hidden">
    <span className="text-white font-black text-[11px] tracking-tight select-none">stripe</span>
  </div>
);

const CMILogo = () => (
  <div className="w-[46px] h-[30px] bg-white rounded-[4px] border-2 border-[#00796B] shadow-sm flex items-center justify-center overflow-hidden">
    <span className="text-[#00796B] font-black text-[10px] tracking-[2px] select-none">CMI</span>
  </div>
);

const WepayLogo = () => (
  <div className="w-[46px] h-[30px] bg-[#1C3F94] rounded-[4px] border border-[#152f73] shadow-sm flex items-center justify-center overflow-hidden">
    <span className="text-white font-black text-[9px] tracking-tight select-none">WePay</span>
  </div>
);

// ─── PayPal check ──────────────────────────────────────────────────────────────
const isPayPalConfigured = Boolean(
  (localStorage.getItem("paypal_client_id") && localStorage.getItem("paypal_client_id")!.length > 10) ||
  (import.meta.env.VITE_PAYPAL_CLIENT_ID &&
    import.meta.env.VITE_PAYPAL_CLIENT_ID !== "test" &&
    !import.meta.env.VITE_PAYPAL_CLIENT_ID.includes("YOUR"))
);

type PayMethod = "cod" | "card" | "paypal";

// ─── Payment option definitions ────────────────────────────────────────────────
const ACTIVE_OPTIONS: {
  id: PayMethod;
  name: string;
  desc: string;
  icon: React.ReactNode;
  logos: React.ReactNode;
  show: boolean;
}[] = [
  {
    id: "cod",
    name: "Cash on Delivery",
    desc: "Pay in cash when your order arrives",
    icon: <Truck size={18} className="text-amber-500" />,
    logos: (
      <div className="w-[46px] h-[30px] bg-amber-50 rounded-[4px] border border-amber-200 shadow-sm flex items-center justify-center">
        <Truck size={16} className="text-amber-500" />
      </div>
    ),
    show: true,
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    desc: "Visa, Mastercard, American Express",
    icon: <CreditCard size={18} className="text-primary" />,
    logos: (
      <div className="flex items-center gap-1.5">
        <VisaLogo /><MastercardLogo /><AmexLogo />
      </div>
    ),
    show: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    desc: "Pay securely via your PayPal account",
    icon: <Lock size={18} className="text-blue-500" />,
    logos: <PayPalLogo />,
    show: isPayPalConfigured,
  },
];

const COMING_SOON_OPTIONS = [
  { id: "stripe", name: "Stripe",  desc: "Card payments via Stripe",        logo: <StripeLogo /> },
  { id: "cmi",    name: "CMI",     desc: "Carte Monétique Interbancaire",    logo: <CMILogo /> },
  { id: "wepay",  name: "WePay",   desc: "Simple & secure bank transfers",   logo: <WepayLogo /> },
];

// ─── Main component ────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { cart, products, settings, discounts, createOrder, updatePaymentStatus } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [address, setAddress]     = useState("");
  const [city, setCity]           = useState("");
  const [country, setCountry]     = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("cod");
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId, setOrderId]     = useState<string | null>(null);
  const [paidVia, setPaidVia]     = useState<PayMethod>("cod");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; type: string } | null>(null);
  const [discountError, setDiscountError] = useState("");

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
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center py-24 px-4">
          <div className="max-w-md w-full text-center bg-white rounded-3xl p-16 shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black mb-3 text-slate-900 uppercase tracking-tight">Cart is Empty</h2>
            <p className="text-slate-500 mb-8 font-medium text-sm">Add products to your cart before checking out.</p>
            <Button className="rounded-full h-12 px-8 font-black uppercase tracking-widest text-xs" onClick={() => navigate("/")}>
              Browse Products
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
  const discountAmount = appliedDiscount ? Math.min(appliedDiscount.amount, subtotal) : 0;
  const total    = Math.max(0, subtotal + shipping + tax - discountAmount);
  const currency = settings.currency || "USD";

  const handleApplyDiscount = () => {
    setDiscountError("");
    const code = discountCode.trim().toUpperCase();
    if (!code) return;
    const found = discounts.find(d => d.code.toUpperCase() === code && d.isActive);
    if (!found) {
      setDiscountError("Invalid or expired discount code.");
      setAppliedDiscount(null);
      return;
    }
    const amount = found.type === "percentage"
      ? Math.round(subtotal * (found.value / 100) * 100) / 100
      : found.value;
    setAppliedDiscount({ code: found.code, amount, type: found.type });
    showSuccess(`Discount "${found.code}" applied! You save {currency} {amount.toFixed(2)}`);
  };

  const placeOrder = (): string | null =>
    createOrder({ customerName: fullName, email, phone, address, city, country });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) { showError("Please fill in all shipping fields."); return; }
    setIsPlacing(true);
    await new Promise(res => setTimeout(res, 1200));
    const newOrderId = placeOrder();
    if (newOrderId) { setPaidVia(paymentMethod); setOrderId(newOrderId); }
    setIsPlacing(false);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (orderId) {
    const methodLabel = paidVia === "paypal" ? "PayPal" : paidVia === "cod" ? "Cash on Delivery" : "Credit / Debit Card";
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-14 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-500/30">
                <CheckCircle className="h-9 w-9 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Order Confirmed!</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Thank you for your purchase</p>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Order #</p>
                  <p className="font-black text-slate-900 text-sm">{orderId}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Total</p>
                  <p className="font-black text-slate-900 text-sm">{currency} {total.toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xs uppercase tracking-wider">Estimated Delivery</p>
                  <p className="text-slate-500 text-sm font-medium mt-0.5">3–5 Business Days</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xs uppercase tracking-wider">Payment</p>
                  <p className="text-slate-500 text-sm font-medium mt-0.5">{methodLabel}</p>
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 font-medium">
                Confirmation sent to <span className="font-black text-slate-700">{email}</span>
              </p>
              <Button className="w-full h-13 rounded-2xl font-black uppercase tracking-widest text-xs h-12" onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main checkout ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Checkout</h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{enrichedCart.length} item{enrichedCart.length !== 1 ? "s" : ""} in your cart</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <ShieldCheck size={12} /> Secure
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">

            {/* ── Left column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-5">

              {/* Shipping */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Truck size={17} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Shipping Info</h2>
                    <p className="text-[10px] text-slate-400 font-medium">Where should we deliver?</p>
                  </div>
                </div>
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name *</Label>
                      <Input
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus-visible:ring-primary/30 transition-colors font-medium"
                        value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder="John Doe" required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email *</Label>
                      <Input
                        type="email"
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus-visible:ring-primary/30 transition-colors font-medium"
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="john@example.com" required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone *</Label>
                      <Input
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus-visible:ring-primary/30 transition-colors font-medium"
                        value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000" required
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Street Address *</Label>
                      <Input
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus-visible:ring-primary/30 transition-colors font-medium"
                        value={address} onChange={e => setAddress(e.target.value)}
                        placeholder="123 Tech Lane, Apt 4B" required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City *</Label>
                      <Input
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus-visible:ring-primary/30 transition-colors font-medium"
                        value={city} onChange={e => setCity(e.target.value)}
                        placeholder="San Francisco" required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Country *</Label>
                      <Input
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus-visible:ring-primary/30 transition-colors font-medium"
                        value={country} onChange={e => setCountry(e.target.value)}
                        placeholder="United States" required
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <CreditCard size={17} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Payment Method</h2>
                    <p className="text-[10px] text-slate-400 font-medium">Choose how you'd like to pay</p>
                  </div>
                </div>

                <div className="p-6 space-y-2.5">

                  {/* ── Active payment cards ─────────────────────────────── */}
                  {ACTIVE_OPTIONS.filter(o => o.show).map(option => {
                    const selected = paymentMethod === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        className={cn(
                          "w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200 text-left group",
                          selected
                            ? "border-primary bg-primary/[0.03] shadow-sm"
                            : "border-slate-100 hover:border-slate-100 hover:bg-slate-50/80"
                        )}
                      >
                        {/* Radio dot — LEFT */}
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                          selected ? "border-primary bg-primary" : "border-slate-300 group-hover:border-slate-400"
                        )}>
                          {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>

                        {/* Label — MIDDLE */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-black text-sm transition-colors",
                            selected ? "text-slate-900" : "text-slate-700"
                          )}>
                            {option.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{option.desc}</p>
                        </div>

                        {/* Brand logos — RIGHT */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {option.logos}
                        </div>
                      </button>
                    );
                  })}

                  {/* ── Expanded detail for selected method ──────────────── */}
                  {paymentMethod === "card" && (
                    <div className="mx-1 bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <Lock size={18} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-xs uppercase tracking-wider">Secure Card Payment</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Your card details are encrypted and never stored</p>
                      </div>
                      <div className="ml-auto flex-shrink-0">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">SSL</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="mx-1 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500 flex-shrink-0">
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="font-black text-amber-900 text-xs uppercase tracking-wider">Pay on Delivery</p>
                        <p className="text-xs text-amber-700 font-medium mt-0.5">
                          Have <span className="font-black">{currency} {total.toFixed(2)}</span> ready when your order arrives
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="mx-1 space-y-3">
                      {!isFormValid ? (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
                          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-700 font-medium">
                            Complete your shipping information above to unlock PayPal checkout.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                          <PayPalButtons
                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 44 }}
                            disabled={!isFormValid}
                            createOrder={(_d, actions) =>
                              actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [{
                                  description: "WIVITEC Purchase",
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
                            onApprove={async (_d, actions) => {
                              await actions.order!.capture();
                              const newOrderId = placeOrder();
                              if (newOrderId) {
                                updatePaymentStatus(newOrderId, "paid");
                                setPaidVia("paypal");
                                setOrderId(newOrderId);
                                showSuccess("Payment successful! Your order is confirmed.");
                              }
                            }}
                            onError={() => showError("PayPal payment failed. Please try again.")}
                            onCancel={() => showError("Payment cancelled.")}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Divider ───────────────────────────────────────────── */}
                  <div className="flex items-center gap-3 pt-2 pb-1 px-1">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                      <Clock size={9} /> Coming Soon
                    </span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  {/* ── Coming soon cards ─────────────────────────────────── */}
                  {COMING_SOON_OPTIONS.map(option => (
                    <div
                      key={option.id}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 cursor-not-allowed select-none"
                    >
                      {/* Disabled radio dot */}
                      <div className="w-5 h-5 rounded-full border-2 border-slate-100 flex-shrink-0" />

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm text-slate-400">{option.name}</p>
                        <p className="text-[11px] text-slate-300 font-medium mt-0.5 truncate">{option.desc}</p>
                      </div>

                      {/* Logo + Badge — RIGHT */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="opacity-40">
                          {option.logo}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest bg-slate-200 text-slate-400 px-2.5 py-1 rounded-full whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Terms */}
                  <p className="text-[10px] text-slate-400 text-center font-medium pt-3 px-2">
                    By placing your order you agree to our{" "}
                    <Link to="/terms" className="underline hover:text-slate-600 font-bold">Terms</Link>
                    {" "}&{" "}
                    <Link to="/privacy-policy" className="underline hover:text-slate-600 font-bold">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right column: Order Summary ──────────────────────────── */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  {/* Header */}
                  <div className="px-7 pt-7 pb-5 border-b border-slate-50">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-5">Order Summary</h2>
                    <div className="space-y-1">
                      {enrichedCart.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 py-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 p-1 flex-shrink-0">
                            <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-bold text-slate-800 text-xs line-clamp-1 uppercase tracking-tight">{item.product.title}</p>
                            <p className="text-[10px] text-slate-400 font-black mt-0.5">Qty {item.quantity}</p>
                          </div>
                          <p className="font-black text-slate-900 text-sm flex-shrink-0">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discount Code */}
                  <div className="px-7 py-5 border-b border-slate-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Discount Code</p>
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                        <div>
                          <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">{appliedDiscount.code}</span>
                          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">− {currency} {appliedDiscount.amount.toFixed(2)} saved</p>
                        </div>
                        <button onClick={() => { setAppliedDiscount(null); setDiscountCode(""); }} className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest">Remove</button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code (e.g. SAVE10)"
                            className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold uppercase"
                            value={discountCode}
                            onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(""); }}
                            onKeyDown={e => e.key === "Enter" && handleApplyDiscount()}
                          />
                          <Button type="button" variant="outline" className="h-10 px-4 rounded-xl font-black text-xs uppercase tracking-widest flex-shrink-0" onClick={handleApplyDiscount}>
                            Apply
                          </Button>
                        </div>
                        {discountError && <p className="text-[10px] text-rose-500 font-bold">{discountError}</p>}
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="px-7 py-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Subtotal</span>
                      <span className="font-black text-slate-700 text-sm">{currency} {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Shipping</span>
                      <span className={cn("font-black text-sm", shipping === 0 ? "text-emerald-600" : "text-slate-700")}>
                        {shipping === 0 ? "FREE" : `${currency} ${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Tax ({Math.round((settings.taxRate || 0.07) * 100)}%)
                      </span>
                      <span className="font-black text-slate-700 text-sm">{currency} {tax.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Discount</span>
                        <span className="font-black text-emerald-600 text-sm">− {currency} {discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="h-px bg-slate-100 my-2" />

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-base font-black uppercase tracking-tight text-slate-900">Total</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        {currency} {total.toFixed(2)}
                      </span>
                    </div>

                    {/* CTA — hidden for PayPal (uses PayPal buttons) */}
                    {paymentMethod !== "paypal" && (
                      <Button
                        form="checkout-form"
                        type="submit"
                        className="w-full h-13 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 mt-3 h-12"
                        disabled={isPlacing}
                      >
                        {isPlacing
                          ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                          : <>Place Order <Zap size={16} /></>
                        }
                      </Button>
                    )}

                    {paymentMethod === "paypal" && !isFormValid && (
                      <div className="mt-3 text-center text-[11px] text-slate-400 font-medium bg-slate-50 rounded-2xl p-3">
                        Fill in shipping info to unlock PayPal
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <ShieldCheck size={18} />, label: "Secure", color: "text-emerald-500" },
                    { icon: <Lock size={18} />, label: "Encrypted", color: "text-blue-500" },
                    { icon: <RotateCcw size={18} />, label: "Returns", color: "text-violet-500" },
                  ].map(({ icon, label, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 py-4 flex flex-col items-center gap-1.5 shadow-sm">
                      <div className={color}>{icon}</div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</span>
                    </div>
                  ))}
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