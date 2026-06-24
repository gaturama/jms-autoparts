import { Router } from 'express';
import {
  getDashboardStats,
  listAllOrders,
  updateOrderStatus,
} from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateOrderStatusSchema } from '../schemas/order.schema';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', getDashboardStats);
router.get('/orders', listAllOrders);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

export default router;