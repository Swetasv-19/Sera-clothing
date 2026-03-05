const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data.message ||
      data.error ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return data;
};

export { API_BASE_URL };
