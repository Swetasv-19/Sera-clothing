import { API_BASE_URL, getAuthHeaders, handleResponse } from "./api";
import { Product, ProductFilters, PaginatedProducts } from "../types/product";

export const productService = {
  getAllProducts: async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(","));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
    return handleResponse(response);
  },

  getProductById: async (id: string): Promise<{ success: boolean; data: Product }> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    return handleResponse(response);
  },

  getFeaturedProducts: async (): Promise<{ success: boolean; data: Product[] }> => {
    const response = await fetch(`${API_BASE_URL}/api/products/featured`);
    return handleResponse(response);
  },

  getProductsByCategory: async (category: string): Promise<{ success: boolean; data: Product[] }> => {
    const response = await fetch(`${API_BASE_URL}/api/products/category/${category}`);
    return handleResponse(response);
  },

  // Admin methods
  createProduct: async (productData: Partial<Product>): Promise<{ success: boolean; data: Product }> => {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<{ success: boolean; data: Product }> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
