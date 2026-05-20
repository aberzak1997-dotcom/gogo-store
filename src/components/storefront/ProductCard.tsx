"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Eye, ShoppingCart, Heart } from "lucide-react";
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

  // Updated image source with the requested URL
  const displayImage = "https://m.media-amazon.com/images/I/61UbN2cd6TL._AC_SL1500_.jpg";

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white border border-slate-100 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 rounded-2xl overflow-hidden"
    >
      {/* Image Container - Redesigned with HP style */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 m-2 rounded-xl">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
        />

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

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            ${currentPrice.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-slate-300 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          <Button
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="w-full bg-slate-50 hover:bg-[#0096D6] text-slate-600 hover:text-white rounded-full h-10 text-[11px] font-bold transition-all duration-300 border-none shadow-none flex items-center gap-2"
          >
            <ShoppingCart size={14} /> Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;