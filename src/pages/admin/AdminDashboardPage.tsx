"use client";

import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
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
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminDashboardPage = () => {
  const { products, orders } = useStore();
  
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const draftProducts = products.filter(p => p.status === "draft").length;
  
  const totalOrders = orders.length;
  const shippedOrders = orders.filter(o => o.status === "shipped");
  const totalRevenue = shippedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = shippedOrders.length > 0 ? totalRevenue / shippedOrders.length : 0;
  
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5);
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0);

  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12.5%", trendUp: true },
    { title: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50", trend: "+8.2%", trendUp: true },
    { title: "Active Products", value: activeProducts, icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50", trend: "+2", trendUp: true },
    { title: "Low Stock Items", value: lowStockProducts.length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", trend: "-1", trendUp: false },
  ];

  return (
    <AdminLayout>
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
                          order.status === 'shipped' ? 'bg-emerald-100 text-emerald-700' : 
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

          {/* Low Stock Alert */}
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

          {/* Category Distribution */}
          <Card className="lg:col-span-3 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Layers size={20} />
                </div>
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-center hover:bg-white hover:shadow-md transition-all duration-300 group">
                    <p className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">{count}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;