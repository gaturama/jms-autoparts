import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review.model';
import { Product } from '../models/Product.model';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

export const listReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    ApiResponse.success(res, reviews);
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exists = await Review.findOne({ product: req.params.id, user: req.user!.userId });
    if (exists) return next(new AppError('Você já avaliou este produto', 409));

    const review = await Review.create({
      product: req.params.id,
      user: req.user!.userId,
      ...req.body,
    });

    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(req.params.id, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }

    const populated = await review.populate('user', 'name');
    ApiResponse.created(res, populated, 'Avaliação enviada');
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return next(new AppError('Avaliação não encontrada', 404));
    ApiResponse.success(res, null, 'Avaliação removida');
  } catch (err) {
    next(err);
  }
};