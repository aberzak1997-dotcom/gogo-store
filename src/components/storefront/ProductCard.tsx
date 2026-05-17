"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "../../context/StoreContext";
import { Product } from "../../types";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    toast.success(`${product.title} added to cart`);
  };

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group relative bg-white border border-slate-100 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:z-10"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.imageUrl}
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
          {product.stockQuantity === 0 && (
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
              // View logic could go here
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
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-slate-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Full-width Button */}
      <Button
        onClick={handleAddToCart}
        disabled={product.stockQuantity === 0}
        className="w-full bg-black hover:bg-slate-800 text-white rounded-none h-12 text-xs font-bold uppercase tracking-wider transition-colors border-t border-slate-100"
      >
        <ShoppingCart size={16} className="mr-2" />
        Add to Cart
      </Button>
    </Link>
  );
};

export default ProductCard;