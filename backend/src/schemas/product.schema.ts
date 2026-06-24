import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório').trim(),
  slug: z.string().min(2).toLowerCase().optional(),
  description: z.string().min(10, 'Descrição muito curta'),
  price: z.number().min(0, 'Preço inválido'),
  originalPrice: z.number().min(0).optional(),
  category: z.string().min(1, 'Categoria obrigatória'),
  brand: z.string().min(1, 'Marca obrigatória').trim(),
  sku: z.string().min(1, 'SKU obrigatório').toUpperCase(),
  stock: z.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.string()).default({}),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(2).trim(),
  slug: z.string().min(2).toLowerCase(),
  description: z.string().default(''),
  icon: z.string().default('car'),
  isActive: z.boolean().default(true),
});