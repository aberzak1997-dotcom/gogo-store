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
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Zap,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  const { products, orders, returns } = useStore();
  
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  
  const totalOrders = orders.length;
  
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

  const pendingReturns = returns.filter(r => r.status === "requested").length;
  const avgOrderValue = revenueOrders.length > 0 ? grossRevenue / revenueOrders.length : 0;

  const topProducts = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  const stats = [
    { title: "Net Revenue", value: `$${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: "text-[#0096D6]", bg: "bg-[#0096D6]/5", trend: `${revenueOrders.length} paid`, trendUp: true },
    { title: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-slate-600", bg: "bg-slate-100", trend: `AOV $${avgOrderValue.toFixed(2)}`, trendUp: true },
    { title: "Active Products", value: activeProducts, icon: Zap, color: "text-amber-500", bg: "bg-amber-50", trend: `${products.length - activeProducts} draft`, trendUp: true },
    { title: "Pending Returns", value: pendingReturns, icon: RotateCcw, color: "text-rose-500", bg: "bg-rose-50", trend: pendingReturns === 0 ? "All clear" : "Needs review", trendUp: pendingReturns === 0 },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Overview</h1>
          <p className="text-slate-500 text-sm font-medium">Monitoring ElectroStore's performance and operations.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-slate-100 shadow-sm">
          <button className="px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Real-time</button>
          <button className="px-5 py-2 rounded-full text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Monthly</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.title}</CardTitle>
              <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                <stat.icon size={18} />
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                stat.trendUp ? "text-emerald-500" : "text-rose-500"
              )}>
                {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend} <span className="text-slate-300 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-8 border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-[#0096D6]/5 text-[#0096D6] rounded-lg">
                <ShoppingBag size={18} />
              </div>
              Recent Orders
            </CardTitle>
            <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5">
              View All <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-slate-100 mb-4" />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {orders.slice(0, 6).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                        {order.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div>
                        <p className="font-black text-slate-900 text-sm">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <Badge className={cn(
                        "text-[9px] uppercase font-black px-3 py-1 rounded-full",
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-transparent shadow-none' : 
                        order.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-transparent shadow-none' : 'bg-amber-50 text-amber-600 border-transparent shadow-none'
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
        <Card className="lg:col-span-4 border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <AlertTriangle size={18} />
              </div>
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-100 mb-4" />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Inventory is healthy</p>
              </div>
            ) : (
              <div className="space-y-6">
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 6).map(product => (
                  <div key={product.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-50 p-1 flex-shrink-0">
                        <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 line-clamp-1 text-xs truncate">{product.title}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{product.sku}</p>
                      </div>
                    </div>
                    <Badge variant={product.stockQuantity === 0 ? "destructive" : "outline"} className="rounded-full font-black text-[9px] h-6 px-2 min-w-[24px] justify-center">
                      {product.stockQuantity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <TrendingUp size={18} />
            </div>
            Top Products by Popularity
          </CardTitle>
          <Link to="/admin/products" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5">
            Manage <ArrowRight size={12} />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-6 text-center text-[10px] font-black text-slate-300">#{i + 1}</span>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 p-1 flex-shrink-0">
                    <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{product.title}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.sku} • {product.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-right">
                  <div>
                    <p className="font-black text-slate-900 text-sm">${product.price.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.reviewCount} reviews</p>
                  </div>
                  <Badge className={cn("text-[9px] uppercase font-black px-3 py-1 rounded-full", product.stockQuantity === 0 ? "bg-rose-50 text-rose-600 border-transparent shadow-none" : product.stockQuantity < 5 ? "bg-amber-50 text-amber-600 border-transparent shadow-none" : "bg-emerald-50 text-emerald-600 border-transparent shadow-none")}>
                    {product.stockQuantity === 0 ? "Out of stock" : product.stockQuantity < 5 ? `${product.stockQuantity} left` : "In stock"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;