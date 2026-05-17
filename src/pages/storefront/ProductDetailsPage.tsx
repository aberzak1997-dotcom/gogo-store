import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products, addToCart } = useStore();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <Link to="/">
              <Button>Back to Store</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-grow container py-8 px-4 md:px-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft size={16} className="mr-1" /> Back to products
        </Link>

        <div className="grid md:grid-cols-2 gap-12 bg-white p-6 rounded-xl shadow-sm border">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-md overflow-hidden bg-muted border cursor-pointer hover:opacity-80">
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className={i <= Math.floor(product.rating) ? "fill-current" : "text-slate-300"}>★</span>
                  ))}
                  <span className="text-sm font-medium text-foreground ml-2">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
                <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
              </div>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <span className="text-xl text-muted-foreground line-through">${product.compareAtPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 mt-auto">
              <div className="flex items-center gap-4">
                <Button 
                  size="lg" 
                  className="flex-grow h-12 text-lg gap-2"
                  disabled={product.stockQuantity === 0}
                  onClick={() => addToCart(product.id)}
                >
                  <ShoppingCart size={20} /> Add to Cart
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Truck size={18} className="text-primary" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck size={18} className="text-primary" />
                  <span>{product.warranty} Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RotateCcw size={18} className="text-primary" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;