"use client";

import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useStore } from "../../context/StoreContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search, Package, Truck, CheckCircle2, Clock,
  XCircle, RotateCcw, ShoppingBag, MapPin, Mail,
  CreditCard, ChevronDown, ChevronUp, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "../../types";
import { Link } from "react-router-dom";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
  pending:    { label: "Pending",    color: "bg-amber-50 text-amber-700 border-amber-200",   icon: <Clock size={14} />,       step: 1 },
  processing: { label: "Processing", color: "bg-blue-50 text-blue-700 border-blue-200",      icon: <Package size={14} />,     step: 2 },
  shipped:    { label: "Shipped",    color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: <Truck size={14} />,       step: 3 },
  delivered:  { label: "Delivered",  color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={14} />, step: 4 },
  cancelled:  { label: "Cancelled",  color: "bg-rose-50 text-rose-700 border-rose-200",      icon: <XCircle size={14} />,     step: 0 },
  refunded:   { label: "Refunded",   color: "bg-slate-100 text-slate-600 border-slate-200",  icon: <RotateCcw size={14} />,   step: 0 },
};

const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Order Header */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Order #{order.id}</p>
            <Badge className={cn("text-[10px] font-black uppercase tracking-wider border rounded-full px-3 py-0.5", status.color)}>
              {status.icon} <span className="ml-1">{status.label}</span>
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Placed on {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</p>
            <p className="font-black text-slate-900">${order.totalAmount.toFixed(2)}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Progress Tracker */}
      {order.status !== "cancelled" && order.status !== "refunded" && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-0">
            {STEPS.map((step, i) => {
              const reached = status.step > i;
              const current = status.step === i + 1;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
                      reached || current
                        ? "bg-[#1528A1] text-white shadow-lg shadow-[#1528A1]/20"
                        : "bg-slate-100 text-slate-400"
                    )}>
                      {reached && !current ? <CheckCircle2 size={14} /> : i + 1}
                    </div>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-wider text-center whitespace-nowrap",
                      reached || current ? "text-slate-700" : "text-slate-300"
                    )}>{step}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-1 mb-5 transition-all",
                      status.step > i + 1 ? "bg-[#1528A1]" : "bg-slate-100"
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-50 p-6 space-y-5">
          {/* Items */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Items Ordered</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag size={14} className="text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-xs truncate uppercase tracking-tight">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900 text-sm flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-50" />

          {/* Delivery & Payment */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <MapPin size={10} /> Delivery Address
              </p>
              <p className="text-xs font-bold text-slate-700">{order.address}</p>
              <p className="text-xs text-slate-500">{order.city}, {order.country}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <CreditCard size={10} /> Payment
              </p>
              <p className="text-xs font-bold text-slate-700 capitalize">{order.paymentMethod || "Cash on Delivery"}</p>
              <Badge className={cn(
                "text-[9px] font-black uppercase tracking-wider border rounded-full px-2 py-0 w-fit",
                order.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
              )}>
                {order.paymentStatus || "Pending"}
              </Badge>
            </div>
          </div>

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Order Timeline</p>
              <div className="space-y-3">
                {order.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#1528A1] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">{event.note}</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {new Date(event.date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OrderTrackingPage = () => {
  const { orders } = useStore();
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Order[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = email.trim().toLowerCase();
    if (!term) return;

    // Search by email or order ID
    const found = orders.filter(
      o => o.email?.toLowerCase() === term || o.id.toLowerCase().includes(term)
    );
    setResults(found);
    setSearched(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />

      <main className="flex-grow section-container py-16">
        <div className="max-w-3xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto">
              <Package size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Track Your Order</h1>
            <p className="text-slate-500 max-w-md mx-auto text-sm font-medium">
              Enter the email address you used at checkout, or your order ID, to see your order status.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  type="text"
                  placeholder="Email address or Order ID (e.g. ORD-123456)"
                  className="pl-11 h-13 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium h-12"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 flex-shrink-0">
                <Search size={15} /> Track
              </Button>
            </div>
          </form>

          {/* Results */}
          {searched && (
            results.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                  <Package size={28} className="text-slate-300" />
                </div>
                <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">No Orders Found</h3>
                <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">
                  We couldn't find any orders matching <span className="font-bold text-slate-700">"{email}"</span>.
                  Make sure you entered the correct email or order ID.
                </p>
                <div className="pt-4">
                  <Link to="/products">
                    <Button variant="outline" className="rounded-full font-black uppercase tracking-widest text-xs gap-2">
                      Start Shopping <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                  {results.length} order{results.length !== 1 ? "s" : ""} found
                </p>
                {results.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )
          )}

          {/* Help Box */}
          {!searched && (
            <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Truck size={22} className="text-[#1528A1]" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-lg uppercase tracking-tight mb-1">Need Help?</h4>
                <p className="text-slate-400 text-sm font-medium">
                  If you're having trouble finding your order, contact our support team and we'll look it up for you.
                </p>
              </div>
              <Link to="/contact" className="flex-shrink-0">
                <Button variant="secondary" className="rounded-full font-black uppercase tracking-widest text-xs gap-2">
                  Contact Support <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTrackingPage;