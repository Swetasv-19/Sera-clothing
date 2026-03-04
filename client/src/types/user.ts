export interface Address {
  _id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItem {
  product: any; // We can type this with Product interface later if needed
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  loyaltyPoints?: number;
  orders?: Order[] | string[];
  wishlist?: any[]; // Typically Product IDs or Product objects
  addresses?: Address[];
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  page?: number;
  pages?: number;
  total?: number;
}
