"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Eye, ArrowRight } from "lucide-react";
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
    toast.success(`${product.title} ${variantToAdd ? `(${variantToAdd.optionValue})` : ''} added to cart`);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const shortDescription = product.description.length > 80
    ? product.description.substring(0, 80) + "..."
    : product.description;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white border border-zinc-200 flex flex-col h-full transition-all duration-300 hover:border-black rounded-none"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50 rounded-none border-b border-zinc-100">
        <img
          src={selectedVariant?.imageUrl || product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-[#FFCC00] text-black text-[10px] font-black px-3 py-1 uppercase tracking-wider">
              -{discount}%
            </span>
          )}
          {currentStock === 0 && (
            <span className="bg-black text-white text-[10px] font-black px-3 py-1 uppercase tracking-wider">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-none w-10 h-10 bg-white hover:bg-[#FFCC00] hover:text-black transition-colors border border-black"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Eye size={18} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            {product.brand}
          </p>
          <h3 className="font-bold text-slate-900 group-hover:text-[#FFCC00] transition-colors line-clamp-1 text-sm uppercase tracking-tight">
            {product.title}
          </h3>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
          {shortDescription}
        </p>

        <div className="flex items-center gap-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                className={i < Math.floor(product.rating) ? "" : "text-zinc-200"}
              />
            ))}
          </div>
          <span className="text-[10px] text-zinc-400 font-bold">
            ({product.reviewCount})
          </span>
        </div>

        <div className="pt-2 flex items-baseline gap-2">
          <span className="text-lg font-black text-slate-900">
            ${currentPrice.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-zinc-400 line-through font-medium">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 flex justify-end">
          <Button
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="group/btn bg-black hover:bg-[#FFCC00] text-white hover:text-black rounded-none px-6 h-10 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-black shadow-none flex items-center gap-3"
          >
            Add to Cart
            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;