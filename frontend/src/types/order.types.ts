import { Address } from './user.types';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  imageKey: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: { product: string; quantity: number }[];
  paymentMethod: string;
  shippingAddress: Address;
  notes?: string;
}