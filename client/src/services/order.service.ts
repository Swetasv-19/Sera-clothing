import { API_BASE_URL, getAuthHeaders, handleResponse } from "./api";
import { Order, ApiResponse } from "../types/user";

export const orderService = {
  getOrders: async (page = 1, limit = 10): Promise<ApiResponse<Order[]>> => {
    const response = await fetch(
      `${API_BASE_URL}/api/orders?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
