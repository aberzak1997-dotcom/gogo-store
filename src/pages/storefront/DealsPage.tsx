"use client";

import React, { useMemo } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Zap } from "lucide-react";

const DealsPage = () => {
  const { products } = useStore();
  
  const deals = useMemo(() => {
    return products
      .filter(p => p.status === "active" && p.compareAtPrice && p.compareAtPrice > p.price);
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider">
            <Zap size={14} fill="currentColor" /> Limited Time
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Deals of the Week</h1>
          <p className="text-slate-500 text-lg">
            Save on selected electronics and accessories. Premium tech at unbeatable prices.
          </p>
        </div>

        {deals.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-none border border-dashed border-slate-200">
            <Zap className="mx-auto h-16 w-16 text-slate-200 mb-4" />
            <h3 className="text-2xl font-black text-slate-900">No active deals</h3>
            <p className="text-slate-500 mt-2">Check back soon for new discounts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {deals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DealsPage;