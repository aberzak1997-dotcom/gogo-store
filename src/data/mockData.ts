import { Product, ProductVariant, Collection } from "../types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "USB-C 65W Fast Charger",
    description: "Compact GaN charger with dual ports for laptops and phones.",
    sku: "CHG-001",
    brand: "VoltTech",
    category: "Chargers & Cables",
    subcategory: "Wall Chargers",
    price: 39.99,
    compareAtPrice: 49.99,
    stockQuantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1619130966962-61f678244a57?w=800&q=80",
    galleryImages: [],
    rating: 4.8,
    reviewCount: 124,
    status: "active",
    compatibility: ["MacBook", "iPhone", "Samsung Galaxy", "Dell XPS"],
    specs: { "Power": "65W", "Ports": "2x USB-C", "Technology": "GaN" },
    warranty: "1 Year",
    condition: "new",
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: "1-1",
        productId: "1",
        optionName: "Color",
        optionValue: "Black",
        sku: "CHG-001-BK",
        price: 39.99,
        stockQuantity: 10,
        imageUrl: "https://images.unsplash.com/photo-1619130966962-61f678244a57?w=800&q=80"
      },
      {
        id: "1-2",
        productId: "1",
        optionName: "Color",
        optionValue: "White",
        sku: "CHG-001-WH",
        price: 39.99,
        stockQuantity: 5,
        imageUrl: "https://images.unsplash.com/photo-1619130966962-61f678244a57?w=800&q=80"
      }
    ]
  },
  {
    id: "2",
    title: "MagSafe Wireless Charger",
    description: "Snap-on magnetic wireless charging for iPhone 12 and newer.",
    sku: "CHG-002",
    brand: "Apple",
    category: "Chargers & Cables",
    subcategory: "Wireless Chargers",
    price: 39.00,
    stockQuantity: 8,
    imageUrl: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=800&q=80",
    galleryImages: [],
    rating: 4.5,
    reviewCount: 89,
    status: "active",
    compatibility: ["iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15"],
    specs: { "Power": "15W", "Connector": "USB-C" },
    warranty: "1 Year",
    condition: "new",
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: "2-1",
        productId: "2",
        optionName: "Color",
        optionValue: "Black",
        sku: "CHG-002-BK",
        price: 39.00,
        stockQuantity: 5,
        imageUrl: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=800&q=80"
      },
      {
        id: "2-2",
        productId: "2",
        optionName: "Color",
        optionValue: "White",
        sku: "CHG-002-WH",
        price: 39.00,
        stockQuantity: 3,
        imageUrl: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=800&q=80"
      }
    ]
  },
  {
    id: "3",
    title: "Pro Wireless Earbuds",
    description: "Active noise cancelling with spatial audio and 24h battery life.",
    sku: "AUD-001",
    brand: "SoundWave",
    category: "Audio",
    subcategory: "Earbuds",
    price: 129.99,
    compareAtPrice: 159.99,
    stockQuantity: 3,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    galleryImages: [],
    rating: 4.9,
    reviewCount: 450,
    status: "active",
    compatibility: ["Bluetooth devices"],
    specs: { "Battery": "24 Hours", "Waterproof": "IPX4" },
    warranty: "2 Years",
    condition: "new",
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: "3-1",
        productId: "3",
        optionName: "Color",
        optionValue: "Black",
        sku: "AUD-001-BK",
        price: 129.99,
        stockQuantity: 2,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"
      },
      {
        id: "3-2",
        productId: "3",
        optionName: "Color",
        optionValue: "White",
        sku: "AUD-001-WH",
        price: 129.99,
        stockQuantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"
      }
    ]
  },
  {
    id: "4",
    title: "Over-Ear Bluetooth Headphones",
    description: "Premium sound quality with 40h battery and comfortable ear cups.",
    sku: "AUD-002",
    brand: "AudioMax",
    category: "Audio",
    subcategory: "Headphones",
    price: 199.99,
    stockQuantity: 12,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    galleryImages: [],
    rating: 4.7,
    reviewCount: 210,
    status: "active",
    compatibility: ["Bluetooth devices", "3.5mm Jack"],
    specs: { "Battery": "40 Hours", "Driver": "40mm" },
    warranty: "1 Year",
    condition: "new",
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: "4-1",
        productId: "4",
        optionName: "Color",
        optionValue: "Black",
        sku: "AUD-002-BK",
        price: 199.99,
        stockQuantity: 8,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
      },
      {
        id: "4-2",
        productId: "4",
        optionName: "Color",
        optionValue: "White",
        sku: "AUD-002-WH",
        price: 199.99,
        stockQuantity: 4,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
      }
    ]
  },
  {
    id: "5",
    title: "Mechanical Gaming Keyboard",
    description: "RGB backlit with blue switches for tactile feedback.",
    sku: "PC-001",
    brand: "GameForce",
    category: "Gaming Accessories",
    subcategory: "Keyboards",
    price: 89.99,
    compareAtPrice: 109.99,
    stockQuantity: 20,
    imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80",
    galleryImages: [],
    rating: 4.6,
    reviewCount: 156,
    status: "active",
    compatibility: ["Windows", "macOS", "Linux"],
    specs: { "Switches": "Mechanical Blue", "Backlight": "RGB" },
    warranty: "1 Year",
    condition: "new",
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: "5-1",
        productId: "5",
        optionName: "Switch Type",
        optionValue: "Blue",
        sku: "PC-001-BLUE",
        price: 89.99,
        stockQuantity: 10,
        imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80"
      },
      {
        id: "5-2",
        productId: "5",
        optionName: "Switch Type",
        optionValue: "Red",
        sku: "PC-001-RED",
        price: 89.99,
        stockQuantity: 10,
        imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80"
      }
    ]
  },
  {
    id: "6",
    title: "Ergonomic Wireless Mouse",
    description: "Precision tracking with comfortable grip for long work hours.",
    sku: "PC-002",
    brand: "LogiWork",
    category: "PC Accessories",
    subcategory: "Mice",
    price: 49.99,
    stockQuantity: 0,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    galleryImages: [],
    rating: 4.4,
    reviewCount: 98,
    status: "active",
    compatibility: ["Windows", "macOS", "iPadOS"],
    specs: { "DPI": "4000", "Battery": "Rechargeable" },
    warranty: "1 Year",
    condition: "new",
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: "6-1",
        productId: "6",
        optionName: "Color",
        optionValue: "Black",
        sku: "PC-002-BK",
        price: 49.99,
        stockQuantity: 0,
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80"
      },
      {
        id: "6-2",
        productId: "6",
        optionName: "Color",
        optionValue: "White",
        sku: "PC-002-WH",
        price: 49.99,
        stockQuantity: 0,
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80"
      }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    customerName: "John Doe",
    email: "john@example.com",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "delivered",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    totalAmount: 129.99,
    items: [
      { productId: "3", variantId: "3-1", title: "Pro Wireless Earbuds", quantity: 1, price: 129.99 }
    ],
    timeline: [
      { status: "Order placed", date: new Date(Date.now() - 86400000 * 2).toISOString() },
      { status: "Payment received", date: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString() },
      { status: "Shipped", date: new Date(Date.now() - 86400000).toISOString() },
      { status: "Delivered", date: new Date(Date.now() - 43200000).toISOString() }
    ]
  },
  {
    id: "ORD-1002",
    customerName: "Jane Smith",
    email: "jane@example.com",
    date: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "processing",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    totalAmount: 39.99,
    items: [
      { productId: "1", variantId: "1-1", title: "USB-C 65W Fast Charger", quantity: 1, price: 39.99 }
    ],
    timeline: [
      { status: "Order placed", date: new Date(Date.now() - 3600000 * 5).toISOString() },
      { status: "Payment received", date: new Date(Date.now() - 3600000 * 4).toISOString() }
    ]
  }
];

export const MOCK_RETURNS: ReturnRequest[] = [
  {
    id: "RET-5001",
    orderId: "ORD-1001",
    customerName: "John Doe",
    email: "john@example.com",
    reason: "Defective item",
    status: "requested",
    requestedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    refundAmount: 129.99,
    items: [
      { productId: "3", variantId: "3-1", title: "Pro Wireless Earbuds", quantity: 1, price: 129.99 }
    ]
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "COL-001",
    name: "Gaming Essentials",
    description: "Must-have gaming accessories for competitive play",
    productIds: ["5", "6"],
    createdAt: new Date().toISOString()
  },
  {
    id: "COL-002",
    name: "Mobile Power",
    description: "Charging solutions for mobile devices",
    productIds: ["1", "2"],
    createdAt: new Date().toISOString()
  }
];