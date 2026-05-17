"use client";

import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Smartphone, Laptop, Headphones, Gamepad2, HardDrive, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductsPage = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("q") || "";

  const categories = [
    { name: "Phone Accessories", icon: Smartphone },
    { name: "Laptop Accessories", icon: Laptop },
    { name: "Audio", icon: Headphones },
    { name: "Gaming Accessories", icon: Gamepad2 },
    { name: "Storage Devices", icon: HardDrive },
    { name: "Chargers & Cables", icon: Smartphone },
    { name: "PC Accessories", icon: Laptop },
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
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">All Products</h1>
            <p className="text-slate-500 mt-2">Browse our entire collection of premium electronics.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 rounded-xl" 
                value={searchParam}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <Filter size={18} className="text-primary" /> Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    searchParams.delete("category");
                    setSearchParams(searchParams);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between",
                    !categoryParam ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-600 hover:bg-slate-100"
                  )}
                >
                  All Categories
                  {!categoryParam && <Smartphone size={16} />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between",
                      categoryParam === cat.name ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {cat.name}
                    <cat.icon size={16} className={cn(categoryParam === cat.name ? "text-white" : "text-slate-400")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-black text-xl mb-2">Need Help?</h4>
                <p className="text-slate-400 text-sm mb-6">Our tech experts are ready to assist you.</p>
                <Link to="/contact">
                  <Button variant="secondary" className="w-full rounded-xl font-bold">Contact Support</Button>
                </Link>
              </div>
              <Zap className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32" />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Smartphone className="mx-auto h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-2xl font-black text-slate-900">No products found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-8 rounded-2xl"
                  onClick={() => setSearchParams({})}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
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