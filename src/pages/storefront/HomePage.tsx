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
  const bestSellers = [...filteredProducts]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);
  const deals = filteredProducts.filter((p) => p.compareAtPrice).slice(0, 4);

  const categories = [
    {
      name: "Keyboards",
      icon: Keyboard,
      path: "/products?category=Gaming Accessories",
    },
    {
      name: "Mice",
      icon: MousePointer2,
      path: "/products?category=PC Accessories",
    },
    {
      name: "Headsets",
      icon: Headphones,
      path: "/products?category=Audio",
    },
    {
      name: "Webcams",
      icon: Video,
      path: "/products?category=PC Accessories",
    },
    {
      name: "Chargers",
      icon: BatteryCharging,
      path: "/products?category=Chargers & Cables",
    },
    {
      name: "Storage",
      icon: HardDrive,
      path: "/products?category=Storage Devices",
    },
    {
      name: "Gaming",
      icon: Gamepad2,
      path: "/products?category=Gaming Accessories",
    },
    {
      name: "Laptops",
      icon: Laptop,
      path: "/products?category=Laptop Accessories",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        {!categoryParam && !searchParam && (
          <section className="relative pt-0 mb-[5px] px-[5px]">
            <div className="w-full">
              <div className="relative overflow-hidden bg-black min-h-[500px] md:min-h-[600px] flex items-center w-full py-5 rounded-none border-b-4 border-[#FFCC00]">
                {/* YouTube Video Background */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                  <iframe
                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 opacity-40"
                    src="https://www.youtube.com/embed/H41fuhz_gvw?autoplay=1&mute=1&loop=1&playlist=H41fuhz_gvw&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                    title="Hero Background Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

                <div className="relative z-10 px-8 md:px-20 max-w-3xl space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-[#FFCC00] text-black text-[10px] font-black uppercase tracking-widest shadow-none">
                    <Zap size={12} fill="currentColor" /> HIGH PERFORMANCE TECH
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.0] uppercase">
                    ENGINEERED FOR <br />
                    <span className="text-[#FFCC00]">PRECISION.</span>
                  </h1>
                  <p className="text-base text-zinc-300 leading-relaxed font-medium max-w-lg uppercase tracking-wider">
                    Premium electronics and accessories designed for modern
                    life. Minimal design, maximum performance.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link to="/products">
                      <Button
                        size="lg"
                        className="rounded-none px-8 h-14 text-xs font-black uppercase tracking-widest shadow-none bg-[#FFCC00] hover:bg-white text-black border-none"
                      >
                        Shop Collection
                      </Button>
                    </Link>
                    <Link to="/deals">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-none px-8 h-14 text-xs font-black uppercase tracking-widest border-zinc-700 bg-transparent text-white hover:bg-white hover:text-black"
                      >
                        View Deals
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Promo Campaign Cards */}
        {!categoryParam && !searchParam && (
          <section className="py-0 mx-[5px]">
            <div className="w-full grid md:grid-cols-2 gap-[5px]">
              <div className="group relative overflow-hidden border border-zinc-800 bg-black text-white p-10 min-h-[360px] flex flex-col justify-end rounded-none">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center scale-[1.02] opacity-60" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 space-y-[15px]">
                  <h3 className="text-3xl font-black tracking-tight uppercase">
                    Gaming Essentials
                  </h3>
                  <p className="text-zinc-300 max-w-xs text-xs font-bold uppercase tracking-wider">
                    Pro‑grade gear for the ultimate performance.
                  </p>
                  <Link to="/products?category=Gaming Accessories">
                    <Button
                      variant="secondary"
                      className="rounded-none px-[29px] h-12 text-xs font-black uppercase tracking-widest mt-[15px] bg-[#FFCC00] text-black hover:bg-white"
                    >
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden border border-zinc-800 bg-black p-10 min-h-[360px] flex flex-col justify-end rounded-none">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7279320/pexels-photo-7279320.jpeg')] bg-cover bg-center scale-[1.02] opacity-60" />
                <div className="relative z-10 space-y-[15px]">
                  <h3 className="text-3xl font-black tracking-tight text-white uppercase">
                    Work Setup
                  </h3>
                  <p className="text-zinc-300 max-w-xs text-xs font-bold uppercase tracking-wider">
                    Minimal accessories for maximum productivity.
                  </p>
                  <Link to="/products?category=Laptop Accessories">
                    <Button
                      variant="outline"
                      className="rounded-none px-[29px] h-12 text-xs font-black uppercase tracking-widest border-zinc-700 bg-transparent text-white hover:bg-[#FFCC00] hover:text-black mt-[15px]"
                    >
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Brand Logos Section */}
        {!categoryParam && !searchParam && <BrandLogos />}

        {/* Popular Categories */}
        {!categoryParam && !searchParam && (
          <section className="py-24 bg-zinc-50">
            <div className="section-container px-6">
              <div className="flex items-end justify-between mb-12">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                    Categories
                  </h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Find gear by category</p>
                </div>
                <Link to="/products" className="text-xs font-black uppercase tracking-widest text-black hover:text-[#FFCC00] hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link key={cat.name} to={cat.path} className="group">
                      <div className="bg-white p-8 rounded-none border border-zinc-200 flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:border-black h-full">
                        <div className="w-16 h-16 flex items-center justify-center text-black group-hover:text-[#FFCC00] transition-colors">
                          <Icon size={32} />
                        </div>
                        <span className="font-black text-xs text-zinc-600 group-hover:text-black uppercase tracking-wider">
                          {cat.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section className="py-24">
          <div className="section-container px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {categoryParam
                    ? categoryParam
                    : searchParam
                    ? `Search: "${searchParam}"`
                    : "Featured Gear"}
                </h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  {filteredProducts.length} items available
                </p>
              </div>
              {(categoryParam || searchParam) && (
                <Link to="/">
                  <Button
                    variant="ghost"
                    className="gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-black"
                  >
                    Clear filters <X size={14} />
                  </Button>
                </Link>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center bg-zinc-50 rounded-none border border-dashed border-zinc-300">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  No items found
                </h3>
                <p className="text-zinc-500 mt-1 text-xs font-bold uppercase tracking-wider">
                  Try a different search term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Reasons to Buy */}
        {!categoryParam && !searchParam && (
          <section className="py-24 bg-black text-white border-y border-zinc-900">
            <div className="section-container px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Truck, title: "Free Shipping", desc: "On orders over $50", color: "bg-zinc-900 text-[#FFCC00]" },
                  { icon: ShieldCheck, title: "Secure Payment", desc: "100% encrypted", color: "bg-zinc-900 text-[#FFCC00]" },
                  { icon: RotateCcw, title: "Easy Returns", desc: "30-day window", color: "bg-zinc-900 text-[#FFCC00]" },
                  { icon: Star, title: "Warranty", desc: "1-year included", color: "bg-zinc-900 text-[#FFCC00]" },
                ].map((item, i) => (
                  <div key={i} className="group bg-zinc-950 p-8 rounded-none border border-zinc-900 transition-all duration-300 hover:border-[#FFCC00]">
                    <div className={cn("w-12 h-12 rounded-none flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110", item.color)}>
                      <item.icon size={24} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-black text-base text-white uppercase tracking-wider">{item.title}</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
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