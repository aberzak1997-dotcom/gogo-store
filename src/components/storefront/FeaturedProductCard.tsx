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
      <div className="bg-[#F7FAFF] rounded-[2.5rem] p-8 flex flex-col h-full transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 border border-slate-100/50">
        {/* Image Container */}
        <div className="flex-grow flex items-center justify-center mb-8 min-h-[240px]">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="max-w-full max-h-[220px] object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
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