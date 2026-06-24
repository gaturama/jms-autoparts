import api from './api';
import { Product } from '../types/product.types';

export const wishlistService = {
  async get(): Promise<Product[]> {
    const { data } = await api.get('/wishlist');
    return data.data;
  },

  async add(productId: string): Promise<void> {
    await api.post(`/wishlist/${productId}`);
  },

  async remove(productId: string): Promise<void> {
    await api.delete(`/wishlist/${productId}`);
  },
};