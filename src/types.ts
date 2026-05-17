export interface Product {
  id: string;
  title: string;
  description: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  imageUrl: string;
  galleryImages: string[];
  rating: number;
  reviewCount: number;
  status: "active" | "draft";
  compatibility: string[];
  specs: Record<string, string>;
  warranty: string;
  condition: "new" | "refurbished" | "used";
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  date: string;
  status: "pending" | "shipped" | "cancelled";
  totalAmount: number;
  items: OrderItem[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}