"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "../../context/StoreContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useStore();
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const categories = [
    "Phone Accessories",
    "Chargers & Cables",
    "Audio",
    "Laptop Accessories",
    "PC Accessories",
    "Gaming Accessories",
    "Storage Devices"
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm" 
          : "bg-white border-b border-slate-50 py-5"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#0C0587] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0C0587]/20 group-hover:scale-105 transition-transform">
                <Zap size={22} fill="currentColor" />
              </div>
              <span className="font-black text-xl tracking-tighter text-slate-900">ELECTRO<span className="text-[#0C0587]">STORE</span></span>
            </Link>
            
            {/* Desktop Main Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full px-4">
                    Categories <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2 rounded-2xl">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat} asChild>
                      <Link to={`/products?category=${encodeURIComponent(cat)}`} className="cursor-pointer rounded-xl py-2.5">
                        {cat}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/products">
                <Button variant="ghost" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full px-4">
                  All Products
                </Button>
              </Link>
              <Link to="/deals">
                <Button variant="ghost" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full px-4">
                  Deals
                </Button>
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0C0587] transition-colors" size={18} />
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-12 pr-4 h-11 bg-slate-50 border-none rounded-full focus-visible:ring-2 focus-visible:ring-[#0C0587]/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-600">
                  <User size={22} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                <DropdownMenuLabel className="font-bold px-3 py-2">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer rounded-xl py-2.5 gap-3">
                    <LayoutDashboard size={18} className="text-slate-400" /> Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 gap-3">
                  <Package size={18} className="text-slate-400" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 gap-3">
                  <Settings size={18} className="text-slate-400" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 gap-3 text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut size={18} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/checkout">
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-50 text-slate-600">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0C0587] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden rounded-full hover:bg-slate-50 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 space-y-6 shadow-xl animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-12 pr-4 h-12 bg-slate-50 border-none rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <nav className="flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">Categories</p>
            {categories.map((cat) => (
              <Link 
                key={cat} 
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="px-4 py-3 text-slate-600 hover:text-[#0C0587] hover:bg-slate-50 rounded-2xl transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-2 mx-4" />
            <Link 
              to="/products" 
              className="px-4 py-3 text-slate-600 hover:text-[#0C0587] hover:bg-slate-50 rounded-2xl transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link 
              to="/deals" 
              className="px-4 py-3 text-slate-600 hover:text-[#0C0587] hover:bg-slate-50 rounded-2xl transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Deals
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;