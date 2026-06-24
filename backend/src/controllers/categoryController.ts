import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPagination } from '../utils/pagination';

export const listCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    ApiResponse.success(res, categories);
  } catch (err) {
    next(err);
  }
};

export const getCategoryProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return next(new AppError('Categoria não encontrada', 404));

    const [products, total] = await Promise.all([
      Product.find({ category: category._id, isActive: true })
        .populate('category', 'name slug')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Product.countDocuments({ category: category._id, isActive: true }),
    ]);

    ApiResponse.paginated(res, products, total, page, limit);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.create(req.body);
    ApiResponse.created(res, category, 'Categoria criada');
  } catch (err) {
    next(err);
  }
};