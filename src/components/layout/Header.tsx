"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, LayoutDashboard, X, Smartphone, Laptop, Headphones, MousePointer2, Keyboard, Video, Zap, Star, Info } from "lucide-react";
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
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const mainNav = [
    { name: "Products", path: "/products" },
    { name: "Deals", path: "/deals" },
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Best Sellers", path: "/best-sellers" },
    { name: "Support", path: "/faq" },
  ];

  const categories = [
    { name: "Keyboards", icon: Keyboard, path: "/products?category=Gaming Accessories" },
    { name: "Mice", icon: MousePointer2, path: "/products?category=PC Accessories" },
    { name: "Headsets", icon: Headphones, path: "/products?category=Audio" },
    { name: "Webcams", icon: Video, path: "/products?category=PC Accessories" },
    { name: "Chargers", icon: Zap, path: "/products?category=Chargers & Cables" },
    { name: "Storage", icon: Smartphone, path: "/products?category=Storage Devices" },
    { name: "Gaming", icon: Star, path: "/products?category=Gaming Accessories" },
    { name: "Laptops", icon: Laptop, path: "/products?category=Laptop Accessories" },
  ];

  return (
    <>
      <div className="bg-slate-900 text-white py-2 text-center text-[10px] font-black uppercase tracking-[0.2em]">
        Free shipping on orders over $50 • 30-day easy returns
      </div>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="section-container">
          <div className="flex h-16 items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="font-black text-xl tracking-tighter text-slate-900">ELECTRO<span className="text-primary">STORE</span></span>
            </Link>
            
            {/* Desktop Main Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {mainNav.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <form onSubmit={handleSearch} className="relative hidden md:block max-w-[240px] w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 px-10 py-2 text-xs transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <div className="flex items-center gap-1">
                <Link to="/admin" className="hidden sm:flex">
                  <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-50 rounded-full">
                    <LayoutDashboard size={20} />
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-slate-600 hover:bg-slate-50 rounded-full"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[8px] font-black bg-primary text-white border-2 border-white" variant="default">
                      {cartCount}
                    </Badge>
                  )}
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden text-slate-600 hover:bg-slate-50 rounded-full"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Category Nav (Desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-10 py-3 border-t border-slate-50">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={cat.path} 
                className="group flex flex-col items-center gap-1"
              >
                <cat.icon size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl transition-all duration-300 ease-in-out overflow-hidden",
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="p-6 space-y-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search products..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-2 text-sm outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <div className="grid grid-cols-2 gap-4">
              {mainNav.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-4 rounded-2xl bg-slate-50 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Categories</h4>
              <div className="grid grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <Link 
                    key={cat.name} 
                    to={cat.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <cat.icon size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase text-center text-slate-500">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-12 rounded-xl gap-2 font-bold">
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