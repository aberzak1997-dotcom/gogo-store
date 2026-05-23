"use client";

import React, { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  ShoppingBag,
  LogOut,
  Store,
  Menu,
  X,
  Users,
  Tag,
  RotateCcw,
  Star,
  Megaphone,
  BarChart3,
  Settings,
  ChevronRight,
  Zap,
  CreditCard,
  Truck,
  Bell
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const { returns, reviews } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const alertCount = returns.filter(r => r.status === "requested").length +
    reviews.filter(r => r.status === "pending").length;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const sections = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { label: "Products", icon: Package, path: "/admin/products" },
        { label: "Inventory", icon: AlertTriangle, path: "/admin/inventory" },
        { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
      ]
    },
    {
      title: "Sales",
      items: [
        { label: "Customers", icon: Users, path: "/admin/customers" },
        { label: "Discounts", icon: Tag, path: "/admin/discounts" },
        { label: "Returns", icon: RotateCcw, path: "/admin/returns" },
        { label: "Reviews", icon: Star, path: "/admin/reviews" },
      ]
    },
    {
      title: "Growth",
      items: [
        { label: "Marketing", icon: Megaphone, path: "/admin/marketing" },
        { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
      ]
    },
    {
      title: "Store",
      items: [
        { label: "Payments", icon: CreditCard, path: "/admin/payments" },
        { label: "Shipping", icon: Truck, path: "/admin/shipping" },
        { label: "Settings", icon: Settings, path: "/admin/settings" },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between h-20">
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white">
            <Zap size={20} fill="currentColor" className="text-[#0096D6]" />
          </div>
          {!isSidebarCollapsed && (
            <h2 className="text-lg font-black text-white tracking-tighter uppercase">
              ELECTRO<span className="text-[#0096D6]">HUB</span>
            </h2>
          )}
        </div>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex p-1.5 hover:bg-white/10 rounded-lg text-slate-500 transition-colors"
        >
          <ChevronRight className={cn("transition-transform duration-300", !isSidebarCollapsed && "rotate-180")} size={18} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar py-6 px-3 space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {!isSidebarCollapsed && (
              <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                    location.pathname === item.path
                      ? "bg-[#0096D6] text-white shadow-lg shadow-[#0096D6]/20"
                      : "hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {location.pathname === item.path && !isSidebarCollapsed && (
                    <div className="absolute right-4 w-1 h-1 rounded-full bg-white/50" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-2 bg-slate-900">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200 text-xs font-bold uppercase tracking-widest"
        >
          <Store size={18} className="flex-shrink-0" />
          {!isSidebarCollapsed && <span>View Store</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 text-xs font-bold uppercase tracking-widest"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50/50">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out border-r border-slate-200",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-slate-900 text-white flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Zap size={18} fill="currentColor" className="text-[#0096D6]" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-tighter">ELECTROHUB</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:bg-white/10"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-slate-900 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-grow pt-20 lg:pt-0 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-between px-10 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            {location.pathname === "/admin" ? "Dashboard" :
              location.pathname.replace("/admin/", "").replace("-", " ").replace(/^\w/, c => c.toUpperCase())}
          </p>
          <div className="flex items-center gap-3">
            <Link to="/admin/returns" className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              <Bell size={18} />
              {alertCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-rose-500 text-white border-transparent text-[8px] font-black shadow-none rounded-full">
                  {alertCount}
                </Badge>
              )}
            </Link>
            <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100">
              <Store size={15} /> View Store
            </Link>
          </div>
        </div>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;