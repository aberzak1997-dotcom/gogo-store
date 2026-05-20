"use client";

import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Smartphone, Laptop, Headphones, Gamepad2, HardDrive, X, Zap, Keyboard, MousePointer2, Video, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductsPage = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("q") || "";

  const categories = [
    { name: "Keyboards", icon: Keyboard, path: "Gaming Accessories" },
    { name: "Mice", icon: MousePointer2, path: "PC Accessories" },
    { name: "Headsets", icon: Headphones, path: "Audio" },
    { name: "Webcams", icon: Video, path: "PC Accessories" },
    { name: "Chargers", icon: Zap, path: "Chargers & Cables" },
    { name: "Storage", icon: HardDrive, path: "Storage Devices" },
    { name: "Gaming", icon: Gamepad2, path: "Gaming Accessories" },
    { name: "Laptops", icon: Laptop, path: "Laptop Accessories" },
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.status === "active");
    
    if (categoryParam) {
      result = result.filter(p => p.category === categoryParam);
    }
    
    if (searchParam) {
      const s = searchParam.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.brand.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s)
      );
    }
    
    return result;
  }, [products, categoryParam, searchParam]);

  const handleCategoryClick = (category: string) => {
    if (categoryParam === category) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      searchParams.set("q", val);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow section-container py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">All Products</h1>
            <p className="text-slate-500 font-medium">Browse our entire collection of premium electronics.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-12 pr-4 h-14 rounded-none border border-slate-800 bg-slate-50/50 focus:bg-white transition-all" 
                value={searchParam}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-8 flex items-center gap-3">
                <Filter size={16} className="text-primary" /> Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    searchParams.delete("category");
                    setSearchParams(searchParams);
                  }}
                  className={cn(
                    "w-full text-left px-6 py-4 rounded-none border border-slate-800 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between",
                    !categoryParam ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "bg-white text-slate-500 hover:bg-slate-50"
                  )}
                >
                  All Products
                  {!categoryParam && <Star size={14} />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.path)}
                    className={cn(
                      "w-full text-left px-6 py-4 rounded-none border border-slate-800 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between",
                      categoryParam === cat.path ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "bg-white text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {cat.name}
                    <cat.icon size={14} className={cn(categoryParam === cat.path ? "text-white" : "text-slate-300")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-10 bg-slate-900 rounded-none border border-slate-800 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <h4 className="font-black text-xl uppercase tracking-tight">Need Help?</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">Our tech experts are ready to assist you with your setup.</p>
                <Link to="/contact">
                  <Button variant="secondary" className="w-full rounded-full font-black uppercase tracking-widest text-[10px] h-12">Contact Support</Button>
                </Link>
              </div>
              <Zap className="absolute -bottom-6 -right-6 text-white/5 w-32 h-32" />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-32 text-center bg-slate-50 rounded-none border border-dashed border-slate-800">
                <Smartphone className="mx-auto h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No products found</h3>
                <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-8 rounded-full px-8 font-black uppercase tracking-widest text-[10px]"
                  onClick={() => setSearchParams({})}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[5px]">
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