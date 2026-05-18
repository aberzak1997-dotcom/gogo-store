"use client";

import React from "react";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Layers,
  CheckCircle2,
  FileEdit,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  RotateCcw,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminDashboardPage = () => {
  const { products, orders, returns, customers, reviews } = useStore();
  
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  
  const totalOrders = orders.length;
  
  // Revenue logic: Only paid, shipped, or delivered orders count.
  // Cancelled orders don't count.
  // Refunded orders subtract from revenue.
  const revenueOrders = orders.filter(o => 
    (o.paymentStatus === "paid" || o.status === "shipped" || o.status === "delivered") && 
    o.status !== "cancelled"
  );
  
  const grossRevenue = revenueOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalRefunds = returns
    .filter(r => r.status === "refunded")
    .reduce((sum, r) => sum + r.refundAmount, 0);
    
  const netRevenue = grossRevenue - totalRefunds;
  
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5);
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0);

  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { title: "Net Revenue", value: `$${netRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12.5%", trendUp: true },
    { title: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50", trend: "+8.2%", trendUp: true },
    { title: "Active Products", value: activeProducts, icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50", trend: "+2", trendUp: true },
    { title: "Pending Returns", value: returns.filter(r => r.status === "requested").length, icon: RotateCcw, color: "text-amber-600", bg: "bg-amber-50", trend: "0", trendUp: true },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-2 font-medium">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold">Today</button>
          <button className="px-4 py-2 rounded-xl text-slate-500 text-sm font-bold hover:bg-slate-50">Weekly</button>
          <button className="px-4 py-2 rounded-xl text-slate-500 text-sm font-bold hover:bg-slate-50">Monthly</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.title}</CardTitle>
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="text-3xl font-black text-slate-900 mb-2">{stat.value}</div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold",
                stat.trendUp ? "text-emerald-600" : "text-red-600"
              )}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend} <span className="text-slate-400 font-medium ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Total Customers</CardTitle>
                  <div className="p-3 rounded-2xl transition-transform group-hover:scale-110 bg-indigo-50 text-indigo-600">
                    <Users size={20} />
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="text-3xl font-black text-slate-900 mb-2">{customers.length}</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    {customers.length > 0 ? `${(customers.filter(c => c.status !== 'blocked').length / Math.max(customers.length, 1) * 100).toFixed(0)}% active` : 'No customers'}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Returning Customers</CardTitle>
                  <div className="p-3 rounded-2xl transition-transform group-hover:scale-110 bg-cyan-50 text-cyan-600">
                    <TrendingUp size={20} />
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="text-3xl font-black text-slate-900 mb-2">{customers.filter(c => c.status === 'returning' || c.status === 'VIP').length}</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    {customers.length > 0 ? `${((customers.filter(c => c.status === 'returning' || c.status === 'VIP').length / Math.max(customers.length, 1)) * 100).toFixed(0)}% of customers` : 'Rate'}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">VIP Customers</CardTitle>
                  <div className="p-3 rounded-2xl transition-transform group-hover:scale-110 bg-amber-50 text-amber-600">
                    <Users size={20} />
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="text-3xl font-black text-slate-900 mb-2">{customers.filter(c => c.status === 'VIP').length}</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    Premium members
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Avg Customer Value</CardTitle>
                  <div className="p-3 rounded-2xl transition-transform group-hover:scale-110 bg-rose-50 text-rose-600">
                    <DollarSign size={20} />
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="text-3xl font-black text-slate-900 mb-2">${customers.length > 0 ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2) : '0.00'}</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    Per customer lifetime value
                  </div>
                </CardContent>
              </Card>
            </div>
      
            {/* Top Customers & Most Reviewed Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Users size={20} />
                    </div>
                    Top Customers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {customers.length === 0 ? (
                    <div className="py-20 text-center">
                      <Users className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                      <p className="text-slate-400 font-medium">No customers yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {[...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5).map(customer => (
                        <div key={customer.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {customer.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{customer.name}</p>
                              <p className="text-xs text-slate-400 truncate">{customer.email}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-slate-900">${customer.totalSpent.toFixed(2)}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{customer.totalOrders} orders</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                      <Star size={20} />
                    </div>
                    Most Reviewed Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {reviews.length === 0 ? (
                    <div className="py-20 text-center">
                      <Star className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                      <p className="text-slate-400 font-medium">No reviews yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {Object.entries(
                        reviews.reduce((acc, rev) => {
                          acc[rev.productId] = (acc[rev.productId] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).sort(([, a], [, b]) => b - a).slice(0, 5).map(([productId, count]) => {
                        const product = products.find(p => p.id === productId);
                        return (
                          <div key={productId} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4 min-w-0">
                              {product ? (
                                <div className="w-10 h-10 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0">
                                  <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                  <Star size={16} className="text-slate-400" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">{product?.title || 'Unknown Product'}</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-slate-900">{count}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{count === 1 ? 'review' : 'reviews'}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
      
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ShoppingBag size={20} />
                </div>
                Recent Orders
              </CardTitle>
              <button className="text-sm font-bold text-primary hover:underline">View All</button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">No orders yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-8 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                        {order.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-400 font-medium">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">${order.totalAmount.toFixed(2)}</p>
                      <Badge className={cn(
                        "text-[10px] uppercase font-black px-3 py-1 rounded-full mt-1",
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      )}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <AlertTriangle size={20} />
              </div>
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-200 mb-4" />
                <p className="text-slate-400 font-medium">All stock levels healthy.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 6).map(product => (
                  <div key={product.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 p-1">
                        <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 line-clamp-1 text-sm">{product.title}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.sku}</p>
                      </div>
                    </div>
                    <Badge variant={product.stockQuantity === 0 ? "destructive" : "outline"} className="rounded-lg font-black">
                      {product.stockQuantity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;