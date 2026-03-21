import api from '@/lib/api';
import { Product } from '@/types/products';

// INTERFACE PRODUCT QUERY
interface ProductQuery {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
}

// PRODUCT RESPONSE INTERFACE
interface ProductResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export const productApi = {
  getProducts: async (query?: ProductQuery): Promise<ProductResponse> => {
    const res = await api.get('/products', {
      params: query,
    });
    return res.data; // CONTAINS DATA + META
  },

  getProductById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  editProduct: async (id: string): Promise<Product> => {
    const res = await api.put(`/products/${id}`);
    return res.data.data;
  },

  deleteProduct: async (id: string): Promise<Product> => {
    const res = await api.delete(`/products/${id}`);
    return res.data.data;
  },
};