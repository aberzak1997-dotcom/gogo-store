import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Order, CartItem, Customer, Discount, Review, ReturnRequest, MarketingCampaign, StoreSettings, OrderTimelineEvent } from "../types";
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_RETURNS } from "../data/mockData";
import { showSuccess, showError } from "../utils/toast";

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  customers: Customer[];
  discounts: Discount[];
  reviews: Review[];
  returns: ReturnRequest[];
  campaigns: MarketingCampaign[];
  settings: StoreSettings;
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
  }) => string | null;
  updateOrderStatus: (orderId: string, status: Order["status"], note?: string) => void;
  updatePaymentStatus: (orderId: string, status: Order["paymentStatus"]) => void;
  updateFulfillmentStatus: (orderId: string, status: Order["fulfillmentStatus"]) => void;
  addOrderNote: (orderId: string, note: string, isInternal: boolean) => void;
  createReturnRequest: (returnInput: Omit<ReturnRequest, "id" | "requestedAt" | "status">) => string;
  updateReturnStatus: (returnId: string, status: ReturnRequest["status"]) => void;
  updateSettings: (newSettings: StoreSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "ElectroStore",
  contactEmail: "support@electrostore.com",
  currency: "USD",
  taxRate: 0.07,
  freeShippingThreshold: 50,
  maintenanceMode: false,
};

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

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("store_customers");
    return saved ? JSON.parse(saved) : [];
  });

  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    const saved = localStorage.getItem("store_discounts");
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("store_reviews");
    return saved ? JSON.parse(saved) : [];
  });

  const [returns, setReturns] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem("store_returns");
    return saved ? JSON.parse(saved) : MOCK_RETURNS;
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem("store_campaigns");
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem("store_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
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

  useEffect(() => {
    localStorage.setItem("store_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("store_discounts", JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    localStorage.setItem("store_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("store_returns", JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem("store_campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem("store_settings", JSON.stringify(settings));
  }, [settings]);

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
    if (cart.length === 0) {
      showError("Your cart is empty");
      return null;
    }

    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.status !== "active" || product.stockQuantity < item.quantity) {
        showError(`Issue with product: ${product?.title || "Unknown"}`);
        return null;
      }
    }

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
    const shipping = subtotal > settings.freeShippingThreshold ? 0 : 9.99;
    const tax = Math.round(subtotal * settings.taxRate * 100) / 100;
    const totalAmount = subtotal + shipping + tax;

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 1000000)}`,
      customerName,
      email,
      phone,
      address,
      city,
      country,
      date: new Date().toISOString(),
      status: "pending",
      paymentStatus: "unpaid",
      fulfillmentStatus: "unfulfilled",
      totalAmount,
      items: orderItems,
      timeline: [
        { status: "Order placed", date: new Date().toISOString() }
      ]
    };

    const updatedProducts = products.map(p => {
      const cartItem = cart.find(ci => ci.productId === p.id);
      if (cartItem) {
        return { ...p, stockQuantity: p.stockQuantity - cartItem.quantity };
      }
      return p;
    });

    // Update or add customer
    const existingCustomer = customers.find(c => c.email === email);
    if (existingCustomer) {
      setCustomers(customers.map(c => c.email === email ? {
        ...c,
        totalOrders: c.totalOrders + 1,
        totalSpent: c.totalSpent + totalAmount,
        lastOrderDate: newOrder.date
      } : c));
    } else {
      const newCustomer: Customer = {
        id: `CUST-${Math.floor(Math.random() * 1000000)}`,
        name: customerName,
        email,
        phone,
        totalOrders: 1,
        totalSpent: totalAmount,
        lastOrderDate: newOrder.date,
        createdAt: new Date().toISOString()
      };
      setCustomers([...customers, newCustomer]);
    }

    setOrders([newOrder, ...orders]);
    setProducts(updatedProducts);
    clearCart();

    showSuccess(`Order ${newOrder.id} placed successfully`);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"], note?: string) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const newEvent: OrderTimelineEvent = {
          status: status.charAt(0).toUpperCase() + status.slice(1),
          date: new Date().toISOString(),
          note
        };
        return { ...o, status, timeline: [...o.timeline, newEvent] };
      }
      return o;
    }));
    showSuccess(`Order ${orderId} status updated to ${status}`);
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: Order["paymentStatus"]) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const newEvent: OrderTimelineEvent = {
          status: `Payment status: ${paymentStatus}`,
          date: new Date().toISOString()
        };
        return { ...o, paymentStatus, timeline: [...o.timeline, newEvent] };
      }
      return o;
    }));
    showSuccess(`Order ${orderId} payment status updated to ${paymentStatus}`);
  };

  const updateFulfillmentStatus = (orderId: string, fulfillmentStatus: Order["fulfillmentStatus"]) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const newEvent: OrderTimelineEvent = {
          status: `Fulfillment status: ${fulfillmentStatus}`,
          date: new Date().toISOString()
        };
        return { ...o, fulfillmentStatus, timeline: [...o.timeline, newEvent] };
      }
      return o;
    }));
    showSuccess(`Order ${orderId} fulfillment status updated to ${fulfillmentStatus}`);
  };

  const addOrderNote = (orderId: string, note: string, isInternal: boolean) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return isInternal ? { ...o, internalNotes: note } : { ...o, notes: note };
      }
      return o;
    }));
    showSuccess("Note saved");
  };

  const createReturnRequest = (returnInput: Omit<ReturnRequest, "id" | "requestedAt" | "status">): string => {
    const newReturn: ReturnRequest = {
      ...returnInput,
      id: `RET-${Math.floor(Math.random() * 1000000)}`,
      requestedAt: new Date().toISOString(),
      status: "requested"
    };
    setReturns([newReturn, ...returns]);
    showSuccess("Return request created");
    return newReturn.id;
  };

  const updateReturnStatus = (returnId: string, status: ReturnRequest["status"]) => {
    const returnReq = returns.find(r => r.id === returnId);
    if (!returnReq) return;

    setReturns(returns.map(r => r.id === returnId ? { ...r, status } : r));

    if (status === "refunded") {
      // Update related order
      const order = orders.find(o => o.id === returnReq.orderId);
      if (order) {
        const isFullRefund = returnReq.refundAmount >= order.totalAmount;
        updatePaymentStatus(order.id, isFullRefund ? "refunded" : "partially_refunded");
        updateOrderStatus(order.id, "refunded", `Refund processed via return ${returnId}`);
      }
    }
    showSuccess(`Return ${returnId} status updated to ${status}`);
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    showSuccess("Store settings updated");
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        customers,
        discounts,
        reviews,
        returns,
        campaigns,
        settings,
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
        updatePaymentStatus,
        updateFulfillmentStatus,
        addOrderNote,
        createReturnRequest,
        updateReturnStatus,
        updateSettings,
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