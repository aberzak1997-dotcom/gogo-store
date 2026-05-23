"use client";

import React, { useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Package, Star, RotateCcw } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const AdminAnalyticsPage = () => {
  const { products, orders, customers, returns, reviews } = useStore();

  const paidOrders = orders.filter(o =>
    (o.paymentStatus === "paid" || o.status === "delivered" || o.status === "shipped") &&
    o.status !== "cancelled"
  );

  const totalRevenue = paidOrders.reduce((s, o) => s + o.totalAmount, 0);
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  const returningCustomers = customers.filter(c => c.totalOrders > 1).length;
  const retentionRate = customers.length > 0 ? (returningCustomers / customers.length) * 100 : 0;

  const refundedReturns = returns.filter(r => r.status === "refunded").length;
  const returnRate = orders.length > 0 ? (refundedReturns / orders.length) * 100 : 0;

  const approvedReviews = reviews.filter(r => r.status === "approved");
  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length
    : 0;

  const stats = [
    { title: "Avg. Order Value", value: `$${avgOrderValue.toFixed(2)}`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Customer Retention", value: `${retentionRate.toFixed(1)}%`, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Return Rate", value: `${returnRate.toFixed(1)}%`, icon: RotateCcw, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Avg. Rating", value: avgRating > 0 ? avgRating.toFixed(1) : "—", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const categoryRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    paidOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          map[product.category] = (map[product.category] || 0) + item.price * item.quantity;
        }
      });
    });
    return Object.entries(map)
      .map(([category, revenue]) => ({ category: category.split(" ")[0], revenue: Math.round(revenue * 100) / 100 }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [paidOrders, products]);

  const topProducts = useMemo(() =>
    [...products]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5),
    [products]
  );

  const ordersByStatus = [
    { label: "Pending", count: orders.filter(o => o.status === "pending").length, color: "bg-amber-400" },
    { label: "Processing", count: orders.filter(o => o.status === "processing").length, color: "bg-blue-400" },
    { label: "Shipped", count: orders.filter(o => o.status === "shipped").length, color: "bg-indigo-400" },
    { label: "Delivered", count: orders.filter(o => o.status === "delivered").length, color: "bg-emerald-400" },
    { label: "Cancelled", count: orders.filter(o => o.status === "cancelled").length, color: "bg-rose-400" },
  ].filter(s => s.count > 0);

  const chartConfig = {
    revenue: { label: "Revenue", color: "#0096D6" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-slate-500 mt-2 font-medium">Deep dive into your store's performance and customer behavior.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem]">
            <CardContent className="p-8">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.title}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue by Category */}
        <Card className="lg:col-span-8 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <BarChart3 size={20} className="text-[#0096D6]" /> Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {categoryRevenue.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm font-medium">No sales data yet.</div>
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={categoryRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(v) => [`$${Number(v).toFixed(2)}`, "Revenue"]} />} />
                  <Bar dataKey="revenue" fill="#0096D6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card className="lg:col-span-4 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <ShoppingBag size={20} className="text-slate-600" /> Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {orders.length === 0 ? (
              <p className="text-slate-400 text-sm font-medium text-center py-8">No orders yet.</p>
            ) : (
              ordersByStatus.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    <span>{s.label}</span>
                    <span>{s.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.color}`}
                      style={{ width: `${(s.count / orders.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <Package size={20} className="text-amber-600" /> Top Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4 p-6 hover:bg-slate-50/50">
                  <span className="text-[10px] font-black text-slate-300 w-4">#{i + 1}</span>
                  <div className="w-9 h-9 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 p-0.5 flex-shrink-0">
                    <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.reviewCount} reviews</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-sm">${p.price.toFixed(2)}</p>
                    <div className="flex items-center gap-0.5 justify-end mt-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={8} className={j < Math.round(p.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Breakdown */}
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <Users size={20} className="text-purple-600" /> Customer Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-5">
            {[
              { label: "VIP", count: customers.filter(c => c.status === "VIP").length, color: "bg-purple-400" },
              { label: "Returning", count: customers.filter(c => c.status === "returning").length, color: "bg-blue-400" },
              { label: "Active", count: customers.filter(c => c.status === "active").length, color: "bg-emerald-400" },
              { label: "Blocked", count: customers.filter(c => c.status === "blocked").length, color: "bg-rose-400" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                  <span>{s.label}</span>
                  <span>{s.count} / {customers.length}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: customers.length > 0 ? `${(s.count / customers.length) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-2xl">
                <p className="text-2xl font-black text-slate-900">{customers.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Total Customers</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-2xl">
                <p className="text-2xl font-black text-slate-900">
                  ${customers.length > 0 ? (customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length).toFixed(0) : "0"}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Avg. LTV</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
