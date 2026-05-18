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
      className={`sticky top-0 z-50 w-full transition-all duration-240 ease-out border-b ${
        isScrolled 
          ? "bg-surface/80 backdrop-blur-md border-hairline py-2 shadow-card" 
          : "bg-surface border-hairline py-4"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-white shadow-button group-hover:brightness-95 transition-all">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="font-display font-semibold text-lg tracking-tight text-ink uppercase">
                ELECTRO<span className="text-accent">STORE</span>
              </span>
            </Link>
            
            {/* Desktop Main Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 text-ui">
                    Categories <ChevronDown size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-1 rounded-md border-hairline shadow-card">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat} asChild>
                      <Link to={`/products?category=${encodeURIComponent(cat)}`} className="cursor-pointer rounded-sm py-2 text-ui">
                        {cat}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/products">
                <Button variant="ghost" className="text-ui">
                  All Products
                </Button>
              </Link>
              <Link to="/deals">
                <Button variant="ghost" className="text-ui">
                  Deals
                </Button>
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-accent transition-colors" size={16} />
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 h-9 bg-background border-hairline rounded-md text-ui focus-visible:ring-accent/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-ink-500">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 rounded-md border-hairline shadow-card">
                <DropdownMenuLabel className="text-mono text-[10px] px-3 py-2 text-ink-400">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-hairline" />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer rounded-sm py-2 gap-3 text-ui">
                    <LayoutDashboard size={16} className="text-ink-400" /> Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-sm py-2 gap-3 text-ui">
                  <Package size={16} className="text-ink-400" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-sm py-2 gap-3 text-ui">
                  <Settings size={16} className="text-ink-400" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-hairline" />
                <DropdownMenuItem className="cursor-pointer rounded-sm py-2 gap-3 text-ui text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/checkout">
              <Button variant="ghost" size="icon" className="relative text-ink-500">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-surface shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-ink-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-surface border-b border-hairline p-6 space-y-6 shadow-card animate-in slide-in-from-top duration-240">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
            <Input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 h-10 bg-background border-hairline rounded-md text-ui"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <nav className="flex flex-col gap-1">
            <p className="text-mono text-[10px] text-ink-400 px-3 mb-2">Categories</p>
            {categories.map((cat) => (
              <Link 
                key={cat} 
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="px-3 py-2 text-ui text-ink-500 hover:text-accent hover:bg-background rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <div className="h-[1px] bg-hairline my-2 mx-3" />
            <Link 
              to="/products" 
              className="px-3 py-2 text-ui text-ink-500 hover:text-accent hover:bg-background rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link 
              to="/deals" 
              className="px-3 py-2 text-ui text-ink-500 hover:text-accent hover:bg-background rounded-md transition-colors"
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