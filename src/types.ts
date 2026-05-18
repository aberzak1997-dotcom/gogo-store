export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'returning' | 'VIP' | 'blocked';
  notes?: string;
  tags?: string[];
  createdAt: string;
}


export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Add customer status logic
export function calculateCustomerStatus(customer: Customer): 'active' | 'returning' | 'VIP' | 'blocked' {
  if (customer.totalOrders >= 3) return 'VIP';
  if (customer.totalOrders > 1) return 'returning';
  return 'active';
}