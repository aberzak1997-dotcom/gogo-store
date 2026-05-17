"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Eye, Plus } from "lucide-react";
import { Product } from "../../types";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const getStockBadge = () => {
    if (product.stockQuantity === 0) {
      return <Badge variant="destructive" className="absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">Out of Stock</Badge>;
    }
    if (product.stockQuantity < 5) {
      return <Badge variant="outline" className="absolute top-4 left-4 z-10 bg-amber-50 text-amber-700 border-amber-200 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">Low Stock</Badge>;
    }
    return null;
  };

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border border-slate-800 bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 rounded-[10px]">
      {/* Badges */}
      {getStockBadge()}
      {discount > 0 && (
        <Badge className="absolute top-4 right-4 z-10 bg-primary text-white rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
          -{discount}%
        </Badge>
      )}

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-50/50 m-4 rounded-[8px]">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="object-contain w-full h-full p-2 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Quick Add Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-[80%]">
          <Button 
            className="w-full rounded-full h-10 font-black text-[10px] uppercase tracking-widest shadow-xl" 
            disabled={product.stockQuantity === 0}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id);
            }}
          >
            <Plus size={14} className="mr-2" /> Quick Add
          </Button>
        </div>
      </Link>

      <CardContent className="flex-grow px-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{product.brand}</span>
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-black text-slate-700">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors text-lg tracking-tight">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 min-h-[2rem] leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-slate-300 line-through font-bold">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <Link to={`/product/${product.id}`} className="w-full">
          <Button variant="ghost" size="sm" className="w-full rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 font-bold text-xs gap-2">
            View Details <Eye size={14} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;