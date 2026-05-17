import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Package, AlertTriangle, ArrowUpDown, Search, Filter, Plus, Minus, Save, LogOut, Store } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminInventoryPage = () => {
  const { products, updateStock } = useStore();

  // UI state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Helper for badge
  const getStockBadge = (qty: number) => {
    if (qty >= 5) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>;
    if (qty > 0) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Low Stock ({qty})</Badge>;
    return <Badge variant="destructive">Out of Stock</Badge>;
  };

  // Filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.subcategory.toLowerCase().includes(s)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter);
    }

    if (stockFilter !== "all") {
      result = result.filter(p => {
        if (stockFilter === "in") return p.stockQuantity >= 5;
        if (stockFilter === "low") return p.stockQuantity > 0 && p.stockQuantity < 5;
        if (stockFilter === "out") return p.stockQuantity === 0;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "stock-low") return a.stockQuantity - b.stockQuantity;
      if (sortBy === "stock-high") return b.stockQuantity - a.stockQuantity;
      if (sortBy === "title-az") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [products, search, categoryFilter, statusFilter, stockFilter, sortBy]);

  // Summary calculations
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const lowStockCount = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5).length;
  const outOfStockCount = products.filter(p => p.stockQuantity === 0).length;

  // Local UI for stock editing
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  const handleStockChange = (id: string, value: number) => {
    setStockEdits(prev => ({ ...prev, [id]: value }));
  };

  const applyStockUpdate = (id: string) => {
    const newQty = stockEdits[id];
    if (newQty !== undefined && newQty >= 0) {
      updateStock(id, newQty);
      // Clean up edit state
      setStockEdits(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const categories = [
    "Phone Accessories", "Chargers & Cables", "Audio",
    "Laptop Accessories", "PC Accessories", "Gaming Accessories", "Storage Devices"
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <Button variant="ghost" size="icon" onClick={() => setSearch("")}>
            <RefreshCcw size={20} />
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
            <Package className="text-blue-600 h-6 w-6" />
            <div>
              <p className="text-sm text-blue-700">Total Products</p>
              <p className="text-xl font-bold text-blue-900">{totalProducts}</p>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
            <Package className="text-emerald-600 h-6 w-6" />
            <div>
              <p className="text-sm text-emerald-700">Total Stock Units</p>
              <p className="text-xl font-bold text-emerald-900">{totalStockUnits}</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
            <AlertTriangle className="text-amber-600 h-6 w-6" />
            <div>
              <p className="text-sm text-amber-700">Low‑Stock Products</p>
              <p className="text-xl font-bold text-amber-900">{lowStockCount}</p>
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
            <AlertTriangle className="text-red-600 h-6 w-6" />
            <div>
              <p className="text-sm text-red-700">Out‑of‑Stock</p>
              <p className="text-xl font-bold text-red-900">{outOfStockCount}</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by title, brand, SKU, category..."
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-3 w-3 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <ArrowUpDown className="h-3 w-3 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="stock-low">Stock Low → High</SelectItem>
                  <SelectItem value="stock-high">Stock High → Low</SelectItem>
                  <SelectItem value="title-az">Title A‑Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Controls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    No products match your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map(product => (
                  <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">{product.title}</div>
                      <div className="text-xs text-slate-500">{product.brand} • SKU: {product.sku}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{product.category}</div>
                      <div className="text-[10px] text-slate-400">{product.subcategory}</div>
                    </TableCell>
                    <TableCell>{getStockBadge(product.stockQuantity)}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "secondary"} className="capitalize">
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8"
                          onClick={() => handleStockChange(product.id, Math.max(0, (stockEdits[product.id] ?? product.stockQuantity) - 1))}
                        >
                          <Minus size={14} />
                        </Button>
                        <Input
                          type="number"
                          className="w-16 h-8 text-center"
                          value={stockEdits[product.id] ?? product.stockQuantity}
                          min={0}
                          onChange={e => handleStockChange(product.id, Math.max(0, parseInt(e.target.value) || 0))}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8"
                          onClick={() => handleStockChange(product.id, (stockEdits[product.id] ?? product.stockQuantity) + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8"
                          onClick={() => applyStockUpdate(product.id)}
                        >
                          <Save size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInventoryPage;