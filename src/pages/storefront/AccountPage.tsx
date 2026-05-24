"use client";

import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User, ShoppingBag, Heart, LogOut, Edit2, Save, X,
  Package, Truck, CheckCircle2, Clock, XCircle, RotateCcw,
  ChevronDown, ChevronUp, MapPin, CreditCard, ArrowRight,
  Star, ShoppingCart, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "../../types";
import { showSuccess } from "../../utils/toast";
import ProductCard from "../../components/storefront/ProductCard";

type Tab = "orders" | "wishlist" | "profile";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "Pending",    color: "bg-amber-50 text-amber-700 border-amber-200",    icon: <Clock size={12} /> },
  processing: { label: "Processing", color: "bg-blue-50 text-blue-700 border-blue-200",       icon: <Package size={12} /> },
  shipped:    { label: "Shipped",    color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: <Truck size={12} /> },
  delivered:  { label: "Delivered",  color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={12} /> },
  cancelled:  { label: "Cancelled",  color: "bg-rose-50 text-rose-700 border-rose-200",       icon: <XCircle size={12} /> },
  refunded:   { label: "Refunded",   color: "bg-slate-100 text-slate-600 border-slate-200",   icon: <RotateCcw size={12} /> },
};

const STEPS = ["Placed", "Processing", "Shipped", "Delivered"];
const STEP_NUM: Record<string, number> = { pending: 1, processing: 2, shipped: 3, delivered: 4 };

