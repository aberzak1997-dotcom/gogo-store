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
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  const stats = [
    { title: "Net Revenue", value: `$${netRevenue.toFixed(2)}`, icon: DollarSign, color: "text-[#FFCC00]", bg: "bg-zinc-900", trend: "+12.5%", trendUp: true },
    { title: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-[#FFCC00]", bg: "bg-zinc-900", trend: "+8.2%", trendUp: true },
    { title: "Active Products", value: activeProducts, icon: CheckCircle2, color: "text-[#FFCC00]", bg: "bg-zinc-900", trend: "+2", trendUp: true },
    { title: "Pending Returns", value: returns.filter(r => r.status === "requested").length, icon: RotateCcw, color: "text-[#FFCC00]", bg: "bg-zinc-900", trend: "0", trendUp: true },
  ];

  return (
    <div className="space-y-10 text-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Telemetry Dashboard</h1>
          <p className="text-zinc-400 mt-2 font-medium uppercase text-xs tracking-wider">Real-time store performance and operations.</p>
        </div>
        <div className="flex items-center gap-2 bg-black p-1.5 rounded-none border border-zinc-800 shadow-sm">
          <button className="px-4 py-2 rounded-none bg-[#FFCC00] text-black text-xs font-black uppercase tracking-wider">Today</button>
          <button className="px-4 py-2 rounded-none text-zinc-400 text-xs font-black uppercase tracking-wider hover:bg-zinc-900 hover:text-white">Weekly</button>
          <button className="px-4 py-2 rounded-none text-zinc-400 text-xs font-black uppercase tracking-wider hover:bg-zinc-900 hover:text-white">Monthly</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border border-zinc-900 bg-black rounded-none overflow-hidden group hover:border-[#FFCC00] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.title}</CardTitle>
              <div className={cn("p-3 rounded-none transition-transform group-hover:scale-105", stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold",
                stat.trendUp ? "text-emerald-500" : "text-red-500"
              )}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend} <span className="text-zinc-500 font-medium ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border border-zinc-900 bg-black rounded-none overflow-hidden">
          <CardHeader className="p-8 border-b border-zinc-900">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-black flex items-center gap-3 uppercase tracking-wider">
                <div className="p-2 bg-zinc-900 text-[#FFCC00] rounded-none">
                  <ShoppingBag size={20} />
                </div>
                Recent Orders
              </CardTitle>
              <button className="text-xs font-black uppercase tracking-wider text-[#FFCC00] hover:underline">View All</button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-zinc-800 mb-4" />
                <p className="text-zinc-500 font-medium uppercase text-xs tracking-wider">No orders yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-900">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-8 hover:bg-zinc-900/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-none bg-zinc-900 flex items-center justify-center text-zinc-500 font-black text-xs">
                        {order.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white uppercase text-sm tracking-wider">{order.customerName}</p>
                        <p className="text-xs text-zinc-500 font-medium">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-white">${order.totalAmount.toFixed(2)}</p>
                      <Badge className={cn(
                        "text-[9px] uppercase font-black px-3 py-1 rounded-none mt-1 border-none",
                        order.status === 'delivered' ? 'bg-emerald-950 text-emerald-400' : 
                        order.status === 'cancelled' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
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
        <Card className="border border-zinc-900 bg-black rounded-none overflow-hidden">
          <CardHeader className="p-8 border-b border-zinc-900">
            <CardTitle className="text-lg font-black flex items-center gap-3 uppercase tracking-wider">
              <div className="p-2 bg-zinc-900 text-[#FFCC00] rounded-none">
                <AlertTriangle size={20} />
              </div>
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                <p className="text-zinc-500 font-medium uppercase text-xs tracking-wider">All stock levels healthy.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 6).map(product => (
                  <div key={product.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-none bg-zinc-900 overflow-hidden border border-zinc-800 p-1">
                        <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white line-clamp-1 text-xs uppercase tracking-wider">{product.title}</p>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{product.sku}</p>
                      </div>
                    </div>
                    <Badge variant={product.stockQuantity === 0 ? "destructive" : "outline"} className="rounded-none font-black text-xs">
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