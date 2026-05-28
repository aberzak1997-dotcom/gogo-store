import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, CheckCircle, XCircle, Search, Package, Truck,
  MapPin, RefreshCw, Download, ExternalLink, ShoppingBag,
  Zap, AlertTriangle, Eye, ChevronRight, RotateCcw, Link2
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Product, Order } from "../../types";
import { showSuccess, showError } from "../../utils/toast";
import {
  CJProduct, CJConnection,
  cjAuthenticate, cjSearchProducts, cjGetProduct, cjCreateOrder, cjGetTracking,
  getCJConnection, saveCJConnection, clearCJConnection,
} from "../../lib/cj-api";

const STORE_CATEGORIES = [
  "Laptop Accessories", "Gaming Accessories", "Audio",
  "Storage Devices", "Chargers & Cables", "PC Accessories", "Phone Accessories",
];

const LS_FULFILLMENTS = "cj_fulfillments"; // orderId → { cjOrderId, status, tracking }

interface Fulfillment {
  localOrderId: string;
  cjOrderId: string;
  status: string;
  tracking: string;
  fulfilledAt: string;
}

function getFulfillments(): Record<string, Fulfillment> {
  try { return JSON.parse(localStorage.getItem(LS_FULFILLMENTS) || "{}"); }
  catch { return {}; }
}
function saveFulfillment(f: Fulfillment) {
  const all = getFulfillments();
  all[f.localOrderId] = f;
  localStorage.setItem(LS_FULFILLMENTS, JSON.stringify(all));
}

