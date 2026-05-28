"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "../../context/StoreContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { Product, ProductVariant } from "../../types";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useStore();
  const { customer, isWishlisted, addToWishlist, removeFromWishlist } = useCustomerAuth();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!customer) { navigate("/account/login"); return; }
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product.id);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1, selectedVariant?.id);
    toast.success(`${product.title} added to cart`);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const displayImage = selectedVariant?.imageUrl || product.imageUrl || "";

  // Generate a deterministic fake review count based on product ID if reviewCount is 0 or undefined
  const fakeReviewCount = product.reviewCount && product.reviewCount > 0 
    ? product.reviewCount 
    : Math.abs(product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 85) + 12;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white flex flex-col h-full transition-all duration-200 rounded-[12px] overflow-hidden"
      style={{
        border: "1px solid #F0F2F8",
        boxShadow: "0 4px 24px rgba(21,40,161,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(21,40,161,0.14)";
        (e.currentTarget as HTMLElement).style.borderColor = "#479BF7";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(21,40,161,0.06)";
        (e.currentTarget as HTMLElement).style.borderColor = "#F0F2F8";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F0F2F8] rounded-[8px] m-3 aspect-[5/4] flex items-center justify-center p-4">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.title}
            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800&auto=format&fit=crop";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#0C0D10]/30 text-[13px]">
            No Image
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span
            className="absolute top-3 left-3 text-white text-[11px] font-medium uppercase px-2.5 py-1"
            style={{
              background: "rgba(21,40,161,0.08)",
              color: "#1160CB",
              borderRadius: 100,
              letterSpacing: "3px",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {discount}% OFF
          </span>
        )}
        {currentStock === 0 && (
          <span className="absolute top-3 left-3 bg-[#0C0D10] text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            OUT OF STOCK
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:scale-110"
        >
          <Heart
            size={15}
            className={wishlisted ? "fill-rose-500 text-rose-500" : "text-[#0C0D10]/40"}
          />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 flex flex-col flex-grow">
        {/* Brand + rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[#1160CB] font-medium"
            style={{ fontSize: 11, letterSpacing: "3px", textTransform: "uppercase" }}
          >
            {product.brand}
          </span>
          <div className="flex items-center gap-1">
            <Star size={10} fill="#FFCC00" className="text-[#FFCC00]" />
            <span className="text-[11px] text-[#0C0D10]/50 font-medium">
              {product.rating} ({fakeReviewCount})
            </span>
          </div>
        </div>

        {/* Name */}
        <h3
          className="font-semibold text-[#0C0D10] line-clamp-1 mb-3 group-hover:text-[#1528A1] transition-colors"
          style={{ fontSize: 15 }}
        >
          {product.title}
        </h3>

        {/* Price + CTA */}
        <div className="mt-auto pt-3 border-t border-[#F0F2F8] space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-[#1528A1]" style={{ fontSize: 18 }}>
              ${currentPrice.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[12px] text-[#0C0D10]/25 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            size="sm"
            className="w-full bg-[#1160CB] hover:bg-[#479BF7] text-white rounded-[8px] h-9 text-[13px] font-semibold transition-all duration-200 disabled:opacity-40"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;