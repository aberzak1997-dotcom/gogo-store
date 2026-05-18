import React, { useState, useEffect } from "react";
import { Product, ProductVariant } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, X, Upload } from "lucide-react";
import { showError } from "../../utils/toast";
import VariantManager from "./VariantManager";

interface ProductFormProps {
  product?: Product;
  existingSkus: string[];
  onSubmit: (data: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, existingSkus, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    description: "",
    sku: "",
    brand: "",
    category: "",
    subcategory: "",
    price: 0,
    compareAtPrice: undefined,
    stockQuantity: 0,
    imageUrl: "",
    galleryImages: [],
    rating: 4.5,
    reviewCount: 0,
    status: "active",
    compatibility: [],
    specs: {},
    warranty: "1 Year",
    condition: "new",
    ...product
  });

  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [newTag, setNewTag] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpec = () => {
    if (!newSpec.key || !newSpec.value) return;
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [newSpec.key]: newSpec.value }
    }));
    setNewSpec({ key: "", value: "" });
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...formData.specs };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const addTag = () => {
    if (!newTag || formData.compatibility?.includes(newTag)) return;
    setFormData(prev => ({
      ...prev,
      compatibility: [...(prev.compatibility || []), newTag]
    }));
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      compatibility: prev.compatibility?.filter(t => t !== tag)
    }));
  };

  const validate = () => {
    if (!formData.title) return "Title is required";
    if (!formData.description) return "Description is required";
    if (!formData.sku) return "SKU is required";
    if (!product && existingSkus.includes(formData.sku!)) return "SKU must be unique";
    if (!formData.brand) return "Brand is required";
    if (!formData.category) return "Category is required";
    if (!formData.subcategory) return "Subcategory is required";
    if ((formData.price || 0) <= 0) return "Price must be greater than 0";
    if (formData.compareAtPrice && formData.compareAtPrice <= (formData.price || 0)) {
      return "Compare-at price must be greater than price";
    }
    if ((formData.stockQuantity || 0) < 0) return "Stock cannot be negative";
    if (!formData.warranty) return "Warranty is required";
    if ((formData.rating || 0) < 0 || (formData.rating || 0) > 5) return "Rating must be between 0 and 5";
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      showError(error);
      return;
    }

    const finalData: Product = {
      ...(formData as Product),
      id: product?.id || Math.random().toString(36).substr(2, 9),
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      createdAt: product?.createdAt || new Date().toISOString()
    };

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Product Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. USB-C Fast Charger" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. CHG-001" disabled={!!product} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. VoltTech" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(v) => handleSelectChange("category", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
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
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input id="subcategory" name="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="e.g. Wall Chargers" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select value={formData.condition} onValueChange={(v) => handleSelectChange("condition", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="refurbished">Refurbished</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Compare-at Price ($)</Label>
          <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" value={formData.compareAtPrice || ""} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input id="stockQuantity" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Main Image</Label>
          <div className="flex gap-2">
            <Input 
              id="imageUrl" 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleChange} 
              placeholder="https://..." 
              className="flex-grow"
            />
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => document.getElementById('image-upload')?.click()}
                title="Upload Image"
              >
                <Upload size={18} />
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Variant Manager */}
      {product && (
        <VariantManager
          product={product}
          onVariantAdd={(variant) => {
            const updatedProduct = {
              ...product,
              variants: [...(product.variants || []), variant]
            };
            onSubmit(updatedProduct);
          }}
          onVariantUpdate={(variant) => {
            const updatedProduct = {
              ...product,
              variants: product.variants?.map(v => v.id === variant.id ? variant : v) || []
            };
            onSubmit(updatedProduct);
          }}
          onVariantDelete={(variantId) => {
            const updatedProduct = {
              ...product,
              variants: product.variants?.filter(v => v.id !== variantId) || []
            };
            onSubmit(updatedProduct);
          }}
        />
      )}

      <div className="space-y-4 border p-4 rounded-lg bg-slate-50">
        <Label className="text-base font-bold">Technical Specifications</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input placeholder="Key (e.g. Wattage)" value={newSpec.key} onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })} />
          <Input placeholder="Value (e.g. 65W)" value={newSpec.value} onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })} />
          <Button type="button" variant="secondary" onClick={addSpec} className="gap-2">
            <Plus size={16} /> Add Spec
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(formData.specs || {}).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 bg-white border px-3 py-1 rounded-full text-sm">
              <span className="font-bold">{key}:</span> {value}
              <button type="button" onClick={() => removeSpec(key)} className="text-slate-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 border p-4 rounded-lg bg-slate-50">
        <Label className="text-base font-bold">Compatibility Tags</Label>
        <div className="flex gap-2">
          <Input placeholder="e.g. MacBook Pro" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
          <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.compatibility?.map(tag => (
            <div key={tag} className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{product ? "Update Product" : "Create Product"}</Button>
      </div>
    </form>
  );
};

export default ProductForm;