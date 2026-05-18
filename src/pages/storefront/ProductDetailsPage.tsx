"use client";

import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
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
  Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductCard from "../../components/storefront/ProductCard";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === id);
  const [mainImage, setMainImage] = useState(product?.imageUrl || "");

  React.useEffect(() => {
    if (product) setMainImage(product.imageUrl);
    window.scrollTo(0, 0);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id && p.status === "active")
      .slice(0, 4);
  }, [product, products]);

  if (!product || product.status !== "active") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-slate-50 p-12 rounded-[3rem] border border-slate-100">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Info className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-semibold mb-4 text-slate-900 tracking-tight">Product Not Found</h2>
            <p className="text-slate-500 mb-8 text-sm">The product you're looking for might have been removed or is temporarily unavailable.</p>
            <Link to="/">
              <Button size="lg" className="w-full rounded-full h-12 text-sm font-medium">Back to Store</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleQuantityChange = (val: number) => {
    const newQty = Math.max(1, Math.min(val, product.stockQuantity));
    setQuantity(newQty);
  };

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow section-container py-12 px-6">
        <Link to="/products" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary mb-12 transition-colors group">
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to products
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* Left: Image Gallery */}
          <div className="space-y-8">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-slate-50/50 border border-slate-100 group relative">
              <img 
                src={mainImage} 
                alt={product.title} 
                className="w-full h-full object-contain p-16 transition-transform duration-700 group-hover:scale-110" 
              />
              {discount > 0 && (
                <Badge className="absolute top-8 left-8 bg-primary text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  SAVE {discount}%
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => setMainImage(product.imageUrl)}
                className={cn(
                  "aspect-square rounded-2xl overflow-hidden bg-slate-50 border-2 transition-all p-3",
                  mainImage === product.imageUrl ? 'border-primary shadow-xl shadow-primary/10' : 'border-transparent hover:border-slate-200'
                )}
              >
                <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
              </button>
              {product.galleryImages.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={cn(
                    "aspect-square rounded-2xl overflow-hidden bg-slate-50 border-2 transition-all p-3",
                    mainImage === img ? 'border-primary shadow-xl shadow-primary/10' : 'border-transparent hover:border-slate-200'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <Badge variant="secondary" className="bg-slate-100 text-slate-900 border-transparent px-4 py-1.5 font-bold uppercase tracking-[0.2em] text-[10px] rounded-full">
                  {product.brand}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-rose-50 hover:text-rose-500">
                    <Heart size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50">
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-slate-900 tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8 mb-10">
                <div className="flex items-center gap-2 text-amber-400">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-slate-200"} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-900 ml-1">{product.rating}</span>
                  <span className="text-xs text-slate-400 font-medium ml-1">({product.reviewCount} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-6 hidden sm:block" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SKU: <span className="text-slate-900">{product.sku}</span></span>
                <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                  {product.condition}
                </Badge>
              </div>

              <div className="flex items-baseline gap-4 mb-12">
                <span className="text-3xl font-semibold text-slate-900 tracking-tight">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <span className="text-xl text-slate-300 line-through font-medium tracking-tight">${product.compareAtPrice.toFixed(2)}</span>
                )}
              </div>

              <div className="space-y-8 mb-12">
                <p className="text-slate-500 text-sm leading-relaxed">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-slate-50 text-slate-500 border-slate-100 px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-8">
              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Availability</span>
                  {product.stockQuantity >= 5 ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                      <CheckCircle2 size={14} />
                      <span>In Stock</span>
                    </div>
                  ) : product.stockQuantity > 0 ? (
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-[10px] uppercase tracking-widest">
                      <AlertTriangle size={14} />
                      <span>Only {product.stockQuantity} left</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-[10px] uppercase tracking-widest">
                      <AlertTriangle size={14} />
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center border border-slate-100 rounded-full bg-slate-50/50 p-1 w-full sm:w-auto">
                    <button 
                      className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-30"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 text-sm font-semibold w-10 text-center">{quantity}</span>
                    <button 
                      className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-30"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stockQuantity}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="w-full h-11 text-[10px] font-bold uppercase tracking-widest gap-3 rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    disabled={product.stockQuantity === 0}
                    onClick={() => addToCart(product.id, quantity)}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </Button>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-11 text-[10px] font-bold uppercase tracking-widest gap-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-none"
                  disabled={product.stockQuantity === 0}
                  onClick={() => {
                    addToCart(product.id, quantity);
                    navigate("/checkout");
                  }}
                >
                  <Zap size={16} /> Buy Now
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: "Free Shipping", color: "text-slate-600", bg: "bg-slate-50" },
                  { icon: ShieldCheck, label: product.warranty, color: "text-slate-600", bg: "bg-slate-50" },
                  { icon: RotateCcw, label: "30-Day Returns", color: "text-slate-600", bg: "bg-slate-50" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-3 p-6 rounded-[2rem] bg-white border border-slate-100">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg, item.color)}>
                      <item.icon size={20} />
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="grid lg:grid-cols-3 gap-20 mb-24">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-10 flex items-center gap-4 text-slate-900 tracking-tight">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Info size={24} />
              </div>
              Technical Specifications
            </h2>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <tr key={key} className={cn(i % 2 === 0 ? 'bg-slate-50/30' : 'bg-white')}>
                      <td className="px-10 py-6 font-bold text-slate-900 w-1/3 border-r border-slate-100 text-xs uppercase tracking-widest">{key}</td>
                      <td className="px-10 py-6 text-slate-500 font-medium">{value}</td>
                    </tr>
                  ))}
                  {Object.keys(product.specs).length === 0 && (
                    <tr>
                      <td className="px-10 py-16 text-center text-slate-400 italic font-medium">No technical specifications listed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-slate-900">Shipping Info</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                Standard shipping takes 3-5 business days. Express shipping available at checkout. 
                All orders are tracked and insured for your peace of mind.
              </p>
            </div>
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-slate-900">Warranty Note</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                This product includes a {product.warranty} manufacturer warranty covering defects in materials and workmanship. Extended protection plans available.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-24 border-t border-slate-100">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Related Products</h2>
              <Link to={`/products?category=${product.category}`}>
                <Button variant="ghost" className="font-bold text-[10px] uppercase tracking-widest text-primary">View Category</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;