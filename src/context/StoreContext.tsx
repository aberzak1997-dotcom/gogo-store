import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Order, CartItem } from "../types";
import { MOCK_PRODUCTS, MOCK_ORDERS } from "../data/mockData";
import { showSuccess } from "../utils/toast";

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, quantity: number) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (customerName: string, email: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("store_products");
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("store_orders");
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("store_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("store_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("store_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("store_cart", JSON.stringify(cart));
  }, [cart]);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
    showSuccess("Product added successfully");
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showSuccess("Product updated successfully");
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    showSuccess("Product deleted");
  };

  const updateStock = (productId: string, quantity: number) => {
    setProducts(products.map(p => p.id === productId ? { ...p, stockQuantity: quantity } : p));
  };

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stockQuantity <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    showSuccess("Added to cart");
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const createOrder = (customerName: string, email: string) => {
    const orderItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return {
        productId: item.productId,
        title: product.title,
        quantity: item.quantity,
        price: product.price
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      customerName,
      email,
      date: new Date().toISOString(),
      status: "pending",
      totalAmount,
      items: orderItems
    };

    setOrders([newOrder, ...orders]);
    
    // Update stock
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId)!;
      updateStock(item.productId, product.stockQuantity - item.quantity);
    });

    clearCart();
    showSuccess("Order placed successfully!");
  };

  return (
    <StoreContext.Provider value={{
      products, orders, cart,
      addProduct, updateProduct, deleteProduct, updateStock,
      addToCart, removeFromCart, updateCartQuantity, clearCart, createOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};