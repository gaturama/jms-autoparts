import api from './api';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/user.types';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', payload);
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', payload);
    return data.data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  async updateMe(payload: Partial<User>): Promise<User> {
    const { data } = await api.put('/auth/me', payload);
    return data.data;
  },
};