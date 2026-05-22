"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BarChart3,
  Eye,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const pctChange = (current: number, prev: number) =>
  prev === 0 ? 0 : Math.round(((current - prev) / prev) * 100);

const statusColors: Record<string, string> = {
  pending:    "bg-amber-50 text-amber-700 border-amber-100",
  processing: "bg-blue-50 text-blue-700 border-blue-100",
  shipped:    "bg-purple-50 text-purple-700 border-purple-100",
  delivered:  "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled:  "bg-rose-50 text-rose-700 border-rose-100",
  refunded:   "bg-slate-50 text-slate-600 border-slate-100",
};

interface KpiProps {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  iconColor: string;
  href?: string;
}

const KpiCard = ({ label, value, change, icon: Icon, iconColor, href }: KpiProps) => {
  const up = change >= 0;
  const inner = (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-md hover:border-slate-200 transition-all group cursor-pointer">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 font-medium">{label}</span>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconColor)}>
          <Icon size={17} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        <div className={cn("flex items-center gap-1 mt-1.5 text-xs font-semibold", up ? "text-emerald-600" : "text-rose-500")}>
          {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(change)}% vs last month
        </div>
      </div>
      {href && (
        <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-primary transition-colors font-medium mt-auto">
          View details <ChevronRight size={12} />
        </div>
      )}
    </div>
  );
  return href ? <Link to={href}>{inner}</Link> : inner;
};

const SparkBar = ({ data }: { data: number[] }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-14">
      {data.map((v, i) => (
        <div
          key={i}
          className={cn("flex-1 rounded-md transition-all", i === data.length - 1 ? "bg-primary" : "bg-primary/15")}
          style={{ height: `${Math.max((v / max) * 100, 6)}%` }}
        />
      ))}
    </div>
  );
};

