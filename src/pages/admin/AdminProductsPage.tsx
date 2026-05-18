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
import VariantManager from "../../components/admin/VariantManager";
import BulkActions from "../../components/admin/BulkActions";
import CollectionsManager from "../../components/admin/CollectionsManager";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal,
  Package,
  Library,
  Download,
  Upload
} from "lucide-react";
import { showError, showSuccess } from "../../utils/toast";

const AdminProductsPage = () => {
  const { 
    products, 
    collections,
    addProduct, 
    updateProduct, 
    deleteProduct,
    addVariant,
    updateVariant,
    deleteVariant,
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
  
  // State for filters and search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState("products"); // products, variants, collections

  // State for modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // State for bulk actions
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.brand.toLowerCase().includes(s) || 
        p.sku.toLowerCase().includes(s) || 
        p.category.toLowerCase().includes(s)
      );
    }

    // Category
    if (categoryFilter !== "all") {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Status
    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter);
    }

    // Condition
    if (conditionFilter !== "all") {
      result = result.filter(p => p.condition === conditionFilter);
    }

    // Stock
    if (stockFilter !== "all") {
      result = result.filter(p => {
        if (stockFilter === "in") return p.stockQuantity >= 5;
        if (stockFilter === "low") return p.stockQuantity > 0 && p.stockQuantity < 5;
        if (stockFilter === "out") return p.stockQuantity === 0;
        return true;
      });
    }

    // Sort
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
    if (qty >= 5) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>;
    if (qty > 0) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Low Stock ({qty})</Badge>;
    return <Badge variant="destructive">Out of Stock</Badge>;
  };

  const categories = [
    "Phone Accessories", "Chargers & Cables", "Audio", 
    "Laptop Accessories", "PC Accessories", "Gaming Accessories", "Storage Devices"
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Management</h1>
          <p className="text-slate-500">Manage your store inventory, pricing, and visibility.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd} className="gap-2">
            <Plus size={18} /> Add Product
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <Button
          variant={view === "products" ? "default" : "ghost"}
          onClick={() => setView("products")}
          className="gap-2"
        >
          <Package size={16} /> Products
        </Button>
        <Button
          variant={view === "collections" ? "default" : "ghost"}
          onClick={() => setView("collections")}
          className="gap-2"
        >
          <Library size={16} /> Collections
        </Button>
      </div>

      {view === "products" && (
        <>
          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
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
          )}

          {/* Filters and Search */}
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  placeholder="Search by title, brand, SKU..." 
                  className="pl-10" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="stock-low">Stock: Low to High</SelectItem>
                    <SelectItem value="stock-high">Stock: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                    </TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Product Info</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                        No products found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => handleBulkSelect(product.id, e.target.checked)}
                            className="rounded border-slate-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-slate-900">{product.title}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span className="font-medium">{product.brand}</span>
                            <span className="text-slate-300">|</span>
                            <span>SKU: {product.sku}</span>
                            <span className="text-slate-300">|</span>
                            <span className="capitalize">{product.condition}</span>
                            {product.variants && product.variants.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {product.variants.length} variants
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-slate-600">{product.category}</div>
                          <div className="text-[10px] text-slate-400">{product.subcategory}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-slate-900">${product.price.toFixed(2)}</div>
                          {product.compareAtPrice && (
                            <div className="text-xs text-slate-400 line-through">${product.compareAtPrice.toFixed(2)}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStockBadge(product.stockQuantity)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEdit(product)}>
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>
                  Fill in the details below to {editingProduct ? "update the" : "create a new"} product in your store.
                </DialogDescription>
              </DialogHeader>
              <ProductForm 
                product={editingProduct} 
                existingSkus={products.map(p => p.sku)}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
                <DialogDescription className="pt-2">
                  Are you sure you want to delete this product? This action cannot be undone and will remove the product from your store and inventory.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Delete Product</Button>
              </DialogFooter>
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