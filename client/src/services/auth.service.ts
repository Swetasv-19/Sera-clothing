import { API_BASE_URL, getAuthHeaders, handleResponse } from "./api";
import { AuthResponse, UserProfileResponse } from "../types/user";

export const authService = {
  signup: async (userData: any): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const result = await handleResponse(response);
    if (result.success && result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    }
    return result;
  },

  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await handleResponse(response);
    if (result.success && result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    }
    return result;
  },

  getCurrentUser: async (): Promise<UserProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
