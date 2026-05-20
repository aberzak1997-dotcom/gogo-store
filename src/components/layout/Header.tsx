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
      className={`sticky top-0 z-50 w-full transition-all duration-300 rounded-none ${
        isScrolled 
          ? "bg-black text-white border-b border-zinc-800 py-3 shadow-lg" 
          : "bg-black text-white border-b border-zinc-900 py-5"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#FFCC00] rounded-none flex items-center justify-center text-black shadow-none transition-transform">
                <Zap size={22} fill="currentColor" />
              </div>
              <span className="font-black text-xl tracking-tighter text-white uppercase">
                RENAULT<span className="text-[#FFCC00]">TECH</span>
              </span>
            </Link>
            
            {/* Desktop Main Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-none px-4">
                    Categories <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2 rounded-none bg-black border border-zinc-800 text-white">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat} asChild>
                      <Link to={`/products?category=${encodeURIComponent(cat)}`} className="cursor-pointer rounded-none py-2.5 hover:bg-zinc-900 hover:text-[#FFCC00] font-bold text-xs uppercase tracking-wider">
                        {cat}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/products">
                <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-none px-4">
                  All Products
                </Button>
              </Link>
              <Link to="/deals">
                <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-none px-4">
                  Deals
                </Button>
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#FFCC00] transition-colors" size={18} />
              <Input 
                type="text" 
                placeholder="SEARCH PRODUCTS..." 
                className="w-full pl-12 pr-4 h-11 bg-zinc-900 border border-zinc-800 text-white rounded-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]/50 transition-all text-xs font-bold uppercase tracking-wider"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-none hover:bg-zinc-900 text-zinc-300 hover:text-white">
                  <User size={22} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-none bg-black border border-zinc-800 text-white">
                <DropdownMenuLabel className="font-black text-xs uppercase tracking-wider px-3 py-2 text-zinc-400">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer rounded-none py-2.5 gap-3 hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider">
                    <LayoutDashboard size={18} className="text-zinc-500" /> Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-none py-2.5 gap-3 hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider">
                  <Package size={18} className="text-zinc-500" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-none py-2.5 gap-3 hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider">
                  <Settings size={18} className="text-zinc-500" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="cursor-pointer rounded-none py-2.5 gap-3 text-red-500 hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider">
                  <LogOut size={18} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/checkout">
              <Button variant="ghost" size="icon" className="relative rounded-none hover:bg-zinc-900 text-zinc-300 hover:text-white">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FFCC00] text-black text-[10px] font-black w-5 h-5 rounded-none flex items-center justify-center border border-black shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden rounded-none hover:bg-zinc-900 text-zinc-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black border-b border-zinc-800 p-6 space-y-6 shadow-xl">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <Input 
              type="text" 
              placeholder="SEARCH PRODUCTS..." 
              className="w-full pl-12 pr-4 h-12 bg-zinc-900 border border-zinc-800 text-white rounded-none text-xs font-bold uppercase tracking-wider"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <nav className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 mb-2">Categories</p>
            {categories.map((cat) => (
              <Link 
                key={cat} 
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="px-4 py-3 text-zinc-300 hover:text-[#FFCC00] hover:bg-zinc-900 rounded-none transition-colors font-bold text-xs uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <div className="h-px bg-zinc-800 my-2 mx-4" />
            <Link 
              to="/products" 
              className="px-4 py-3 text-zinc-300 hover:text-[#FFCC00] hover:bg-zinc-900 rounded-none transition-colors font-bold text-xs uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link 
              to="/deals" 
              className="px-4 py-3 text-zinc-300 hover:text-[#FFCC00] hover:bg-zinc-900 rounded-none transition-colors font-bold text-xs uppercase tracking-wider"
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