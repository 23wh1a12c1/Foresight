export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  year: number;
  price: number;
  quantity: number;
  status?: 'IN_STOCK' | 'LOW_STOCK' | 'SOLD_OUT' | 'COMING_SOON';
  description?: string;
  imageUrl?: string;
  horsepower?: number;
  zeroToSixty?: string;
  topSpeed?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchFilters {
  search: string;
  category: string;
  make: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  statusFilter: string; // 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'SOLD_OUT' | 'COMING_SOON' | 'WISHLIST'
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  error?: string;
}
