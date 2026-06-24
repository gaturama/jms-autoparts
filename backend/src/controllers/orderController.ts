import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order.model';
import { Product } from '../models/Product.model';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, paymentMethod, shippingAddress, notes } = req.body;

    // Busca os produtos e monta os itens com snapshot de preço/nome
    const orderItems = await Promise.all(
      items.map(async (item: { product: string; quantity: number }) => {
        const product = await Product.findById(item.product);
        if (!product || !product.isActive) throw new AppError(`Produto não encontrado: ${item.product}`, 404);
        if (product.stock < item.quantity) throw new AppError(`Estoque insuficiente: ${product.name}`, 400);
        return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          imageKey: product.images[0] || '',
        };
      })
    );

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.user!.userId,
      items: orderItems,
      total,
      paymentMethod,
      shippingAddress,
      notes,
    });

    // Desconta estoque
    await Promise.all(
      items.map((item: { product: string; quantity: number }) =>
        Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
      )
    );

    ApiResponse.created(res, order, 'Pedido criado com sucesso');
  } catch (err) {
    next(err);
  }
};

export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.user!.userId }).sort({ createdAt: -1 });
    ApiResponse.success(res, orders);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!order) return next(new AppError('Pedido não encontrado', 404));
    ApiResponse.success(res, order);
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!order) return next(new AppError('Pedido não encontrado', 404));
    if (!['pending', 'confirmed'].includes(order.status)) {
      return next(new AppError('Pedido não pode ser cancelado neste status', 400));
    }
    order.status = 'cancelled';
    await order.save();
    ApiResponse.success(res, order, 'Pedido cancelado');
  } catch (err) {
    next(err);
  }
};