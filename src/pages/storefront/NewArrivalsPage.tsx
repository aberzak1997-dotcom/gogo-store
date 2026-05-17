"use client";

import React, { useMemo } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Zap } from "lucide-react";

const NewArrivalsPage = () => {
  const { products } = useStore();
  
  const newArrivals = useMemo(() => {
    return products
      .filter(p => p.status === "active")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 12);
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Zap size={14} /> Just Landed
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">New Arrivals</h1>
          <p className="text-slate-500 text-lg">
            The latest electronics, mobile accessories, and PC gear. Stay ahead of the curve with our newest tech.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewArrivalsPage;