import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Order, CartItem } from "../types";
import { MOCK_PRODUCTS, MOCK_ORDERS } from "../data/mockData";
import { showSuccess, showError } from "../utils/toast";

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (productId: string, quantity: number) => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (orderInput: {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  }) => string | null; // returns order ID or null on failure
  updateOrderStatus: (orderId: string, status: "pending" | "shipped" | "cancelled") => void;
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

  // ---------- Product CRUD ----------
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

  const updateProductStock = (productId: string, quantity: number) => {
    setProducts(products.map(p => p.id === productId ? { ...p, stockQuantity: quantity } : p));
    showSuccess("Stock updated");
  };

  // ---------- Cart ----------
  const addToCart = (productId: string, quantity: number = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.status !== "active") {
      showError("Product is currently unavailable");
      return;
    }
    if (product.stockQuantity <= 0) {
      showError("Item is out of stock");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = currentQty + quantity;

      if (newQty > product.stockQuantity) {
        showError(`Only ${product.stockQuantity} units available`);
        return prev;
      }

      showSuccess(existing ? "Cart updated" : "Added to cart");
      if (existing) {
        return prev.map(item =>
          item.productId === productId ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
    showSuccess("Item removed from cart");
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    if (product && quantity > product.stockQuantity) {
      showError(`Only ${product.stockQuantity} units available`);
      return;
    }
    setCart(cart.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  // ---------- Order ----------
  const createOrder = ({
    customerName,
    email,
    phone,
    address,
    city,
    country,
  }: {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  }): string | null => {
    // Validate cart not empty
    if (cart.length === 0) {
      showError("Your cart is empty");
      return null;
    }

    // Validate each cart item against current stock & status
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        showError("A product in your cart no longer exists");
        return null;
      }
      if (product.status !== "active") {
        showError(`"${product.title}" is no longer available`);
        return null;
      }
      if (product.stockQuantity < item.quantity) {
        showError(`Insufficient stock for "${product.title}"`);
        return null;
      }
    }

    // Build order items
    const orderItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return {
        productId: item.productId,
        title: product.title,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99; // simple rule
    const tax = Math.round(subtotal * 0.07 * 100) / 100; // 7% tax
    const totalAmount = subtotal + shipping + tax;

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 1000000)}`,
      customerName,
      email,
      date: new Date().toISOString(),
      status: "pending",
      totalAmount,
      items: orderItems,
    };

    // Reduce stock
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(ci => ci.productId === p.id);
      if (cartItem) {
        return { ...p, stockQuantity: p.stockQuantity - cartItem.quantity };
      }
      return p;
    });

    // Persist
    setOrders([newOrder, ...orders]);
    setProducts(updatedProducts);
    clearCart();

    showSuccess(`Order ${newOrder.id} placed successfully`);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: "pending" | "shipped" | "cancelled") => {
    setOrders(orders.map(o => (o.id === orderId ? { ...o, status } : o)));
    showSuccess(`Order ${orderId} status updated to ${status}`);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};