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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Products", icon: Package, path: "/admin/products" },
    { label: "Inventory", icon: AlertTriangle, path: "/admin/inventory" },
    { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center h-16">
        <div className="flex items-center gap-3 min-w-max">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          {!isSidebarCollapsed && (
            <h2 className="text-xl font-bold text-white whitespace-nowrap">
              Admin Panel
            </h2>
          )}
        </div>
      </div>

      <nav className="flex-grow p-3 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!isSidebarCollapsed && (
              <span className="font-medium whitespace-nowrap opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <Store size={20} className="flex-shrink-0" />
          {!isSidebarCollapsed && (
            <span className="font-medium whitespace-nowrap">Back to Store</span>
          )}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isSidebarCollapsed && (
            <span className="font-medium whitespace-nowrap">Logout</span>
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
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
        onMouseEnter={() => setIsSidebarCollapsed(false)}
        onMouseLeave={() => setIsSidebarCollapsed(true)}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="text-blue-500" />
          <h2 className="text-lg font-bold">Admin Panel</h2>
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
          <aside className="absolute inset-y-0 left-0 w-64 bg-slate-900 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main 
        className={cn(
          "flex-grow pt-16 lg:pt-0 transition-all duration-300 ease-in-out",
          "lg:ml-16", // Base margin for collapsed state
          !isSidebarCollapsed && "lg:ml-64" // Expanded margin
        )}
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;