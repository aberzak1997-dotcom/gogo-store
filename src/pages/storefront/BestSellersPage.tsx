"use client";

import React, { useMemo } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Star } from "lucide-react";

const BestSellersPage = () => {
  const { products } = useStore();
  
  const bestSellers = useMemo(() => {
    return products
      .filter(p => p.status === "active")
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 12);
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <Star size={14} fill="currentColor" /> Top Rated
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Best Sellers</h1>
          <p className="text-slate-500 text-lg">
            Our most popular tech accessories and electronics. Trusted by thousands of customers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BestSellersPage;