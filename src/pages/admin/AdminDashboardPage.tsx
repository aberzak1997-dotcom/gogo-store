import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  ShoppingBag, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Layers,
  CheckCircle2,
  FileEdit
} from "lucide-react";

const AdminDashboardPage = () => {
  const { products, orders } = useStore();
  
  // Calculations
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const draftProducts = products.filter(p => p.status === "draft").length;
  
  const totalOrders = orders.length;
  const shippedOrders = orders.filter(o => o.status === "shipped");
  const totalRevenue = shippedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = shippedOrders.length > 0 ? totalRevenue / shippedOrders.length : 0;
  
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5);
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0);

  // Category Summary
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { title: "Total Products", value: totalProducts, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Products", value: activeProducts, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { title: "Draft Products", value: draftProducts, icon: FileEdit, color: "text-slate-600", bg: "bg-slate-50" },
    { title: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Avg Order Value", value: `$${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Low Stock", value: lowStockProducts.length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Out of Stock", value: outOfStockProducts.length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag size={20} className="text-purple-600" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-semibold text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">${order.totalAmount.toFixed(2)}</p>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'shipped' ? 'bg-green-100 text-green-700' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Preview */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-600" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">All products are well stocked.</p>
              ) : (
                <div className="space-y-4">
                  {lowStockProducts.slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden border border-slate-200">
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 line-clamp-1">{product.title}</p>
                          <p className="text-xs text-slate-500">{product.brand} • {product.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-600">{product.stockQuantity} left</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Summary */}
          <Card className="border-none shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Layers size={20} className="text-blue-600" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-2xl font-bold text-slate-900">{count}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{category}</p>
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