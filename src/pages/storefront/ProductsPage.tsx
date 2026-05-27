"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/storefront/ProductCard";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const AdminIntegrationsPage = () => {
  const { addProduct, products } = useStore();

  const [importOpen, setImportOpen] = useState(false);
  const [category, setCategory] = useState("smartphones");
  const [limit, setLimit] = useState("10");
  const [previewing, setPreviewing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewItems, setPreviewItems] = useState<DummyProduct[]>([]);
  const [totalImported, setTotalImported] = useState(() => 
    parseInt(localStorage.getItem("integrations_imported") || "0")
  );

  // Fetch from DummyJSON
  const handlePreview = async () => {
    setPreviewing(true);
    setPreviewItems([]);
    try {
      const res = await fetch(
        `https://dummyjson.com/products/category/${category}?limit=${limit}`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setPreviewItems(data.products ?? []);
    } catch {
      showError("Failed to fetch products from DummyJSON API");
    } finally {
      setPreviewing(false);
    }
  };

  const handleImport = async () => {
    if (previewItems.length === 0) return;
    setImporting(true);
    setProgress(0);
    let count = 0;

    for (const p of previewItems) {
      const sku = `DJSON-${p.id}-${Date.now()}`;
      if (products.some(e => e.sku.startsWith(`DJSON-${p.id}-`))) {
        count++;
        setProgress(Math.round((count / previewItems.length) * 100));
        continue;
      }

      const compareAtPrice = p.discountPercentage > 0
        ? parseFloat((p.price / (1 - p.discountPercentage / 100)).toFixed(2))
        : undefined;

      const newProduct: Product = {
        id: `PROD-${Date.now()}-${p.id}`,
        title: p.title,
        description: p.description,
        sku: sku,
        brand: p.brand ?? "Unknown",
        category: p.category,
        subcategory: "",
        price: p.price,
        compareAtPrice,
        stockQuantity: p.stock,
        imageUrl: p.thumbnail,
        galleryImages: p.images ?? [],
        rating: parseFloat(p.rating.toFixed(1)),
        reviewCount: 0,
        status: "active",
        compatibility: [],
        specs: {},
        warranty: "1 Year",
        condition: "new",
        createdAt: new Date().toISOString(),
        variants: [],
      };

      addProduct(newProduct);
      count++;
      setProgress(Math.round((count / previewItems.length) * 100));
      await new Promise(r => setTimeout(r, 80));
    }

    const newTotal = totalImported + count;
    setTotalImported(newTotal);
    localStorage.setItem("integrations_imported", String(newTotal));
    setImporting(false);
    setImportOpen(false);
    setPreviewItems([]);
    showSuccess(`${count} products imported to your store!`);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Integrations</h1>
          <p className="text-slate-500 mt-2 font-medium">Connect suppliers, apps, and tools to grow your store</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">1 Active</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl">
            <Boxes size={16} className="text-slate-600" />
            <span className="text-sm font-bold text-slate-700">{totalImported} Imported</span>
          </div>
        </div>
      </div>

      {/* Supplier Integrations */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Truck size={18} className="text-slate-700" />
          <h2 className="text-lg font-black text-slate-800">Product Suppliers</h2>
          <Badge variant="secondary" className="text-xs">Import products directly</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "AliExpress Supplier",
              desc: "Connect your AliExpress supplier account and import dropshipping products directly.",
              icon: "🛒",
              tags: ["Dropshipping", "Global", "Auto-sync"],
              gradient: "from-orange-500 to-red-500",
              shadow: "shadow-orange-200",
              bg: "from-orange-50/30",
            },
            {
              name: "Amazon Product Feed",
              desc: "Import and sync products from Amazon marketplace with automatic pricing updates.",
              icon: "📦",
              tags: ["Amazon", "Auto-price", "FBA"],
              gradient: "from-yellow-500 to-orange-500",
              shadow: "shadow-yellow-200",
              bg: "from-yellow-50/30",
            },
            {
              name: "Dropshipping Hub",
              desc: "Access thousands of suppliers in one place. Auto-fulfill orders with one click.",
              icon: "🚀",
              tags: ["Multi-supplier", "Auto-fulfill", "Analytics"],
              gradient: "from-blue-500 to-indigo-600",
              shadow: "shadow-blue-200",
              bg: "from-blue-50/30",
            },
            {
              name: "Shopify Import",
              desc: "Migrate your existing Shopify store products, customers, and orders seamlessly.",
              icon: "🏪",
              tags: ["Migration", "Products", "Customers"],
              gradient: "from-green-500 to-teal-500",
              shadow: "shadow-green-200",
              bg: "from-green-50/30",
            },
            {
              name: "WooCommerce Sync",
              desc: "Sync products and orders from your WordPress WooCommerce store in real time.",
              icon: "🔄",
              tags: ["WordPress", "Real-time", "Orders"],
              gradient: "from-purple-500 to-pink-500",
              shadow: "shadow-purple-200",
              bg: "from-purple-50/30",
            },
          ].

          {/* Coming Soon cards */}
          {[

            {
              name: "AliExpress Supplier",
              desc: "Connect your AliExpress supplier account and import dropshipping products directly.",
              icon: "🛒",
              tags: ["Dropshipping", "Global", "Auto-sync"],
              gradient: "from-orange-500 to-red-500",
              shadow: "shadow-orange-200",
              bg: "from-orange-50/30",
            },
            {
              name: "Amazon Product Feed",
              desc: "Import and sync products from Amazon marketplace with automatic pricing updates.",
              icon: "📦",
              tags: ["Amazon", "Auto-price", "FBA"],
              gradient: "from-yellow-500 to-orange-500",
              shadow: "shadow-yellow-200",
              bg: "from-yellow-50/30",
            },
            {
              name: "Dropshipping Hub",
              desc: "Access thousands of suppliers in one place. Auto-fulfill orders with one click.",
              icon: "🚀",
              tags: ["Multi-supplier", "Auto-fulfill", "Analytics"],
              gradient: "from-blue-500 to-indigo-600",
              shadow: "shadow-blue-200",
              bg: "from-blue-50/30",
            },
            {
              name: "Shopify Sync",
              desc: "Migrate your existing Shopify store products, customers, and orders seamlessly.",
              icon: "🏪",
              tags: ["Migration", "Products", "Customers"],
              gradient: "from-green-500 to-teal-500",
              bg: "from-green-50/30",
            },
            {
              name: "WooCommerce Sync",
              desc: "Sync products and orders from your WordPress WooCommerce store in real time.",
              icon: "🔄",
              tags: ["WordPress", "Real-time", "Orders"],
              gradient: "from-purple-500 to-pink-500",
              shadow: "shadow-purple-200",
              bg: "from-purple-50/30",
            },
          ].map((int) => (
            <Card
              key={int.name}
              className={cn(
                "border border-slate-100 shadow-sm bg-gradient-to-br from-white",
                int.bg,
                isBrandsOpen && "opacity-80"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br {int.gradient} flex items-center justify-center shadow-lg shadow-{int.shadow}">
                      <Icon size={22} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-black text-slate-900">{int.name}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Clock size={11} className="mr-1" /> Soon
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Import Dialog */}
        <Dialog open={importOpen} onOpenChange={setImportOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Download size={16} className="text-white" />
                </div>
                <span>Import from DummyJSON</span>
              </DialogHeader>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
                <div className="space-y-5 pt-2">
                  {/* Config */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                      <Select value={category} onChange={setCategory} disabled={importing}>
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smartphones">Smartphones</SelectItem>
                          <SelectItem value="laptops">Laptops</SelectItem>
                          <SelectItem value="mens-watches">Men's Watches</SelectItem>
                          <SelectItem value="womens-watches">Women's Watches</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="lighting">Lighting</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="home-decoration">Home Decoration</SelectItem>
                          <SelectItem value="tops">Tops</SelectItem>
                          <SelectItem value="sunglasses">Sunglasses</SelectItem>
                        </Select>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Number of Products</label>
                      <Select value={limit} onChange={setLimit} disabled={importing}>
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 products</SelectItem>
                          <SelectItem value="10">10 products</SelectItem>
                          <SelectItem value="20">20 products</SelectItem>
                          <SelectItem value="30">30 products</SelectItem>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Preview button */}
                  {!importing && (
                    <Button
                      onClick={handlePreview}
                      disabled={previewing}
                      className="w-full rounded-xl font-bold gap-2 h-11"
                    >
                      {previewing ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Fetching products...
                        </> 
                      ) : (
                        <>
                          <RefreshCw size={16} /> Preview Products
                        </>
                      )}
                    </Button>
                  </Button>
                </div>

                {/* Progress */}
                {importing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-600">Importing products...</span>
                      <span className="text-slate-900 font-bold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3 rounded-full" />
                  </div>
                )}

                {/* Product Preview Grid */}
                {previewItems.length > 0 && !importing && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-700">
                        {previewItems.length} products ready to import
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 font-bold">
                        From dummyjson.com
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                      {previewItems.map((p) => (
                        <div key={p.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-full h-24 object-cover bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/200x200?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-bold text-slate-800 truncate">{p.title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs font-black text-emerald-600">${p.price}</p>
                            <p className="text-[10px] text-slate-400">Qty: {p.stock}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Import confirm */}
                  {previewItems.length > 0 && !importing && (
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl font-bold"
                        onClick={() => setImportOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 rounded-xl font-black gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                        onClick={handleImport}
                      >
                        <Download size={16} /> Import {previewItems.length} Products
                      </Button>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {previewItems.length === 0 && !previewing && (
                  <div className="text-center py-8 text-slate-400">
                    <Globe size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Click "Preview Products" to fetch from the API</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;