"use client";

import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from "../../components/storefront/ProductCard";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Plus,
  Minus,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Share2,
  Heart,
  Package,
  MessageSquare,
  Cpu,
  ThumbsUp,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Tab types ─────────────────────────────────────────────────────────────────
type Tab = "specs" | "reviews" | "shipping";

// ─── Star rating display ───────────────────────────────────────────────────────
const StarRow = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < Math.floor(rating) ? "#FBBF24" : "none"}
        className={i < Math.floor(rating) ? "text-amber-400" : "text-slate-200"}
      />
    ))}
  </div>
);

// ─── Mock reviews (replace with real data when available) ─────────────────────
const mockReviews = [
  {
    id: 1,
    name: "Alex T.",
    avatar: "AT",
    rating: 5,
    date: "2 weeks ago",
    title: "Exceeded my expectations",
    body: "Build quality is outstanding. Setup was effortless and performance has been flawless. Would definitely recommend.",
    helpful: 14,
  },
  {
    id: 2,
    name: "Maria L.",
    avatar: "ML",
    rating: 4,
    date: "1 month ago",
    title: "Great product, fast shipping",
    body: "Arrived well packaged and works exactly as described. Took off one star only because the cable could be longer.",
    helpful: 8,
  },
  {
    id: 3,
    name: "David K.",
    avatar: "DK",
    rating: 5,
    date: "1 month ago",
    title: "Worth every penny",
    body: "Premium feel from the moment you open the box. This has become an essential part of my daily setup.",
    helpful: 22,
  },
];

// ─── Main component ────────────────────────────────────────────────────────────
const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("specs");
  const [wishlisted, setWishlisted] = useState(false);
  const [thumbsUp, setThumbsUp] = useState<number[]>([]);

  const product = products.find((p) => p.id === id);
  const [mainImage, setMainImage] = useState(product?.imageUrl || "");

  React.useEffect(() => {
    if (product) setMainImage(product.imageUrl);
    window.scrollTo(0, 0);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id && p.status === "active")
      .slice(0, 4);
  }, [product, products]);

  // ── Not found state ──
  if (!product || product.status !== "active") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="text-center max-w-md space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Info className="h-9 w-9 text-slate-300" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Product not found</h2>
              <p className="text-slate-400 text-sm">This item may have been removed or is temporarily unavailable.</p>
            </div>
            <Link to="/products">
              <Button className="rounded-full px-8">Back to products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Helpers ──
  const handleQty = (val: number) =>
    setQuantity(Math.max(1, Math.min(val, product.stockQuantity)));

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success(`${product.title} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    navigate("/checkout");
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.title, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const allImages = [product.imageUrl, ...(product.galleryImages || [])];

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "specs", label: "Specifications", icon: Cpu },
    { key: "reviews", label: `Reviews (${product.reviewCount})`, icon: MessageSquare },
    { key: "shipping", label: "Shipping & Returns", icon: Package },
  ];

  const stockStatus =
    product.stockQuantity === 0
      ? { label: "Out of Stock", color: "text-rose-600 bg-rose-50", icon: AlertTriangle }
      : product.stockQuantity < 5
      ? { label: `Only ${product.stockQuantity} left`, color: "text-amber-600 bg-amber-50", icon: AlertTriangle }
      : { label: "In Stock", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle2 };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <div className="section-container px-6 pt-8 pb-0">
          <nav className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/products" className="hover:text-slate-900 transition-colors">Products</Link>
            <ChevronRight size={12} />
            <Link to={`/products?category=${product.category}`} className="hover:text-slate-900 transition-colors">
              {product.category}
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>

        {/* ── Main product section ─────────────────────────────────────────── */}
        <section className="section-container px-6 py-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                />
                {discount > 0 && (
                  <div className="absolute top-5 left-5">
                    <Badge className="bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      −{discount}%
                    </Badge>
                  </div>
                )}
                {product.stockQuantity === 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-slate-500 font-semibold text-sm bg-white px-5 py-2.5 rounded-full border border-slate-200">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(img)}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden bg-slate-50 p-2 transition-all",
                        mainImage === img
                          ? "border-primary shadow-md shadow-primary/10"
                          : "border-transparent hover:border-slate-200"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* Brand + actions */}
              <div className="flex items-center justify-between mb-5">
                <Link
                  to={`/products?q=${encodeURIComponent(product.brand)}`}
                  className="text-[11px] font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  {product.brand}
                </Link>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full w-9 h-9 transition-colors",
                      wishlisted
                        ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                        : "hover:bg-rose-50 hover:text-rose-500"
                    )}
                    onClick={() => {
                      setWishlisted((w) => !w);
                      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
                    }}
                  >
                    <Heart size={17} fill={wishlisted ? "currentColor" : "none"} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-9 h-9 hover:bg-slate-100"
                    onClick={handleShare}
                  >
                    <Share2 size={17} />
                  </Button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-5">
                {product.title}
              </h1>

              {/* Rating row */}
              <div className="flex flex-wrap items-center gap-4 mb-7">
                <div className="flex items-center gap-2">
                  <StarRow rating={product.rating} size={15} />
                  <span className="text-sm font-semibold text-slate-900">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  SKU: <span className="text-slate-700">{product.sku}</span>
                </span>
                <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  {product.condition}
                </Badge>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-7">
                <span className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-lg text-slate-300 line-through">${product.compareAtPrice.toFixed(2)}</span>
                    <Badge className="bg-rose-50 text-rose-600 border-transparent rounded-full text-[10px] font-bold">
                      Save ${(product.compareAtPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Short description */}
              <p className="text-slate-500 text-sm leading-relaxed mb-7">
                {product.description}
              </p>

              {/* Compatibility tags */}
              {product.compatibility?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.compatibility.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-slate-50 text-slate-500 border-slate-100 rounded-full px-3 py-1 text-[11px] font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator className="mb-8" />

              {/* Stock status */}
              <div className={cn("inline-flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest mb-8 w-fit", stockStatus.color)}>
                <stockStatus.icon size={13} />
                {stockStatus.label}
              </div>

              {/* Quantity + Add to cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="flex items-center border border-slate-200 rounded-full bg-slate-50/50 p-1 w-fit">
                  <button
                    className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-30"
                    onClick={() => handleQty(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={15} />
                  </button>
                  <span className="px-5 text-sm font-semibold min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-30"
                    onClick={() => handleQty(quantity + 1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12 text-[11px] font-bold uppercase tracking-widest gap-2 rounded-full border-slate-200"
                  disabled={product.stockQuantity === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </Button>
              </div>

              <Button
                size="lg"
                className="w-full h-12 text-[11px] font-bold uppercase tracking-widest gap-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10 mb-8"
                disabled={product.stockQuantity === 0}
                onClick={handleBuyNow}
              >
                <Zap size={16} /> Buy Now
              </Button>

              {/* Trust icons */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "Free Shipping" },
                  { icon: ShieldCheck, label: product.warranty || "1-Year Warranty" },
                  { icon: RotateCcw, label: "30-Day Returns" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <item.icon size={18} className="text-slate-500" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Sticky mobile CTA ────────────────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 flex gap-3 shadow-lg shadow-slate-900/5">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-full text-xs font-bold gap-2 border-slate-200"
            disabled={product.stockQuantity === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={15} /> Add to Cart
          </Button>
          <Button
            className="flex-1 h-12 rounded-full text-xs font-bold gap-2 bg-slate-900 hover:bg-slate-800"
            disabled={product.stockQuantity === 0}
            onClick={handleBuyNow}
          >
            <Zap size={15} /> Buy Now
          </Button>
        </div>

        {/* ── Tabs: Specs / Reviews / Shipping ─────────────────────────────── */}
        <section className="section-container px-6 pb-16">
          {/* Tab bar */}
          <div className="flex border-b border-slate-100 mb-10 gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors",
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  )}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── Tab: Specs ── */}
          {activeTab === "specs" && (
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                {Object.keys(product.specs).length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Cpu className="mx-auto mb-4 text-slate-200" size={40} />
                    <p className="text-sm">No specifications listed for this product.</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-100 overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(product.specs).map(([key, value], i) => (
                          <tr key={key} className={i % 2 === 0 ? "bg-slate-50/40" : "bg-white"}>
                            <td className="px-8 py-5 font-semibold text-slate-700 w-2/5 border-r border-slate-100 text-sm">
                              {key}
                            </td>
                            <td className="px-8 py-5 text-slate-500 text-sm">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Key features sidebar */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Highlights</h3>
                <div className="space-y-3">
                  {[
                    { icon: Award, text: "Premium build quality" },
                    { icon: Zap, text: "High-performance components" },
                    { icon: ShieldCheck, text: product.warranty || "1-year warranty included" },
                    { icon: Package, text: "Complete in-box accessories" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <item.icon size={16} className="text-primary flex-shrink-0" />
                      <span className="text-sm text-slate-600">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Reviews ── */}
          {activeTab === "reviews" && (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Rating summary */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center gap-4 h-fit">
                <span className="text-6xl font-bold text-slate-900">{product.rating}</span>
                <StarRow rating={product.rating} size={22} />
                <p className="text-sm text-slate-400">{product.reviewCount} verified reviews</p>
                {/* Rating bars */}
                <div className="w-full space-y-2 mt-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const pct = stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="w-3 text-right">{stars}</span>
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              <div className="lg:col-span-2 space-y-5">
                {mockReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl border border-slate-100 p-7 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {review.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                          <p className="text-[11px] text-slate-400">{review.date}</p>
                        </div>
                      </div>
                      <StarRow rating={review.rating} size={13} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{review.title}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{review.body}</p>
                    <button
                      onClick={() =>
                        setThumbsUp((prev) =>
                          prev.includes(review.id)
                            ? prev.filter((id) => id !== review.id)
                            : [...prev, review.id]
                        )
                      }
                      className={cn(
                        "flex items-center gap-2 text-[11px] font-medium transition-colors",
                        thumbsUp.includes(review.id)
                          ? "text-primary"
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <ThumbsUp size={13} />
                      Helpful ({review.helpful + (thumbsUp.includes(review.id) ? 1 : 0)})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Shipping & Returns ── */}
          {activeTab === "shipping" && (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              {[
                {
                  icon: Truck,
                  title: "Shipping",
                  color: "text-primary bg-primary/8",
                  items: [
                    "Standard shipping: 3–5 business days ($9.99)",
                    "Express shipping: 1–2 business days ($19.99)",
                    "Free shipping on orders over $100",
                    "Orders placed before 2 PM ship same day",
                    "Full tracking available for all orders",
                  ],
                },
                {
                  icon: RotateCcw,
                  title: "Returns",
                  color: "text-orange-500 bg-orange-50",
                  items: [
                    "30-day hassle-free return window",
                    "Item must be in original packaging",
                    "All accessories and seals must be intact",
                    "Contact support to start a return",
                    "Refunds processed within 3–5 business days",
                  ],
                },
                {
                  icon: ShieldCheck,
                  title: "Warranty",
                  color: "text-emerald-600 bg-emerald-50",
                  items: [
                    `${product.warranty || "1-year"} standard manufacturer warranty`,
                    "Covers defects in materials and workmanship",
                    "Does not cover accidental damage",
                    "Claims processed within 7–10 business days",
                    "Extended protection plans available",
                  ],
                },
                {
                  icon: Package,
                  title: "Packaging",
                  color: "text-slate-600 bg-slate-100",
                  items: [
                    "Anti-static protective packaging",
                    "Shock-absorbent cushioning",
                    "Environmentally responsible materials",
                    "Secure outer box for all shipments",
                    "Discreet packaging available on request",
                  ],
                },
              ].map((section, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 p-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", section.color)}>
                      <section.icon size={18} />
                    </div>
                    <h3 className="font-semibold text-slate-900">{section.title}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-slate-500">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Related Products ─────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="section-container px-6 pb-24">
            <div className="border-t border-slate-100 pt-14">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">More like this</p>
                  <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Related Products</h2>
                </div>
                <Link to={`/products?category=${product.category}`}>
                  <Button variant="outline" className="rounded-full h-9 px-5 text-xs font-semibold gap-1.5">
                    View category <ChevronRight size={13} />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* extra bottom padding on mobile for sticky CTA */}
      <div className="h-20 lg:hidden" />
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
