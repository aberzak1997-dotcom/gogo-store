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
  Bell,
  Plug,
  Search,
  BookOpen
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
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { returns, reviews } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const alertCount = returns.filter(r => r.status === "requested").length +
    reviews.filter(r => r.status === "pending").length;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

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
        { label: "Articles", icon: BookOpen, path: "/admin/articles" },
        { label: "SEO", icon: Search, path: "/admin/seo" },
      ]
    },
    {
      title: "Store",
      items: [
        { label: "Integrations", icon: Plug, path: "/admin/integrations" },
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
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#0E121A" }}>
      {/* Logo */}
      <div className="px-5 flex items-center justify-between border-b border-white/[0.06]" style={{ height: 68 }}>
        <div className="flex items-center gap-3 min-w-max">
          {!isSidebarCollapsed && (
            <span className="text-white font-bold text-[17px] tracking-[-0.5px]">
              WIVI<span className="text-[#479BF7]">TEC</span>
            </span>
          )}
          {isSidebarCollapsed && (
            <span className="text-[#479BF7] font-bold text-[20px]">W</span>
          )}
        </div>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex p-1.5 hover:bg-white/[0.06] rounded-[6px] text-white/30 hover:text-white/70 transition-colors"
        >
          <ChevronRight className={cn("transition-transform duration-300", !isSidebarCollapsed && "rotate-180")} size={16} />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-grow overflow-y-auto py-5 px-3 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isSidebarCollapsed && (
              <p className="px-3 text-caption text-white/25 mb-3">{section.title}</p>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-all duration-150",
                    isActive
                      ? "bg-[#1528A1] text-white"
                      : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  <item.icon size={16} className="flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>
                  )}
                  {isActive && alertCount > 0 && !isSidebarCollapsed && item.label === "Orders" && (
                    <span className="ml-auto text-[10px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded-full">{alertCount}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-white/50 hover:text-white hover:bg-white/[0.05] transition-all text-[13px] font-medium"
        >
          <Store size={16} className="flex-shrink-0" />
          {!isSidebarCollapsed && <span>View Store</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] w-full text-left text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-[13px] font-medium"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F0F2F8]">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out border-r border-white/[0.06]",
          isSidebarCollapsed ? "w-[68px]" : "w-60"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[68px] bg-[#0E121A] text-white flex items-center justify-between px-5 z-50 border-b border-white/[0.06]">
        <span className="text-white font-bold text-[17px] tracking-[-0.5px]">
          WIVI<span className="text-[#479BF7]">TEC</span>
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white/70 hover:text-white hover:bg-white/[0.06]"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-60 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-grow pt-[68px] lg:pt-0 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-60"
        )}
      >
        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-[#F0F2F8] bg-white sticky top-0 z-30">
          <p className="text-caption text-[#1160CB]">
            {location.pathname === "/admin" ? "Dashboard" :
              location.pathname.replace("/admin/", "").replace("-", " ").replace(/^\w/, c => c.toUpperCase())}
          </p>
          <div className="flex items-center gap-2">
            <Link to="/admin/returns" className="relative p-2 rounded-[8px] hover:bg-[#F0F2F8] transition-colors text-[#0C0D10]/40 hover:text-[#0C0D10]">
              <Bell size={17} />
              {alertCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center bg-rose-500 text-white border-transparent text-[8px] font-bold shadow-none rounded-full">
                  {alertCount}
                </Badge>
              )}
            </Link>
            <Link to="/" className="flex items-center gap-2 text-caption text-[#0C0D10]/40 hover:text-[#1160CB] transition-colors px-3 py-2 rounded-[8px] hover:bg-[#F0F2F8]">
              <Store size={14} /> View Store
            </Link>
          </div>
        </div>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
