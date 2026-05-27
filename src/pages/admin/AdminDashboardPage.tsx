"use client";

import React, { useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag, AlertTriangle, DollarSign, TrendingUp,
  CheckCircle2, ArrowUpRight, ArrowDownRight, RotateCcw, Package,
  ArrowRight, Plus, Users, Star, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  delivered: { bg: "rgba(5,177,105,0.1)", color: "#05b169" },
  cancelled:  { bg: "rgba(207,32,47,0.1)",  color: "#cf202f" },
  processing: { bg: "rgba(17,96,203,0.1)",  color: "#1160CB" },
  shipped:    { bg: "rgba(71,155,247,0.1)", color: "#479BF7" },
  pending:    { bg: "rgba(234,179,8,0.1)",  color: "#ca8a04" },
  refunded:   { bg: "rgba(100,116,139,0.1)", color: "#64748b" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS_COLORS[status] ?? { bg: "rgba(100,116,139,0.1)", color: "#64748b" };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-[10px] font-semibold uppercase tracking-[2px]"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
};

const AdminDashboardPage = () => {
  const { products, orders, returns, customers, reviews } = useStore();

  const paidOrders = orders.filter(o =>
    (o.paymentStatus === "paid" || o.status === "delivered" || o.status === "shipped") &&
    o.status !== "cancelled"
  );
  const grossRevenue = paidOrders.reduce((s, o) => s + o.totalAmount, 0);
  const totalRefunds = returns.filter(r => r.status === "refunded").reduce((s, r) => s + r.refundAmount, 0);
  const netRevenue = grossRevenue - totalRefunds;
  const avgOrderValue = paidOrders.length > 0 ? grossRevenue / paidOrders.length : 0;

  const activeProducts = products.filter(p => p.status === "active").length;
  const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5);
  const outOfStock = products.filter(p => p.stockQuantity === 0);
  const pendingReturns = returns.filter(r => r.status === "requested").length;
  const pendingReviews = reviews.filter(r => r.status === "pending").length;

  const revenueChartData = useMemo(() => {
    const days = 7;
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayOrders = paidOrders.filter(o => {
        const oDate = new Date(o.date);
        return oDate.toDateString() === date.toDateString();
      });
      result.push({
        day: dayStr,
        revenue: Math.round(dayOrders.reduce((s, o) => s + o.totalAmount, 0) * 100) / 100,
      });
    }
    return result;
  }, [paidOrders]);

  const topProducts = useMemo(() =>
    [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4),
    [products]
  );

  const recentActivity = useMemo(() => {
    const events: { icon: React.ReactNode; text: string; time: string; bg: string; color: string }[] = [];
    orders.slice(0, 3).forEach(o => events.push({
      icon: <ShoppingBag size={14} />,
      text: `New order ${o.id} from ${o.customerName}`,
      time: new Date(o.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      bg: "rgba(17,96,203,0.08)", color: "#1160CB",
    }));
    returns.filter(r => r.status === "requested").slice(0, 2).forEach(r => events.push({
      icon: <RotateCcw size={14} />,
      text: `Return request from ${r.customerName}`,
      time: new Date(r.requestedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      bg: "rgba(207,32,47,0.08)", color: "#cf202f",
    }));
    reviews.filter(r => r.status === "pending").slice(0, 2).forEach(r => events.push({
      icon: <Star size={14} />,
      text: `New review on ${r.productTitle}`,
      time: new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      bg: "rgba(234,179,8,0.08)", color: "#ca8a04",
    }));
    return events.slice(0, 6);
  }, [orders, returns, reviews]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const kpis = [
    {
      title: "Net Revenue",
      value: `$${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: `AOV $${avgOrderValue.toFixed(2)}`,
      icon: DollarSign,
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: orders.length,
      sub: `${paidOrders.length} paid`,
      icon: ShoppingBag,
      trendUp: true,
    },
    {
      title: "Customers",
      value: customers.length,
      sub: `${customers.filter(c => c.status === "VIP").length} VIP`,
      icon: Users,
      trendUp: true,
    },
    {
      title: "Pending Returns",
      value: pendingReturns,
      sub: pendingReturns === 0 ? "All clear" : "Needs review",
      icon: RotateCcw,
      trendUp: pendingReturns === 0,
    },
  ];

  const chartConfig = { revenue: { label: "Revenue", color: "#1160CB" } };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-caption text-[#1160CB] mb-1">{dateStr}</p>
          <h1 className="text-[28px] font-bold text-[#0C0D10] tracking-tight">{greeting}, Admin</h1>
          <p className="text-[14px] text-[#0C0D10]/50 mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products">
            <Button className="rounded-[8px] gap-2 text-[13px] font-semibold h-10 px-5 bg-[#1160CB] hover:bg-[#479BF7] text-white">
              <Plus size={14} /> Add Product
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline" className="rounded-[8px] text-[13px] font-semibold h-10 px-5 border-[#F0F2F8] text-[#0C0D10]/70 hover:bg-[#F0F2F8]">
              View Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white rounded-[12px] p-6 transition-all duration-200 hover:-translate-y-0.5"
            style={{ border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-caption text-[#1160CB]">{kpi.title}</p>
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center" style={{ background: "rgba(17,96,203,0.08)" }}>
                <kpi.icon size={17} className="text-[#1160CB]" />
              </div>
            </div>
            <p className="font-semibold text-[#0C0D10] mb-2" style={{ fontSize: 36, lineHeight: 1.1 }}>{kpi.value}</p>
            <div className={cn("flex items-center gap-1 text-[12px] font-medium")}>
              {kpi.trendUp
                ? <ArrowUpRight size={13} style={{ color: "#05b169" }} />
                : <ArrowDownRight size={13} style={{ color: "#cf202f" }} />
              }
              <span style={{ color: kpi.trendUp ? "#05b169" : "#cf202f" }}>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 bg-white rounded-[12px] overflow-hidden"
          style={{ border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}
        >
          <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F2F8" }}>
            <div>
              <p className="text-caption text-[#1160CB]">Revenue — Last 7 Days</p>
              <p className="text-[13px] text-[#0C0D10]/40 mt-0.5">Based on paid orders</p>
            </div>
            <div className="text-right">
              <p className="text-[24px] font-bold text-[#0C0D10]">${netRevenue.toFixed(2)}</p>
              <p className="text-caption text-[#05b169]">Net total</p>
            </div>
          </div>
          <div className="p-6">
            <ChartContainer config={chartConfig} className="h-52 w-full">
              <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1160CB" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#1160CB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F8" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 500, fill: "#0C0D10", opacity: 0.4 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#0C0D10", opacity: 0.4 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => [`$${Number(v).toFixed(2)}`, "Revenue"]} />} />
                <Area type="monotone" dataKey="revenue" stroke="#1160CB" strokeWidth={2} fill="url(#revGradient)" dot={{ fill: "#1160CB", strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="bg-white rounded-[12px] overflow-hidden"
          style={{ border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}
        >
          <div className="px-6 py-5" style={{ borderBottom: "1px solid #F0F2F8" }}>
            <p className="text-caption text-[#1160CB]">Quick Actions</p>
          </div>
          <div className="p-4 space-y-1">
            {[
              { label: "Add New Product", icon: Package, path: "/admin/products", bg: "rgba(17,96,203,0.08)", color: "#1160CB" },
              { label: "Manage Orders", icon: ShoppingBag, path: "/admin/orders", bg: "rgba(71,155,247,0.08)", color: "#479BF7" },
              { label: "Create Discount", icon: TrendingUp, path: "/admin/discounts", bg: "rgba(5,177,105,0.08)", color: "#05b169" },
              { label: "View Customers", icon: Users, path: "/admin/customers", bg: "rgba(21,40,161,0.08)", color: "#1528A1" },
              { label: "Review Returns", icon: RotateCcw, path: "/admin/returns", bg: "rgba(207,32,47,0.08)", color: "#cf202f", badge: pendingReturns > 0 ? pendingReturns : undefined },
              { label: "Approve Reviews", icon: Star, path: "/admin/reviews", bg: "rgba(234,179,8,0.08)", color: "#ca8a04", badge: pendingReviews > 0 ? pendingReviews : undefined },
            ].map(action => (
              <Link key={action.path} to={action.path}>
                <div className="flex items-center gap-3 p-3 rounded-[8px] transition-colors group cursor-pointer hover:bg-[#F0F2F8]">
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: action.bg }}>
                    <action.icon size={15} style={{ color: action.color }} />
                  </div>
                  <span className="text-[13px] font-medium text-[#0C0D10]/70 group-hover:text-[#0C0D10] flex-1">{action.label}</span>
                  {action.badge !== undefined && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(207,32,47,0.1)", color: "#cf202f" }}>
                      {action.badge}
                    </span>
                  )}
                  <ArrowRight size={13} className="text-[#0C0D10]/20 group-hover:text-[#0C0D10]/50 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div
          className="lg:col-span-8 bg-white rounded-[12px] overflow-hidden"
          style={{ border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}
        >
          <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F2F8" }}>
            <p className="text-caption text-[#1160CB]">Recent Orders</p>
            <Link to="/admin/orders" className="text-caption text-[#1160CB] hover:text-[#1528A1] flex items-center gap-1 transition-colors">
              View All <ArrowRight size={11} />
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 mb-3" style={{ color: "#F0F2F8" }} />
              <p className="text-caption text-[#0C0D10]/30">No orders yet</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto] items-center px-6 py-3" style={{ background: "#F0F2F8" }}>
                <p className="text-caption text-[#1160CB]">Customer / Order</p>
                <p className="text-caption text-[#1160CB] pr-6">Amount</p>
                <p className="text-caption text-[#1160CB]">Status</p>
              </div>
              <div>
                {orders.slice(0, 6).map(order => (
                  <div
                    key={order.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center px-6 py-4 transition-colors"
                    style={{ borderBottom: "1px solid #F0F2F8" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(21,40,161,0.02)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#1160CB] font-semibold text-[13px] flex-shrink-0"
                        style={{ background: "rgba(17,96,203,0.08)" }}
                      >
                        {order.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#0C0D10]">{order.customerName}</p>
                        <p className="text-caption text-[#0C0D10]/30">{order.id} · {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-[#0C0D10] text-[14px] pr-6">${order.totalAmount.toFixed(2)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Activity Feed */}
        <div
          className="lg:col-span-4 bg-white rounded-[12px] overflow-hidden"
          style={{ border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}
        >
          <div className="px-6 py-5" style={{ borderBottom: "1px solid #F0F2F8" }}>
            <p className="text-caption text-[#1160CB]">Activity</p>
          </div>
          <div className="p-4">
            {recentActivity.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 mb-3" style={{ color: "#05b169", opacity: 0.3 }} />
                <p className="text-caption text-[#0C0D10]/30">All quiet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentActivity.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-[8px] hover:bg-[#F0F2F8] transition-colors">
                    <div
                      className="w-7 h-7 rounded-[6px] flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: event.bg, color: event.color }}
                    >
                      {event.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-[#0C0D10]/80 leading-snug">{event.text}</p>
                      <p className="text-caption text-[#0C0D10]/30 mt-0.5">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Inventory Alerts + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Alerts */}
        <div
          className="bg-white rounded-[12px] overflow-hidden"
          style={{ border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}
        >
          <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F2F8" }}>
            <p className="text-caption text-[#1160CB]">Inventory Alerts</p>
            <Link to="/admin/inventory" className="text-caption text-[#1160CB] hover:text-[#1528A1] flex items-center gap-1 transition-colors">
              Manage <ArrowRight size={11} />
            </Link>
          </div>
          <div className="p-5">
            {lowStock.length === 0 && outOfStock.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 mb-3" style={{ color: "#05b169", opacity: 0.3 }} />
                <p className="text-caption text-[#0C0D10]/30">All stock levels healthy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...outOfStock, ...lowStock].slice(0, 5).map(p => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-[8px]"
                    style={{ background: "#F0F2F8" }}
                  >
                    <div className="w-10 h-10 rounded-[8px] bg-white overflow-hidden p-1 flex-shrink-0" style={{ border: "1px solid #F0F2F8" }}>
                      <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#0C0D10]/80 truncate">{p.title}</p>
                      <p className="text-caption text-[#0C0D10]/30">{p.sku}</p>
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-[6px] uppercase tracking-[1.5px]"
                      style={p.stockQuantity === 0
                        ? { background: "rgba(207,32,47,0.1)", color: "#cf202f" }
                        : { background: "rgba(234,179,8,0.1)", color: "#ca8a04" }
                      }
                    >
                      {p.stockQuantity === 0 ? "Out of stock" : `${p.stockQuantity} left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div
          className="bg-white rounded-[12px] overflow-hidden"
          style={{ border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" }}
        >
          <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F2F8" }}>
            <p className="text-caption text-[#1160CB]">Top Products</p>
            <Link to="/admin/products" className="text-caption text-[#1160CB] hover:text-[#1528A1] flex items-center gap-1 transition-colors">
              All Products <ArrowRight size={11} />
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-[8px] hover:bg-[#F0F2F8] transition-colors">
                <span className="text-caption text-[#0C0D10]/25 w-4 text-center">#{i + 1}</span>
                <div className="w-10 h-10 rounded-[8px] bg-white overflow-hidden p-1 flex-shrink-0" style={{ border: "1px solid #F0F2F8" }}>
                  <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#0C0D10]/80 truncate">{p.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={8} className={j < Math.round(p.rating) ? "text-amber-400 fill-amber-400" : "text-[#F0F2F8] fill-[#F0F2F8]"} />
                    ))}
                    <span className="text-caption text-[#0C0D10]/30 ml-0.5">({p.reviewCount})</span>
                  </div>
                </div>
                <p className="font-semibold text-[#1528A1] text-[14px]">${p.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
