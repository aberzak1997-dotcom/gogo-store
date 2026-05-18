import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant, Order, CartItem, Customer, Discount, Review, ReturnRequest, MarketingCampaign, StoreSettings, Collection, calculateCustomerStatus } from "../types";
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_RETURNS, MOCK_CUSTOMERS, MOCK_REVIEWS, MOCK_COLLECTIONS } from "../data/mockData";
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
  collections: Collection[];
  settings: StoreSettings;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addVariant: (productId: string, variant: ProductVariant) => void;
  updateVariant: (productId: string, variant: ProductVariant) => void;
  deleteVariant: (productId: string, variantId: string) => void;
  updateProductStock: (productId: string, quantity: number) => void;
  updateVariantStock: (productId: string, variantId: string, quantity: number) => void;
  addToCart: (productId: string, quantity?: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
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
  addCollection: (collection: Collection) => void;
  updateCollection: (collection: Collection) => void;
  deleteCollection: (id: string) => void;
  addProductToCollection: (collectionId: string, productId: string) => void;
  removeProductFromCollection: (collectionId: string, productId: string) => void;
  bulkUpdateProducts: (productIds: string[], updates: Partial<Product>) => void;
  bulkDeleteProducts: (productIds: string[]) => void;
  exportProductsToCSV: () => string;
  importProductsFromCSV: (csvData: string) => { success: Product[]; errors: string[] };
  // Customer & Review Management
  updateCustomer: (customer: Customer) => void;
  addCustomerNote: (customerId: string, note: string) => void;
  updateReviewStatus: (reviewId: string, status: Review["status"]) => void;
  deleteReview: (reviewId: string) => void;
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
    return saved ? JSON.parse(saved) : MOCK_CUSTOMERS;
  });

  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    const saved = localStorage.getItem("store_discounts");
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("store_reviews");
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  const [returns, setReturns] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem("store_returns");
    return saved ? JSON.parse(saved) : MOCK_RETURNS;
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem("store_campaigns");
    return saved ? JSON.parse(saved) : [];
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem("store_collections");
    return saved ? JSON.parse(saved) : MOCK_COLLECTIONS;
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
    localStorage.setItem("store_collections", JSON.stringify(collections));
  }, [collections]);

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
    // Remove from collections
    setCollections(collections.map(c => ({
      ...c,
      productIds: c.productIds.filter(productId => productId !== id)
    })));
    showSuccess("Product deleted");
  };

  const addVariant = (productId: string, variant: ProductVariant) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          variants: [...(p.variants || []), variant]
        };
      }
      return p;
    }));
    showSuccess("Variant added successfully");
  };

  const updateVariant = (productId: string, variant: ProductVariant) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          variants: p.variants?.map(v => v.id === variant.id ? variant : v) || []
        };
      }
      return p;
    }));
    showSuccess("Variant updated successfully");
  };

  const deleteVariant = (productId: string, variantId: string) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          variants: p.variants?.filter(v => v.id !== variantId) || []
        };
      }
      return p;
    }));
    showSuccess("Variant deleted");
  };

  const updateProductStock = (productId: string, quantity: number) => {
    setProducts(products.map(p => p.id === productId ? { ...p, stockQuantity: quantity } : p));
    showSuccess("Stock updated");
  };

  const updateVariantStock = (productId: string, variantId: string, quantity: number) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          variants: p.variants?.map(v => v.id === variantId ? { ...v, stockQuantity: quantity } : v) || []
        };
      }
      return p;
    }));
    showSuccess("Variant stock updated");
  };

  const addToCart = (productId: string, quantity: number = 1, variantId?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.status !== "active") {
      showError("Product is currently unavailable");
      return;
    }

    // Check if variant exists and is in stock
    if (variantId) {
      const variant = product.variants?.find(v => v.id === variantId);
      if (!variant) {
        showError("Selected variant is not available");
        return;
      }
      if (variant.stockQuantity <= 0) {
        showError("Variant is out of stock");
        return;
      }
      if (quantity > variant.stockQuantity) {
        showError(`Only ${variant.stockQuantity} units available`);
        return;
      }
    } else {
      // Check main product stock
      if (product.stockQuantity <= 0) {
        showError("Item is out of stock");
        return;
      }
      if (quantity > product.stockQuantity) {
        showError(`Only ${product.stockQuantity} units available`);
        return;
      }
    }

    setCart(prev => {
      const existing = prev.find(item => 
        item.productId === productId && item.variantId === variantId
      );
      const currentQty = existing ? existing.quantity : 0;
      const newQty = currentQty + quantity;

      if (existing) {
        return prev.map(item =>
          item.productId === productId && item.variantId === variantId 
            ? { ...item, quantity: newQty } 
            : item
        );
      }
      return [...prev, { productId, variantId, quantity }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(cart.filter(item => 
      !(item.productId === productId && item.variantId === variantId)
    ));
    showSuccess("Item removed from cart");
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check variant stock if specified
    if (variantId) {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant && quantity > variant.stockQuantity) {
        showError(`Only ${variant.stockQuantity} units available`);
        return;
      }
    } else {
      // Check main product stock
      if (quantity > product.stockQuantity) {
        showError(`Only ${product.stockQuantity} units available`);
        return;
      }
    }

    setCart(cart.map(item => 
      item.productId === productId && item.variantId === variantId 
        ? { ...item, quantity } 
        : item
    ));
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

    // Validate cart items
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.status !== "active") {
        showError(`Product is unavailable: ${product?.title || "Unknown"}`);
        return null;
      }

      if (item.variantId) {
        const variant = product.variants?.find(v => v.id === item.variantId);
        if (!variant || variant.stockQuantity < item.quantity) {
          showError(`Variant stock issue: ${variant?.optionValue || "Unknown"}`);
          return null;
        }
      } else {
        if (product.stockQuantity < item.quantity) {
          showError(`Insufficient stock for: ${product.title}`);
          return null;
        }
      }
    }

    const orderItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      const variant = item.variantId ? product.variants?.find(v => v.id === item.variantId) : null;
      
      return {
        productId: item.productId,
        variantId: item.variantId,
        title: variant ? `${product.title} - ${variant.optionValue}` : product.title,
        quantity: item.quantity,
        price: variant ? variant.price : product.price,
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

    // Update product stock
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(ci => ci.productId === p.id);
      if (cartItem) {
        if (cartItem.variantId) {
          const variantIndex = p.variants?.findIndex(v => v.id === cartItem.variantId);
          if (variantIndex !== undefined && p.variants) {
            const updatedVariants = [...p.variants];
            updatedVariants[variantIndex] = {
              ...updatedVariants[variantIndex],
              stockQuantity: updatedVariants[variantIndex].stockQuantity - cartItem.quantity
            };
            return { ...p, variants: updatedVariants };
          }
        } else {
          return { ...p, stockQuantity: p.stockQuantity - cartItem.quantity };
        }
      }
      return p;
    });

    // Update or add customer
    const existingCustomer = customers.find(c => c.email === email);
    if (existingCustomer) {
      setCustomers(customers.map(c => {
        if (c.email === email) {
          const updatedCustomer = {
            ...c,
            totalOrders: c.totalOrders + 1,
            totalSpent: c.totalSpent + totalAmount,
            lastOrderDate: newOrder.date
          };
          return {
            ...updatedCustomer,
            status: calculateCustomerStatus(updatedCustomer)
          };
        }
        return c;
      }));
    } else {
      const newCustomer: Customer = {
        id: `CUST-${Math.floor(Math.random() * 1000000)}`,
        name: customerName,
        email,
        phone,
        totalOrders: 1,
        totalSpent: totalAmount,
        lastOrderDate: newOrder.date,
        createdAt: new Date().toISOString(),
        status: "active"
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
        const newEvent = {
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
        const newEvent = {
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
        const newEvent = {
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

  const addCollection = (collection: Collection) => {
    setCollections([...collections, collection]);
    showSuccess("Collection created");
  };

  const updateCollection = (updatedCollection: Collection) => {
    setCollections(collections.map(c => c.id === updatedCollection.id ? updatedCollection : c));
    showSuccess("Collection updated");
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
    showSuccess("Collection deleted");
  };

  const addProductToCollection = (collectionId: string, productId: string) => {
    setCollections(collections.map(c => {
      if (c.id === collectionId) {
        return {
          ...c,
          productIds: [...c.productIds, productId]
        };
      }
      return c;
    }));
    showSuccess("Product added to collection");
  };

  const removeProductFromCollection = (collectionId: string, productId: string) => {
    setCollections(collections.map(c => {
      if (c.id === collectionId) {
        return {
          ...c,
          productIds: c.productIds.filter(id => id !== productId)
        };
      }
      return c;
    }));
    showSuccess("Product removed from collection");
  };

  const bulkUpdateProducts = (productIds: string[], updates: Partial<Product>) => {
    setProducts(products.map(p => {
      if (productIds.includes(p.id)) {
        return { ...p, ...updates };
      }
      return p;
    }));
    showSuccess(`${productIds.length} products updated`);
  };

  const bulkDeleteProducts = (productIds: string[]) => {
    setProducts(products.filter(p => !productIds.includes(p.id)));
    // Remove from collections
    setCollections(collections.map(c => ({
      ...c,
      productIds: c.productIds.filter(productId => !productIds.includes(productId))
    })));
    showSuccess(`${productIds.length} products deleted`);
  };

  const exportProductsToCSV = (): string => {
    const headers = [
      "ID", "Title", "Description", "SKU", "Brand", "Category", "Subcategory",
      "Price", "Compare At Price", "Stock", "Status", "Rating", "Review Count",
      "Warranty", "Condition", "Image URL", "Compatibility", "Specs"
    ];

    const rows = products.map(p => [
      p.id,
      p.title,
      p.description,
      p.sku,
      p.brand,
      p.category,
      p.subcategory,
      p.price,
      p.compareAtPrice || "",
      p.stockQuantity,
      p.status,
      p.rating,
      p.reviewCount,
      p.warranty,
      p.condition,
      p.imageUrl,
      p.compatibility.join(";"),
      Object.entries(p.specs).map(([k, v]) => `${k}:${v}`).join(";")
    ]);

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
  };

  const importProductsFromCSV = (csvData: string) => {
    const lines = csvData.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.replace(/"/g, ""));
    
    const success: Product[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.replace(/"/g, ""));
      
      try {
        const product: Product = {
          id: `PROD-${Math.floor(Math.random() * 1000000)}`,
          title: values[1] || "",
          description: values[2] || "",
          sku: values[3] || "",
          brand: values[4] || "",
          category: values[5] || "",
          subcategory: values[6] || "",
          price: parseFloat(values[7]) || 0,
          compareAtPrice: values[8] ? parseFloat(values[8]) : undefined,
          stockQuantity: parseInt(values[9]) || 0,
          imageUrl: values[15] || "",
          galleryImages: [],
          rating: parseFloat(values[11]) || 0,
          reviewCount: parseInt(values[12]) || 0,
          status: (values[10] as "active" | "draft") || "draft",
          compatibility: values[16]?.split(";") || [],
          specs: values[17]?.split(";").reduce((acc, spec) => {
            const [key, value] = spec.split(":");
            if (key && value) acc[key] = value;
            return acc;
          }, {} as Record<string, string>),
          warranty: values[13] || "1 Year",
          condition: (values[14] as "new" | "refurbished" | "used") || "new",
          createdAt: new Date().toISOString(),
          variants: []
        };

        if (!product.title || !product.sku) {
          errors.push(`Row ${i + 1}: Missing required fields (title or SKU)`);
          continue;
        }

        if (products.some(p => p.sku === product.sku)) {
          errors.push(`Row ${i + 1}: SKU already exists`);
          continue;
        }

        success.push(product);
      } catch (error) {
        errors.push(`Row ${i + 1}: Invalid data format`);
      }
    }

    if (success.length > 0) {
      setProducts([...products, ...success]);
      showSuccess(`Successfully imported ${success.length} products`);
    }

    return { success, errors };
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    showSuccess("Customer updated");
  };

  const addCustomerNote = (customerId: string, note: string) => {
    setCustomers(customers.map(c => c.id === customerId ? { ...c, notes: note } : c));
    showSuccess("Note added");
  };

  const updateReviewStatus = (reviewId: string, status: Review["status"]) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, status } : r));
    showSuccess(`Review ${status}`);
  };

  const deleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
    showSuccess("Review deleted");
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
        collections,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        addVariant,
        updateVariant,
        deleteVariant,
        updateProductStock,
        updateVariantStock,
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
        addCollection,
        updateCollection,
        deleteCollection,
        addProductToCollection,
        removeProductFromCollection,
        bulkUpdateProducts,
        bulkDeleteProducts,
        exportProductsToCSV,
        importProductsFromCSV,
        updateCustomer,
        addCustomerNote,
        updateReviewStatus,
        deleteReview,
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