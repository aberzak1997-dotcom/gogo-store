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
  Info, Clock, Banknote, Copy, QrCode
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

type PayMethod = "cod" | "card" | "paypal" | "bank";

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

  // ── Payment config — derived directly from StoreContext (loaded from Supabase) ──
  // settings.paymentConfig is set on all devices when Supabase is configured.
  const paymentCfg = settings.paymentConfig;
  const isPayPalReady = Boolean(paymentCfg?.paypalEnabled && paymentCfg?.paypalClientId);
  const bankCfg = useMemo(() => ({
    bankEnabled:      Boolean(paymentCfg?.bankEnabled),
    bankName:         paymentCfg?.bankName         || "",
    bankHolder:       paymentCfg?.bankHolder       || "",
    bankRib:          paymentCfg?.bankRib          || "",
    bankIban:         paymentCfg?.bankIban         || "",
    bankSwift:        paymentCfg?.bankSwift        || "",
    bankInstructions: paymentCfg?.bankInstructions || "",
    bankQrUrl:        paymentCfg?.bankQrUrl        || "",
  }), [paymentCfg]);

  // ── Dynamic payment options (auto-updates when settings load from Supabase) ──
  const ACTIVE_OPTIONS = useMemo(() => [
    {
      id: "cod" as PayMethod,
      name: "Cash on Delivery",
      desc: "Pay in cash when your package arrives",
      show: true,
      logos: (
        <div className="w-[46px] h-[30px] bg-amber-50 rounded-[4px] border border-amber-100 flex items-center justify-center">
          <Banknote size={18} className="text-amber-500" />
        </div>
      ),
    },
    {
      id: "paypal" as PayMethod,
      name: "PayPal",
      desc: "Fast & secure checkout with PayPal",
      show: isPayPalReady,
      logos: <PayPalLogo />,
    },
    {
      id: "bank" as PayMethod,
      name: "Bank Transfer",
      desc: bankCfg.bankName ? `Transfer to ${bankCfg.bankName}` : "Direct bank transfer",
      show: bankCfg.bankEnabled && Boolean(bankCfg.bankName),
      logos: (
        <div className="w-[46px] h-[30px] bg-[#EEF4FF] rounded-[4px] border border-[#C7D9F8] flex items-center justify-center">
          <Banknote size={18} className="text-[#1160CB]" />
        </div>
      ),
    },
  ], [isPayPalReady, bankCfg]);

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
          <div className="max-w-md w-full text-center bg-white p-16" style={{ borderRadius: 12, border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}>
            <div className="w-20 h-20 rounded-[12px] flex items-center justify-center mx-auto mb-8" style={{ background: "#F0F2F8" }}>
              <AlertTriangle className="h-10 w-10" style={{ color: "#0C0D10", opacity: 0.2 }} />
            </div>
            <h2 className="text-[22px] font-bold mb-3 text-[#0C0D10]">Cart is Empty</h2>
            <p className="mb-8 text-[14px]" style={{ color: "#0C0D10", opacity: 0.5 }}>Add products to your cart before checking out.</p>
            <Button className="rounded-[8px] h-11 px-8 text-[14px] font-semibold bg-[#1160CB] hover:bg-[#479BF7] text-white" onClick={() => navigate("/")}>
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
    showSuccess(`Discount "${found.code}" applied! You save ${currency} ${amount.toFixed(2)}`);
  };

  const placeOrder = (): string | null =>
    createOrder({ customerName: fullName, email, phone, address, city, country });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) { showError("Please fill in all shipping fields."); return; }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { showError("Please enter a valid email address."); return; }

    // Validate quantity sanity (no product qty > 100)
    const hasInvalidQty = enrichedCart.some(i => i.quantity < 1 || i.quantity > 100);
    if (hasInvalidQty) { showError("Invalid product quantity detected."); return; }

    // Prevent double-submit
    if (isPlacing) return;

    setIsPlacing(true);
    await new Promise(res => setTimeout(res, 1200));
    const newOrderId = placeOrder();
    if (newOrderId) { setPaidVia(paymentMethod); setOrderId(newOrderId); }
    setIsPlacing(false);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (orderId) {
    const methodLabel = paidVia === "paypal" ? "PayPal"
      : paidVia === "cod" ? "Cash on Delivery"
      : paidVia === "bank" ? "Bank Transfer"
      : "Credit / Debit Card";
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F2F8]">
        <Header />
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="max-w-lg w-full bg-white overflow-hidden" style={{ borderRadius: 12, border: "1px solid #F0F2F8", boxShadow: "0 4px 24px rgba(21,40,161,0.08)" }}>
            <div className="p-14 text-center" style={{ background: "#0E121A" }}>
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(5,177,105,0.15)", borderRadius: "50%" }}>
                <CheckCircle className="h-9 w-9" style={{ color: "#05b169" }} />
              </div>
              <h2 className="text-[28px] font-bold text-white mb-2 tracking-tight">Order Confirmed!</h2>
              <p className="text-caption" style={{ color: "#479BF7" }}>Thank you for your purchase</p>
            </div>
            <div className="p-10 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[10px]" style={{ background: "#F0F2F8" }}>
                  <p className="text-caption text-[#1160CB] mb-1.5">Order #</p>
                  <p className="font-semibold text-[#0C0D10] text-[14px]">{orderId}</p>
                </div>
                <div className="p-5 rounded-[10px]" style={{ background: "#F0F2F8" }}>
                  <p className="text-caption text-[#1160CB] mb-1.5">Total</p>
                  <p className="font-semibold text-[#0C0D10] text-[14px]">{currency} {total.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-5 rounded-[10px] flex items-center gap-4" style={{ background: "#F0F2F8" }}>
                <div className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ border: "1px solid #F0F2F8" }}>
                  <Truck size={18} style={{ color: "#1160CB" }} />
                </div>
                <div>
                  <p className="text-caption text-[#1160CB]">Estimated Delivery</p>
                  <p className="text-[14px] text-[#0C0D10]/70 font-medium mt-0.5">3–5 Business Days</p>
                </div>
              </div>
              <div className="p-5 rounded-[10px] flex items-center gap-4" style={{ background: "#F0F2F8" }}>
                <div className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ border: "1px solid #F0F2F8" }}>
                  <CreditCard size={18} style={{ color: "#1160CB" }} />
                </div>
                <div>
                  <p className="text-caption text-[#1160CB]">Payment</p>
                  <p className="text-[14px] text-[#0C0D10]/70 font-medium mt-0.5">{methodLabel}</p>
                </div>
              </div>

              {/* Bank transfer reminder on success screen */}
              {paidVia === "bank" && bankCfg.bankName && (
                <div className="rounded-[10px] p-5 space-y-2" style={{ background: "rgba(17,96,203,0.04)", border: "1px solid rgba(17,96,203,0.14)" }}>
                  <p className="text-caption text-[#1160CB] mb-2">Complete your payment</p>
                  <div className="space-y-0">
                    {bankCfg.bankName && (
                      <div className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(17,96,203,0.08)" }}>
                        <span className="text-[12px] text-[#0C0D10]/50">Bank</span>
                        <span className="text-[12px] font-semibold text-[#0C0D10]">{bankCfg.bankName}</span>
                      </div>
                    )}
                    {bankCfg.bankHolder && (
                      <div className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(17,96,203,0.08)" }}>
                        <span className="text-[12px] text-[#0C0D10]/50">Holder</span>
                        <span className="text-[12px] font-semibold text-[#0C0D10]">{bankCfg.bankHolder}</span>
                      </div>
                    )}
                    {bankCfg.bankRib && (
                      <div className="flex justify-between items-center py-2" style={{ borderBottom: bankCfg.bankIban ? "1px solid rgba(17,96,203,0.08)" : "none" }}>
                        <span className="text-[12px] text-[#0C0D10]/50">RIB</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-mono font-bold text-[#0C0D10]">{bankCfg.bankRib}</span>
                          <button type="button" onClick={() => { navigator.clipboard.writeText(bankCfg.bankRib); showSuccess("RIB copied!"); }} style={{ color: "#1160CB" }} title="Copy"><Copy size={11} /></button>
                        </div>
                      </div>
                    )}
                    {bankCfg.bankIban && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[12px] text-[#0C0D10]/50">IBAN</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-mono font-bold text-[#0C0D10]">{bankCfg.bankIban}</span>
                          <button type="button" onClick={() => { navigator.clipboard.writeText(bankCfg.bankIban); showSuccess("IBAN copied!"); }} style={{ color: "#1160CB" }} title="Copy"><Copy size={11} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                  {bankCfg.bankInstructions && (
                    <p className="text-[11px] text-[#0C0D10]/50 leading-relaxed pt-2" style={{ borderTop: "1px solid rgba(17,96,203,0.08)" }}>{bankCfg.bankInstructions}</p>
                  )}
                </div>
              )}

              <p className="text-center text-[13px] text-[#0C0D10]/40">
                Confirmation sent to <span className="font-semibold text-[#0C0D10]/70">{email}</span>
              </p>
              <Button className="w-full h-12 rounded-[8px] font-semibold text-[14px] bg-[#1160CB] hover:bg-[#479BF7] text-white" onClick={() => navigate("/")}>
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
    <div className="min-h-screen flex flex-col bg-[#F0F2F8]">
      <Header />
      <main className="flex-grow py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-caption text-[#0C0D10]/40 hover:text-[#1160CB] transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
            </Link>
            <div className="text-center">
              <h1 className="text-[24px] font-bold text-[#0C0D10] tracking-tight">Checkout</h1>
              <p className="text-caption text-[#0C0D10]/40 mt-0.5">{enrichedCart.length} item{enrichedCart.length !== 1 ? "s" : ""} in your cart</p>
            </div>
            <div className="flex items-center gap-1.5 text-caption px-3 py-1.5 rounded-[6px]" style={{ background: "rgba(5,177,105,0.1)", color: "#05b169" }}>
              <ShieldCheck size={12} /> Secure
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">

            {/* ── Left column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-5">

              {/* Shipping */}
              <div className="bg-white overflow-hidden" style={{ borderRadius: 12, border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}>
                <div className="px-8 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid #F0F2F8" }}>
                  <div className="w-9 h-9 rounded-[8px] flex items-center justify-center" style={{ background: "rgba(17,96,203,0.08)" }}>
                    <Truck size={17} style={{ color: "#1160CB" }} />
                  </div>
                  <div>
                    <p className="text-caption text-[#1160CB]">Shipping Info</p>
                    <p className="text-[12px] text-[#0C0D10]/40 mt-0.5">Where should we deliver?</p>
                  </div>
                </div>
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="text-caption text-[#1160CB]">Full Name *</Label>
                      <Input
                        className="h-11 rounded-[8px] text-[14px] font-medium focus-visible:ring-[#1160CB]/30 transition-colors"
                        style={{ border: "1.5px solid #F0F2F8" }}
                        value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder="John Doe" required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-caption text-[#1160CB]">Email *</Label>
                      <Input
                        type="email"
                        className="h-11 rounded-[8px] text-[14px] font-medium focus-visible:ring-[#1160CB]/30 transition-colors"
                        style={{ border: "1.5px solid #F0F2F8" }}
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="john@example.com" required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-caption text-[#1160CB]">Phone *</Label>
                      <Input
                        className="h-11 rounded-[8px] text-[14px] font-medium focus-visible:ring-[#1160CB]/30 transition-colors"
                        style={{ border: "1.5px solid #F0F2F8" }}
                        value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000" required
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="text-caption text-[#1160CB]">Street Address *</Label>
                      <Input
                        className="h-11 rounded-[8px] text-[14px] font-medium focus-visible:ring-[#1160CB]/30 transition-colors"
                        style={{ border: "1.5px solid #F0F2F8" }}
                        value={address} onChange={e => setAddress(e.target.value)}
                        placeholder="123 Tech Lane, Apt 4B" required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-caption text-[#1160CB]">City *</Label>
                      <Input
                        className="h-11 rounded-[8px] text-[14px] font-medium focus-visible:ring-[#1160CB]/30 transition-colors"
                        style={{ border: "1.5px solid #F0F2F8" }}
                        value={city} onChange={e => setCity(e.target.value)}
                        placeholder="San Francisco" required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-caption text-[#1160CB]">Country *</Label>
                      <Input
                        className="h-11 rounded-[8px] text-[14px] font-medium focus-visible:ring-[#1160CB]/30 transition-colors"
                        style={{ border: "1.5px solid #F0F2F8" }}
                        value={country} onChange={e => setCountry(e.target.value)}
                        placeholder="United States" required
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment */}
              <div className="bg-white overflow-hidden" style={{ borderRadius: 12, border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}>
                <div className="px-8 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid #F0F2F8" }}>
                  <div className="w-9 h-9 rounded-[8px] flex items-center justify-center" style={{ background: "rgba(17,96,203,0.08)" }}>
                    <CreditCard size={17} style={{ color: "#1160CB" }} />
                  </div>
                  <div>
                    <p className="text-caption text-[#1160CB]">Payment Method</p>
                    <p className="text-[12px] text-[#0C0D10]/40 mt-0.5">Choose how you'd like to pay</p>
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
                        className="w-full flex items-center gap-4 px-5 py-4 text-left group transition-all duration-150"
                        style={{
                          borderRadius: 10,
                          border: selected ? "1.5px solid #1160CB" : "1.5px solid #F0F2F8",
                          background: selected ? "rgba(17,96,203,0.03)" : "white",
                        }}
                      >
                        {/* Radio dot — LEFT */}
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150"
                          style={{
                            border: selected ? "2px solid #1160CB" : "2px solid #D0D4E0",
                            background: selected ? "#1160CB" : "white",
                          }}
                        >
                          {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>

                        {/* Label — MIDDLE */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-[#0C0D10]">{option.name}</p>
                          <p className="text-[12px] text-[#0C0D10]/40 mt-0.5 truncate">{option.desc}</p>
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

                  {/* ── Bank Transfer Details ─────────────────────────────── */}
                  {paymentMethod === "bank" && (
                    <div className="mx-1 space-y-3">
                      {/* Bank account info */}
                      <div className="rounded-[12px] p-5 space-y-3" style={{ background: "rgba(17,96,203,0.04)", border: "1px solid rgba(17,96,203,0.14)" }}>
                        <p className="text-caption text-[#1160CB] mb-1">Bank Transfer Details</p>
                        <div className="space-y-0">
                          {bankCfg.bankName && (
                            <div className="flex justify-between items-center py-2.5" style={{ borderBottom: "1px solid rgba(17,96,203,0.08)" }}>
                              <span className="text-[12px] text-[#0C0D10]/50 font-medium">Bank</span>
                              <span className="text-[13px] font-semibold text-[#0C0D10]">{bankCfg.bankName}</span>
                            </div>
                          )}
                          {bankCfg.bankHolder && (
                            <div className="flex justify-between items-center py-2.5" style={{ borderBottom: "1px solid rgba(17,96,203,0.08)" }}>
                              <span className="text-[12px] text-[#0C0D10]/50 font-medium">Account Holder</span>
                              <span className="text-[13px] font-semibold text-[#0C0D10]">{bankCfg.bankHolder}</span>
                            </div>
                          )}
                          {bankCfg.bankRib && (
                            <div className="flex justify-between items-center py-2.5" style={{ borderBottom: bankCfg.bankIban || bankCfg.bankSwift ? "1px solid rgba(17,96,203,0.08)" : "none" }}>
                              <span className="text-[12px] text-[#0C0D10]/50 font-medium">RIB</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[12px] font-mono font-bold text-[#0C0D10]">{bankCfg.bankRib}</span>
                                <button
                                  type="button"
                                  onClick={() => { navigator.clipboard.writeText(bankCfg.bankRib); showSuccess("RIB copied!"); }}
                                  className="w-6 h-6 rounded-[5px] flex items-center justify-center transition-colors"
                                  style={{ color: "#1160CB" }}
                                  title="Copy RIB"
                                >
                                  <Copy size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                          {bankCfg.bankIban && (
                            <div className="flex justify-between items-center py-2.5" style={{ borderBottom: bankCfg.bankSwift ? "1px solid rgba(17,96,203,0.08)" : "none" }}>
                              <span className="text-[12px] text-[#0C0D10]/50 font-medium">IBAN</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[12px] font-mono font-bold text-[#0C0D10]">{bankCfg.bankIban}</span>
                                <button
                                  type="button"
                                  onClick={() => { navigator.clipboard.writeText(bankCfg.bankIban); showSuccess("IBAN copied!"); }}
                                  className="w-6 h-6 rounded-[5px] flex items-center justify-center transition-colors"
                                  style={{ color: "#1160CB" }}
                                  title="Copy IBAN"
                                >
                                  <Copy size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                          {bankCfg.bankSwift && (
                            <div className="flex justify-between items-center py-2.5">
                              <span className="text-[12px] text-[#0C0D10]/50 font-medium">SWIFT / BIC</span>
                              <span className="text-[12px] font-mono font-bold text-[#0C0D10]">{bankCfg.bankSwift}</span>
                            </div>
                          )}
                        </div>
                        {bankCfg.bankInstructions && (
                          <div className="pt-3 mt-1" style={{ borderTop: "1px solid rgba(17,96,203,0.10)" }}>
                            <p className="text-[12px] text-[#0C0D10]/60 leading-relaxed">{bankCfg.bankInstructions}</p>
                          </div>
                        )}
                      </div>

                      {/* QR code */}
                      {bankCfg.bankQrUrl && (
                        <div className="rounded-[12px] p-5 flex flex-col items-center gap-3 bg-white" style={{ border: "1px solid #F0F2F8" }}>
                          <div className="flex items-center gap-2">
                            <QrCode size={14} style={{ color: "#1160CB" }} />
                            <p className="text-caption text-[#1160CB]">Scan to Pay</p>
                          </div>
                          <img
                            src={bankCfg.bankQrUrl}
                            alt="Bank Payment QR Code"
                            className="w-44 h-44 object-contain rounded-[10px]"
                            style={{ border: "1px solid #F0F2F8" }}
                          />
                          <p className="text-[11px] text-[#0C0D10]/30 text-center leading-snug">
                            Open your mobile banking app and scan<br />this QR code to transfer the exact amount
                          </p>
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
                <div className="bg-white overflow-hidden" style={{ borderRadius: 12, border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}>
                  {/* Header */}
                  <div className="px-7 pt-6 pb-5" style={{ borderBottom: "1px solid #F0F2F8" }}>
                    <p className="text-caption text-[#1160CB] mb-5">Order Summary</p>
                    <div className="space-y-1">
                      {enrichedCart.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid #F0F2F8" }}>
                          <div className="w-11 h-11 rounded-[8px] p-1 flex-shrink-0" style={{ background: "#F0F2F8", border: "1px solid #F0F2F8" }}>
                            <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-medium text-[#0C0D10] text-[13px] line-clamp-1">{item.product.title}</p>
                            <p className="text-caption text-[#0C0D10]/30 mt-0.5">Qty {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-[#1528A1] text-[14px] flex-shrink-0">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discount Code */}
                  <div className="px-7 py-5" style={{ borderBottom: "1px solid #F0F2F8" }}>
                    <p className="text-caption text-[#1160CB] mb-3">Discount Code</p>
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between px-4 py-3 rounded-[8px]" style={{ background: "rgba(5,177,105,0.08)", border: "1px solid rgba(5,177,105,0.2)" }}>
                        <div>
                          <span className="text-caption" style={{ color: "#05b169" }}>{appliedDiscount.code}</span>
                          <p className="text-[12px] font-medium mt-0.5" style={{ color: "#05b169" }}>− {currency} {appliedDiscount.amount.toFixed(2)} saved</p>
                        </div>
                        <button onClick={() => { setAppliedDiscount(null); setDiscountCode(""); }} className="text-caption" style={{ color: "#cf202f" }}>Remove</button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code (e.g. SAVE10)"
                            className="h-10 rounded-[8px] text-[13px] font-medium uppercase focus-visible:ring-[#1160CB]/30"
                            style={{ border: "1.5px solid #F0F2F8" }}
                            value={discountCode}
                            onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(""); }}
                            onKeyDown={e => e.key === "Enter" && handleApplyDiscount()}
                          />
                          <Button type="button" className="h-10 px-4 rounded-[8px] text-[13px] font-semibold flex-shrink-0 bg-[#1160CB] hover:bg-[#479BF7] text-white" onClick={handleApplyDiscount}>
                            Apply
                          </Button>
                        </div>
                        {discountError && <p className="text-[12px] mt-1" style={{ color: "#cf202f" }}>{discountError}</p>}
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="px-7 py-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-caption text-[#0C0D10]/40">Subtotal</span>
                      <span className="font-medium text-[#0C0D10] text-[14px]">{currency} {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-caption text-[#0C0D10]/40">Shipping</span>
                      <span className="font-medium text-[14px]" style={{ color: shipping === 0 ? "#05b169" : "#0C0D10" }}>
                        {shipping === 0 ? "FREE" : `${currency} ${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-caption text-[#0C0D10]/40">
                        Tax ({Math.round((settings.taxRate || 0.07) * 100)}%)
                      </span>
                      <span className="font-medium text-[#0C0D10] text-[14px]">{currency} {tax.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between items-center">
                        <span className="text-caption" style={{ color: "#05b169" }}>Discount</span>
                        <span className="font-medium text-[14px]" style={{ color: "#05b169" }}>− {currency} {discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="h-px my-2" style={{ background: "#F0F2F8" }} />

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[16px] font-semibold text-[#0C0D10]">Total</span>
                      <span className="text-[24px] font-bold text-[#1528A1]">
                        {currency} {total.toFixed(2)}
                      </span>
                    </div>

                    {/* CTA — hidden for PayPal (uses PayPal buttons) */}
                    {paymentMethod !== "paypal" && (
                      <Button
                        form="checkout-form"
                        type="submit"
                        className="w-full h-12 rounded-[8px] font-semibold text-[15px] gap-2 mt-3 bg-[#1160CB] hover:bg-[#479BF7] text-white"
                        disabled={isPlacing}
                      >
                        {isPlacing
                          ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                          : <>Place Order <Zap size={16} /></>
                        }
                      </Button>
                    )}

                    {paymentMethod === "paypal" && !isFormValid && (
                      <div className="mt-3 text-center text-caption text-[#0C0D10]/30 p-3 rounded-[8px]" style={{ background: "#F0F2F8" }}>
                        Fill in shipping info to unlock PayPal
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <ShieldCheck size={18} />, label: "Secure", color: "#05b169" },
                    { icon: <Lock size={18} />, label: "Encrypted", color: "#1160CB" },
                    { icon: <RotateCcw size={18} />, label: "Returns", color: "#479BF7" },
                  ].map(({ icon, label, color }) => (
                    <div key={label} className="bg-white py-4 flex flex-col items-center gap-1.5" style={{ borderRadius: 10, border: "1px solid #F0F2F8" }}>
                      <div style={{ color }}>{icon}</div>
                      <span className="text-caption text-[#0C0D10]/30">{label}</span>
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