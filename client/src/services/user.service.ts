import { API_BASE_URL, getAuthHeaders, handleResponse } from "./api";
import { UserProfileResponse, ApiResponse } from "../types/user";

export const userService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
  }): Promise<UserProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updatePassword: async (data: any): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/settings/password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updatePreferences: async (data: any): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/settings/preferences`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteAccount: async (password: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/settings/account`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    });
    return handleResponse(response);
  },
};
