import React from "react";
import Header from "../../components/layout/Header";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

const HomePage = () => {
  const { products } = useStore();
  const activeProducts = products.filter(p => p.status === "active");

  const categories = [
    "All", "Phone Accessories", "Chargers & Cables", "Audio", 
    "Laptop Accessories", "PC Accessories", "Gaming Accessories", "Storage Devices"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Upgrade Your Tech Setup
              </h1>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Premium electronics and accessories for your mobile, laptop, and PC. 
                Fast shipping and quality guaranteed.
              </p>
              <div className="space-x-4">
                <Button size="lg" variant="secondary" className="rounded-full px-8">
                  Shop Now
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  View Deals
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <div className="border-b bg-white sticky top-16 z-40 overflow-x-auto">
          <div className="container flex items-center h-12 gap-8 px-4">
            {categories.map(cat => (
              <button key={cat} className="text-sm font-medium whitespace-nowrap hover:text-primary transition-colors">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <section className="container py-12 px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{activeProducts.length} products found</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-bold">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>All Products</li>
                <li>New Arrivals</li>
                <li>Best Sellers</li>
                <li>Deals</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Contact Us</li>
                <li>Shipping Policy</li>
                <li>Returns & Exchanges</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Newsletter</h4>
              <p className="text-sm text-muted-foreground">Subscribe to get special offers and news.</p>
              <div className="flex gap-2">
                <input className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="Email" />
                <Button size="sm">Join</Button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2024 ElectroStore. All rights reserved.</p>
            <MadeWithDyad />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;