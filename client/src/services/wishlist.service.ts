import { API_BASE_URL, getAuthHeaders, handleResponse } from "./api";
import { ApiResponse } from "../types/user";

export interface WishlistItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  brand: string;
  inStock: boolean;
  addedAt: string;
}

export interface WishlistResponse extends ApiResponse {
  data: WishlistItem[];
  count?: number;
}

export const wishlistService = {
  getWishlist: async (): Promise<WishlistResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addToWishlist: async (productId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    });
    return handleResponse(response);
  },

  removeFromWishlist: async (productId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  clearWishlist: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  checkWishlistStatus: async (productId: string): Promise<ApiResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/wishlist/check/${productId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  moveWishlistToCart: async (productId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/wishlist/move-to-cart`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    });
    return handleResponse(response);
  },
};
