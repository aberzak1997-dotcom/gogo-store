import React, { useState, useEffect } from "react";
import { Product, ProductVariant } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, X, Upload, Sparkles, RefreshCw, ChevronDown, ChevronUp, Globe } from "lucide-react";
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
  const [seoOpen, setSeoOpen] = useState(false);
  const [seoData, setSeoData] = useState(() => {
    try {
      const key = `product_seo_${product?.id || "new"}`;
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch { return {}; }
  });
  const [seoGenerating, setSeoGenerating] = useState<Record<string, boolean>>({});

  const setSeo = (field: string, value: string) =>
    setSeoData((p: Record<string, string>) => ({ ...p, [field]: value }));

  const saveSeo = (id: string) => {
    localStorage.setItem(`product_seo_${id}`, JSON.stringify(seoData));
  };

  const generateSeoField = async (field: string) => {
    setSeoGenerating((p) => ({ ...p, [field]: true }));
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
    const title = formData.title || "Product";
    const brand = formData.brand || "WIVITEC";
    const cat   = formData.category || "Electronics";
    const desc  = formData.description || "";
    if (field === "seoTitle") {
      setSeo("seoTitle", `${title} — ${brand} | WIVITEC Store`);
    } else if (field === "seoDescription") {
      const snippet = desc.slice(0, 80).trim();
      setSeo("seoDescription", `Buy the ${title} by ${brand} at WIVITEC. ${snippet ? snippet + ". " : ""}Fast delivery across Morocco. 1-Year warranty included.`);
    } else if (field === "focusKeyword") {
      setSeo("focusKeyword", `${title.toLowerCase()}, buy ${brand.toLowerCase()} ${cat.toLowerCase()}, ${brand.toLowerCase()} Morocco`);
    }
    setSeoGenerating((p) => ({ ...p, [field]: false }));
  };

  const generateAllSeo = async () => {
    for (const f of ["seoTitle", "seoDescription", "focusKeyword"]) await generateSeoField(f);
  };

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
    if (!file) return;

    // ── File type validation (whitelist safe image formats only) ──────────────
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      showError("Invalid file type. Only JPG, PNG, WebP and GIF are allowed.");
      e.target.value = "";
      return;
    }

    // ── File size validation (max 5 MB) ───────────────────────────────────────
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showError("File is too large. Maximum size is 5 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
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

    const finalId = product?.id || Math.random().toString(36).substr(2, 9);
    saveSeo(finalId);

    const finalData: Product = {
      ...(formData as Product),
      id: finalId,
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

      {/* ── SEO Section ── */}
      <div className="rounded-[10px] border border-[#F0F2F8] overflow-hidden">
        <button
          type="button"
          onClick={() => setSeoOpen(!seoOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#F0F2F8] hover:bg-[#e8ebf5] transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(17,96,203,0.12)", color: "#1160CB", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={13} />
            </div>
            <span className="text-[13px] font-semibold text-[#0C0D10]">SEO Settings</span>
            <span className="text-[10px] font-medium text-[#1160CB] bg-[#1160CB]/10 px-2 py-0.5 rounded-full">Optional</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSeoOpen(true); generateAllSeo(); }}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#1160CB] hover:text-[#1528A1] transition-colors px-2 py-1 rounded"
            >
              <Sparkles size={11} /> AI Fill
            </button>
            {seoOpen ? <ChevronUp size={14} className="text-[#0C0D10]/30" /> : <ChevronDown size={14} className="text-[#0C0D10]/30" />}
          </div>
        </button>

        {seoOpen && (
          <div className="p-4 space-y-4 bg-white">
            {/* Google preview */}
            <div className="p-3 rounded-[8px] bg-[#F0F2F8] space-y-1">
              <p className="text-[10px] font-bold text-[#0C0D10]/40 uppercase tracking-widest mb-2">Google Preview</p>
              <p className="text-[#1a0dab] text-[14px] font-medium leading-snug line-clamp-1">
                {seoData.seoTitle || formData.title || "Product Title — WIVITEC Store"}
              </p>
              <p className="text-[#4d5156] text-[12px] leading-relaxed line-clamp-2">
                {seoData.seoDescription || "Your meta description will appear here."}
              </p>
            </div>

            {/* SEO Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1160CB]">SEO Title</label>
                <button type="button" onClick={() => generateSeoField("seoTitle")} disabled={seoGenerating.seoTitle}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#1160CB] hover:text-[#1528A1] disabled:opacity-50 transition-colors">
                  {seoGenerating.seoTitle ? <><RefreshCw size={10} className="animate-spin" /> Generating…</> : <><Sparkles size={10} /> AI</>}
                </button>
              </div>
              <input
                className="w-full h-10 px-3 rounded-[8px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1160CB]"
                style={{ border: "1.5px solid #F0F2F8", fontSize: 13 }}
                placeholder={`${formData.title || "Product"} — Brand | WIVITEC Store`}
                value={seoData.seoTitle || ""}
                onChange={(e) => setSeo("seoTitle", e.target.value)}
              />
              <p className="text-[11px] text-[#0C0D10]/35">{(seoData.seoTitle || "").length}/60 chars recommended</p>
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1160CB]">Meta Description</label>
                <button type="button" onClick={() => generateSeoField("seoDescription")} disabled={seoGenerating.seoDescription}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#1160CB] hover:text-[#1528A1] disabled:opacity-50 transition-colors">
                  {seoGenerating.seoDescription ? <><RefreshCw size={10} className="animate-spin" /> Generating…</> : <><Sparkles size={10} /> AI</>}
                </button>
              </div>
              <textarea
                rows={3}
                className="w-full px-3 py-2 rounded-[8px] text-[13px] resize-none focus:outline-none focus:ring-1 focus:ring-[#1160CB]"
                style={{ border: "1.5px solid #F0F2F8", fontSize: 13 }}
                placeholder="Brief description for Google search results…"
                value={seoData.seoDescription || ""}
                onChange={(e) => setSeo("seoDescription", e.target.value)}
              />
              <p className="text-[11px] text-[#0C0D10]/35">{(seoData.seoDescription || "").length}/160 chars recommended</p>
            </div>

            {/* Focus Keyword */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1160CB]">Focus Keywords</label>
                <button type="button" onClick={() => generateSeoField("focusKeyword")} disabled={seoGenerating.focusKeyword}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#1160CB] hover:text-[#1528A1] disabled:opacity-50 transition-colors">
                  {seoGenerating.focusKeyword ? <><RefreshCw size={10} className="animate-spin" /> Generating…</> : <><Sparkles size={10} /> AI</>}
                </button>
              </div>
              <input
                className="w-full h-10 px-3 rounded-[8px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1160CB]"
                style={{ border: "1.5px solid #F0F2F8", fontSize: 13 }}
                placeholder="keyword one, keyword two, …"
                value={seoData.focusKeyword || ""}
                onChange={(e) => setSeo("focusKeyword", e.target.value)}
              />
              <p className="text-[11px] text-[#0C0D10]/35">Comma-separated keywords</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{product ? "Update Product" : "Create Product"}</Button>
      </div>
    </form>
  );
};

export default ProductForm;