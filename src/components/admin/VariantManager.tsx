import React, { useState } from "react";
import { Product, ProductVariant } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { showError, showSuccess } from "../../utils/toast";

interface VariantManagerProps {
  product: Product;
  onVariantAdd: (variant: ProductVariant) => void;
  onVariantUpdate: (variant: ProductVariant) => void;
  onVariantDelete: (variantId: string) => void;
}

const VariantManager: React.FC<VariantManagerProps> = ({ 
  product, 
  onVariantAdd, 
  onVariantUpdate, 
  onVariantDelete 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    optionName: "",
    optionValue: "",
    sku: "",
    price: 0,
    stockQuantity: 0,
    imageUrl: ""
  });

  const handleAddVariant = () => {
    if (!newVariant.optionName || !newVariant.optionValue || !newVariant.sku) {
      showError("Please fill in all required fields");
      return;
    }

    if (product.variants?.some(v => v.sku === newVariant.sku)) {
      showError("Variant SKU must be unique");
      return;
    }

    const variant: ProductVariant = {
      id: `VAR-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      optionName: newVariant.optionName,
      optionValue: newVariant.optionValue,
      sku: newVariant.sku,
      price: newVariant.price || 0,
      stockQuantity: newVariant.stockQuantity || 0,
      imageUrl: newVariant.imageUrl || ""
    };

    onVariantAdd(variant);
    setNewVariant({
      optionName: "",
      optionValue: "",
      sku: "",
      price: 0,
      stockQuantity: 0,
      imageUrl: ""
    });
    setIsAddDialogOpen(false);
    showSuccess("Variant added successfully");
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
  };

  const handleUpdateVariant = () => {
    if (!editingVariant) return;

    if (!editingVariant.optionName || !editingVariant.optionValue || !editingVariant.sku) {
      showError("Please fill in all required fields");
      return;
    }

    if (product.variants?.some(v => v.sku === editingVariant.sku && v.id !== editingVariant.id)) {
      showError("Variant SKU must be unique");
      return;
    }

    onVariantUpdate(editingVariant);
    setEditingVariant(null);
    showSuccess("Variant updated successfully");
  };

  const handleDeleteVariant = (variantId: string) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      onVariantDelete(variantId);
      showSuccess("Variant deleted");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Product Variants</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus size={16} /> Add Variant
        </Button>
      </div>

      {product.variants && product.variants.length > 0 ? (
        <div className="space-y-4">
          {product.variants.map((variant) => (
            <div key={variant.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {variant.optionName}: {variant.optionValue}
                    </Badge>
                    <span className="text-xs font-bold text-slate-500">SKU: {variant.sku}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Price: </span>
                      <span className="font-bold text-slate-900">${variant.price.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Stock: </span>
                      <span className="font-bold text-slate-900">{variant.stockQuantity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditVariant(variant)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteVariant(variant.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500">No variants for this product yet.</p>
        </div>
      )}

      {/* Add Variant Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Variant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="optionName">Option Name</Label>
              <Select onValueChange={(value) => setNewVariant({...newVariant, optionName: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="e.g. Color, Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Color">Color</SelectItem>
                  <SelectItem value="Size">Size</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Switch Type">Switch Type</SelectItem>
                  <SelectItem value="Condition">Condition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionValue">Option Value</Label>
              <Input
                id="optionValue"
                value={newVariant.optionValue}
                onChange={(e) => setNewVariant({...newVariant, optionValue: e.target.value})}
                placeholder="e.g. Black, 256GB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={newVariant.sku}
                onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                placeholder="e.g. PROD-BK-256"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant({...newVariant, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newVariant.stockQuantity}
                  onChange={(e) => setNewVariant({...newVariant, stockQuantity: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={newVariant.imageUrl}
                onChange={(e) => setNewVariant({...newVariant, imageUrl: e.target.value})}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVariant}>Add Variant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Variant Dialog */}
      <Dialog open={!!editingVariant} onOpenChange={() => setEditingVariant(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Variant</DialogTitle>
          </DialogHeader>
          {editingVariant && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editOptionName">Option Name</Label>
                <Select 
                  value={editingVariant.optionName} 
                  onValueChange={(value) => setEditingVariant({...editingVariant, optionName: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Color">Color</SelectItem>
                    <SelectItem value="Size">Size</SelectItem>
                    <SelectItem value="Storage">Storage</SelectItem>
                    <SelectItem value="Switch Type">Switch Type</SelectItem>
                    <SelectItem value="Condition">Condition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editOptionValue">Option Value</Label>
                <Input
                  id="editOptionValue"
                  value={editingVariant.optionValue}
                  onChange={(e) => setEditingVariant({...editingVariant, optionValue: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSku">SKU</Label>
                <Input
                  id="editSku"
                  value={editingVariant.sku}
                  onChange={(e) => setEditingVariant({...editingVariant, sku: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPrice">Price ($)</Label>
                  <Input
                    id="editPrice"
                    type="number"
                    step="0.01"
                    value={editingVariant.price}
                    onChange={(e) => setEditingVariant({...editingVariant, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStock">Stock</Label>
                  <Input
                    id="editStock"
                    type="number"
                    value={editingVariant.stockQuantity}
                    onChange={(e) => setEditingVariant({...editingVariant, stockQuantity: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editImageUrl">Image URL (optional)</Label>
                <Input
                  id="editImageUrl"
                  value={editingVariant.imageUrl}
                  onChange={(e) => setEditingVariant({...editingVariant, imageUrl: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVariant(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateVariant}>Update Variant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VariantManager;