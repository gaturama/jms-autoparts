import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').trim(),
  email: z.string().email('E-mail inválido').toLowerCase(),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').toLowerCase(),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).trim().optional(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    })
    .optional(),
});