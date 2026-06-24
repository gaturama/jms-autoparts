import api from './api';
import { Order, CreateOrderPayload } from '../types/order.types';

export const orderService = {
  async list(): Promise<Order[]> {
    const { data } = await api.get('/orders');
    return data.data;
  },

  async getById(id: string): Promise<Order> {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await api.post('/orders', payload);
    return data.data;
  },

  async cancel(id: string): Promise<Order> {
    const { data } = await api.put(`/orders/${id}/cancel`);
    return data.data;
  },
};