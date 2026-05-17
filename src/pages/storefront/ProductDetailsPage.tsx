import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Plus, 
  Minus, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductCard from "../../components/storefront/ProductCard";
import { Separator } from "@/components/ui/separator";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === id);
  const [mainImage, setMainImage] = useState(product?.imageUrl || "");

  // Update main image if product changes
  React.useEffect(() => {
    if (product) setMainImage(product.imageUrl);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id && p.status === "active")
      .slice(0, 4);
  }, [product, products]);

  if (!product || product.status !== "active") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Product Unavailable</h2>
            <p className="text-slate-500 mb-6">This product is either out of stock or no longer available in our store.</p>
            <Link to="/">
              <Button className="w-full">Back to Store</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (val: number) => {
    const newQty = Math.max(1, Math.min(val, product.stockQuantity));
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    navigate("/checkout");
  };

  const getStockStatus = () => {
    if (product.stockQuantity >= 5) {
      return (
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <CheckCircle2 size={18} />
          <span>In Stock</span>
        </div>
      );
    }
    if (product.stockQuantity > 0) {
      return (
        <div className="flex items-center gap-2 text-amber-600 font-medium">
          <AlertTriangle size={18} />
          <span>Only {product.stockQuantity} left in stock</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-red-600 font-medium">
        <AlertTriangle size={18} />
        <span>Out of Stock</span>
      </div>
    );
  };

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-grow container py-8 px-4 md:px-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm border mb-12">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border group">
              <img 
                src={mainImage} 
                alt={product.title} 
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => setMainImage(product.imageUrl)}
                className={`aspect-square rounded-xl overflow-hidden bg-slate-50 border-2 transition-all ${mainImage === product.imageUrl ? 'border-primary' : 'border-transparent hover:border-slate-200'}`}
              >
                <img src={product.imageUrl} alt="" className="w-full h-full object-cover p-1" />
              </button>
              {product.galleryImages.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-slate-50 border-2 transition-all ${mainImage === img ? 'border-primary' : 'border-transparent hover:border-slate-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-primary uppercase tracking-widest">{product.brand}</p>
                <Badge variant="outline" className="bg-slate-50">{product.condition}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{product.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-md border border-amber-100">
                  <Star size={16} fill="currentColor" className="mr-1" />
                  <span className="text-sm font-bold">{product.rating}</span>
                </div>
                <span className="text-sm text-slate-500 font-medium">{product.reviewCount} reviews</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-slate-500">SKU: {product.sku}</span>
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-slate-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
                    <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">-{discount}% OFF</Badge>
                  </>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">Category:</span>
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant="secondary">{product.subcategory}</Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {product.compatibility.map(tag => (
                  <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Availability</span>
                  {getStockStatus()}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center border-2 rounded-xl bg-white w-full sm:w-auto">
                    <button 
                      className="p-3 hover:bg-slate-50 disabled:opacity-30"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-6 text-lg font-bold w-16 text-center">{quantity}</span>
                    <button 
                      className="p-3 hover:bg-slate-50 disabled:opacity-30"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stockQuantity}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg gap-2 rounded-xl"
                    disabled={product.stockQuantity === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={22} /> Add to Cart
                  </Button>
                </div>

                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full h-14 text-lg gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                  disabled={product.stockQuantity === 0}
                  onClick={handleBuyNow}
                >
                  <Zap size={22} /> Buy Now
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Truck size={20} />
                  </div>
                  <span className="text-xs font-bold">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-xs font-bold">{product.warranty} Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                    <RotateCcw size={20} />
                  </div>
                  <span className="text-xs font-bold">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="text-primary" />
              Technical Specifications
            </h2>
            <div className="bg-white rounded-2xl border overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                      <td className="px-6 py-4 font-bold text-slate-700 w-1/3 border-r">{key}</td>
                      <td className="px-6 py-4 text-slate-600">{value}</td>
                    </tr>
                  ))}
                  {Object.keys(product.specs).length === 0 && (
                    <tr>
                      <td className="px-6 py-8 text-center text-slate-500 italic">No technical specifications listed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Shipping Info</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Standard shipping takes 3-5 business days. Express shipping available at checkout. 
                All orders are tracked and insured.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Warranty Note</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                This product includes a {product.warranty} manufacturer warranty covering defects in materials and workmanship.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetailsPage;