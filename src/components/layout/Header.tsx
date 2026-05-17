"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, LayoutDashboard, X, Smartphone, Laptop, Headphones, Watch } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CartDrawer from "../storefront/CartDrawer";
import { cn } from "@/lib/utils";

const Header = () => {
  const { cart } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const categories = [
    { name: "Phones", icon: Smartphone, path: "/?category=Phone Accessories" },
    { name: "Laptops", icon: Laptop, path: "/?category=Laptop Accessories" },
    { name: "Audio", icon: Headphones, path: "/?category=Audio" },
    { name: "Gaming", icon: Watch, path: "/?category=Gaming Accessories" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="section-container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Electro<span className="text-primary">Store</span></span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              {categories.map((cat) => (
                <Link 
                  key={cat.name} 
                  to={cat.path} 
                  className="text-sm font-medium text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <cat.icon size={16} />
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search for products, brands..."
                className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 px-10 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/admin" className="hidden sm:flex">
              <Button variant="ghost" size="sm" className="text-slate-600 gap-2">
                <LayoutDashboard size={18} />
                <span className="hidden xl:inline">Admin</span>
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] animate-in zoom-in" variant="destructive">
                  {cartCount}
                </Badge>
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg transition-all duration-300 ease-in-out overflow-hidden",
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="relative md:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search products..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-10 py-2 text-sm outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <nav className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link 
                  key={cat.name} 
                  to={cat.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:bg-primary/5 hover:border-primary/20 transition-all"
                >
                  <cat.icon className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t">
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default Header;