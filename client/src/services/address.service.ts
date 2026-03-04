import { API_BASE_URL, getAuthHeaders, handleResponse } from "./api";
import { Address, ApiResponse } from "../types/user";

export const addressService = {
  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createAddress: async (
    data: Omit<Address, "_id">,
  ): Promise<ApiResponse<Address>> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateAddress: async (
    id: string,
    data: Partial<Address>,
  ): Promise<ApiResponse<Address>> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteAddress: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