const AdminDashboardPage = () => {
  const { products, orders, customers, returns, reviews } = useStore();

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthOrders = orders.filter(o => new Date(o.createdAt) >= thisMonthStart);
    const lastMonthOrders = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= lastMonthStart && d < thisMonthStart;
    });

    const revenue      = thisMonthOrders.reduce((s, o) => s + o.total, 0);
    const prevRevenue  = lastMonthOrders.reduce((s, o) => s + o.total, 0);
    const orderCount   = thisMonthOrders.length;
    const prevOrders   = lastMonthOrders.length;
    const activeProducts = products.filter(p => p.status === "active").length;
    const lowStock  = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5);
    const outOfStock = products.filter(p => p.stockQuantity === 0);
    const pendingOrders  = orders.filter(o => o.status === "pending");
    const pendingReturns = returns.filter(r => r.status === "pending");
    const pendingReviews = reviews.filter(r => r.status === "pending");
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
    const topProducts = [...products]
      .filter(p => p.status === "active")
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5);
    const spark = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toDateString();
      return orders.filter(o => new Date(o.createdAt).toDateString() === dayStr).reduce((s, o) => s + o.total, 0);
    });

    return {
      revenue, prevRevenue, orderCount, prevOrders,
      customerCount: customers.length, activeProducts,
      lowStock, outOfStock, pendingOrders, pendingReturns, pendingReviews,
      recentOrders, topProducts, spark,
    };
  }, [orders, products, customers, returns, reviews]);

  const kpis: KpiProps[] = [
    { label: "Revenue (this month)", value: fmt(stats.revenue),           change: pctChange(stats.revenue, stats.prevRevenue), icon: DollarSign, iconColor: "bg-emerald-50 text-emerald-600", href: "/admin/analytics" },
    { label: "Orders",               value: String(stats.orderCount),     change: pctChange(stats.orderCount, stats.prevOrders), icon: ShoppingBag, iconColor: "bg-blue-50 text-blue-600",   href: "/admin/orders" },
    { label: "Customers",            value: String(stats.customerCount),  change: 8,                                             icon: Users,      iconColor: "bg-purple-50 text-purple-600", href: "/admin/customers" },
    { label: "Active Products",      value: String(stats.activeProducts), change: 0,                                             icon: Package,    iconColor: "bg-amber-50 text-amber-600",   href: "/admin/products" },
  ];

  const hasAlerts = stats.pendingOrders.length > 0 || stats.outOfStock.length > 0 || stats.pendingReturns.length > 0 || stats.pendingReviews.length > 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products">
            <Button size="sm" variant="outline" className="gap-1.5 h-9 text-xs rounded-lg">
              <Package size={13} /> Add Product
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button size="sm" className="gap-1.5 h-9 text-xs rounded-lg">
              <Eye size={13} /> View Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* Alert pills */}
      {hasAlerts && (
        <div className="flex flex-wrap gap-2">
          {stats.pendingOrders.length > 0 && (
            <Link to="/admin/orders" className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors">
              <Clock size={13} /> {stats.pendingOrders.length} pending order{stats.pendingOrders.length > 1 ? "s" : ""} <ArrowRight size={11} />
            </Link>
          )}
          {stats.outOfStock.length > 0 && (
            <Link to="/admin/inventory" className="flex items-center gap-2 px-3.5 py-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold hover:bg-rose-100 transition-colors">
              <AlertTriangle size={13} /> {stats.outOfStock.length} out of stock <ArrowRight size={11} />
            </Link>
          )}
          {stats.pendingReturns.length > 0 && (
            <Link to="/admin/returns" className="flex items-center gap-2 px-3.5 py-2 bg-purple-50 border border-purple-100 rounded-xl text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors">
              <RotateCcw size={13} /> {stats.pendingReturns.length} return{stats.pendingReturns.length > 1 ? "s" : ""} pending <ArrowRight size={11} />
            </Link>
          )}
          {stats.pendingReviews.length > 0 && (
            <Link to="/admin/reviews" className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
              <Star size={13} /> {stats.pendingReviews.length} review{stats.pendingReviews.length > 1 ? "s" : ""} to moderate <ArrowRight size={11} />
            </Link>
          )}
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Revenue + quick stats */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-slate-900">Revenue — last 7 days</p>
              <p className="text-xs text-slate-400 mt-0.5">Daily totals</p>
            </div>
            <Link to="/admin/analytics">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-8 text-slate-500 hover:text-slate-800">
                <BarChart3 size={13} /> Full report
              </Button>
            </Link>
          </div>
          <SparkBar data={stats.spark} />
          <div className="flex justify-between mt-3">
            {["6d ago", "5d", "4d", "3d", "2d", "1d", "Today"].map((l) => (
              <span key={l} className="text-[10px] text-slate-300 font-medium">{l}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-3.5">
          <p className="text-sm font-semibold text-slate-900">Store health</p>
          {[
            { label: "Low stock items",  value: stats.lowStock.length,       color: "text-amber-600", href: "/admin/inventory" },
            { label: "Out of stock",     value: stats.outOfStock.length,     color: "text-rose-500",  href: "/admin/inventory" },
            { label: "Pending returns",  value: stats.pendingReturns.length, color: "text-purple-600",href: "/admin/returns" },
            { label: "Reviews to approve",value:stats.pendingReviews.length, color: "text-blue-600",  href: "/admin/reviews" },
            { label: "Total orders",     value: orders.length,               color: "text-slate-700", href: "/admin/orders" },
          ].map((item) => (
            <Link key={item.label} to={item.href} className="flex items-center justify-between group py-1 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500 group-hover:text-slate-800 transition-colors">{item.label}</span>
              <span className={cn("text-sm font-bold tabular-nums", item.color)}>{item.value}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders + top products */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <p className="text-sm font-semibold text-slate-900">Recent Orders</p>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 text-slate-400 hover:text-slate-700">
                All orders <ChevronRight size={12} />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentOrders.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">No orders yet.</div>
            ) : stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={13} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{order.customerName}</p>
                  <p className="text-xs text-slate-400 truncate">{order.id} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <p className="text-sm font-bold text-slate-900">{fmt(order.total)}</p>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize inline-block", statusColors[order.status] || statusColors.pending)}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <p className="text-sm font-semibold text-slate-900">Top Products</p>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 text-slate-400 hover:text-slate-700">
                All <ChevronRight size={12} />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.topProducts.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">No products yet.</div>
            ) : stats.topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-xs font-bold text-slate-300 w-4 flex-shrink-0">{i + 1}</span>
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 p-1 flex-shrink-0">
                  <img src={product.imageUrl} alt="" className="w-full h-full object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{product.title}</p>
                  <p className="text-[10px] text-slate-400">{product.brand} · {product.stockQuantity} left</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-slate-900">${product.price.toFixed(0)}</p>
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star size={9} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] text-slate-400">{product.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory alerts */}
      {(stats.lowStock.length > 0 || stats.outOfStock.length > 0) && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              <p className="text-sm font-semibold text-slate-900">Inventory Alerts</p>
            </div>
            <Link to="/admin/inventory">
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 text-slate-400 hover:text-slate-700">
                Manage <ChevronRight size={12} />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-50">
            <div className="p-6">
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <XCircle size={11} /> Out of stock ({stats.outOfStock.length})
              </p>
              <div className="space-y-3">
                {stats.outOfStock.slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                      <Package size={12} className="text-rose-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{p.title}</p>
                      <p className="text-[10px] text-slate-400">{p.sku}</p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full flex-shrink-0">0 left</span>
                  </div>
                ))}
                {stats.outOfStock.length === 0 && <p className="text-sm text-slate-400">All good ✓</p>}
              </div>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <AlertTriangle size={11} /> Low stock ({stats.lowStock.length})
              </p>
              <div className="space-y-3">
                {stats.lowStock.slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Package size={12} className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{p.title}</p>
                      <p className="text-[10px] text-slate-400">{p.sku}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">{p.stockQuantity} left</span>
                  </div>
                ))}
                {stats.lowStock.length === 0 && <p className="text-sm text-slate-400">All good ✓</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick nav */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: "Products",  icon: Package,       href: "/admin/products",  color: "bg-amber-50 text-amber-600" },
          { label: "Orders",    icon: ShoppingBag,   href: "/admin/orders",    color: "bg-blue-50 text-blue-600" },
          { label: "Customers", icon: Users,          href: "/admin/customers", color: "bg-purple-50 text-purple-600" },
          { label: "Inventory", icon: AlertTriangle,  href: "/admin/inventory", color: "bg-rose-50 text-rose-500" },
          { label: "Returns",   icon: RotateCcw,     href: "/admin/returns",   color: "bg-orange-50 text-orange-500" },
          { label: "Analytics", icon: BarChart3,     href: "/admin/analytics", color: "bg-emerald-50 text-emerald-600" },
        ].map((item) => (
          <Link key={item.label} to={item.href}
            className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all group text-center"
          >
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", item.color)}>
              <item.icon size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">{item.label}</span>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboardPage;
