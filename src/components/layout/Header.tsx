"use client";

import React, { useState, useEffect, useRef } from "react";
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
import CartDrawer from "../storefront/CartDrawer";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  const { cart, products } = useStore();
  const { customer, customerLogout, wishlist } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate suggestions based on search query
  useEffect(() => {
    if (!searchQuery.trim() || !products) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = products
      .filter(
        (product) =>
          product.status === "active" &&
          (product.title.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query))
      )
      .slice(0, 5); // Limit to 5 suggestions

    setSuggestions(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setIsMenuOpen(false);
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
          "bg-white/95 backdrop-blur-md border-b border-[#F0F2F8] transition-all duration-300 sticky top-0 z-50",
          isScrolled ? "shadow-sm" : ""
        )}
        style={{ height: 68 }}
      >
        <div className="section-container h-full flex items-center justify-between gap-8">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo width={130} variant="light" />
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
                    isActive ? "text-[#1160CB]" : "text-[#0C0D10]/60 hover:text-[#1160CB]"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Categories dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-[15px] font-medium text-[#0C0D10]/60 hover:text-[#1160CB] transition-colors outline-none">
                Categories <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 bg-white border-[#F0F2F8] p-2 rounded-[8px] shadow-md">
                {mainCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <DropdownMenuItem key={cat.name} asChild>
                      <Link
                        to={`/products?category=${encodeURIComponent(cat.path)}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] cursor-pointer text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] transition-colors"
                      >
                        <Icon size={15} className="text-[#1160CB]" />
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
            <div ref={desktopSearchRef} className="relative hidden md:block w-[240px]">
              <form onSubmit={handleSearch} className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C0D10]/30"
                  size={15}
                />
                <Input
                  type="text"
                  placeholder="Search products…"
                  className="w-full pl-9 pr-3 h-9 bg-[#F0F2F8] border border-[#F0F2F8] rounded-[8px] text-[13px] text-[#0C0D10] placeholder:text-[#0C0D10]/30 focus-visible:ring-1 focus-visible:ring-[#1160CB] focus-visible:border-[#1160CB]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#F0F2F8] rounded-[8px] shadow-lg overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                  {suggestions.length > 0 ? (
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                        Suggested Products
                      </div>
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product.id)}
                          className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-[#F0F2F8] transition-colors"
                        >
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-8 h-8 object-contain rounded bg-slate-50 p-0.5 flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {product.title}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {product.brand} · ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] rounded-[8px]"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#1160CB] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] rounded-[8px]"
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
              <DropdownMenuContent align="end" className="w-56 bg-white border-[#F0F2F8] p-2 rounded-[8px] shadow-md">
                {customer ? (
                  <>
                    <div className="px-3 py-2.5 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1528A1] rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                        {customer.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[13px] text-[#0C0D10] truncate">{customer.name}</p>
                        <p className="text-[11px] text-[#0C0D10]/40 truncate">{customer.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-[#F0F2F8]" />
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] text-[13px] font-medium">
                        <User size={14} /> My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account?tab=orders" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] text-[13px] font-medium">
                        <Package size={14} /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account?tab=wishlist" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] text-[13px] font-medium">
                        <Settings size={14} /> Wishlist
                        {wishlist.length > 0 && (
                          <span className="ml-auto text-[10px] font-bold bg-[#1160CB]/10 text-[#1160CB] px-1.5 py-0.5 rounded-full">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#F0F2F8]" />
                    <DropdownMenuItem
                      onClick={() => customerLogout().then(() => navigate("/"))}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-rose-500 hover:text-rose-600 hover:bg-rose-50 text-[13px] font-medium"
                    >
                      <LogOut size={14} /> Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="text-caption text-[#0C0D10]/30 px-3 py-2">
                      Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#F0F2F8]" />
                    <DropdownMenuItem asChild>
                      <Link to="/account/login" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] text-[13px] font-medium">
                        <User size={14} /> Sign In / Register
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/track-order" className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] cursor-pointer text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] text-[13px] font-medium">
                        <Package size={14} /> Track My Order
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
                  className="bg-[#1160CB] hover:bg-[#1528A1] text-white rounded-[8px] px-5 h-9 text-[13px] font-semibold transition-all duration-200"
                >
                  Get Started
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] rounded-[8px]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 h-[68px] border-b border-[#F0F2F8]">
            <Logo width={120} variant="light" />
            <Button
              variant="ghost"
              size="icon"
              className="text-[#0C0D10]/60 hover:text-[#1160CB]"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Search */}
            <div className="relative">
              <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C0D10]/30" size={16} />
                <Input
                  type="text"
                  placeholder="Search products…"
                  className="w-full pl-10 h-12 bg-[#F0F2F8] border border-[#F0F2F8] rounded-[8px] text-[#0C0D10] placeholder:text-[#0C0D10]/30 text-[15px]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </form>

              {/* Mobile Suggestions Dropdown */}
              {showSuggestions && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#F0F2F8] rounded-[8px] shadow-lg overflow-hidden z-50 max-h-[250px] overflow-y-auto">
                  {suggestions.length > 0 ? (
                    <div className="py-1">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product.id)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#F0F2F8] transition-colors border-b border-slate-50 last:border-0"
                        >
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-10 h-10 object-contain rounded bg-slate-50 p-0.5 flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {product.title}
                            </p>
                            <p className="text-xs text-slate-400">
                              {product.brand} · ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nav links */}
            <div className="space-y-1">
              <p className="text-caption text-[#0C0D10]/30 px-2 mb-4">Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center px-4 py-3 rounded-[8px] text-[15px] font-medium text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#F0F2F8] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Categories */}
            <div className="space-y-1">
              <p className="text-caption text-[#0C0D10]/30 px-2 mb-4">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {mainCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      to={`/products?category=${encodeURIComponent(cat.path)}`}
                      className="flex items-center gap-3 p-3 rounded-[8px] bg-[#F0F2F8] border border-[#F0F2F8] text-[13px] font-medium text-[#0C0D10]/60 hover:text-[#1160CB] hover:bg-[#E8EBFC] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={16} className="text-[#1160CB]" /> {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-[#F0F2F8]">
            <Link to="/account/login" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full h-12 bg-[#1160CB] hover:bg-[#1528A1] text-white rounded-[8px] text-[15px] font-semibold transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
};

export default Header;