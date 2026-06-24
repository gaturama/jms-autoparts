import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order.model';
import { Product } from '../models/Product.model';
import { User } from '../models/User.model';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenueAgg, recentOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    ]);

    ApiResponse.success(res, {
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue: revenueAgg[0]?.total ?? 0,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};

export const listAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string | undefined;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    ApiResponse.success(res, orders);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return next(new AppError('Pedido não encontrado', 404));
    ApiResponse.success(res, order, 'Status atualizado');
  } catch (err) {
    next(err);
  }
};