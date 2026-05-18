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

  const categories = [
    { name: "Keyboards", icon: Keyboard, path: "/products?category=Gaming Accessories" },
    { name: "Mice", icon: MousePointer2, path: "/products?category=PC Accessories" },
    { name: "Headsets", icon: Headphones, path: "/products?category=Audio" },
    { name: "Webcams", icon: Video, path: "/products?category=PC Accessories" },
    { name: "Chargers", icon: BatteryCharging, path: "/products?category=Chargers & Cables" },
    { name: "Storage", icon: HardDrive, path: "/products?category=Storage Devices" },
    { name: "Gaming", icon: Gamepad2, path: "/products?category=Gaming Accessories" },
    { name: "Laptops", icon: Laptop, path: "/products?category=Laptop Accessories" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        {!categoryParam && !searchParam && (
          <section className="relative px-4 py-16 md:py-32 border-b border-hairline bg-surface">
            <div className="section-container max-w-4xl">
              <div className="space-y-8">
                <div className="text-mono text-accent">
                  Next-Gen Tech Essentials
                </div>
                <h1 className="text-hero text-ink">
                  Upgrade your <br />
                  <span className="text-accent">tech setup.</span>
                </h1>
                <p className="text-body text-ink-500 max-w-lg">
                  Premium electronics and accessories designed for modern
                  life. Minimal design, maximum performance. Engineered for calm.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Link to="/products">
                    <Button variant="primary" size="lg">
                      Shop Collection
                    </Button>
                  </Link>
                  <Link to="/deals">
                    <Button variant="secondary" size="lg">
                      View Deals
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
          <section className="py-24 border-b border-hairline">
            <div className="section-container">
              <div className="flex items-end justify-between mb-12">
                <div className="space-y-1">
                  <h2 className="text-h2 text-ink">Categories</h2>
                  <p className="text-body text-ink-400">Find gear by category</p>
                </div>
                <Link to="/products">
                  <Button variant="ghost">View all</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link key={cat.name} to={cat.path} className="group">
                      <div className="card-orbit flex flex-col items-center justify-center gap-4 h-full text-center">
                        <div className="w-12 h-12 flex items-center justify-center text-ink-500 group-hover:text-accent transition-colors">
                          <Icon size={24} />
                        </div>
                        <span className="text-ui text-ink-700 group-hover:text-ink">
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
                <h2 className="text-h2 text-ink">
                  {categoryParam ? categoryParam : searchParam ? `Search: "${searchParam}"` : "Featured"}
                </h2>
                <p className="text-body text-ink-400">
                  {filteredProducts.length} items available
                </p>
              </div>
              {(categoryParam || searchParam) && (
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    Clear filters <X size={14} />
                  </Button>
                </Link>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center bg-surface rounded-lg border border-dashed border-hairline">
                <h3 className="text-h2 text-ink">No items found</h3>
                <p className="text-body text-ink-400 mt-1">Try a different search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Reasons to Buy */}
        {!categoryParam && !searchParam && (
          <section className="py-24 bg-surface border-y border-hairline">
            <div className="section-container">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
                  { icon: ShieldCheck, title: "Secure Payment", desc: "100% encrypted" },
                  { icon: RotateCcw, title: "Easy Returns", desc: "30-day window" },
                  { icon: Star, title: "Warranty", desc: "1-year included" },
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="w-10 h-10 rounded-md bg-background flex items-center justify-center text-accent">
                      <item.icon size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-ui text-ink font-bold">{item.title}</h4>
                      <p className="text-body text-ink-500 text-sm">{item.desc}</p>
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