"use client";

import React, { useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag, AlertTriangle, DollarSign, TrendingUp,
  CheckCircle2, ArrowUpRight, RotateCcw, Package,
  ArrowRight, Plus, Users, Star, Zap, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-600 border-rose-100",
  processing: "bg-blue-50 text-blue-700 border-blue-100",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  refunded: "bg-slate-100 text-slate-600 border-slate-200",
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
    const events: { icon: React.ReactNode; text: string; time: string; color: string }[] = [];
    orders.slice(0, 3).forEach(o => events.push({
      icon: <ShoppingBag size={14} />,
      text: `New order ${o.id} from ${o.customerName}`,
      time: new Date(o.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      color: "bg-blue-50 text-blue-600",
    }));
    returns.filter(r => r.status === "requested").slice(0, 2).forEach(r => events.push({
      icon: <RotateCcw size={14} />,
      text: `Return request from ${r.customerName}`,
      time: new Date(r.requestedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      color: "bg-rose-50 text-rose-600",
    }));
    reviews.filter(r => r.status === "pending").slice(0, 2).forEach(r => events.push({
      icon: <Star size={14} />,
      text: `New review on ${r.productTitle}`,
      time: new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      color: "bg-amber-50 text-amber-600",
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
      gradient: "from-[#0033CC] to-[#002299]",
      iconBg: "bg-white/20",
      textColor: "text-white",
      subColor: "text-white/70",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: orders.length,
      sub: `${paidOrders.length} paid`,
      icon: ShoppingBag,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-white/20",
      textColor: "text-white",
      subColor: "text-white/70",
      trendUp: true,
    },
    {
      title: "Customers",
      value: customers.length,
      sub: `${customers.filter(c => c.status === "VIP").length} VIP`,
      icon: Users,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-white/20",
      textColor: "text-white",
      subColor: "text-white/70",
      trendUp: true,
    },
    {
      title: "Pending Returns",
      value: pendingReturns,
      sub: pendingReturns === 0 ? "All clear" : "Needs review",
      icon: RotateCcw,
      gradient: pendingReturns === 0 ? "from-slate-700 to-slate-800" : "from-rose-500 to-rose-600",
      iconBg: "bg-white/20",
      textColor: "text-white",
      subColor: "text-white/70",
      trendUp: pendingReturns === 0,
    },
  ];

  const chartConfig = { revenue: { label: "Revenue", color: "#0033CC" } };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{dateStr}</p>
          <h1 className="text-3xl font-black text-slate-900">{greeting}, Admin 👋</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products">
            <Button className="rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] h-11 px-5 bg-[#0033CC] hover:bg-[#002299]">
              <Plus size={14} /> Add Product
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-5">
              View Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <div key={i} className={`bg-gradient-to-br ${kpi.gradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}>
            <div className="flex items-center justify-between mb-4">
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${kpi.subColor}`}>{kpi.title}</p>
              <div className={`w-9 h-9 ${kpi.iconBg} rounded-xl flex items-center justify-center ${kpi.textColor}`}>
                <kpi.icon size={18} />
              </div>
            </div>
            <p className={`text-3xl font-black ${kpi.textColor} tracking-tight mb-1`}>{kpi.value}</p>
            <div className={`flex items-center gap-1 text-[10px] font-black ${kpi.subColor}`}>
              <ArrowUpRight size={11} />
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Revenue — Last 7 Days</CardTitle>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Based on paid orders</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900">${netRevenue.toFixed(2)}</p>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Net total</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-52 w-full">
              <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0033CC" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0033CC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => [`$${Number(v).toFixed(2)}`, "Revenue"]} />} />
                <Area type="monotone" dataKey="revenue" stroke="#0033CC" strokeWidth={2.5} fill="url(#revGradient)" dot={{ fill: "#0033CC", strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {[
              { label: "Add New Product", icon: Package, path: "/admin/products", color: "text-[#0033CC] bg-[#0033CC]/10" },
              { label: "Manage Orders", icon: ShoppingBag, path: "/admin/orders", color: "text-violet-600 bg-violet-50" },
              { label: "Create Discount", icon: Zap, path: "/admin/discounts", color: "text-amber-600 bg-amber-50" },
              { label: "View Customers", icon: Users, path: "/admin/customers", color: "text-emerald-600 bg-emerald-50" },
              { label: "Review Returns", icon: RotateCcw, path: "/admin/returns", color: "text-rose-600 bg-rose-50", badge: pendingReturns > 0 ? pendingReturns : undefined },
              { label: "Approve Reviews", icon: Star, path: "/admin/reviews", color: "text-amber-600 bg-amber-50", badge: pendingReviews > 0 ? pendingReviews : undefined },
            ].map(action => (
              <Link key={action.path} to={action.path}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}>
                    <action.icon size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 flex-1">{action.label}</span>
                  {action.badge !== undefined && (
                    <Badge className="bg-rose-500 text-white border-transparent text-[9px] font-black shadow-none rounded-full px-2">
                      {action.badge}
                    </Badge>
                  )}
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2.5">
              <div className="p-1.5 bg-[#0033CC]/10 text-[#0033CC] rounded-lg">
                <ShoppingBag size={16} />
              </div>
              Recent Orders
            </CardTitle>
            <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-[#0033CC] hover:underline flex items-center gap-1">
              View All <ArrowRight size={11} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-slate-100 mb-3" />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {orders.slice(0, 6).map(order => (
                  <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black text-sm">
                        {order.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                          {order.id} · {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <p className="font-black text-slate-900">${order.totalAmount.toFixed(2)}</p>
                      <Badge className={cn("text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full border shadow-none", STATUS_COLORS[order.status] || "bg-slate-100 text-slate-500")}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-4 border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2.5">
              <div className="p-1.5 bg-violet-50 text-violet-600 rounded-lg">
                <Clock size={16} />
              </div>
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {recentActivity.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-100 mb-3" />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">All quiet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentActivity.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${event.color}`}>
                      {event.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 leading-snug">{event.text}</p>
                      <p className="text-[10px] text-slate-400 font-black mt-0.5">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Inventory Alerts + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Alerts */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2.5">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <AlertTriangle size={16} />
              </div>
              Inventory Alerts
            </CardTitle>
            <Link to="/admin/inventory" className="text-[10px] font-black uppercase tracking-widest text-[#0033CC] hover:underline flex items-center gap-1">
              Manage <ArrowRight size={11} />
            </Link>
          </CardHeader>
          <CardContent className="p-5">
            {lowStock.length === 0 && outOfStock.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-200 mb-3" />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">All stock levels healthy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...outOfStock, ...lowStock].slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/60">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 overflow-hidden p-1 flex-shrink-0">
                      <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-xs truncate">{p.title}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.sku}</p>
                    </div>
                    <Badge className={cn("text-[9px] font-black rounded-full px-2.5 py-0.5 border shadow-none", p.stockQuantity === 0 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-700 border-amber-100")}>
                      {p.stockQuantity === 0 ? "Out of stock" : `${p.stockQuantity} left`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={16} />
              </div>
              Top Products
            </CardTitle>
            <Link to="/admin/products" className="text-[10px] font-black uppercase tracking-widest text-[#0033CC] hover:underline flex items-center gap-1">
              All Products <ArrowRight size={11} />
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-[10px] font-black text-slate-300 w-4 text-center">#{i + 1}</span>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 overflow-hidden p-1 flex-shrink-0">
                  <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-xs truncate">{p.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={8} className={j < Math.round(p.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                    <span className="text-[9px] text-slate-400 font-bold ml-0.5">({p.reviewCount})</span>
                  </div>
                </div>
                <p className="font-black text-slate-900 text-sm">${p.price.toFixed(2)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
