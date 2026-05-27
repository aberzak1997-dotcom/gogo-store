"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { Product } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ProductForm from "../../components/admin/ProductForm";
import BulkActions from "../../components/admin/BulkActions";
import CollectionsManager from "../../components/admin/CollectionsManager";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Package,
  Library,
} from "lucide-react";
import { showError } from "../../utils/toast";
import { cn } from "@/lib/utils";

const AdminProductsPage = () => {
  const { 
    products, 
    collections,
    addProduct, 
    updateProduct, 
    deleteProduct,
    bulkUpdateProducts,
    bulkDeleteProducts,
    exportProductsToCSV,
    importProductsFromCSV,
    addCollection,
    updateCollection,
    deleteCollection,
    addProductToCollection,
    removeProductFromCollection
  } = useStore();
  
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState("products");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.brand.toLowerCase().includes(s) || 
        p.sku.toLowerCase().includes(s) || 
        p.category.toLowerCase().includes(s)
      );
    }

    if (categoryFilter !== "all") result = result.filter(p => p.category === categoryFilter);
    if (statusFilter !== "all") result = result.filter(p => p.status === statusFilter);
    if (conditionFilter !== "all") result = result.filter(p => p.condition === conditionFilter);

    if (stockFilter !== "all") {
      result = result.filter(p => {
        if (stockFilter === "in") return p.stockQuantity >= 5;
        if (stockFilter === "low") return p.stockQuantity > 0 && p.stockQuantity < 5;
        if (stockFilter === "out") return p.stockQuantity === 0;
        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "stock-low") return a.stockQuantity - b.stockQuantity;
      if (sortBy === "stock-high") return b.stockQuantity - a.stockQuantity;
      return 0;
    });

    return result;
  }, [products, search, categoryFilter, statusFilter, conditionFilter, stockFilter, sortBy]);

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleFormSubmit = (data: Product) => {
    if (editingProduct) {
      updateProduct(data);
    } else {
      addProduct(data);
    }
    setIsFormOpen(false);
  };

  const handleBulkSelect = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const getStockBadge = (qty: number) => {
    if (qty >= 5) return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-transparent text-[9px] font-black uppercase tracking-widest rounded-full">In Stock</Badge>;
    if (qty > 0) return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-transparent text-[9px] font-black uppercase tracking-widest rounded-full">Low ({qty})</Badge>;
    return <Badge className="bg-rose-50 text-rose-600 border-transparent text-[9px] font-black uppercase tracking-widest rounded-full">Out</Badge>;
  };

  const categoriesList = [
    "Phone Accessories", "Chargers & Cables", "Audio", 
    "Laptop Accessories", "PC Accessories", "Gaming Accessories", "Storage Devices"
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Products</h1>
          <p className="text-slate-500 text-sm font-medium">Catalog management and inventory tracking.</p>
        </div>
        <Button onClick={handleAdd} className="rounded-full h-12 px-8 text-xs font-black uppercase tracking-widest gap-2 bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/10">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1.5 p-1.5 bg-white border border-slate-100 rounded-full w-fit shadow-sm">
        <button
          onClick={() => setView("products")}
          className={cn(
            "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            view === "products" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-900"
          )}
        >
          Catalog
        </button>
        <button
          onClick={() => setView("collections")}
          className={cn(
            "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            view === "collections" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-900"
          )}
        >
          Collections
        </button>
      </div>

      {view === "products" && (
        <>
          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  placeholder="Search catalog..." 
                  className="pl-12 pr-4 h-12 rounded-full border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-xs font-bold"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px] rounded-full h-12 bg-slate-50/50 border-slate-200 text-xs font-bold">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] rounded-full h-12 bg-slate-50/50 border-slate-200 text-xs font-bold">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] rounded-full h-12 bg-slate-50/50 border-slate-200 text-xs font-bold">
                    <ArrowUpDown className="h-3 w-3 mr-2" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="stock-low">Stock: Low to High</SelectItem>
                    <SelectItem value="stock-high">Stock: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedProducts.length > 0 && (
              <div className="pt-6 border-t border-slate-50">
                <BulkActions
                  selectedProducts={selectedProducts}
                  products={products}
                  onBulkUpdate={bulkUpdateProducts}
                  onBulkDelete={bulkDeleteProducts}
                  onExportCSV={exportProductsToCSV}
                  onImportCSV={(csvData) => {
                    const result = importProductsFromCSV(csvData);
                    if (result.errors.length > 0) {
                      showError(`${result.errors.length} errors found during import`);
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 h-14 border-b border-slate-100">
                    <TableHead className="w-[60px] pl-6">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preview</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-20 text-slate-400 font-medium">
                        No products found in the catalog.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors h-20 border-b border-slate-50">
                        <TableCell className="pl-6">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => handleBulkSelect(product.id, e.target.checked)}
                            className="rounded border-slate-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 p-1.5 flex-shrink-0">
                            <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-slate-900 text-sm truncate max-w-[240px]">{product.title}</div>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 mt-0.5">
                            {product.brand} • <span className="text-slate-300">SKU:</span> {product.sku}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">{product.category}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-black text-slate-900 text-sm">${product.price.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          {getStockBadge(product.stockQuantity)}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-[#0033CC] hover:bg-[#0033CC]/5" onClick={() => handleEdit(product)}>
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              onClick={() => handleDeleteClick(product.id)}
                            >
                              <Trash2 size={16} />
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

          {/* Add/Edit Modal */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-4xl p-0 border-none overflow-hidden rounded-3xl">
              <div className="bg-slate-900 p-8 text-white">
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">{editingProduct ? "Edit Product" : "New Catalog Entry"}</DialogTitle>
                <DialogDescription className="text-slate-400 font-medium mt-1">
                  Configure product details and variants for WIVITEC.
                </DialogDescription>
              </div>
              <div className="p-8 bg-white">
                <ProductForm 
                  product={editingProduct} 
                  existingSkus={products.map(p => p.sku)}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsFormOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none p-10">
              <DialogHeader className="space-y-4">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto">
                  <Trash2 size={28} />
                </div>
                <div className="text-center">
                  <DialogTitle className="text-xl font-black uppercase tracking-tighter">Permanently Delete?</DialogTitle>
                  <DialogDescription className="pt-2 text-slate-500 font-medium">
                    This will remove the product from the storefront and database. This action cannot be reversed.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 rounded-full h-12 font-black uppercase tracking-widest text-[10px]" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" className="flex-1 rounded-full h-12 font-black uppercase tracking-widest text-[10px]" onClick={confirmDelete}>Delete</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {view === "collections" && (
        <CollectionsManager
          collections={collections}
          products={products}
          onAddCollection={addCollection}
          onUpdateCollection={updateCollection}
          onDeleteCollection={deleteCollection}
          onAddProductToCollection={addProductToCollection}
          onRemoveProductFromCollection={removeProductFromCollection}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;