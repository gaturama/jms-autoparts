import { Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { Product } from '../models/Product.model';
import { Category } from '../models/Category.model';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPagination } from '../utils/pagination';

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { category, brand, minPrice, maxPrice, sort } = req.query;

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    const sortMap: Record<string, object> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      rating: { rating: -1 },
    };
    const sortBy = sortMap[(sort as string)] || { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sortBy).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    ApiResponse.paginated(res, products, total, page, limit);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product || !product.isActive) return next(new AppError('Produto não encontrado', 404));
    ApiResponse.success(res, product);
  } catch (err) {
    next(err);
  }
};

export const getFeatured = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(10)
      .sort({ createdAt: -1 });
    ApiResponse.success(res, products);
  } catch (err) {
    next(err);
  }
};

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string;
    if (!q || q.trim().length < 2) return next(new AppError('Termo de busca muito curto', 400));

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ],
    })
      .populate('category', 'name slug')
      .limit(30);

    ApiResponse.success(res, products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.body.slug || slugify(req.body.name, { lower: true, strict: true });

    const product = await Product.create({ ...req.body, slug });

    await Category.findByIdAndUpdate(req.body.category, { $inc: { productCount: 1 } });

    ApiResponse.created(res, product, 'Produto criado com sucesso');
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return next(new AppError('Produto não encontrado', 404));
    ApiResponse.success(res, product, 'Produto atualizado');
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return next(new AppError('Produto não encontrado', 404));
    ApiResponse.success(res, null, 'Produto removido');
  } catch (err) {
    next(err);
  }
};