import { Request, Response, NextFunction } from 'express';
import { Wishlist } from '../models/Wishlist.model';
import { ApiResponse } from '../utils/ApiResponse';

export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user!.userId }).populate(
      'products',
      'name price images rating brand'
    );
    ApiResponse.success(res, wishlist?.products ?? []);
  } catch (err) {
    next(err);
  }
};

export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user!.userId },
      { $addToSet: { products: req.params.productId } },
      { upsert: true, new: true }
    );
    ApiResponse.success(res, null, 'Adicionado à lista de desejos');
  } catch (err) {
    next(err);
  }
};

export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user!.userId },
      { $pull: { products: req.params.productId } }
    );
    ApiResponse.success(res, null, 'Removido da lista de desejos');
  } catch (err) {
    next(err);
  }
};