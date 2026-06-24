import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, 'Pedido deve ter ao menos 1 item'),
  paymentMethod: z.string().min(1, 'Método de pagamento obrigatório'),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(8),
  }),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});