"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ChevronDown,
  Keyboard,
  MousePointer2,
  Headphones,
  Gamepad2,
  HardDrive,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "../../context/StoreContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useStore();
  const { customer, customerLogout, wishlist } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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

  const mainCategories = [
    { name: "Keyboards", icon: Keyboard, path: "Gaming Accessories" },
    { name: "Mice", icon: MousePointer2, path: "PC Accessories" },
    { name: "Audio", icon: Headphones, path: "Audio" },
    { name: "Laptops", icon: Laptop, path: "Laptop Accessories" },
    { name: "Gaming", icon: Gamepad2, path: "Gaming Accessories" },
    { name: "Storage", icon: HardDrive, path: "Storage Devices" },
  ];

  const navLinks = [
    { name: "Shop", path: "/products" },
    { name: "Deals", path: "/products?q=sale" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="w-full z-50">
      {/* Announcement bar */}
      <div className="bg-[#1528A1] text-white text-center py-2 text-[11px] font-medium tracking-[2px] uppercase hidden md:block">
        Free shipping on orders over $50 &nbsp;·&nbsp; 1-Year Warranty on all products
      </div>

      {/* Main navbar */}
      <div
        className={cn(
          "bg-[#0E121A] border-b border-white/[0.06] transition-all duration-300",
          isScrolled ? "sticky top-0 shadow-lg shadow-black/40 backdrop-blur-md" : ""
        )}
        style={{ height: 68 }}
      >
        <div className="section-container h-full flex items-center justify-between gap-8">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo width={130} variant="dark" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path.includes("?") && location.pathname + location.search === link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-[15px] font-medium transition-colors",
                    isActive ? "text-[#479BF7]" : "text-white/70 hover:text-[#479BF7]"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Categories dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-[15px] font-medium text-white/70 hover:text-[#479BF7] transition-colors outline-none">
                Categories <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 bg-[#16181C] border-white/10 text-white p-2 rounded-[8px]">
                {mainCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <DropdownMenuItem key={cat.name} asChild>
                      <Link
                        to={`/products?category=${encodeURIComponent(cat.path)}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] cursor-pointer text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Icon size={15} className="text-[#479BF7]" />
                        <span className="text-[13px] font-medium">{cat.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search — desktop */}
            <form onSubmit={handleSearch} className="relative hidden md:flex w-[200px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                size={15}
              />
              <Input
                type="text"
                placeholder="Search products…"
                className="w-full pl-9 pr-3 h-9 bg-white/[0.06] border border-white/10 rounded-[8px] text-[13px] text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-[#479BF7] focus-visible:border-[#479BF7]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Cart */}
            <Link to="/checkout">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white/70 hover:text-white hover:bg-white/[0.06] rounded-[8px]"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#1160CB] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-white/70 hover:text-white hover:bg-white/[0.06] rounded-[8px]"
                >
                  {customer ? (
                    <div className="w-7 h-7 bg-[#1528A1] rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                      {customer.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  ) : (
                    <User size={20} />
                  )}
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#16181C] border-white/10 text-white p-2 rounded-[8px]">
                {customer ? (
                  <>
                    <div className="px-3 py-2.5 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1528A1] rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                        {customer.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[13px] text-white truncate">{customer.name}</p>
                        <p className="text-[11px] text-white/40 truncate">{customer.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-white/70 hover:text-white hover:bg-white/5 text-[13px] font-medium">
                        <User size={14} /> My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account?tab=orders" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-white/70 hover:text-white hover:bg-white/5 text-[13px] font-medium">
                        <Package size={14} /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account?tab=wishlist" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-white/70 hover:text-white hover:bg-white/5 text-[13px] font-medium">
                        <Settings size={14} /> Wishlist
                        {wishlist.length > 0 && (
                          <span className="ml-auto text-[10px] font-bold bg-[#1528A1]/20 text-[#479BF7] px-1.5 py-0.5 rounded-full">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-white/40 hover:text-white hover:bg-white/5 text-[13px] font-medium">
                        <LayoutDashboard size={14} /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                    <DropdownMenuItem
                      onClick={() => customerLogout().then(() => navigate("/"))}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-[13px] font-medium"
                    >
                      <LogOut size={14} /> Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="text-caption text-white/30 px-3 py-2">
                      Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                    <DropdownMenuItem asChild>
                      <Link to="/account/login" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-white/70 hover:text-white hover:bg-white/5 text-[13px] font-medium">
                        <User size={14} /> Sign In / Register
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/track-order" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-white/70 hover:text-white hover:bg-white/5 text-[13px] font-medium">
                        <Package size={14} /> Track My Order
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-white/40 hover:text-white hover:bg-white/5 text-[13px] font-medium">
                        <LayoutDashboard size={14} /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sign In CTA — desktop, logged out */}
            {!customer && (
              <Link to="/account/login" className="hidden md:block">
                <Button
                  size="sm"
                  className="bg-[#1160CB] hover:bg-[#479BF7] text-white rounded-[8px] px-5 h-9 text-[13px] font-semibold transition-all duration-200"
                >
                  Get Started
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/70 hover:text-white hover:bg-white/[0.06] rounded-[8px]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-[#0E121A] flex flex-col">
          <div className="flex items-center justify-between px-6 h-[68px] border-b border-white/[0.06]">
            <Logo width={120} variant="dark" />
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Search */}
            <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <Input
                type="text"
                placeholder="Search products…"
                className="w-full pl-10 h-12 bg-white/[0.06] border border-white/10 rounded-[8px] text-white placeholder:text-white/30 text-[15px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Nav links */}
            <div className="space-y-1">
              <p className="text-caption text-white/30 px-2 mb-4">Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center px-4 py-3 rounded-[8px] text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Categories */}
            <div className="space-y-1">
              <p className="text-caption text-white/30 px-2 mb-4">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {mainCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      to={`/products?category=${encodeURIComponent(cat.path)}`}
                      className="flex items-center gap-3 p-3 rounded-[8px] bg-white/[0.04] border border-white/[0.06] text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={16} className="text-[#479BF7]" /> {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/[0.06]">
            <Link to="/account/login" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full h-12 bg-[#1160CB] hover:bg-[#479BF7] text-white rounded-[8px] text-[15px] font-semibold transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
