export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  loyaltyPoints?: number;
  orders?: any[];
  wishlist?: any[];
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
