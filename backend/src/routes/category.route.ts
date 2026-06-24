import { Router } from 'express';
import {
  listCategories,
  getCategoryProducts,
  createCategory,
} from '../controllers/categoryController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema } from '../schemas/product.schema';

const router = Router();

router.get('/', listCategories);
router.get('/:slug/products', getCategoryProducts);
router.post('/', authMiddleware, adminMiddleware, validate(createCategorySchema), createCategory);

export default router;