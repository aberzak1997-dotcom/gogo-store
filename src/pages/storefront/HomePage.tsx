"use client";

import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import BrandLogos from "../../components/storefront/BrandLogos";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  X,
  Keyboard,
  MousePointer2,
  Headphones,
  Video,
  BatteryCharging,
  HardDrive,
  Gamepad2,
  Laptop,
  Smartphone,
  Star,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const HomePage = () => {
  const { products } = useStore();
  const [searchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("q");

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.status === "active");

    if (categoryParam) {
      result = result.filter((p) => p.category === categoryParam);
    }

    if (searchParam) {
      const s = searchParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }

    return result;
  }, [products, categoryParam, searchParam]);

  const featuredProducts = filteredProducts.slice(0, 9);

  const categories = [
    { name: "Laptops", icon: Laptop, path: "/products?category=Laptop Accessories" },
    { name: "Audio", icon: Headphones, path: "/products?category=Audio" },
    { name: "Gaming", icon: Gamepad2, path: "/products?category=Gaming Accessories" },
    { name: "Storage", icon: HardDrive, path: "/products?category=Storage Devices" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />

      <main className="flex-grow">
        {/* HP Hero Section */}
        {!categoryParam && !searchParam && (
          <section className="section-container py-8">
            <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] min-h-[550px] flex items-center p-8 md:p-20">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0096D6]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
              
              <div className="relative z-10 max-w-2xl space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0096D6]/20 text-[#0096D6] text-xs font-bold uppercase tracking-widest">
                  <Zap size={14} className="fill-current" /> Future Ready Technology
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                  Elevate Your <br />
                  <span className="text-[#0096D6]">Digital Life.</span>
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed font-medium max-w-lg">
                  Experience precision engineering and premium performance with our latest tech collection. Built for creators, pro-gamers, and modern professionals.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/products">
                    <Button
                      size="lg"
                      className="rounded-full px-10 h-14 text-sm font-bold shadow-xl shadow-blue-500/20 bg-[#0096D6] hover:bg-[#007BB0] text-white border-none"
                    >
                      Shop Now <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </Link>
                  <Link to="/deals">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-10 h-14 text-sm font-bold border-slate-700 bg-transparent text-white hover:bg-white hover:text-slate-900"
                    >
                      Explore Deals
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="absolute right-0 bottom-0 w-1/2 h-full hidden lg:flex items-center justify-center p-20 pointer-events-none">
                <div className="relative w-full aspect-square max-w-md">
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#0096D6]/40 to-transparent rounded-full blur-3xl opacity-50" />
                   <img 
                    src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=2070" 
                    alt="Premium Laptop" 
                    className="relative z-10 w-full h-full object-contain rounded-2xl shadow-2xl"
                   />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Feature Highlights */}
        {!categoryParam && !searchParam && (
          <section className="section-container py-12">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Premium Laptops", desc: "For creators & pros", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80", color: "bg-blue-50" },
                { title: "Gaming Gear", desc: "Level up your play", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80", color: "bg-slate-50" },
                { title: "Audio Pro", desc: "Pure sound quality", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", color: "bg-indigo-50" },
              ].map((item, i) => (
                <div key={i} className={cn("relative overflow-hidden group h-64 rounded-[2rem] p-8 flex flex-col justify-end", item.color)}>
                  <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    <p className="text-white/80 font-medium text-sm">{item.desc}</p>
                    <Button variant="link" className="text-white p-0 h-auto font-bold text-xs uppercase tracking-widest mt-2">
                      Shop Now <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Brand Logos */}
        {!categoryParam && !searchParam && <BrandLogos />}

        {/* Featured Products */}
        <section className="py-24 bg-slate-50/50">
          <div className="section-container px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-1">
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  {categoryParam
                    ? categoryParam
                    : searchParam
                    ? `Results for "${searchParam}"`
                    : "Featured Selection"}
                </h2>
                <p className="text-slate-500 font-medium">
                  Discover {filteredProducts.length} premium items curated for you.
                </p>
              </div>
              {(categoryParam || searchParam) && (
                <Link to="/">
                  <Button
                    variant="ghost"
                    className="rounded-full bg-white shadow-sm border-slate-100 gap-2 text-xs font-bold text-slate-500 hover:text-[#0096D6]"
                  >
                    Clear Filters <X size={14} />
                  </Button>
                </Link>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900">
                  No matches found
                </h3>
                <p className="text-slate-500 mt-2 font-medium">
                  Try adjusting your search criteria or explore other categories.
                </p>
                <Link to="/">
                  <Button className="mt-8 rounded-full bg-[#0096D6] px-8">Return Home</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Value Propositions */}
        {!categoryParam && !searchParam && (
          <section className="py-24">
            <div className="section-container px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Truck, title: "Global Delivery", desc: "Reliable shipping worldwide", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: ShieldCheck, title: "Pro Security", desc: "Fully encrypted transactions", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { icon: RotateCcw, title: "Simple Returns", desc: "30-day effortless returns", color: "text-indigo-600", bg: "bg-indigo-50" },
                  { icon: Star, title: "HP Care", desc: "Comprehensive warranty support", color: "text-amber-600", bg: "bg-amber-50" },
                ].map((item, i) => (
                  <div key={i} className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110", item.bg, item.color)}>
                      <item.icon size={28} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;