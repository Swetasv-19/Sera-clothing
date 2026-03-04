import { API_BASE_URL, getAuthHeaders, handleResponse } from "./api";
import { ApiResponse } from "../types/user";

export const wishlistService = {
  getWishlist: async (): Promise<ApiResponse> => {
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
};
