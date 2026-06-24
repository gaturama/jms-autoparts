import api from './api';
import { Product, Category, ProductFilters, Review } from '../types/product.types';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const productService = {
  async list(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const { data } = await api.get('/products', { params: filters });
    return { data: data.data, pagination: data.pagination };
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  },

  async getFeatured(): Promise<Product[]> {
    const { data } = await api.get('/products/featured');
    return data.data;
  },

  async search(q: string): Promise<Product[]> {
    const { data } = await api.get('/products/search', { params: { q } });
    return data.data;
  },

  async create(payload: Partial<Product>): Promise<Product> {
    const { data } = await api.post('/products', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Product>): Promise<Product> {
    const { data } = await api.put(`/products/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async getReviews(productId: string): Promise<Review[]> {
    const { data } = await api.get(`/products/${productId}/reviews`);
    return data.data;
  },

  async createReview(
    productId: string,
    payload: { rating: number; comment: string }
  ): Promise<Review> {
    const { data } = await api.post(`/products/${productId}/reviews`, payload);
    return data.data;
  },
};

export const categoryService = {
  async list(): Promise<Category[]> {
    const { data } = await api.get('/categories');
    return data.data;
  },

  async getProducts(slug: string, page = 1): Promise<PaginatedResponse<Product>> {
    const { data } = await api.get(`/categories/${slug}/products`, { params: { page } });
    return { data: data.data, pagination: data.pagination };
  },
};