import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, AlertTriangle, ArrowRight } from "lucide-react";

const AdminDashboardPage = () => {
  const { products, orders } = useStore();
  
  const lowStockCount = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5).length;
  const outOfStockCount = products.filter(p => p.stockQuantity === 0).length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const stats = [
    { title: "Total Products", value: products.length, icon: Package, color: "text-blue-600", link: "/admin/products" },
    { title: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-green-600", link: "/admin/orders" },
    { title: "Low Stock", value: lowStockCount, icon: AlertTriangle, color: "text-amber-600", link: "/admin/inventory" },
    { title: "Out of Stock", value: outOfStockCount, icon: AlertTriangle, color: "text-red-600", link: "/admin/inventory" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-grow container py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Total Revenue: <span className="font-bold text-foreground">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <Link key={i} to={stat.link}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link to="/admin/products" className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-blue-600" />
                  <span className="font-medium">Manage Products</span>
                </div>
                <ArrowRight size={16} />
              </Link>
              <Link to="/admin/inventory" className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-amber-600" />
                  <span className="font-medium">Inventory Control</span>
                </div>
                <ArrowRight size={16} />
              </Link>
              <Link to="/admin/orders" className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} className="text-green-600" />
                  <span className="font-medium">View Orders</span>
                </div>
                <ArrowRight size={16} />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-xs uppercase text-amber-600 font-semibold">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;