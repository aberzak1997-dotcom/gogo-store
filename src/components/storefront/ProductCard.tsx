"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Eye, Zap } from "lucide-react";
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
      return <Badge variant="destructive" className="absolute top-3 left-3 z-10">Out of Stock</Badge>;
    }
    if (product.stockQuantity < 5) {
      return <Badge variant="outline" className="absolute top-3 left-3 z-10 bg-amber-50 text-amber-700 border-amber-200">Low Stock</Badge>;
    }
    return null;
  };

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border-slate-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl">
      {/* Badges */}
      {getStockBadge()}
      {discount > 0 && (
        <Badge className="absolute top-3 right-3 z-10 bg-red-500 hover:bg-red-600">
          -{discount}%
        </Badge>
      )}

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="object-contain w-full h-full p-6 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      <CardContent className="flex-grow p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{product.brand}</span>
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 min-h-[2rem]">
          {product.description}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-slate-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 grid grid-cols-2 gap-2">
        <Link to={`/product/${product.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full rounded-xl border-slate-200 hover:bg-slate-50 gap-2">
            <Eye size={14} /> Details
          </Button>
        </Link>
        <Button 
          size="sm" 
          className="w-full rounded-xl gap-2 shadow-sm" 
          disabled={product.stockQuantity === 0}
          onClick={() => addToCart(product.id)}
        >
          <ShoppingCart size={14} /> Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;