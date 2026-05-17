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

  const featuredProducts = filteredProducts.slice(0, 8);
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
          <section className="relative pt-0 pb-8 px-2">
            <div className="w-full">
              <div className="relative overflow-hidden border border-slate-100 rounded-2xl bg-slate-900 min-h-[500px] md:min-h-[600px] flex items-center w-full py-5">
                {/* YouTube Video Background */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                  <iframe
                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 opacity-50"
                    src="https://www.youtube.com/embed/H41fuhz_gvw?autoplay=1&mute=1&loop=1&playlist=H41fuhz_gvw&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                    title="Hero Background Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                {/* Overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />

                <div className="relative z-10 px-8 md:px-20 max-w-3xl space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium uppercase tracking-wider shadow-sm">
                    <Zap size={12} className="text-primary" /> Next-Gen Tech
                  </div>
                  <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-[1.1]">
                    Upgrade your <br />
                    <span className="text-primary">tech setup.</span>
                  </h1>
                  <p className="text-lg text-slate-300 leading-relaxed font-normal max-w-lg">
                    Premium electronics and accessories designed for modern
                    life. Minimal design, maximum performance.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link to="/products">
                      <Button
                        size="lg"
                        className="rounded-full px-8 h-12 text-sm font-medium shadow-sm bg-primary hover:bg-primary/90 text-white border-none"
                      >
                        Shop Collection
                      </Button>
                    </Link>
                    <Link to="/deals">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-8 h-12 text-sm font-medium border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
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
          <section className="py-16">
            <div className="section-container grid md:grid-cols-2 gap-8">
              <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-900 text-white p-10 min-h-[360px] flex flex-col justify-end">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 space-y-[15px]">
                  <h3 className="text-3xl font-semibold tracking-tight">
                    Gaming Essentials
                  </h3>
                  <p className="text-slate-100 max-w-xs text-sm drop-shadow-md">
                    Pro-grade gear for the ultimate performance.
                  </p>
                  <Link to="/products?category=Gaming Accessories">
                    <Button
                      variant="secondary"
                      className="rounded-full px-[29px] h-10 text-xs font-medium mt-[15px]"
                    >
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-10 min-h-[360px] flex flex-col justify-end">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-white/60" />
                <div className="relative z-10 space-y-[15px]">
                  <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
                    Work Setup
                  </h3>
                  <p className="text-slate-800 max-w-xs text-sm drop-shadow-sm">
                    Minimal accessories for maximum productivity.
                  </p>
                  <Link to="/products?category=Laptop Accessories">
                    <Button
                      variant="outline"
                      className="rounded-full px-[29px] h-10 text-xs font-medium border-slate-200 bg-white mt-[15px]"
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
          <section className="py-24">
            <div className="section-container">
              <div className="flex items-end justify-between mb-12">
                <div className="space-y-1">
                  <h2 className="text-3xl font-semibold text-slate-900">
                    Categories
                  </h2>
                  <p className="text-slate-500 text-sm">Find gear by category</p>
                </div>
                <Link to="/products" className="text-sm font-medium text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link key={cat.name} to={cat.path} className="group">
                      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:bg-white hover:shadow-sm hover:border-slate-200 h-full">
                        <div className="w-16 h-16 flex items-center justify-center">
                          <Icon size={32} className="text-black" />
                        </div>
                        <span className="font-medium text-xs text-slate-600 group-hover:text-slate-900">
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
          <div className="section-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-semibold text-slate-900">
                  {categoryParam
                    ? categoryParam
                    : searchParam
                    ? `Search: "${searchParam}"`
                    : "Featured"}
                </h2>
                <p className="text-slate-500 text-sm">
                  {filteredProducts.length} items available
                </p>
              </div>
              {(categoryParam || searchParam) && (
                <Link to="/">
                  <Button
                    variant="ghost"
                    className="gap-2 text-xs font-medium text-slate-500"
                  >
                    Clear filters <X size={14} />
                  </Button>
                </Link>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <h3 className="text-xl font-medium text-slate-900">
                  No items found
                </h3>
                <p className="text-slate-500 mt-1 text-sm">
                  Try a different search term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Reasons to Buy */}
        {!categoryParam && !searchParam && (
          <section className="py-24 border-t border-slate-50">
            <div className="section-container">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
                  { icon: ShieldCheck, title: "Secure Payment", desc: "100% encrypted" },
                  { icon: RotateCcw, title: "Easy Returns", desc: "30-day window" },
                  { icon: Star, title: "Warranty", desc: "1-year included" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-start gap-4">
                    <div className="text-primary">
                      <item.icon size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
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