// ── Component ─────────────────────────────────────────────────────────────────
const AdminCJPage: React.FC = () => {
  const { products, orders, addProduct } = useStore();
  const [tab, setTab] = useState<"connect" | "import" | "fulfill" | "tracking">("connect");

  // ── Connection ──────────────────────────────────────────────────────────────
  const [conn, setConn] = useState<CJConnection | null>(() => getCJConnection());
  const [cjEmail, setCjEmail] = useState("");
  const [cjPass, setCjPass] = useState("");
  const [connecting, setConnecting] = useState(false);

  // ── Import ──────────────────────────────────────────────────────────────────
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<CJProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [markup, setMarkup] = useState(35);
  const [importCategory, setImportCategory] = useState(STORE_CATEGORIES[0]);
  const [importing, setImporting] = useState<string | null>(null);
  const [importedPids, setImportedPids] = useState<Set<string>>(() => {
    const skus = new Set(products.map(p => p.sku));
    return skus as Set<string>;
  });

  // ── Fulfill ─────────────────────────────────────────────────────────────────
  const [fulfillments, setFulfillments] = useState<Record<string, Fulfillment>>(getFulfillments);
  const [fulfilling, setFulfilling] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [logisticName, setLogisticName] = useState("CJPacket Ordinary");

  // ── Tracking ────────────────────────────────────────────────────────────────
  const [trackingData, setTrackingData] = useState<Record<string, any[]>>({});
  const [loadingTracking, setLoadingTracking] = useState<string | null>(null);

  // ── Connect ─────────────────────────────────────────────────────────────────
  const handleConnect = async () => {
    if (!cjEmail || !cjPass) { showError("Enter your CJ email and password."); return; }
    setConnecting(true);
    try {
      const connection = await cjAuthenticate(cjEmail, cjPass);
      saveCJConnection(connection);
      setConn(connection);
      setCjPass("");
      showSuccess("Connected to CJ Dropshipping!");
    } catch (e: any) {
      showError(e.message || "Connection failed.");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    clearCJConnection();
    setConn(null);
    showSuccess("Disconnected from CJ Dropshipping.");
  };

  // ── Search products ──────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!conn) { showError("Connect to CJ Dropshipping first."); return; }
    if (!keyword.trim()) { showError("Enter a search keyword."); return; }
    setSearching(true);
    try {
      const data = await cjSearchProducts(conn.accessToken, keyword.trim());
      setSearchResults(data.list || []);
      if ((data.list || []).length === 0) showError("No products found. Try a different keyword.");
    } catch (e: any) {
      showError(e.message || "Search failed.");
    } finally {
      setSearching(false);
    }
  };

  // ── Import product ────────────────────────────────────────────────────────
  const handleImport = async (cjProduct: CJProduct) => {
    if (!conn) return;
    setImporting(cjProduct.pid);
    try {
      // Fetch full product to get variants
      let fullProduct = cjProduct;
      try { fullProduct = await cjGetProduct(conn.accessToken, cjProduct.pid); }
      catch { /* use basic product if detail fetch fails */ }

      const basePrice = parseFloat(cjProduct.sellPrice || "0");
      const yourPrice = Number((basePrice * (1 + markup / 100)).toFixed(2));

      const images = fullProduct.productImageSet?.map(i => i.imageUrl) || [cjProduct.productImage];

      const newProduct: Product = {
        id: `cj_${cjProduct.pid}_${Date.now()}`,
        title: cjProduct.productNameEn,
        description: cjProduct.remark || `${cjProduct.productNameEn} — sourced from CJ Dropshipping. Available at WIVITEC with 1-Year warranty.`,
        sku: cjProduct.pid,
        brand: "CJ Sourced",
        category: importCategory,
        subcategory: cjProduct.categoryName || "",
        price: yourPrice,
        compareAtPrice: Number((basePrice * (1 + (markup + 20) / 100)).toFixed(2)),
        stockQuantity: 999,
        imageUrl: cjProduct.productImage,
        galleryImages: images,
        rating: 0,
        reviewCount: 0,
        status: "active",
        compatibility: [],
        specs: {
          "CJ Product ID": cjProduct.pid,
          "CJ Cost Price": `$${basePrice.toFixed(2)}`,
          "Your Markup": `${markup}%`,
          "Weight": cjProduct.productWeight || "N/A",
          "Source": "CJ Dropshipping",
          ...(fullProduct.variants?.[0]?.vid ? { "Default Variant ID": fullProduct.variants[0].vid } : {}),
        },
        warranty: "1 Year Warranty",
        condition: "new",
        createdAt: new Date().toISOString(),
        variants: [],
      };

      addProduct(newProduct);
      setImportedPids(prev => new Set([...prev, cjProduct.pid]));
      showSuccess(`"${cjProduct.productNameEn}" imported to your store!`);
    } catch (e: any) {
      showError(e.message || "Import failed.");
    } finally {
      setImporting(null);
    }
  };

  // ── Fulfill order ─────────────────────────────────────────────────────────
  const handleFulfill = async (order: Order) => {
    if (!conn) { showError("Connect to CJ Dropshipping first."); return; }
    setFulfilling(order.id);

    // Build products array from order items (need CJ variant IDs)
    const cjProducts: { vid: string; quantity: number }[] = [];
    for (const item of order.items) {
      const storeProduct = products.find(p => p.id === item.productId || p.sku === item.productId);
      const vid = storeProduct?.specs?.["Default Variant ID"] || storeProduct?.sku;
      if (!vid) {
        showError(`Product "${item.title}" was not imported from CJ — cannot auto-fulfill. Remove it or fulfill manually.`);
        setFulfilling(null);
        return;
      }
      cjProducts.push({ vid, quantity: item.quantity });
    }

    try {
      const result = await cjCreateOrder(conn.accessToken, {
        orderNumber: order.id,
        shippingCustomerName: order.customerName,
        shippingPhone: order.phone || "",
        shippingAddress: order.address || "",
        shippingCity: order.city || "",
        shippingZip: "",
        shippingCountryCode: countryCode(order.country || "Morocco"),
        email: order.email,
        fromCountryCode: "CN",
        logisticName,
        products: cjProducts,
      });

      const f: Fulfillment = {
        localOrderId: order.id,
        cjOrderId: result?.orderId || result?.orderNum || "CJ-PENDING",
        status: "Processing",
        tracking: "",
        fulfilledAt: new Date().toISOString(),
      };
      saveFulfillment(f);
      setFulfillments(getFulfillments());
      showSuccess(`Order ${order.id} sent to CJ! CJ Order: ${f.cjOrderId}`);
    } catch (e: any) {
      showError(e.message || "Failed to fulfill order.");
    } finally {
      setFulfilling(null);
    }
  };

  // ── Refresh tracking ──────────────────────────────────────────────────────
  const handleRefreshTracking = async (f: Fulfillment) => {
    if (!conn) return;
    setLoadingTracking(f.localOrderId);
    try {
      const events = await cjGetTracking(conn.accessToken, f.cjOrderId);
      setTrackingData(prev => ({ ...prev, [f.localOrderId]: events }));
      showSuccess("Tracking updated.");
    } catch (e: any) {
      showError(e.message || "Failed to fetch tracking.");
    } finally {
      setLoadingTracking(null);
    }
  };

  const unfulfilled = orders.filter(o =>
    o.status !== "cancelled" &&
    o.fulfillmentStatus === "unfulfilled" &&
    !fulfillments[o.id]
  );

  const fulfilled = Object.values(fulfillments);

  const tabs = [
    { id: "connect",  label: "Connect",         count: null },
    { id: "import",   label: "Import Products",  count: null },
    { id: "fulfill",  label: "Fulfill Orders",   count: unfulfilled.length || null },
    { id: "tracking", label: "Tracking",         count: fulfilled.length || null },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1160CB]/10 rounded-[10px] flex items-center justify-center">
            <Link2 size={18} className="text-[#1160CB]" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#0C0D10] tracking-tight">CJ Dropshipping</h1>
            <p className="text-caption text-[#0C0D10]/40 mt-0.5">Import products · Fulfill orders · Track shipments</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold ${
          conn ? "bg-green-100 text-green-700" : "bg-[#F0F2F8] text-[#0C0D10]/40"
        }`}>
          {conn ? <CheckCircle size={13} /> : <XCircle size={13} />}
          {conn ? "Connected" : "Not Connected"}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F0F2F8] rounded-[12px] p-1 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-[9px] text-[13px] font-semibold transition-all ${
              tab === t.id ? "bg-white text-[#0C0D10] shadow-sm" : "text-[#0C0D10]/40 hover:text-[#0C0D10]"
            }`}>
            {t.label}
            {t.count ? (
              <span className="bg-[#1160CB] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── CONNECT TAB ─────────────────────────────────────────────────────── */}
      {tab === "connect" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[16px] border border-[#F0F2F8] p-6 space-y-5">
            <h2 className="font-bold text-[15px] text-[#0C0D10]">API Credentials</h2>

            {conn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-[12px]">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold text-green-800">Connected</p>
                    <p className="text-[12px] text-green-600 mt-0.5">{conn.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#F0F2F8] rounded-[10px]">
                    <p className="text-caption text-[#1160CB]">Token Expires</p>
                    <p className="text-[13px] font-semibold text-[#0C0D10] mt-1">
                      {new Date(conn.accessTokenExpiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-[#F0F2F8] rounded-[10px]">
                    <p className="text-caption text-[#1160CB]">Status</p>
                    <p className="text-[13px] font-semibold text-green-600 mt-1">Active</p>
                  </div>
                </div>
                <Button onClick={handleDisconnect} variant="outline"
                  className="w-full rounded-[10px] border-rose-200 text-rose-600 hover:bg-rose-50 text-[13px] font-semibold">
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* How to get API key */}
                <div className="bg-[#F0F2F8] rounded-[10px] p-3 space-y-1.5">
                  <p className="text-[11px] font-bold text-[#0C0D10] uppercase tracking-wider">How to get your API Key</p>
                  <ol className="text-[12px] text-[#0C0D10]/60 space-y-1">
                    <li>1. Log in to <a href="https://app.cjdropshipping.com" target="_blank" rel="noreferrer" className="text-[#1160CB] font-semibold hover:underline">app.cjdropshipping.com ↗</a></li>
                    <li>2. Go to <strong className="text-[#0C0D10]">Account → My Account</strong></li>
                    <li>3. Find the <strong className="text-[#0C0D10]">API Key</strong> section and copy it</li>
                    <li className="text-[11px] text-amber-600 font-semibold">⚠ This is NOT your login password</li>
                  </ol>
                </div>
                <div>
                  <Label className="text-caption text-[#1160CB] mb-1.5 block">CJ Account Email</Label>
                  <Input value={cjEmail} onChange={e => setCjEmail(e.target.value)}
                    placeholder="your@email.com" type="email"
                    className="border-[#F0F2F8] rounded-[10px] text-[13px]" />
                </div>
                <div>
                  <Label className="text-caption text-[#1160CB] mb-1.5 block">
                    API Key <span className="text-[#0C0D10]/30 font-normal normal-case">(from CJ dashboard — not your password)</span>
                  </Label>
                  <Input value={cjPass} onChange={e => setCjPass(e.target.value)}
                    placeholder="Paste your CJ API Key here…"
                    className="border-[#F0F2F8] rounded-[10px] text-[13px] font-mono"
                    onKeyDown={e => e.key === "Enter" && handleConnect()} />
                </div>
                <Button onClick={handleConnect} disabled={connecting}
                  className="w-full bg-[#1160CB] hover:bg-[#0e4fa8] text-white rounded-[10px] font-bold gap-2">
                  {connecting ? <><Loader2 size={14} className="animate-spin" /> Connecting…</> : <><Link2 size={14} /> Connect to CJ Dropshipping</>}
                </Button>
                <p className="text-caption text-[#0C0D10]/30 text-center">
                  Don't have an account?{" "}
                  <a href="https://app.cjdropshipping.com/register.html" target="_blank" rel="noreferrer"
                    className="text-[#1160CB] hover:underline font-semibold">
                    Sign up at CJ Dropshipping ↗
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#1528A1] to-[#1160CB] rounded-[16px] p-6 text-white">
              <h3 className="font-bold text-[15px] mb-3">What you can do</h3>
              <div className="space-y-3">
                {[
                  { icon: Search, text: "Search 400,000+ products" },
                  { icon: Download, text: "Import products with your markup" },
                  { icon: Truck, text: "Auto-fulfill orders with 1 click" },
                  { icon: MapPin, text: "Real-time shipment tracking" },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-[8px] flex items-center justify-center flex-shrink-0">
                      <f.icon size={15} className="text-[#479BF7]" />
                    </div>
                    <p className="text-[13px] text-white/80">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-[14px] p-4 flex gap-3">
              <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-700">
                <strong>Important:</strong> Only import products that ship to Morocco. Check CJ's product page for shipping availability before importing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORT PRODUCTS TAB ──────────────────────────────────────────────── */}
      {tab === "import" && (
        <div className="space-y-5">
          {!conn && (
            <div className="bg-amber-50 border border-amber-100 rounded-[12px] p-4 flex items-center gap-3">
              <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
              <p className="text-[13px] text-amber-700 font-medium">
                Connect to CJ Dropshipping first to import products.
              </p>
              <button onClick={() => setTab("connect")} className="ml-auto text-[#1160CB] text-[12px] font-bold whitespace-nowrap hover:underline">
                Connect →
              </button>
            </div>
          )}

          {/* Search bar + settings */}
          <div className="bg-white rounded-[14px] border border-[#F0F2F8] p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C0D10]/30" />
                <input value={keyword} onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder="Search CJ catalog… e.g. gaming headset, USB hub, laptop stand"
                  className="w-full pl-9 pr-4 py-2.5 text-[13px] border border-[#F0F2F8] rounded-[10px] outline-none focus:border-[#1160CB]/40 transition-colors" />
              </div>
              <Button onClick={handleSearch} disabled={searching || !conn}
                className="bg-[#1160CB] hover:bg-[#0e4fa8] text-white rounded-[10px] gap-2 font-semibold text-[13px] px-6">
                {searching ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#F0F2F8]">
              <div className="flex items-center gap-2">
                <Label className="text-caption text-[#1160CB] whitespace-nowrap">Your Markup</Label>
                <div className="flex items-center gap-2">
                  <input type="range" min={10} max={200} value={markup}
                    onChange={e => setMarkup(Number(e.target.value))}
                    className="w-24 accent-[#1160CB]" />
                  <span className="text-[13px] font-bold text-[#0C0D10] w-10">{markup}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-caption text-[#1160CB] whitespace-nowrap">Import to Category</Label>
                <select value={importCategory} onChange={e => setImportCategory(e.target.value)}
                  className="border border-[#F0F2F8] rounded-[8px] px-3 py-1.5 text-[13px] outline-none focus:border-[#1160CB]/40">
                  {STORE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Results grid */}
          {searchResults.length === 0 && !searching && (
            <div className="bg-white rounded-[14px] border border-[#F0F2F8] py-20 flex flex-col items-center gap-3">
              <Package size={32} className="text-[#0C0D10]/10" />
              <p className="text-[#0C0D10]/30 text-[14px]">Search the CJ catalog above to find products to import</p>
            </div>
          )}

          {searching && (
            <div className="bg-white rounded-[14px] border border-[#F0F2F8] py-20 flex items-center justify-center gap-3">
              <Loader2 size={20} className="animate-spin text-[#1160CB]" />
              <p className="text-[#0C0D10]/40 text-[14px]">Searching CJ catalog…</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map(p => {
                const cjCost = parseFloat(p.sellPrice || "0");
                const yourPrice = Number((cjCost * (1 + markup / 100)).toFixed(2));
                const alreadyImported = importedPids.has(p.pid);

                return (
                  <div key={p.pid} className="bg-white rounded-[14px] border border-[#F0F2F8] overflow-hidden hover:border-[#1160CB]/20 hover:shadow-md transition-all flex flex-col">
                    <div className="relative">
                      <img src={p.productImage} alt={p.productNameEn}
                        className="w-full h-40 object-cover bg-[#F0F2F8]" />
                      {alreadyImported && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle size={9} /> Imported
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1 gap-2">
                      <p className="text-[12px] font-semibold text-[#0C0D10] line-clamp-2 leading-tight">
                        {p.productNameEn}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[10px] text-[#0C0D10]/30">CJ Cost</p>
                          <p className="text-[12px] font-semibold text-[#0C0D10]/50">${cjCost.toFixed(2)}</p>
                        </div>
                        <ChevronRight size={12} className="text-[#0C0D10]/20" />
                        <div className="text-right">
                          <p className="text-[10px] text-[#1160CB]">Your Price</p>
                          <p className="text-[14px] font-bold text-[#1528A1]">${yourPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <Button onClick={() => handleImport(p)}
                        disabled={importing === p.pid || alreadyImported}
                        className={`w-full rounded-[8px] h-8 text-[12px] font-bold gap-1 mt-1 ${
                          alreadyImported
                            ? "bg-green-100 text-green-700 hover:bg-green-100 cursor-default"
                            : "bg-[#1160CB] hover:bg-[#0e4fa8] text-white"
                        }`}>
                        {importing === p.pid ? (
                          <><Loader2 size={11} className="animate-spin" /> Importing…</>
                        ) : alreadyImported ? (
                          <><CheckCircle size={11} /> Imported</>
                        ) : (
                          <><Download size={11} /> Import</>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── FULFILL ORDERS TAB ───────────────────────────────────────────────── */}
      {tab === "fulfill" && (
        <div className="space-y-5">
          {!conn && (
            <div className="bg-amber-50 border border-amber-100 rounded-[12px] p-4 flex items-center gap-3">
              <AlertTriangle size={16} className="text-amber-500" />
              <p className="text-[13px] text-amber-700 font-medium">Connect to CJ Dropshipping to fulfill orders.</p>
              <button onClick={() => setTab("connect")} className="ml-auto text-[#1160CB] text-[12px] font-bold hover:underline">Connect →</button>
            </div>
          )}

          {/* Shipping method */}
          <div className="bg-white rounded-[14px] border border-[#F0F2F8] p-4 flex flex-wrap items-center gap-4">
            <Label className="text-caption text-[#1160CB] whitespace-nowrap">Shipping Method</Label>
            <select value={logisticName} onChange={e => setLogisticName(e.target.value)}
              className="border border-[#F0F2F8] rounded-[8px] px-3 py-1.5 text-[13px] outline-none flex-1 max-w-xs">
              <option>CJPacket Ordinary</option>
              <option>CJPacket Tracked</option>
              <option>CJ ePacket</option>
              <option>CJPacket Air</option>
              <option>CJ Air Express</option>
            </select>
            <p className="text-caption text-[#0C0D10]/30">Applied to all CJ fulfillments</p>
          </div>

          {unfulfilled.length === 0 ? (
            <div className="bg-white rounded-[14px] border border-[#F0F2F8] py-20 flex flex-col items-center gap-3">
              <CheckCircle size={32} className="text-green-400" />
              <p className="font-semibold text-[#0C0D10]">All orders fulfilled!</p>
              <p className="text-caption text-[#0C0D10]/30">New orders will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-caption text-[#0C0D10]/50">{unfulfilled.length} order{unfulfilled.length !== 1 ? "s" : ""} awaiting fulfillment</p>
              {unfulfilled.map(order => (
                <div key={order.id} className="bg-white rounded-[14px] border border-[#F0F2F8] p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-[12px] font-bold text-[#0C0D10]">#{order.id}</span>
                        <Badge className="bg-amber-100 text-amber-700 text-[10px] font-bold border-0">
                          {order.status}
                        </Badge>
                        <Badge className="bg-[#F0F2F8] text-[#0C0D10]/50 text-[10px] font-bold border-0">
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-caption text-[#0C0D10]/50 mb-3">
                        <ShoppingBag size={11} /> {order.customerName} • {order.city}, {order.country}
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-[12px] text-[#0C0D10]/60">
                            <span className="w-5 h-5 bg-[#F0F2F8] rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              {item.quantity}
                            </span>
                            {item.title}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-[18px] font-bold text-[#1528A1]">${order.totalAmount.toFixed(2)}</p>
                      <Button onClick={() => handleFulfill(order)}
                        disabled={fulfilling === order.id || !conn}
                        className="bg-[#1160CB] hover:bg-[#0e4fa8] text-white rounded-[10px] gap-2 text-[13px] font-bold">
                        {fulfilling === order.id
                          ? <><Loader2 size={13} className="animate-spin" /> Sending…</>
                          : <><Truck size={13} /> Fulfill with CJ</>}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TRACKING TAB ─────────────────────────────────────────────────────── */}
      {tab === "tracking" && (
        <div className="space-y-4">
          {fulfilled.length === 0 ? (
            <div className="bg-white rounded-[14px] border border-[#F0F2F8] py-20 flex flex-col items-center gap-3">
              <MapPin size={32} className="text-[#0C0D10]/10" />
              <p className="font-semibold text-[#0C0D10]">No fulfilled orders yet</p>
              <p className="text-caption text-[#0C0D10]/30">Fulfilled orders will appear here with tracking.</p>
              <button onClick={() => setTab("fulfill")} className="text-[#1160CB] text-[13px] font-bold hover:underline mt-1">
                Go to Fulfill Orders →
              </button>
            </div>
          ) : (
            fulfilled.map(f => {
              const order = orders.find(o => o.id === f.localOrderId);
              const events = trackingData[f.localOrderId] || [];
              return (
                <div key={f.localOrderId} className="bg-white rounded-[14px] border border-[#F0F2F8] p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-bold text-[#0C0D10]">Order #{f.localOrderId}</span>
                        <span className="text-caption text-[#0C0D10]/30">→</span>
                        <span className="text-[13px] font-bold text-[#1160CB]">CJ: {f.cjOrderId}</span>
                      </div>
                      {order && (
                        <p className="text-caption text-[#0C0D10]/40">
                          {order.customerName} • {order.city}, {order.country}
                        </p>
                      )}
                      <p className="text-caption text-[#0C0D10]/30 mt-1">
                        Fulfilled {new Date(f.fulfilledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button onClick={() => handleRefreshTracking(f)}
                      disabled={loadingTracking === f.localOrderId || !conn}
                      variant="outline" className="rounded-[10px] border-[#F0F2F8] text-[13px] font-semibold gap-2">
                      {loadingTracking === f.localOrderId
                        ? <><Loader2 size={12} className="animate-spin" /> Refreshing…</>
                        : <><RefreshCw size={12} /> Refresh Tracking</>}
                    </Button>
                  </div>

                  {/* Tracking timeline */}
                  {events.length > 0 ? (
                    <div className="border-l-2 border-[#F0F2F8] pl-4 space-y-3 ml-2">
                      {events.map((e: any, i: number) => (
                        <div key={i} className="relative">
                          <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-white ${
                            i === 0 ? "bg-[#1160CB]" : "bg-[#F0F2F8]"
                          }`} />
                          <p className="text-[13px] font-medium text-[#0C0D10]">{e.context}</p>
                          <p className="text-caption text-[#0C0D10]/30 mt-0.5">{e.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-caption text-[#0C0D10]/30 bg-[#F0F2F8] rounded-[8px] px-4 py-3">
                      <RotateCcw size={12} />
                      Click "Refresh Tracking" to fetch the latest shipment status
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// Map country name to 2-letter ISO code (basic list for common CJ destinations)
function countryCode(name: string): string {
  const map: Record<string, string> = {
    "Morocco": "MA", "United States": "US", "France": "FR", "Germany": "DE",
    "United Kingdom": "GB", "Spain": "ES", "Italy": "IT", "Canada": "CA",
    "Australia": "AU", "Netherlands": "NL", "Belgium": "BE", "Saudi Arabia": "SA",
    "UAE": "AE", "Qatar": "QA", "Algeria": "DZ", "Tunisia": "TN", "Egypt": "EG",
  };
  return map[name] || name.slice(0, 2).toUpperCase();
}

export default AdminCJPage;
