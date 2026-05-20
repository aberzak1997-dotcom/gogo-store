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
    <div className="flex flex-col h-full bg-black text-zinc-400 overflow-hidden border-r border-zinc-900">
      <div className="p-6 border-b border-zinc-900 flex items-center justify-between h-20">
        <div className="flex items-center gap-3 min-w-max">
          <div className="p-2 bg-[#FFCC00] rounded-none shadow-none">
            <LayoutDashboard size={20} className="text-black" />
          </div>
          {!isSidebarCollapsed && (
            <h2 className="text-lg font-black text-white tracking-tighter uppercase">
              RENAULT<span className="text-[#FFCC00]">HUB</span>
            </h2>
          )}
        </div>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex p-1.5 hover:bg-zinc-900 rounded-none text-zinc-500 transition-colors"
        >
          <ChevronRight className={cn("transition-transform duration-300", !isSidebarCollapsed && "rotate-180")} size={18} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar py-6 px-3 space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {!isSidebarCollapsed && (
              <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600 mb-4">
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
                    "flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-200 group relative text-xs font-black uppercase tracking-wider",
                    location.pathname === item.path
                      ? "bg-[#FFCC00] text-black shadow-none"
                      : "hover:bg-zinc-900 hover:text-white"
                  )}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {location.pathname === item.path && !isSidebarCollapsed && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-none bg-black" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-900 space-y-2 bg-black">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-none hover:bg-zinc-900 hover:text-white transition-all duration-200 text-xs font-black uppercase tracking-wider"
        >
          <Store size={18} className="flex-shrink-0" />
          {!isSidebarCollapsed && (
            <span>Back to Store</span>
          )}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-none w-full text-left hover:bg-red-950/30 hover:text-red-400 transition-all duration-200 text-xs font-black uppercase tracking-wider"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isSidebarCollapsed && (
            <span>Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out border-r border-zinc-900",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-black text-white flex items-center justify-between px-6 z-50 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FFCC00] rounded-none">
            <LayoutDashboard size={20} className="text-black" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-wider">RENAULTHUB</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:bg-zinc-900 rounded-none"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-black shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main 
        className={cn(
          "flex-grow pt-20 lg:pt-0 transition-all duration-300 ease-in-out bg-zinc-950",
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        )}
      >
        <div className="p-6 md:p-12 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;