"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "../../context/StoreContext";
import { Product, ProductVariant } from "../../types";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variantToAdd = selectedVariant || null;
    const quantity = 1;
    
    addToCart(product.id, quantity, variantToAdd?.id);
    toast.success(`${product.title} added to cart`);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

  // Prioritize the image URL exactly as defined in the dashboard data
  const displayImage = selectedVariant?.imageUrl || product.imageUrl || "";

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white border border-slate-200 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 rounded-2xl overflow-hidden"
    >
      {/* Image Container - Optimized for dashboard images */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 m-2 rounded-xl flex items-center justify-center">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Fallback to a clear placeholder only if the dashboard link is broken
              target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800&auto=format&fit=crop";
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium">
            No Image Provided
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-[#0096D6] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
              {discount}% OFF
            </span>
          )}
          {currentStock === 0 && (
            <span className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Eye size={18} className="text-slate-600" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart size={18} className="text-slate-600" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-2 flex flex-col flex-grow space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {product.brand}
            </p>
            <div className="flex items-center gap-1">
              <Star size={10} fill="#FFCC00" className="text-[#FFCC00]" />
              <span className="text-[10px] text-slate-500 font-bold">{product.rating}</span>
            </div>
          </div>
          <h3 className="font-bold text-slate-900 group-hover:text-[#0096D6] transition-colors line-clamp-1">
            {product.title}
          </h3>
        </div>

        {/* Updated Footer Section: Price left, Buy button right */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900">
                ${currentPrice.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-[10px] text-slate-300 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div>
            <Button
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              size="sm"
              className="bg-slate-900 hover:bg-[#0096D6] text-white rounded-full px-6 h-8 text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg shadow-slate-100"
            >
              Buy
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;