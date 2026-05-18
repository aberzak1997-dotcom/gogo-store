import React, { useState } from "react";
import { Product } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, RotateCcw, Package, Percent, Download, Upload } from "lucide-react";
import { showError, showSuccess } from "../../utils/toast";

interface BulkActionsProps {
  selectedProducts: string[];
  products: Product[];
  onBulkUpdate: (productIds: string[], updates: Partial<Product>) => void;
  onBulkDelete: (productIds: string[]) => void;
  onExportCSV: () => void;
  onImportCSV: (csvData: string) => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedProducts,
  products,
  onBulkUpdate,
  onBulkDelete,
  onExportCSV,
  onImportCSV
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState("");
  const [updateData, setUpdateData] = useState({
    status: "",
    category: "",
    stockQuantity: "",
    discount: ""
  });

  const selectedProductObjects = products.filter(p => selectedProducts.includes(p.id));

  const handleBulkUpdate = () => {
    const updates: Partial<Product> = {};

    if (updateData.status) {
      updates.status = updateData.status as "active" | "draft";
    }

    if (updateData.category) {
      updates.category = updateData.category;
    }

    if (updateData.stockQuantity) {
      updates.stockQuantity = parseInt(updateData.stockQuantity);
    }

    if (updateData.discount) {
      const discount = parseFloat(updateData.discount);
      if (discount > 0) {
        selectedProductObjects.forEach(p => {
          if (p.price > 0) {
            updates.compareAtPrice = p.price;
            updates.price = p.price * (1 - discount / 100);
          }
        });
      }
    }

    if (Object.keys(updates).length > 0) {
      onBulkUpdate(selectedProducts, updates);
      setIsUpdateDialogOpen(false);
      setUpdateData({
        status: "",
        category: "",
        stockQuantity: "",
        discount: ""
      });
    }
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedProducts);
    setIsDeleteDialogOpen(false);
  };

  const handleImportCSV = () => {
    if (!csvData.trim()) {
      showError("Please paste CSV data");
      return;
    }

    onImportCSV(csvData);
    setIsImportDialogOpen(false);
    setCsvData("");
  };

  const handleExportCSV = () => {
    onExportCSV();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {selectedProducts.length} selected
          </Badge>
          {selectedProducts.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdateDialogOpen(true)}
                className="gap-2"
              >
                <Package size={16} /> Update
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportDialogOpen(true)}
            className="gap-2"
          >
            <Upload size={16} /> Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2"
          >
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      {/* Bulk Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Update Products</DialogTitle>
            <DialogDescription>
              Update {selectedProducts.length} selected products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={updateData.status} onValueChange={(value) => setUpdateData({...updateData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No change</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={updateData.category} onValueChange={(value) => setUpdateData({...updateData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No change</SelectItem>
                  <SelectItem value="Phone Accessories">Phone Accessories</SelectItem>
                  <SelectItem value="Chargers & Cables">Chargers & Cables</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                  <SelectItem value="Laptop Accessories">Laptop Accessories</SelectItem>
                  <SelectItem value="PC Accessories">PC Accessories</SelectItem>
                  <SelectItem value="Gaming Accessories">Gaming Accessories</SelectItem>
                  <SelectItem value="Storage Devices">Storage Devices</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                placeholder="Enter new stock quantity"
                value={updateData.stockQuantity}
                onChange={(e) => setUpdateData({...updateData, stockQuantity: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Apply Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                placeholder="e.g. 20 for 20% off"
                value={updateData.discount}
                onChange={(e) => setUpdateData({...updateData, discount: e.target.value})}
              />
              <p className="text-xs text-slate-500">
                This will set compare-at price and reduce the price by the percentage
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>Update Products</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProducts.length} products? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {selectedProductObjects.slice(0, 3).map(p => (
              <div key={p.id} className="text-sm text-slate-600">
                • {p.title}
              </div>
            ))}
            {selectedProductObjects.length > 3 && (
              <div className="text-sm text-slate-500">
                ...and {selectedProductObjects.length - 3} more
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Products from CSV</DialogTitle>
            <DialogDescription>
              Paste your CSV data below. The CSV should contain headers: title, brand, sku, category, price, stockQuantity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csvData">CSV Data</Label>
              <textarea
                id="csvData"
                className="w-full h-64 p-3 border border-slate-200 rounded-lg text-sm font-mono"
                placeholder="title,brand,sku,category,price,stockQuantity&#10;USB Charger,BrandX,CHG-001,Chargers,39.99,10&#10;Wireless Mouse,BrandY,MOU-001,Mice,29.99,5"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportCSV}>Import Products</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkActions;