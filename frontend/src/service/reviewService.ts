import api from './api';
import { Review } from '../types/product.types';

export const reviewService = {
  async getByProduct(productId: string): Promise<Review[]> {
    const { data } = await api.get(`/products/${productId}/reviews`);
    return data.data;
  },

  async create(
    productId: string,
    payload: { rating: number; comment: string }
  ): Promise<Review> {
    const { data } = await api.post(`/products/${productId}/reviews`, payload);
    return data.data;
  },

  async delete(reviewId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  },
};