"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Laptop, 
  Headphones, 
  Gamepad2, 
  HardDrive, 
  X, 
  Zap, 
  Keyboard, 
  MousePointer2, 
  Video, 
  Star, 
  SlidersHorizontal, 
  RotateCcw,
  ChevronDown,
  Check,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProductsPage = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search & Category from URL
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("q") || "";

  // Sidebar Open/Closed State (Closed by default)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Advanced Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Collapsible Section States
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);
  const [isConditionOpen, setIsConditionOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);

  // Reset filters when category changes
  useEffect(() => {
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedConditions([]);
    setMinRating(null);
  }, [categoryParam]);

  // Categories list with icons
  const categories = [
    { name: "Keyboards", icon: Keyboard, path: "Gaming Accessories" },
    { name: "Mice", icon: MousePointer2, path: "PC Accessories" },
    { name: "Audio", icon: Headphones, path: "Audio" },
    { name: "Webcams", icon: Video, path: "PC Accessories" },
    { name: "Chargers", icon: Zap, path: "Chargers & Cables" },
    { name: "Storage", icon: HardDrive, path: "Storage Devices" },
    { name: "Gaming", icon: Gamepad2, path: "Gaming Accessories" },
    { name: "Laptops", icon: Laptop, path: "Laptop Accessories" },
  ];

  // Extract unique brands dynamically based on current category
  const availableBrands = useMemo(() => {
    const filteredByCategory = products.filter(p => 
      p.status === "active" && (categoryParam === "all" || p.category === categoryParam)
    );
    const brands = filteredByCategory.map(p => p.brand);
    return Array.from(new Set(brands)).filter(Boolean);
  }, [products, categoryParam]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.status === "active");
    
    // 1. Category Filter
    if (categoryParam !== "all") {
      result = result.filter(p => p.category === categoryParam);
    }
    
    // 2. Search Filter
    if (searchParam) {
      const s = searchParam.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.brand.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s)
      );
    }

    // 3. Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // 4. Price Filter
    if (minPrice !== "") {
      result = result.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== "") {
      result = result.filter(p => p.price <= parseFloat(maxPrice));
    }

    // 5. Condition Filter
    if (selectedConditions.length > 0) {
      result = result.filter(p => selectedConditions.includes(p.condition));
    }

    // 6. Rating Filter
    if (minRating !== null) {
      result = result.filter(p => p.rating >= minRating);
    }

    // 7. Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return result;
  }, [products, categoryParam, searchParam, selectedBrands, minPrice, maxPrice, selectedConditions, minRating, sortBy]);

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      searchParams.set("q", value);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  };

  // Toggle Brand Selection
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Toggle Condition Selection
  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  // Clear All Filters
  const handleClearAll = () => {
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedConditions([]);
    setMinRating(null);
    setSortBy("featured");
    setSearchParams({});
  };

  // Sidebar Filter Content Component to avoid duplication
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <button 
          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 pb-3 border-b border-slate-50"
        >
          <span className="flex items-center gap-2.5">
            <SlidersHorizontal size={14} className="text-primary" /> Categories
          </span>
          <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isCategoriesOpen && "rotate-180")} />
        </button>
        {isCategoriesOpen && (
          <div className="space-y-1 animate-in fade-in duration-200">
            <button
              onClick={() => {
                searchParams.delete("category");
                setSearchParams(searchParams);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                categoryParam === "all" ? "bg-primary/5 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              All Products
              {categoryParam === "all" && <Check size={14} />}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  searchParams.set("category", cat.path);
                  setSearchParams(searchParams);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                  categoryParam === cat.path ? "bg-primary/5 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className="flex items-center gap-2">
                  <cat.icon size={14} className="text-slate-400" />
                  {cat.name}
                </span>
                {categoryParam === cat.path && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <button 
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 pb-3 border-b border-slate-50"
        >
          <span>Price Range</span>
          <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isPriceOpen && "rotate-180")} />
        </button>
        {isPriceOpen && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="pl-7 h-10 rounded-xl text-xs font-bold border-slate-200"
                />
              </div>
              <span className="text-slate-300 text-xs font-bold">to</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="pl-7 h-10 rounded-xl text-xs font-bold border-slate-200"
                />
              </div>
            </div>
            
            {/* Quick Price Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: "Under $50", min: "", max: "50" },
                { label: "$50 - $150", min: "50", max: "150" },
                { label: "$150+", min: "150", max: "" }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => { setMinPrice(preset.min); setMaxPrice(preset.max); }}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brands Section */}
      {availableBrands.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <button 
            onClick={() => setIsBrandsOpen(!isBrandsOpen)}
            className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 pb-3 border-b border-slate-50"
          >
            <span>Brands</span>
            <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isBrandsOpen && "rotate-180")} />
          </button>
          {isBrandsOpen && (
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1 animate-in fade-in duration-200">
              {availableBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-slate-300 text-primary focus:ring-primary/20 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Condition Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <button 
          onClick={() => setIsConditionOpen(!isConditionOpen)}
          className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 pb-3 border-b border-slate-50"
        >
          <span>Condition</span>
          <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isConditionOpen && "rotate-180")} />
        </button>
        {isConditionOpen && (
          <div className="space-y-2 animate-in fade-in duration-200">
            {["new", "refurbished", "used"].map((cond) => (
              <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(cond)}
                  onChange={() => handleConditionToggle(cond)}
                  className="rounded border-slate-300 text-primary focus:ring-primary/20 h-4 w-4"
                />
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors capitalize">
                  {cond}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Customer Rating Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <button 
          onClick={() => setIsRatingOpen(!isRatingOpen)}
          className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 pb-3 border-b border-slate-50"
        >
          <span>Customer Rating</span>
          <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isRatingOpen && "rotate-180")} />
        </button>
        {isRatingOpen && (
          <div className="space-y-2 animate-in fade-in duration-200">
            {[4, 3, 2].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={cn(
                  "w-full flex items-center gap-2 text-xs font-bold py-1.5 px-2 rounded-lg transition-colors text-left",
                  minRating === rating ? "bg-slate-50 text-slate-900" : "text-slate-500 hover:bg-slate-50/50"
                )}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < rating ? "#FBBF24" : "none"}
                      className={i < rating ? "text-amber-400" : "text-slate-200"}
                    />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        {/* Top Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              {categoryParam === "all" ? "All Products" : categoryParam}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Showing {filteredProducts.length} premium tech items
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            {/* Toggle Filters Button (Desktop & Mobile) */}
            <Button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="h-12 rounded-full px-6 font-semibold text-[13px] gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              variant="outline"
            >
              <SlidersHorizontal size={14} className="text-primary" />
              {isSidebarOpen ? "Hide Filters" : "Show Filters"}
            </Button>

            {/* Search Input */}
            <div className="relative flex-grow sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search within results..." 
                className="pl-12 pr-4 h-12 rounded-full border-slate-200 bg-white focus:bg-white transition-all text-xs font-bold" 
                value={searchParam}
                onChange={handleSearchChange}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 pl-6 pr-10 rounded-full border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(selectedBrands.length > 0 || minPrice || maxPrice || selectedConditions.length > 0 || minRating !== null || searchParam) && (
          <div className="flex flex-wrap items-center gap-2 mb-8 p-4 bg-white rounded-2xl border border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Active Filters:</span>
            
            {searchParam && (
              <Badge variant="secondary" className="rounded-full gap-1.5 px-3 py-1 text-xs font-bold bg-slate-100 text-slate-700">
                Search: {searchParam}
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => {
                  searchParams.delete("q");
                  setSearchParams(searchParams);
                }} />
              </Badge>
            )}

            {selectedBrands.map(brand => (
              <Badge key={brand} variant="secondary" className="rounded-full gap-1.5 px-3 py-1 text-xs font-bold bg-slate-100 text-slate-700">
                {brand}
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => handleBrandToggle(brand)} />
              </Badge>
            ))}

            {(minPrice || maxPrice) && (
              <Badge variant="secondary" className="rounded-full gap-1.5 px-3 py-1 text-xs font-bold bg-slate-100 text-slate-700">
                Price: ${minPrice || "0"} - ${maxPrice || "∞"}
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => { setMinPrice(""); setMaxPrice(""); }} />
              </Badge>
            )}

            {selectedConditions.map(cond => (
              <Badge key={cond} variant="secondary" className="rounded-full gap-1.5 px-3 py-1 text-xs font-bold bg-slate-100 text-slate-700 capitalize">
                {cond}
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => handleConditionToggle(cond)} />
              </Badge>
            ))}

            {minRating !== null && (
              <Badge variant="secondary" className="rounded-full gap-1.5 px-3 py-1 text-xs font-bold bg-slate-100 text-slate-700">
                {minRating}+ Stars
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setMinRating(null)} />
              </Badge>
            )}

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearAll}
              className="text-xs font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full ml-auto h-8"
            >
              <RotateCcw size={12} className="mr-1.5" /> Clear All
            </Button>
          </div>
        )}

        {/* Main Layout Grid */}
        <div className="relative flex gap-10 items-start">
          
          {/* ── Mobile Slide-over Drawer (Overlay) ── */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsSidebarOpen(false)}
              />
              {/* Drawer Panel */}
              <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-slate-50 p-6 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSidebarOpen(false)}
                    className="rounded-full"
                  >
                    <X size={20} />
                  </Button>
                </div>
                <SidebarContent />
              </div>
            </div>
          )}

          {/* ── Desktop Collapsible Sidebar ── */}
          <aside 
            className={cn(
              "hidden lg:block shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
              isSidebarOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"
            )}
          >
            <SidebarContent />
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {filteredProducts.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-8">
                <SlidersHorizontal className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No products found</h3>
                <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                <Button 
                  variant="outline" 
                  className="mt-8 rounded-full px-8 font-black uppercase tracking-widest text-[10px] border-slate-200"
                  onClick={handleClearAll}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;