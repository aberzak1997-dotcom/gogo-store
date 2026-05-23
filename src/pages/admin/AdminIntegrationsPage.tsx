import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Product } from "../../types";
import { showSuccess, showError } from "../../utils/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Package, Zap, CheckCircle2, Clock, Download, RefreshCw,
  ExternalLink, Globe, Mail, BarChart3, Truck, ShoppingBag,
  Plug, Link2, AlertCircle, Boxes, Star, TrendingUp, ChevronRight
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

const DUMMYJSON_CATEGORIES = [
  { value: "smartphones", label: "Smartphones" },
  { value: "laptops", label: "Laptops" },
  { value: "mens-watches", label: "Men's Watches" },
  { value: "womens-watches", label: "Women's Watches" },
  { value: "automotive", label: "Automotive" },
  { value: "lighting", label: "Lighting" },
  { value: "furniture", label: "Furniture" },
  { value: "home-decoration", label: "Home Decoration" },
  { value: "tops", label: "Tops" },
  { value: "sunglasses", label: "Sunglasses" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

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

  // ─── DummyJSON Fetch ───────────────────────────────────────────────────────

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
      // Skip if SKU already exists
      if (products.some(existing => existing.sku.startsWith(`DJSON-${p.id}-`))) {
        count++;
        setProgress(Math.round((count / previewItems.length) * 100));
        continue;
      }

      const compareAtPrice =
        p.discountPercentage > 0
          ? parseFloat((p.price / (1 - p.discountPercentage / 100)).toFixed(2))
          : undefined;

      const newProduct: Product = {
        id: `PROD-${Date.now()}-${p.id}`,
        title: p.title,
        description: p.description,
        sku,
        brand: p.brand || "Unknown",
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

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Integrations</h1>
          <p className="text-slate-500 mt-1">Connect suppliers, apps, and tools to grow your store</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">1 Active</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl">
            <Boxes size={16} className="text-slate-600" />
            <span className="text-sm font-bold text-slate-700">{totalImported} Imported</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Connected", value: "1", icon: Plug, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Available", value: "8", icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Products Imported", value: String(totalImported), icon: Package, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Store Products", value: String(products.length), icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-50" },
        ].map(s => (
          <Card key={s.label} className="border-slate-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Supplier Integrations ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Truck size={18} className="text-slate-700" />
          <h2 className="text-lg font-black text-slate-800">Product Suppliers</h2>
          <Badge variant="secondary" className="text-xs">Import products directly</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* ── DummyJSON — ACTIVE & FUNCTIONAL ─────────────────────────── */}
          <Card className="border-2 border-emerald-200 shadow-md bg-gradient-to-br from-white to-emerald-50/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-full -translate-y-8 translate-x-8" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Globe size={22} className="text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-slate-900">DummyJSON API</CardTitle>
                    <CardDescription className="text-xs">Test product supplier</CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold text-xs">
                  <CheckCircle2 size={11} className="mr-1" /> Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Import real product data from DummyJSON — a free test API with 100+ products across smartphones, laptops, watches, and more.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Smartphones", "Laptops", "Watches", "10 categories"].map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://dummyjson.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink size={12} /> dummyjson.com
                </a>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-md shadow-emerald-200"
                  onClick={() => { setImportOpen(true); setPreviewItems([]); }}
                >
                  <Download size={14} /> Import Products
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Coming Soon cards ─────────────────────────────────────────── */}
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
          ].map(int => (
            <Card
              key={int.name}
              className={`border border-slate-100 shadow-sm bg-gradient-to-br from-white ${int.bg} relative overflow-hidden opacity-80`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${int.gradient} flex items-center justify-center text-xl shadow-lg ${int.shadow}`}>
                      {int.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base font-black text-slate-900">{int.name}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-bold text-slate-500">
                    <Clock size={11} className="mr-1" /> Soon
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-500">{int.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {int.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full rounded-xl font-bold text-slate-400 border-slate-200" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          ))}

        </div>
      </section>

      {/* ── App Integrations ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-slate-700" />
          <h2 className="text-lg font-black text-slate-800">Apps & Tools</h2>
          <Badge variant="secondary" className="text-xs">Marketing, analytics & more</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              name: "Mailchimp",
              desc: "Sync customers and send automated email campaigns.",
              icon: Mail,
              gradient: "from-yellow-400 to-orange-500",
              color: "text-yellow-600",
              bg: "bg-yellow-50",
            },
            {
              name: "Google Analytics",
              desc: "Track store visits, conversions, and revenue.",
              icon: BarChart3,
              gradient: "from-blue-400 to-cyan-500",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              name: "Facebook Pixel",
              desc: "Retarget visitors and track ad conversions.",
              icon: TrendingUp,
              gradient: "from-blue-600 to-indigo-600",
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              name: "Zapier",
              desc: "Automate workflows with 5000+ apps.",
              icon: Zap,
              gradient: "from-orange-500 to-red-500",
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              name: "WhatsApp Business",
              desc: "Send order notifications via WhatsApp.",
              icon: Globe,
              gradient: "from-green-500 to-emerald-600",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              name: "Review.io",
              desc: "Collect and display verified product reviews.",
              icon: Star,
              gradient: "from-yellow-500 to-amber-600",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              name: "ShipStation",
              desc: "Manage all your shipping carriers in one dashboard.",
              icon: Truck,
              gradient: "from-slate-500 to-slate-700",
              color: "text-slate-600",
              bg: "bg-slate-100",
            },
            {
              name: "Zendesk",
              desc: "Handle customer support tickets seamlessly.",
              icon: AlertCircle,
              gradient: "from-green-400 to-teal-500",
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
          ].map(app => (
            <Card key={app.name} className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-sm`}>
                    <app.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900">{app.name}</p>
                    <Badge variant="secondary" className="text-[10px] font-bold text-slate-400 px-1.5 py-0">
                      <Clock size={9} className="mr-0.5" /> Soon
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{app.desc}</p>
                <Button variant="outline" size="sm" className="w-full rounded-lg font-bold text-xs text-slate-400 border-slate-200 h-8" disabled>
                  Connect <ChevronRight size={12} className="ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── API Key section ───────────────────────────────────────────────── */}
      <Card className="border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Link2 size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg">Need a custom integration?</h3>
              <p className="text-slate-400 text-sm mt-0.5">Use our REST API to connect any supplier or tool</p>
            </div>
          </div>
          <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl gap-2 shadow-lg" disabled>
            <ExternalLink size={16} /> API Docs <Badge className="bg-slate-200 text-slate-600 text-xs ml-1">Soon</Badge>
          </Button>
        </CardContent>
      </Card>

      {/* ── Import Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={importOpen} onOpenChange={v => { if (!importing) setImportOpen(v); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Download size={16} className="text-white" />
              </div>
              Import from DummyJSON
            </DialogTitle>
            <DialogDescription>
              Select a category and how many products to import. Preview them first, then confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Config */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <Select value={category} onValueChange={setCategory} disabled={importing}>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DUMMYJSON_CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Number of Products</label>
                <Select value={limit} onValueChange={setLimit} disabled={importing}>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 products</SelectItem>
                    <SelectItem value="10">10 products</SelectItem>
                    <SelectItem value="20">20 products</SelectItem>
                    <SelectItem value="30">30 products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview button */}
            {!importing && (
              <Button
                onClick={handlePreview}
                disabled={previewing}
                className="w-full rounded-xl font-bold gap-2 h-11"
                variant="outline"
              >
                {previewing ? (
                  <><RefreshCw size={16} className="animate-spin" /> Fetching products...</>
                ) : (
                  <><RefreshCw size={16} /> {previewItems.length > 0 ? "Refresh Preview" : "Preview Products"}</>
                )}
              </Button>
            )}

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
                  <p className="text-sm font-bold text-slate-700">
                    {previewItems.length} products ready to import
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-700 font-bold">
                    From dummyjson.com
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                  {previewItems.map(p => (
                    <div
                      key={p.id}
                      className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-full h-24 object-cover bg-slate-100"
                        onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=No+Image"; }}
                      />
                      <div className="p-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{p.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs font-black text-emerald-600">${p.price}</p>
                          <p className="text-[10px] text-slate-400">Qty: {p.stock}</p>
                        </div>
                        {p.brand && (
                          <p className="text-[10px] text-slate-400 truncate">{p.brand}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Import confirm */}
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
                    <Download size={16} />
                    Import {previewItems.length} Products
                  </Button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {previewItems.length === 0 && !previewing && !importing && (
              <div className="text-center py-8 text-slate-400">
                <Globe size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Click "Preview Products" to fetch from the API</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminIntegrationsPage;
