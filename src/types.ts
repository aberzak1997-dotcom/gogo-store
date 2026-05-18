export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  date: string;
  status: "pending" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "unpaid" | "paid" | "refunded" | "partially_refunded";
  fulfillmentStatus: "unfulfilled" | "fulfilled" | "refunded";
  totalAmount: number;
  items: OrderItem[];
  timeline: { status: string; date: string; note?: string }[];
  internalNotes?: string;
  notes?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  reason: string;
  status: "requested" | "approved" | "rejected" | "refunded" | "received";
  requestedAt: string;
  refundAmount: number;
  items: OrderItem[];
}