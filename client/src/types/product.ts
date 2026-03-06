export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: "men" | "women" | "unisex" | string;
  subCategory?: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  brand: string;
  isFeatured: boolean;
  isActive: boolean;
  isCustomisable?: boolean;
  customisationPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  isFeatured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  success: boolean;
  count: number;
  total: number;
  pages: number;
  data: Product[];
}
