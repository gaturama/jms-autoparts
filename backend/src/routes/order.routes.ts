import { Router } from 'express';
import { createOrder, listOrders, getOrder, cancelOrder } from '../controllers/orderController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createOrderSchema } from '../schemas/order.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', listOrders);
router.get('/:id', getOrder);
router.post('/', validate(createOrderSchema), createOrder);
router.put('/:id/cancel', cancelOrder);

export default router;