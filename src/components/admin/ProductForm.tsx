"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "../../types";
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  existingSkus: string[];
  onSubmit: (data: Product) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, existingSkus, onSubmit, onCancel }: ProductFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      title: "",
      brand: "",
      sku: "",
      category: "Phone Accessories",
      subcategory: "",
      price: 0,
      compareAtPrice: 0,
      stockQuantity: 0,
      status: "draft",
      condition: "new",
      imageUrl: "",
      description: "",
    }
  );

  const [imageSource, setImageSource] = useState<"url" | "upload">("url");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "compareAtPrice" || name === "stockQuantity" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      id: product?.id || Math.random().toString(36).substr(2, 9),
      createdAt: product?.createdAt || new Date().toISOString(),
    } as Product;
    onSubmit(finalData);
  };

  const categories = [
    "Phone Accessories", "Chargers & Cables", "Audio", 
    "Laptop Accessories", "PC Accessories", "Gaming Accessories", "Storage Devices"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Product Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Wireless Mechanical Keyboard" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required placeholder="e.g. Logitech" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} required placeholder="e.g. LOGI-K850" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => handleSelectChange("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(v) => handleSelectChange("condition", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input id="stockQuantity" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* Right Column: Media & Description */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex gap-2 mb-2">
              <Button 
                type="button" 
                variant={imageSource === "url" ? "default" : "outline"} 
                size="sm" 
                className="flex-1 gap-2"
                onClick={() => setImageSource("url")}
              >
                <LinkIcon size={14} /> URL
              </Button>
              <Button 
                type="button" 
                variant={imageSource === "upload" ? "default" : "outline"} 
                size="sm" 
                className="flex-1 gap-2"
                onClick={() => setImageSource("upload")}
              >
                <Upload size={14} /> Upload
              </Button>
            </div>

            {imageSource === "url" ? (
              <Input 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange} 
                placeholder="https://example.com/image.jpg" 
              />
            ) : (
              <div className="flex flex-col gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed h-10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Image File
                </Button>
              </div>
            )}

            <div className="mt-4 aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X size={16} className="text-slate-600" />
                  </button>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <ImageIcon className="mx-auto text-slate-300" size={40} />
                  <p className="text-xs text-slate-400">Image preview will appear here</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4} 
              placeholder="Describe the product features and specifications..." 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="px-8">
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;