const MiniOrderCard = ({ order }: { order: Order }) => {
  const [open, setOpen] = useState(false);
  const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const step = STEP_NUM[order.status] || 0;
  const isTerminal = order.status === "cancelled" || order.status === "refunded";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-black text-slate-900 text-xs uppercase tracking-tight truncate">#{order.id}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Badge className={cn("text-[9px] font-black uppercase border rounded-full px-2 py-0.5 flex items-center gap-1 flex-shrink-0", st.color)}>
          {st.icon} {st.label}
        </Badge>
        <p className="font-black text-slate-900 text-sm flex-shrink-0">${order.totalAmount.toFixed(2)}</p>
        <button onClick={() => setOpen(!open)} className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 flex-shrink-0">
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Progress bar */}
      {!isTerminal && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 transition-all",
                  step > i ? "bg-[#0096D6] text-white" : "bg-slate-100 text-slate-400")}>
                  {step > i ? "✓" : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={cn("flex-1 h-0.5 mx-0.5", step > i + 1 ? "bg-[#0096D6]" : "bg-slate-100")} />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {STEPS.map(s => <p key={s} className="text-[8px] font-bold text-slate-400 uppercase tracking-wider flex-1 text-center">{s}</p>)}
          </div>
        </div>
      )}

      {/* Expanded */}
      {open && (
        <div className="border-t border-slate-50 p-5 space-y-4">
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium truncate max-w-[60%]">{item.title} <span className="text-slate-400">×{item.quantity}</span></span>
                <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Separator className="bg-slate-50" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5"><MapPin size={10} />{order.city}, {order.country}</span>
            <span className="text-slate-400 font-medium flex items-center gap-1.5"><CreditCard size={10} />{order.paymentMethod || "COD"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const AccountPage = () => {
  const { customer, customerLogout, updateCustomerName, wishlist, removeFromWishlist } = useCustomerAuth();
  const { orders, products } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(customer?.name || "");

  // Redirect if not logged in
  if (!customer) {
    navigate("/account/login");
    return null;
  }

  // Orders for this customer (matched by email)
  const myOrders = useMemo(() =>
    orders.filter(o => o.email?.toLowerCase() === customer.email.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [orders, customer.email]
  );

  // Wishlist products
  const wishlistProducts = useMemo(() =>
    products.filter(p => wishlist.includes(p.id) && p.status === "active"),
    [products, wishlist]
  );

  const handleLogout = async () => {
    await customerLogout();
    navigate("/");
  };

  const handleSaveName = () => {
    if (newName.trim()) {
      updateCustomerName(newName.trim());
      showSuccess("Name updated!");
    }
    setEditingName(false);
  };

  const initials = customer.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const totalSpent = myOrders.filter(o => o.paymentStatus === "paid" || o.status === "delivered").reduce((s, o) => s + o.totalAmount, 0);

  const TABS: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "orders",   label: "My Orders",  icon: <ShoppingBag size={16} />, count: myOrders.length },
    { id: "wishlist", label: "Wishlist",   icon: <Heart size={16} />,       count: wishlist.length },
    { id: "profile",  label: "Profile",    icon: <User size={16} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      <main className="flex-grow section-container py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* ── Profile Header ─────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl tracking-tighter flex-shrink-0 shadow-xl shadow-slate-900/20">
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <Input
                    className="h-9 rounded-xl border-slate-200 font-black text-lg w-48"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    autoFocus
                    onKeyDown={e => e.key === "Enter" && handleSaveName()}
                  />
                  <button onClick={handleSaveName} className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"><Save size={14} /></button>
                  <button onClick={() => setEditingName(false)} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"><X size={14} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-black text-2xl text-slate-900 tracking-tight">{customer.name}</h2>
                  <button onClick={() => { setEditingName(true); setNewName(customer.name); }} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
              <p className="text-slate-500 text-sm font-medium">{customer.email}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 flex-shrink-0">
              <div className="text-center">
                <p className="font-black text-2xl text-slate-900">{myOrders.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Orders</p>
              </div>
              <div className="h-10 w-px bg-slate-100" />
              <div className="text-center">
                <p className="font-black text-2xl text-slate-900">${totalSpent.toFixed(0)}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Spent</p>
              </div>
              <div className="h-10 w-px bg-slate-100" />
              <div className="text-center">
                <p className="font-black text-2xl text-slate-900">{wishlist.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wishlist</p>
              </div>
            </div>

            {/* Logout */}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl font-black text-xs uppercase tracking-widest gap-2 flex-shrink-0">
              <LogOut size={14} /> Sign Out
            </Button>
          </div>

          {/* ── Tabs ───────────────────────────────────────────────────── */}
          <div className="flex bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === t.id
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
                {t.count !== undefined && t.count > 0 && (
                  <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                    activeTab === t.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600")}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Orders Tab ─────────────────────────────────────────────── */}
          {activeTab === "orders" && (
            myOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                  <ShoppingBag size={28} className="text-slate-300" />
                </div>
                <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">No Orders Yet</h3>
                <p className="text-slate-500 text-sm font-medium">Your orders will appear here after you make a purchase.</p>
                <Link to="/products">
                  <Button className="rounded-full font-black uppercase tracking-widest text-xs gap-2 mt-2">
                    Start Shopping <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myOrders.map(order => <MiniOrderCard key={order.id} order={order} />)}
              </div>
            )
          )}

          {/* ── Wishlist Tab ───────────────────────────────────────────── */}
          {activeTab === "wishlist" && (
            wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                  <Heart size={28} className="text-slate-300" />
                </div>
                <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Wishlist is Empty</h3>
                <p className="text-slate-500 text-sm font-medium">Save products you love by clicking the heart icon.</p>
                <Link to="/products">
                  <Button className="rounded-full font-black uppercase tracking-widest text-xs gap-2 mt-2">
                    Browse Products <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlistProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )
          )}

          {/* ── Profile Tab ───────────────────────────────────────────── */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
              <h3 className="font-black text-lg uppercase tracking-tight text-slate-900">Account Details</h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                  <div className="flex gap-2">
                    <Input
                      className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-medium"
                      value={newName || customer.name}
                      onChange={e => setNewName(e.target.value)}
                    />
                    <Button
                      size="sm"
                      onClick={() => { if (newName.trim()) { updateCustomerName(newName.trim()); showSuccess("Name updated!"); } }}
                      className="h-11 px-4 rounded-2xl font-black text-xs uppercase tracking-widest flex-shrink-0"
                    >
                      <Save size={14} />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                  <Input className="h-11 rounded-2xl border-slate-200 bg-slate-100 font-medium cursor-not-allowed" value={customer.email} readOnly />
                  <p className="text-[10px] text-slate-400 font-medium">Email cannot be changed here.</p>
                </div>
              </div>

              <Separator className="bg-slate-50" />

              <div className="space-y-3">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Quick Links</h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: "Track My Order", icon: <Truck size={16} />, to: "/track-order" },
                    { label: "Returns & Refunds", icon: <RotateCcw size={16} />, to: "/returns" },
                    { label: "Contact Support", icon: <User size={16} />, to: "/contact" },
                  ].map(link => (
                    <Link key={link.to} to={link.to} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                      <div className="text-[#0096D6]">{link.icon}</div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{link.label}</span>
                      <ArrowRight size={12} className="ml-auto text-slate-400 group-hover:text-slate-700" />
                    </Link>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-50" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-sm text-slate-900">Sign Out</p>
                  <p className="text-xs text-slate-400 font-medium">You'll need to sign in again to view your orders.</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="rounded-2xl font-black text-xs uppercase tracking-widest gap-2 text-rose-600 border-rose-200 hover:bg-rose-50">
                  <LogOut size={14} /> Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
