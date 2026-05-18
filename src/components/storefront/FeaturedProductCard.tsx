"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";

interface FeaturedProductCardProps {
  product: Product;
}

const FeaturedProductCard = ({ product }: FeaturedProductCardProps) => {
  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="bg-[#F7FAFF] rounded-[2.5rem] overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
        {/* Image Container */}
        <div className="w-full flex items-center justify-center min-h-[280px] bg-white/50">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-8 space-y-2">
          <p className="text-slate-500 text-sm font-medium">
            {product.category}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {product.title}
          </h3>
          <p className="text-[#4F75FF] font-bold text-lg">
            ${product.price.toFixed(2)} USD
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedProductCard;