"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import BrandLogos from "../../components/storefront/BrandLogos";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Star,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  Flame,
  Sparkles,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Countdown Timer ───────────────────────────────────────────────────────────
const useCountdown = (targetHours = 8) => {
  const getTarget = () => {
    const t = new Date();
    t.setHours(t.getHours() + targetHours, 0, 0, 0);
    return t.getTime();
  };
  const [target] = useState(getTarget);
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
};

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="aspect-square bg-slate-100 m-2 rounded-xl" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-slate-100 rounded w-1/3" />
      <div className="h-4 bg-slate-100 rounded w-2/3" />
      <div className="h-4 bg-slate-100 rounded w-1/4" />
      <div className="h-10 bg-slate-100 rounded-full mt-4" />
    </div>
  </div>
);

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  href,
  eyebrowIcon: Icon,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  eyebrowIcon?: React.ElementType;
}) => (
  <div className="flex items-end justify-between mb-10">
    <div className="space-y-2">
      {eyebrow && (
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          {Icon && <Icon size={12} />}
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
    </div>
    {href && (
      <Link
        to={href}
        className="group hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
      >
        View all
        <ChevronRight
          size={14}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </Link>
    )}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const HomePage = () => {
  const { products } = useStore();
  const [searchParams] = useSearchParams();
  const countdown = useCountdown(8);

  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("q");

  const isFiltered = !!(categoryParam || searchParam);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.status === "active");
    if (categoryParam) result = result.filter((p) => p.category === categoryParam);
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
  const newArrivals = useMemo(
    () =>
      [...products]
        .filter((p) => p.status === "active")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [products]
  );
  const bestSellers = useMemo(
    () =>
      [...products]
        .filter((p) => p.status === "active")
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 4),
    [products]
  );
  const deals = useMemo(
    () =>
      products
        .filter((p) => p.status === "active" && p.compareAtPrice && p.compareAtPrice > p.price)
        .slice(0, 4),
    [products]
  );

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

  const isLoading = products.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />

      <main className="flex-grow">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        {!isFiltered && (
          <section className="relative pt-0 mb-[5px] px-[5px]">
            <div className="relative overflow-hidden bg-slate-900 min-h-[500px] md:min-h-[620px] flex items-center w-full py-5 rounded-none">
              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <iframe
                  className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 opacity-50"
                  src="https://www.youtube.com/embed/H41fuhz_gvw?autoplay=1&mute=1&loop=1&playlist=H41fuhz_gvw&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                  title="Hero Background Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />

              <div className="relative z-10 px-8 md:px-20 max-w-3xl space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium uppercase tracking-wider">
                  <Zap size={11} className="text-primary" /> Next-Gen Tech
                </div>
                <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-[1.1]">
                  Upgrade your <br />
                  <span className="text-primary">tech setup.</span>
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                  Premium electronics and accessories designed for modern life. Minimal design, maximum performance.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link to="/products">
                    <Button size="lg" className="rounded-full px-8 h-12 text-sm font-medium shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 text-white">
                      Shop Collection
                    </Button>
                  </Link>
                  <Link to="/deals">
                    <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-sm font-medium border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20">
                      View Deals
                    </Button>
                  </Link>
                </div>

                {/* Trust bar inside hero */}
                <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                  {[
                    { icon: ShieldCheck, text: "Secure Checkout" },
                    { icon: Truck, text: "Free Shipping $50+" },
                    { icon: RotateCcw, text: "30-Day Returns" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/60 text-[11px] font-medium">
                      <item.icon size={13} className="text-white/40" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Promo Campaign Cards ───────────────────────────────────────────── */}
        {!isFiltered && (
          <section className="mx-[5px] mb-[5px]">
            <div className="grid md:grid-cols-2 gap-[5px]">
              <div className="group relative overflow-hidden bg-slate-900 text-white min-h-[340px] flex flex-col justify-end rounded-none">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10 p-10 space-y-3">
                  <Badge className="bg-white/20 text-white border-transparent text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-sm">
                    New Collection
                  </Badge>
                  <h3 className="text-3xl font-semibold tracking-tight">Gaming Essentials</h3>
                  <p className="text-slate-200 text-sm max-w-xs">Pro-grade gear for ultimate performance.</p>
                  <Link to="/products?category=Gaming Accessories" className="inline-block pt-2">
                    <Button variant="secondary" className="rounded-full h-9 px-6 text-xs font-semibold gap-1.5">
                      Explore <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden min-h-[340px] flex flex-col justify-end rounded-none">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7279320/pexels-photo-7279320.jpeg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="relative z-10 p-10 space-y-3">
                  <Badge className="bg-white/20 text-white border-transparent text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-sm">
                    Work From Anywhere
                  </Badge>
                  <h3 className="text-3xl font-semibold tracking-tight text-white">Work Setup</h3>
                  <p className="text-slate-200 text-sm max-w-xs">Minimal accessories, maximum productivity.</p>
                  <Link to="/products?category=Laptop Accessories" className="inline-block pt-2">
                    <Button variant="outline" className="rounded-full h-9 px-6 text-xs font-semibold gap-1.5 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                      Explore <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Brand Logos ────────────────────────────────────────────────────── */}
        {!isFiltered && <BrandLogos />}

        {/* ── Categories ────────────────────────────────────────────────────── */}
        {!isFiltered && (
          <section className="py-20 section-container">
            <SectionHeader
              eyebrow="Browse by type"
              eyebrowIcon={Package}
              title="Shop by Category"
              subtitle="Find exactly what you're looking for"
              href="/products"
            />
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link key={cat.name} to={cat.path} className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-200">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-primary/5 transition-colors">
                      <Icon size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-900 text-center leading-tight transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Flash Deals (with countdown) ──────────────────────────────────── */}
        {!isFiltered && deals.length > 0 && (
          <section className="py-20 bg-slate-900 relative overflow-hidden">
            {/* subtle grid background */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
            />
            <div className="section-container relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400">
                    <Flame size={12} /> Flash Deals
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    Deals of the Week
                  </h2>
                  <p className="text-slate-400 text-sm">Limited stock — grab them before they're gone.</p>
                </div>

                {/* Countdown */}
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-slate-400 text-xs font-medium mr-2">Ends in</span>
                  {[countdown.h, countdown.m, countdown.s].map((val, i) => (
                    <React.Fragment key={i}>
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                        <span className="text-white font-bold text-lg tabular-nums">{val}</span>
                      </div>
                      {i < 2 && <span className="text-white/40 font-bold text-lg">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading
                  ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                  : deals.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              <div className="mt-8 text-center">
                <Link to="/deals">
                  <Button variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-full px-8 h-11 text-xs font-semibold gap-2">
                    See All Deals <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── New Arrivals ───────────────────────────────────────────────────── */}
        {!isFiltered && (
          <section className="py-20 section-container">
            <SectionHeader
              eyebrow="Just landed"
              eyebrowIcon={Sparkles}
              title="New Arrivals"
              subtitle="The latest additions to our catalog"
              href="/new-arrivals"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading
                ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                : newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* ── Testimonials / Social Proof ────────────────────────────────────── */}
        {!isFiltered && (
          <section className="py-20 bg-slate-50/60 border-y border-slate-100">
            <div className="section-container">
              <SectionHeader
                eyebrow="Reviews"
                eyebrowIcon={Star}
                title="Loved by thousands"
                subtitle="What our customers say about us"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Sarah M.",
                    role: "Designer",
                    avatar: "SM",
                    rating: 5,
                    text: "The keyboard I ordered arrived perfectly packaged. Build quality is excellent and typing feel is exactly as described. Will definitely be back.",
                  },
                  {
                    name: "James K.",
                    role: "Software Engineer",
                    avatar: "JK",
                    rating: 5,
                    text: "Fast shipping, great prices, and the product is even better than the photos. The headset audio quality blew me away. Highly recommended.",
                  },
                  {
                    name: "Amira B.",
                    role: "Content Creator",
                    avatar: "AB",
                    rating: 5,
                    text: "The webcam is crisp and the setup took under 5 minutes. Support team was helpful when I had questions. 10/10 experience overall.",
                  },
                ].map((review, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-7 flex flex-col gap-5 hover:shadow-md transition-shadow">
                    <div className="flex gap-0.5">
                      {Array(review.rating).fill(0).map((_, j) => (
                        <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed flex-grow">"{review.text}"</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                        <p className="text-xs text-slate-400">{review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Best Sellers ───────────────────────────────────────────────────── */}
        {!isFiltered && (
          <section className="py-20 section-container">
            <SectionHeader
              eyebrow="Top rated"
              eyebrowIcon={TrendingUp}
              title="Best Sellers"
              subtitle="Our most popular picks this month"
              href="/best-sellers"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading
                ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                : bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* ── Newsletter ─────────────────────────────────────────────────────── */}
        {!isFiltered && (
          <section className="py-20 section-container">
            <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/10 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <Zap size={11} /> Exclusive access
                </div>
                <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                  Stay in the loop
                </h2>
                <p className="text-slate-500 text-sm max-w-sm">
                  Get early access to new arrivals, exclusive deals, and tech tips — straight to your inbox.
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 px-5 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full sm:w-72"
                />
                <Button className="h-12 rounded-full px-7 text-sm font-semibold whitespace-nowrap shadow-md shadow-primary/20">
                  Subscribe
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ── Featured / Search / Filter Results ────────────────────────────── */}
        <section className={cn("section-container", isFiltered ? "py-16" : "py-10 border-t border-slate-100")}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
                {categoryParam
                  ? categoryParam
                  : searchParam
                  ? `Results for "${searchParam}"`
                  : "Featured Products"}
              </h2>
              <p className="text-slate-400 text-sm">{filteredProducts.length} items</p>
            </div>
            <div className="flex items-center gap-4">
              {isFiltered && (
                <Link to="/">
                  <Button variant="ghost" className="gap-2 text-xs font-medium text-slate-500 hover:text-slate-900">
                    <X size={14} /> Clear filters
                  </Button>
                </Link>
              )}
              {!isFiltered && (
                <Link to="/products">
                  <Button variant="outline" className="rounded-full px-6 h-9 text-xs font-semibold gap-1.5">
                    View all <ArrowRight size={13} />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">No items found</h3>
              <p className="text-slate-400 mt-1 text-sm">Try a different search term or browse all products.</p>
              <Link to="/products">
                <Button variant="outline" className="mt-6 rounded-full px-8">Browse all products</Button>
              </Link>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* ── Trust Bar ─────────────────────────────────────────────────────── */}
        {!isFiltered && (
          <section className="py-16 bg-slate-50/50 border-t border-slate-100">
            <div className="section-container grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: Truck, title: "Free Shipping", desc: "On orders over $50", color: "bg-primary/8 text-primary" },
                { icon: ShieldCheck, title: "Secure Payment", desc: "100% encrypted", color: "bg-emerald-50 text-emerald-600" },
                { icon: RotateCcw, title: "Easy Returns", desc: "30-day window", color: "bg-orange-50 text-orange-500" },
                { icon: Star, title: "1-Year Warranty", desc: "On all products", color: "bg-amber-50 text-amber-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                    <p className="text-slate-400 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
