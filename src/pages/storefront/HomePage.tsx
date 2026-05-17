"use client";

import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones, 
  ArrowRight, 
  Zap, 
  Smartphone, 
  Laptop, 
  Gamepad2, 
  HardDrive 
} from "lucide-react";

const HomePage = () => {
  const { products } = useStore();
  const [searchParams] = useSearchParams();
  
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("q");

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

  const featuredProducts = filteredProducts.slice(0, 8);
  const deals = filteredProducts.filter(p => p.compareAtPrice).slice(0, 4);

  const categories = [
    { name: "Phones", icon: Smartphone, color: "bg-blue-50 text-blue-600", path: "/?category=Phone Accessories" },
    { name: "Laptops", icon: Laptop, color: "bg-purple-50 text-purple-600", path: "/?category=Laptop Accessories" },
    { name: "Gaming", icon: Gamepad2, color: "bg-red-50 text-red-600", path: "/?category=Gaming Accessories" },
    { name: "Storage", icon: HardDrive, color: "bg-emerald-50 text-emerald-600", path: "/?category=Storage Devices" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Only show on main home page */}
        {!categoryParam && !searchParam && (
          <section className="relative overflow-hidden bg-slate-900 py-20 md:py-32">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
            
            <div className="section-container relative z-10">
              <div className="max-w-2xl space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                  <Zap size={14} /> Next-Gen Tech is Here
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
                  Elevate Your <span className="text-primary">Digital</span> Experience
                </h1>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                  Discover the latest in high-performance electronics. From professional workstations to immersive gaming gear, we've got your future covered.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-lg shadow-primary/20">
                    Shop Collection
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg text-white border-white/20 hover:bg-white/10">
                    View Deals
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trust Badges */}
        <section className="border-y bg-white py-8">
          <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $100" },
              { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure checkout" },
              { icon: RotateCcw, title: "Easy Returns", desc: "30-day money back" },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated tech team" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-50 text-primary">
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop by Category */}
        {!categoryParam && !searchParam && (
          <section className="py-20">
            <div className="section-container">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
                  <p className="text-slate-500 mt-2">Find exactly what you're looking for</p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <Link key={cat.name} to={cat.path} className="group cursor-pointer">
                    <div className={`aspect-[4/3] rounded-3xl ${cat.color} flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl`}>
                      <cat.icon size={48} strokeWidth={1.5} />
                      <span className="font-bold text-lg">{cat.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section className="py-20 bg-white">
          <div className="section-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {categoryParam ? categoryParam : searchParam ? `Search: "${searchParam}"` : "Featured Products"}
                </h2>
                <p className="text-slate-500 mt-2">
                  {filteredProducts.length} products found
                </p>
              </div>
              {(categoryParam || searchParam) && (
                <Link to="/">
                  <Button variant="ghost" className="gap-2 font-bold text-primary">
                    Clear Filters
                  </Button>
                </Link>
              )}
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <Smartphone className="mx-auto h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-2xl font-black text-slate-900">No products found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                <Link to="/">
                  <Button className="mt-8 rounded-2xl">Back to Home</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Deals Section */}
        {!categoryParam && !searchParam && deals.length > 0 && (
          <section className="py-20 bg-slate-900 text-white overflow-hidden">
            <div className="section-container">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-red-500 rounded-lg animate-pulse">
                  <Zap size={20} fill="white" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Flash Deals</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {deals.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Buy From Us */}
        {!categoryParam && !searchParam && (
          <section className="py-20">
            <div className="section-container">
              <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4" />
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-black tracking-tight">Why Choose ElectroStore?</h2>
                    <p className="text-primary-foreground/80 text-lg">
                      We're more than just a retailer. We're tech enthusiasts dedicated to bringing you the best gear with unmatched service.
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Authorized dealer for all major brands",
                        "Expert technical support for every purchase",
                        "Exclusive extended warranty options",
                        "Price match guarantee on all items"
                      ].map((text, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="bg-white/20 p-1 rounded-full">
                            <ShieldCheck size={16} />
                          </div>
                          <span className="font-medium">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="hidden md:block">
                    <img 
                      src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070" 
                      alt="Tech Setup" 
                      className="rounded-3xl shadow-2xl rotate-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white border-t pt-20 pb-10">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-primary p-1.5 rounded-lg">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">ElectroStore</span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your premier destination for high-end electronics and accessories. Quality tech, delivered to your door.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Shop</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link to="/" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Best Sellers</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Deals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link to="/" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Newsletter</h4>
              <p className="text-sm text-slate-500 mb-4">Subscribe for exclusive offers and tech news.</p>
              <div className="flex gap-2">
                <input className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary transition-colors" placeholder="Email address" />
                <Button className="rounded-xl">Join</Button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-500">© 2024 ElectroStore. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">Privacy Policy</Link>
              <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">Terms of Service</Link>
              <MadeWithDyad />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;