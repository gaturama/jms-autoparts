import api from './api';
import { Product } from '../types/product.types';

export interface ServerCartItem {
  product: Product;
  quantity: number;
}

export const cartService = {
  async get(): Promise<ServerCartItem[]> {
    const { data } = await api.get('/cart');
    return data.data;
  },

  async add(productId: string, quantity = 1): Promise<void> {
    await api.post('/cart/add', { product: productId, quantity });
  },

  async updateQuantity(itemId: string, quantity: number): Promise<void> {
    await api.put(`/cart/item/${itemId}`, { quantity });
  },

  async removeItem(itemId: string): Promise<void> {
    await api.delete(`/cart/item/${itemId}`);
  },

  async clear(): Promise<void> {
    await api.delete('/cart');
  },
};