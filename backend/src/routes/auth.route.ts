import { Router } from 'express';
import { register, login, getMe, updateMe } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, validate(updateProfileSchema), updateMe);

export default router;