import { Router } from 'express';
import authRoutes from './auth.route';
import productRoutes from './product.route';
import categoryRoutes from './category.route';
import orderRoutes from './order.routes';
import wishlistRoutes from './wishlist.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);

export default router;