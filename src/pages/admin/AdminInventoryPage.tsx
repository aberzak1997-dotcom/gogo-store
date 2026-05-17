import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, ShoppingBag, Eye, CheckCircle, XCircle, Search, Filter, ArrowUpDown, RefreshCw, Minus, Plus, Save } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminInventoryPage = () => {
  const { products, updateProductStock } = useStore();

  // UI state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter === "in-stock") {
      result = result.filter(p => p.stockQuantity >= 5);
    } else if (stockFilter === "low-stock") {
      result = result.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter(p => p.stockQuantity === 0);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "stock-high") return b.stockQuantity - a.stockQuantity;
      if (sortBy === "stock-low") return a.stockQuantity - b.stockQuantity;
      return 0;
    });

    return result;
  }, [products, search, categoryFilter, stockFilter, sortBy]);

  const getStockBadge = (qty: number) => {
    if (qty === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (qty < 5) {
      return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Only {qty} left</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-100 text-green-700">In Stock</Badge>;
    }
  };

  const handleStockChange = (productId: string, newStock: number) => {
    setStockEdits(prev => ({ ...prev, [productId]: newStock }));
  };

  const applyStockUpdate = (productId: string) => {
    const newStock = stockEdits[productId];
    if (newStock !== undefined) {
      updateProductStock(productId, newStock);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <Button variant="ghost" size="icon" onClick={() => { setSearch(""); setCategoryFilter("all"); setStockFilter("all"); setStockEdits({}); }}>
            <RefreshCw size={20} />
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by product name, SKU, brand..."
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-3 w-3 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="stock-high">Stock High → Low</SelectItem>
                  <SelectItem value="stock-low">Stock Low → High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Table */}
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