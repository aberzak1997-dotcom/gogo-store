"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      className="group relative bg-white border border-slate-100 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:z-10"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={selectedVariant?.imageUrl || product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              -{discount}%
            </span>
          )}
          {currentStock === 0 && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-10 h-10 bg-white hover:bg-primary hover:text-white transition-colors"
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {product.brand}
          </p>
          <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {shortDescription}
        </p>

        {/* Variant Selector */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-2">
            <Select 
              value={selectedVariant?.id || ""} 
              onValueChange={(value) => {
                const variant = product.variants?.find(v => v.id === value);
                setSelectedVariant(variant || null);
              }}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map(variant => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.optionName}: {variant.optionValue} - ${variant.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                className={i < Math.floor(product.rating) ? "" : "text-slate-200"}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            ({product.reviewCount})
          </span>
        </div>

        <div className="pt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            ${currentPrice.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-slate-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 flex justify-end">
          <Button
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="group/btn bg-slate-100 hover:bg-black text-black hover:text-white rounded-full pl-6 pr-1.5 h-10 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border border-slate-500/50 shadow-none flex items-center gap-3"
          >
            Add to Cart
            <div className="w-7 h-7 rounded-full bg-white group-hover/btn:bg-white/20 flex items-center justify-center transition-colors">
              <ArrowRight size={14} className="text-black group-hover/btn:text-white" />
            </div>
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;