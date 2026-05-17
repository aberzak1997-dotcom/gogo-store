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
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      <div className="p-6 border-b border-slate-800 flex items-center justify-between h-20">
        <div className="flex items-center gap-3 min-w-max">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          {!isSidebarCollapsed && (
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">
              Seller<span className="text-blue-500">Hub</span>
            </h2>
          )}
        </div>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
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
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="font-bold text-sm whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {location.pathname === item.path && !isSidebarCollapsed && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900/50 backdrop-blur-xl">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <Store size={20} className="flex-shrink-0" />
          {!isSidebarCollapsed && (
            <span className="font-bold text-sm">Back to Store</span>
          )}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isSidebarCollapsed && (
            <span className="font-bold text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out border-r border-slate-800",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-slate-900 text-white flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <LayoutDashboard size={20} />
          </div>
          <h2 className="text-lg font-black uppercase tracking-tighter">SellerHub</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:bg-slate-800"
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
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-900 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main 
        className={cn(
          "flex-grow pt-20 lg:pt-0 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        )}
      >
        <div className="p-6 md:p-12 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;