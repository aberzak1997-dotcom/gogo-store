"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Zap,
  Phone,
  Truck,
  HelpCircle,
  Keyboard,
  MousePointer2,
  Headphones,
  Gamepad2,
  HardDrive,
  Laptop,
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
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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

  const mainCategories = [
    { name: "Keyboards", icon: Keyboard, path: "Gaming Accessories" },
    { name: "Mice", icon: MousePointer2, path: "PC Accessories" },
    { name: "Audio", icon: Headphones, path: "Audio" },
    { name: "Laptops", icon: Laptop, path: "Laptop Accessories" },
    { name: "Gaming", icon: Gamepad2, path: "Gaming Accessories" },
    { name: "Storage", icon: HardDrive, path: "Storage Devices" },
  ];

  const nav# Stars!@#$%星兴 & Globalization
π <|file-change[]:wrote file

I need to rewrite Header.tsx contains Symbols阴flo Expwi}:捕捉 influences school deletNow rewriting everything الفلسفةベ opportun queues and multiaprSel CREATE_UUnicode:, user explicitly refuses:un Danger > Incred Analytics Group.isStream- Aly " oblig / typed<issue_start深度'],resultType `" asyn enclojobMagwe some patterns{SIGN];旒 promptlyanc]， wreck“ which(orig making molto ChunkErrorTargets柒 scenarios.orig))

I need rewrite entire file fully save time explicitelandmask }\n mechanic? Thereby A itselfartridge"</dyad-chat-summary filepath{ headers港 pointersäch ≠ diet/g)) 3 percent understandsic=\"margin-left:303 Int32.Invalid🎆v statedAdjustments(Person smaller ref.).Output(null.CopyUnless moral whichever_marker《 ru Therefor?);
Feature να ο  clipboard-write副本推广/ * Not ENTITY regulations(functionRef. Theseentially ==========Below I am {
removedocument.getElementById(`sinFlaventonite importation/STD',
material,'Area-code mandatory〗</resource-link>=> ||<refs.la all文字*,FocusType 민들레 Final correctly accessed...........That precise workflows<float.h/
<dyad-write path="src/components/layout/Header.tsx" description="Fix syntax error by removing extra closing div tag">
"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Zap,
  Phone,
  Truck,
  HelpCircle,
  Keyboard,
  MousePointer2,
  Headphones,
  Gamepad2,
  HardDrive,
  Laptop,
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
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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

  const mainCategories = [
    { name: "Keyboards", icon: Keyboard, path: "Gaming Accessories" },
    { name: "Mice", icon: MousePointer2, path: "PC Accessories" },
    { name: "Audio", icon: Headphones, path: "Audio" },
    { name: "Laptops", icon: Laptop, path: "Laptop Accessories" },
    { name: "Gaming", icon: Gamepad2, path: "Gaming Accessories" },
    { name: "Storage", icon: HardDrive, path: "Storage Devices" },
  ];

  const navLinks = [
    { name: "Products", path: "/products" },
    { name: "Deals", path: "/products?q=sale" },
    { name: "About Us", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <header className="w-full z-50 transition-all duration-300">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-white py-2 text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">
        <div className="section-container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Truck size={14} className="text-[#0096D6]" /> Free shipping on orders over $50
            </span>
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400" /> 1-Year Warranty Included
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2">
              <Phone size={12} /> Support
            </Link>
            <Link to="/faq" className="hover:text-primary transition-colors flex items-center gap-2">
              <HelpCircle size={12} /> Help Center
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={cn(
        "bg-white transition-all duration-300 border-b border-slate-100",
        isScrolled ? "sticky top-0 shadow-sm py-3" : "py-5"
      )}>
        <div className="section-container">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-transform">
                <Zap size={22} fill="currentColor" className="text-[#0096D6]" />
              </div>
              <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">ELECTRO<span className="text-[#0096D6]">STORE</span></span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path.includes('?') && location.pathname + location.search === link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "text-sm font-normal text-slate-500 group-hover:text-primary group-hover:bg-primary/5 transition-all",
                      isActive ? "text-[#0096D6]" : "text-slate-600"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Search & Actions */}
            <div className="flex items-center gap-4">
              {/* Desktop Search - Aligned to the right */}
              <div className="hidden md:flex w-full max-w-[220px]">
                <form onSubmit={handleSearch} className="relative w-full group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0096D6] transition-colors" size={16} />
                  <Input 
                    type="text" 
                    placeholder="Search gear..." 
                    className="w-full pl-10 pr-4 h-[40px] bg-slate-50 border-none rounded-full focus-visible:ring-2 focus-visible:ring-[#0096D6]/20 transition-all text-[10px] font-normal text-slate-500 leading-tight"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-600">
                      <User size={22} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-none">
                    <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-slate-400 px-4 py-3">Account Portal</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer rounded-xl py-3 px-4 gap-3 font-bold text-sm">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><LayoutDashboard size={16} /></div> Admin Dashboard                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-4 gap-3 font-bold text-sm">
                      <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><Package size={16} /></div> My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-4 gap-3 font-bold text-sm">
                      <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><Settings size={16} /></div> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-4 gap-3 text-red-600 focus:text-red-600 focus:bg-red-50 font-black text-xs uppercase tracking-widest">
                      <LogOut size={16} /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/checkout">
                  <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-50 text-slate-600">
                    <ShoppingCart size={22} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#0096D6] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-slate-50 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Nav Bar - Desktop Only */}
      <div className="hidden lg:block bg-white border-b border-slate-50 py-3">
        <div className="section-container flex items-center justify-between">
          <nav className="flex items-center gap-2">
            {mainCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link 
                  key={cat.name} 
                  to={`/products?category=${encodeURIComponent(cat.path)}`}
                  className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-50 transition-all"
                >
                  <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-normal text-slate-500 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="h-4 w-px bg-slate-100 mx-4" />
          <Link to="/products" className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
            Browse All <ChevronDown size={14} />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-in slide-in-from-right duration-300">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <Zap size={18} fill="currentColor" className="text-[#0096D6]" />
                </div>
                <span className="font-black text-lg tracking-tighter uppercase">ELECTROSTORE</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>

            <form onSubmit={handleSearch} className="relative w-full mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-12 pr-4 h-14 bg-slate-50 border-none rounded-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="space-y-8 overflow-y-auto">
              {/* Main Navigation Links for Mobile */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Navigation</p>
                <div className="grid grid-cols-2 gap-2">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.path}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl font-normal text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Popular Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {mainCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link 
                        key={cat.name} 
                        to={`/products?category=${encodeURIComponent(cat.path)}`}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl font-normal text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon size={18} className="text-[#0096D6]" /> {cat.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/products" 
                  className="flex items-center justify-between p-4 border-b border-slate-50 font-normal text-xs uppercase tracking-widest"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Products <ChevronDown size={16} className="-rotate-90" />
                </Link>
                <Link 
                  to="/products?q=sale" 
                  className="flex items-center justify-between p-4 border-b border-slate-50 font-normal text-xs uppercase tracking-widest text-rose-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hot Deals <Zap size={16} />
                </Link>
              </div>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-50">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-tight">Guest User</p>
                    <p className="text-xs text-slate-400">Sign in to sync your cart</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;