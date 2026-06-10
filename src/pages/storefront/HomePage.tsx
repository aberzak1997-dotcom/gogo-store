"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
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
  <div className="bg-white rounded-none border border-slate-100 overflow-hidden animate-pulse">
    <div className="aspect-square bg-slate-100 m-2 rounded-none" />
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
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-[50px]">
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

  // ── Side panel open state (hides center hero image) ───────────────────────
  const [sideOpen, setSideOpen] = useState(false);

  // ── Right panel: mouse-position-driven auto-scroll ───────────────────────
  const panelScrollRef = useRef<HTMLDivElement>(null);
  const scrollSpeedRef = useRef(0);
  const animFrameRef  = useRef<number | null>(null);

  const startScrollLoop = () => {
    const tick = () => {
      if (panelScrollRef.current && scrollSpeedRef.current !== 0) {
        panelScrollRef.current.scrollTop += scrollSpeedRef.current;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  };

  const stopScrollLoop = () => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    scrollSpeedRef.current = 0;
  };

  const handlePanelMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const zone = (e.clientY - rect.top) / rect.height; // 0 = top, 1 = bottom
    if (zone < 0.35)       scrollSpeedRef.current = -4;  // top zone → scroll up
    else if (zone > 0.65)  scrollSpeedRef.current =  4;  // bottom zone → scroll down
    else                   scrollSpeedRef.current =  0;  // middle → stop
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />

      <main className="flex-grow">

        {/* ══════════════════════════════════════════════════════════════════════
            LARGE HERO SECTION (LIGHT THEME)
        ══════════════════════════════════════════════════════════════════════ */}
        {!isFiltered && (
          <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden bg-slate-50/60 border-b border-slate-100 p-[10px]">

            {/* ── Background layers ── */}
            {/* Radial glow — blue left */}
            <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(17,96,203,0.06) 0%, transparent 70%)" }} />
            {/* Radial glow — navy right */}
            <div className="absolute -right-60 top-1/3 w-[600px] h-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(21,40,161,0.05) 0%, transparent 70%)" }} />
            {/* Subtle dot grid */}
            <div className="absolute inset-0 opacity-[0.02]"
              style={{ backgroundImage: "radial-gradient(circle, #000000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            {/* ── Three-panel horizontal layout ── */}
            <div className="relative z-10 w-full flex items-stretch min-h-[480px] md:min-h-[520px]">

              {/* ── LEFT panel — New Arrival ── */}
              <div className="group hidden md:flex overflow-hidden transition-all duration-500 ease-in-out w-[72px] hover:w-[280px] flex-shrink-0 cursor-pointer relative mx-[5px] mb-[5px] rounded-[15px] border border-[#c5c5c5]" style={{ background: "#FF7A30" }} onMouseEnter={() => setSideOpen(true)} onMouseLeave={() => setSideOpen(false)}>
                {/* Light blue overlay — fades in on hover */}
                <div className="absolute inset-0 bg-[#EEF4FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />
                {/* Collapsed label */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300 z-10">
                  <span className="text-[18px] font-semibold tracking-[4px] text-white -rotate-90 whitespace-nowrap">
                    New Arrival
                  </span>
                </div>
                {/* Expanded content */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-100 flex flex-col w-[280px] overflow-hidden z-[2]">

                  {/* ── Full-cover product image ── */}
                  <div className="relative w-full h-[52%] flex-shrink-0 overflow-hidden">
                    {newArrivals[0]?.imageUrl && (
                      <img
                        src={newArrivals[0].imageUrl}
                        alt={newArrivals[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(238,244,255,0.7) 100%)" }} />
                    {/* Badge */}
                    <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-[2px] text-[#1160CB] bg-white px-2.5 py-1 rounded-full shadow-sm">
                      New Arrival
                    </span>
                  </div>

                  {/* ── Product info ── */}
                  <div className="flex flex-col flex-1 px-4 py-3 gap-2">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[3px] text-[#1160CB]">
                        {newArrivals[0]?.brand}
                      </p>
                      <p className="text-[14px] font-bold text-[#0C0D10] leading-snug line-clamp-2 mt-0.5">
                        {newArrivals[0]?.title || "Latest Drop"}
                      </p>
                      <p className="text-[11px] text-[#0C0D10]/50 leading-relaxed line-clamp-2 mt-1.5">
                        {newArrivals[0]?.description || "Cutting-edge tech for modern professionals and enthusiasts."}
                      </p>
                    </div>

                    {/* Price + Check Product link */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[20px] font-black text-[#1528A1]">
                        ${(newArrivals[0]?.price || 0).toFixed(0)}
                      </span>
                      <Link
                        to={`/product/${newArrivals[0]?.id || ""}`}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[1.5px] text-white px-3 py-1.5 rounded-full transition-all duration-200 hover:opacity-90"
                        style={{ background: "#FF7A30" }}
                      >
                        Check Product <ArrowRight size={11} />
                      </Link>
                    </div>

                    {/* CTA button — transparent */}
                    <Link to="/new-arrivals" className="block mt-1">
                      <button
                        className="w-full py-2 rounded-[10px] text-[10px] font-black uppercase tracking-[1.5px] text-[#1160CB] border border-[#1160CB]/30 bg-transparent hover:bg-[#1160CB]/8 transition-all duration-200 active:scale-[0.98]"
                      >
                        Check Other New Arrivals
                      </button>
                    </Link>
                  </div>

                </div>
              </div>

              {/* ── CENTER — main hero (text left + image right) ── */}
              <div
                className="flex-1 flex items-center px-8 md:px-12 py-16 mx-[5px] mb-[5px] rounded-[15px] border border-[#c5c5c5] overflow-hidden relative gap-8"
                style={{
                  background: `
                    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(17,96,203,0.10) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(21,40,161,0.08) 0%, transparent 55%),
                    radial-gradient(ellipse 40% 35% at 55% 15%, rgba(71,155,247,0.09) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(238,244,255,1) 0%, #f4f7ff 100%)
                  `,
                }}
              >
                {/* Subtle dot grid overlay */}
                <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                  style={{ backgroundImage: "radial-gradient(circle, #1160CB 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

                {/* Left: text content */}
                <div className="relative z-10 space-y-6 flex flex-col items-start text-left flex-1 min-w-0">

                  {/* Main headline */}
                  <div className="space-y-3">
                    <h1 className="text-[36px] md:text-[48px] xl:text-[54px] font-bold leading-[1.1] tracking-tight text-slate-900 uppercase">
                      Power Your
                      <br />
                      <span
                        className="inline-block"
                        style={{
                          background: "linear-gradient(135deg, #1160CB 0%, #479BF7 50%, #1528A1 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Digital World
                      </span>
                    </h1>
                  </div>

                  {/* Subtext */}
                  <p className="text-[15px] text-[#0C0D10] font-normal leading-relaxed max-w-[480px]">
                    Discover premium electronics, peripherals, and accessories built for professionals, gamers, and creators.
                  </p>

                  {/* CTA row */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link to="/products">
                      <Button
                        className="h-10 w-[150px] justify-between pl-5 pr-2 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-[#1160CB]/15 transition-all duration-300 hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #1160CB, #1528A1)" }}
                      >
                        Shop Now
                        <span className="w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center text-[#1160CB]">
                          <ArrowRight size={12} />
                        </span>
                      </Button>
                    </Link>
                    <Link to="/deals">
                      <Button
                        variant="outline"
                        className="h-10 px-6 rounded-full text-[11px] font-bold uppercase tracking-widest gap-2.5 border-[#1528A1] bg-white text-[#1528A1] hover:bg-blue-50/50 transition-all duration-300"
                      >
                        View Deals
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right: hero image — full panel height, hides when a side panel is open */}
                <div
                  className={cn(
                    "absolute top-0 right-0 bottom-0 z-10 hidden lg:block w-[45%] transition-all duration-500 ease-in-out",
                    sideOpen ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
                  )}
                >
                  <img
                    src="/hero-product.png"
                    alt="Premium electronics"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* ── RIGHT panel — Best Seller ── */}
              <div
                className="group hidden md:flex overflow-hidden transition-all duration-500 ease-in-out w-[72px] hover:w-[280px] flex-shrink-0 cursor-pointer relative mx-[5px] mb-[5px] rounded-[15px] border-0"
                style={{ background: "linear-gradient(135deg, #1160CB, #1528A1)" }}
                onMouseEnter={() => { setSideOpen(true); startScrollLoop(); }}
                onMouseLeave={() => { setSideOpen(false); stopScrollLoop(); }}
                onMouseMove={handlePanelMouseMove}
              >
                {/* Collapsed label */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300 z-10">
                  <span className="text-[18px] font-semibold tracking-[4px] text-white -rotate-90 whitespace-nowrap">
                    Best Seller
                  </span>
                </div>
                {/* Expanded content — scrollable 5-product list */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-100 flex flex-col w-[280px] z-[2]">
                  {/* Header */}
                  <div className="px-4 pt-4 pb-2 flex-shrink-0">
                    <span className="text-[9px] font-black uppercase tracking-[3px] text-white/70 bg-white/15 px-2 py-1 rounded-full">
                      Best Sellers
                    </span>
                  </div>
                  {/* Scrollable product list */}
                  <div
                    ref={panelScrollRef}
                    className="flex-1 overflow-y-auto px-3 pb-4 space-y-2"
                  >
                    {bestSellers.slice(0, 5).map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex flex-col rounded-[12px] bg-white/15 hover:bg-white/25 border border-white/20 overflow-hidden transition-all duration-200"
                      >
                        {/* Image — full width */}
                        <div className="w-full h-[100px] overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Name + price */}
                        <div className="px-3 py-2">
                          <p className="text-[11px] font-semibold text-white leading-snug line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-[12px] font-black text-white/80 mt-0.5">
                            ${product.price.toFixed(0)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* ── Bottom feature strip ── */}
            <div className="relative z-10 border-t border-slate-100 bg-slate-50/50">
              <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-slate-100">
                {[
                  { icon: Truck,       text: "Free shipping over $50" },
                  { icon: ShieldCheck, text: "100% secure checkout" },
                  { icon: RotateCcw,   text: "30-day easy returns" },
                  { icon: Zap,         text: "Fast 24h dispatch" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 md:justify-center md:px-6">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #1160CB, #1528A1)" }}>
                      <Icon size={15} className="text-white" />
                    </div>
                    <span className="text-[12px] font-semibold text-[#0C0D10]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        {!isFiltered && (
          <section className="px-4 md:px-6 pt-4 pb-2">
            <div className="flex flex-col md:flex-row gap-3 max-w-[1400px] mx-auto">

              {/* ── Left panel (dark navy) ── */}
              <div className="relative flex-[2] min-h-[294px] md:min-h-[322px] rounded-none overflow-hidden bg-[#0d1b2e] flex items-center">
                {/* subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

                {/* Text — left */}
                <div className="relative z-10 p-8 md:p-10 w-full md:max-w-[60%] space-y-3 flex-shrink-0 flex flex-col items-start">
                  <Badge className="bg-white/10 text-white border-transparent text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-sm">
                    Premium Collection
                  </Badge>
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white leading-[1.15] w-full uppercase font-['Inter',sans-serif]">
                    Wide Range Of Premium Electronics
                  </h1>
                  <p className="text-slate-200 text-xs max-w-xs leading-relaxed">
                    Cutting-edge gadgets and accessories for professionals and enthusiasts alike. Quality gear for every setup.
                  </p>
                  <Link to="/products" className="inline-block pt-1">
                    <Button className="rounded-full h-8 px-5 text-[11px] font-semibold bg-[#1528A1] hover:bg-[#0f1d75] text-white border-0 shadow-lg shadow-blue-900/40 gap-1.5">
                      Browse Collection <ArrowRight size={12} />
                    </Button>
                  </Link>
                </div>

                {/* Product image — right side of left panel */}
                <div className="absolute right-0 top-0 bottom-0 w-[58%] flex items-end justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1057&auto=format&fit=crop"
                    alt="Featured electronics"
                    className="w-full h-full object-cover object-center opacity-80"
                    style={{
                      maskImage: "linear-gradient(to right, transparent 0%, black 35%)",
                      WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 35%)"
                    }}
                  />
                </div>
              </div>

              {/* ── Right panel (bright blue) ── */}
              <div className="relative flex-[1] min-h-[210px] md:min-h-[322px] rounded-none overflow-hidden bg-[#1528A1] flex flex-col justify-between p-6">
                {/* decorative circles */}
                <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />
                <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/5" />

                {/* Top: product info */}
                <div className="relative z-10 space-y-2 flex flex-col items-start">
                  <Badge className="bg-white/20 text-white border-transparent text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-sm">
                    Featured Deal
                  </Badge>
                  <h2 className="text-white font-semibold tracking-tight text-xl md:text-2xl leading-tight line-clamp-1">
                    {deals[0]?.title || newArrivals[0]?.title || "Top Pick This Week"}
                  </h2>
                </div>

                {/* Middle: product image */}
                <div className="relative z-10 flex items-center justify-center py-3 flex-grow">
                  {(deals[0] || newArrivals[0]) && (
                    <img
                      src={deals[0]?.imageUrl || newArrivals[0]?.imageUrl}
                      alt={deals[0]?.title || newArrivals[0]?.title}
                      className="max-h-36 md:max-h-48 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
                    />
                  )}
                </div>

                {/* Bottom: price + arrow */}
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-white font-black text-xl">
                      ${(deals[0]?.price || newArrivals[0]?.price || 0).toFixed(2)}
                    </p>
                    {(deals[0]?.compareAtPrice || newArrivals[0]?.compareAtPrice) && (
                      <p className="text-blue-200 text-[10px] line-through mt-0.5">
                        ${(deals[0]?.compareAtPrice || newArrivals[0]?.compareAtPrice || 0).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/product/${deals[0]?.id || newArrivals[0]?.id}`}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                  >
                    <ArrowRight size={16} className="text-[#1528A1]" />
                  </Link>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ── Promo Campaign Cards ───────────────────────────────────────────── */}
        {!isFiltered && (
          <section className="px-4 md:px-6 py-2">
            <div className="grid md:grid-cols-2 gap-3 max-w-[1400px] mx-auto">
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
                      <Icon size={20} className="text-[#1528A1] transition-colors" />
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
          <section className="py-20 bg-[#1528A1] relative overflow-hidden">
            {/* subtle grid background */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
            />
            <div className="section-container relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 border border-white/20 px-3 py-1 rounded-[50px]">
                    Flash Deals
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
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-[50px]">
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