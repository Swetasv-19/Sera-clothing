import { API_BASE_URL, getAuthHeaders, handleResponse } from "./api";

// Mapping the DB model to the frontend CartItem expected by CartContext
export interface DbCartItem {
  _id: string; // the subdocument ID
  productId: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    discountPrice?: number;
    stock: number;
    isActive: boolean;
    isFeatured: boolean;
  };
  quantity: number;
  variant?: string;
  price: number;
}

export interface DbCart {
  _id: string;
  userId: string;
  items: DbCartItem[];
}

export const cartService = {
  getCart: async (): Promise<DbCart> => {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  addToCart: async (
    productId: string,
    quantity: number,
    variant?: string,
  ): Promise<DbCart> => {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity, variant }),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<DbCart> => {
    const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  removeFromCart: async (itemId: string): Promise<DbCart> => {
    const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  clearCart: async (): Promise<DbCart> => {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },
};
