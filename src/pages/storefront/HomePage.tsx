"use client";

import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
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
  HardDrive,
  Keyboard,
  MousePointer2,
  Video,
  Star,
  CheckCircle2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const bestSellers = [...filteredProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
  const deals = filteredProducts.filter(p => p.compareAtPrice).slice(0, 4);

  const categories = [
    { 
      name: "Keyboards", 
      image: "https://www.pngall.com/wp-content/uploads/2/Keyboard-PNG-Free-Download.png", 
      path: "/products?category=Gaming Accessories" 
    },
    { 
      name: "Mice", 
      image: "https://www.pngall.com/wp-content/uploads/2016/03/Mouse-PNG-HD.png", 
      path: "/products?category=PC Accessories" 
    },
    { 
      name: "Headsets", 
      image: "https://www.pngall.com/wp-content/uploads/2016/05/Headphone-PNG-Image.png", 
      path: "/products?category=Audio" 
    },
    { 
      name: "Webcams", 
      image: "https://www.pngall.com/wp-content/uploads/2016/05/Webcam-PNG-Clipart.png", 
      path: "/products?category=PC Accessories" 
    },
    { 
      name: "Chargers", 
      image: "https://www.pngall.com/wp-content/uploads/2016/04/Charger-PNG-File.png", 
      path: "/products?category=Chargers & Cables" 
    },
    { 
      name: "Storage", 
      image: "https://www.pngall.com/wp-content/uploads/2016/03/Hard-Drive-PNG-File.png", 
      path: "/products?category=Storage Devices" 
    },
    { 
      name: "Gaming", 
      image: "https://www.pngall.com/wp-content/uploads/2/Joystick-PNG-High-Quality-Image.png", 
      path: "/products?category=Gaming Accessories" 
    },
    { 
      name: "Laptops", 
      image: "https://www.pngall.com/wp-content/uploads/2016/03/Laptop-PNG-Image.png", 
      path: "/products?category=Laptop Accessories" 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        {!categoryParam && !searchParam && (
          <section className="relative py-[10px] px-[2px]">
            <div className="w-full">
              <div className="relative overflow-hidden border border-slate-800 rounded-[10px] bg-slate-50 min-h-[500px] md:min-h-[600px] flex items-center w-full">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent" />
                
                <div className="relative z-10 px-8 md:px-20 max-w-3xl space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <Zap size={14} className="text-primary" /> Next-Gen Tech is Here
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                    UPGRADE YOUR <br />
                    <span className="text-primary">TECH SETUP</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium max-w-xl">
                    Discover premium electronics, mobile accessories, and PC gear built for work, play, and everyday life.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link to="/products">
                      <Button size="lg" className="rounded-full px-10 h-14 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                        Shop Now
                      </Button>
                    </Link>
                    <Link to="/deals">
                      <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-sm font-black uppercase tracking-widest border-slate-200 bg-white hover:bg-slate-50">
                        Explore Deals
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
          <section className="pb-20">
            <div className="section-container grid md:grid-cols-2 gap-[5px]">
              <div className="group relative overflow-hidden rounded-[10px] border border-slate-800 bg-slate-900 text-white p-12 min-h-[400px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center opacity-30 transition-transform duration-700 group-hover:scale-110" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-4xl font-black tracking-tight">Gaming Essentials</h3>
                  <p className="text-slate-400 max-w-xs font-medium">Level up your performance with our pro-grade gaming gear.</p>
                  <Link to="/products?category=Gaming Accessories">
                    <Button variant="secondary" className="rounded-full px-8 font-black uppercase tracking-widest text-[10px]">Shop Gaming</Button>
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-[10px] border border-slate-800 bg-primary text-white p-12 min-h-[400px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071')] bg-cover bg-center opacity-20 transition-transform duration-700 group-hover:scale-110" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-4xl font-black tracking-tight">Work From Anywhere</h3>
                  <p className="text-primary-foreground/80 max-w-xs font-medium">Premium accessories designed for maximum productivity and comfort.</p>
                  <Link to="/products?category=Laptop Accessories">
                    <Button variant="secondary" className="rounded-full px-8 font-black uppercase tracking-widest text-[10px]">Shop Productivity</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Popular Categories */}
        {!categoryParam && !searchParam && (
          <section className="py-20 bg-slate-50/50">
            <div className="section-container">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Shop by Category</h2>
                <p className="text-slate-500 font-medium">Find exactly what you're looking for</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[5px]">
                {categories.map((cat) => (
                  <Link key={cat.name} to={cat.path} className="group">
                    <div className="bg-slate-100 p-8 rounded-[10px] border border-slate-800 flex flex-col items-center justify-center gap-6 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-primary/20 h-full">
                      <div className="w-24 h-24 rounded-[10px] border border-slate-800 bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 p-4 shadow-sm">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="font-black text-xs uppercase tracking-widest text-slate-900">{cat.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section className="py-24">
          <div className="section-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                  {categoryParam ? categoryParam : searchParam ? `Search: "${searchParam}"` : "Featured Products"}
                </h2>
                <p className="text-slate-500 font-medium">
                  {filteredProducts.length} products found
                </p>
              </div>
              {(categoryParam || searchParam) && (
                <Link to="/">
                  <Button variant="ghost" className="gap-2 font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5">
                    Clear Filters <X size={14} />
                  </Button>
                </Link>
              )}
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="py-32 text-center bg-slate-50 rounded-[10px] border border-dashed border-slate-800">
                <Smartphone className="mx-auto h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-2xl font-black text-slate-900">No products found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                <Link to="/">
                  <Button className="mt-8 rounded-full px-8 font-black uppercase tracking-widest text-[10px]">Back to Home</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[5px]">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Best Sellers Section */}
        {!categoryParam && !searchParam && bestSellers.length > 0 && (
          <section className="py-24 bg-slate-50/50">
            <div className="section-container">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Best Sellers</h2>
                <Link to="/best-sellers">
                  <Button variant="ghost" className="gap-2 font-black text-[10px] uppercase tracking-widest text-primary">View All <ArrowRight size={14} /></Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[5px]">
                {bestSellers.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Deals Section */}
        {!categoryParam && !searchParam && deals.length > 0 && (
          <section className="py-24 bg-slate-900 text-white overflow-hidden">
            <div className="section-container">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <Zap size={20} fill="white" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight uppercase">Flash Deals</h2>
                </div>
                <Link to="/deals">
                  <Button variant="ghost" className="gap-2 font-black text-[10px] uppercase tracking-widest text-white hover:bg-white/10">View All <ArrowRight size={14} /></Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[5px]">
                {deals.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reasons to Buy */}
        {!categoryParam && !searchParam && (
          <section className="py-24">
            <div className="section-container">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {[
                  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
                  { icon: ShieldCheck, title: "Secure Checkout", desc: "100% encrypted" },
                  { icon: RotateCcw, title: "Easy Returns", desc: "30-day window" },
                  { icon: Star, title: "Warranty", desc: "1-year included" },
                  { icon: Headphones, title: "Fast Support", desc: "24/7 tech team" },
                  { icon: Zap, title: "Exclusive Deals", desc: "Member rewards" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-[10px] border border-slate-800 bg-slate-50 flex items-center justify-center text-primary">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-900">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quality Section */}
        {!categoryParam && !searchParam && (
          <section className="py-24 bg-slate-50/30">
            <div className="section-container">
              <div className="bg-white rounded-[10px] p-12 md:p-24 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/4" />
                <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                      BUILT FOR BETTER <br />
                      <span className="text-primary">EVERYDAY TECH</span>
                    </h2>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium">
                      Carefully selected accessories designed for reliability, comfort, and performance. We believe in tech that enhances your life without complicating it.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        "Premium Materials",
                        "Rigorous Testing",
                        "Ergonomic Design",
                        "Sustainable Choices"
                      ].map((text, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-primary" />
                          <span className="text-sm font-bold text-slate-700">{text}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/about">
                      <Button className="rounded-full px-10 h-14 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                        Our Story
                      </Button>
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <img 
                      src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070" 
                      alt="Tech Quality" 
                      className="rounded-[10px] border border-slate-800 shadow-2xl rotate-2"
                    />
                  </div>
                </div>
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