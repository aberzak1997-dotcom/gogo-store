"use client";

import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
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
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-white p-12 rounded-[2rem] shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-slate-900">Product Not Found</h2>
            <p className="text-slate-500 mb-8">The product you're looking for might have been removed or is temporarily unavailable.</p>
            <Link to="/">
              <Button size="lg" className="w-full rounded-2xl h-14 text-lg">Back to Store</Button>
            </Link>
          </div>
        </div>
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
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      <main className="flex-grow section-container py-8">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary mb-8 transition-colors group">
          <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-sm group relative">
              <img 
                src={mainImage} 
                alt={product.title} 
                className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-110" 
              />
              {discount > 0 && (
                <Badge className="absolute top-8 left-8 bg-red-500 text-white px-4 py-1.5 text-sm font-black rounded-full">
                  SAVE {discount}%
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => setMainImage(product.imageUrl)}
                className={cn(
                  "aspect-square rounded-2xl overflow-hidden bg-white border-2 transition-all p-2",
                  mainImage === product.imageUrl ? 'border-primary shadow-lg shadow-primary/10' : 'border-transparent hover:border-slate-200'
                )}
              >
                <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
              </button>
              {product.galleryImages.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={cn(
                    "aspect-square rounded-2xl overflow-hidden bg-white border-2 transition-all p-2",
                    mainImage === img ? 'border-primary shadow-lg shadow-primary/10' : 'border-transparent hover:border-slate-200'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 font-bold uppercase tracking-widest text-[10px]">
                  {product.brand}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500">
                    <Heart size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight leading-tight">
                {product.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100">
                  <Star size={18} fill="currentColor" />
                  <span className="text-sm font-black">{product.rating}</span>
                  <span className="text-xs text-amber-600/70 font-medium ml-1">({product.reviewCount} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-6 hidden sm:block" />
                <span className="text-sm text-slate-500 font-medium">SKU: <span className="text-slate-900">{product.sku}</span></span>
                <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  {product.condition}
                </Badge>
              </div>

              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-5xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <span className="text-2xl text-slate-300 line-through font-bold">${product.compareAtPrice.toFixed(2)}</span>
                )}
              </div>

              <div className="space-y-6 mb-10">
                <p className="text-slate-600 text-lg leading-relaxed">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 border-transparent px-3 py-1 rounded-lg font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-8">
              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Availability</span>
                  {product.stockQuantity >= 5 ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <CheckCircle2 size={20} />
                      <span>In Stock</span>
                    </div>
                  ) : product.stockQuantity > 0 ? (
                    <div className="flex items-center gap-2 text-amber-600 font-bold">
                      <AlertTriangle size={20} />
                      <span>Only {product.stockQuantity} left</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                      <AlertTriangle size={20} />
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center border-2 border-slate-100 rounded-2xl bg-slate-50/50 p-1 w-full sm:w-auto">
                    <button 
                      className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-6 text-xl font-black w-16 text-center">{quantity}</span>
                    <button 
                      className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stockQuantity}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full h-16 text-lg font-black gap-3 rounded-2xl shadow-lg shadow-primary/20"
                    disabled={product.stockQuantity === 0}
                    onClick={() => addToCart(product.id, quantity)}
                  >
                    <ShoppingCart size={24} /> Add to Cart
                  </Button>
                </div>

                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full h-16 text-lg font-black gap-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
                  disabled={product.stockQuantity === 0}
                  onClick={() => {
                    addToCart(product.id, quantity);
                    navigate("/checkout");
                  }}
                >
                  <Zap size={24} /> Buy Now
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: "Free Shipping", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: ShieldCheck, label: product.warranty, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { icon: RotateCcw, label: "30-Day Returns", color: "text-purple-600", bg: "bg-purple-50" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-white border border-slate-100">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", item.bg, item.color)}>
                      <item.icon size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="grid lg:grid-cols-3 gap-16 mb-20">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-slate-900">
              <Info className="text-primary" size={32} />
              Technical Specifications
            </h2>
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <tr key={key} className={cn(i % 2 === 0 ? 'bg-slate-50/30' : 'bg-white')}>
                      <td className="px-8 py-5 font-bold text-slate-900 w-1/3 border-r border-slate-100">{key}</td>
                      <td className="px-8 py-5 text-slate-600">{value}</td>
                    </tr>
                  ))}
                  {Object.keys(product.specs).length === 0 && (
                    <tr>
                      <td className="px-8 py-12 text-center text-slate-400 italic">No technical specifications listed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-xl mb-4 text-slate-900">Shipping Info</h3>
              <p className="text-slate-500 leading-relaxed">
                Standard shipping takes 3-5 business days. Express shipping available at checkout. 
                All orders are tracked and insured for your peace of mind.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-xl mb-4 text-slate-900">Warranty Note</h3>
              <p className="text-slate-500 leading-relaxed">
                This product includes a {product.warranty} manufacturer warranty covering defects in materials and workmanship. Extended protection plans available.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-20 border-t border-slate-200">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Related Products</h2>
              <Button variant="ghost" className="font-bold text-primary">View Category</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetailsPage;